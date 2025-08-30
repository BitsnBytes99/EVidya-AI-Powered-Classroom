import tempfile
import os
from typing import List

# LangChain imports
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS

# Try to import Ollama-related LLM + Embeddings depending on your langchain package
try:
    # langchain-community style
    from langchain_community.llms import Ollama
    from langchain_community.embeddings import OllamaEmbeddings
    OLLOMA_LLM_AVAILABLE = True
except Exception:
    try:
        # older or different wrapper
        from langchain_ollama import OllamaLLM as Ollama
        from langchain_ollama import OllamaEmbeddings
        OLLOMA_LLM_AVAILABLE = True
    except Exception:
        OLLOMA_LLM_AVAILABLE = False

# Document loaders for pdf/pptx/txt/docx
from langchain.document_loaders import PyPDFLoader, UnstructuredPowerPointLoader, TextLoader
try:
    import docx2txt
    DOCX_AVAILABLE = True
except Exception:
    DOCX_AVAILABLE = False

# Initialize models (change model name if needed)
LLAMA_MODEL_NAME = "llama3.2"   # adjust to your local model name if different

if OLLOMA_LLM_AVAILABLE:
    try:
        llm = Ollama(model=LLAMA_MODEL_NAME)
    except Exception as e:
        # fallback: instantiate without model param then set later
        llm = Ollama(model=LLAMA_MODEL_NAME)

    try:
        embeddings = OllamaEmbeddings(model=LLAMA_MODEL_NAME)
    except Exception:
        embeddings = OllamaEmbeddings(model=LLAMA_MODEL_NAME)
else:
    llm = None
    embeddings = None

# ---------------- utility functions ----------------

def load_file_to_texttmp(upload_file) -> str:
    """
    Save UploadFile to a temp file and extract text depending on extension.
    Returns the extracted text (string).
    """
    suffix = os.path.splitext(upload_file.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(upload_file.file.read())
        tmp.flush()
        tmp_path = tmp.name

    try:
        if suffix == ".pdf":
            loader = PyPDFLoader(tmp_path)
            docs = loader.load()
            text = "\n\n".join([d.page_content for d in docs])
        elif suffix in [".ppt", ".pptx"]:
            loader = UnstructuredPowerPointLoader(tmp_path)
            docs = loader.load()
            text = "\n\n".join([d.page_content for d in docs])
        elif suffix == ".txt":
            loader = TextLoader(tmp_path, encoding="utf-8")
            docs = loader.load()
            text = "\n\n".join([d.page_content for d in docs])
        elif suffix == ".docx" and DOCX_AVAILABLE:
            text = docx2txt.process(tmp_path)
        else:
            # fallback: try to decode as utf-8
            with open(tmp_path, "rb") as f:
                b = f.read()
            try:
                text = b.decode("utf-8")
            except Exception:
                text = ""  # unsupported binary
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass

    return text

def text_to_docs(text: str) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
    pages = splitter.split_text(text)
    return [Document(page_content=p) for p in pages]

def build_faiss_from_text(text: str) -> FAISS:
    """
    Build FAISS index from text and return the vectorstore object.
    (In-memory, per-request; not persisted in this example.)
    """
    docs = text_to_docs(text)
    if embeddings is None:
        raise RuntimeError("Embeddings not initialized (Ollama embeddings not available).")
    db = FAISS.from_documents(docs, embeddings)
    return db

def call_llm(prompt: str) -> str:
    """
    Call LLM in a robust way. Try llm.invoke / llm.generate / llm(prompt).
    """
    if llm is None:
        raise RuntimeError("LLM not initialized (Ollama not available).")
    # try several call styles depending on wrapper
    try:
        return llm.invoke(prompt)
    except Exception:
        try:
            # some wrappers make llm(prompt)
            return llm(prompt)
        except Exception:
            try:
                # langchain-style .generate (returns generations object)
                gen = llm.generate([prompt])
                # try to access text
                return gen.generations[0][0].text
            except Exception as e:
                raise RuntimeError(f"LLM call failed: {e}")

def rag_answer_from_db(db: FAISS, question: str, k: int = 3) -> str:
    retriever = db.as_retriever(search_kwargs={"k": k})
    docs = retriever.get_relevant_documents(question)
    context = "\n\n".join([d.page_content for d in docs])
    prompt = (
        f"You are an assistant. Use ONLY the context below to answer the question.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"
    )
    return call_llm(prompt)
