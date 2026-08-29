'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Welcome back!')
      
      // Fetch user role from Firestore
      const userRef = doc(db, 'users', userCredential.user.uid)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.data()
      const role = userData?.role || 'PARTICIPANT'
      
      // If Participant and missing QR code (e.g. older accounts), assign one now
      if (role === 'PARTICIPANT' && userData && !userData.qrCode) {
        const { updateDoc } = await import('firebase/firestore')
        await updateDoc(userRef, {
          qrCode: `MUZAN:${userCredential.user.uid}:${Date.now()}`,
          checkedIn: false,
          checkedInAt: null
        })
      }
      
      if (role === 'ORGANIZER') router.push('/organizer/dashboard')
      else if (role === 'JUDGE') router.push('/judge/dashboard')
      else router.push('/participant/dashboard')
      
    } catch (error: any) {
      console.error(error)
      toast.error('Login failed: Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // Keep demo quick login logic for convenience, but it requires accounts to actually exist in Firebase
  async function loginAs(demoEmail: string) {
    setEmail(demoEmail)
    setPassword('demo123')
    toast.info('Click Sign In to continue')
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-20 left-1/3 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">NexaEvent</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm transition-colors bg-transparent"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm transition-colors bg-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
