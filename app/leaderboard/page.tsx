'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { Trophy, Medal, Star, TrendingUp, TrendingDown, Minus, ArrowUpRight, RefreshCw, Crown } from 'lucide-react'
import { parseSkills } from '@/lib/utils'

interface LeaderboardEntry {
  id: string
  title: string
  totalScore: number
  team: {
    name: string
    track: string
    members: { user: { name: string; skills: string } }[]
  }
  scores: {
    innovation: number
    impact: number
    technical: number
    presentation: number
    judge: { user: { name: string } }
  }[]
}

const rankColors = ['from-yellow-500 to-amber-500', 'from-gray-400 to-gray-300', 'from-orange-600 to-amber-700']
const rankBg = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-500/10 border-gray-500/20', 'bg-orange-500/10 border-orange-500/20']

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/submissions')
      const data = await res.json()
      setEntries(Array.isArray(data) ? data : [])
      setLastUpdate(new Date())
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 15000) // Auto refresh every 15s
    return () => clearInterval(interval)
  }, [])

  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  function avgCategory(scores: LeaderboardEntry['scores'], key: keyof Omit<typeof scores[0], 'judge'>) {
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((s, sc) => s + (sc[key] as number), 0) / scores.length)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg">
      {/* Header */}
      <div className="border-b border-violet-900/20 glass-strong sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Live Leaderboard</h1>
              <p className="text-xs text-gray-500">NexaHack 2024 · Auto-updates every 15s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
              Live
            </div>
            <button
              onClick={fetchLeaderboard}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-24 text-gray-500">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading rankings...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-24">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No submissions yet</p>
            <p className="text-gray-600 text-sm mt-1">Rankings will appear as judges score submissions</p>
          </div>
        ) : (
          <>
            {/* Podium — Top 3 */}
            {top3.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <h2 className="font-bold text-lg">Top Teams</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {top3.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className={`relative p-6 rounded-2xl border ${rankBg[i] || 'bg-white/5 border-white/10'} ${i === 0 ? 'md:-mt-4 md:pb-10' : ''}`}
                    >
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[i] || 'from-gray-500 to-gray-600'} flex items-center justify-center font-bold text-lg mb-4`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{entry.team.name}</h3>
                      <p className="text-sm font-medium text-gray-300 mb-1">{entry.title}</p>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">{entry.team.track}</span>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-2xl font-bold gradient-text">{entry.totalScore.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">avg score / 50</div>
                      </div>

                      {/* Category bars */}
                      <div className="mt-4 space-y-2">
                        {['innovation', 'impact', 'technical', 'presentation'].map(cat => (
                          <div key={cat}>
                            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                              <span className="capitalize">{cat}</span>
                              <span>{avgCategory(entry.scores, cat as any)}</span>
                            </div>
                            <div className="h-1 rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
                                style={{ width: `${avgCategory(entry.scores, cat as any) * 2}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Rest of rankings */}
            {rest.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-semibold text-sm text-gray-400 mb-4">All Rankings</h2>
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/5 hover:border-violet-500/20 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-gray-400/20 text-gray-300' :
                      i === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-white/5 text-gray-500'
                    }`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{entry.team.name}</p>
                      <p className="text-xs text-gray-500 truncate">{entry.title}</p>
                    </div>
                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded-md text-gray-400">{entry.team.track}</span>
                    <div className="flex items-center gap-3">
                      {/* Score bars */}
                      <div className="hidden md:flex gap-2">
                        {['innovation', 'impact', 'technical', 'presentation'].map(cat => (
                          <div key={cat} className="text-center">
                            <div className="text-xs font-bold text-violet-300">{avgCategory(entry.scores, cat as any)}</div>
                            <div className="text-xs text-gray-600 capitalize">{cat.slice(0, 3)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{entry.totalScore.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">/ 50</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
