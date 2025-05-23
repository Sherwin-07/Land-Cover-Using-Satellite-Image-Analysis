from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import json
import os

from integrated_analysis import IntegratedAnalysis

app = Flask(__name__)
CORS(app)

# Initialize analyzer once at server startup
analyzer = IntegratedAnalysis()

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    """
    Analyze an image using ML, DL, and LLM approaches and return integrated results.
    
    This endpoint expects a POST request with a form containing a single
    field, `image`, which is the image to be analyzed.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    try:
        image_file = request.files['image']
        original_filename = image_file.filename
        
        # Create an 'uploads' directory in the project if it doesn't exist
        temp_dir = os.path.join(os.getcwd(), 'uploads')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Construct a safe path for the uploaded image
        temp_path = os.path.join(temp_dir, original_filename) if original_filename else os.path.join(temp_dir, 'temp_image.tiff')
        
        # Save the uploaded image
        image_file.save(temp_path)
        
        # Perform integrated analysis
        results = analyzer.analyze_image(temp_path)
        
        if 'error' in results:
            return jsonify({'status': 'Failure', 'response': results['error']}), 500
        
        # Ensure llm_analysis has all required nested properties
        if 'llm_analysis' in results:
            if not results['llm_analysis'].get('result'):
                results['llm_analysis']['result'] = {}
            
            if not results['llm_analysis']['result'].get('regions'):
                results['llm_analysis']['result']['regions'] = {}
                
            if not results['llm_analysis']['result'].get('suggestions'):
                results['llm_analysis']['result']['suggestions'] = {
                    'best_crops': [],
                    'mixed_crop_farming': 'Not available'
                }
        
        return jsonify({'status': 'Success', 'response': results}), 200
    
    except Exception as e:
        return jsonify({'status': 'Failure', 'response': str(e)}), 500

@app.route('/land_use_classification', methods=['POST'])
def land_use_classification():
    """
    Perform only land use classification using the DL model.
    
    This endpoint expects a POST request with a form containing a single
    field, `image`, which is the image to be classified.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    try:
        image_file = request.files['image']
        
        # Open the image directly from the request
        img = Image.open(image_file)
        
        # Perform DL land use classification
        dl_results = analyzer.predict_land_use_dl(img)
        
        if 'error' in dl_results:
            return jsonify({'status': 'Failure', 'response': dl_results['error']}), 500
        
        return jsonify({'status': 'Success', 'response': dl_results}), 200
    
    except Exception as e:
        return jsonify({'status': 'Failure', 'response': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)