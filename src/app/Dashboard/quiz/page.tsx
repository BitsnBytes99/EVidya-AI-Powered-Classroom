"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

export default function QuizPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleGenerateQuiz = async () => {
    if (!file) return;
    setLoading(true);
    setQuiz("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND}/quiz/quiz/quiz`, { method: "POST", body: formData });

      if (!res.ok) {
        const text = await res.text();
        setQuiz(`❌ Error: ${text}`);
      } else {
        const data = await res.json();
        setQuiz(data.quiz ?? "No quiz generated.");
      }
    } catch (err: any) {
      setQuiz(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  bg-gradient from-blue-50 to-purple-50 p-6 gap-10">

      {/* Hero Image */}
      <div className="w-full max-w-5xl relative h-64 md:h-80">
        <Image
          src="/study1.webp" // Place a suitable hero image in public folder
          alt="Quiz Illustration"
          fill
          className="object-cover rounded-3xl shadow-xl"
        />
      </div>

      {/* Upload + Quiz Side-by-Side */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8">

        {/* Upload Form */}
        <Card className="w-full md:w-1/2 shadow-xl rounded-3xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-900">
              📚 Upload File & Generate Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
            {file && (
              <p className="text-sm text-gray-500">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
            <Button
              className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold"
              onClick={handleGenerateQuiz}
              disabled={!file || loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Generating..." : "⚡ Generate Quiz"}
            </Button>
          </CardContent>
        </Card>

        {/* Quiz Output */}
        <Card className="w-full md:w-1/2 shadow-xl rounded-3xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-blue-800">📝 Generated Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 italic text-center">Generating quiz...</p>
            ) : quiz ? (
              <Textarea
                value={quiz}
                readOnly
                className="h-72 resize-none text-gray-700 font-mono whitespace-pre-wrap"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            
                <p className="mt-4 text-center">Upload a file to generate the quiz.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
