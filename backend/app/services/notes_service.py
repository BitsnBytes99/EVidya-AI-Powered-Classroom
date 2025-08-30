from .rag_utils import build_faiss_from_text, rag_answer_from_db, call_llm

def generate_notes_from_text(text: str, topic: str = "") -> str:
    """
    Build vectorstore -> retrieve relevant context -> ask LLM to produce structured study notes.
    """
    if not text or text.strip() == "":
        return "No text extracted from file."

    db = build_faiss_from_text(text)
    # get top chunks relevant to the topic (if provided) or some general retrieval
    query = topic if topic else "Summarize the document into study notes"
    # retrieve context
    retriever = db.as_retriever(search_kwargs={"k": 6})
    docs = retriever.get_relevant_documents(query)
    context = "\n\n".join([d.page_content for d in docs])

    prompt = (
        "You are a helpful study assistant. Using ONLY the provided context, write concise, well-structured study notes with headings, bullet points, key terms, and short examples. If information is missing in the context, say 'Not in document'.\n\nContext:\n" + context + "\n\nTopic: " + query + "\n\nNotes:"
    )
    return call_llm(prompt)
