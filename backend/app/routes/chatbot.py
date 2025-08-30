from fastapi import APIRouter, UploadFile, File, Form

from app.services.chatbot_service import chatbot_answer_from_text
from app.services.rag_utils import load_file_to_texttmp

router = APIRouter()

@router.post("/", summary="Ask a question about uploaded file (RAG chatbot)")
async def chatbot_endpoint(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    text = load_file_to_texttmp(file)
    answer = chatbot_answer_from_text(text, question)
    return {"answer": answer}
