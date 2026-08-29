'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/firebase-auth-provider'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { Users, Plus, Search, Lock, CheckCircle2, X, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { parseSkills } from '@/lib/utils'

interface Team {
  id: string
  name: string
  track: string
  description: string | null
  status: 'OPEN' | 'FULL' | 'LOCKED'
  lookingFor: string
  members: { user: { name: string; skills: string; email: string } }[]
}

const TRACKS = ['All', 'AI/ML', 'Web3', 'Data', 'Systems', 'Mobile', 'General']
const SKILL_COLORS: Record<string, string> = {
  React: 'text-cyan-400 bg-cyan-400/10',
  'AI/ML': 'text-violet-400 bg-violet-400/10',
  Python: 'text-blue-400 bg-blue-400/10',
  TypeScript: 'text-blue-300 bg-blue-300/10',
  Blockchain: 'text-orange-400 bg-orange-400/10',
  'UI/UX': 'text-pink-400 bg-pink-400/10',
  default: 'text-gray-400 bg-gray-400/10',
}

export default function TeamsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [track, setTrack] = useState('All')
  const [showCreate, setShowCreate] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', description: '', track: 'AI/ML', lookingFor: [] as string[] })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/teams')
      .then(r => r.json())
      .then(d => { setTeams(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = teams.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
    const matchTrack = track === 'All' || t.track === track
    return matchSearch && matchTrack
  })

  const openTeams = filtered.filter(t => t.status === 'OPEN')
  const otherTeams = filtered.filter(t => t.status !== 'OPEN')

  async function createTeam() {
    if (!newTeam.name) { toast.error('Team name required'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeam.name, description: newTeam.description, track: newTeam.track, leaderId: user?.uid }),
      })
      const t = await res.json()
      setTeams(prev => [{ ...t, members: [] }, ...prev])
      setShowCreate(false)
      toast.success('Team created!')
    } catch {
      toast.error('Failed to create team')
    } finally {
      setCreating(false)
    }
  }

  function skillColor(skill: string) {
    return SKILL_COLORS[skill] || SKILL_COLORS.default
  }

  return (
    <DashboardLayout role="PARTICIPANT">
      <PageHeader
        title="Find Your Team"
        subtitle="Browse open teams and connect with your future hackathon partners"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Create Team
          </button>
        }
      />

      {/* Create Team Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-strong rounded-2xl border border-violet-500/30 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Create New Team</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Team name"
                value={newTeam.name}
                onChange={e => setNewTeam(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
              />
              <textarea
                placeholder="What are you building? (optional)"
                value={newTeam.description}
                onChange={e => setNewTeam(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent resize-none"
              />
              <select
                value={newTeam.track}
                onChange={e => setNewTeam(p => ({ ...p, track: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-[#0f0f1a]"
              >
                {TRACKS.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-sm">Cancel</button>
                <button
                  onClick={createTeam}
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-sm font-medium"
                >
                  {creating ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search teams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl glass border border-white/10 overflow-x-auto">
          {TRACKS.map(t => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                track === t ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading teams...</div>
      ) : (
        <>
          {/* Open Teams */}
          {openTeams.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" /> Open Teams ({openTeams.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openTeams.map((team, i) => (
                  <TeamCard key={team.id} team={team} index={i} skillColor={skillColor} />
                ))}
              </div>
            </div>
          )}

          {/* Full/Locked Teams */}
          {otherTeams.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Other Teams ({otherTeams.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                {otherTeams.map((team, i) => (
                  <TeamCard key={team.id} team={team} index={i} skillColor={skillColor} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16 rounded-2xl glass border border-white/5">
              <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No teams found</p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

function TeamCard({ team, index, skillColor }: { team: Team; index: number; skillColor: (s: string) => string }) {
  const lookingFor = parseSkills(team.lookingFor)
  const allSkills = team.members.flatMap(m => parseSkills(m.user.skills))
  const uniqueSkills = [...new Set(allSkills)].slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="p-5 rounded-2xl glass border border-white/5 hover:border-violet-500/20 transition-all"
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
        }`}>
          {team.status}
        </span>
      </div>

      {team.description && (
        <p className="text-sm text-gray-400 mb-3 leading-relaxed line-clamp-2">{team.description}</p>
      )}

      {/* Members */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          {team.members.slice(0, 4).map((m, i) => (
            <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 border-2 border-[#0f0f1a] flex items-center justify-center text-xs font-bold">
              {m.user.name[0]}
            </div>
          ))}
          {team.members.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#0f0f1a] flex items-center justify-center text-xs text-gray-400">
              +{team.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Skills */}
      {uniqueSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {uniqueSkills.map(s => (
            <span key={s} className={`text-xs px-2 py-0.5 rounded-md font-medium ${skillColor(s)}`}>{s}</span>
          ))}
        </div>
      )}

      {/* Looking for */}
      {lookingFor.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Looking for:</span>
          <div className="flex gap-1">
            {lookingFor.map(r => (
              <span key={r} className="text-xs px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300">{r}</span>
            ))}
          </div>
        </div>
      )}

      {team.status === 'OPEN' && (
        <button className="w-full mt-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-300 text-sm font-medium transition-all">
          Request to Join
        </button>
      )}
    </motion.div>
  )
}
