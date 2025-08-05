"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Calendar, Target, TrendingUp, Award, Camera, MapPin, Mail } from "lucide-react"

export default function ProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const workoutStats = {
    totalWorkouts: 156,
    currentStreak: 18,
    totalHours: 234,
    caloriesBurned: 45680,
  }

  const bodyStats = {
    height: 180,
    weight: 75,
    age: 32,
    bmi: 23.1,
    bodyFat: 12,
    muscleMass: 65,
  }

  const weeklyActivity = [
    { day: "Mon", workouts: 1, minutes: 45, calories: 450 },
    { day: "Tue", workouts: 1, minutes: 35, calories: 380 },
    { day: "Wed", workouts: 0, minutes: 0, calories: 0 },
    { day: "Thu", workouts: 1, minutes: 50, calories: 520 },
    { day: "Fri", workouts: 1, minutes: 40, calories: 410 },
    { day: "Sat", workouts: 1, minutes: 75, calories: 600 },
    { day: "Sun", workouts: 1, minutes: 30, calories: 350 },
  ]

  const recentWorkouts = [
    {
      name: "Upper Body Strength",
      difficulty: "Strength",
      level: "Advanced",
      date: "2024-06-15",
      duration: 45,
      calories: 420,
    },
    {
      name: "HIIT Cardio Blast",
      difficulty: "Cardio",
      level: "Advanced",
      date: "2024-06-14",
      duration: 30,
      calories: 380,
    },
    { name: "Yoga Flow", difficulty: "Yoga", level: "Beginner", date: "2024-06-13", duration: 60, calories: 250 },
    {
      name: "Full Body Circuit",
      difficulty: "HIIT",
      level: "Intermediate",
      date: "2024-06-12",
      duration: 50,
      calories: 450,
    },
  ]

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }

    fetchProfile()
  }, [user, token, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const profileData = await response.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Intermediate</Badge>
                    <span className="text-gray-300">Member since January 2024</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      San Francisco, CA
                    </div>
                  </div>
                </div>
              </div>

              <Button className="bg-slate-700 hover:bg-slate-600 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-orange-500">
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-orange-500">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-orange-500">
              Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{workoutStats.totalWorkouts}</div>
                  <div className="text-blue-400 text-sm">Total Workouts</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{workoutStats.currentStreak}</div>
                  <div className="text-green-400 text-sm">Current Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{workoutStats.totalHours}</div>
                  <div className="text-orange-400 text-sm">Total Hours</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {workoutStats.caloriesBurned.toLocaleString()}
                  </div>
                  <div className="text-purple-400 text-sm">Calories Burned</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Body Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Body Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Height</span>
                      <span className="text-white">{bodyStats.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weight</span>
                      <span className="text-white">{bodyStats.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age</span>
                      <span className="text-white">{bodyStats.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">BMI</span>
                      <span className="text-white">{bodyStats.bmi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Body Fat</span>
                      <span className="text-white">{bodyStats.bodyFat}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Muscle Mass</span>
                      <span className="text-white">{bodyStats.muscleMass} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Goals */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Current Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Weight Goal</span>
                      <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">
                        Edit
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">75 kg</span>
                      <span className="text-gray-400 text-sm">70 kg</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Body Fat Goal</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">12%</span>
                      <span className="text-gray-400 text-sm">10%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Passionate fitness enthusiast on a journey to achieve optimal health and wellness. Love sharing my
                    progress and motivating others in the community.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined January 2024
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* This Week's Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">This Week's Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyActivity.map((day) => (
                    <div key={day.day} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            day.workouts > 0 ? "bg-orange-500" : "bg-slate-600"
                          }`}
                        >
                          <span className="text-white text-sm font-medium">{day.day}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {day.workouts} workout{day.workouts !== 1 ? "s" : ""}
                          </p>
                          <p className="text-gray-400 text-sm">{day.minutes} minutes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-400 font-medium">{day.calories}</p>
                        <p className="text-gray-400 text-sm">calories</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            workout.difficulty === "Strength"
                              ? "bg-red-500/20 text-red-400"
                              : workout.difficulty === "Cardio"
                                ? "bg-blue-500/20 text-blue-400"
                                : workout.difficulty === "Yoga"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {workout.difficulty}
                        </div>
                        <div>
                          <p className="text-white font-medium">{workout.name}</p>
                          <p className="text-gray-400 text-sm">
                            {workout.date} • {workout.duration} min • {workout.calories} cal
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          workout.level === "Beginner"
                            ? "bg-green-500/20 text-green-400"
                            : workout.level === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {workout.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-gray-400">Detailed progress charts and analytics coming soon!</p>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Achievements</h3>
              <p className="text-gray-400">Your fitness milestones and badges will appear here!</p>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Personal Records</h3>
              <p className="text-gray-400">Track your personal bests and milestones here!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
