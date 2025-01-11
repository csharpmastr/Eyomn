import yaml
from pathlib import Path
import base64

# function to load and retrieve system prompts
def load_sys_prompts(file_path: Path):
    
    # load prompts from yaml
    with open(file_path, 'r') as file:
        prompts = yaml.safe_load(file)
    
    print("---SYS PROMPTS LOADED---")
    
    return prompts 

# FUNCTION TO ENCODE IMAGE TO BASE64
def encode_image(image: bytes):
    """Encode the image to base64."""
    try:
        print(f"---ENCODING THE IMAGE---")
        return base64.b64encode(image).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {image} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None