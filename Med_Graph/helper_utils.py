from pathlib import Path
from exception import CustomException
from logger import logging
import sys


# function to download HF model
def download_model(model_dir, model_name: str):
    """
    Downloads a model from the Hugging Face Hub and saves it to a specified directory.
    
    Parameters:
    ----------
    model_dir : Path
        The directory where the model will be downloaded and stored. This should be a 
        Path object from the pathlib module.

    model_name : str
        The name of the model to be downloaded from the Hugging Face Hub.

    Raises:
    ------
    CustomException
        If any error occurs during the directory creation, model download, or moving of 
        the model cache, a CustomException is raised with the original exception details.
    """
    try:
        import os
        from huggingface_hub import snapshot_download  
        from transformers.utils import move_cache 
        
        #
        os.makedirs(model_dir, exist_ok=False)
            
        # log directory creation
        logging.info(f"Path: {model_dir} Created")
        print(f"Path: {model_dir} Created")
        
        snapshot_download(
            model_name,
            local_dir=model_dir,
            ignore_patterns=["*.pt", "*.bin", "consolidated.safetensors"],
            token=os.getenv('INFERENCE_AGENTS_TOKEN'),
        )
                
        # log model download
        logging.info(f"Downloaded {model_name} to {model_dir}")
        print(f"Downloaded {model_name} to {model_dir}")
        
        # move downloaded model to the root directory
        move_cache()
        
        # log model moved to root directory
        logging.info(f"Moved {model_name} to root directory")
        print(f"Moved {model_name} to root directory")
            
    except Exception as e:
        raise CustomException(e, sys)


# FUNCTION TO RETURN THE MODEL'S CONFIG
def get_model_config(engine):
    """
    Retrieves the configuration of a specified model.

    This function checks if there is a currently running asyncio event loop. 
    If the function is called within a context where Ray Serve is being used 
    and an event loop is already running, it retrieves the model configuration 
    using that loop. Otherwise, it creates a new event loop to fetch the model 
    configuration.

    Parameters:
    ----------
    engine : object
        An instance of a model engine that has a method `get_model_config()`, 
        which is expected to return the model's configuration.

    Returns:
    -------
    model_config : dict
        The configuration of the model, returned as a dictionary.

    Raises:
    ------
    CustomException
        If there is an error in retrieving the current event loop or if the 
        `get_model_config()` method fails, a CustomException is raised with 
        the original exception details.
    """
    import asyncio
    
    try:
        event_loop = asyncio.get_running_loop()
    except RuntimeError:
        event_loop = None
        #raise CustomException(e, sys)
    
    if event_loop is not None and event_loop.is_running():
        # IF THE CURRENT IS INSTANCED BY RAY SERVE,
        # THERE IS ALREADY A RUNNING EVENT LOOP
        model_config = event_loop.run_until_complete(engine.get_model_config())
    else:
        # WHEN USING SINGLE VLLM WITHOUT engine_use_ray
        model_config = asyncio.run(engine.get_model_config())
    
    return model_config