'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { Bell, Plus, Megaphone, AlertTriangle, Info, RefreshCw, Send, X } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/components/providers/firebase-auth-provider'

interface Announcement {
  id: string
  title: string
  body: string
  priority: 'INFO' | 'UPDATE' | 'CRITICAL'
  createdAt: string
  author: { name: string; role: string }
}

const priorityConfig = {
  INFO: { label: 'Info', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: Info },
  UPDATE: { label: 'Update', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: RefreshCw },
  CRITICAL: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
}

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', priority: 'INFO' as 'INFO' | 'UPDATE' | 'CRITICAL' })
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => { setAnnouncements(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function sendAnnouncement() {
    if (!form.title || !form.body) { toast.error('Fill all fields'); return }
    if (!user) { toast.error('Not authenticated'); return }
    setSending(true)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, authorId: user.uid }),
      })
      const newAnn = await res.json()
      setAnnouncements(prev => [newAnn, ...prev])
      setForm({ title: '', body: '', priority: 'INFO' })
      setShowCompose(false)
      toast.success('Announcement sent to all participants!')
    } catch {
      toast.error('Failed to send announcement')
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout role="ORGANIZER">
      <PageHeader
        title="Broadcast Center"
        subtitle="Send real-time announcements to all participants"
        action={
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        }
      />

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-strong rounded-2xl border border-violet-500/30 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-violet-400" /> Compose Announcement
                </h3>
                <button aria-label="Close modal" onClick={() => setShowCompose(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Priority selector */}
              <div className="flex gap-2 mb-4">
                {(['INFO', 'UPDATE', 'CRITICAL'] as const).map(p => {
                  const cfg = priorityConfig[p]
                  return (
                    <button
                      key={p}
                      onClick={() => setForm(f => ({ ...f, priority: p }))}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                        form.priority === p ? cfg.bg + ' ' + cfg.color : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
                    </button>
                  )
                })}
              </div>

              <input
                placeholder="Announcement title..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent mb-3"
              />
              <textarea
                placeholder="Write your message here... Be clear and concise."
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-violet-500/50 focus:outline-none text-sm bg-transparent resize-none mb-4"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCompose(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendAnnouncement}
                  disabled={sending}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  {sending ? '...' : <><Send className="w-4 h-4" /> Send to All</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['CRITICAL', 'UPDATE', 'INFO'] as const).map(p => {
          const cfg = priorityConfig[p]
          const count = announcements.filter(a => a.priority === p).length
          return (
            <div key={p} className={`p-4 rounded-2xl border glass ${cfg.bg}`}>
              <cfg.icon className={`w-5 h-5 ${cfg.color} mb-2`} />
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-gray-500">{cfg.label} alerts</div>
            </div>
          )
        })}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass border border-white/5">
            <Bell className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No announcements yet. Send the first one!</p>
          </div>
        ) : (
          announcements.map((ann, i) => {
            const cfg = priorityConfig[ann.priority]
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-2xl border glass ${cfg.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 ${cfg.color}`}>
                    <cfg.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{ann.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{ann.body}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                      <span>by {ann.author.name}</span>
                      <span></span>
                      <span>{formatDate(ann.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </DashboardLayout>
  )
}
