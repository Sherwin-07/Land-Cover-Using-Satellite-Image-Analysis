import json
import ast
from PIL import Image # type: ignore
import os

from packages.llm.llm import get_results

def test_pipeline(image_dir, output_json_path):
    try:
        final_result = {}
        for image in os.listdir(image_dir):
            image_path = os.path.join(image_dir, image)
            image = Image.open(image_path)
            status, response = get_results(image)
            
            if status == "Success":
                try:
                    output = ast.literal_eval(response[8:-4].strip())
                    final_result[os.path.basename(image_path)] = output
                except Exception:
                    final_result[os.path.basename(image_path)] = response
            else:
                raise ValueError("Failure in processing the image")
        
        with open(output_json_path, 'w') as file:
            json.dump(final_result, file)
    
    except Exception as e:
        print("An error occurred while processing the image: ", e)

if __name__ == "__main__":
    image_dir = '../data'
    output_json_path = 'output/test_results.json'

    test_pipeline(image_dir, output_json_path)