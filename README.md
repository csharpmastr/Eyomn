## EyomnAI Project

### Overview
EyomnAI is an advanced Electronic Medical Records (EMR) software designed for eye clinics. It integrates Large Language Models (LLMs) to provide intelligent, friendly, and helpful assistance to healthcare professionals. This project aims to streamline medical record management, enhance patient care, and improve operational efficiency in ophthalmology clinics.

### Project Structure
The project is organized into several key components:

1. **RagChat**: A retrieval-augmented generation (RAG) system that leverages external knowledge to answer user queries.
2. **Med_Graph**: A graph-based workflow for processing and summarizing medical data.
3. **MedTeam_Graph**: A specialized graph for handling medical team interactions and summarizing patient notes.
4. **DataExtractor_Graph**: A graph for extracting and validating data from identification cards.

### Key Features
- **Intelligent Data Extraction**: Automatically extracts and validates data from identification cards.
- **SOAP Note Summarization**: Summarizes patient notes into the SOAP format (Subjective, Objective, Assessment, Plan).
- **Hallucination Detection**: Identifies and grades the accuracy of generated summaries.
- **Feedback and Rewriting**: Provides feedback on summaries and rewrites them for clarity and accuracy.
- **Docker Support**: Easily build and deploy the application using Docker.

### Getting Started
To get started with the EyomnAI project, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/csharpmastr/EyomnAI.git
   cd EyomnAI```
2. **Install Dependencies**: Make sure you have Docker installed. Then, build the Docker image:
    ```sh
    docker compose up --build
    ```
    This command will build the Docker image and start the application.
    Your application will be available at `http://localhost:8000`.