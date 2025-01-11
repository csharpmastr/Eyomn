from utils import MistralAgentLanguageModel
from utils import encode_image
from dotenv import load_dotenv
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from typing_extensions import Annotated
import uvicorn
from ngrok import ngrok
from PIL import Image
import io

load_dotenv()

# LOAD MISTRAL LANGUAGE MODEL
validation_extraction_agent = MistralAgentLanguageModel()

# FUNCTION TO DEFINE A WEB ENDPOINT
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome! You are now inside EYOMN'S ENDPOINT!"}

@app.post("/validate_and_extract")
def web_endpoint(image: UploadFile = File(...)):
    try:
        # WAIT FOR THE IMAGE TO BE LOADED
        image_file = image.file.read()
        print(f"TYPE OF IMAGE FILE: {type(image_file)}")
        
        # ENCODE THE IMAGE
        encoded_image = encode_image(image_file)
        print(f"\n\nLENGTH OF ENCODED IMAGE: {len(encoded_image)}\n\n")
        
        # PROMPT FOR THE AGENT
        prompt = f"Here is the Image to Analyze: \n"
        
        print(f"---IMAGE ENCODED---")
        
        # PERFORM VALIDATION AND EXTRACTION
        raw_output = validation_extraction_agent.validate_and_extract_chain(prompt=prompt, image_input=encoded_image)
        
        return raw_output
        #return JSONResponse(content={"message": raw_output}, status_code=200)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"General Exception: {e}")
        return JSONResponse(content={"message": str(e)}, status_code=500)

#if __name__ == "__main__":
    # START NGROK 
    #listener = ngrok.connect(8080, bind_tls=True)
    #print(f"Ingress established at: {listener.url()}")
    
    # START FASTAPI APP
    #import uvicorn
    #uvicorn.run(app, host="0.0.0.0", port=8080)