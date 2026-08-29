'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/firebase-auth-provider'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { QrCode, Bell, Users, Trophy, Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { parseSkills, formatDate } from '@/lib/utils'

export default function ParticipantDashboard() {
  const { user } = useAuth()
  const [me, setMe] = useState<any>(null)
  const [participant, setParticipant] = useState<any>(null)
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setMe)
    fetch('/api/announcements').then(r => r.json()).then(d => setAnnouncements(Array.isArray(d) ? d.slice(0, 3) : []))
    fetch('/api/participants').then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        const p = d.find((p: any) => p.user?.email === user?.email)
        if (p) setParticipant(p)
      }
    })
  }, [user])

  const skills = parseSkills(me?.skills || '[]')
  const priorityConfig: Record<string, { color: string; bg: string }> = {
    INFO: { color: 'text-blue-400', bg: 'glass-card border-blue-500/30' },
    UPDATE: { color: 'text-yellow-400', bg: 'glass-card border-yellow-500/30' },
    CRITICAL: { color: 'text-red-400', bg: 'glass-card border-red-500/30' },
  }

  return (
    <DashboardLayout role="PARTICIPANT">
      <PageHeader
        title={`Hey, ${user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Hacker'} 👋`}
        subtitle="NexaHack 2024 · Dashboard"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status cards */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Check-in Status"
              value={participant?.checkedIn ? '✅ Checked In' : '⏳ Not Yet'}
              icon={<QrCode className="w-4 h-4" />}
              color={participant?.checkedIn ? 'green' : 'orange'}
              delay={0}
            />
            <StatCard
              label="Team Status"
              value={participant?.team?.name || 'No Team'}
              icon={<Users className="w-4 h-4" />}
              color={participant?.team ? 'cyan' : 'violet'}
              delay={0.05}
            />
          </div>

          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl glass border border-violet-900/20"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" /> Event Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Tech Hub Convention Center, Mumbai</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Dec 15–16, 2024 · 36 hours</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">₹5,00,000 prize pool</span>
              </div>
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-2xl glass border border-violet-900/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-violet-400" /> Latest Announcements
              </h3>
              <Link href="/participant/feed" className="text-xs text-violet-400 hover:text-violet-300">See all</Link>
            </div>
            {announcements.length === 0 ? (
              <p className="text-sm text-gray-500">No announcements yet</p>
            ) : (
              <div className="space-y-3">
                {announcements.map(ann => {
                  const cfg = priorityConfig[ann.priority] || priorityConfig.INFO
                  return (
                    <div key={ann.id} className={`p-3 rounded-xl border glass ${cfg.bg}`}>
                      <p className={`text-xs font-semibold mb-0.5 ${cfg.color}`}>{ann.priority}</p>
                      <p className="text-sm font-medium">{ann.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ann.body}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column - QR Code */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl glass border border-violet-900/20 text-center"
          >
            <h3 className="font-semibold mb-1">Your QR Code</h3>
            <p className="text-xs text-gray-500 mb-4">Show this at registration desks</p>
            {participant?.qrCode ? (
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-xl">
                  <img src={participant.qrCode} alt="Your QR code" className="w-36 h-36" />
                </div>
              </div>
            ) : (
              <div className="w-44 h-44 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-gray-600" />
              </div>
            )}
            <p className="text-xs text-gray-600 mt-3">{user?.email}</p>
            {participant?.checkedIn && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Verified & Checked In
              </div>
            )}
          </motion.div>

          {/* Skills */}
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-2xl glass border border-violet-900/20"
            >
              <h3 className="font-semibold mb-3 text-sm">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-violet-600/20 border border-violet-500/20 text-violet-300 text-xs font-medium">{s}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl glass border border-violet-900/20"
          >
            <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'Find a Team', href: '/participant/teams', icon: Users },
                { label: 'Announcements', href: '/participant/feed', icon: Bell },
                { label: 'Live Leaderboard', href: '/leaderboard', icon: Trophy },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <l.icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{l.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
