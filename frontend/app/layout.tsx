import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext' // Corrected import path

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitnessPro - Your Personal Fitness Companion',
  description: 'AI-powered fitness and nutrition platform for personalized meal plans, workout routines, and progress tracking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
