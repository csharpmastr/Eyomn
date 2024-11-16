import modal
from MedTeam_Graph.agent_flow import construct_graph

import os
from pathlib import Path
from logger import logging
from exception import CustomException
import sys
from fastapi import FastAPI, HTTPException
from langchain_core.messages import HumanMessage
#from langgraph.graph.state import CompiledStateGraph

MINUTES = 60

# define container image
image = (
    modal.Image.debian_slim()
    .pip_install(
    "langgraph==0.2.36", "langchain==0.3.1", "langchain-huggingface==0.1.1", "langsmith==0.1.133",
    "huggingface_hub==0.25.2", "hf-transfer==0.1.5", "transformers>=4.39.0", "accelerate==0.29.2",
    "torch>=2.4.1", "uvicorn==0.30.2", "pydantic==2.9.0", "fastapi==0.114.2", "pandas==2.2.1"
    )
    # .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    # .run_function(
    #     download_models_to_volume,
    #     secrets=[
    #         modal.Secret.from_name(
    #             "HUGGINGFACE-TOKEN", required_keys=["HF_TOKEN"]
    #         )
    #     ],
    #     timeout= 60 * 20
    # )
)

# define the modal app
app = modal.App(
    name="eyomnai-gpu-inference",
    image=image,
    secrets=[
        modal.Secret.from_name("HUGGINGFACE-TOKEN"),
        modal.Secret.from_name("my-langsmith-secret")
    ]
)

# instantiate fastapi
#web_app = FastAPI()

# Define modal volume for persistent storage
vol = modal.Volume.from_name("model-weights-vol", create_if_missing=True)

# Model paths
model_weight_paths = {
    "supervisor": Path("/model_weights/supervisor_model"),
    "assistant": Path("/model_weights/assistant_model"),
    "ophthalmologist": Path("/model_weights/ophthal_model")
}

#@app.function(volumes={"/model_weights": vol})
def download_models_to_volume():
    try:
        from huggingface_hub import snapshot_download
    
        models = {
            "supervisor": "meta-llama/Llama-3.1-8B-Instruct",
            "assistant": "meta-llama/Llama-3.2-3B-Instruct",
            "ophthalmologist": "aaditya/Llama3-OpenBioLLM-8B"
        }
        
        for model_name, model_id in models.items():
            model_path = model_weight_paths[model_name]
            print(f"{model_path}")
            
            if not model_path.exists():
                os.makedirs(model_path, exist_ok=True)
                print(f"Path: {model_path} Created")
                snapshot_download(model_id, local_dir=str(model_path), ignore_patterns=["*.pt", "*.gguf"], token=os.getenv('HF_TOKEN'))
                #vol.commit()
                print(f"Downloaded {model_name} to {model_path}")
                logging.info("Downloaded {model_name} to {model_path}")
            else:
                print(f"{model_name} model already downloaded and cached.")
                logging.info(f"{model_name} model already downloaded and cached.")
    except Exception as e:
        raise CustomException(e, sys)

@app.cls(gpu="A10G", volumes={"/model_weights": vol}, container_idle_timeout=10 * MINUTES, timeout=15 * MINUTES, retries=3)
class LangGraphAgentFlow:
    def __init__(self):
        # Initialize variables to hold model pipelines
        self.supervisor_pipeline = None
        self.assistant_pipeline = None
        self.ophthal_pipeline = None
    
    @modal.build()
    def download_models(self):
        """
        Download the required models to the persistent volume.
        """
        download_models_to_volume()
        vol.commit()

    # @modal.method()
    def load_model(self, model_name, model_path):
        """
        Load a model pipeline from the specified path with GPU support.

        Parameters:
        model_name (str): The name of the model.
        model_path (str): The path to the model directory.
        task (str): The task for the model (default is "text-generation").

        Returns:
        HuggingFacePipeline: The loaded model pipeline.
        """
        from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
        from langchain_huggingface import HuggingFacePipeline
        
        logging.info(f"Loading {model_name} model from {model_path}...")
        tokenizer = AutoTokenizer.from_pretrained(model_path, add_eos_token=True, add_bos_token=True)
        model = AutoModelForCausalLM.from_pretrained(model_path, device_map="auto", low_cpu_mem_usage=True)
        
        # Create a transformers pipeline with the loaded model and tokenizer
        hf_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer, device_map="auto")
        print(f"{model_name} Successfully Loaded from Volume")
        logging.info(f"{model_name} Successfully Loaded from Volume")
        return HuggingFacePipeline(pipeline=hf_pipeline)
    
    @modal.enter()
    def load_all_models(self):
        """
        Load all LLMs into their respective pipelines.
        """
        if not (self.supervisor_pipeline and self.assistant_pipeline and self.ophthal_pipeline):
            self.supervisor_pipeline = self.load_model("Supervisor", model_weight_paths["supervisor"])
            self.assistant_pipeline = self.load_model("Assistant", model_weight_paths["assistant"])
            self.ophthal_pipeline = self.load_model("Ophthalmologist", model_weight_paths["ophthalmologist"])
            logging.info(f"All models loaded successfully.")

    @modal.method()
    def run_inference(self, input_data):
        """
        Run inference using the compiled LangGraph.

        Parameters:
        input_data (dict): The input data for inference.

        Returns:
        list: The inference results.
        """
        graph = construct_graph(assistant_pipeline=self.assistant_pipeline,
                                supervisor_pipeline=self.supervisor_pipeline,
                                ophthal_pipeline=self.ophthal_pipeline)
        result = graph.invoke(input_data, config={"recursion_limit": 50})
        logging.info(f"Inference completed.")
        return result["messages"]

# sample data
sample_data = {
        "messages": [
        HumanMessage(content="""
Patient Information:
    Name: John Doe
    Date of Birth: 01/01/1970
    Age: 54
    Gender: Male
    Address: 123 Main Street, Anytown, CA 12345
    Phone Number: (123) 456-7890
    Email: johndoe@email.com
    Insurance Provider: Acme Health Insurance
    Insurance Policy Number: 1234567890

Medical History:
    Chief Complaint: Blurry vision, especially at night
    History of Present Illness: Gradual onset of blurry vision over the past 6 months. Worsens in low light conditions.
    Past Medical History:
        Hypertension
        High cholesterol
        No known allergies
    Family History:
        Father: Glaucoma
        Mother: Cataracts
    Medications:
        Lisinopril 20mg daily
        Atorvastatin 40mg daily

Ocular History:
    Previous Eye Surgery: None
    Eye Trauma: None
    Eye Infections: Occasional pink eye
    Glasses or Contact Lenses: Wears glasses for distance vision

Ocular Examination:
    Visual Acuity:
        Right eye: 20/25 -1
        Left eye: 20/30 -1
    Intraocular Pressure:
        Right eye: 16 mmHg
        Left eye: 18 mmHg
    Pupil Reaction: Reactive to light and accommodation
    Slit Lamp Examination:
        Mild nuclear sclerosis bilaterally
        Early cataract formation in the right eye
    Dilated Fundus Exam:
        Normal optic nerve heads
        Mild macular degeneration in both eyes

Diagnosis:
    Bilateral nuclear sclerosis
    Early cataract formation in the right eye
    Age-related macular degeneration

Plan:
    Schedule follow-up appointment in 6 months
    Monitor for progression of cataract
    Discuss cataract surgery options with patient
""")
        ]

}

@app.local_entrypoint()
def perform_inference(input_data = sample_data):
    graph_flow = LangGraphAgentFlow()
    print(graph_flow.run_inference.remote(input_data))
    

# Function to trigger inference
# @web_app.post("/inference")
# def perform_inference(input_data):
#     model_loader = ModelLoader()
#     model_loader.load_all_models()
#     result = model_loader.run_inference(input_data)
#     return result

# @app.function()
# @modal.asgi_app()
# def fastapi():
#     web_app