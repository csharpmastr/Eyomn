import os
import sys
from pathlib import Path
from exception import CustomException
from logger import logging

from data_models import (
    GradeDocuments, SummarizedMemory, RouteQuery, 
    GradeHallucinations, GradeAnswer
)

from modal_setup import rag_image
from helper_utils import load_sys_prompts

# context manager for global imports
with rag_image.imports():
    from langchain_groq import ChatGroq
    from langchain_mistralai import ChatMistralAI
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser

sys_prompts = None

# define sys prompts file path
sys_prompts_file_path = Path('/sys_prompts.yaml')

# function to build the document retrieval grader chain
def build_retrieval_grader_chain():
    """
    Constructs a retrieval grader chain using the ChatGroq model.

    Parameters:
    ----------
    system_prompt : str
        A string that serves as the system message for the ChatGroq model, providing 
        context or instructions for the agent.

    Returns:
    retrieval_grader_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model agent, ready to process inputs and generate evaluations of retrieved 
        documents.

    Raises:
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the retrieval grader chain, a CustomException is raised with the 
        original exception details.
    """
    global sys_prompts
    try:
        # initialize LLM agent from ChatGroq
        llm_retrieval_grader = ChatGroq(model_name="llama-3.1-8b-instant", 
                                max_retries=2, temperature=0.0, max_tokens=50,
                                api_key=os.environ['GROQ_API_KEY'])
        
        # bind with a structured output
        structured_llm_grader = llm_retrieval_grader.with_structured_output(GradeDocuments)
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        retrieval_grader_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", sys_prompts["retrieval_grader_sys_prompt"]),
                    ("human", "Retrieved document: \n\n {document} \n\n User question: {question}"),
                ]
            )
        
        # chain the llm and prompt
        retrieval_grader_chain = retrieval_grader_prompt | structured_llm_grader
        
        # log the agent creation
        logging.info("Retrieval Grader Chain Created")
        
        return retrieval_grader_chain
    except Exception as e:
        raise CustomException(f"Error in build_retrieval_grader_chain: {str(e)}", sys)


# Function to build the rag chain
def build_rag_generation_chain():
    """
    Constructs a Retrieval-Augmented Generation (RAG) chain for generating responses 
    based on retrieved documents.

    Returns:
    -------
    rag_generation_chain : Chain
        A chain object that combines the prompt template, the language model generator, 
        and an output parser, ready to generate responses based on retrieved documents.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the RAG generation chain, a CustomException is raised with the 
        original exception details.
    """
    global sys_prompts
    try:
        #prompts = hub.pull("rlm/rag-prompt", api_key=os.environ['LANGCHAIN_API_KEY'])
    
        llm_generator = ChatGroq(model_name="llama-3.3-70b-versatile", 
                                temperature=0.4,
                                api_key=os.environ['GROQ_API_KEY'])
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        rag_gen_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", sys_prompts["rag_generation_sys_prompt"])
            ]
        )
        
        # chain the llm and prompt
        rag_generation_chain = rag_gen_prompt | llm_generator
        
        # log the agent creation
        logging.info("RAG Generation Chain Created")
        
        return rag_generation_chain
    except Exception as e:
        raise CustomException(e, sys)


# function to build the conversation history summarizer chain
def build_convo_summ_chain():
    """
    Constructs a conversation summarization chain using the ChatGroq model.

    Parameters:
    ----------
    system_prompt : str
        A string that serves as the system message for the ChatGroq model, providing 
        context or instructions for the summarization task.

    Returns:
    -------
    convo_summ_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model summarizer, ready to process conversation inputs and generate summaries.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the conversation summarization chain, a CustomException is raised 
        with the original exception details.
    """
    global sys_prompts
    try:
        llm_summarizer = ChatMistralAI(model_name="mistral-large-latest", temperature=0.2,
                             api_key=os.environ['MISTRAL_API_KEY'])
        
        # bind with a structured output
        structured_llm_summarizer = llm_summarizer.with_structured_output(SummarizedMemory)
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        convo_summ_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", sys_prompts["convo_summ_sys_prompt"])
                ]
            )
        
        # chain the llm and prompt
        convo_summ_chain = convo_summ_prompt | structured_llm_summarizer
        
        # log the agent creation
        logging.info("Conversation History Summarizer Chain Created")
        
        return convo_summ_chain
    except Exception as e:
        raise CustomException(e, sys)


# function to build the router chain
def build_router_chain():
    """
    Constructs a router chain using the ChatGroq model.

    Parameters:
    ----------
    system_prompt : str
        A string that serves as the system message for the ChatGroq model, providing 
        context or instructions for the routing task.

    Returns:
    -------
    convo_summ_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model router, ready to process user questions and generate routing outputs.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the router chain, a CustomException is raised with the 
        original exception details.
    """
    global sys_prompts
    try:
        llm_router = ChatMistralAI(model_name="mistral-large-latest", 
                             temperature=0.1, max_tokens=50,
                             api_key=os.environ['MISTRAL_API_KEY'])
        
        # bind with a structured output
        structured_llm_router = llm_router.with_structured_output(RouteQuery)
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        router_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", sys_prompts["router_sys_prompt"]),
                    ("human", "{question}"),
                ]
            )
        
        # chain the llm and prompt
        router_chain = router_prompt | structured_llm_router
        
        # log the agent creation
        logging.info("Router Chain Created")
        
        return router_chain
    except Exception as e:
        raise CustomException(e, sys)
    

# function to build the hallucination checker chain
def build_hallu_checker_chain():
    """
    Constructs a hallucination checker chain using the ChatGroq model.

    Parameters:
    ----------
    system_prompt : str
        A string that serves as the system message for the ChatGroq model, providing 
        context or instructions for the hallucination checking task.

    Returns:
    -------
    hallu_checker_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model checker, ready to process inputs and evaluate the grounding of LLM 
        generations against the provided facts.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the hallucination checker chain, a CustomException is raised 
        with the original exception details.
    """
    global sys_prompts
    try:
        llm_hallu_checker = ChatGroq(model_name="llama-3.3-70b-versatile", 
                             temperature=0.1, max_tokens=50,
                             api_key=os.environ['GROQ_API_KEY'])
        
        # bind with a structured output
        structured_llm_hallu_checker = llm_hallu_checker.with_structured_output(GradeHallucinations)
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        hullucination_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", sys_prompts["hallu_checker_sys_prompt"]),
                    ("human", "Set of facts: \n\n {documents} \n\n LLM generation: {generation}"),
                ]
            )
        
        # chain the llm and prompt
        hallu_checker_chain = hullucination_prompt | structured_llm_hallu_checker
        
        # log the agent creation
        logging.info("Hallucination Checker Chain Created")
        
        return hallu_checker_chain
    except Exception as e:
        raise CustomException(e, sys)


# function to build the Answer Grader chain
def build_ans_grader_chain():
    """
    Constructs an answer grading chain using the ChatGroq model.

    Parameters:
    ----------
    system_prompt : str
        A string that serves as the system message for the ChatGroq model, providing 
        context or instructions for the answer grading task.

    Returns:
    -------
    ans_grader_chain : Chain
        A chain object that combines the prompt template and the structured language 
        model grader, ready to process inputs and evaluate the quality of LLM 
        generations against user questions.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the answer grading chain, a CustomException is raised with the 
        original exception details.
    """
    global sys_prompts
    try:
        llm_ans_grader = ChatGroq(model_name="llama-3.1-8b-instant", 
                             temperature=0.0, max_tokens=50,
                             api_key=os.environ['GROQ_API_KEY'])
        
        # bind with a structured output
        structured_llm_ans_grader = llm_ans_grader.with_structured_output(GradeAnswer)
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        ans_grader_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", sys_prompts["ans_grader_sys_prompt"]),
                    ("human", "User question: \n\n {question} \n\n LLM generation: {generation}"),
                ]
            )
        
        # chain the llm and prompt
        ans_grader_chain = ans_grader_prompt | structured_llm_ans_grader
        
        # log the agent creation
        logging.info("Answer Grader Chain Created")
        
        return ans_grader_chain
    except Exception as e:
        raise CustomException(e, sys)


# function to build the Question Rewriter chain
def build_ques_rewriter_chain():
    """
    Constructs a question rewriter chain using the ChatGroq model.

    Parameters:
    ----------
    system_prompt : str
        A string that serves as the system message for the ChatGroq model, providing 
        context or instructions for the question rewriting task.

    Returns:
    -------
    ques_rewriter_chain : Chain
        A chain object that combines the prompt template and the language model 
        rewriter, ready to process inputs and generate improved questions.

    Raises:
    ------
    CustomException
        If any error occurs during the initialization of the language model or the 
        creation of the question rewriter chain, a CustomException is raised with 
        the original exception details.
    """
    global sys_prompts
    try:
        llm_ques_rewriter = ChatGroq(model_name="llama-3.1-8b-instant", 
                             max_retries=2, temperature=0.0, max_tokens=150,
                             api_key=os.environ['GROQ_API_KEY'])
        
        # check if sys prompts is already initialized
        if sys_prompts is None:
            sys_prompts = load_sys_prompts(file_path=sys_prompts_file_path)
        
        # Prompt for the Retrieval Grader Agent
        ques_rewriter_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", sys_prompts["ques_rewriter_sys_prompt"]),
                    (
                        "human",
                        "Here is the initial question: \n\n {question} \n Formulate an improved question.",
                    ),
                ]
            )
        
        # chain the llm and prompt
        ques_rewriter_chain = ques_rewriter_prompt | llm_ques_rewriter | StrOutputParser()
        
        # log the agent creation
        logging.info("Question Rewriter Chain Created")
        
        return ques_rewriter_chain
    except Exception as e:
        raise CustomException(e, sys)
