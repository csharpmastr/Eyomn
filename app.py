# import streamlit as st
# import requests

# # Define API endpoint for Modal
# API_URL = "https://csharpmastr--eyomnai-gpu-inference-fastapi.modal.run/perform_inference"

# st.title("LangGraph Inference Test")
# input_data = st.text_area("Input Data (JSON)", '{"input_key": "sample_data"}', height=300)

# if st.button("Run Inference"):
#     # Send POST request to the Modal API
#     response = requests.post(API_URL, json={"input_data": input_data})
#     if response.status_code == 200:
#         st.write("Response:", response.json())
#     else:
#         st.error("Error: " + response.text)

import streamlit as st
import requests
import json
from logger import logging

# API URL from your Modal deployment
api_url = "https://csharpmastr--eyomnai-gpu-inference-fastapi.modal.run/inference"  # replace with your actual URL

st.title("LangGraph Inference on Modal")
st.write("Enter patient data in any format (JSON or plain text)")

# Collect input data
input_data = st.text_area("Patient Data", height=300)

# Button to process data
if st.button("Process Data"):
    try:
        # Attempt to parse input as JSON
        try:
            data = json.loads(input_data)
            logging.info("Sending JSON Data to Graph")
        except json.JSONDecodeError:
            # If JSON parsing fails, treat input as plain text
            data = {"text_data": input_data}
            logging.info("Sending Plain Text Data to Graph")

        # Send data to Modal's API endpoint
        response = requests.post(api_url, json=data)

        # Display results
        if response.status_code == 200:
            result = response.json().get("result")
            st.write("Processed Output:")
            st.json(result)
        else:
            st.write("Error:", response.json().get("detail"))

    except Exception as e:
        st.write("An error occurred:", str(e))

# import modal
# import os
# from transformers import pipeline
# from packages.rag_chroma.chain import create_chain

# app = modal.APP("langchain-chat-app")

# # Define a persistent volume for model weights
# weights_volume = modal.Volume.persist("model-weights")

# # Global variable to hold the model for reuse
# model_pipeline = None

# # Function to load or cache model weights in Modal storage
# @app.function(
#     gpu="A10G", 
#     container_idle_timeout=300,
#     shared_volumes={"/model_weights": weights_volume}  # Attach the persistent volume here
# )
# def load_model():
#     global model_pipeline
#     model_path = "/model_weights/meta-llama"

#     # If model weights are not in volume, download and cache them
#     if not os.path.exists(model_path):
#         print("Downloading model weights...")
#         model_pipeline = pipeline("text-generation", 
#                                   model="meta-llama/Llama-3.2-3B-Instruct", 
#                                   cache_dir="/model_weights", 
#                                   model_kwargs=dict(
#                                     max_new_tokens=512,
#                                     temperature=0.1,
#                                     do_sample=False,
#                                     repetition_penalty=1.03,
#                                     top_p=0.95,
#                                     top_k=50
#                                 )
#                             )
#         print("Model weights downloaded and cached.")
#     else:
#         print("Loading model weights from cache...")
#         model_pipeline = pipeline("text-generation", model=model_path)

#     return model_pipeline

# # LangChain chain function to use the preloaded model pipeline
# @app.function(gpu="A10G", container_idle_timeout=300)
# def langchain_chain(question: str):
#     global model_pipeline
#     # Ensure model weights are loaded
#     model_pipeline = load_model() or model_pipeline
#     # Set up the chain to use the cached model pipeline
#     chain_instance = create_chain(model_pipeline)
#     return chain_instance.invoke({"__root__": question})
    
# @app.function()
# @modal.web_endpoint(method="GET")
# def main():
#     import streamlit as st

#     st.title("LangChain Chat Model")

#     question = st.text_input("Ask a question:")
#     if st.button("Submit"):
#         if question:
#             response = langchain_chain.call(question)
#             st.write("Answer:", response)

# if __name__ == "__main__":
#     app.serve()
