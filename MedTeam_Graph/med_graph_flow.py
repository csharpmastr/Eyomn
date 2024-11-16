import sys
from exception import CustomException
from logger import logging

from helper_utils import build_feedback_parser
from med_data_models import SummaryWriterDataModel
from med_agent_chains import (
    build_note_summarizer_chain, build_hallu_grader_chain,
    build_hallu_fbwriter_chain, build_soap_rewriter_chain
)

from med_modal_setup import medteam_image

# SETUP CONTEXT MANAGER FOR GLOBAL IMPORTS
with medteam_image.imports():
    from langgraph.graph.state import CompiledStateGraph
    from langgraph.graph import END, StateGraph, START
    from typing_extensions import TypedDict
    from typing import Optional, List, Dict

# DEFINE VARIABLE CHAIN FOR GLOBAL USE
note_summarizer_chain = None
hallu_grader_chain = None
hallu_fbwriter_chain = None
soap_rewriter_chain = None

# DEFINE HELPER FUNCTION FOR GLOBAL USER
feedback_parser = None

# DEFINE GRAPH STATE TO TRACK
class GraphState(TypedDict):
    patient_data: str
    summarized_data: SummaryWriterDataModel
    halu_score: int
    feedback: Optional[List[Dict[str, str]]]
    markdown_output: str

# DEFINE NODES OF THE GRAPH

# FUNCTION TO GENERATE SOAP SUMMARIES
def summarize(state: GraphState):
    """
    Generate a summarized SOAP note based on the initial patient data

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, summarized_data, that contains OMAA agent
    """
    print("--OPHTHALMIC MEDICAL ASSISTANT AGENT IN ACTION--")
    patient_data = state['patient_data']
    
    global note_summarizer_chain
    # CHECK IF SOAP SUMMARIZER CHAIN IS ALREADY INITIALIZED
    if note_summarizer_chain is None:
        note_summarizer_chain = build_note_summarizer_chain()
    
    print("--SUMMARIZING PATIENT DATA--")
    # PERFORM SUMMARIZING
    summarized_data = note_summarizer_chain.invoke({"patient_note": patient_data})
    
    return {"patient_data": patient_data, "summarized_data": summarized_data}

# FUNCTION TO GRADE SOAP SUMMARIES
def hallu_grader(state:GraphState):
    """
    Grade the summary written based on how it is grounded in the patient data

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Hallucination score of the summarized SOAP note
    """
    print("--FEEDBACK GRADER AGENT IN ACTION--")
    print("---GRADING SUMMARIES---")
    patient_data = state['patient_data']
    summarized_data = state['summarized_data']
    
    global hallu_grader_chain
    # CHECK IF HALLUCINATION GRADER CHAIN IS ALREADY INITIALIZED
    if hallu_grader_chain is None:
        hallu_grader_chain = build_hallu_grader_chain()
    
    # UNPACK SUMMARIZED DATA
    llm_generation = "".join([f"{key.upper()}: {item}\n" for key, item in summarized_data.model_dump().items()])
    
    # GRADE SOAP SUMMARIES
    hallucination_score = hallu_grader_chain.invoke({'patient_data': patient_data, 'generation': llm_generation})
    
    #print(f"Hallucination Score: {hallucination_score.score}")
    return {"halu_score": hallucination_score.score}

# FUNCTION TO WRITE FEEDBACK ON SOAP SUMMARIES
def feedback_writer(state: GraphState):
    """
    Provide a written feedback based on how the written summary is grounded in the patient data

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Hallucination feedback of the summarized SOAP note
    """
    print("--FEEDBACK WRITER AGENT IN ACTION--")
    print("---WRITING FEEDBACK FOR SUMMARIES---")
    patient_data = state['patient_data']
    summarized_data = state['summarized_data']
    
    global hallu_fbwriter_chain
    # CHECK IF HALLUCINATION FEEDBACK WRITER CHAIN IS ALREADY INITIALIZED
    if hallu_fbwriter_chain is None:
        hallu_fbwriter_chain = build_hallu_fbwriter_chain()
    
    # UNPACK SUMMARIZED DATA
    llm_generation = "".join([f"{key.upper()}: {item}\n" for key, item in summarized_data.model_dump().items()])
    
    # WRITE FEEDBACK ON SOAP SUMMARIES
    hallucination_feedback = hallu_fbwriter_chain.invoke({'patient_data': patient_data, 'generation': llm_generation})
    
    #print(f"Feedback on Summary: {hallucination_feedback.feedback}")
    return {"feedback": hallucination_feedback.feedback}

# FUNCTION TO REWRITE SOAP SUMMARIES
def rewrite(state: GraphState):
    """
    Rewrite the summarized SOAP note based on the first summarized SOAP note

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Rewritten summarized SOAP note
    """
    print("--OPHTHALMIC MEDICAL REWRITER AGENT IN ACTION--")
    print("--REWRITING SUMMARIZED PATIENT DATA--")
    
    # OBTAIN DATA TO REWRITE
    patient_data = state['patient_data']
    summarized_data = state['summarized_data']
    
    global feedback_parser
    # CHECK IF FEEDBACK PARSER IS ALREADY INITIALIZED
    if feedback_parser is None:
        feedback_parser = build_feedback_parser()
    
    feedback_summary = feedback_parser(state)
    
    global soap_rewriter_chain
    # CHECK IF SOAP REWRITER CHAIN IS ALREADY INITIALIZED
    if soap_rewriter_chain is None:
        soap_rewriter_chain = build_soap_rewriter_chain()
    
    # PERFORM REWRITE
    summarized_data = soap_rewriter_chain.invoke({"raw_patient_note": patient_data,
                                        "subjective": summarized_data.subjective,
                                         "objective": summarized_data.objective,
                                         "assessment": summarized_data.assessment,
                                         "plan": summarized_data.plan,
                                         "subjective_feedback": feedback_summary.get('subjective'),
                                         "objective_feedback": feedback_summary.get('objective'),
                                         "assessment_feedback": feedback_summary.get('assessment'),
                                         "plan_feedback": feedback_summary.get('plan')})
        
    return {"summarized_data": summarized_data}

# FUNCTION TO RETURN THE FINAL SUMMARY
def return_summary(state: GraphState):
    """
    Return the summarized SOAP note to the user.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): The summarized SOAP note
    """
    print("--RETURNING SUMMARIZED DATA TO USER--")
    
    # EXTRACT SUMMARIZED DATA
    summarized_data = state['summarized_data']
    
    # CREATE A MARKDOWN FORMATTEDD STRING
    markdown_output = "# Summarized Patient Note\n\n"
    
    # Assuming summarized_data has attributes like subjective, objective, assessment, and plan
    markdown_output += f"## Subjective\n{summarized_data.subjective}\n\n"
    markdown_output += f"## Objective\n{summarized_data.objective}\n\n"
    markdown_output += f"## Assessment\n{summarized_data.assessment}\n\n"
    markdown_output += f"## Plan\n{summarized_data.plan}\n\n"
    
    # Include hallucination score
    markdown_output += f"**Hallucination Score**: {state['halu_score']}\n"
    
    return {"markdown_output": markdown_output, "halu_score": state['halu_score']}

# FUNCTION TO CHECK IF SUMMARY IS GOOD TO RETURN TO THE USER
hallu_num_check = 0
def decide_to_return(state: GraphState):
    """
    Determines whether to rewrite the summary or return to the user.

    Args:
        state (dict): The current graph state

    Returns:
        str: Decision for next node to call
    """
    print("---DECIDING WHETHER TO REWRITE OR TO END---")
    halu_score = state['halu_score']
    
    global hallu_num_check
    hallu_num_check += 1
    if halu_score > 7:
        print("---DECISION: SUMMARY IS GROUNDED IN PATIENT DATA---")

        return "useful"
    else:
        print("---DECISION: SUMMARY IS NOT GROUNDED IN PATIENT DATA, RE-TRY---")
        
        if hallu_num_check >= 4:
                print("EyomnAI's Response is not Fact-Checked: USE SUMMARIZED SOAP WITH CAUTION")
                return "useful"
        
        return "rewrite"

# FUNCTION TO CONNECT ALL NODES IN EACH EDGES
def construct_med_graph() -> CompiledStateGraph:
    try:
        medflow = StateGraph(GraphState)
        
        # ADD NODES TO THE GRAPH
        medflow.add_node("summarize", summarize) # SUMMARIZE GIVEN PATIENT DATA
        medflow.add_node("grade_summary", hallu_grader) # CHECK IF MEDICAL ASSISTANT HALLUCINATES
        medflow.add_node("write_feedback", feedback_writer) # WRITE FEEDBACK ABOUT WRITTEN SUMMARY
        medflow.add_node("rewrite", rewrite) # GENERATE RESPONSE TO QUESTION
        medflow.add_node("return_summary", return_summary) # RETURN FINAL SUMMARY AS MARKDOWN
        
        # ADD EDGES TO CONNECT ALL NODES
        medflow.add_edge(START, "summarize") # START -> write summary
        medflow.add_edge("summarize", "grade_summary")
        medflow.add_conditional_edges(
            "grade_summary", 
            decide_to_return,
            {
                "rewrite": "write_feedback",
                "useful": 'return_summary'
            }
        )
        medflow.add_edge("write_feedback", "rewrite")
        medflow.add_edge("rewrite", "grade_summary")
        medflow.add_edge("return_summary", END)
        
        # COMPILE THE GRAPH
        medteam_graph = medflow.compile()
        
        # LOG THE COMPILED GRAPH
        logging.info("Medical Team Compiled")
        
        return medteam_graph
    except Exception as e:
        raise CustomException(e, sys)
