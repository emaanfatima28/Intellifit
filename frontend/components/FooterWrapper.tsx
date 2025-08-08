"use client"

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterWrapper() {
    const pathname = usePathname()

    // Don't show footer on auth pages
    const isAuthPage = pathname.startsWith('/auth/') || pathname === '/auth'

    if (isAuthPage) {
        return null
    }

    return <Footer />
}
