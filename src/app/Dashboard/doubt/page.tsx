"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

export default function DoubtPage() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleAskDoubt = async () => {
    if (!file || !question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const res = await fetch(`${BACKEND}/chatbot`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        setAnswer(`❌ Error: ${text}`);
      } else {
        const data = await res.json();
        setAnswer(data.answer ?? "No answer returned from backend.");
      }
    } catch (err: any) {
      setAnswer(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Upload + Ask Doubt */}
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">💬 Upload File & Ask Doubt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
          {file && (
            <p className="text-sm text-gray-500">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
          <Input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
            onClick={handleAskDoubt}
            disabled={!file || !question || loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Thinking..." : "⚡ Get Answer"}
          </Button>
        </CardContent>
      </Card>

      {/* Answer Output */}
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">🤖 Answer</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 italic text-center">Processing your doubt...</p>
          ) : answer ? (
            <Textarea
              value={answer}
              readOnly
              className="h-72 resize-none text-gray-700 font-mono whitespace-pre-wrap"
            />
          ) : (
            <p className="text-gray-500 text-center">Upload a file and ask a doubt to see the answer.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
