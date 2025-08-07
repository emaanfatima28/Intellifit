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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Award, Edit } from "lucide-react"

export default function ProgressPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalHours: 0,
    currentStreak: 0,
    caloriesBurned: 0,
    height: 0,
    weight: 0,
    age: 0,
    bmi: 0,
    bodyFat: 0,
    muscleMass: 0,
  })
  const [weightData, setWeightData] = useState<any[]>([])
  const [workoutData, setWorkoutData] = useState<any[]>([])
  const [mealData, setMealData] = useState<any[]>([])
  const [bodyCompositionData, setBodyCompositionData] = useState<any[]>([])
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
    fetchAllProgress()
  }, [user, token, router])

  // Fetch all progress data for the user
  const fetchAllProgress = async () => {
    setLoading(true)
    try {
      // Fetch profile
      const profileRes = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data)
        setStats((prev) => ({ ...prev, weight: data.weight || 0, height: data.height || 0, age: data.age || 0 }))
      }
      // Fetch weight progress
      const weightRes = await fetch("http://localhost:3000/progress/weight", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (weightRes.ok) {
        const data = await weightRes.json()
        setWeightData(data)
      }
      // Fetch workout progress
      const workoutRes = await fetch("http://localhost:3000/progress/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (workoutRes.ok) {
        const data = await workoutRes.json()
        setWorkoutData(data.weekly || [])
        setStats((prev) => ({
          ...prev,
          totalWorkouts: data.totalWorkouts || 0,
          totalHours: data.totalHours || 0,
          currentStreak: data.currentStreak || 0,
          caloriesBurned: data.caloriesBurned || 0,
        }))
        setRecentWorkouts(data.recent || [])
      }
      // Fetch meal progress
      const mealRes = await fetch("http://localhost:3000/progress/meals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (mealRes.ok) {
        const data = await mealRes.json()
        setMealData(data)
      }
      // Fetch body composition
      const bodyRes = await fetch("http://localhost:3000/progress/body", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (bodyRes.ok) {
        const data = await bodyRes.json()
        setBodyCompositionData(data)
        setStats((prev) => ({
          ...prev,
          bmi: data.bmi || 0,
          bodyFat: data.bodyFat || 0,
          muscleMass: data.muscleMass || 0,
        }))
      }
    } catch (error) {
      console.error("Error fetching progress data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
            <p className="text-gray-400">Monitor your fitness journey and achievements</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Edit className="h-4 w-4 mr-2" />
            Update Stats
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge className="bg-orange-500/20 text-orange-400">Intermediate</Badge>
                    <span className="text-gray-300 text-sm">Member since January 2024</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">San Francisco, CA</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white bg-transparent"
              >
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
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Workout Statistics */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Workout Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-2">{stats.totalWorkouts}</div>
                        <div className="text-gray-400 text-sm">Total Workouts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{stats.currentStreak}</div>
                        <div className="text-gray-400 text-sm">Current Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">{stats.totalHours}</div>
                        <div className="text-gray-400 text-sm">Total Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                          {stats.caloriesBurned.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">Calories Burned</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* This Week's Activity */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">This Week's Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workoutData.map((day) => (
                        <div key={day.day} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{day.day}</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {day.workouts} workout{day.workouts !== 1 ? "s" : ""}
                              </p>
                              <p className="text-gray-400 text-sm">{day.duration} minutes</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-orange-400 font-bold">{day.calories}</p>
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
                    <div className="space-y-4">
                      {recentWorkouts.map((workout, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium">{workout.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {workout.date} • {workout.duration} min • {workout.calories} cal
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${workout.difficulty === "Strength"
                                ? "bg-red-500/20 text-red-400"
                                : workout.difficulty === "Cardio"
                                  ? "bg-green-500/20 text-green-400"
                                  : workout.difficulty === "Yoga"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-orange-500/20 text-orange-400"
                                }`}
                            >
                              {workout.difficulty}
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-400">{workout.level}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Body Stats */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Body Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Height</span>
                      <span className="text-white">{stats.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weight</span>
                      <span className="text-white">{stats.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age</span>
                      <span className="text-white">{stats.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">BMI</span>
                      <span className="text-white">{stats.bmi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Body Fat</span>
                      <span className="text-white">{stats.bodyFat}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Muscle Mass</span>
                      <span className="text-white">{stats.muscleMass} kg</span>
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
                        <span className="text-orange-400 text-sm">70 kg</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Body Fat Goal</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">12%</span>
                        <span className="text-green-400 text-sm">10%</span>
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
                    <p className="text-gray-300 text-sm">
                      Passionate fitness enthusiast on a journey to achieve optimal health and wellness. Love sharing my
                      progress and motivating others in the community.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Weight Progress Chart */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Weight Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Line type="monotone" dataKey="weight" stroke="#F59E0B" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Body Composition */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Body Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bodyCompositionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {bodyCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Activity Chart */}
              <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={workoutData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Bar dataKey="calories" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "First Workout", desc: "Complete your first workout", earned: true, date: "2024-01-15" },
                { title: "7 Day Streak", desc: "Workout for 7 consecutive days", earned: true, date: "2024-02-01" },
                { title: "30 Day Streak", desc: "Workout for 30 consecutive days", earned: true, date: "2024-03-15" },
                { title: "100 Workouts", desc: "Complete 100 total workouts", earned: true, date: "2024-05-20" },
                { title: "Weight Loss Goal", desc: "Reach your weight loss target", earned: false, date: null },
                { title: "Marathon Ready", desc: "Complete a 42km equivalent workout", earned: false, date: null },
              ].map((achievement, index) => (
                <Card
                  key={index}
                  className={`${achievement.earned ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30" : "bg-slate-800 border-slate-700"}`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${achievement.earned ? "bg-orange-500" : "bg-slate-600"}`}
                    >
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{achievement.desc}</p>
                    {achievement.earned ? (
                      <Badge className="bg-orange-500/20 text-orange-400">Earned {achievement.date}</Badge>
                    ) : (
                      <Badge className="bg-slate-600/20 text-slate-400">Not Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Personal Records</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { exercise: "Bench Press", weight: "85 kg", date: "2024-05-15" },
                    { exercise: "Squat", weight: "120 kg", date: "2024-05-20" },
                    { exercise: "Deadlift", weight: "140 kg", date: "2024-06-01" },
                    { exercise: "5K Run", weight: "22:30", date: "2024-06-10" },
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">{record.exercise}</h3>
                        <p className="text-gray-400 text-sm">{record.date}</p>
                      </div>
                      <div className="text-orange-400 font-bold">{record.weight}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Workouts Completed</span>
                    <span className="text-white">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Duration</span>
                    <span className="text-white">18.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calories Burned</span>
                    <span className="text-white">8,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average per Workout</span>
                    <span className="text-white">351 cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Longest Streak</span>
                    <span className="text-white">18 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
