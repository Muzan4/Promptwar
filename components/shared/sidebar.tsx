'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/firebase-auth-provider'
import { cn, getInitials } from '@/lib/utils'
import {
  LayoutDashboard, Users, Bell, Award, BarChart3, QrCode,
  LogOut, Zap, Trophy, FileText, Target, ChevronRight
} from 'lucide-react'

const navByRole: Record<string, { label: string; href: string; icon: any }[]> = {
  ORGANIZER: [
    { label: 'Dashboard', href: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'Attendees', href: '/organizer/attendees', icon: QrCode },
    { label: 'Teams', href: '/organizer/teams', icon: Users },
    { label: 'Announcements', href: '/organizer/announcements', icon: Bell },
    { label: 'Judging', href: '/organizer/judging', icon: Award },
    { label: 'Analytics', href: '/organizer/analytics', icon: BarChart3 },
  ],
  PARTICIPANT: [
    { label: 'Dashboard', href: '/participant/dashboard', icon: LayoutDashboard },
    { label: 'My QR Code', href: '/participant/qr', icon: QrCode },
    { label: 'Find Team', href: '/participant/teams', icon: Users },
    { label: 'Announcements', href: '/participant/feed', icon: Bell },
    { label: 'Submit Project', href: '/participant/submit', icon: FileText },
  ],
  JUDGE: [
    { label: 'Dashboard', href: '/judge/dashboard', icon: LayoutDashboard },
    { label: 'Submissions', href: '/judge/submissions', icon: FileText },
  ],
}

const sharedNav = [
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

const roleConfig: Record<string, { accent: string; glow: string; label: string; emoji: string }> = {
  ORGANIZER: { accent: '#a855f7', glow: 'rgba(168,85,247,0.3)', label: 'Organizer', emoji: '🎯' },
  PARTICIPANT: { accent: '#00e5ff', glow: 'rgba(0,229,255,0.3)', label: 'Participant', emoji: '🚀' },
  JUDGE: { accent: '#10b981', glow: 'rgba(16,185,129,0.3)', label: 'Judge', emoji: '⚖️' },
}

export function Sidebar({ role, onClose }: { role: string, onClose?: () => void }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const nav = [...(navByRole[role] || []), ...sharedNav]
  const rc = roleConfig[role] || roleConfig.PARTICIPANT

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-40"
      style={{
        background: 'rgba(2, 6, 16, 0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(0, 200, 255, 0.12)',
        boxShadow: '4px 0 40px rgba(0,0,0,0.6), inset -1px 0 0 rgba(0,200,255,0.05)',
      }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #a855f7)',
              boxShadow: '0 0 20px rgba(14,165,233,0.4)',
            }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-white">Muzan Hackathon</span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs font-semibold"
          style={{
            background: `rgba(${rc.accent === '#00e5ff' ? '0,229,255' : rc.accent === '#a855f7' ? '168,85,247' : '16,185,129'}, 0.08)`,
            border: `1px solid ${rc.glow.replace('0.3', '0.3')}`,
            color: rc.accent,
          }}
        >
          <span>{rc.emoji}</span>
          <span>$ --role={rc.label.toLowerCase()}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.label} href={item.href} onClick={onClose}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  )}
                  style={active ? {
                    background: `linear-gradient(90deg, ${rc.glow.replace('0.3', '0.15')}, transparent)`,
                    border: `1px solid ${rc.glow.replace('0.3', '0.35')}`,
                    color: rc.accent,
                  } : {
                    color: 'rgba(160,170,190,0.7)',
                    border: '1px solid transparent',
                  }}
                >
                  {active && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                      style={{ background: rc.accent, boxShadow: `0 0 8px ${rc.accent}` }}
                    />
                  )}
                  <item.icon
                    className="w-4 h-4 flex-shrink-0 transition-colors"
                    style={{ color: active ? rc.accent : 'rgba(120,130,150,0.7)' }}
                  />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: rc.accent }} />}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-sm shrink-0 border border-violet-500/20">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200 group"
          style={{ color: 'rgba(120,130,150,0.7)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(120,130,150,0.7)'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
