"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Target } from "lucide-react"

interface MealPlan {
  _id: string
  name: string
  description: string
  meals: any[]
  totalCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}

export default function MealsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const mealTimes = [
    { time: "08:00", type: "Breakfast" },
    { time: "12:00", type: "Lunch" },
    { time: "15:00", type: "Snack" },
    { time: "19:00", type: "Dinner" },
  ]

  // Sample meal data based on user goals
  const getMealsByGoal = (goal: string, day: string, mealType: string) => {
    const weightLossMeals = {
      Breakfast: { name: "Oats with Berries", calories: 320, color: "bg-green-500" },
      Lunch: { name: "Grilled Chicken Salad", calories: 450, color: "bg-green-500" },
      Snack: { name: "Greek Yogurt", calories: 150, color: "bg-green-500" },
      Dinner: { name: "Salmon with Vegetables", calories: 380, color: "bg-green-500" },
    }

    const muscleGainMeals = {
      Breakfast: { name: "Protein Pancakes", calories: 520, color: "bg-blue-500" },
      Lunch: { name: "Turkey Wrap", calories: 680, color: "bg-blue-500" },
      Snack: { name: "Protein Shake", calories: 280, color: "bg-blue-500" },
      Dinner: { name: "Beef with Rice", calories: 750, color: "bg-blue-500" },
    }

    const maintenanceMeals = {
      Breakfast: { name: "Avocado Toast", calories: 420, color: "bg-yellow-500" },
      Lunch: { name: "Quinoa Bowl", calories: 550, color: "bg-yellow-500" },
      Snack: { name: "Mixed Nuts", calories: 180, color: "bg-yellow-500" },
      Dinner: { name: "Grilled Fish", calories: 480, color: "bg-yellow-500" },
    }

    if (goal === "weight_loss") return weightLossMeals[mealType as keyof typeof weightLossMeals]
    if (goal === "muscle_gain") return muscleGainMeals[mealType as keyof typeof muscleGainMeals]
    return maintenanceMeals[mealType as keyof typeof maintenanceMeals]
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
      const profileResponse = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      }

      // Fetch meal plans
      const mealResponse = await fetch("http://localhost:3000/meal-plans", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (mealResponse.ok) {
        const mealData = await mealResponse.json()
        setMealPlans(mealData.mealPlans || [])
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
            <h1 className="text-3xl font-bold text-white">Food Diary</h1>
            <p className="text-gray-400 mt-1">07-20 July 2024</p>
          </div>
          <div className="flex items-center space-x-4">
            {profile?.goal && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                Goal: {profile.goal.replace("_", " ").toUpperCase()}
              </Badge>
            )}
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Weekly Schedule</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-4 text-gray-400 font-medium">Time</th>
                        {weekDays.map((day) => (
                          <th key={day} className="text-center p-4 text-gray-400 font-medium min-w-[120px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mealTimes.map(({ time, type }) => (
                        <tr key={`${time}-${type}`} className="border-b border-slate-700/50">
                          <td className="p-4 text-white font-medium">{time}</td>
                          {weekDays.map((day) => {
                            const meal = getMealsByGoal(profile?.goal || "maintenance", day, type)
                            return (
                              <td key={day} className="p-2">
                                <div
                                  className={`${meal?.color || "bg-slate-600"} rounded-lg p-3 text-center cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                  <div className="text-white text-xs font-medium mb-1">{type}</div>
                                  <div className="text-white text-xs mb-1">{meal?.name || "Not planned"}</div>
                                  <div className="text-white text-xs opacity-75">{meal?.calories || 0} kcal</div>
                                </div>
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
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Result */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Today's Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(todayNutrition).map(([meal, data]) => (
                  <div key={meal} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white capitalize">{meal}</span>
                      <span className="text-gray-400 text-sm">{data.calories} kcal</span>
                    </div>
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#374151"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            strokeDasharray={`${data.percentage}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{data.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Calories</span>
                  <span className="text-white font-bold">{dailySummary.totalCalories} kcal</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Protein</span>
                    <span className="text-white">{dailySummary.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Carbs</span>
                    <span className="text-white">{dailySummary.carbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fat</span>
                    <span className="text-white">{dailySummary.fat}g</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-gray-400">Water</span>
                    </div>
                    <span className="text-white">
                      {dailySummary.water}L / {dailySummary.targetWater}L
                    </span>
                  </div>
                  <Progress value={(dailySummary.water / dailySummary.targetWater) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">Based on your {profile?.goal?.replace("_", " ")} goal:</div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      Add more protein to your breakfast
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Increase water intake by 0.4L
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      Consider a post-workout snack
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
