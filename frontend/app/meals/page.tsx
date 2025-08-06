"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Target, RefreshCw, Sparkles, Calendar, Clock, Utensils, Zap, TrendingUp, Users, Star, ChefHat, Apple, Coffee, Pizza } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Meal {
  type: string
  name: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  ingredients: string[]
}

interface WeeklyDay {
  day: string
  meals: Meal[]
}

interface MealPlan {
  _id: string
  userId: string
  date: string
  planType: 'daily' | 'weekly'
  meals?: Meal[]
  weeklyPlan?: WeeklyDay[]
  feedbackGiven: boolean
}

export default function MealsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealTimes = [
    { time: "08:00", type: "breakfast", icon: "🌅", lucideIcon: Coffee },
    { time: "12:00", type: "lunch", icon: "☀️", lucideIcon: Pizza },
    { time: "15:00", type: "snack", icon: "🍎", lucideIcon: Apple },
    { time: "19:00", type: "dinner", icon: "🌙", lucideIcon: ChefHat },
  ]

  // Get meal for specific day and meal type from weekly plan
  const getMealForDay = (day: string, mealType: string) => {
    if (!currentMealPlan?.weeklyPlan) return null

    const dayPlan = currentMealPlan.weeklyPlan.find(d => d.day === day)
    if (!dayPlan) return null

    return dayPlan.meals.find(meal => meal.type === mealType) || null
  }

  // Generate new weekly meal plan
  const generateWeeklyMealPlan = async () => {
    if (!profile) {
      setError("Please complete your profile first")
      return
    }

    setGenerating(true)
    setError("")
    setSuccess("")

    try {
      console.log('Sending request to generate weekly meal plan...')
      const response = await fetch("http://localhost:5000/meal/weekly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        let errorMessage = "Failed to generate meal plan"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          const text = await response.text()
          console.error('Raw error response:', text)
          errorMessage = `Server error (${response.status}): ${text.substring(0, 100)}`
        }
        throw new Error(errorMessage)
      }

      const mealPlan = await response.json()
      console.log('Meal plan received:', mealPlan)
      setCurrentMealPlan(mealPlan)
      setSuccess("Weekly meal plan generated successfully!")
    } catch (err: any) {
      console.error('Error generating meal plan:', err)
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const todayNutrition = {
    breakfast: { percentage: 87, calories: "520/600" },
    lunch: { percentage: 68, calories: "480/700" },
    dinner: { percentage: 53, calories: "420/800" },
    snack: { percentage: 80, calories: "160/200" },
  }

  const dailySummary = {
    totalCalories: 1580,
    targetCalories: 2300,
    protein: 85,
    carbs: 180,
    fat: 65,
    water: 2.1,
    targetWater: 2.5,
  }

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }

    fetchData()
  }, [user, token, router])

  const fetchData = async () => {
    try {
      // Fetch profile to get user goals
      const profileResponse = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      } else if (profileResponse.status === 404) {
        setProfile(null)
      }

      // Fetch current meal plan
      const mealResponse = await fetch("http://localhost:5000/meal/current", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (mealResponse.ok) {
        const mealData = await mealResponse.json()
        setCurrentMealPlan(mealData)
      } else if (mealResponse.status === 404) {
        setCurrentMealPlan(null)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero Header Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/30 via-orange-600/20 to-orange-700/10 border border-orange-500/30 p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600/5 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-20 h-20 bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Utensils className="h-10 w-10 text-orange-300" />
                </motion.div>

                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-5xl font-black text-black leading-tight"
                  >
                    AI-Powered Meal Plans
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-black/80 text-lg font-medium"
                  >
                    Personalized weekly nutrition designed for your goals and lifestyle
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex items-center space-x-4"
                  >
                    {profile?.goal && (
                      <Badge className="bg-orange-500/40 text-black border-orange-400/60 px-4 py-2 text-sm font-semibold">
                        <Target className="h-4 w-4 mr-2" />
                        Goal: {profile.goal.replace("_", " ").toUpperCase()}
                      </Badge>
                    )}
                    <Badge className="bg-white/30 text-black border-white/40 px-4 py-2 text-sm font-semibold">
                      <Zap className="h-4 w-4 mr-2" />
                      AI Generated
                    </Badge>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={generateWeeklyMealPlan}
                    disabled={generating || !profile}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
                  >
                    {generating ? (
                      <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-5 w-5 mr-3" />
                    )}
                    {generating ? "Generating..." : "Generate New Meal Plan"}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {!profile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
              <AlertDescription>
                Please complete your profile to get personalized meal plans.
                <Button
                  variant="link"
                  className="p-0 h-auto text-yellow-400 underline ml-2"
                  onClick={() => router.push('/profile')}
                >
                  Go to Profile
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Main Content Area - Full Width */}
        <div className="w-full">
          {!currentMealPlan ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-8"
                  >
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-full flex items-center justify-center shadow-xl">
                      <Calendar className="h-16 w-16 text-orange-400" />
                    </div>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-4xl font-bold text-white mb-6"
                  >
                    No Meal Plan Generated
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
                  >
                    Generate your first AI-powered weekly meal plan based on your profile and preferences.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    <Button
                      onClick={generateWeeklyMealPlan}
                      disabled={generating || !profile}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 text-lg font-semibold rounded-xl"
                    >
                      <Sparkles className="h-5 w-5 mr-3" />
                      Generate Weekly Plan
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Weekly Schedule - Full Width */}
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-orange-500/30 rounded-2xl">
                        <Calendar className="h-8 w-8 text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-4xl font-bold text-white mb-2">
                          Weekly Meal Schedule
                        </CardTitle>
                        <p className="text-gray-400 text-lg">
                          Your complete 7-day nutrition plan with detailed meal information
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/30 text-green-400 border-green-500/40 px-4 py-2 text-base">
                      <Star className="h-4 w-4 mr-2" />
                      Active Plan
                    </Badge>
                  </motion.div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Header Row */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="grid grid-cols-8 gap-6 p-8 border-b border-slate-700/50 bg-slate-800/30"
                      >
                        <div className="text-gray-400 font-bold text-lg uppercase tracking-wider">
                          Meal Time
                        </div>
                        {weekDays.map((day, index) => (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                            className="text-center"
                          >
                            <div className="text-white font-bold text-2xl mb-2">
                              {day.slice(0, 3)}
                            </div>
                            <div className="text-gray-400 text-sm font-medium">
                              {day}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Meal Rows */}
                      {mealTimes.map(({ time, type, icon, lucideIcon: LucideIcon }, mealIndex) => (
                        <motion.div
                          key={`${time}-${type}`}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 0.7 + mealIndex * 0.1 }}
                          className="grid grid-cols-8 gap-6 p-8 border-b border-slate-700/30 hover:bg-slate-700/10 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{icon}</div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-orange-500/20 rounded-lg">
                                <LucideIcon className="h-5 w-5 text-orange-400" />
                              </div>
                              <div>
                                <div className="text-white font-bold text-lg capitalize">{type}</div>
                                <div className="text-gray-400 text-base">{time}</div>
                              </div>
                            </div>
                          </div>
                          {weekDays.map((day, dayIndex) => {
                            const meal = getMealForDay(day, type)
                            return (
                              <motion.div
                                key={day}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative"
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5, delay: 0.9 + mealIndex * 0.1 + dayIndex * 0.05 }}
                                  className={`${meal
                                    ? 'bg-gradient-to-br from-orange-500/25 to-orange-600/15 border-orange-500/40 shadow-xl'
                                    : 'bg-slate-700/40 border-slate-600/60'
                                    } border-2 rounded-2xl p-4 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 min-h-[120px] max-h-[120px] flex flex-col justify-center relative overflow-hidden`}
                                >
                                  {meal && (
                                    <div className="absolute top-3 right-3">
                                      <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                                    </div>
                                  )}
                                  <div className="text-white text-base font-bold mb-3 capitalize">
                                    {meal?.name || "Not planned"}
                                  </div>
                                  <div className="text-orange-400 text-xl font-bold mb-3">
                                    {meal?.calories || 0} kcal
                                  </div>
                                  {meal?.ingredients && meal.ingredients.length > 0 && (
                                    <div className="text-gray-300 text-sm mt-3">
                                      <div className="font-semibold mb-2 text-orange-300">Ingredients:</div>
                                      <div className="text-gray-400 leading-relaxed">
                                        {meal.ingredients.slice(0, 3).join(", ")}
                                        {meal.ingredients.length > 3 && "..."}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Sections Below - Grid Layout */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Meal Plan Info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center text-xl">
                        <Sparkles className="h-6 w-6 mr-3 text-orange-500" />
                        Plan Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-xl">
                        <span className="text-gray-400 font-medium">Plan Type</span>
                        <Badge className="bg-orange-500/30 text-orange-400 px-3 py-1">
                          {currentMealPlan.planType === 'weekly' ? 'Weekly' : 'Daily'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-xl">
                        <span className="text-gray-400 font-medium">Generated</span>
                        <span className="text-white text-base">
                          {new Date(currentMealPlan.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-xl">
                        <span className="text-gray-400 font-medium">Duration</span>
                        <span className="text-white text-base">
                          {currentMealPlan.planType === 'weekly' ? '7 days' : '1 day'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center text-xl">
                        <Target className="h-6 w-6 mr-3 text-orange-500" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-base text-gray-400 p-4 bg-slate-700/40 rounded-xl">
                          Based on your <span className="text-orange-400 font-bold">{profile?.goal?.replace("_", " ")}</span> goal:
                        </div>
                        <ul className="space-y-3">
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="flex items-start p-4 bg-slate-700/30 rounded-xl"
                          >
                            <span className="text-orange-500 mr-3 text-xl">•</span>
                            <span className="text-gray-300 text-base">
                              {profile?.goal === 'weight_loss' && 'Focus on high-protein, low-calorie meals'}
                              {profile?.goal === 'muscle_gain' && 'Increase protein intake to 1.6-2.2g per kg body weight'}
                              {profile?.goal === 'maintenance' && 'Maintain balanced macronutrient ratios'}
                            </span>
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="flex items-start p-4 bg-slate-700/30 rounded-xl"
                          >
                            <span className="text-orange-500 mr-3 text-xl">•</span>
                            <span className="text-gray-300 text-base">
                              {profile?.activityLevel === 'low' && 'Include more fiber-rich foods for satiety'}
                              {profile?.activityLevel === 'moderate' && 'Add complex carbs for sustained energy'}
                              {profile?.activityLevel === 'high' && 'Increase overall caloric intake for recovery'}
                            </span>
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="flex items-start p-4 bg-slate-700/30 rounded-xl"
                          >
                            <span className="text-orange-500 mr-3 text-xl">•</span>
                            <span className="text-gray-300 text-base">Stay hydrated with 2.5-3L of water daily</span>
                          </motion.li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={generateWeeklyMealPlan}
                          disabled={generating || !profile}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl py-4 text-base font-semibold"
                        >
                          <RefreshCw className="h-5 w-5 mr-3" />
                          Regenerate Plan
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-white hover:bg-slate-700 rounded-xl py-4 text-base font-semibold"
                        >
                          <Calendar className="h-5 w-5 mr-3" />
                          View Details
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
