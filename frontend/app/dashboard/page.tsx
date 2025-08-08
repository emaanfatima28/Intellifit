"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Target, TrendingUp, Calendar, Clock, ArrowUpRight, X, ArrowDown, User, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Dashboard() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
    fetchProfile()
  }, [user, token, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        // Show modal after 3 seconds if profile is incomplete
        if (!data || !data.age || !data.gender || !data.height || !data.weight || !data.goal || !data.activityLevel) {
          setTimeout(() => {
            setShowProfileModal(true)
          }, 3000)
        }
      } else if (response.status === 404) {
        // Show modal after 3 seconds if no profile exists
        setTimeout(() => {
          setShowProfileModal(true)
        }, 3000)
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
      {/* Profile Completion Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <DialogTitle className="text-white text-2xl font-bold">Complete Your Profile</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-gray-400 text-lg">
              Let's personalize your fitness journey! Complete your profile to get tailored recommendations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Arrow pointing down */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-orange-500"
              >
                <ArrowDown className="h-10 w-10" />
              </motion.div>
            </div>

            {/* Horizontal layout for profile completion */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left side - Profile completion checklist */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg mb-4">Profile Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${profile?.age ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${profile?.age ? 'text-white' : 'text-gray-400'}`}>Age</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${profile?.gender ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${profile?.gender ? 'text-white' : 'text-gray-400'}`}>Gender</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${profile?.height ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${profile?.height ? 'text-white' : 'text-gray-400'}`}>Height</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${profile?.weight ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${profile?.weight ? 'text-white' : 'text-gray-400'}`}>Weight</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${profile?.goal ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${profile?.goal ? 'text-white' : 'text-gray-400'}`}>Fitness Goal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`h-5 w-5 ${profile?.activityLevel ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${profile?.activityLevel ? 'text-white' : 'text-gray-400'}`}>Activity Level</span>
                  </div>
                </div>
              </div>

              {/* Right side - Progress and benefits */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg mb-4">Your Progress</h3>

                {/* Progress bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Profile Completion</span>
                    <span className="text-white font-semibold">
                      {profile ?
                        Math.round((Object.values(profile).filter(v => v !== null && v !== undefined).length / 6) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={profile ?
                      (Object.values(profile).filter(v => v !== null && v !== undefined).length / 6) * 100
                      : 0}
                    className="h-3"
                  />
                </div>

                {/* Benefits list */}
                <div className="space-y-2 mt-6">
                  <h4 className="text-orange-400 font-medium text-sm">Complete your profile to unlock:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-300">Personalized workout plans</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-300">Custom nutrition advice</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-300">Accurate progress tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-300">AI-powered recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons - centered */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button
                onClick={() => setShowProfileModal(false)}
                variant="outline"
                className="px-8 border-slate-600 text-white hover:bg-slate-700"
              >
                Maybe Later
              </Button>
              <Link href="/profile">
                <Button
                  className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowProfileModal(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-700/20 border-orange-500/30 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <CardContent className="p-8 relative z-10">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-2xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold text-black mb-2">
                      Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-black font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent tracking-wide">
                      Let's crush your fitness goals today
                    </p>
                  </div>
                </div>

                {/* Motivational stats */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">5</div>
                    <div className="text-gray-300 text-sm">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-gray-300 text-sm">Workouts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">85%</div>
                    <div className="text-gray-300 text-sm">Goal Progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Weight</p>
                    <p className="text-2xl font-bold text-white">{profile?.weight || "N/A"} kg</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Goal</p>
                    <p className="text-2xl font-bold text-white capitalize">{profile?.goal?.replace("_", " ") || "Not Set"}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Workouts This Week</p>
                    <p className="text-2xl font-bold text-white">3/5</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Time</p>
                    <p className="text-2xl font-bold text-white">2.5h</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Workout */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-500" />
                    Today's Workout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Upper Body Strength</p>
                        <p className="text-gray-400 text-sm">45 minutes • 8 exercises</p>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        Start Workout
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">8</p>
                        <p className="text-gray-400 text-sm">Exercises</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">45</p>
                        <p className="text-gray-400 text-sm">Minutes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-gray-400 text-sm">Sets</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Recent Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Weight Progress</p>
                        <p className="text-gray-400 text-sm">Last 7 days</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">-2.1 kg</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Workout Streak</p>
                        <p className="text-gray-400 text-sm">Consecutive days</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">5 days</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Calories Burned</p>
                        <p className="text-gray-400 text-sm">This week</p>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400">1,250 cal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Schedule */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                    Upcoming Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Morning Cardio</p>
                        <p className="text-gray-400 text-sm">7:00 AM - 8:00 AM</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Evening Cardio</p>
                        <p className="text-gray-400 text-sm">6:00 PM - 7:00 PM</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
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
                        <Link href="/profile">
                          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Complete Profile</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}