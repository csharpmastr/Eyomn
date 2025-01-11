import streamlit as st
import platform
import streamlit_js_eval 
import requests
from PIL import Image
import re  
import io
from dotenv import load_dotenv
import os

load_dotenv()

def process_image(image, api_url, headers):
    """Handle image processing and API submission."""
    try:
        # Convert image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        # Send the image through API
        files = {'image': ('image.jpg', img_byte_arr, 'image/jpeg')}
        response = requests.post(api_url, files=files, verify=False)

        if response.status_code == 200:
            st.success("Image uploaded successfully!")
            st.write(f"Response: {response.json()}")
        else:
            st.error(f"Failed to upload image. Error: {response.text}")
    except requests.exceptions.SSLError as e:
        st.error(f"SSL Error: {e}")
    except ValueError:
        st.error("Failed to parse the response from the API.")
    except Exception as e:
        st.error(f"An error occurred: {e}")

def handle_file_upload(api_url, headers):
    """Handle file upload logic."""
    uploaded_file = st.file_uploader("Upload a JPG or PNG file", type=["jpg", "jpeg", "png"])
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption='Uploaded Image', use_column_width=True)
        if st.button("Extract Information"):
            process_image(image, api_url, headers)

# def handle_camera_capture(api_url, headers):
#     """Handle camera capture logic."""
#     uploaded_file = st.camera_input("Take a picture")
#     if uploaded_file:
#         image = Image.open(uploaded_file)
#         st.image(image, caption='Captured Image', use_column_width=True)
#         if st.button("Extract Information"):
#             process_image(image, api_url, headers)
                        
# FUNCTION TO DETERMINE THE TYPE OF DEVICE OF THE USER
def get_device_info():
    try:
        user_agent = streamlit_js_eval.get_user_agent()
        location = streamlit_js_eval.get_geolocation()
        print(location)
        print(user_agent)
        st.write(user_agent)
    except Exception as e:
        raise e

def main():
    st.title("Image Capture and Upload App")
    
    # API configuration
    api_url = "http://127.0.0.1:8000/validate_and_extract"
    
    # REQUEST HEADERS
    headers = {
        "EYOMN-EXTRACTOR-AGENT-API-KEY": os.getenv("EYOMN_API_KEY", "")
    }
    
    # DETERMINE WHAT DEVICE THE CURRENT USER IS USING
    get_device_info()  
    
    # UPLOAD A FILE
    st.subheader("Upload a JPG or PNG File")
    handle_file_upload(api_url, headers)
    
    # # Choose between taking a picture or uploading a file
    # option = st.radio("Choose an option:", ("Take a Picture", "Upload a File"))

    # if option == "Take a Picture":
    #     st.subheader("Capture Image Using Camera")
    #     handle_camera_capture(api_url, headers)
    # else:


if __name__ == "__main__":
    main()
