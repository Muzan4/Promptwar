'use client'
import { ThemeProvider } from 'next-themes'
import { FirebaseAuthProvider } from './providers/firebase-auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseAuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </FirebaseAuthProvider>
  )
}
