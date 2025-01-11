from mistralai import Mistral
from mistralai.models.systemmessage import SystemMessage
from mistralai.models.usermessage import UserMessage
import os, json, time
from pydantic import BaseModel, ConfigDict, ValidationError
from typing_extensions import Tuple, Type
from utils import load_sys_prompts
from pathlib import Path
from data_models import AgentDataExtractionOutput, AgentGuardOutput

# DEFINE GLOBAL VARIABLES
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
                    
        # GENERATE RESPONSE FROM AN AGENT GUARD
        response = self.client.chat.complete(**params)
        print(f"---IMAGE VALIDATED BY AGENT GUARD---")
        return (response.choices[0].message.content, AgentGuardOutput)
    
    def _data_extraction_agent(self, image:str, max_tokens:int=None) -> Tuple[str, Type[BaseModel]]:
       
        prompt = "Here's the image of the ID Card: \n"
        # CHECK IF SYSTEM PROMPTS ARE LOADED
        global sys_prompts
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(sys_prompts_file_path)
        
        agent_extraction_system_message = sys_prompts['agent_data_extraction_system_message'] + f"\n  - Respond in a JSON format that contains the following keys: {self._model_structure_repr(AgentDataExtractionOutput)}."
        
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
        return (response.choices[0].message.content, AgentDataExtractionOutput)
        
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
