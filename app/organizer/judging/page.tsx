'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { Award, Star, TrendingUp, Users } from 'lucide-react'

export default function OrganizerJudgingPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(d => { setSubmissions(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const scored = submissions.filter(s => s.scores.length > 0)

  return (
    <DashboardLayout role="ORGANIZER">
      <PageHeader
        title="Judging Overview"
        subtitle="Monitor scoring progress across all submissions"
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl glass border border-violet-500/20">
          <Award className="w-5 h-5 text-violet-400 mb-2" />
          <div className="text-2xl font-bold">{submissions.length}</div>
          <div className="text-xs text-gray-500">Total submissions</div>
        </div>
        <div className="p-4 rounded-2xl glass border border-green-500/20">
          <Star className="w-5 h-5 text-green-400 mb-2" />
          <div className="text-2xl font-bold">{scored.length}</div>
          <div className="text-xs text-gray-500">Scored</div>
        </div>
        <div className="p-4 rounded-2xl glass border border-orange-500/20">
          <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl font-bold">
            {submissions.length > 0 ? Math.round(submissions.reduce((s, x) => s + x.totalScore, 0) / submissions.length * 10) / 10 : 0}
          </div>
          <div className="text-xs text-gray-500">Avg score</div>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : submissions.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-5 rounded-2xl glass border border-white/5"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-sm font-bold text-violet-400">
              #{i + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{sub.title}</p>
              <p className="text-xs text-gray-500">Team: {sub.team.name}  {sub.team.track}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5" />
                {sub.scores.length} judge{sub.scores.length !== 1 ? 's' : ''}
              </div>
              <div className="text-right">
                {sub.scores.length > 0 ? (
                  <>
                    <div className="text-lg font-bold text-violet-300">{sub.totalScore.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">/ 50</div>
                  </>
                ) : (
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg">Pending</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  )
}
