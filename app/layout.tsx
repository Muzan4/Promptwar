import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'
import FaultyTerminal from '@/components/ui/FaultyTerminal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Muzan Hackathon â€” Smart Event Management Platform',
  description: 'Unified real-time hackathon & event management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-white antialiased bg-transparent relative`}>
        <Providers>
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <FaultyTerminal 
              tint="#00c8ff" 
              scale={1.8} 
              gridMul={[2, 2]} 
              mouseStrength={0.6}
              dither={0.5}
              curvature={0.04}
              scanlineIntensity={0.25}
              brightness={0.32}
              flickerAmount={0.4}
              glitchAmount={0.3}
            />
          </div>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15,15,25,0.95)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
