import modal
from modal import Image, App, Secret, gpu
from pathlib import Path
from exception import CustomException
from logger import logging
import sys

from helper_utils import get_model_config     

model_dir = "/eyomn_model_volume"
model_name = "m42-health/Llama3-Med42-8B"
num_gpu = 1
hours = 60 * 60
token = "eyomnai-ophthal-agent"

vllm_image = (
    Image.debian_slim(python_version="3.11")
    .pip_install(["fastapi>=0.115.4", "vllm==0.6.3post1"])
    # .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    # .run_function(
    #     download_model,
    #     secrets=[
    #         Secret.from_name("RAG_APP_SECRETS", required_keys=["INFERENCE_AGENTS_TOKEN"])
    #     ],
    #     timeout= 60 * 20,
    #     kwargs={"model_dir": model_dir, "model_name": model_name}
    # )
)
try: 
    vllm_volume = modal.Volume.from_name("eyomn_model_volume", create_if_missing=False)
except modal.exception.NotFoundError as e:
    raise CustomException(e, sys)

app = App(f"vllm--serving--OPHTHAL--AGENT--70B")

@app.function(
    image=vllm_image,
    gpu=gpu.A10G(count=num_gpu),
    timeout=12 * hours,
    allow_concurrent_inputs=50,
    volumes={model_dir: vllm_volume}
)
@modal.asgi_app()
def serve_llm():
    """
    Serves a language model (LLM) as an OpenAI-compatible API using FastAPI.

    This function initializes a FastAPI application that provides endpoints for 
    chat and completion functionalities compatible with OpenAI's API. It sets up 
    authentication, CORS middleware, and integrates the VLLM engine for processing 
    requests.

    Returns:
    -------
    fastapi.FastAPI
        An instance of the FastAPI application configured to serve the LLM.

    Raises:
    ------
    CustomException
        If any error occurs during the setup of the FastAPI application, 
        model loading, or request handling, a CustomException is raised with 
        the original exception details.
    """
    try:
        import fastapi
        from fastapi import FastAPI, security, Security, HTTPException
        from fastapi.middleware.cors import CORSMiddleware
        import vllm.entrypoints.openai.api_server as api_server
        from vllm.engine.arg_utils import AsyncEngineArgs
        from vllm.engine.async_llm_engine import AsyncLLMEngine
        from vllm.entrypoints.logger import RequestLogger
        from vllm.entrypoints.openai.serving_chat import OpenAIServingChat
        from vllm.entrypoints.openai.serving_completion import (
            OpenAIServingCompletion,
        )
        from vllm.entrypoints.openai.serving_engine import BaseModelPath
        from vllm.usage.usage_lib import UsageContext
            
        # ENSURE LATEST VERSION OF THE MODEL WEIGHTS
        #vllm_volume.reload() 
            
        # DEFINE FASTAPI APP COMPATIBLE WITH OPENAI
        web_app = FastAPI(
            title=f"OpenAI-Compatible {model_name} server",
            description="Serve and run OpenAi-compatible LLM",
            version="0.0.1",
            docs_url="/docs"
        )
            
        # SECURITY: CORS MIDDLEWARE FOR EXTERNAL REQUESTS
        http_bearer = security.HTTPBearer(
            scheme_name="Bearer Token",
            description="See code for authentication details.",
        )
            
        web_app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
            
        # INJECT DEPENDENCIES ON AUTHED ROUTES
        async def is_authenticated(api_key: str = Security(http_bearer)):
            if api_key.credentials != token:
                raise fastapi.HTTPException(
                    status_code=fastapi.status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                )
            print(f"TOKEN: {token} \n API KEY: {api_key.credentials}")
            return {"username": "authenticated_user"}
        
        router = fastapi.APIRouter(dependencies=[fastapi.Depends(is_authenticated)])
            
        # WRAPPING VLLM IN AUTH ROUTER
        router.include_router(api_server.router)
            
        # ADD AUTHED VLLM TO THE FASTAPI APP
        web_app.include_router(router)
            
        engine_args = AsyncEngineArgs(
            model = model_dir + "/" + "OPHTHAL-AGENT-8B",
            tensor_parallel_size = num_gpu,
            gpu_memory_utilization=0.90,
            max_model_len=4088,
            enforce_eager=False
        )
            
        # DECLARE THE SERVER AS AN OPENAI COMPATIBLE API
        engine = AsyncLLMEngine.from_engine_args(
            engine_args, usage_context=UsageContext.OPENAI_API_SERVER
        )
        
        web_app.state.engine_client = engine
        
        model_config = get_model_config(engine)
            
        request_logger = RequestLogger(max_log_len=2048)
            
        base_model_paths = [
            BaseModelPath(name=model_name.split('/')[1], model_path=model_name)
        ]
            
        api_server.chat = lambda s: OpenAIServingChat(
            engine,
            model_config=model_config,
            base_model_paths=base_model_paths,
            chat_template=None,
            response_role="assistant",
            lora_modules=[],
            prompt_adapters=[],
            request_logger=request_logger,
        )
            
        api_server.completion = lambda s: OpenAIServingCompletion(
            engine,
            model_config=model_config,
            base_model_paths=base_model_paths,
            lora_modules=[],
            prompt_adapters=[],
            request_logger=request_logger,
        )
            
        return web_app
    except Exception as e:
        print(CustomException(e, sys))