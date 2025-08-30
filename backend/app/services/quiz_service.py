from .rag_utils import build_faiss_from_text, call_llm

def generate_quiz_from_text(text: str, topic: str = "", n_questions: int = 10) -> str:
    if not text or text.strip() == "":
        return "No text extracted from file."

    db = build_faiss_from_text(text)
    query = topic if topic else "Generate quiz questions from the document"
    # collect context from retriever
    retriever = db.as_retriever(search_kwargs={"k": 8})
    docs = retriever.get_relevant_documents(query)
    context = "\n\n".join([d.page_content for d in docs])

    prompt = (
        f"You are an examiner. Using ONLY the provided context, create {n_questions} multiple-choice questions. "
        "Each question must have 4 options (A-D) and a clear answer. Output format:\n\n"
        "Q1) ...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: B\n\n"
        f"Context:\n{context}\n\nTopic: {query}\n\nQuiz:"
    )
    return call_llm(prompt)
