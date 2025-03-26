import os
import pickle
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.document_transformers import LongContextReorder
from sentence_transformers import CrossEncoder
from langchain_core.retrievers import BaseRetriever
from pydantic import Field

# Hardcoded Google API key
GOOGLE_API_KEY = "API_KEY"  # Replace with your actual API key

class PDFProcessor:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def load_pdf(self) -> List[Document]:
        """Load PDF using PyPDF2 (via pypdf) instead of PyPDFLoader"""
        documents = []
        with open(self.file_path, "rb") as file:
            pdf = PdfReader(file)
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text.strip():  # Only add non-empty pages
                    doc = Document(
                        page_content=text,
                        metadata={"source": self.file_path, "page": i + 1}
                    )
                    documents.append(doc)
        return documents

    def split_text(self, documents: List[Document]) -> List[Document]:
        """Split documents with improved parameters for legal text"""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=150,
            separators=["\n\n", "\n", " ", ""],
            keep_separator=True
        )
        return text_splitter.split_documents(documents)

    def save_documents(self, documents: List[Document], file_name: str) -> None:
        with open(file_name, 'wb') as f:
            pickle.dump(documents, f)

    def load_documents(self, file_name: str) -> List[Document]:
        with open(file_name, 'rb') as f:
            return pickle.load(f)

class CustomRetriever(BaseRetriever):
    retriever: Any = Field(description="The base retriever to use")
    cross_encoder: Any = Field(default=None, description="Cross encoder for reranking")
    reorder: bool = Field(default=True, description="Whether to reorder documents")
    top_k: int = Field(default=5, description="Number of top documents to return")
    
    def _get_relevant_documents(self, query: str) -> List[Document]:
        # Use invoke instead of get_relevant_documents
        docs = self.retriever.invoke(query)
        
        # Rerank documents
        if self.cross_encoder is not None:
            # Prepare document pairs for reranking
            doc_pairs = [(query, doc.page_content) for doc in docs]
            
            # Get scores from CrossEncoder
            scores = self.cross_encoder.predict(doc_pairs)
            
            # Create (score, doc) pairs and sort by score in descending order
            scored_docs = sorted(zip(scores, docs), key=lambda x: x[0], reverse=True)
            
            # Return top_k documents
            docs = [doc for _, doc in scored_docs[:self.top_k]]
        
        # Apply long context reordering
        if self.reorder and docs:
            reorderer = LongContextReorder()
            docs = reorderer.transform_documents(docs)
        
        return docs

class LegalAIAssistant:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(LegalAIAssistant, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, google_api_key: str = GOOGLE_API_KEY, temperature: float = 0.2):
        if self._initialized:
            return
        
        self.google_api_key = google_api_key
        self.temperature = temperature
        self.llm = None
        self.db = None
        self.prompt = None
        self.cross_encoder = None
        self._initialized = True

    def initialize_db(self, split_documents: List[Document], persist_directory: str) -> None:
        """Initialize vector database with Google Generative AI embeddings"""
        embeddings = GoogleGenerativeAIEmbeddings(
            google_api_key=self.google_api_key,
            model="models/embedding-001"
        )
        self.db = Chroma.from_documents(
            split_documents, 
            embeddings, 
            persist_directory=persist_directory
        )

    def initialize_llm(self) -> None:
        """Initialize Google Generative AI LLM"""
        self.llm = ChatGoogleGenerativeAI(
            google_api_key=self.google_api_key,
            model="gemini-1.5-pro-latest",
            temperature=self.temperature
        )
        
        # Initialize CrossEncoder for reranking
        self.cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

    def create_prompt(self) -> None:
        """Create an optimized prompt for legal assistant"""
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
            
            Context Information:
            {context}

            Disclaimer: AI-generated insights do not constitute professional legal advice. Consultation with licensed legal professionals is recommended.

            Question: {input}
        """)

    def create_retrieval_chain(self):
        documents_chain = create_stuff_documents_chain(self.llm, self.prompt)
        
        # Create a proper retriever with reranking
        base_retriever = self.db.as_retriever(search_kwargs={"k": 10})
        retriever = CustomRetriever(retriever=base_retriever, cross_encoder=self.cross_encoder)
        
        return create_retrieval_chain(retriever, documents_chain)

    def get_response(self, retrieval_chain, query: str) -> Dict[str, Any]:
        return retrieval_chain.invoke({"input": query})

    def load_db(self, directory: str) -> None:
        """Load existing vector database"""
        embeddings = GoogleGenerativeAIEmbeddings(
            google_api_key=self.google_api_key,
            model="models/embedding-001"
        )
        self.db = Chroma(persist_directory=directory, embedding_function=embeddings)

def initialize_components(file_path: str):
    documents_cache = "documents_cache.pkl"
    db_cache = "db_cache"
    
    pdf_processor = PDFProcessor(file_path)
    
    if os.path.exists(documents_cache):
        split_documents = pdf_processor.load_documents(documents_cache)
    else:
        documents = pdf_processor.load_pdf()
        split_documents = pdf_processor.split_text(documents)
        pdf_processor.save_documents(split_documents, documents_cache)

    legal_ai_assistant = LegalAIAssistant(google_api_key=GOOGLE_API_KEY)
    
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
    description="A FastAPI server for the Legal AI Assistant using Google Generative AI"
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
    document_path: str = "quaterly.pdf"  # Default document path

legal_ai_assistant = None
retrieval_chain = None

@app.on_event("startup")
async def startup_event():
    global legal_ai_assistant, retrieval_chain
    legal_ai_assistant = initialize_components("quaterly.pdf")  # Adjust path as needed
    retrieval_chain = legal_ai_assistant.create_retrieval_chain()

@app.post("/query")
async def get_query_response(request: QueryRequest):
    try:
        # Concatenate all message contents
        conversation = "\n".join([f"{msg.role}: {msg.content}" for msg in request.messages])
        
        response = legal_ai_assistant.get_response(retrieval_chain, conversation)
        return {"answer": response['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Ensure you have the required dependencies installed
    # Run with: uvicorn server:app --reload
    uvicorn.run(app, host="localhost", port=8000)