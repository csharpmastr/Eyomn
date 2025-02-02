import modal
from pathlib import Path

packages = [
    "langgraph>=0.2.56", "langchain>=0.3.9",
    "langchain_groq>=0.2.0", "langchain-huggingface>=0.1.1", "langchain-mistralai>=0.2.6",
    "langchain_chroma>=0.1.2", "langchain_community>=0.3.10",
    "langchain-core>=0.3.22", "langchain-text-splitters>=0.3.2"
    "langsmith>=0.1.142", "pandas>=2.2.1", 
    "langchain-google-firestore", "firebase-admin",
    "pydantic>=2.10.0", "sentence_transformers>=3.2.1",
    "huggingface_hub>=0.26.2", "firecrawl-py>=1.3.1",
    "pymupdf>=1.24.11", "transformers>=4.39.0",
    # API setting dependencies
    "streamlit>=1.39.0", "fastapi>=0.114.2",
    "uvicorn>=0.30.2", "chromadb>=0.5.15",
    "pycryptodome>=3.19.0"
]

# define an image for the modal
rag_image = (
    modal.Image.debian_slim()
    # Install necessary dependencies
    .pip_install(packages)
    .copy_local_file(local_path=Path("RagChat/Thesis_Documentation.pdf"))
    .copy_local_file(local_path=Path("RagChat/sys_prompts.yaml"))
    .copy_local_file(local_path=Path("RagChat/ophthal_opto_guide.pdf"))
)

app = modal.App(
    "EyomnAI-RAG-CHAT",
    image=rag_image,
    secrets=[modal.Secret.from_name("RAG_APP_SECRETS"), modal.Secret.from_name("FIREBASE-ADMIN")]
)