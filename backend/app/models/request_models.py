from pydantic import BaseModel
from typing import Optional

class QueryOnly(BaseModel):
    query: str

class QuestionRequest(BaseModel):
    question: str
    # optional: provide pre-extracted text instead of file (not used in main flow)
    context_text: Optional[str] = None
