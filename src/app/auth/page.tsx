'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) router.push('/Dashboard')
      else alert(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (!error) alert('Check your email to confirm signup')
      else alert(error.message)
    }
  }

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleAuth}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>

      <p
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-center text-blue-600 cursor-pointer"
      >
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </p>
    </div>
  )
}
