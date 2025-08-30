'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome to AI Study Platform</h1>
      <p className="text-lg text-gray-600">Generate notes, quizzes & solve doubts with AI</p>
      <button
        onClick={() => router.push('/auth')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  )
}
