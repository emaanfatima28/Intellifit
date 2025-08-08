import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IntelliFit - Your Personal Fitness Companion',
  description: 'IntelliFit: AI-powered fitness and nutrition platform for personalized meal plans, workout routines, and progress tracking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <main className="flex-1">
            {children}
          </main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
}
