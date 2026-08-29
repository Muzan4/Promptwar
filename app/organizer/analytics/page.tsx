'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { StatCard } from '@/components/shared/stat-card'
import { PageHeader } from '@/components/shared/page-header'
import { Users, Trophy, FileText, CheckCircle2, BarChart3, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'

const skillsData = [
  { skill: 'React', count: 32 },
  { skill: 'Python', count: 28 },
  { skill: 'AI/ML', count: 25 },
  { skill: 'Node.js', count: 18 },
  { skill: 'UI/UX', count: 15 },
  { skill: 'Blockchain', count: 10 },
]

const scoreDistribution = [
  { range: '0-10', count: 1 },
  { range: '11-20', count: 2 },
  { range: '21-30', count: 4 },
  { range: '31-40', count: 8 },
  { range: '41-50', count: 6 },
]

const engagementData = [
  { subject: 'Check-ins', A: 76 },
  { subject: 'Teams', A: 85 },
  { subject: 'Submissions', A: 91 },
  { subject: 'Scores', A: 68 },
  { subject: 'Announcements', A: 95 },
]

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 247, checkedIn: 187, teams: 42, submissions: 38 })

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => {
      if (d.total) setStats(d)
    }).catch(() => {})
  }, [])

  return (
    <DashboardLayout role="ORGANIZER">
      <PageHeader
        title="Analytics"
        subtitle="Real-time event insights and engagement metrics"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Registered" value={stats.total} icon={<Users className="w-4 h-4" />} color="violet" delay={0} />
        <StatCard label="Checked In" value={stats.checkedIn} icon={<CheckCircle2 className="w-4 h-4" />} color="green" delay={0.05} />
        <StatCard label="Active Teams" value={stats.teams} icon={<Trophy className="w-4 h-4" />} color="cyan" delay={0.1} />
        <StatCard label="Submissions" value={stats.submissions} icon={<FileText className="w-4 h-4" />} color="orange" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Skills distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl glass border border-violet-900/20"
        >
          <h3 className="font-semibold text-sm mb-1">Skills Distribution</h3>
          <p className="text-xs text-gray-500 mb-5">Top skills among registered participants</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="skill" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={4}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl glass border border-violet-900/20"
        >
          <h3 className="font-semibold text-sm mb-1">Score Distribution</h3>
          <p className="text-xs text-gray-500 mb-5">Number of teams per score range</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="count" fill="#7c3aed" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Engagement metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-2xl glass border border-violet-900/20"
      >
        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" /> Platform Engagement
        </h3>
        <p className="text-xs text-gray-500 mb-5">Feature adoption across all participants</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Check-in Rate', value: `${Math.round(stats.checkedIn / Math.max(stats.total, 1) * 100)}%`, color: 'text-green-400' },
            { label: 'Team Formation', value: '85%', color: 'text-cyan-400' },
            { label: 'Submission Rate', value: '91%', color: 'text-violet-400' },
            { label: 'Judging Progress', value: '68%', color: 'text-orange-400' },
            { label: 'Announcements', value: '95%', color: 'text-pink-400' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="text-center p-4 rounded-xl bg-white/5"
            >
              <div className={`text-2xl font-bold mb-1 ${m.color}`}>{m.value}</div>
              <div className="text-xs text-gray-500">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
