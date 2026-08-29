'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/providers/firebase-auth-provider'
import QRCode from 'react-qr-code'
import { DashboardLayout } from '@/components/shared/dashboard-layout'
import { PageHeader } from '@/components/shared/page-header'
import { QrCode as QrCodeIcon, ShieldCheck, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'

export default function MyQRCodePage() {
  const { user, loading: authLoading } = useAuth()
  const [participant, setParticipant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }
    
    getDoc(doc(db, 'participants', user.uid))
      .then(docSnap => {
        if (docSnap.exists()) {
          setParticipant({ id: docSnap.id, ...docSnap.data() })
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load QR code')
        setLoading(false)
      })
  }, [user, authLoading])

  return (
    <DashboardLayout role="PARTICIPANT">
      <PageHeader
        title="My QR Code"
        subtitle="Your digital ticket to Muzan Hackathon 2026"
      />

      <div className="flex flex-col items-center justify-center max-w-md mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full glass-card rounded-3xl p-8 relative overflow-hidden"
          style={{
            borderTop: '1px solid rgba(0, 229, 255, 0.4)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,229,255,0.2), 0 0 40px rgba(0,229,255,0.1)'
          }}
        >
          {/* Decorative scanner line */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10"
            style={{ pointerEvents: 'none' }}
          />

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Identity Badge</h2>
            <p className="text-sm text-cyan-400 mt-1 font-mono">ID: {participant?.id || '...'}</p>
          </div>

          <div className="flex justify-center mb-8 relative z-0">
            <div className="p-4 bg-white rounded-2xl shadow-xl relative group">
              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
              
              {loading ? (
                <div className="w-56 h-56 flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : participant?.qrCode ? (
                <div className="w-56 h-56 transition-transform group-hover:scale-105 duration-500">
                  <QRCode value={participant.qrCode} size={224} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                </div>
              ) : (
                <div className="w-56 h-56 flex flex-col items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                  <QrCodeIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs font-medium">QR Not Found</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{user?.displayName || user?.email || 'Verified Hacker'}</span>
            </div>
            {participant?.checkedIn ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium w-full justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
                Checked In
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium w-full justify-center">
                <Camera className="w-4 h-4" />
                Show to organizer at desk
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
