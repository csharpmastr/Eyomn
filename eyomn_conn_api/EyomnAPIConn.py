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
import os

# LOAD ENVIRONMENT VARIABLES 
load_dotenv(dotenv_path=".env")

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
API_KEY_NAME = "EYOMN-DATA-TUNNEL-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

# CONFIGURE DEFAULT OR ALLOWED API KEYS
API_KEYS = {
    os.getenv("EYOMN_DATA_TUNNEL_KEY", "EYOMNTUNNELKEY"): "default-user"
}

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header in API_KEYS:
        return api_key_header
    raise HTTPException(
        status_code=403,
        detail="INVALID API KEY"
    )

# DEFINE ROOT ENDPOINT
@app.get("/")
def root(api_key: str = Depends(get_api_key)):
    return {"Welcome": "You are now inside EYOMN'S ENDPOINT DATA TUNNEL!"}

# DEFINE AND SECURE ENDPOINT FOR THE AGENT DATA EXTRACTOR
@app.post("/api/validated_info")
@limiter.limit("5/minute")
async def update_patient_data(request: Request, api_key: str = Depends(get_api_key)):
    try:
        # LOG THE REQUEST
        logger.info(f"PROCESSING REQUEST FOR API KEY: {api_key[:8]}...")
        
        # RETRIEVE JSON DATA FROM THE REQUEST BODY
        validated_data = await request.json()
        
        logger.info(f"---RECEIVED DATA: {validated_data}---")
        
        # RETURN THE REQUESTED DATA
        return JSONResponse(content={"message": "DATA RECEIVED SUCCESSFULLY", "data": validated_data}, status_code=200)
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