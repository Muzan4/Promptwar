'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { Users, Lock, CheckCircle2, Filter } from 'lucide-react'
import { parseSkills } from '@/lib/utils'

export default function OrganizerTeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teams')
      .then(r => r.json())
      .then(d => { setTeams(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openTeams = teams.filter(t => t.status === 'OPEN')
  const fullTeams = teams.filter(t => t.status === 'FULL')
  const lockedTeams = teams.filter(t => t.status === 'LOCKED')

  return (
    <DashboardLayout role="ORGANIZER">
      <PageHeader
        title="Team Overview"
        subtitle={`${teams.length} teams formed | ${openTeams.length} still open`}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Open', count: openTeams.length, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Full', count: fullTeams.length, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Locked', count: lockedTeams.length, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl border ${s.bg}`}>
            <div className={`text-2xl font-bold mb-1 ${s.color}`}>{s.count}</div>
            <div className="text-xs text-gray-500">{s.label} teams</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading teams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team, i) => {
            const lookingFor = parseSkills(team.lookingFor)
            const allSkills = team.members.flatMap((m: any) => parseSkills(m.user.skills))
            const uniqueSkills = [...new Set(allSkills)].slice(0, 3) as string[]
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 rounded-2xl glass border border-white/5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <span className="text-xs text-gray-500">{team.track}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    team.status === 'OPEN' ? 'bg-green-500/20 text-green-400' :
                    team.status === 'FULL' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{team.status}</span>
                </div>
                {team.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{team.description}</p>}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((m: any, j: number) => (
                      <div key={j} className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 border-2 border-[#0f0f1a] flex items-center justify-center text-xs font-bold">
                        {m.user.name[0]}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{team.members.length} members</span>
                </div>
                {uniqueSkills.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {uniqueSkills.map((s: string) => (
                      <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{s}</span>
                    ))}
                  </div>
                )}
                {team.submission && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Submitted: {team.submission.title}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
