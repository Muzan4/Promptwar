'use client'
import { motion } from 'framer-motion'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start justify-between mb-8"
    >
      <div>
        <h1 className="text-2xl font-black mb-1 text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm font-mono" style={{ color: 'rgba(0,229,255,0.6)' }}>
            {'> '}{subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
