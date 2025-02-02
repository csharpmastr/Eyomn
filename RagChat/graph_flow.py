import sys
from exception import CustomException
from logger import logging
from typing_extensions import TypedDict, Annotated, List
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from langchain_core.messages import AnyMessage, AIMessage, RemoveMessage, HumanMessage
from langchain_google_firestore import FirestoreChatMessageHistory
from langgraph.graph.message import add_messages
from langgraph.graph import START, END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from datetime import datetime

from agents_chains import (
    build_convo_summ_chain, build_rag_generation_chain,
    build_retrieval_grader_chain, build_router_chain,
    build_ques_rewriter_chain, build_hallu_checker_chain,
    build_ans_grader_chain
    
)
from helper_utils import init_internal_retriever, init_firestore_client, init_external_retriever, CounterTracker
from modal_setup import rag_image

# context manager for global imports
with rag_image.imports():
    from langgraph.checkpoint.memory import MemorySaver
    from langgraph.types import Command
    from langchain_core.messages import AnyMessage, AIMessage, RemoveMessage, HumanMessage
    from langchain_google_firestore import FirestoreChatMessageHistory
    from langgraph.graph.message import add_messages
    from langgraph.graph import START, END, StateGraph
    from langgraph.graph.state import CompiledStateGraph
    from typing_extensions import TypedDict, Annotated, List
    from datetime import datetime

# define global object variable
convo_summ_chain = None
internal_retriever = None
rag_gen_chain = None
retrieval_grader_chain = None
router_chain = None
ques_rewriter_chain = None
hallu_checker_chain = None
answer_grader_chain = None
doc_grader = None
transformation_counter = None
firestore_client = None
external_retriever = None
eyomn_memory_saver = None
eyomn_memory = None
counter_tracker = CounterTracker()

# define Graph State to track
class GraphState(TypedDict):
    """
    Represents the state of the graph.

    Attributes:
        messages: list of user messages
        generation: LLM generation
        web_search: whether to add search
        documents: list of documents 
        userId: the current user's Id
        branchId: the current user's branch ID/s
        summarized_memory: summarized memory
        user_role : the role of the current user for specific queries
        knowledge_type : knowledge base that will be used to answer the user's questions
    """
    messages : Annotated[List[AnyMessage], add_messages]
    generation : Annotated[str, "The final response of EyomnAI to the user"]
    documents : Annotated[List[str], "List of Documents to be used as the context for EyomnAI"]
    userId: Annotated[str, "The current user's ID"]
    branchId: Annotated[List[str], "The current user's branch ID/s"]
    summarized_memory: Annotated[str, "The summarized memory of the user's past conversation with EyomnAI"]
    user_role : Annotated[str, "The role of the current user for specific queries (e.g. '0' for Admin, '2' for Doctor)"]
    knowledge_type : Annotated[str, "The type of knowledge base that will be used to answer the user's question"]

# Define nodes for the Graph

# function to update and store the agent's memory
def summarize_convo(state: GraphState):
    try:
        # OBTAIN THE MESSAGES FROM THE STATE AND THE USER ID
        messages = state["messages"]
        userId = state["userId"]
        print("---SUMMARIZE CONVO---")
        
        # LOGIC TO SUMMARIZE THE MESSAGES IF LIST OF MESSAGES IS ">" 6
        if len(messages) > 6:
            # SUMMARIZE THE CONVERSATION USING THE "convo_summ_chain"
            global convo_summ_chain, firestore_client, eyomn_memory_saver
            # CHECK IF "convo_summ_chain" IS ALREADY INITIALIZED
            if convo_summ_chain is None:
                print("---INITIALIZING CONVO SUMM CHAIN---")
                convo_summ_chain = build_convo_summ_chain()
            
            # CHECK IF "firestore_client" IS INITIALIZED
            if firestore_client is None:
                print("---INITIALIZING FIRESTORE CLIENT---")
                firestore_client = init_firestore_client()
            
            # INITIATE SUMMARIZATION OF MESSAGES
            messages_summary = convo_summ_chain.invoke({"conversation": messages})
            
            # CHECK IF "eyomn_memory_saver" IS INITIALIZED
            if eyomn_memory_saver is None:
                print("---INITIALIZING EYOMN MEMORY SAVER---")
                # INITIALIZE "chat_history_saver"
                eyomn_memory_saver = FirestoreChatMessageHistory(
                    session_id= str(datetime.now().strftime('%Y-%m-%d')), 
                    collection=f"user/{userId}/Memory",
                    client=firestore_client
                )
            
            # SAVE THE SUMMARIZED CONVERSATION TO FIRESTORE
            eyomn_memory_saver.add_ai_message(messages_summary.summarized_convo)
            
            print("---MESSAGES IS GREATER THAN 6---")
            
            # DELETE CONVERSATION HISTORY BUT RETAIN THE LAST 2 MESSAGES
            delete_messages = [RemoveMessage(id=m.id) for m in state["messages"][:-2]]
            
            # UPDATE THE STATE WITH THE UPDATED MESSAGES AND DELETE HISTORY
            return {"messages": delete_messages, 
                    "generation": state["generation"]}
        
        # ELSE RETURN JUST THE MESSAGE AND GENERATION
        return {"messages": messages, "generation": state["generation"]}
            
    except CustomException as e:
        raise CustomException(e, sys)

# FUNCTION TO RETRIEVE RELEVANT DOCUMENTS EXTERNALLY
def external_retrieve(state: GraphState):
    print("---EXTERNAL RETRIEVE---")
    messages = state["messages"]
    user_role = state["user_role"]
    branchid = state["branchId"]
    userid = state["userId"]
    
    # RETRIEVE THE LAST MESSAGE 
    last_message = str(messages[-1])
    
    # USE GLOBAL VARIABLES
    global firestore_client, external_retriever
    
    # CHECK IF "firestore_client" IS INITIALIZED
    if firestore_client is None:
        print("---INITIALIZING FIRESTORE CLIENT---")
        firestore_client = init_firestore_client()
        
    # CHECK IF 'data_access' IS INITIALIZED
    if external_retriever is None:
        print("---INITIALIZING EXTERNAL RETRIEVER---")
        external_retriever = init_external_retriever(
            role=user_role,
            branchid=branchid,
            userid=userid,
            fsclient=firestore_client
        )
    
    # RETRIEVE RELEVANT DOCUMENTS USING EXTERNAL RETRIEVER
    external_documents = external_retriever.max_marginal_relevance_search(last_message, k=3)
    
    print(f"---EXTERNAL DOCUMENTS: {external_documents}---")
    
    return {"documents": external_documents, "messages": messages, 
            "knowledge_type": state["knowledge_type"], "user_role": state["user_role"], 
            "userId": userid, "branchId": branchid}


# function to retrieve relevant documents internally
def internal_retrieve(state: GraphState):
    """
    Retrieve documents from vectorstore

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    print("---RETRIEVE---")
    messages = state["messages"]
    last_message = str(messages[-1])
    
    global internal_retriever
    # check if init_internal_retriever function is already initialized
    if internal_retriever is None:
        print("---INITIALIZING INTERNAL RETRIEVER---")
        internal_retriever = init_internal_retriever()
    
    # RETRIEVE RELEVANT DOCUMENTS USING INTERNAL RETRIEVER
    documents = internal_retriever.max_marginal_relevance_search(last_message, k=3)
    
    return {"documents": documents, "messages": messages,
           "knowledge_type": state["knowledge_type"], "user_role": state["user_role"],
           "userId": state["userId"], "branchId": state["branchId"]}

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
    
    global firestore_client, eyomn_memory_saver, convo_summ_chain
    # OBTAIN USERID FROM STATE
    userId = state["userId"]
    
    # CHECK IF "firestore_client" IS INITIALIZED
    if firestore_client is None:
        print("---INITIALIZING FIRESTORE CLIENT---")
        firestore_client = init_firestore_client()
            
    # CHECK IF "eyomn_memory_saver" IS INITIALIZED
    if eyomn_memory_saver is None:
        print("---INITIALIZING EYOMN MEMORY SAVER---")
        # INITIALIZE "chat_history_saver"
        eyomn_memory_saver = FirestoreChatMessageHistory(
            session_id=userId, 
            collection=f"user/{userId}/Memory",
            client=firestore_client,
            encode_message=True
        )
    
    documents = state.get("documents", [])
    messages = state.get("messages", [])
    messages_summary = eyomn_memory_saver.messages # OBTAIN EXISTING MEMORY
    last_message = messages[-1] # OBTAIN THE LAST MESSAGE TO BE ANSWERED
    existing_info = "\n".join([msg.content for msg in messages])  # INITIALIZE EXISTING USER INFORMATION FOR EYOMN'S CONTEXT
    
    # CHECK IF A SUMMARY OF CONVERSATION EXISTS
    if messages_summary:
        print("---MEMORY EXISTS AND LOADED---")
        flat_messages_summary = "\n".join([msg.content for msg in messages_summary])
        
        # IF SUMMARY IS MORE THAN 2, PERFORM SUMMARIZATION
        if len(messages_summary) > 2:
            print("---MEMORY EXISTS AND MORE THAN 2: SUMMARIZING NOW---")
            
            # CHECK IF "convo_summ_chain" IS ALREADY INITIALIZED
            if convo_summ_chain is None:
                print("---Initializing Conversation Summarization Chain---")
                convo_summ_chain = build_convo_summ_chain()
            
            # INITIATE SUMMARIZATION OF MEMORIES FOR EYOMN
            messages_summary = convo_summ_chain.invoke({"$memory": flat_messages_summary, "$chat_history": messages})
        
            # EXISTING USER INFORMATION FOR EYOMN'S CONTEXT
            existing_info = messages_summary.summarized_convo
        else:
            # EXISTING USER INFORMATION FOR EYOMN'S CONTEXT
            existing_info = flat_messages_summary
        
        # APPEND SUMMARY TO MESSAGES
        # messages = [HumanMessage(content=system_message)] + messages    
    
    global rag_gen_chain
    # check if RAG Chain is already initialized
    if rag_gen_chain is None:
        print("---INITIALIZING RAG GENERATION CHAIN---")
        rag_gen_chain = build_rag_generation_chain()
    
    # if "documents" in state and state["documents"]:
    #     documents = state["documents"]
    
    # RAG Generation
    generation = rag_gen_chain.invoke({"context": documents, "question": last_message, "memory": existing_info})
    # else:
    #     documents = ["Respond in a Friendly and Professional Manner."]
    #     generation = rag_gen_chain.invoke({"context": documents, "question": last_message})
    
    # APPEND THE GENERATED RESPOND TO THE MESSAGES
    
    return {"documents": documents, "messages": messages, 
            "generation": generation, "summarized_memory": existing_info,
            "knowledge_type": state["knowledge_type"], "user_role": state["user_role"]}

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
    messages = state["messages"]
    last_message = messages[-1]
    documents = state["documents"]
    knowledge_type = state.get("knowledge_type", "base_knowledge")
    grade = "yes"
    
    global retrieval_grader_chain, doc_grader
    # check if retrieval grader chain is already initialized
    if retrieval_grader_chain is None and doc_grader is None:
        print("---INITIALIZING RETRIEVAL GRADER CHAIN---")
        retrieval_grader_chain = build_retrieval_grader_chain()
        doc_grader = 0
    
    # Score each doc
    filtered_docs = []
    #web_search = "No"
    for d in documents:
        
        if knowledge_type != "external_knowledge":
            grade = retrieval_grader_chain.invoke({"question": last_message.content, "document": d.page_content}).score
        
        # Check Document Relevance
        if grade.lower() == "yes":
            print("---GRADE: DOCUMENT RELEVANT---")
            filtered_docs.append(d)
        else:
            print("---GRADE: DOCUMENT NOT RELEVANT---")
            # We do not include the document in filtered_docs
            # We set a flag to indicate that we want to run web search
            #web_search = "Yes"
            if doc_grader >= 3:
                print("EyomnAI's Response is not Fact-Checked: USE RESPONSE WITH CAUTION")
                return {"documents": filtered_docs, "messages": messages}
            
            doc_grader += 1
            continue
    return {"documents": filtered_docs, "messages": messages,
            "knowledge_type": state["knowledge_type"], "user_role": state["user_role"],
            "userId": state["userId"], "branchId": state["branchId"]}

# optional function to perform web-search
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

# DEFINE CONDITIONAL EDGES

# function to route question to the right knowledge base
def route_question(state: GraphState):
    """
    Route question to base_knowledge, internal_knowledge, or external_knowledge.

    Args:
        state (dict): The current graph state

    Returns:
        str: Next node to call
    """

    print("---ROUTE QUESTION---")
    # OBTAIN NECESSARY VARIABLES FOR ROUTING
    messages = state["messages"] 
    last_message = messages[-1]
    user_role = state["user_role"]
    
    global router_chain
    # check if router chain is already initialized
    if router_chain is None:
        print("---INITIALIZING ROUTER CHAIN---")
        router_chain = build_router_chain()
    
    # INVOKE THE ROUTER CHAIN
    source = router_chain.invoke({"question": last_message, "user_role": user_role})  
    
    # RETURN EXACT 'variable' FOR THE NEXT RETRIEVER
    if source.context == 'base_knowledge':
        print("---ROUTE QUESTION TO USE BASE KNOWLEDGE---")
        # UPDATE KNOWLEDGE TYPE AND ROUTE TO GENERATE
        return Command(update={"knowledge_type": source.context}, goto="generate")
    elif source.context == 'internal_knowledge':
        print("---ROUTE QUESTION TO USE INTERNAL KNOWLEDGE---")
        # UPDATE KNOWLEDGE TYPE AND ROUTE TO INTERNAL RETRIEVER
        return Command(update={"knowledge_type": source.context}, goto="internal retriever")
    elif source.context == "external_knowledge":
        print("---ROUTE QUESTION TO USE EXTERNAL KNOWLEDGE---")
        # UPDATE KNOWLEDGE TYPE AND ROUTE TO EXTERNAL KNOWLEDGE
        return Command(update={"knowledge_type": source.context}, goto="external retriever")


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
    messages = state["messages"]
    last_message = messages[-1]
    
    #if "documents" in state:
    documents = state["documents"]
    
    global ques_rewriter_chain
    # check if question rewriter chain is already initialized
    if ques_rewriter_chain is None:
        print("---INITIALIZING QUESTION REWRITER CHAIN---")
        ques_rewriter_chain = build_ques_rewriter_chain()
       
    # Re-write question
    better_question_content = ques_rewriter_chain.invoke({"question": last_message})
    
    # CREATE A NEW MESSAGE W/ THE SAME MSG ID TO REPLACE THE CURRENT MESSAGE
    better_question = HumanMessage(content=better_question_content, id=last_message.id)
    
    print("---QUESTION TRANSFORMED---")
    print(f'---CURRENT MESSAGES:\n {messages}---')
    
    return {"documents": documents, "messages": [better_question], "knowledge_type": state["knowledge_type"],
            "user_role": state["user_role"], "userId": state["userId"], "branchId": state["branchId"]}

# define the edges of the graph

# FUNCTION TO DETERMINE THE NEXT ROUTE BASED ON THE CURRENT KNOWLEDGE TYPE
def should_retrieve(state: GraphState):
    knowledge_type = state.get("knowledge_type", "")
    
    # CHECK THE CURRENT KNOWLEDGE TYPE BEING USING TO ROUTE TO THE APPROPRIATE NODE
    if knowledge_type and knowledge_type == "base_knowledge":
        return "re-generate"
    elif knowledge_type and knowledge_type == "internal_knowledge":
        return "internal retriever"
    elif knowledge_type and knowledge_type == "external_knowledge":
        return "external retriever" 

def decide_to_generate(state):
    """
    Determines whether to generate an answer, or re-generate a question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """
    
    print("---ASSESS GRADED DOCUMENTS---")
    filtered_documents = state["documents"]
    
    # global transformation_counter
    # # CHECK IF TRANSFORMATION COUNTER IS INITIALIZED
    # if transformation_counter is None:
    #     print("---INITIALIZING TRANSFORMATION COUNTER---")
    #     transformation_counter = 0
    
    if not filtered_documents:
        # All documents have been filtered check_relevance
        # We will re-generate a new query
        print(
            "---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, TRANSFORM QUERY---"
        )
        
        # IF TRANSFORMATION COUNTER IS 3 RETURN GENERATE
        if counter_tracker.get_counter("transformation_attempts") >= 3:
            print("---MAX TRANSFORMATION REACHED, DECISION: GENERATE---")
            counter_tracker.set_counter("transformation_attempts", 0)
            return "generate"
        
        # INCREMENT TRANSFORMATION COUNTER
        counter_tracker.increment_counter("transformation_attempts")
        return "transform_query"
    else:
        # We have relevant documents, so generate answer
        print("---DECISION: GENERATE---")
        return "generate"

# track how many times the hullucination agent checks the generation, and if reaches 3, END the generation
# and flag the user that the generation should be used appropriately. or "Not Fact-Checked"
hallucination_checker_counter = None

# track how many times the answer grader agent checks the generation, and if reaches 3, END the generation
# and flag the user that the generation should be used appropriately. or "Not Fact-Checked"
answer_grader_counter = None

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
    messages = state["messages"]
    last_message = messages[-1]
    documents = state["documents"]
    generation = state["generation"]
    
    # DECLARE GLOBAL VARIABLE TO USE DEFINE VARIABLE OUT OF FUNCTION
    global answer_grader_counter, hallucination_checker_counter, answer_grader_chain, hallu_checker_chain
    
    # CHECK IF HALLUCINATION CHECKER CHAIN IS ALREADY INITIALIZED
    if hallu_checker_chain is None:
        print("---INITIALIZING HALLU CHECKER CHAIN---")
        hallu_checker_chain = build_hallu_checker_chain()
    
    # if hallucination_checker_counter is None or answer_grader_counter is None:
    #         hallucination_checker_counter, answer_grader_counter = (0, 0)
            
    # CHECK FOR HALLUCINATION
    halu_score = hallu_checker_chain.invoke({"documents": documents, "generation": generation}).score
    
    if not documents:
        halu_score = "yes"
    
    if halu_score.lower() == 'yes':
        print("---DECISION: GENERATION IS GROUNDED IN DOCUMENTS---")
        
        # CHECK IF ANSWER IS RELEVANT TO THE QUESTION
        if answer_grader_chain is None:
            print("---Initializing Answer Grader Chain---")
            answer_grader_chain = build_ans_grader_chain()
        
        print("---GRADING GENERATION vs QUESTION---")
        generation_score = answer_grader_chain.invoke({"question": last_message, "generation": generation}).score
        
        if not documents:
            print('---NO DOCUMENTS, SO NO GRADING---')
            print(f"---CURRENT GENERATION: {generation}---")
            generation_score = "yes"
        
        if generation_score.lower() == 'yes':
            print("---DECISION: GENERATION ADDRESSES QUESTION---")
            return "useful"
        else:
            print("---DECISION: GENERATION DOES NOT ADDRESS QUESTION---")
            
            if counter_tracker.get_counter("grader_attempts") >= 3:
                print("---BE CAUTIOUS WITH EYOMNAI's RESPONSE---")
                counter_tracker.set_counter("grader_attempts", 0)
                return "useful"
            
            counter_tracker.increment_counter("grader_attempts")
            print(f"---GRADER COUNT: {counter_tracker.get_counter("grader_attempts")}")
            return "not useful"
    else:
        print("---DECISION: GENERATION IS NOT GROUNDED IN DOCUMENTS, RE-TRY---")
        
        if counter_tracker.get_counter("checker_attempts") >= 3:
            print("---BE CAUTIOUS WITH EYOMNAI's RESPONSE---")
            counter_tracker.set_counter("checker_attempts", 0)
            return "useful"
        
        counter_tracker.increment_counter("checker_attempts")
        print(f"---CHECKER COUNT: {counter_tracker.get_counter("checker_attempts")}")
        return "not supported"    
    

# function connect all nodes with each edges
def construct_rag_graph() -> CompiledStateGraph:
    try:
        workflow = StateGraph(GraphState)
        
        # define the nodes of the graph
        workflow.add_node("router", route_question)
        workflow.add_node("internal retriever", internal_retrieve) # Retrieve INTERNAL Documents
        workflow.add_node("external retriever", external_retrieve) # Retrieve EXTERNAL Documents
        workflow.add_node("grade_documents", grade_docs) # Check Relevance of Retrieved Documents to the Question
        workflow.add_node("generate", generate) # Generate Response to question
        workflow.add_node("transform_query", transform_query) # Transform question if needed
        workflow.add_node("summarize_convo", summarize_convo) # Add Memory to EyomnAi
        
        # connect the nodes through the edges
        
        # User Question -> Router
        workflow.add_edge(START, "router")
        
        # Retrieved Documents -> grade_documents
        workflow.add_edge("external retriever", "grade_documents")
        workflow.add_edge("internal retriever", "grade_documents")
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
        workflow.add_conditional_edges(
            "transform_query", 
            should_retrieve, {
                "re-generate": "generate",
                "internal retriever": "internal retriever",
                "external retriever": "external retriever"
            }
        )
        workflow.add_conditional_edges(
            "generate",
            grade_generation,
            {
                # if grade_generation returned not supported -> generate
                "not supported": "generate",
                # if grade_generation returned useful -> END the graph
                "useful": "summarize_convo",
                # if grade_generation returned not useful -> transform_query
                "not useful": "transform_query",
            },
        )
        
        workflow.add_edge("summarize_convo", END)
        
        # SET A COUNTER FOR CHECKER AND GRADER ATTEMPTS
        counter_tracker.set_counter("checker_attempts", 0)
        counter_tracker.set_counter("grader_attempts", 0)
        counter_tracker.set_counter("transformation_attempts", 0)
        
        global eyomn_memory
        
        # CHECK IF EYOMN'S MEMORY IS ALREADY INITIALIZED
        if eyomn_memory is None:
            print("---INITIALIZING EYOMN'S MEMORY---")
            # INITIALIZE THE MEMORY
            eyomn_memory = MemorySaver()
        
        # compile the graph
        rag_app = workflow.compile(checkpointer=eyomn_memory)
        
        # log the compiled graph
        logging.info("RAG Graph Compiled")
        
        return rag_app
        
    except Exception as e:
        raise CustomException(e, sys)
