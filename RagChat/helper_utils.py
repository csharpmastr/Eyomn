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
    from langchain_core.documents import Document
    from uuid import uuid4
    import sqlite3
    import _sqlite3
    import json
    
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
    from google.cloud.firestore_v1.collection import CollectionReference
    from google.cloud.firestore_v1.query import Query
    from google.cloud.firestore_v1.base_query import Or
    from langchain_google_firestore import FirestoreLoader
    from google.cloud.firestore import FieldFilter
    
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import unpad
    import binascii
    from typing import Annotated, List


# GLOBAL VARIABLES TO HOLD THE PERSISTENT CLIENT AND COLLECTION OF CHROMADB
persistent_client = None
internal_collection_name = "internal-rag-chroma"
internal_collection = None
external_collection = None
embedding_fn = None

# FUNCTION TO INITIALIZE FIRESTORE CLIENT
def init_firestore_client() -> Client:
    """Initialize a Firestore client."""
    try:
        # LOAD THE SERVICE ACCOUNT INFO FROM ENVIRONMENT VARIABLE
        service_account_info = json.loads(os.environ["SERVICE_ACCOUNT_JSON"])
        service_account_credentials = credentials.Certificate(service_account_info)
        
        # INITIALIZE THE FIRESTORE CLIENT
        firebase_admin.initialize_app(service_account_credentials)
        firestore_client = firestore.client()
    
        print("---FIRESTORE CLIENT INITIALIZED: RETURNING...---")
        return firestore_client

    except ValueError as ve:
        raise CustomException(f"ValueError in initializing Firestore client: {str(ve)}", sys)
    except FileNotFoundError as fnf:
        raise CustomException(f"Service account key file not found: {str(fnf)}", sys)
    except firebase_admin.exceptions.FirebaseError as fe:
        raise CustomException(f"FirebaseError in initializing Firestore client: {str(fe)}", sys)
    except Exception as e:
        raise CustomException(f"An unexpected error occurred: {str(e)}", sys)

# FUNCTION TO DECRYPT DATA RETRIEVED FROM FIRESTORE
def decrypt_data(encrypted_data: Annotated[str, "String of data to be decrypted"],
                 key: str = os.getenv('ENCRYPTION_KEY')) -> Annotated[str, "Decrypted Data"]:
    try:
        # SPLIT ENCRYPTED DATA
        text_parts = encrypted_data.split(":")
        iv = binascii.unhexlify(text_parts[0])
        encrypted_text_buffer = binascii.unhexlify(":".join(text_parts[1:]))
        
        decipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
        decrypted = decipher.decrypt(encrypted_text_buffer)
        decrypted_data = unpad(decrypted, AES.block_size).decode('utf-8')
    except Exception as e:
        raise CustomException(f"Error in decrypt_data: {str(e)}", sys)
    
    return decrypted_data

# FUNCTION TO PARSE RETRIEVED DATA FROM FIRESTORE
def parse_firestore_data(
    collection: Annotated[List[Document], "List of documents retrieved from Firestore"],
    collection_type = Annotated[str, "The type of the collection to be decrypted"]) -> Annotated[List, "List of Decrypted Documents"]:

    # IDENTIFY COLLECTION TYPE
    if collection_type == "appointment":
        keys_to_decrypt = ["reason", "doctor", "patient_name"]

    if collection_type == "patient":
        keys_to_decrypt = ["birthdate", "civil_status", "contact_number", "email", "first_name", "last_name",
                          "middle_name", "municipality", "occupation", "province", "sex", "age"]
        
    if collection_type == "soapNotes":
        keys_to_decrypt = ["subjective", "objective", "assessment", "plan"]
    
    new_document = []
    try:
        # LOOP THROUGH THE COLLECTION TO ACCESS EACH DOCUMENT
        for document in collection:
            # CHECK IF LIST IS EMPTY FIRST
            if len(collection) == 0:
                print("--CURRENT COLLECTION IS EMPTY--")
                continue
            
            page_content = json.loads(document.page_content)

            for key in keys_to_decrypt:
                if collection_type == "soapNotes":
                    # LOOP INSIDE EACH KEY TO ACCESS THE ARRAY THEN JOIN THE CONTENTS OF THE ARRAY
                    page_content[key] = "\n".join(decrypt_data(item) for item in page_content[key])
                else:
                    page_content[key] = decrypt_data(page_content[key])

            updated_page_content = json.dumps(page_content)
            
            # CUSTOMIZE METADATA FOR EACH DOCUMENT
            if collection_type == "soapNotes":
                updated_metadata = {
                    "note_id": page_content["noteId"],
                    "document_type": "soap note"
                }
            
            if collection_type == "appointment":
                updated_metadata = {
                    "reason": page_content["reason"],
                    "appointment_date": page_content["scheduledTime"],
                    "attending_doctor": page_content["doctor"],
                    "document_type": "appointment data"
                }

            if collection_type == "patient":
                updated_metadata = {
                    "document_type": "patient data",
                    "patient_id": page_content["patientId"],
                    "municipality": page_content["municipality"],
                    "province": page_content["province"],
                    "sex": page_content["sex"],
                    "birthdate": page_content["birthdate"],
                    "civil_status": page_content["civil_status"]
                }
            
            # CREATE A NEW DOCUMENT WITH UPDATED METADATA AND PAGE CONTENT THEN APPEND TO THE 'new_document' LIST
            decrypted_document = Document(page_content=updated_page_content, metadata=updated_metadata)
            new_document.append(decrypted_document)
        
        # RETURN THE UPDATED DOCUMENTS
        return new_document
            
    except CustomException as e:
        raise CustomException(f"Error in parse_firestore_data: {str(e)}", sys)

# FUNCTION TO STORE DOCUMENTS TO CHROMADB
def store_to_vectorstore(
    documents: Annotated[List[str], "List of Documents to store in VectorStore"],
    external_collection_name: Annotated[str, "Name of the collection of the stored documents"]
) -> Annotated[Chroma, "Vector Store instance which contains the Documents of the User"]:
    
    # USE THE GLOBAL VARIABLES
    global persistent_client, external_collection, embedding_fn
    
    # INITIALIZE PERSISTENT CHROMA CLIENT ONCE
    if persistent_client is None:
        # INITIALIZE THE PERSISTENT CHROMA CLIENT
        print("INITIALIZING PERSISTENT CLIENT FOR EXTERNAL KNOWLEDGE")
        persistent_client = chromadb.PersistentClient()
    
    external_collection = persistent_client.get_or_create_collection(external_collection_name)
        
    # INITIALIZE THE EMBEDDING FUNCTION
    if embedding_fn is None:
        print("INITIALIZING EMBEDDING FUNCTION")
        embedding_fn = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # CHECK IF THE COLLECTION ALREADY CONTAINS DOCUMENTS
    if external_collection.count() > 0:
        print(f"EXTERNAL COLLECTION ALREADY CONTAINS DOCUMENTS... \n RETURNING EXISTING CHROMADB\n")
        return Chroma(client=persistent_client, collection_name=external_collection_name, embedding_function=embedding_fn)
    else:
        # GENERATE SYNTHETIC IDS FOR EACH DOCUMENTS
        uids = [str(uuid4()) for _ in range(len(documents))]
        
        # EXTRACT PAGE CONTENT FROM DOCUMENTS THEN CONVERT TO STRING
        plain_documents = [doc.page_content if isinstance(doc, Document) else str(doc) for doc in documents]
        
        # EXTRACT METADATA FROM DOCUMENTS
        document_metadata = [doc.metadata for doc in documents]
            
        # ADD TO EXISTING PERSISTENT VECTORDB
        external_collection.add(documents=plain_documents, 
                        ids=uids, metadatas=document_metadata)
    print("---EXTERNAL KNOWLEDGE LOADED TO CHROMA---")
    return Chroma(client=persistent_client, collection_name=external_collection_name, embedding_function=embedding_fn)

# FUNCTION TO LOAD DATA FROM FIRESTORE
def load_data_from_firestore(
    reference: Annotated[CollectionReference | Query, "Reference to the collection or query"],
    collection_type: Annotated[str, "Collection name being retrieved"],
    client: Annotated[Client, "Firestore Database Client API"]
) -> List[Document]:
    
    # LOAD REFERENCED DATA FROM FIRESTORE
    loader = FirestoreLoader(reference, client=client)
    encrypted_data = loader.load()
        
    # DECRYPT THE DATA
    decrypted_data = parse_firestore_data(encrypted_data, collection_type)
        
    return decrypted_data

# FUNCTION TO GIVE THE CURRENT USER ACCESS TO THE DATA RETRIEVED AND DECRYPTED
def init_external_retriever(
    role: Annotated[str, "Role of the current user"], 
    branchid: Annotated[List[str], "Branch/es of the current user"], 
    userid: Annotated[str, "User ID of the current user"],
    fsclient: Annotated[Client, "Firestore Database Client API"]
) -> Chroma:
    role_map = {
        "3": "staff",
        "2": "doctor",
        "1": "branch",
        "0": "admin"
    }
    
    role = role_map.get(role, "")
    
    # TYPE CHECK OF THE 'branchid' PARAMETER
    if not isinstance(branchid, List):
            raise TypeError("The 'branchid' parameter must be a list of strings.")
    
    # PROCESS DATA ASSOCIATED WITH THE ROLE 'STAFF'
    if role == "staff":
        print("--CURRENT USER IS A STAFF--")
        
        staff_appointments = []
        for BID in branchid:
            try:
                # RETRIEVE APPOINTMENT DATA FROM FIRESTORE
                staff_appointment_ref = fsclient.collection("apppointment").document(BID).collection("schedules")
                
                print("--LOADING APPOINTMENT DATA--")
                # LOAD AND DECRYPT NECESSARY PARTS OF THE DATA
                decrypted_appointment_data = load_data_from_firestore(staff_appointment_ref, collection_type="appointment", client=fsclient)
                staff_appointments.extend(decrypted_appointment_data)
            except Exception as e:
                logging.error(f"Error loading appointment data for branch {BID}: {e}")
            continue
        
        # STORE DECRYPTED DATA TO CHROMADB
        print("--STORING DATA TO CHROMADB--")
        try:
            vectorstore = store_to_vectorstore(documents=staff_appointments,
                                               external_collection_name="staff-appointment-data-vector-store")
            print("--DATA ENCRYPTED AND STORED IN CHROMADB--")
            return vectorstore
        except Exception as e:
            logging.error(f"Error storing data to ChromaDB: {e}")
            raise CustomException(f"Error storing data to ChromaDB: {e}", sys)

    # PROCESS DATA ASSOCIATED WITH THE ROLE 'DOCTOR'
    if role == "doctor":
        print("---CURRENT USER IS A DOCTOR---")

        # DEFINE A LIST TO HOLD AND STORE DOCTOR'S DOCUMENTS
        dr_data_documents = []

        # DEFINE A LIST TO HOLD AND STORE DOCTOR'S ATTENDING PATIENT IDs
        dr_patient_ids = set()

        # LOOP THROUGH THE BRANCHES OF THE CURRENT DOCTOR
        for BID in branchid:
            try:
                dr_appointment_ref = fsclient.collection("apppointment").document(BID).collection("schedules")

                # PERFORM A QUERY TO FIRESTORE TO ONLY RETURN APPOINTMENT OF THE CURRENT DOCTOR
                dr_query_appointment = dr_appointment_ref.where(filter=FieldFilter("doctorId", "==", userid))
                
                print("---FILTERED DOCTOR'S ID---")

                dr_decrypted_appointment_data = load_data_from_firestore(dr_query_appointment, collection_type="appointment", client=fsclient)

                # APPEND DOCTOR'S APPOINTMENT DATA TO 'dr_data_documents' LIST
                dr_data_documents.extend(dr_decrypted_appointment_data)
            except Exception as e:
                logging.error(f"Error loading appointment data for doctor in branch {BID}: {e}")
                continue

        print("--DOCTOR'S APPOINTMENT DATA LOADED--")

        try:
            # RETRIEVE PATIENT INFORMATION HANDLED BY THE CURRENT DOCTOR
            dr_attending_patient_ref = fsclient.collection("patient")
            dr_query_patient = dr_attending_patient_ref.where(
                filter=Or(
                    [
                        FieldFilter("doctorId", "==", userid),
                        FieldFilter("authorizedDoctor", "==", userid)
                    ]
                )
            )
            # LOAD AND DECRYPT DATA FROM FIRESTORE
            dr_decrypted_patient_data = load_data_from_firestore(dr_query_patient, collection_type="patient", client=fsclient)
            # APPEND THE RETRIEVED AND DECRYPTED PATIENT DATA TO THE EXISTING DOCUMENT LIST OF THE CURRENT DOCTOR
            dr_data_documents.extend(dr_decrypted_patient_data)

            # EXTRACT AND APPEND EACH PATIENT IDs TO THE LIST
            dr_patient_ids.update(
                doc.metadata["patient_id"] for doc in dr_data_documents if doc.metadata["document_type"] == "patient data"
            )

            print("--DOCTOR'S PATIENT DATA LOADED--")
        except Exception as e:
            logging.error(f"Error loading patient data for doctor: {e}")
            raise CustomException(f"Error loading patient data for doctor: {e}", sys)

        # LOOP THROUGH THE PATIENT IDs TO GET THEIR SOAPNOTES
        for id in dr_patient_ids:
            try:
                # REFERENCE THE SOAPNOTES SUBCOLLECTION
                dr_attending_patient_notes_ref = fsclient.collection("note").document(id).collection("soapNotes")

                # LOAD AND DECRYPT DATA FROM FIRESTORE
                dr_decrypted_patient_notes = load_data_from_firestore(dr_attending_patient_notes_ref,
                                                                      collection_type="soapNotes",
                                                                      client=fsclient)

                # CHECK IF 'dr_decrypted_patient_notes' IS EMPTY BEFORE ADDING TO THE LIST
                if len(dr_decrypted_patient_notes) > 0:
                    print(f"--APPENDING PATIENT DATA TO 'dr_data_documents'--")
                    # APPEND THE RETRIEVED AND DECRYPTED PATIENT NOTES TO THE EXISTING LIST OF THE DOCTOR'S DOCUMENTS
                    dr_data_documents.extend(dr_decrypted_patient_notes)
            except Exception as e:
                logging.error(f"Error loading SOAP notes for patient {id}: {e}")
                continue

        print("--DOCTOR'S PATIENT NOTES DATA LOADED--")

        # STORE DECRYPTED DATA TO CHROMADB
        try:
            vectorstore = store_to_vectorstore(documents=dr_data_documents,
                                               external_collection_name="doctor-appointment-data-vector-store")
            return vectorstore
        except Exception as e:
            logging.error(f"Error storing data to ChromaDB: {e}")
            raise CustomException(f"Error storing data to ChromaDB: {e}", sys)
    
# function to preprocess documents before passing to content
def preprocess(text: str) -> str:
    """Clean text by removing extra spaces and newlines"""
    text = text.replace('\t', '')
    text = re.sub(r'^[\t ]+', '', text, flags=re.MULTILINE)
    return re.sub(r'\n{2,}', '\n', text.strip())

# function to accept a list of urls or file path then perform splitting
def init_internal_retriever() -> Chroma:
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
    global persistent_client, internal_collection, embedding_fn
    
    # INITIALIZE PERSISTENT CHROMA CLIENT ONCE
    if persistent_client is None:
        # INITIALIZE THE PERSISTENT CHROMA CLIENT
        print("INITIALIZING PERSISTENT CLIENT")
        persistent_client = chromadb.PersistentClient()
    
    internal_collection = persistent_client.get_or_create_collection(internal_collection_name)
        
    # INITIALIZE THE EMBEDDING FUNCTION
    if embedding_fn is None:
        print("INITIALIZING EMBEDDING FUNCTION")
        embedding_fn = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # CHECK IF THE COLLECTION ALREADY CONTAINS DOCUMENTS
    if internal_collection.count() > 0:
        print(f"Collection already exists with documents. Returning existing vector store.")
        return Chroma(client=persistent_client, collection_name=internal_collection_name, embedding_function=embedding_fn)
    
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
            internal_collection.add(documents=documents_to_add, 
                           ids=uids)
            
            logging.info("Added the Document Splits from {url} to ChromaDB")
        print(f"Length of Documents: {len(docs)}")
    
        return Chroma(client=persistent_client, collection_name=internal_collection_name, embedding_function=embedding_fn)
    except Exception as e:
        raise CustomException(e, sys)   

# function to load and retrieve system prompts
def load_sys_prompts(file_path: Path):
    
    # load prompts from yaml
    with open(file_path, 'r') as file:
        prompts = yaml.safe_load(file)
    
    logging.info("System Prompts Loaded")
    
    return prompts

# CLASS FOR COUNTERS
class CounterTracker:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._counters = {}  # Initialize an empty dictionary
        return cls._instance

    def set_counter(self, counter_name, value):
        self._counters[counter_name] = value

    def get_counter(self, counter_name):
        return self._counters.get(counter_name, 0)  # Default to 0 if not set

    def increment_counter(self, counter_name):
        self._counters[counter_name] = self.get_counter(counter_name) + 1

    def __str__(self):
        return f"CounterTracker instance with counters: {self._counters}"