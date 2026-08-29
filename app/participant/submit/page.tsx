'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/firebase-auth-provider'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { FileText, Plus, ExternalLink, GitBranch, CheckCircle2, Send, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

const TAGS = ['AI/ML', 'Web3', 'IoT', 'AR/VR', 'Mobile', 'Open Source', 'Social Impact', 'FinTech', 'HealthTech', 'EdTech']

export default function SubmitPage() {
  const { user } = useAuth()
  const [participant, setParticipant] = useState<any>(null)
  const [existing, setExisting] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', demoUrl: '', repoUrl: '', tags: [] as string[] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/participants').then(r => r.json()).then((d: any[]) => {
      if (Array.isArray(d)) {
        const p = d.find((x: any) => x.user?.email === user?.email)
        setParticipant(p || null)
        if (p?.team?.submission) setExisting(p.team.submission)
      }
    })
  }, [user])

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }))
  }

  async function handleSubmit() {
    if (!form.title || !form.description) { toast.error('Title and description required'); return }
    if (!participant?.teamId) { toast.error('You must be in a team to submit'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, authorId: user?.uid }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setExisting(data)
      toast.success(' Project submitted successfully!')
    } catch (e: any) {
      toast.error(e.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="PARTICIPANT">
      <PageHeader title="Submit Project" subtitle="Submit your hackathon project for judging" />

      {!participant?.teamId && (
        <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm flex items-center gap-3">
           You need to be in a team before submitting. Join or create a team first.
        </div>
      )}

      {existing ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl glass border border-green-500/20 bg-green-500/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h3 className="font-semibold text-lg text-green-400">Project Submitted!</h3>
          </div>
          <h4 className="font-bold text-xl mb-2">{existing.title}</h4>
          <p className="text-gray-400 text-sm mb-4">{existing.description}</p>
          <div className="flex gap-3">
            {existing.demoUrl && (
              <a href={existing.demoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {existing.repoUrl && (
              <a href={existing.repoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
                <GitBranch className="w-4 h-4" /> Repository
              </a>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl space-y-4"
        >
          <input
            placeholder="Project title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
          />
          <textarea
            placeholder="Describe your project  what it does, why it matters, how you built it..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={5}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent resize-none"
          />
          <input
            placeholder="Demo URL (optional)"
            value={form.demoUrl}
            onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
          />
          <input
            placeholder="GitHub repository URL (optional)"
            value={form.repoUrl}
            onChange={e => setForm(f => ({ ...f, repoUrl: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
          />
          <div>
            <p className="text-sm text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.tags.includes(tag)
                      ? 'bg-violet-600/30 border border-violet-500/50 text-violet-300'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || !participant?.teamId}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-medium text-sm transition-all disabled:opacity-40"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
