#raster_image_analysis.py
import numpy as np # type: ignore
import rasterio # type: ignore
import matplotlib.pyplot as plt # type: ignore
import pandas as pd # type: ignore
from sklearn.ensemble import RandomForestClassifier # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from sklearn.metrics import classification_report # type: ignore
from sklearn.preprocessing import StandardScaler, LabelEncoder # type: ignore

# Step 1: Load the Satellite Image
def load_image(file_path):
    with rasterio.open(file_path) as src:
        image = src.read()  # Read the image as a NumPy array (bands, height, width)
        transform = src.transform  # Get transform metadata for geolocation
    return image, transform

file_path = "../data/E06_OCM_GAC_08JAN2025_008064816062_11194_STGOVFHND_58_14_F.tiff"
image, transform = load_image(file_path)

# Step 2: Compute NDVI
def compute_ndvi(nir_band, red_band):
    ndvi = (nir_band - red_band) / (nir_band + red_band + 1e-10)
    return ndvi

# Assuming Band 4 = Red and Band 5 = NIR
red_band = image[0]
green_band = image[1]
ndvi = (green_band - red_band) / (green_band + red_band + 1e-10)

# Step 3: Prepare Data
def prepare_data(image, ndvi):
    bands_data = image.reshape(image.shape[0], -1).T  # (pixels, bands)
    ndvi_flat = ndvi.flatten()[:, np.newaxis]  # (pixels, 1)
    data = np.hstack((bands_data, ndvi_flat))
    return data

X = prepare_data(image, ndvi)
labels = np.random.choice(["high", "medium", "low"], size=X.shape[0], p=[0.3, 0.5, 0.2])
encoder = LabelEncoder()
y = encoder.fit_transform(labels)

# Step 4: Train-Test Split & Model Training
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Step 5: Predict Fertility
def predict_image(image, ndvi, model, scaler):
    X_all = prepare_data(image, ndvi)
    X_all_scaled = scaler.transform(X_all)
    predictions = model.predict(X_all_scaled)
    return predictions.reshape(image.shape[1], image.shape[2])

predicted_fertility = predict_image(image, ndvi, model, scaler)

# Step 6: Convert Predictions to Structured Data
def create_dataframe(predictions, transform):
    height, width = predictions.shape
    rows, cols = np.meshgrid(np.arange(height), np.arange(width), indexing='ij')
    longitudes, latitudes = rasterio.transform.xy(transform, rows, cols)
    df = pd.DataFrame({
        "Latitude": np.array(latitudes).flatten(),
        "Longitude": np.array(longitudes).flatten(),
        "Fertility": predictions.flatten()
    })
    return df

fertility_df = create_dataframe(predicted_fertility, transform)

# Save to CSV
fertility_df.to_csv("../results/fertility_predictions.csv", index=False)

# Step 7: Visualize Fertility Map
plt.imshow(predicted_fertility, cmap='viridis')
plt.title("Predicted Fertility")
plt.colorbar()
plt.show()

plt.imsave("../results/fertility_map.png", predicted_fertility, cmap='viridis')
print("Fertility map saved as 'fertility_map.png'")

print("Fertility data saved as 'fertility_predictions.csv'")