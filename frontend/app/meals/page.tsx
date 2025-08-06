"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Target, RefreshCw, Sparkles, Calendar } from "lucide-react"
import { motion } from "framer-motion"
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
    { time: "08:00", type: "breakfast" },
    { time: "12:00", type: "lunch" },
    { time: "15:00", type: "snack" },
    { time: "19:00", type: "dinner" },
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI-Powered Meal Plans</h1>
            <p className="text-gray-400 mt-1">Personalized weekly nutrition based on your profile</p>
          </div>
          <div className="flex items-center space-x-4">
            {profile?.goal && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                Goal: {profile.goal.replace("_", " ").toUpperCase()}
              </Badge>
            )}
            <Button
              onClick={generateWeeklyMealPlan}
              disabled={generating || !profile}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {generating ? "Generating..." : "Generate New Plan"}
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {!profile && (
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
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-3">
            {!currentMealPlan ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Meal Plan Generated</h3>
                  <p className="text-gray-400 mb-6">
                    Generate your first AI-powered weekly meal plan based on your profile and preferences.
                  </p>
                  <Button
                    onClick={generateWeeklyMealPlan}
                    disabled={generating || !profile}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Weekly Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    Weekly Meal Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-4 text-gray-400 font-medium">Time</th>
                          {weekDays.map((day) => (
                            <th key={day} className="text-center p-4 text-gray-400 font-medium min-w-[140px]">
                              {day.slice(0, 3)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mealTimes.map(({ time, type }) => (
                          <tr key={`${time}-${type}`} className="border-b border-slate-700/50">
                            <td className="p-4 text-white font-medium">{time}</td>
                            {weekDays.map((day) => {
                              const meal = getMealForDay(day, type)
                              return (
                                <td key={day} className="p-2">
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`${meal ? 'bg-orange-500/20 border-orange-500/30' : 'bg-slate-700/50 border-slate-600'} border rounded-lg p-3 text-center cursor-pointer hover:opacity-80 transition-opacity`}
                                  >
                                    <div className="text-white text-xs font-medium mb-1 capitalize">{type}</div>
                                    <div className="text-white text-xs mb-1 font-medium">
                                      {meal?.name || "Not planned"}
                                    </div>
                                    <div className="text-gray-300 text-xs">
                                      {meal?.calories || 0} kcal
                                    </div>
                                    {meal?.ingredients && (
                                      <div className="text-gray-400 text-xs mt-1">
                                        {meal.ingredients.slice(0, 2).join(", ")}
                                        {meal.ingredients.length > 2 && "..."}
                                      </div>
                                    )}
                                  </motion.div>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Meal Plan Info */}
            {currentMealPlan && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
                    Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Plan Type</span>
                    <Badge className="bg-orange-500/20 text-orange-400">
                      {currentMealPlan.planType === 'weekly' ? 'Weekly' : 'Daily'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Generated</span>
                    <span className="text-white text-sm">
                      {new Date(currentMealPlan.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Days</span>
                    <span className="text-white">
                      {currentMealPlan.planType === 'weekly' ? '7 days' : '1 day'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Recommendations */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Based on your {profile?.goal?.replace("_", " ")} goal:
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {profile?.goal === 'weight_loss' && 'Focus on high-protein, low-calorie meals'}
                      {profile?.goal === 'muscle_gain' && 'Increase protein intake to 1.6-2.2g per kg body weight'}
                      {profile?.goal === 'maintenance' && 'Maintain balanced macronutrient ratios'}
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {profile?.activityLevel === 'low' && 'Include more fiber-rich foods for satiety'}
                      {profile?.activityLevel === 'moderate' && 'Add complex carbs for sustained energy'}
                      {profile?.activityLevel === 'high' && 'Increase overall caloric intake for recovery'}
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      Stay hydrated with 2.5-3L of water daily
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={generateWeeklyMealPlan}
                  disabled={generating || !profile}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Plan
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
