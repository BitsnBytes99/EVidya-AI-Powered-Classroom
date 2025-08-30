"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function UploadForm() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("❌ Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function highlightKeyTerms(text: string) {
    const keywords = ["Topic", "Key Terms", "Headings", "Bullet Points", "Examples", "Formulas", "Not in document"];
    let highlighted = text;
    keywords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "g");
      highlighted = highlighted.replace(regex, `<span class="font-bold text-blue-900">$1</span>`);
    });
    return highlighted;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient- from-blue-50 to-purple-50 p-6 gap-10">
      
      {/* Hero Image at Top */}
      <div className="w-full max-w-5xl relative h-64 md:h-80">
        <Image
          src="/study1.webp" // Place your hero image in public folder
          alt="Upload Illustration"
          fill
          className="object-cover rounded-3xl shadow-xl"
        />
      </div>

      {/* Upload Form and Result Side-by-Side */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8">
        
        {/* Upload Form */}
        <Card className="w-full md:w-1/2 shadow-xl rounded-3xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-900">📂 Upload Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="file" className="font-semibold">Choose PDF File</Label>
                <Input
                  id="file"
                  type="file"
                  name="file"
                  accept=".pdf"
                  required
                  className="file:bg-blue-100 file:text-blue-700 file:rounded-md file:px-4 file:py-2 cursor-pointer hover:file:bg-blue-200 transition"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="topic" className="font-semibold">Topic (optional)</Label>
                <Input id="topic" type="text" name="topic" placeholder="Enter topic..." />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Notes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card className="w-full md:w-1/2 shadow-md rounded-3xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-blue-800">📄 Notes Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <div
                className="h-96 overflow-auto font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-300"
                dangerouslySetInnerHTML={{ __html: highlightKeyTerms(result) }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <p className="mt-4 text-center">Your result will appear here after uploading.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
