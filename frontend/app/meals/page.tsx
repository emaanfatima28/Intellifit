"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Droplets, Plus, Target, RefreshCw, Sparkles, Calendar, Clock, Utensils, Zap, TrendingUp, Users, Star, ChefHat, Apple, Coffee, Pizza, Edit3 } from "lucide-react"
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

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<{ day: string; mealType: string; currentMeal: Meal } | null>(null)
  const [userPrompt, setUserPrompt] = useState("")
  const [updatingMeal, setUpdatingMeal] = useState(false)
  const [updatedMeals, setUpdatedMeals] = useState<Set<string>>(new Set())

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealTimes = [
    { time: "08:00", type: "breakfast", icon: "🌅", lucideIcon: Coffee },
    { time: "12:00", type: "lunch", icon: "☀️", lucideIcon: Pizza },
    { time: "15:00", type: "snack", icon: "🍎", lucideIcon: Apple },
    { time: "19:00", type: "dinner", icon: "🌙", lucideIcon: ChefHat },
  ]

  const getMealForDay = (day: string, mealType: string) => {
    if (!currentMealPlan?.weeklyPlan) return null

    const dayPlan = currentMealPlan.weeklyPlan.find(d => d.day === day)
    if (!dayPlan) return null

    return dayPlan.meals.find(meal => meal.type === mealType) || null
  }

  const openChangePlanDialog = (day: string, mealType: string, currentMeal: Meal) => {
    setSelectedMeal({ day, mealType, currentMeal })
    setUserPrompt("")
    setIsDialogOpen(true)
  }

  const updateSpecificMeal = async () => {
    if (!selectedMeal || !userPrompt.trim()) {
      setError("Please provide a prompt for the meal change")
      return
    }

    setUpdatingMeal(true)
    setError("")
    setSuccess("")

    try {
      console.log('Updating meal:', { day: selectedMeal.day, mealType: selectedMeal.mealType, prompt: userPrompt })

      const response = await fetch("http://localhost:5000/meal/update-specific", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          day: selectedMeal.day,
          mealType: selectedMeal.mealType
        }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        let errorMessage = "Failed to update meal"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `Server error (${response.status})`
        }
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      console.log('Response data:', responseData)
      console.log('Current meal plan before update:', currentMealPlan)

      if (responseData.success && responseData.mealPlan) {
        console.log('Setting new meal plan:', responseData.mealPlan)
        setCurrentMealPlan(responseData.mealPlan)
        setSuccess(`Successfully updated ${selectedMeal.day}'s ${selectedMeal.mealType}!`)

        const mealKey = `${selectedMeal.day}-${selectedMeal.mealType}`
        setUpdatedMeals(prev => new Set([...prev, mealKey]))

        setTimeout(() => {
          setUpdatedMeals(prev => {
            const newSet = new Set(prev)
            newSet.delete(mealKey)
            return newSet
          })
        }, 5000)

        setIsDialogOpen(false)
        setSelectedMeal(null)
        setUserPrompt("")

        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } else {
        throw new Error("Invalid response format from server")
      }
    } catch (err: any) {
      console.error('Error updating meal:', err)
      setError(err.message)
    } finally {
      setUpdatingMeal(false)
    }
  }

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
          errorMessage = errorData.error || errorData.message || errorMessage
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

  useEffect(() => {
    console.log('Meal plan updated:', currentMealPlan)
  }, [currentMealPlan])

  const fetchData = async () => {
    try {
      const profileResponse = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      } else if (profileResponse.status === 404) {
        setProfile(null)
      }

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
        { }
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

        { }
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

        {/* --- WEEKLY MEAL SCHEDULE SECTION (moved up) --- */}
        {currentMealPlan && currentMealPlan.weeklyPlan && (
          <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
            <h1 className="text-4xl font-extrabold text-orange-600 mb-8 text-center drop-shadow-lg">Weekly Meal Schedule</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
              {currentMealPlan.weeklyPlan.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-2xl rounded-2xl border-2 border-orange-200 p-8 flex flex-col hover:scale-105 transition-transform duration-300"
                >
                  <h2 className="text-2xl font-extrabold text-orange-600 mb-4 uppercase tracking-wide">{day.day}</h2>
                  <ul className="space-y-4">
                    {day.meals.map((meal, mIdx) => {
                      const mealKey = `${day.day}-${meal.type}`
                      const isUpdated = updatedMeals.has(mealKey)

                      return (
                        <li
                          key={mIdx}
                          className={`rounded-lg p-4 shadow text-gray-900 font-bold border-l-4 relative group transition-all duration-300 ${isUpdated
                            ? 'bg-green-50 border-green-400 shadow-lg scale-105'
                            : 'bg-orange-50 border-orange-400'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="block text-lg leading-snug">
                              <span className={`font-extrabold ${isUpdated ? 'text-green-700' : 'text-orange-700'}`}>
                                {meal.type.toUpperCase()}
                              </span>
                              {": "}
                              <span className="font-semibold text-gray-900 break-words">
                                {meal.name}
                              </span>
                            </span>
                            {isUpdated && (
                              <span className="ml-2 shrink-0 h-6 px-2 rounded-full bg-green-100 text-green-700 text-xs flex items-center font-semibold">
                                Updated
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-sm font-semibold text-gray-700">
                            Calories: {meal.calories}
                          </div>

                          {meal.macros && (
                            <div className="mt-1 text-sm text-gray-700 font-medium">
                              Macros: P {meal.macros.protein}g • C {meal.macros.carbs}g • F {meal.macros.fat}g
                            </div>
                          )}

                          {Array.isArray(meal.ingredients) && meal.ingredients.length > 0 && (
                            <div className="mt-1 text-sm text-gray-700 font-medium break-words">
                              Ingredients: {meal.ingredients.join(', ')}
                            </div>
                          )}

                          {/* Change Plan Button */}
                          <Button
                            onClick={() => openChangePlanDialog(day.day, meal.type, meal)}
                            variant="outline"
                            size="sm"
                            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUpdated
                              ? 'bg-white/90 hover:bg-white border-green-300 text-green-600 hover:text-green-700'
                              : 'bg-white/80 hover:bg-white border-orange-300 text-orange-600 hover:text-orange-700'
                              }`}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change Plan Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-orange-600">
                Customize Your Meal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedMeal && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    {selectedMeal.day} - {selectedMeal.mealType.toUpperCase()}
                  </h3>
                  <p className="text-orange-700">
                    Current: <span className="font-medium">{selectedMeal.currentMeal.name}</span>
                    ({selectedMeal.currentMeal.calories} calories)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userPrompt" className="text-base font-semibold">
                  What would you like to change about this meal?
                </Label>
                <Textarea
                  id="userPrompt"
                  placeholder="e.g., Make it vegetarian, add more protein, reduce calories, make it spicier, use different ingredients..."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-sm text-gray-600">
                  Be specific about your preferences, dietary restrictions, or desired changes.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={updatingMeal}
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateSpecificMeal}
                  disabled={updatingMeal || !userPrompt.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {updatingMeal ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Update Meal
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- PLAN DETAILS, AI RECOMMENDATIONS, QUICK ACTIONS (move this grid below the meal schedule) --- */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Meal Plan Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm h-full shadow-xl">
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
                    {currentMealPlan?.planType === 'weekly' ? 'Weekly' : currentMealPlan?.planType === 'daily' ? 'Daily' : 'No Plan'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-xl">
                  <span className="text-gray-400 font-medium">Generated</span>
                  <span className="text-white text-base">
                    {currentMealPlan?.date ? new Date(currentMealPlan.date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-xl">
                  <span className="text-gray-400 font-medium">Duration</span>
                  <span className="text-white text-base">
                    {currentMealPlan?.planType === 'weekly' ? '7 days' : currentMealPlan?.planType === 'daily' ? '1 day' : 'N/A'}
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
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm h-full shadow-xl">
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
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm h-full shadow-xl">
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
      </div>
    </DashboardLayout>
  )
}
