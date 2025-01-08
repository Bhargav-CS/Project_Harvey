import requests
import streamlit as st

# Function to get response from the server
def get_legal_ai_response(messages):
    response = requests.post(
        "http://localhost:8000/query",
        json={'messages': messages}
    )
    return response.json()['answer']

# Initialize session state for conversation history and query flag
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'new_query_submitted' not in st.session_state:
    st.session_state.new_query_submitted = False

# Streamlit framework
st.title('Legal AI Assistant Demo')

# Display the conversation history
for message in st.session_state.messages:
    st.write(f"{message['role']}: {message['content']}")

# Input for new user message
input_text = st.text_input("Enter your legal query:")

if st.button("Submit"):
    if input_text:
        # Add user message to the conversation history
        st.session_state.messages.append({"role": "user", "content": input_text})
        
        # Set the flag to indicate a new query has been submitted
        st.session_state.new_query_submitted = True
        
        # Get response from the server
        response = get_legal_ai_response(st.session_state.messages)
        
        # Add assistant's response to the conversation history
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Clear the input text and reset the flag
        st.session_state.new_query_submitted = False
        st.experimental_rerun()