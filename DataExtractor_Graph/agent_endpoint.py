# LOCAL MODULES
from utils import encode_image
from mistral_setup import MistralAgentLanguageModel

# API HANDLING MODULE
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Security, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# UTILITIES
from typing_extensions import Callable
from dotenv import load_dotenv
import logging
from PIL import Image
import io
import os

# LOAD ENVIRONMENT VARIABLES 
load_dotenv()

# DEFINE GLOBAL VARIABLES
validate_extract_agent = None

# INITIALIZE LOGGING
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# INITIALIZE FASTAPI APPLICATION
app = FastAPI()

# CONFIGURE RATE LIMITING
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# SECURITY HEADERS MIDDLEWARE
@app.middleware("http")
async def add_security_headers(request: Request, call_next: Callable) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# CONFIGURE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API KEY SECURITY
API_KEY_NAME = "EYOMN-EXTRACTOR-AGENT-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

# CONFIGURE DEFAULT OR ALLOWED API KEYS
API_KEYS = {
    os.getenv("EYOMN_API_KEY", "EYOMNAGENT"): "default-user"
}

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header in API_KEYS:
        return api_key_header
    raise HTTPException(
        status_code=403,
        detail="INVALID API KEY"
    )

# VALIDATE INCOMING IMAGES
async def validate_image(image: UploadFile) -> bytes:  
    
    # DEFINE ALLOWED FILE TYPES
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    
    # CHECK FILE EXTENSIONS
    file_ext = image.filename.lower().split(".")[-1]
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"INVALID FILE TYPE. ONLY {', '.join(ALLOWED_EXTENSIONS)} ARE ALLOWED"
        )
    
    # VALIDATE FILE SIZE
    try:
        MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB
        content = await image.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="FILE TOO LARGE")
        
        return content
    except Exception as _:
        raise HTTPException(status_code=400, detail="INVALID FILE FORMAT")
    

# DEFINE ROOT ENDPOINT
@app.get("/")
def root(api_key: str = Depends(get_api_key)):
    return {"Welcome": "You are now inside EYOMN'S ENDPOINT!"}

# DEFINE AND SECURE ENDPOINT FOR THE AGENT DATA EXTRACTOR
@app.post("/validate_and_extract")
@limiter.limit("5/minute")
async def validate_and_extract(request: Request, image: UploadFile = File(...), api_key: str = Depends(get_api_key)):
    try:
        # LOG THE REQUEST
        logger.info(f"PROCESSING REQUEST FOR API KEY: {api_key[:8]}...")
        
        # READ AND VALIDATE IMAGE
        image_content = await validate_image(image)
        
        # ENCODE THE IMAGE
        encoded_image = encode_image(image_content)
        
        # PROMPT FOR THE AGENT
        prompt = f"Here is the Image to Analyze: \n"
        
        print(f"---IMAGE ENCODED---")
                
        global validate_extract_agent
        # CHECK IF validate_extract_agent IS ALREADY INITIALIZED
        if validate_extract_agent is None:
            validate_extract_agent = MistralAgentLanguageModel()
        
        # PERFORM VALIDATION AND EXTRACTION
        raw_output = validate_extract_agent.validate_and_extract_chain(prompt=prompt, image_input=encoded_image, max_retries=2)
        
        # LOG SUCCESSFUL PROCESSING
        logger.info(f"SUCESSFULLY PROCESSED IMAGE FOR API KEY: {api_key[:8]}")
        
        # return raw_output
        print("Response Type: ", type(raw_output))
        print("Response: ", raw_output.model_dump_json())
        return JSONResponse(content={"info": raw_output.model_dump()}, status_code=200)
    except HTTPException as http_exc:
        logger.error(f"HTTP Exception: {str(http_exc)}")
        raise http_exc
    except Exception as e:
        logger.error(f"General Exception: {str(e)}")
        return JSONResponse(content={"status":"error", "message": str(e)}, status_code=500)

# ERROR HANDLER FOR INVALID API KEYS
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )