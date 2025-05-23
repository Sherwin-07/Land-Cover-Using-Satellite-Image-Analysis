import requests # type: ignore
import base64
import os
import re
import json
from PIL import Image # type: ignore
from io import BytesIO
from packages.config.config import Config
from packages.config.metadata import MetadataManager

metadata_manager = MetadataManager()

def extract_json_from_text(text: str) -> dict:
    """Extract JSON object from text that might contain additional content."""
    try:
        # Find JSON pattern between triple backticks
        json_match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
            return json.loads(json_str)
        
        # If no backticks, try to find JSON object directly
        json_match = re.search(r'(\{.*\})', text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
            return json.loads(json_str)
            
        raise ValueError("No JSON object found in response")
        
    except Exception as e:
        print(f"Error extracting JSON: {e}")
        print("Raw text:", text)
        return {}

def get_results(image: Image.Image, image_path: str = None) -> tuple[str, str]:
    """
    Send an image to the Gemini 1.5 LLM for analysis using direct API calls.
    
    :param image: The image to be sent to the LLM for analysis
    :type image: PIL.Image.Image
    :param image_path: Optional path of the image for metadata lookup
    :type image_path: str
    :return: A tuple containing the status of the request and the response
    :rtype: tuple[str, str]
    """
    print("Starting the image analysis process...")
    
    if not isinstance(image, Image.Image):
        print("Error: The provided input is not a valid image.")
        return "Failure", "Invalid image type"
    
    # Get location from metadata if image_path is provided
    location = None
    if image_path:
        location = metadata_manager.get_location(image_path)
        print(f"Found location from metadata: {location}")
    
    print("Image validation successful. Sending image to the LLM for processing...")
    
    try:
        # Convert image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Config.API_KEY}"
        
        payload = {
            "contents": [{
                "parts": [
                    {"text": Config.get_prompt(location)},
                    {"inline_data": {
                        "mime_type": "image/png",
                        "data": img_str
                    }}
                ]
            }]
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        if "candidates" in result and len(result["candidates"]) > 0:
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            # Parse JSON from the response text
            json_data = extract_json_from_text(text)
            if json_data:
                return "Success", json.dumps(json_data)
            return "Failure", "Could not parse JSON from response"
        
        return "Failure", "No response generated"
    
    except Exception as e:
        print("An error occurred while communicating with the LLM.")
        print(f"Error details: {str(e)}")
        return "Failure", str(e)