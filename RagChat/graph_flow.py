import sys
from exception import CustomException
from logger import logging

from agents_chains import (
    build_convo_summ_chain, build_rag_generation_chain,
    build_retrieval_grader_chain, build_router_chain,
    build_ques_rewriter_chain, build_hallu_checker_chain,
    build_ans_grader_chain
    
)
from helper_utils import retrieve_vector_store
from modal_setup import rag_image

# context manager for global imports
with rag_image.imports():
    from langchain_core.documents import Document
    from langgraph.graph import END, StateGraph
    from langgraph.graph.state import CompiledStateGraph
    from typing_extensions import TypedDict
    from typing import List, Dict

# define global object variable
convo_summ_chain = None
vectorstore = None
rag_gen_chain = None
retrieval_grader_chain = None
router_chain = None
ques_rewriter_chain = None
hallu_checker_chain = None
answer_grader_chain = None

# define Graph State to track
class GraphState(TypedDict):
    """
    Represents the state of the graph.

    Attributes:
        question: question
        generation: LLM generation
        web_search: whether to add search
        documents: list of documents 
        memory: list of past conversation histories
        summarized_memory: summarized memory
    """
    question : str
    generation : str
    web_search : str
    documents : List[str]
    memory: List[Dict[str, str]]
    summarized_memory: str

# Define nodes for the Graph

# function to update the agent's memory
def update_memory(state: GraphState, question: str, generation: str):
    """
    Updates memory with the latest question and generation. Summarizes if
    memory exceeds the set threshold.

    Args:
        state (GraphState): Current graph state containing memory.
        question (str): The user's question.
        generation (str): The generated response.
    """
    try:
        # Initialize memory and summarized_memory if it doesn't exist
        if "memory" not in state:
            print("---Initialize Memory---")
            state["memory"] = []
            
        if "summarized_memory" not in state:
            print("---Initialize Summarized Memory---")
            state["summarized_memory"] = []
            
        # Append the new Q&A to memory
        state["memory"].append({"question": question, "answer": generation})
        print("---MEMORY UPDATED---")
        
        # log conversation 
        logging.info(f"MEMORY UPDATED")
        
         
        # Check if memory length has reached the threshold for summarization
        if len(state["memory"]) >= 6:  # Summarize after every 6 exchanges
            print("---SUMMARIZING MEMORY---")
            memory_text = " ".join([f"Question: {item['question']} Answer: {item['answer']}" for item in state["memory"]])
            
            global convo_summ_chain
            # check if convo summarization chain is already initialized
            if convo_summ_chain is None:
                print("---Initializing Conversation Summarization Chain---")
                convo_summ_chain = build_convo_summ_chain()
            
            # Summarize memory
            summary = convo_summ_chain.invoke({"text": memory_text})
            
            # Append the summary to the summarized_memory field
            state["summarized_memory"] += f" {summary.summarized_convo}"
            print("---CONVERSATION SUMMARY UPDATED---")
            
            # log summarized conversation
            logging.info(f"SuMMARIZED CONVERSATION: {summary.summarized_convo}")
            
            # Re-initialize the memory to an empty list
            state["memory"] = []
    except CustomException as e:
        raise CustomException(e, sys)

# function to retrieve relevant documents
def retrieve(state: GraphState):
    """
    Retrieve documents from vectorstore

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    print("---RETRIEVE---")
    question = state["question"]
    
    global vectorstore
    # check if vectorstore function is already initialized
    if vectorstore is None:
        print("---Initializing Vectorstore---")
        vectorstore = retrieve_vector_store()
    
    # Retrieve relevant docs
    documents = vectorstore.max_marginal_relevance_search(question, k=5)
    return {"documents": documents, "question": question}

# function to generate response to the question
def generate(state: GraphState):
    """
    Generate answer using RAG on retrieved documents

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, generation, that contains LLM generation
    """
    print("---GENERATE---")
    question = state["question"]
    
    # check if there is an existing memory
    if "memory" in state and state["memory"]:
        print("---Adding Existing Memory to Context---")
        memory_text = " ".join([f"Question: {item['question']} Answer: {item['answer']}" for item in state["memory"]])
        state['documents'].append(Document(page_content=memory_text))
    
    global rag_gen_chain
    # check if RAG Chain is already initialized
    if rag_gen_chain is None:
        print("---Initializing RAG Chain---")
        rag_gen_chain = build_rag_generation_chain()
    
    if "documents" in state and state["documents"]:
        documents = state["documents"]
    
        # RAG Generation
        generation = rag_gen_chain.invoke({"context": documents, "question": question})
        
    else:
        documents = ["Respond in a Friendly and Professional Manner."]
        generation = rag_gen_chain.invoke({"context": documents, "question": question})
    
    return {"documents": documents, "question": question, "generation": generation}

# function to grade the retrieved documents
def grade_docs(state):
    """
    Determines whether the retrieved documents are relevant to the question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    """
    
    print("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
    question = state["question"]
    documents = state["documents"]
    
    global retrieval_grader_chain
    # check if retrieval grader chain is already initialized
    if retrieval_grader_chain is None:
        print("---Initializing Retrieval Grader Chain---")
        retrieval_grader_chain = build_retrieval_grader_chain()
    
    # Score each doc
    filtered_docs = []
    #web_search = "No"
    for d in documents:
        score = retrieval_grader_chain.invoke({"question": question, "document": d.page_content})
        grade = score.score
        # Check Document Relevance
        if grade.lower() == "yes":
            print("---GRADE: DOCUMENT RELEVANT---")
            filtered_docs.append(d)
        else:
            print("---GRADE: DOCUMENT NOT RELEVANT---")
            # We do not include the document in filtered_docs
            # We set a flag to indicate that we want to run web search
            #web_search = "Yes"
            continue
    return {"documents": filtered_docs, "question": question}

# optional functio to perform web-search
#def web_search(state):

    # Web search based on the question

    # Args:
    #     state (dict): The current graph state

    # Returns:
    #     state (dict): Appended web results to documents
    
    # print("---WEB SEARCH---")
    # question = state["question"]
    # documents = state["documents"]
    
    # # Web search
    # docs = web_search_tool.invoke({"query": question})
    # web_results = "\n".join([d["content"] for d in docs])
    # web_results = Document(page_content=web_results)
    # if documents is not None:
    #     documents.append(web_results)
    # else:
    #     documents = [web_results]
    # return {"documents": documents, "question": question}


# Define the conditional edges

# function to route question to the right knowledge base
def route_question(state: GraphState):
    """
    Route question to acquired_knowledge or RAG.

    Args:
        state (dict): The current graph state

    Returns:
        str: Next node to call
    """

    print("---ROUTE QUESTION---")
    question = state["question"]
    
    global router_chain
    # check if router chain is already initialized
    if router_chain is None:
        print("---Initializing Router Chain---")
        router_chain = build_router_chain()
    
    source = router_chain.invoke({"question": question})  
    if source.context == 'acquired_knowledge':
        print("---ROUTE QUESTION TO USE ACQUIRED KNOWLEDGE---")
        return "acquired_knowledge"
    elif source.context == 'vectorstore':
        print("---ROUTE QUESTION TO RAG---")
        return "vectorstore"


# function to transform the question if LLM is unable to generate a correct answer
def transform_query(state):
    """
    Transform the query to produce a better question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates question key with a re-phrased question
    """
    print("---TRANSFORM QUERY---")
    question = state["question"]
    
    #if "documents" in state:
    documents = state["documents"]
    
    global ques_rewriter_chain
    # check if question rewriter chain is already initialized
    if ques_rewriter_chain is None:
        print("---Initializing Question Rewriter Chain---")
        ques_rewriter_chain = build_ques_rewriter_chain()
    
    # Re-write question
    better_question = ques_rewriter_chain.invoke({"question": question})
    return {"documents": documents, "question": better_question}

# define the edges of the graph
def decide_to_generate(state):
    """
    Determines whether to generate an answer, or re-generate a question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """
    
    print("---ASSESS GRADED DOCUMENTS---")
    #question = state["question"]
    filtered_documents = state["documents"]
    
    if not filtered_documents:
        # All documents have been filtered check_relevance
        # We will re-generate a new query
        print(
            "---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, TRANSFORM QUERY---"
        )
        return "transform_query"
    else:
        # We have relevant documents, so generate answer
        print("---DECISION: GENERATE---")
        return "generate"

# Conditional Edge
def grade_generation(state: GraphState):
    """
    Determines whether the generation is grounded in the document and answers question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Decision for next node to call
    """
    print("---CHECK HALLUCINATIONS---")
    question = state["question"]
    documents = state["documents"]
    generation = state["generation"]
    
    if documents[0] != "Respond in a Friendly and Professional Manner.":
        
        global hallu_checker_chain
        # check if hallucination checker chain is already initialized
        if hallu_checker_chain is None:
            print("---Initializing Hallucination Checker Chain---")
            hallu_checker_chain = build_hallu_checker_chain()
        
        # Check Hallucination
        score = hallu_checker_chain.invoke({"documents": documents, "generation": generation})
        grade = score.score
        # track how many times the hullicination agent checks the generation, and if reaches 5, END the generation
        # and flag the user that the generation should be used appropriately. or "Not Fact-Checked"
        hallucination_checker_counter = 0
    
        # Check Hallucination
        if grade.lower() == "yes":
            print("---DECISION: GENERATION IS GROUNDED IN DOCUMENTS---")
            # Check if Question Relevant to Answer
            print("---GRADE GENERATION vs QUESTION---")
            
            global answer_grader_chain
            # check if answer grader chain is already initialized
            if answer_grader_chain is None:
                print("---Initializing Answer Grader Chain---")
                answer_grader_chain = build_ans_grader_chain()
            
            score = answer_grader_chain.invoke({"question": question,"generation": generation})
            grade = score.score

            if grade.lower() == "yes":
                print("---DECISION: GENERATION ADDRESSES QUESTION---")
                # update memory with the final and graded generation
                update_memory(state, question, generation)
                return "useful"
            else:
                print("---DECISION: GENERATION DOES NOT ADDRESS QUESTION---")
                return "not useful"
        else:
            print("---DECISION: GENERATION IS NOT GROUNDED IN DOCUMENTS, RE-TRY---")
            hallucination_checker_counter += 1
            
            if hallucination_checker_counter >= 5:
                print("LLM's Response is not Fact-Checked: USE WITH CAUTION")
                return "useful"
            return "not supported"
    
    else:
        print("---DECISION: RESPONDING IN A FRIENDLY MANNER---")
        print("---GRADE GENERATION vs QUESTION---")
        update_memory(state, question, generation)
        return "useful"


# function connect all nodes with each edges
def construct_rag_graph() -> CompiledStateGraph:
    try:
        workflow = StateGraph(GraphState)
        
        # define the nodes of the graph
        workflow.add_node("retrieve", retrieve) # Retrieve documents
        workflow.add_node("grade_documents", grade_docs) # Check Relevance of Retrieved Documents to the Question
        workflow.add_node("generate", generate) # Generate Response to question
        workflow.add_node("transform_query", transform_query) # Transform question if needed
        
        # connect the nodes through the edges
        
        # User Question -> Router
        workflow.set_conditional_entry_point(
            route_question,
            {
                # if Router returned acquired_knowledge -> generate
                "acquired_knowledge": "generate",
                # if Router returned vectorstore -> retrieve
                "vectorstore": "retrieve"
            },
        )
        # Retrieved Documents -> grade_documents
        workflow.add_edge("retrieve", "grade_documents")
        workflow.add_conditional_edges(
            "grade_documents",
            decide_to_generate,
            {
                # if decide_to_generate returned transform_query -> transform_query
                "transform_query": "transform_query",
                # if decide_to_generate returned generate -> generate
                "generate": "generate",
            },
        )
        
        # Transform Query -> Retrieved Documents
        workflow.add_edge("transform_query", "retrieve")
        workflow.add_conditional_edges(
            "generate",
            grade_generation,
            {
                # if grade_generation returned not supported -> generate
                "not supported": "generate",
                # if grade_generation returned useful -> END the graph
                "useful": END,
                # if grade_generation returned not useful -> transform_query
                "not useful": "transform_query",
            },
        )
        
        # compile the graph
        rag_app = workflow.compile()
        
        # log the compiled graph
        logging.info("RAG Graph Compiled")
        
        return rag_app
        
    except Exception as e:
        raise CustomException(e, sys)