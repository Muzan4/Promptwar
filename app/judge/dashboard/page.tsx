'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { FileText, Star, CheckCircle, Send, ChevronDown, ChevronUp, ExternalLink, GitBranch, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Submission {
  id: string
  title: string
  description: string
  demoUrl: string | null
  repoUrl: string | null
  tags: string
  totalScore: number
  team: {
    name: string
    track: string
    members: { user: { name: string } }[]
  }
  scores: {
    innovation: number
    impact: number
    technical: number
    presentation: number
    feedback: string | null
    judge: { user: { name: string } }
  }[]
}

const RUBRIC = [
  { key: 'innovation', label: 'Innovation', desc: 'How novel and creative is the solution?', max: 50 },
  { key: 'impact', label: 'Impact', desc: 'Real-world value and scalability', max: 50 },
  { key: 'technical', label: 'Technical', desc: 'Code quality, architecture, and complexity', max: 50 },
  { key: 'presentation', label: 'Presentation', desc: 'Demo clarity, design, and communication', max: 50 },
]

export default function JudgeDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [judgeId, setJudgeId] = useState<string>('')
  const [scores, setScores] = useState<Record<string, { innovation: number; impact: number; technical: number; presentation: number; feedback: string }>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/submissions').then(r => r.json()),
      fetch('/api/me').then(r => r.json()),
    ]).then(([subs, me]) => {
      setSubmissions(Array.isArray(subs) ? subs : [])
      setJudgeId(me?.id || '')
      // Initialize scores from existing data
      const initialScores: typeof scores = {}
      ;(Array.isArray(subs) ? subs : []).forEach((s: Submission) => {
        initialScores[s.id] = { innovation: 25, impact: 25, technical: 25, presentation: 25, feedback: '' }
      })
      setScores(initialScores)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function updateScore(subId: string, key: string, value: number | string) {
    setScores(prev => ({ ...prev, [subId]: { ...prev[subId], [key]: value } }))
  }

  async function submitScore(subId: string) {
    if (!judgeId) { toast.error('Could not identify judge'); return }
    setSubmitting(subId)
    const s = scores[subId]
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: subId,
          judgeId,
          ...s,
        }),
      })
      toast.success('Score submitted successfully!')
      setExpanded(null)
    } catch {
      toast.error('Failed to submit score')
    } finally {
      setSubmitting(null)
    }
  }

  const scoredCount = submissions.filter(s => s.scores.some(sc => sc.judge?.user?.name)).length

  return (
    <DashboardLayout role="JUDGE">
      <PageHeader
        title="Evaluation Portal"
        subtitle="Score project submissions using the rubric below"
        action={
          <div className="flex items-center gap-2 text-sm text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            {scoredCount} / {submissions.length} scored
          </div>
        }
      />

      {/* Guide */}
      <div className="mb-6 p-4 rounded-2xl bg-violet-900/20 border border-violet-500/20 flex gap-3">
        <Star className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-400">
          Each category is scored from <span className="text-white font-medium">0–50</span>.
          Total score = average across all four categories.
          Your feedback is shown to teams after judging closes.
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-500">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-24 rounded-2xl glass border border-white/5">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No submissions to evaluate yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, i) => {
            const isExpanded = expanded === sub.id
            const sc = scores[sub.id] || { innovation: 25, impact: 25, technical: 25, presentation: 25, feedback: '' }
            const preview = (sc.innovation + sc.impact + sc.technical + sc.presentation) / 4
            const hasMyScore = sub.scores.length > 0
            const tags = JSON.parse(sub.tags || '[]')

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  hasMyScore ? 'border-green-500/20 bg-green-500/5' : 'glass border-white/5 hover:border-violet-500/20'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : sub.id)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    hasMyScore ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    {hasMyScore ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold">{sub.title}</h3>
                      {hasMyScore && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Scored</span>}
                    </div>
                    <p className="text-sm text-gray-500">Team: {sub.team.name}  {sub.team.track}</p>
                  </div>
                  <div className="text-right mr-2">
                    {hasMyScore ? (
                      <div className="text-lg font-bold text-green-400">{sub.totalScore.toFixed(1)}</div>
                    ) : (
                      <div className="text-lg font-bold text-violet-300">{preview.toFixed(1)}</div>
                    )}
                    <div className="text-xs text-gray-500">/ 50</div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5">
                        {/* Project info */}
                        <div className="pt-4 mb-5">
                          <p className="text-sm text-gray-400 leading-relaxed mb-3">{sub.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {tags.map((t: string) => (
                              <span key={t} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-400">{t}</span>
                            ))}
                          </div>
                          <div className="flex gap-3 mt-3">
                            {sub.demoUrl && (
                              <a href={sub.demoUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                              </a>
                            )}
                            {sub.repoUrl && (
                              <a href={sub.repoUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                                <GitBranch className="w-3.5 h-3.5" /> Repository
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Rubric scoring */}
                        <div className="space-y-5 mb-5">
                          {RUBRIC.map(r => (
                            <div key={r.key}>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm font-medium">{r.label}</p>
                                  <p className="text-xs text-gray-500">{r.desc}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-2xl font-bold text-violet-300">{sc[r.key as keyof typeof sc] as number}</span>
                                  <span className="text-sm text-gray-500">/{r.max}</span>
                                </div>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={r.max}
                                value={sc[r.key as keyof typeof sc] as number}
                                onChange={e => updateScore(sub.id, r.key, parseInt(e.target.value))}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                                <span>Poor</span>
                                <span>Exceptional</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Feedback */}
                        <textarea
                          placeholder="Write structured feedback for the team (required)..."
                          value={sc.feedback}
                          onChange={e => updateScore(sub.id, 'feedback', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent resize-none mb-4"
                        />

                        {/* Total preview + Submit */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            Total score: <span className="text-white font-bold text-lg">{preview.toFixed(1)}</span>
                            <span className="text-gray-500"> / 50</span>
                          </div>
                          <button
                            onClick={() => submitScore(sub.id)}
                            disabled={!!submitting || !sc.feedback}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-sm font-medium transition-all disabled:opacity-50"
                          >
                            {submitting === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Submit Score
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
