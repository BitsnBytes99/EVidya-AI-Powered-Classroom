from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import notes, quiz, chatbot, misc

app = FastAPI(title="AI Learning Assistant (RAG with Ollama)")

# Allow CORS from your frontend (change in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(misc.router, prefix="", tags=["Misc"])
app.include_router(notes.router, prefix="/api", tags=["Notes"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])

@app.get("/health")
def health():
    return {"status": "ok"}
