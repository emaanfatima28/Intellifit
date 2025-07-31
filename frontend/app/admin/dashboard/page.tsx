"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Apple, Dumbbell, TrendingUp, Activity } from "lucide-react"

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMealPlans: 0,
    totalWorkoutPlans: 0,
    totalProfiles: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchStats()
  }, [user, token, router])

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "admin") return null

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard 👨‍💼</h1>
            <p className="text-gray-400 mt-1">Manage your fitness platform</p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Administrator</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-white">{loading ? "..." : stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Meal Plans</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : stats.totalMealPlans.toLocaleString()}
                  </p>
                </div>
                <Apple className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Workout Plans</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : stats.totalWorkoutPlans.toLocaleString()}
                  </p>
                </div>
                <Dumbbell className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Active Profiles</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : stats.totalProfiles.toLocaleString()}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Platform Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">System Status</p>
                        <p className="text-gray-400 text-sm">All services operational</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">User Engagement</p>
                        <p className="text-gray-400 text-sm">85% active users this week</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">AI Assistant Usage</p>
                        <p className="text-gray-400 text-sm">1,247 conversations today</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-400">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/admin/users" className="block">
                    <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-colors">
                      <Users className="h-6 w-6 text-blue-400 mb-2" />
                      <p className="text-white font-medium">Manage Users</p>
                      <p className="text-gray-400 text-sm">View and manage all users</p>
                    </div>
                  </a>

                  <a href="/admin/meal-plans" className="block">
                    <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-colors">
                      <Apple className="h-6 w-6 text-green-400 mb-2" />
                      <p className="text-white font-medium">Meal Plans</p>
                      <p className="text-gray-400 text-sm">Review meal plans</p>
                    </div>
                  </a>

                  <a href="/admin/workout-plans" className="block">
                    <div className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-orange-600/30 transition-colors">
                      <Dumbbell className="h-6 w-6 text-orange-400 mb-2" />
                      <p className="text-white font-medium">Workout Plans</p>
                      <p className="text-gray-400 text-sm">Review workout plans</p>
                    </div>
                  </a>

                  <a href="/admin/analytics" className="block">
                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-colors">
                      <TrendingUp className="h-6 w-6 text-purple-400 mb-2" />
                      <p className="text-white font-medium">Analytics</p>
                      <p className="text-gray-400 text-sm">View detailed analytics</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Users */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">JD</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">John Doe</p>
                      <p className="text-gray-400 text-xs">Joined 2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">SM</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Sarah Miller</p>
                      <p className="text-gray-400 text-xs">Joined 5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">MJ</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Mike Johnson</p>
                      <p className="text-gray-400 text-xs">Joined 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Server Status</span>
                    <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Database</span>
                    <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">AI Service</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Email Service</span>
                    <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
