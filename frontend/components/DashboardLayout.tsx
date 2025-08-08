"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Meals", href: "/meals", icon: Apple },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Community", href: "/community", icon: Users },
  { name: "AI Assistant", href: "/chatbot", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen intellifit-light-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700">
            <SidebarContent
              navigation={navigation}
              pathname={pathname}
              user={user}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow intellifit-sidebar-bg">
          <SidebarContent navigation={navigation} pathname={pathname} user={user} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b intellifit-accent-bg intellifit-bg px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold intellifit-light-text">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 intellifit-gradient rounded-full flex items-center justify-center">
                  <span className="intellifit-light-text text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="intellifit-light-text text-sm">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({
  navigation,
  pathname,
  user,
  onLogout,
  onClose,
}: {
  navigation: any[]
  pathname: string
  user: any
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b intellifit-accent-bg" style={{ backgroundColor: '#1e293b' }}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg"></div>
          <span className="text-2xl font-bold intellifit-light-text">IntelliFit</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-6">
        <ul className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors",
                  pathname === item.href
                    ? "intellifit-bg intellifit-light-text"
                    : "intellifit-light-text hover:intellifit-accent-bg hover:intellifit-accent-text",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* User section */}
        <div className="mt-auto space-y-2">
          <Link
            href="/settings"
            onClick={onClose}
            className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold intellifit-light-text hover:intellifit-accent-bg hover:intellifit-accent-text transition-colors"
          >
            <Settings className="h-5 w-5 shrink-0" />
            Settings
          </Link>
          <button
            onClick={() => {
              onLogout()
              onClose?.()
            }}
            className="group flex w-full gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold intellifit-light-text hover:intellifit-accent-bg hover:intellifit-accent-text transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign out
          </button>
        </div>
      </nav>
    </>
  )
}
