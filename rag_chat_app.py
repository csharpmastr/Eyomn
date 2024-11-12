import streamlit as st
import requests
import json

# URL of the LangGraph API
API_URL = "https://csharpmastr--eyomns-rag-app-web-endpoint-dev.modal.run"  # Replace with your actual endpoint

# Set up Streamlit UI
st.set_page_config(page_title="LangGraph Chat", layout="centered")

st.title("LangGraph Chat Interface")

# Initialize chat history in session state
if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = []

if "memory" not in st.session_state:
    st.session_state["memory"] = []

# Function to send a question to the LangGraph API and get a response
def send_question_to_langgraph(question):
    try:
        # Define payload
        print("Questions: ", question)
        
        for i in range(0, len(st.session_state["chat_history"]) - 1, 2):
            user_question = st.session_state["chat_history"][i]["message"]
            langgraph_response = st.session_state["chat_history"][i + 1]["message"]
            
            # Add memory in required format, avoiding duplicates
            memory_entry = {"question": user_question, "answer": langgraph_response}
            if memory_entry not in st.session_state["memory"]:
                st.session_state["memory"].append(memory_entry)
            
        print(st.session_state["memory"])           
        payload = {"question": question, "generation": "", "web_search": "", "documents": [], "memory": st.session_state["memory"], "summarized_memory": ""}
        # Make POST request to LangGraph API
        response = requests.post(API_URL, json=payload, timeout=60.0)
        
        # Check if request was successful
        if response.status_code == 200:
            data = response.json()
            print(data)
            return data
        else:
            return f"Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

# Chat input and display
with st.form("chat_form", clear_on_submit=True):
    user_question = st.text_input("Ask your question:", "")
    submit = st.form_submit_button("Send")

# When the user submits a question
if submit and user_question:
    # Display user's question in chat history
    st.session_state["chat_history"].append({"sender": "User", "message": user_question})
    
    # Get response from LangGraph
    response = send_question_to_langgraph(user_question)
    
    # Display LangGraph's response in chat history
    st.session_state["chat_history"].append({"sender": "LangGraph", "message": response})

# Render chat history
for chat in st.session_state["chat_history"]:
    if chat["sender"] == "User":
        st.write(f"**You:** {chat['message']}")
    else:
        st.write(f"**EyomnAi:** {chat['message']}")
