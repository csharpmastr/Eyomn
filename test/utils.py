import time
import json
from mistralai import Mistral
from mistralai.models.systemmessage import SystemMessage
from mistralai.models.usermessage import UserMessage
from pydantic import BaseModel, ValidationError, ConfigDict
from typing import Type, Optional
from typing_extensions import Literal, Tuple
from pydantic import Field
import os
import base64
from pathlib import Path
import yaml
from dotenv import load_dotenv
import pytesseract
import cv2
import matplotlib.pyplot as plt
load_dotenv()

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files (x86)/Tesseract OCR/tesseract.exe'

# DEFINE GLOBAL VARIABLES TO USE
sys_prompts_file_path = Path("sys_prompts.yaml")
sys_prompts = None
retry = None

class MistralAgentLanguageModel:
    def __init__(self, api_key=os.getenv("MISTRAL_API_KEY"),
                 model="pixtral-large-latest", temperature=0):

        if api_key is None:
            raise ValueError("The Mistral API KEY must be provided either as "
                             "an argument or as an environment variable named 'MISTRAL_API_KEY'") # noqa

        self.api_key = api_key
        self.model = model
        self.temperature = temperature
        self.client = Mistral(api_key=self.api_key)

    def validate_and_extract_chain(self, prompt: str,
                 image_input: str,
                 max_tokens: int = None,
                 max_retries: int = 3):

        retry_delay = 0.1
        global retry
        if retry is None:
            retry = 0

        while retry < max_retries:
            try:
                guard_response, guard_data_model = self._guard_agent(prompt, image_input, max_tokens)
                print(f"\n\n---GUARD RESPONSE: {guard_response}\n\n---")
                
                if guard_response.startswith('```json'):
                    guard_response = guard_response.strip('```json').strip('```').strip('`')
                            
                if self._is_valid_json_for_model(guard_response, guard_data_model):
                    print("---RESPONSE IS VALID JSON---")
                    
                    guard_response = json.loads(guard_response)
                    guard_data_model = guard_data_model(**guard_response)
                    
                    # CHECK IF THE IMAGE IS A VALID ID
                    if guard_data_model.classification == "VALID ID":
                        print("---IMAGE IS A VALID ID---")
                        
                        # EXTRACT DATA FROM THE VALID ID
                        extraction_response, extraction_data_model = self._data_extraction_agent(image_input, max_tokens)
                        
                        # CLEAN THE EXTRACTION RESPONSE
                        if extraction_response.startswith('```json'):
                            extraction_response = extraction_response.strip('```json').strip('```').strip('`')
                                                                       
                        # CHECK IF THE RESPONSE IS A VALID JSON
                        if self._is_valid_json_for_model(extraction_response, extraction_data_model):
                            print("---RESPONSE IS VALID JSON---")
                            
                            # LOAD THE EXTRACTION RESPONSE
                            extraction_response = json.loads(extraction_response)
                            extraction_data_model = extraction_data_model(**extraction_response)
                            return extraction_data_model
                        print("---RESPONSE IS NOT VALID JSON---")
                        return None   
                    print("---IMAGE IS NOT A VALID ID---")
                    return None  
                else:
                    print("---RESPONSE IS NOT VALID JSON---")
                    return None
                    
            except Exception as e:
                print(f"Hit rate limit. Retrying in {retry_delay} seconds.")
                time.sleep(retry_delay)
                retry_delay *= 2
                retry += 1
                if retry >= max_retries:
                    raise e
              
    def _guard_agent(self, prompt: str, image: str, max_tokens: int = None) -> Tuple[str, Type[BaseModel]]:
        
        class AgentGuardOutput(BaseModel):
            "Classification of the given image to be either a VALID ID  or INVALID ID"
            classification: Literal["VALID ID", "INVALID ID"] = Field(description="Given an image, analyze it and classify whether it is a VALID ID  or INVALID ID.")
            reasoning: Optional[str] = Field(default=None, description="Reasoning behind the classification.")

        # CHECK IF SYSTEM PROMPTS ARE LOADED
        global sys_prompts
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(sys_prompts_file_path)
        
        agent_guard_system_message = sys_prompts['agent_guard_system_message'] + f"\n  - Respond in a JSON format that contains the following keys: {self._model_structure_repr(AgentGuardOutput)}."

        agent_guard_messages = [
            SystemMessage(role="system", content=agent_guard_system_message),
            UserMessage(role="user", content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image}" }
            ])
        ]
                
        params = {
            "model": self.model,
            "messages": agent_guard_messages,
            "temperature": self.temperature
        }

        if max_tokens is not None:
            print("---MAX TOKENS ADDED IN PARAMS---")
            params["max_tokens"] = max_tokens
            
        print(f"---TIME TO GENERATE RESPONSE FROM AN AGENT GUARD---")
        
        # GENERATE RESPONSE FROM AN AGENT GUARD
        response = self.client.chat.complete(**params)
        return (response.choices[0].message.content, AgentGuardOutput)
    
    def _data_extraction_agent(self, image:str, max_tokens:int=None) -> Tuple[str, Type[BaseModel]]:
        class DataExtractionOutput(BaseModel):
            "Extracted data from the given image of an identification card."
            name: str = Field(description="Name of the person on the ID.")
            date_of_birth: str = Field(description="Date of birth of the person on the ID.")
            id_number: str = Field(description="Identification number on the ID.")
            address: str = Field(description="Address of the person on the ID.")
            expiry_date: Optional[str] = Field(default=None, description="Expiry date of the ID.")
            issue_date: Optional[str] = Field(default=None, description="Issue date of the ID.")
        
        prompt = "Here's the image of the ID Card: \n"
        # CHECK IF SYSTEM PROMPTS ARE LOADED
        global sys_prompts
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(sys_prompts_file_path)
        
        agent_extraction_system_message = sys_prompts['agent_data_extraction_system_message'] + f"\n  - Respond in a JSON format that contains the following keys: {self._model_structure_repr(DataExtractionOutput)}."
        
        agent_extraction_messages = [
            SystemMessage(role="system", content=agent_extraction_system_message),
            UserMessage(role="user", content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image}" }
            ])
        ]
        
        params = {
            "model": self.model,
            "messages": agent_extraction_messages,
            "temperature": self.temperature
        }
        
        if max_tokens is not None:
            params["max_tokens"] = max_tokens
            
        print(f"---TIME TO EXTRACT DATA WITH DATA EXTRACTION AGENT---")
        
        # GENERATE RESPONSE FROM AN AGENT GUARD
        response = self.client.chat.complete(**params)
        return (response.choices[0].message.content, DataExtractionOutput)
        
    def _model_structure_repr(self, model: Type[BaseModel]) -> str:
        fields = model.__annotations__
        return ', '.join(f'{key}: {value}' for key, value in fields.items())


    def _is_valid_json_for_model(self, text: str, model: Type[BaseModel]) -> bool:
        """
        Check if a text is valid JSON and if it respects the provided BaseModel.
        Returns True if text is valid JSON and matches model, False otherwise.
        """
        # Set strict validation mode
        model.model_config = ConfigDict(strict=True)
        
        try:
            # First check if text is valid JSON
            parsed_data = json.loads(text)
            
            # Then validate against the model
            model.model_validate(parsed_data)
            return True
            
        except json.JSONDecodeError:
            print("Invalid JSON format")
            return False
        except ValidationError as e:
            print(f"Validation error: {e}")
            return False
        except Exception as e:
            print(f"Unexpected error: {e}")
            return False

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

def extract_text_from_image(image_path: Path) -> str:
    """Extract text from image using tesseract OCR with OpenCV preprocessing."""
    try:
        # Read image using cv2
        image = cv2.imread(str(image_path))
        if image is None:
            raise FileNotFoundError("Could not load image")
            
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding
        #_, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Apply slight gaussian blur to reduce noise
        preprocessed = cv2.GaussianBlur(gray, (3,3), 0)

        # Display images for debugging
        fig, axes = plt.subplots(3, 1, figsize=(10, 10))
        axes[0].imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        axes[0].set_title('Original')
        axes[1].imshow(gray, cmap='gray')
        axes[1].set_title('Grayscale')
        #axes[1].imshow(thresh, cmap='gray')
        #axes[1].set_title('Threshold')
        axes[2].imshow(preprocessed, cmap='gray')
        axes[2].set_title('Grayscale + Noise Reduction')
        plt.tight_layout()
        plt.show()
        
        # Extract text using pytesseract on preprocessed image
        text = pytesseract.image_to_string(image)
        
        return text.strip()
        
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return ""
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""


# function to load and retrieve system prompts
def load_sys_prompts(file_path: Path):
    
    # load prompts from yaml
    with open(file_path, 'r') as file:
        prompts = yaml.safe_load(file)
    
    print("---SYS PROMPTS LOADED---")
    
    return prompts

# if __name__ == "__main__":
#     # Load the image
#     image = encode_image(Path("test\postal_id_resized.png"))
#     # image_path = Path("test/postal_id_resized.png")
#     # if not image_path.exists():
#     #     print(f"Error: The file {image_path} was not found.")
#     # else:
#     #     texts = extract_text_from_image(image_path)
#     #     print(f"Extracted Text: \n{texts}")
#     #print(f"Extracted Text: {texts}")
#     agent = MistralAgentLanguageModel()
#     prompt = f"Here is the Image to Analyze: \n"
#     response = agent.validate_and_extract_chain(prompt=prompt, image_input=image, max_retries=2)
#     print(f"Final Response: {response}\n\nType: {type(response)}")