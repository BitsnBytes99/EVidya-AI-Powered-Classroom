import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Forward to FastAPI
  const backendForm = new FormData();
  backendForm.append("file", file);

  const res = await fetch("http://localhost:8000/api/upload-only", {
    method: "POST",
    body: backendForm, // send as multipart/form-data
  });

  const data = await res.json();
  return NextResponse.json(data);
}
