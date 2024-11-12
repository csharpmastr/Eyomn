import modal
from graph_flow import construct_rag_graph
from modal_setup import app
import sys
from graph_flow import GraphState
from exception import CustomException

# function to implement web endpoint
@app.function()
@modal.web_endpoint(method="POST", docs=True)
def web_endpoint(state: GraphState):
    try:
        rag_app = construct_rag_graph()
        output = rag_app.invoke({"question": state["question"]})
        print(output)
        return output["generation"]
    except Exception as e:
        raise CustomException(e, sys)

# function to send questions to the graph
@app.function(gpu="L4", retries=2)
def send_question_to_graph(question: str):
    """
    Sends a question to the RAG graph and returns the response.

    Parameters:
    question (str): The question to be sent.

    Returns:
    -------
    response (str): The response generated by the RAG graph.
    """
    from pprint import pprint
    #import sqlite3
    rag_app = construct_rag_graph()
    for output in rag_app.stream({"question": question}):
        for key, value in output.items():
            pprint(f"Node '{key}':")
        pprint(f"Output:  {output}\n")
        pprint("\n---\n")
        
    # Final generation
    pprint(value["generation"])
    
