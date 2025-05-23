import numpy as np # type: ignore
from PIL import Image # type: ignore
import rasterio # type: ignore
import matplotlib.pyplot as plt # type: ignore
import pandas as pd # type: ignore
import json
from sklearn.ensemble import RandomForestClassifier # type: ignore
from sklearn.preprocessing import StandardScaler, LabelEncoder # type: ignore
from typing import Dict, Tuple, Any, Optional, List
import os
import tensorflow as tf # type: ignore

from packages.llm.llm import get_results

class IntegratedAnalysis:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.encoder = LabelEncoder()
        
        # Load the DL model for land use classification
        try:
            self.dl_model = tf.keras.models.load_model('model_30_epoch.h5')
            self.class_labels = ['AnnualCrop', 'Forest', 'HerbaceousVegetation', 
                                'Highway', 'Industrial', 'Pasture', 'PermanentCrop', 
                                'Residential', 'River', 'SeaLake']
            print("DL model loaded successfully")
        except Exception as e:
            print(f"Warning: Could not load DL model: {e}")
            self.dl_model = None
        
    def load_and_prepare_image(self, file_path: str) -> Tuple[np.ndarray, rasterio.transform.Affine]:
        """Load and prepare the satellite image for analysis."""
        with rasterio.open(file_path) as src:
            image = src.read()
            # Create a default transform if none exists
            if src.transform.is_identity:
                transform = rasterio.transform.from_bounds(
                    0, 0, image.shape[2], image.shape[1],
                    image.shape[2], image.shape[1]
                )
            else:
                transform = src.transform
        return image, transform
    
    def compute_ndvi(self, image: np.ndarray) -> np.ndarray:
        """Compute the Normalized Difference Vegetation Index."""
        red_band = image[0]
        green_band = image[1]  # Using green band as NIR substitute
        ndvi = (green_band - red_band) / (green_band + red_band + 1e-10)
        return ndvi
    
    def prepare_ml_data(self, image: np.ndarray, ndvi: np.ndarray) -> np.ndarray:
        """Prepare data for machine learning analysis."""
        bands_data = image.reshape(image.shape[0], -1).T
        ndvi_flat = ndvi.flatten()[:, np.newaxis]
        return np.hstack((bands_data, ndvi_flat))
    
    def train_model(self, X: np.ndarray) -> None:
        """Train the Random Forest model with synthetic labels."""
        # Generate synthetic labels for training
        labels = np.random.choice(["high", "medium", "low"], 
                                size=X.shape[0], 
                                p=[0.3, 0.5, 0.2])
        y = self.encoder.fit_transform(labels)
        
        # Scale features and train model
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
    
    def predict_fertility_ml(self, X: np.ndarray) -> np.ndarray:
        """Predict fertility using the ML model."""
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def predict_land_use_dl(self, pil_image: Image.Image) -> Dict[str, Any]:
        """Perform land use classification using the DL model."""
        if self.dl_model is None:
            return {"error": "DL model not loaded"}
        
        try:
            # Preprocess image for DL model
            img = pil_image.resize((64, 64))  # Adjust size based on your model's input requirements
            img_array = np.array(img) / 255.0  # Normalize
            
            # Add batch dimension if needed
            if len(img_array.shape) == 3:  # H, W, C
                img_array = np.expand_dims(img_array, axis=0)
            
            # Get predictions
            predictions = self.dl_model.predict(img_array)
            predicted_class_idx = np.argmax(predictions[0])
            predicted_class = self.class_labels[predicted_class_idx]
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get top 3 classes
            top_indices = np.argsort(predictions[0])[-3:][::-1]
            top_classes = [
                {
                    "class": self.class_labels[idx],
                    "confidence": float(predictions[0][idx])
                } 
                for idx in top_indices
            ]
            
            return {
                "land_use_class": predicted_class,
                "confidence": confidence,
                "top_classes": top_classes
            }
            
        except Exception as e:
            print(f"Error in DL prediction: {e}")
            return {"error": str(e)}
    
    def get_llm_analysis(self, image: Image.Image, image_path: str) -> Dict[str, Any]:
        """Get fertility analysis from LLM."""
        status, response = get_results(image, image_path)
        if status == "Success":
            try:
                # Parse LLM response - response is now already in JSON string format
                output = json.loads(response)
                return output
            except Exception as e:
                print(f"Error parsing LLM response: {e}")
                return {}
        return {}
    
    def create_integrated_results(self, 
                                ml_predictions: np.ndarray, 
                                llm_results: Dict[str, Any],
                                dl_results: Dict[str, Any],
                                transform: rasterio.transform.Affine,
                                original_shape: Tuple[int, int]) -> Dict[str, Any]:
        """Combine ML, DL and LLM results into a comprehensive analysis."""
        # Reshape ML predictions to original image shape
        fertility_map = ml_predictions.reshape(original_shape)
        
        # Create coordinates for the predictions
        height, width = original_shape
        rows, cols = np.meshgrid(np.arange(height), np.arange(width), indexing='ij')
        longitudes, latitudes = rasterio.transform.xy(transform, rows, cols)
        
        # Create integrated results dictionary
        integrated_results = {
            "ml_analysis": {
                "fertility_map": fertility_map.tolist(),
                "coordinates": {
                    "longitudes": np.array(longitudes).tolist(),
                    "latitudes": np.array(latitudes).tolist()
                }
            },
            "llm_analysis": llm_results,
            "dl_analysis": dl_results,
            "combined_metrics": {
                "fertility_confidence": self._calculate_fertility_confidence(
                    ml_predictions, 
                    llm_results.get("result", {}).get("overall_fertility", "medium")
                ),
                "land_use_relevance": self._calculate_land_use_relevance(
                    dl_results.get("land_use_class", "Unknown"),
                    dl_results.get("confidence", 0.0)
                )
            }
        }
        
        return integrated_results
    
    def _calculate_fertility_confidence(self, 
                                     ml_predictions: np.ndarray, 
                                     llm_fertility: str) -> float:
        """Calculate confidence score based on ML and LLM agreement."""
        ml_fertility_counts = pd.Series(ml_predictions).value_counts(normalize=True)
        
        # Convert LLM fertility to index
        llm_idx = self.encoder.transform([llm_fertility.lower()])[0]
        
        # Calculate confidence based on agreement between ML and LLM
        confidence = ml_fertility_counts.get(llm_idx, 0.0)
        return float(confidence)
    
    def _calculate_land_use_relevance(self, land_use_class: str, confidence: float) -> float:
        """Calculate relevance score for the land use classification."""
        # Assign weights to different land use classes based on relevance to fertility
        relevance_weights = {
            'AnnualCrop': 0.9,
            'PermanentCrop': 0.9,
            'Pasture': 0.8,
            'HerbaceousVegetation': 0.7,
            'Forest': 0.6,
            'River': 0.5,
            'SeaLake': 0.4,
            'Residential': 0.3,
            'Industrial': 0.2,
            'Highway': 0.1
        }
        
        # Calculate weighted relevance
        weight = relevance_weights.get(land_use_class, 0.5)
        relevance = weight * confidence
        
        return float(relevance)
    
    def analyze_image(self, file_path: str) -> Dict[str, Any]:
        """Perform integrated analysis on a satellite image."""
        try:
            # Load and prepare image for ML analysis
            image_array, transform = self.load_and_prepare_image(file_path)
            ndvi = self.compute_ndvi(image_array)
            X = self.prepare_ml_data(image_array, ndvi)
            
            # Train and predict with ML model
            self.train_model(X)
            ml_predictions = self.predict_fertility_ml(X)
            
            # Load image for DL and LLM analysis
            pil_image = Image.open(file_path)
            
            # Get DL land use classification
            dl_results = self.predict_land_use_dl(pil_image)
            
            # Get LLM analysis with original filename for location lookup
            original_filename = os.path.basename(file_path)
            llm_results = self.get_llm_analysis(pil_image, original_filename)
            
            # Combine results
            original_shape = (image_array.shape[1], image_array.shape[2])
            integrated_results = self.create_integrated_results(
                ml_predictions,
                llm_results,
                dl_results,
                transform,
                original_shape
            )
            
            return integrated_results
            
        except Exception as e:
            print(f"Error in integrated analysis: {e}")
            return {"error": str(e)}

    def save_results(self, results: Dict[str, Any], output_path: str) -> None:
        """Save integrated analysis results to file."""
        try:
            with open(output_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"Results saved to {output_path}")
            
            # Save fertility map visualization
            if "ml_analysis" in results:
                fertility_map = np.array(results["ml_analysis"]["fertility_map"])
                plt.figure(figsize=(10, 10))
                plt.imshow(fertility_map, cmap='viridis')
                plt.title("Integrated Fertility Analysis")
                plt.colorbar(label="Fertility Level")
                plt.savefig(output_path.replace('.json', '_map.png'))
                plt.close()
                
        except Exception as e:
            print(f"Error saving results: {e}")

if __name__ == "__main__":
    # Example usage
    analyzer = IntegratedAnalysis()
    
    # Analyze a sample image
    image_path = "../data/E06_OCM_GAC_08JAN2025_008064816062_11194_STGOVFHND_58_14_F.tiff"
    results = analyzer.analyze_image(image_path)
    
    # Save results
    analyzer.save_results(results, "../results/integrated_analysis.json")