"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Flame, Target, Play, Star, Users, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface WorkoutPlan {
  _id: string
  name: string
  description: string
  duration: number
  difficulty: string
  exercises: any[]
  targetMuscles: string[]
  caloriesBurn: number
  equipment: string[]
}

interface Trainer {
  id: string
  name: string
  specialty: string
  rating: number
  followers: string
  avatar: string
  color: string
}

export default function WorkoutsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() - 1) // 0=Monday
  const [weeklyPlan, setWeeklyPlan] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  const workoutCategories = [
    {
      id: "stretching",
      name: "Stretching",
      icon: "🧘",
      exercises: 12,
      color: "from-green-500/20 to-green-600/20 border-green-500/30",
    },
    {
      id: "yoga",
      name: "Yoga",
      icon: "🕉️",
      exercises: 15,
      color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    },
    {
      id: "meditation",
      name: "Meditation",
      icon: "🧠",
      exercises: 8,
      color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    },
    {
      id: "fullbody",
      name: "Full body",
      icon: "💪",
      exercises: 20,
      color: "from-red-500/20 to-red-600/20 border-red-500/30",
    },
    {
      id: "arms",
      name: "Arms",
      icon: "💪",
      exercises: 18,
      color: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
    },
    {
      id: "legs",
      name: "Legs",
      icon: "🦵",
      exercises: 16,
      color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
    },
  ]

  const trainers: Trainer[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      specialty: "Yoga Instructor",
      rating: 4.9,
      followers: "120k",
      avatar: "SJ",
      color: "bg-green-500",
    },
    {
      id: "2",
      name: "Mike Chen",
      specialty: "Strength Coach",
      rating: 4.8,
      followers: "95k",
      avatar: "MC",
      color: "bg-red-500",
    },
    {
      id: "3",
      name: "Emma Davis",
      specialty: "Pilates Expert",
      rating: 4.9,
      followers: "110k",
      avatar: "ED",
      color: "bg-pink-500",
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      specialty: "HIIT Trainer",
      rating: 4.7,
      followers: "85k",
      avatar: "AR",
      color: "bg-blue-500",
    },
  ]

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
    fetchData()
  }, [user, token, router])

  // Fetch profile and weekly workout plan
  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch profile
      const profileResponse = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      }
      // Fetch/generate weekly workout plan
      const planResponse = await fetch("http://localhost:3000/workout/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (planResponse.ok) {
        const planData = await planResponse.json()
        setWeeklyPlan(planData.workoutDays || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
  }

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const getRecommendedWorkouts = () => {
    if (!profile?.goal) return workoutPlans

    const goalBasedWorkouts = workoutPlans.filter((workout) => {
      if (profile.goal === "weight_loss") {
        return (
          workout.name.toLowerCase().includes("cardio") ||
          workout.name.toLowerCase().includes("hiit") ||
          workout.name.toLowerCase().includes("burn")
        )
      } else if (profile.goal === "muscle_gain") {
        return (
          workout.name.toLowerCase().includes("strength") ||
          workout.name.toLowerCase().includes("muscle") ||
          workout.name.toLowerCase().includes("build")
        )
      } else {
        return workout.difficulty === "moderate"
      }
    })

    return goalBasedWorkouts.length > 0 ? goalBasedWorkouts : workoutPlans
  }

  const startWorkout = async (workoutId: string) => {
    try {
      const response = await fetch("http://localhost:3000/workout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workoutPlanId: workoutId }),
      })

      if (response.ok) {
        router.push(`/workouts/${workoutId}/session`)
      }
    } catch (error) {
      console.error("Error starting workout:", error)
    }
  }

  // Dynamically filter categories based on user profile
  const getPersonalizedCategories = () => {
    if (!profile) return workoutCategories;
    // Example: filter or highlight categories based on goal/activityLevel
    if (profile.goal === 'weight_loss') {
      return workoutCategories.filter(cat => ['stretching', 'yoga', 'meditation', 'fullbody', 'legs'].includes(cat.id));
    } else if (profile.goal === 'muscle_gain') {
      return workoutCategories.filter(cat => ['fullbody', 'arms', 'legs'].includes(cat.id));
    } else {
      return workoutCategories;
    }
  };

  // Dynamically filter trainers based on user profile
  const getPersonalizedTrainers = () => {
    if (!profile) return trainers;
    if (profile.goal === 'weight_loss') {
      return trainers.filter(tr => tr.specialty.toLowerCase().includes('yoga') || tr.specialty.toLowerCase().includes('hiit'));
    } else if (profile.goal === 'muscle_gain') {
      return trainers.filter(tr => tr.specialty.toLowerCase().includes('strength') || tr.specialty.toLowerCase().includes('hiit'));
    } else {
      return trainers;
    }
  };

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1e293b]">Weekly Workout Plan</h1>
            <p className="text-gray-400 mt-1">Personalized for your goals and preferences</p>
          </div>
          {profile?.goal && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              Goal: {profile.goal.replace("_", " ").toUpperCase()}
            </Badge>
          )}
        </motion.div>

        {/* Weekly Plan Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center gap-2 mb-4">
          {weekDays.map((day, idx) => (
            <Button
              key={day}
              variant={selectedDay === idx ? "default" : "outline"}
              className={`rounded-full px-4 py-2 font-semibold transition-all ${selectedDay === idx ? "bg-orange-500 text-white" : "bg-white text-orange-500 border-orange-300"}`}
              onClick={() => setSelectedDay(idx)}
            >
              {day}
            </Button>
          ))}
        </motion.div>

        {/* Weekly Plan Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <span className="text-orange-500 text-lg font-bold animate-pulse">Loading your personalized plan...</span>
            </motion.div>
          ) : weeklyPlan.length > 0 ? (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <motion.div className="bg-gradient-to-br from-orange-100/60 to-orange-200/40 border border-orange-300 rounded-3xl shadow-xl p-8 mb-8 relative overflow-hidden">
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-bold text-orange-700 mb-4">
                  {weekDays[selectedDay]}
                </motion.h2>
                {weeklyPlan[selectedDay]?.exercises?.length > 0 ? (
                  <div className="space-y-6">
                    {weeklyPlan[selectedDay].exercises.map((ex: any, i: number) => (
                      <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4 border-l-4 border-orange-400/60 hover:scale-[1.02] transition-transform"
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-orange-600 mb-1">{ex.name}</h3>
                          <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-2">
                            <span>Sets: <span className="font-semibold text-orange-500">{ex.sets}</span></span>
                            <span>Reps: <span className="font-semibold text-orange-500">{ex.reps}</span></span>
                            <span>Category: <span className="font-semibold text-orange-500">{ex.category}</span></span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">No exercises planned for this day.</div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="no-plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <span className="text-orange-500 text-lg font-bold">No workout plan found. Please complete your profile and generate a plan.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workout Categories */}
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Select workout type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPersonalizedCategories().map((category) => (
              <Card
                key={category.id}
                className={`bg-gradient-to-br ${category.color} cursor-pointer hover:scale-105 transition-transform`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{category.name}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm">{category.exercises} exercises</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Workouts */}
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-400" />
            Recommended for You
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-700 rounded mb-4"></div>
                    <div className="h-3 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRecommendedWorkouts()
                .slice(0, 6)
                .map((workout) => (
                  <Card
                    key={workout._id}
                    className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          className={`${workout.difficulty === "beginner"
                            ? "bg-green-500/20 text-green-400"
                            : workout.difficulty === "intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                            }`}
                        >
                          {workout.difficulty}
                        </Badge>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {workout.duration}min
                        </div>
                      </div>

                      <h3 className="text-white font-semibold text-lg mb-2">{workout.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{workout.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-orange-400 text-sm">
                          <Flame className="h-4 w-4 mr-1" />
                          {workout.caloriesBurn} cal
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Dumbbell className="h-4 w-4 mr-1" />
                          {workout.exercises?.length || 0} exercises
                        </div>
                      </div>

                      <Button
                        onClick={() => startWorkout(workout._id)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Featured Trainers */}
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Featured Trainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getPersonalizedTrainers().map((trainer) => (
              <Card key={trainer.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${trainer.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-white font-bold text-lg">{trainer.avatar}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{trainer.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{trainer.specialty}</p>

                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white text-sm">{trainer.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-sm">{trainer.followers}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white bg-transparent"
                  >
                    Follow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const completed = index < 3
                const today = index === 3
                return (
                  <div key={day} className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${completed ? "bg-green-500" : today ? "bg-orange-500" : "bg-slate-700"
                        }`}
                    >
                      <span className="text-white text-sm font-medium">{day}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{completed ? "✓ Done" : today ? "Today" : "Planned"}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
