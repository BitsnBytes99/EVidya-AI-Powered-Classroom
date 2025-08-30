import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Parse the request body (supports JSON or FormData)
    const contentType = req.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 400 });
    }

    // Send request to backend
    const res = await fetch(`${BACKEND}/quiz/quiz`, {
      method: "POST",
      headers: contentType.includes("application/json") ? { "Content-Type": "application/json" } : undefined,
      body: contentType.includes("application/json") ? JSON.stringify(body) : body,
    });

    // Handle non-OK responses
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
