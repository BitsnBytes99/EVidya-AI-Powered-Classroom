from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional

from app.services.quiz_service import generate_quiz_from_text
from app.services.rag_utils import load_file_to_texttmp

router = APIRouter()

@router.post("/quiz/quiz", summary="Generate quiz from uploaded file")
async def quiz_endpoint(
    file: UploadFile = File(...),
    topic: Optional[str] = Form(None),
    n_questions: Optional[int] = Form(5)
):
    text = load_file_to_texttmp(file)
    result = generate_quiz_from_text(text, topic or "", n_questions)
    return {"quiz": result}
