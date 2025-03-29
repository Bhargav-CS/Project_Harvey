from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import os
import pickle
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

class PDFProcessor:
    def __init__(self, directory_path):
        self.directory_path = directory_path

    def load_pdfs(self):
        documents = []
        for file_name in os.listdir(self.directory_path):
            if file_name.endswith('.pdf'):
                file_path = os.path.join(self.directory_path, file_name)
                loader = PyPDFLoader(file_path)
                documents.extend(loader.load())
        return documents

    def split_text(self, documents):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
        return text_splitter.split_documents(documents)

    def save_documents(self, documents, file_name):
        with open(file_name, 'wb') as f:
            pickle.dump(documents, f)

    def load_documents(self, file_name):
        with open(file_name, 'rb') as f:
            return pickle.load(f)

class LegalAIAssistant:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(LegalAIAssistant, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, model_name="llama3.1", temperature=0.9):
        if self._initialized:
            return
        self.model_name = model_name
        self.temperature = temperature
        self.llm = None
        self.db = None
        self.prompt = None
        self._initialized = True

    def initialize_db(self, split_documents, persist_directory):
        self.db = Chroma.from_documents(split_documents, OllamaEmbeddings(model=self.model_name), persist_directory=persist_directory)

    def initialize_llm(self):
        self.llm = ollama.Ollama(model=self.model_name, temperature=self.temperature)

    def create_prompt(self):
        self.prompt = ChatPromptTemplate.from_template("""
            Role: Advanced Legal AI Assistant

            Core Objective:
            Provide precise, contextually-grounded legal guidance by systematically analyzing user queries through comprehensive research and strategic reasoning.

            Input Processing Framework:
            1. Query Analysis
            - Deconstruct user's legal query
            - Identify core legal issue(s)
            - Determine applicable jurisdictional context

            2. Research Strategy
            - Utilize provided legal document corpus
            - Cross-reference with historical case law
            - Assess relevance and precedential weight

            Response Structure:
            A. Preliminary Assessment
            - Concise overview of legal query
            - Preliminary legal perspective
            - Potential complexity indicators

            B. Precedential Analysis
            - Maximum 3 most relevant historical cases
            - Key judgment details
            - Direct correlation to current query
            - Precise year and jurisdiction of cases

            C. Legal Reasoning
            - Synthesize research findings
            - Identify potential legal interpretations
            - Highlight critical legal principles

            D. Conclusion
            - Summarized legal recommendation
            - Probabilistic assessment of potential outcomes
            - Clear, actionable insights

            Operational Constraints:
            - Maintain strict objectivity
            - Prioritize factual accuracy
            - Clearly differentiate between definitive guidance and probabilistic assessment
            - Include mandatory legal disclaimer about AI-generated advice limitations
            {context}

            Put this disclaimer at the end of the response:
            Disclaimer: AI-generated insights do not constitute professional legal advice. Consultation with licensed legal professionals is recommended.

            Question : {input}
        """)

    def create_retrieval_chain(self):
        documents_chain = create_stuff_documents_chain(self.llm, self.prompt)
        retriever = self.db.as_retriever()
        return create_retrieval_chain(retriever, documents_chain)

    def get_response(self, retrieval_chain, query):
        return retrieval_chain.invoke({"input": query})

    def load_db(self, directory):
        self.db = Chroma(persist_directory=directory, embedding_function=OllamaEmbeddings(model=self.model_name))

def initialize_components():
    directory_path = "D:\\capstone\\Project_Harvey\\downloaded_pdfs\\article_19"
    documents_cache = "documents_cache.pkl"
    db_cache = "db_cache"
    
    pdf_processor = PDFProcessor(directory_path)
    
    if os.path.exists(documents_cache):
        split_documents = pdf_processor.load_documents(documents_cache)
    else:
        documents = pdf_processor.load_pdfs()
        split_documents = pdf_processor.split_text(documents)
        pdf_processor.save_documents(split_documents, documents_cache)

    legal_ai_assistant = LegalAIAssistant()
    
    if os.path.exists(db_cache):
        legal_ai_assistant.load_db(db_cache)
    else:
        legal_ai_assistant.initialize_db(split_documents, db_cache)
    
    legal_ai_assistant.initialize_llm()
    legal_ai_assistant.create_prompt()

    return legal_ai_assistant

app = FastAPI(
    title="Legal AI Assistant",
    version="1.0",
    description="A FastAPI server for the Legal AI Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Message(BaseModel):
    role: str
    content: str

class QueryRequest(BaseModel):
    messages: List[Message]

@app.on_event("startup")
async def startup_event():
    global legal_ai_assistant, retrieval_chain
    legal_ai_assistant = initialize_components()
    retrieval_chain = legal_ai_assistant.create_retrieval_chain()

@app.post("/query")
async def get_query_response(request: QueryRequest):
    try:
        conversation = "\n".join([f"{msg.role}: {msg.content}" for msg in request.messages])
        response = legal_ai_assistant.get_response(retrieval_chain, conversation)
        return {"answer": response['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)