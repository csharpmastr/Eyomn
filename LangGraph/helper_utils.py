import sys
from logger import logging
from exception import CustomException
from typing import Optional
from LangGraph.agent_tools import PatientData, SOAPNote
from pydantic import ValidationError
from langchain_core.tools import tool

def agent_node(state, agent, name):
    """
    This function is responsible for converting the system message to a human-readable format
    
    Parameters:
    - state (any): The current state of the system.
    - agent (Agent): The agent that will be invoked to generate a response.
    - name (str): The name of the agent.

    Returns:
    - dict: A dictionary containing a list of human-readable messages. The list contains a single
      HumanMessage object with the content and name from the agent's response.
    """
    from langchain_core.messages import HumanMessage
    result = agent.invoke(state)

    return {
        "messages": [HumanMessage(content=result["messages"][-1].content, name=name)]
    }

def custom_agent_logic(state, agent, rp_msg):
    from langchain_core.messages import HumanMessage
    
    # prepare input with rp_msg
    input_data = {
        "messages": [rp_msg, HumanMessage(content=state.messages)]
    }
    
    result = agent.invoke(input_data)
    
    return {
        
    }

@tool
def validate_patient_data(data: dict) -> Optional[PatientData]:
    """
    This function validates the patient data.
    
    Parameters:
    - data (dict): The patient data to be validated.
    
    Returns:
    - Optional[PatientRecord]: The validated patient data if all required fields are present.
    - None: If any required field is missing.
    """
    try:
        # Try to validate and parse the data into a PatientRecord instance
        record = PatientData.model_validate(data)
        logging.info("Patient Data Validated")
        return record
    except ValidationError as e:
        # If validation fails, log or handle the error appropriately
        print("Validation error:", e)
        return None

@tool
def validate_soap_note(data: dict) -> Optional[SOAPNote]:
    """
    This function validates the SOAP note data.
    
    Parameters:
    - data (dict): The SOAP note data to be validated.
    
    Returns:
    - Optional[SOAPNote]: The validated SOAP note data if all required fields are present.
    - None: If any required field is missing.
    """
    try:
        logging.info("SOAP Note Validated")
        return SOAPNote.model_validate(data)
    except ValidationError as e:
        print("Validation error for SOAPNote:", e)
        return None