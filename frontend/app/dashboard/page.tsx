"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge" // Fixed import
import { Activity, Apple, Dumbbell, Target, TrendingUp, Calendar, Clock, Award } from "lucide-react"
import Link from "next/link"
import { API_URL, fetchApi } from '@/lib/api';

export default function Dashboard() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    weeklyProgress: 75,
    caloriesBurned: 1847,
    workoutsCompleted: 12,
    currentStreak: 5,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user || !token) {
      return
    }

    // Update your fetchProfile function
    const fetchProfile = async () => {
      try {
        const response = await fetchApi('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile()
  }, [user, token, router])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Hello, {user.name}! 👋</h1>
            <p className="text-gray-400 mt-1">Welcome back to your fitness journey</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{stats.currentStreak} day streak</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Weekly Progress</p>
                  <p className="text-2xl font-bold text-white">{stats.weeklyProgress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </div>
              <Progress value={stats.weeklyProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Calories Burned</p>
                  <p className="text-2xl font-bold text-white">{stats.caloriesBurned.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Workouts</p>
                  <p className="text-2xl font-bold text-white">{stats.workoutsCompleted}</p>
                </div>
                <Dumbbell className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{stats.currentStreak} days</p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/workouts">
                    <Button className="w-full h-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex flex-col items-center justify-center space-y-2">
                      <Dumbbell className="h-6 w-6" />
                      <span>Start Workout</span>
                    </Button>
                  </Link>
                  <Link href="/meals">
                    <Button className="w-full h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex flex-col items-center justify-center space-y-2">
                      <Apple className="h-6 w-6" />
                      <span>Meal Plan</span>
                    </Button>
                  </Link>
                  <Link href="/progress">
                    <Button className="w-full h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center justify-center space-y-2">
                      <Activity className="h-6 w-6" />
                      <span>Track Progress</span>
                    </Button>
                  </Link>
                  <Link href="/chatbot">
                    <Button className="w-full h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex flex-col items-center justify-center space-y-2">
                      <Clock className="h-6 w-6" />
                      <span>AI Assistant</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">Morning Workout</p>
                        <p className="text-gray-400 text-sm">7:00 AM - 8:00 AM</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">Healthy Lunch</p>
                        <p className="text-gray-400 text-sm">12:00 PM - 1:00 PM</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-400">Upcoming</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-white font-medium">Evening Cardio</p>
                        <p className="text-gray-400 text-sm">6:00 PM - 7:00 PM</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                {profile ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Goal</span>
                      <span className="text-white capitalize">{profile.goal?.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Activity Level</span>
                      <span className="text-white capitalize">{profile.activityLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weight</span>
                      <span className="text-white">{profile.weight} kg</span>
                    </div>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                      >
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-400">Complete your profile to get personalized recommendations</p>
                    <Link href="/profile/setup">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Complete Profile</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Completed morning workout</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Logged breakfast meal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Updated weight progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}