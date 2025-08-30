from fastapi import APIRouter, UploadFile, File, Form
from app.services.rag_utils import load_file_to_texttmp
from app.services.notes_service import generate_notes_from_text 

router = APIRouter()

@router.post("/notes")
async def upload_notes(
    file: UploadFile = File(...),
    topic: str = Form(None)
):
    text = load_file_to_texttmp(file)
    if not text:
        return {"message": "No text extracted"}
    notes = generate_notes_from_text(text, topic or "")
    return {"notes": notes}
