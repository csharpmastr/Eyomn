import os
import sys
from exception import CustomException
from logger import logging
from pathlib import Path
from helper_utils import load_sys_prompts

from med_data_models import (
    SummaryWriterDataModel, HallucinationGradeDataModel,
    HallucinationFeedbackDataModel, SummaryRewriterDataModel
)

from med_modal_setup import medteam_image

# SETUP CONTEXT MANAGER FOR GLOBAL IMPORTS
with medteam_image.imports():
    from langchain_openai import ChatOpenAI
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate

# INITIALIZE SYS PROMPTS FOR GLOBAL USE
sys_prompts = None

# DEFINE SYS PROMPTS PATH
sys_prompt_file_path = Path("/med_sys_prompts.yaml")

# FUNCTION TO BUILD THE SOAP SUMMARIZER CHAIN
def build_note_summarizer_chain():
    """
    Constructs a SOAP note summarizer chain using a language model agent.

    Returns:
    -------
    soap_summarizer_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model agent, ready to process patient notes and generate summaries.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the agent server, 
        language model, or prompt setup, a CustomException is raised with 
        the original exception details.
    """
    global sys_prompts
    try:
        # INITIALIZE OPHTHAL-AGENT-SERVER
        agent_server = "https://csharpmastr--eyomn-ophthal-agent-vllm-serving-serve-llm.modal.run/v1"
        
        # DEFINE TOKEN TO PASS FOR AUTHENTICATION IN CONNECTING WITH THE OPHTHAL AGENT'S SERVER
        auth_token = os.environ['OPHTHAL_AGENT_TOKEN']
        print("Enter Build Summarizer Function")
        # INITIALIZE LLM AGENT WITH ENDPOINT AND AUTH TOKEN
        llm_summarizer = ChatOpenAI(
             model="Llama3-Med42-8B",
            openai_api_key=auth_token,
            openai_api_base=agent_server,
            temperature=0.2
        )
        
        # FORCE LLM WITH STRUCTURED OUTPUT
        structured_llm_summarizer = llm_summarizer.with_structured_output(SummaryWriterDataModel)
        
        # CHECK IF SYS PROMPTS ARE ALREADY INITIALIZED
        if sys_prompts is None:
            # LOAD SYS PROMPTS FROM FILE
            sys_prompts = load_sys_prompts(file_path=sys_prompt_file_path)
            
        # DEFINE THE PROMPT FOR THE SOAP SUMMARIZER
        soap_summarizer_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", sys_prompts['soap_summmarizer_sys_prompt']),
                ("human", "Patient note to be summarized: \n{patient_note}")
            ]
        )
        
        # CHAIN THE PROMPT AND THE AGENT
        soap_summarizer_chain = soap_summarizer_prompt | structured_llm_summarizer
        
        # LOG THE AGENT CREATION
        logging.info("Soap Note Summarizer Chain Created")
        print("Soap Note Summarizer Chain Created")
        
        return soap_summarizer_chain
        
    except Exception as e:
        raise CustomException(f"Error in build_note_summarizer_chain: {str(e)}", sys)

# FUNCTION TO BUILD THE HALLUCINATION GRADER CHAIN
def build_hallu_grader_chain():
    """
    Constructs a hallucination grader chain using a language model agent.

    Returns:
    -------
    hallu_grader_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model agent, ready to process patient data and LLM generations to evaluate 
        hallucinations.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model, 
        prompt setup, or loading of system prompts, a CustomException is raised 
        with the original exception details.
    """
    global sys_prompts
    try:     
        # INITIALIZE LLM AGENT WITH CHATGROQ
        llm_hallu_grader = ChatGroq(
            model_name="llama-3.1-8b-instant", 
            max_retries=2, temperature=0.2, max_tokens=None,
            api_key=os.environ['GROQ_API_KEY']
        )
        
        # FORCE LLM WITH STRUCTURED OUTPUT
        structured_llm_hallu_grader = llm_hallu_grader.with_structured_output(HallucinationGradeDataModel)
        
        # CHECK IF SYS PROMPTS ARE ALREADY INITIALIZED
        if sys_prompts is None:
            # LOAD SYS PROMPTS FROM FILE
            sys_prompts = load_sys_prompts(file_path=sys_prompt_file_path)
            
        # DEFINE THE PROMPT FOR THE HALLUCINATION GRADER
        hallu_grader_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", sys_prompts['hallucination_grader_sys_prompt']),
                ("human", "Patient note: \n\n{patient_data} \n\n LLM Generation: {generation}")
            ]
        )
        
        # CHAIN THE PROMPT AND THE AGENT
        hallu_grader_chain = hallu_grader_prompt | structured_llm_hallu_grader
        
        # LOG THE AGENT CREATION
        logging.info("Hallucination Grader Chain Created")
        
        return hallu_grader_chain
        
    except Exception as e:
        raise CustomException(f"Error in build_hallu_grader_chain: {str(e)}", sys)

# FUNCTION TO BUILD THE HALLUCINATION FEEDBACK WRITER CHAIN
def build_hallu_fbwriter_chain():
    """
    Constructs a hallucination feedback writer chain using a language model agent.

    Returns:
    -------
    hallu_fbwriter_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model agent, ready to process patient data and LLM generations to provide 
        feedback on hallucinations.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model, 
        prompt setup, or loading of system prompts, a CustomException is raised 
        with the original exception details.
    """
    global sys_prompts
    try:     
        # INITIALIZE LLM AGENT WITH CHATGROQ
        llm_hallu_fbwriter = ChatGroq(
            model_name="llama-3.1-8b-instant", 
            max_retries=2, temperature=0.2, max_tokens=None,
            api_key=os.environ['GROQ_API_KEY']
        )
        
        # FORCE LLM WITH STRUCTURED OUTPUT
        structured_llm_hallu_fbwriter = llm_hallu_fbwriter.with_structured_output(HallucinationFeedbackDataModel)
        
        # CHECK IF SYS PROMPTS ARE ALREADY INITIALIZED
        if sys_prompts is None:
            # LOAD SYS PROMPTS FROM FILE
            sys_prompts = load_sys_prompts(file_path=sys_prompt_file_path)
            
        # DEFINE THE PROMPT FOR THE HALLUCINATION FEEDBACK WRITER
        hallu_fbwriter_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", sys_prompts['hallucination_feedback_writer_sys_prompt']),
                ("human", "Patient note: \n\n{patient_data} \n\n LLM Generation: {generation}")
            ]
        )
        
        # CHAIN THE PROMPT AND THE AGENT
        hallu_fbwriter_chain = hallu_fbwriter_prompt | structured_llm_hallu_fbwriter
        
        # LOG THE AGENT CREATION
        logging.info("Hallucination Feedback Writer Chain Created")
        
        return hallu_fbwriter_chain
        
    except Exception as e:
        raise CustomException(f"Error in build_hallu_fbwriter_chain: {str(e)}", sys)
    
# FUNCTION TO BUILD THE SOAP REWRITER CHAIN
def build_soap_rewriter_chain():
    """
    Constructs a SOAP note rewriter chain using a language model agent.

    Returns:
    -------
    soap_rewriter_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model agent, ready to process SOAP notes and generate rewritten outputs.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the agent server, 
        language model, or prompt setup, a CustomException is raised with 
        the original exception details.
    """
    global sys_prompts
    try:
        # INITIALIZE OPHTHAL-AGENT-SERVER
        agent_server = "https://csharpmastr--eyomn-ophthal-agent-vllm-serving-serve-llm.modal.run/v1"
        
        # DEFINE TOKEN TO PASS FOR AUTHENTICATION IN CONNECTING WITH THE OPHTHAL AGENT'S SERVER
        auth_token = os.environ['OPHTHAL_AGENT_TOKEN']
        
        # INITIALIZE LLM AGENT WITH ENDPOINT AND AUTH TOKEN
        llm_soap_rewriter = ChatOpenAI(
             model="Llama3-Med42-8B",
            openai_api_key=auth_token,
            openai_api_base=agent_server,
            temperature=0.2
        )
        
        # FORCE LLM WITH STRUCTURED OUTPUT
        structured_llm_soap_rewriter = llm_soap_rewriter.with_structured_output(SummaryRewriterDataModel)
        
        # CHECK IF SYS PROMPTS ARE ALREADY INITIALIZED
        if sys_prompts is None:
            # LOAD SYS PROMPTS FROM FILE
            sys_prompts = load_sys_prompts(file_path=sys_prompt_file_path)
            
        # DEFINE THE PROMPT FOR THE SOAP SUMMARIZER
        soap_rewriter_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", sys_prompts['summary_rewriter_sys_prompt']),
                ("human", sys_prompts['summary_rewriter_human_prompt'])
            ]
        )
        
        # CHAIN THE PROMPT AND THE AGENT
        soap_rewriter_chain = soap_rewriter_prompt | structured_llm_soap_rewriter
        
        # LOG THE AGENT CREATION
        logging.info("Soap Note Rewriter Chain Created")
        
        return soap_rewriter_chain
        
    except Exception as e:
        raise CustomException(f"Error in build_soap_rewriter_chain: {str(e)}", sys)