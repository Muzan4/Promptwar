'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { QrCode, Search, CheckCircle2, Clock, Users, ScanLine, X } from 'lucide-react'
import { toast } from 'sonner'
import { Scanner } from '@yudiel/react-qr-scanner'
import { formatDate, parseSkills } from '@/lib/utils'

interface Participant {
  id: string
  checkedIn: boolean
  checkedInAt: string | null
  user: { id: string; name: string; email: string; skills: string }
  team?: { name: string } | null
}

export default function AttendeesPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)

  const handleScan = async (detectedCodes: any[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return
    const data = detectedCodes[0].rawValue

    if (data.startsWith('MUZAN:')) {
      const parts = data.split(':')
      const userId = parts[1]
      
      let p = participants.find(p => p.user.id === userId || (p as any).userId === userId)
      
      // If not found locally, the user might have just registered. Re-fetch.
      if (!p) {
        try {
          const res = await fetch('/api/participants')
          const freshData = await res.json()
          if (Array.isArray(freshData)) {
            setParticipants(freshData)
            p = freshData.find(p => p.user.id === userId || (p as any).userId === userId)
          }
        } catch (e) {
          console.error('Failed to refetch participants', e)
        }
      }

      if (p) {
        setShowScanner(false)
        if (p.checkedIn) {
          toast.info(`${p.user.name} is already checked in.`)
        } else {
          toggleCheckIn(p)
        }
      } else {
        toast.error('Participant not found.')
        setShowScanner(false)
      }
    } else {
      toast.error('Invalid QR Code format.')
      setShowScanner(false)
    }
  }

  useEffect(() => {
    fetch('/api/participants')
      .then(r => r.json())
      .then(d => { setParticipants(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = participants.filter(p => {
    const matchSearch = p.user.name.toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'in' && p.checkedIn) || (filter === 'out' && !p.checkedIn)
    return matchSearch && matchFilter
  })

  const checkedInCount = participants.filter(p => p.checkedIn).length

  async function toggleCheckIn(p: Participant) {
    setChecking(p.id)
    try {
      const res = await fetch('/api/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: p.id, checkedIn: !p.checkedIn }),
      })
      const updated = await res.json()
      setParticipants(prev => prev.map(x => x.id === p.id ? { ...x, ...updated } : x))
      toast.success(p.checkedIn ? `${p.user.name} checked out` : `âœ… ${p.user.name} checked in!`)
    } catch {
      toast.error('Failed to update check-in')
    } finally {
      setChecking(null)
    }
  }

  return (
    <DashboardLayout role="ORGANIZER">
      <PageHeader
        title="Attendee Check-in"
        subtitle="Manage attendance and verify participants"
        action={
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            {checkedInCount} / {participants.length} checked in
          </div>
        }
      />

      {/* QR Scanner Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-violet-900/30 to-cyan-900/20 border border-violet-500/20 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-violet-600/30 flex items-center justify-center">
          <ScanLine className="w-6 h-6 text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-0.5">QR Code Scanner</h3>
          <p className="text-xs text-gray-400">Point the camera at a participant's QR code to instantly check them in. Works on mobile devices at registration desks.</p>
        </div>
        <button onClick={() => setShowScanner(true)} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors flex items-center gap-2">
          <QrCode className="w-4 h-4" /> Launch Scanner
        </button>
      </motion.div>

      {/* Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-sm glass-card rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-cyan-400" /> Scan Ticket
                </h3>
                <button onClick={() => setShowScanner(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden aspect-square relative bg-black/50 border border-white/10">
                <Scanner onScan={handleScan} />
                {/* Decorative brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">Point the camera at the participant's QR code.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Overall Check-in Progress</span>
          <span className="text-violet-300 font-medium">{participants.length > 0 ? Math.round(checkedInCount / participants.length * 100) : 0}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${participants.length > 0 ? (checkedInCount / participants.length * 100) : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
          />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl glass border border-white/10">
          {(['all', 'in', 'out'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'in' ? 'âœ… In' : 'â³ Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl glass border border-violet-900/20 overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 flex items-center gap-2 text-xs text-gray-500">
          <Users className="w-3.5 h-3.5" />
          {filtered.length} participants
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading participants...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No participants found</div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    p.checkedIn ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'
                  }`}>
                    {p.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.user.name}</p>
                    <p className="text-xs text-gray-500">{p.user.email}</p>
                    {p.team && (
                      <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-cyan-400">
                        <Users className="w-3 h-3" /> {p.team.name}
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="hidden md:flex gap-1">
                    {parseSkills(p.user.skills).slice(0, 2).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-gray-400">{s}</span>
                    ))}
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-3">
                    {p.checkedIn ? (
                      <div className="text-right">
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked in
                        </span>
                        {p.checkedInAt && (
                          <span className="text-xs text-gray-600">{formatDate(p.checkedInAt)}</span>
                        )}
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    <button
                      onClick={() => toggleCheckIn(p)}
                      disabled={checking === p.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        p.checkedIn
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {checking === p.id ? '...' : p.checkedIn ? 'Undo' : 'Check In'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
