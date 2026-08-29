'use client'
import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Menu, X } from 'lucide-react'

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode
  role: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-transparent w-full">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 border-b border-white/10">
        <span className="font-bold text-lg">Muzan Hackathon</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-white/5 border border-white/10">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - responsive */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar role={role} onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 w-full md:pl-60 pt-20 md:pt-6 p-4 md:p-6 overflow-auto min-w-0">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
