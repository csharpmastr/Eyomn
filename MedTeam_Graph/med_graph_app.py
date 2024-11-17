import modal
from med_graph_flow import construct_med_graph
from med_modal_setup import app
import sys
from med_graph_flow import GraphState
from exception import CustomException

# FUNCTION TO IMPLEMENT THE WEB-ENDPOINT
@app.function(gpu="L4", concurrency_limit=15, container_idle_timeout=40)
@modal.web_endpoint(method="POST", docs=True)
def web_endpoint(patient_data: GraphState):
    try:
        med_graph_app = construct_med_graph()
        output = med_graph_app.invoke({"patient_data": patient_data['patient_data']})
        print(output)
        return output['markdown_output']
    except Exception as e:
        raise CustomException(e, sys)

# function to send questions to the graph
# @app.function(gpu="L4", retries=2)
# def send_data_to_graph(patientdata: str):
#     """
#     Sends the Patient Data to the Medical Team Agent and 
#     returns the SOAP Note

#     Parameters:
#     patient_data (str): The patient data to be sent.

#     """
#     from pprint import pprint
#     #import sqlite3
#     med_graph_app = construct_med_graph()
#     for output in med_graph_app.stream({"patient_data": patientdata}):
#         for key, value in output.items():
#             pprint(f"Node '{key}':")
#         pprint(f"Output:  {output}\n")
#         pprint("\n---\n")
        
#     # Final generation
#     pprint(value["markdown_output"])
    

