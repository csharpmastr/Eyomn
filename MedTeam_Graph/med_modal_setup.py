import modal
from pathlib import Path

# DEFINE LIST OF REQUIRED PACKAGES
packages = [
    "langgraph>=0.2.39", "langchain>=0.3.3",
    "langchain_groq>=0.2.0", "langchain-openai>=0.1.1",
    "langchain_chroma>=0.1.2", "langchain_community>=0.2.5",
    "langsmith>=0.1.142", "pandas>=2.2.1",
    "pydantic>=2.9.0",
    # API setting dependencies
    "streamlit>=1.39.0", "fastapi>=0.114.2"
]

# DEFINE IMAGE FOR MODAL
medteam_image = (
    modal.Image.debian_slim()
    # Install necessary dependencies
    .pip_install(packages)
    .copy_local_file(local_path=Path("MedTeam_Graph/med_sys_prompts.yaml"))
)

app = modal.App(
    "EyomnAI-Medical-Team-Agent",
    image=medteam_image,
    secrets=[modal.Secret.from_name("RAG_APP_SECRETS")]
)