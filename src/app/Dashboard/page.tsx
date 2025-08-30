"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, BookOpen, HelpCircle, ClipboardList } from "lucide-react";
import { TextScroll } from "@/components/ui/text-scroll"; // Confirm path

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  return (
    <div className="p-6 md:p-12 space-y-10 max-w-7xl mx-auto mt-1 mb-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className=" sm:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg">
          Empower Learning with
        </h1>
        <br></br>
        <div className="w-full h-30 overflow-hidden text-6xl font-bold">
          <TextScroll text="Evidya " />
        </div>
      </div>

    
      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card
          onClick={() => router.push("/Dashboard/notes")}
          className="cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform rounded-3xl border-l-4 border-blue-500 bg-white"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <BookOpen className="w-6 h-6 text-blue-600" /> Study Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              Generate concise, well-structured study notes from your uploaded material.
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => router.push("/Dashboard/quiz")}
          className="cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform rounded-3xl border-l-4 border-green-500 bg-white"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <ClipboardList className="w-6 h-6 text-green-600" /> Quiz Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              Create and practice with customized quizzes automatically from your content.
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => router.push("/Dashboard/doubt")}
          className="cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform rounded-3xl border-l-4 border-purple-500 bg-white"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              <HelpCircle className="w-6 h-6 text-purple-600" /> Doubt Solver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              Ask any question and get instant, AI-powered answers based on your material.
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h1 className="">Made by Satyajit Borade</h1>
      </div>
    </div>
  );
}
