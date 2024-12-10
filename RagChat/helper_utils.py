import re
import os
import sys
import yaml
from pathlib import Path
from logger import logging
from exception import CustomException
#import numpy as np
from langchain_community.vectorstores import Chroma

from modal_setup import rag_image

# context manager for global imports
with rag_image.imports():
    from langchain_community.vectorstores import Chroma
    from uuid import uuid4
    import sqlite3
    import _sqlite3
    
    import chromadb
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_huggingface.embeddings import HuggingFaceEmbeddings
    from langchain_community.vectorstores.utils import filter_complex_metadata
    from langchain_community.document_loaders import PyMuPDFLoader
    from langchain_community.document_loaders.firecrawl import FireCrawlLoader
    from transformers import AutoTokenizer
    
    import firebase_admin
    from firebase_admin import credentials
    from firebase_admin import firestore
    from google.cloud.firestore_v1.client import Client


# GLOBAL VARIABLES TO HOLD THE PERSISTENT CLIENT AND COLLECTION OF CHROMADB
persistent_client = None
collection_name = "rag-chroma"
collection = None
embedding_fn = None

# FUNCTION TO INITIALIZE FIRESTORE CLIENT
def init_firestore_client() -> Client:
    """Initialize a Firestore client."""
    # LOAD THE SERVICE ACCOUNT KEY JSON FILE
    service_account_key_path = str(Path("/eyomn-2d9c7-firebase-adminsdk-zjlyg-4c6fd6c764.json"))
    service_account_credentials = credentials.Certificate(service_account_key_path)
    
    # INITIALIZE THE FIRESTORE CLIENT
    firebase_admin.initialize_app(service_account_credentials)
    firestore_client = firestore.client()
    
    print("---FIRESTORE CLIENT ALREADY INITIALIZED: RETUNING...---")
    return firestore_client

# function to preprocess documents before passing to content
def preprocess(text: str) -> str:
    """Clean text by removing extra spaces and newlines"""
    text = text.replace('\t', '')
    text = re.sub(r'^[\t ]+', '', text, flags=re.MULTILINE)
    return re.sub(r'\n{2,}', '\n', text.strip())

# function to accept a list of urls or file path then perform splitting
def retrieve_vector_store() -> Chroma:
    """
    Loads documents from a list of URLs, processes their content, and stores them in a vector database.

    This function iterates through the provided URLs, loading documents from either PDF files 
    or web pages. It extracts the content, preprocesses it, checks for uniqueness, and splits 
    the documents into smaller chunks before storing them in a Chroma vector database.

    Parameters:
    ----------
    urls : list
        A list of URLs from which to load documents. The URLs can point to PDF files or web pages.

    Returns:
    -------
    vectorstore : Chroma
        A Chroma vector store containing the processed document splits, ready for retrieval-augmented generation tasks.

    Raises:
    ------
    CustomException
        If any error occurs during the loading, processing, or storing of documents, a CustomException 
        is raised with the original exception details.
    """    
    # USE THE GLOBAL VARIABLES
    global persistent_client, collection, embedding_fn
    
    # INITIALIZE PERSISTENT CHROMA CLIENT ONCE
    if persistent_client is None:
        # INITIALIZE THE PERSISTENT CHROMA CLIENT
        print("INITIALIZING PERSISTENT CLIENT")
        persistent_client = chromadb.PersistentClient()
        collection = persistent_client.get_or_create_collection(collection_name)
        
    # INITIALIZE THE EMBEDDING FUNCTION
    if embedding_fn is None:
        print("INITIALIZING EMBEDDING FUNCTION")
        embedding_fn = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # CHECK IF THE COLLECTION ALREADY CONTAINS DOCUMENTS
    if collection.count() > 0:
        print(f"Collection already exists with documents. Returning existing vector store.")
        return Chroma(client=persistent_client, collection_name=collection_name, embedding_function=embedding_fn)
    
    # list of urls to store as knowledge base
    urls = ["https://eyomn.com/", str(Path("/Thesis_Documentation.pdf")), "https://www.ncbi.nlm.nih.gov/books/NBK482263/", str(Path("/ophthal_opto_guide.pdf"))]
    
    docs = []
    unique_docs = set()  # Set to track unique document contents
    is_url = False
    
    try:
        for url in urls:
            if url.endswith(".pdf"):
                loader = PyMuPDFLoader(url)
                is_url = False
            else:
                loader = FireCrawlLoader(
                api_key=os.environ['FIRECRAWL_API'], url=url, mode="scrape"
                )
                is_url = True
            
            logging.info("Extracting Contents from {url}")
            doc = loader.lazy_load()

            for d in doc:
                if d.page_content == "" or d.page_content.isspace():
                    continue
                if any(x in d.page_content for x in ["https:", "http:", "www", ".pdf"]) and is_url == False:
                    continue
                
                d.page_content = preprocess(d.page_content)
                
                # Check for uniqueness before adding
                if d.page_content not in unique_docs:
                    unique_docs.add(d.page_content)  # Add content to the set
                    docs.append(d)  # Append the document if it's unique
                #docs.append(d)
            
            cleaned_docs = filter_complex_metadata(docs)
            text_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
                        AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2"),
                        chunk_size=250,
                        chunk_overlap=10
                        )
            doc_splits = text_splitter.split_documents(cleaned_docs)
            
            # EXTRACT PAGE CONTENT ON DOC SPLITS
            documents_to_add = [d.page_content for d in doc_splits]
            
            # GENERATE SYNTHETIC IDS FOR EACH DOCUMENTS
            uids = [str(uuid4()) for _ in range(len(documents_to_add))]
            
            # ADD TO A PERSISTENT VECTORDB
            collection.add(documents=documents_to_add, 
                           ids=uids)
            
            logging.info("Added the Document Splits from {url} to ChromaDB")
        print(f"Length of Documents: {len(docs)}")
    
        return Chroma(client=persistent_client, collection_name=collection_name, embedding_function=embedding_fn)
    except Exception as e:
        raise CustomException(e, sys)   

# function to load and retrieve system prompts
def load_sys_prompts(file_path: Path):
    
    # load prompts from yaml
    with open(file_path, 'r') as file:
        prompts = yaml.safe_load(file)
    
    logging.info("System Prompts Loaded")
    
    return prompts