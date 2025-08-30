import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'AI Study Platform',
  description: 'AI-powered study notes, quizzes, and doubt solver',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <main className="min-h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  )
}
