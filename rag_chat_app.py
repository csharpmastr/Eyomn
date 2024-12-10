import streamlit as st
import requests

# URL of EyomnAi API
API_URL = "https://csharpmastr--eyomnai-rag-chat-web-endpoint-dev.modal.run"

# Set up Streamlit UI
st.set_page_config(page_title="EyomnAI Chat", layout="centered")

st.title("EyomnAI Chat Interface")

# Initialize chat history in session state
if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = []

if "memory" not in st.session_state:
    st.session_state["memory"] = []

# Function to send a question to the LangGraph API and get a response
def send_question_to_langgraph(question, userId):
    try:
        # Define payload
        print("Questions: ", question)
            
        #print(st.session_state["memory"])           
        payload = {"messages": [question], 
                   "generation": "",
                   "documents": [],
                   "userId": str(userId),
                   "summarized_memory": ""}
        
        print(f"Payload: {payload}")
        # Make POST request to LangGraph API
        response = requests.post(API_URL, json=payload, timeout=90.0)
        
        # Check if request was successful
        if response.status_code == 200:
            data = response.json()
            #print(data)
            return data
        else:
            return f"Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

# Chat input and display
with st.form("chat_form", clear_on_submit=True):
    user_question = st.text_input("Ask your question:", "")
    userid = st.text_input("Your UserId:", "")
    submit = st.form_submit_button("Send")

# When the user submits a question
if submit and user_question and userid:
    # Display user's question in chat history
    st.session_state["chat_history"].append({"sender": "User", "message": user_question})
    
    # Get response from LangGraph
    response = send_question_to_langgraph(user_question, userid)
    
    # Display LangGraph's response in chat history
    st.session_state["chat_history"].append({"sender": "LangGraph", "message": response})

# Render chat history
for chat in st.session_state["chat_history"]:
    if chat["sender"] == "User":
        st.write(f"**You:** {chat['message']}")
    else:
        st.write(f"**EyomnAi:** {chat['message']}")
