'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/firebase-auth-provider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import {
  Users, QrCode, Trophy, FileText, Bell, TrendingUp,
  CheckCircle2, Clock, ArrowUpRight, Zap, Activity
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { formatDate } from '@/lib/utils'

const checkInData = [
  { time: '9:00', count: 12 },
  { time: '9:30', count: 28 },
  { time: '10:00', count: 45 },
  { time: '10:30', count: 67 },
  { time: '11:00', count: 82 },
  { time: '11:30', count: 91 },
  { time: '12:00', count: 97 },
  { time: '12:30', count: 105 },
]

const trackData = [
  { name: 'AI/ML', value: 38, color: '#7c3aed' },
  { name: 'Web3', value: 22, color: '#06b6d4' },
  { name: 'Data', value: 20, color: '#10b981' },
  { name: 'Systems', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#6b7280' },
]

const recentActivity = [
  { type: 'checkin', user: 'Emma Wilson', time: '2 min ago', icon: 'âœ…' },
  { type: 'team', user: 'Neural Nexus', time: '5 min ago', icon: 'ðŸ‘¥' },
  { type: 'submission', user: 'Chain Breakers', time: '12 min ago', icon: 'ðŸ“¦' },
  { type: 'checkin', user: 'Frank Patel', time: '15 min ago', icon: 'âœ…' },
  { type: 'announcement', user: 'Alex Morgan', time: '22 min ago', icon: 'ðŸ“¢' },
]

export default function OrganizerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ total: 247, checkedIn: 187, teams: 42, submissions: 38 })
  const [liveTime, setLiveTime] = useState(new Date())

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    const timer = setInterval(() => setLiveTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [user, loading, router])

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => {
        if (d.total) setStats(d)
      })
      .catch(() => {})
  }, [])

  const checkedInPct = Math.round((stats.checkedIn / stats.total) * 100)

  return (
    <DashboardLayout role="ORGANIZER">
      <PageHeader
        title={`Welcome, Organizer ${user?.displayName || ''} âš¡`}
        subtitle={`Muzan Hackathon 2026 Â· ${liveTime.toLocaleTimeString()}`}
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
            Live
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Registered"
          value={stats.total}
          icon={<Users className="w-4 h-4" />}
          change="+12 today"
          changeType="up"
          color="violet"
          delay={0}
        />
        <StatCard
          label="Checked In"
          value={`${stats.checkedIn} (${checkedInPct}%)`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          change="Live"
          changeType="up"
          color="green"
          delay={0.05}
        />
        <StatCard
          label="Active Teams"
          value={stats.teams}
          icon={<Trophy className="w-4 h-4" />}
          change={`${Math.round(stats.teams * 0.7)} full`}
          changeType="neutral"
          color="cyan"
          delay={0.1}
        />
        <StatCard
          label="Submissions"
          value={stats.submissions}
          icon={<FileText className="w-4 h-4" />}
          change={`${stats.submissions} scored`}
          changeType="up"
          color="orange"
          delay={0.15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Check-in Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-5 rounded-2xl glass border border-violet-900/20"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-sm">Check-in Flow</h3>
              <p className="text-xs text-gray-500 mt-0.5">Attendance over time today</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <Activity className="w-3.5 h-3.5" />
              Real-time
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={checkInData}>
              <defs>
                <linearGradient id="checkInGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, color: '#fff' }}
                labelStyle={{ color: '#a78bfa' }}
              />
              <Area type="monotone" dataKey="count" stroke="#7c3aed" fill="url(#checkInGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Track Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl glass border border-violet-900/20"
        >
          <h3 className="font-semibold text-sm mb-1">Track Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Teams by category</p>
          <div className="flex justify-center">
            <PieChart width={140} height={140}>
              <Pie data={trackData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                {trackData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1.5 mt-2">
            {trackData.map(t => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  <span className="text-gray-400">{t.name}</span>
                </div>
                <span className="text-white font-medium">{t.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl glass border border-violet-900/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Activity</h3>
            <span className="text-xs text-gray-500">Live feed</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="text-lg">{act.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{act.user}</p>
                  <p className="text-xs text-gray-500 capitalize">{act.type}</p>
                </div>
                <span className="text-xs text-gray-600">{act.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl glass border border-violet-900/20"
        >
          <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Scan Check-in', href: '/organizer/attendees', icon: QrCode, color: 'violet' },
              { label: 'Send Alert', href: '/organizer/announcements', icon: Bell, color: 'orange' },
              { label: 'View Teams', href: '/organizer/teams', icon: Users, color: 'cyan' },
              { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, color: 'green' },
            ].map((action) => (
              <motion.a
                key={action.label}
                href={action.href}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/20 transition-all group"
              >
                <action.icon className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">Check-in Progress</span>
              <span className="text-violet-300 font-medium">{checkedInPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${checkedInPct}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">{stats.checkedIn} of {stats.total} attendees</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
