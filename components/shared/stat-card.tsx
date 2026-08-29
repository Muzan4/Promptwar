'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  color?: string
  delay?: number
}

const colorTokens: Record<string, { bg: string; border: string; topBorder: string; glow: string; iconGlow: string }> = {
  violet: {
    bg: 'rgba(14,165,233,0.05)',
    border: 'rgba(14,165,233,0.2)',
    topBorder: 'rgba(14,165,233,0.5)',
    glow: 'rgba(14,165,233,0.15)',
    iconGlow: 'rgba(14,165,233,0.25)',
  },
  cyan: {
    bg: 'rgba(0,229,255,0.05)',
    border: 'rgba(0,229,255,0.2)',
    topBorder: 'rgba(0,229,255,0.5)',
    glow: 'rgba(0,229,255,0.15)',
    iconGlow: 'rgba(0,229,255,0.25)',
  },
  green: {
    bg: 'rgba(16,185,129,0.05)',
    border: 'rgba(16,185,129,0.2)',
    topBorder: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.15)',
    iconGlow: 'rgba(16,185,129,0.25)',
  },
  orange: {
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.2)',
    topBorder: 'rgba(245,158,11,0.5)',
    glow: 'rgba(245,158,11,0.15)',
    iconGlow: 'rgba(245,158,11,0.25)',
  },
}

const iconTextColor: Record<string, string> = {
  violet: 'text-blue-400',
  cyan: 'text-cyan-400',
  green: 'text-emerald-400',
  orange: 'text-orange-400',
}

export function StatCard({ label, value, icon, change, changeType = 'neutral', color = 'violet', delay = 0 }: StatCardProps) {
  const tokens = colorTokens[color] || colorTokens.violet

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="stat-card relative p-5 rounded-2xl overflow-hidden cursor-default"
      style={{
        background: `rgba(3,8,20,0.88)`,
        border: `1px solid ${tokens.border}`,
        borderTop: `1px solid ${tokens.topBorder}`,
        boxShadow: `0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 ${tokens.topBorder}`,
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-60"
        style={{ background: `radial-gradient(ellipse at top left, ${tokens.glow}, transparent 65%)` }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div
            className={cn('p-2.5 rounded-xl', iconTextColor[color])}
            style={{
              background: `rgba(255,255,255,0.05)`,
              border: `1px solid ${tokens.border}`,
              boxShadow: `0 0 16px ${tokens.iconGlow}`,
            }}
          >
            {icon}
          </div>
          {change && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide"
              style={
                changeType === 'up'
                  ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
                  : changeType === 'down'
                  ? { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(160,170,190,0.7)', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              {change}
            </span>
          )}
        </div>
        <div className="text-3xl font-black mb-1 text-white tracking-tight">{value}</div>
        <div className="text-xs uppercase tracking-widest font-medium" style={{ color: 'rgba(120,130,150,0.8)' }}>
          {label}
        </div>
      </div>
    </motion.div>
  )
}
