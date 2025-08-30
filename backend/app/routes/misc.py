from fastapi import APIRouter, UploadFile, File

from app.services.rag_utils import load_file_to_texttmp, build_faiss_from_text

router = APIRouter()

@router.post("/upload-only")
async def upload_only(file: UploadFile = File(...)):
    """
    Upload file and index it to an in-memory FAISS index (returned info only).
    This is mostly for testing - does NOT persist index.
    """
    text = load_file_to_texttmp(file)
    if not text:
        return {"message": "No text extracted (unsupported file or unreadable)."}
    db = build_faiss_from_text(text)
    # return the number of vectors/documents created (approx)
    return {"message": "Indexed in-memory", "num_docs": len(db.docstore._dict)}
