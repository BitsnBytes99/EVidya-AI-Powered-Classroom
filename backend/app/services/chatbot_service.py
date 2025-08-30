from .rag_utils import build_faiss_from_text, rag_answer_from_db

def chatbot_answer_from_text(text: str, question: str) -> str:
    if not text or text.strip() == "":
        return "No text extracted from file."
    db = build_faiss_from_text(text)
    answer = rag_answer_from_db(db, question)
    return answer
