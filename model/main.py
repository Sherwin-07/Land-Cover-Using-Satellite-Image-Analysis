#main.py
from PIL import Image # type: ignore
import json
import ast

from packages.llm.llm import get_results

def test_llm():
    """
    Test the Gemini 1.5 LLM by sending a test image, parsing the response, and
    saving the parsed output to a JSON file.

    :return: None
    """
    print("Starting the LLM test process.")
    
    results_path = "../results/results.json"
    test_image_path = "../data/vegetation_factor.jpg"
    print(f"Loading the test image from: {test_image_path}")
    test_image = Image.open(test_image_path)
    
    print("Sending the test image to the LLM for processing...")
    status, response = get_results(test_image)
    
    if status == "Success":
        print("Response received successfully from the LLM.")
        print("Parsing the response...")
        output = ast.literal_eval(response[8:-4])
        
        print(f"Saving the parsed output to: {results_path}")
        with open(results_path, 'w') as file:
            json.dump(output, file)
        
        print("Output saved successfully.")
    else:
        print("An error occurred while processing the image.")
        print("Error:", response)
        
    print("LLM test process completed.")

test_llm()