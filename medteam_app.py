import streamlit as st
import requests

# Streamlit app
def main():
    # Set page configuration
    st.set_page_config(page_title="EyomnAI: Multi-Agent Medical Team", layout="centered")
    
    # App title
    st.title("EyomnAI: Multi-Agent Medical Team")
    
    # Input Section
    st.subheader("Input Text")
    user_input = st.text_area("Enter your long string here:", height=200, help="Paste your long string here.")

    # API URL
    api_url = st.text_input("API URL", "https://csharpmastr--eyomnai-medical-team-agent-web-endpoint-dev.modal.run", help="Enter the API endpoint to connect to.")

    # Submit button
    if st.button("Submit"):
        if not user_input.strip():
            st.error("Input string cannot be empty!")
        elif not api_url.strip():
            st.error("API URL cannot be empty!")
        else:
            st.info("Sending your request to the API...")
            try:
                user_input = {"patient_data": user_input, "summarized_data": {
                                                                "subjective": "",
                                                                "objective": "",
                                                                "assessment": "",
                                                                "plan": ""
                                                                }, "halu_score": 10, "feedback": [], "markdown_output": ""}
                # API request
                response = requests.post(api_url, json=user_input)
                
                # Handle response
                if response.status_code == 200:
                    markdown_output = response.json()
                    
                    if markdown_output:
                        st.subheader("Rendered Markdown Output")
                        st.markdown(markdown_output, unsafe_allow_html=True)
                    else:
                        st.warning("API response does not contain a 'markdown_output' field.")
                else:
                    st.error(f"API request failed with status code {response.status_code}: {response.text}")
            except requests.exceptions.RequestException as e:
                st.error(f"Error while connecting to the API: {e}")

# Run the app
if __name__ == "__main__":
    main()
