'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { Bell, AlertTriangle, Info, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const priorityConfig = {
  INFO: { label: 'Info', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: Info },
  UPDATE: { label: 'Update', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: RefreshCw },
  CRITICAL: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
}

export default function ParticipantFeed() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => { setAnnouncements(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
    const interval = setInterval(() => {
      fetch('/api/announcements').then(r => r.json()).then(d => setAnnouncements(Array.isArray(d) ? d : []))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout role="PARTICIPANT">
      <PageHeader
        title="Announcements"
        subtitle="Real-time updates from organizers"
        action={
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
            Auto-updating
          </div>
        }
      />
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass border border-white/5">
          <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann, i) => {
            const cfg = priorityConfig[ann.priority as keyof typeof priorityConfig] || priorityConfig.INFO
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-2xl border glass ${cfg.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 ${cfg.color} mt-0.5`}>
                    <cfg.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{ann.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{ann.body}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                      <span>from {ann.author?.name}</span>
                      <span>·</span>
                      <span>{formatDate(ann.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
