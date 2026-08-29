'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'

const SKILLS = ['React', 'Next.js', 'TypeScript', 'Python', 'AI/ML', 'Node.js', 'Go', 'Rust', 'UI/UX', 'DevOps', 'Blockchain', 'Mobile']
const ROLES = [
  { value: 'PARTICIPANT', label: 'Participant', desc: 'I am here to compete', emoji: 'ðŸš€' },
  { value: 'JUDGE', label: 'Judge', desc: 'I will evaluate projects', emoji: 'âš–ï¸' },
  { value: 'ORGANIZER', label: 'Organizer', desc: 'I am running this event', emoji: 'ðŸŽ¯' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'PARTICIPANT', skills: [] as string[], bio: ''
  })

  function toggleSkill(skill: string) {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill]
    }))
  }

  async function handleRegister() {
    setLoading(true)
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const uid = userCredential.user.uid

      // 2. Create User document in Firestore
      await setDoc(doc(db, 'users', uid), {
        name: form.name,
        email: form.email,
        role: form.role,
        skills: JSON.stringify(form.skills),
        bio: form.bio,
        createdAt: new Date().toISOString()
      })

      // 3. If Participant, create Participant record with QR
      if (form.role === 'PARTICIPANT') {
        const qrData = `MUZAN:${uid}:${Date.now()}`
        await setDoc(doc(db, 'participants', uid), {
          userId: uid,
          checkedIn: false,
          checkedInAt: null,
          qrCode: qrData,
          createdAt: new Date().toISOString()
        })
      }

      toast.success('Account created! Logging you in...')
      
      // Navigate to correct dashboard
      if (form.role === 'ORGANIZER') router.push('/organizer/dashboard')
      else if (form.role === 'JUDGE') router.push('/judge/dashboard')
      else router.push('/participant/dashboard')

    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-20 right-1/3 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

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
            <span className="font-bold text-xl">Muzan Hackathon</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">Step {step} of 2</p>
        </div>

        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" />
          <div className={`h-1 flex-1 rounded-full transition-all ${step === 2 ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : 'bg-white/10'}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3 mb-2">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      form.role === r.value
                        ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                        : 'glass border-white/10 hover:border-white/20 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <div className="text-xs font-medium">{r.label}</div>
                  </button>
                ))}
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
                />
              </div>
              <button
                onClick={() => {
                  if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return }
                  setStep(2)
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <p className="text-sm text-gray-400 mb-3">Select your skills <span className="text-gray-600">(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.skills.includes(skill)
                          ? 'bg-violet-600/30 border border-violet-500/50 text-violet-300'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Short bio (optional)"
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent resize-none"
              />
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating...' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                â† Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
