'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Zap, Users, Bell, Award, BarChart3, QrCode, ArrowRight, Star, Terminal, Shield, Cpu } from 'lucide-react'

const features = [
  { icon: QrCode, title: 'QR Check-in', desc: 'Instant on-site attendance verification with unique QR codes', color: 'text-cyan-400', glow: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.3)' },
  { icon: Users, title: 'Smart Matchmaking', desc: 'Find teammates by skills, roles, and project interests', color: 'text-blue-400', glow: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' },
  { icon: Bell, title: 'Live Announcements', desc: 'Real-time push notifications for schedule changes and alerts', color: 'text-orange-400', glow: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.3)' },
  { icon: Award, title: 'Judging Portal', desc: 'Structured rubric-based scoring with instant feedback', color: 'text-emerald-400', glow: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
  { icon: BarChart3, title: 'Live Leaderboard', desc: 'Dynamic rankings updated in real-time as scores come in', color: 'text-pink-400', glow: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.3)' },
  { icon: Zap, title: 'One Dashboard', desc: 'Everything consolidated  zero platform juggling', color: 'text-yellow-400', glow: 'rgba(250,204,21,0.15)', border: 'rgba(250,204,21,0.3)' },
]

const roles = [
  {
    label: 'Organizer',
    desc: 'Full control - manage everything',
    href: '/login?role=ORGANIZER',
    icon: '👑',
    accent: '#a855f7',
    glowColor: 'rgba(168,85,247,0.3)',
    borderColor: 'rgba(168,85,247,0.4)',
    tagline: 'sudo run --event',
  },
  {
    label: 'Participant',
    desc: 'Register, network, and engage',
    href: '/login?role=PARTICIPANT',
    icon: '👩‍💻',
    accent: '#00e5ff',
    glowColor: 'rgba(0,229,255,0.3)',
    borderColor: 'rgba(0,229,255,0.4)',
    tagline: './join --now',
  },
  {
    label: 'Judge',
    desc: 'Score submissions with precision',
    href: '/login?role=JUDGE',
    icon: '⚖️',
    accent: '#10b981',
    glowColor: 'rgba(16,185,129,0.3)',
    borderColor: 'rgba(16,185,129,0.4)',
    tagline: 'eval --fair',
  },
]

const stats = [
  { value: '10K+', label: 'Attendees', icon: Users },
  { value: '200+', label: 'Events', icon: Star },
  { value: '99.9%', label: 'Uptime', icon: Shield },
  { value: '<50ms', label: 'Latency', icon: Cpu },
]

// Animated terminal lines for the hero
const terminalLines = [
  { text: '> initializing NexaEvent platform...', delay: 0.5, color: '#00e5ff' },
  { text: '> loading event modules...', delay: 1.0, color: '#a3a3a3' },
  { text: '> QR check-in:  ready', delay: 1.5, color: '#10b981' },
  { text: '> live leaderboard:  active', delay: 2.0, color: '#10b981' },
  { text: '> all systems operational', delay: 2.5, color: '#00e5ff' },
]

function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])

  useEffect(() => {
    terminalLines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay * 1000)
    })
  }, [])

  return (
    <div className="glass-card rounded-2xl p-5 font-mono text-sm max-w-sm w-full scanlines">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-gray-500">nexaevent ~ terminal</span>
      </div>
      <div className="space-y-2">
        {terminalLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            style={{ color: line.color }}
            className="text-xs leading-relaxed"
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines.length >= terminalLines.length && (
          <div className="text-xs text-cyan-400 cursor-blink">_</div>
        )}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'transparent' }}>

      {/* Nav */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 glass border-b border-white/8"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #a855f7)', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">NexaEvent</span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest" style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.25)' }}>
              v2.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium">
              Sign in
            </Link>
            <Link
              href="/register"
              className="btn-neon px-5 py-2 text-sm font-semibold rounded-xl text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #0284c7, #7c3aed)', border: '1px solid rgba(0,229,255,0.3)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,200,255,0.06) 0%, transparent 70%)' }} />
        <div className="absolute top-40 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <motion.div
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-xs font-medium" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)', color: '#00e5ff' }}>
              <div className="relative w-2 h-2">
                <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
              </div>
              <Terminal className="w-3 h-3" />
              LIVE | NexaEvent 2026 | All systems operational
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight text-center"
          >
            <span className="block text-white">Events managed</span>
            <span className="block gradient-text glow-text-cyan">beautifully.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base md:text-lg text-center max-w-2xl mx-auto mb-14 leading-relaxed"
            style={{ color: 'rgba(200,210,230,0.7)' }}
          >
            One platform for registration, check-in, team formation, judging, and live leaderboards.
            <br className="hidden md:block" />
            <span style={{ color: 'rgba(0,229,255,0.8)' }}>No more juggling 10 different tools.</span>
          </motion.p>

          {/* Two-column: role cards + terminal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-8"
          >
            {/* Role cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full">
              {roles.map((role, i) => (
                <motion.div
                  key={role.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={role.href}
                    className="group block p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
                    style={{
                      background: 'rgba(5,12,30,0.85)',
                      border: `1px solid ${role.borderColor}`,
                      boxShadow: `0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 ${role.borderColor}`,
                    }}
                  >
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${role.glowColor}, transparent 70%)` }} />
                    {/* Bottom glow on hover */}
                    <div className="absolute bottom-0 inset-x-0 h-px transition-opacity opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${role.accent}, transparent)` }} />

                    <div className="text-3xl mb-3">{role.icon}</div>
                    <div className="font-bold text-sm mb-1 text-white group-hover:text-white transition-colors">{role.label}</div>
                    <div className="text-xs mb-3" style={{ color: 'rgba(160,170,190,0.7)' }}>{role.desc}</div>
                    <div className="font-mono text-[10px] px-2 py-0.5 rounded inline-block" style={{ background: 'rgba(0,0,0,0.4)', color: role.accent, border: `1px solid ${role.borderColor}` }}>
                      {role.tagline}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Terminal widget */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="float-anim hidden lg:block"
            >
              <TerminalHero />
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-8 mt-14 flex-wrap"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-4" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}>
              {'>'} feature_modules --list
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Everything you need,{' '}
              <span className="gradient-text">nothing you don't</span>
            </h2>
            <p className="text-gray-400 text-lg">Six powerful modules. One unified platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card p-6 rounded-2xl group cursor-default relative overflow-hidden transition-all duration-300"
                style={{ '--hover-glow': f.glow } as React.CSSProperties}
              >
                {/* Hover glow bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ background: f.glow }} />

                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${f.border}`, boxShadow: `0 0 20px ${f.glow}` }}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-base mb-2 text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(160,170,190,0.75)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="gradient-border rounded-3xl p-[1px]">
            <div className="rounded-3xl px-10 py-16 relative overflow-hidden" style={{ background: 'rgba(3,8,20,0.95)' }}>
              {/* Background glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 70%)' }} />
              <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
                  Ready to deploy
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-white leading-tight">
                  Ready to run<br />
                  <span className="gradient-text">your next event?</span>
                </h2>
                <p className="mb-10 text-base" style={{ color: 'rgba(180,190,210,0.7)' }}>
                  Join thousands of organizers, attendees, and reviewers already on NexaEvent.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Link
                    href="/register"
                    className="btn-neon inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #0284c7, #7c3aed)', border: '1px solid rgba(0,229,255,0.4)', fontSize: '0.95rem' }}
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all text-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,210,230,0.8)' }}
                  >
                    Sign in instead
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center relative">
        <div className="neon-divider mb-8 max-w-2xl mx-auto" />
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #a855f7)' }}>
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm text-white">NexaEvent</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(100,110,130,0.8)' }}>
          2026 NexaEvent | Built with love for Event Management | <span style={{ color: 'rgba(0,229,255,0.5)' }}>Real-time | Role-based | Beautiful</span>
        </p>
      </footer>
    </div>
  )
}
