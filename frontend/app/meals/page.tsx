"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Droplets } from "lucide-react"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const mealTimes = [
  { time: "08:00", type: "Breakfast" },
  { time: "12:00", type: "Lunch" },
  { time: "15:00", type: "Snack" },
  { time: "19:00", type: "Dinner" },
]

export default function MealsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [mealPlans, setMealPlans] = useState<any[]>([])
  const [todayStats, setTodayStats] = useState({
    breakfast: { consumed: 520, target: 600, percentage: 87 },
    lunch: { consumed: 480, target: 700, percentage: 69 },
    dinner: { consumed: 420, target: 800, percentage: 53 },
    snack: { consumed: 160, target: 200, percentage: 80 },
  })
  const [dailySummary, setDailySummary] = useState({
    totalCalories: 1580,
    protein: 85,
    carbs: 180,
    fat: 65,
    water: 2.1,
    waterTarget: 2.5,
  })

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
    fetchProfile()
    fetchMealPlans()
  }, [user, token, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchMealPlans = async () => {
    try {
      const response = await fetch("http://localhost:3000/meal-plans", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMealPlans(data.mealPlans || [])
      }
    } catch (error) {
      console.error("Error fetching meal plans:", error)
    }
  }

  const getMealRecommendations = (mealType: string, day: string) => {
    if (!profile?.goal) return getDefaultMeal(mealType)

    const recommendations = {
      weight_loss: {
        Breakfast: ["Oats with Berries", "Greek Yogurt", "Smoothie Bowl", "Egg Scramble"],
        Lunch: ["Grilled Chicken Salad", "Turkey Wrap", "Quinoa Bowl", "Mediterranean Bowl"],
        Snack: ["Mixed Nuts", "Protein Bar", "Apple Slices", "Greek Yogurt"],
        Dinner: ["Grilled Fish", "Vegetable Stir-fry", "Lean Protein", "Salad Bowl"],
      },
      muscle_gain: {
        Breakfast: ["Protein Pancakes", "Avocado Toast", "Smoothie Bowl", "Egg Benedict"],
        Lunch: ["Chicken Rice", "Turkey Sandwich", "Quinoa Salad", "Protein Bowl"],
        Snack: ["Protein Shake", "Nuts & Dates", "Chocolate Milk", "Energy Bar"],
        Dinner: ["Steak & Potatoes", "Salmon Rice", "BBQ Chicken", "Pasta Bowl"],
      },
      maintenance: {
        Breakfast: ["Breakfast Burrito", "Oatmeal", "Toast & Eggs", "Fruit Bowl"],
        Lunch: ["Balanced Bowl", "Sandwich", "Soup & Salad", "Wrap"],
        Snack: ["Trail Mix", "Fruit", "Granola Bar", "Smoothie"],
        Dinner: ["Balanced Meal", "Fish & Veggies", "Chicken Pasta", "Rice Bowl"],
      },
    }

    const goalMeals = recommendations[profile.goal as keyof typeof recommendations]
    const dayIndex = weekDays.indexOf(day)
    return goalMeals?.[mealType as keyof typeof goalMeals]?.[dayIndex % 4] || getDefaultMeal(mealType)
  }

  const getDefaultMeal = (mealType: string) => {
    const defaults = {
      Breakfast: "Healthy Breakfast",
      Lunch: "Balanced Lunch",
      Snack: "Nutritious Snack",
      Dinner: "Wholesome Dinner",
    }
    return defaults[mealType as keyof typeof defaults] || "Meal"
  }

  const getMealCalories = (goal: string, mealType: string) => {
    const calorieMap = {
      weight_loss: { Breakfast: 300, Lunch: 400, Snack: 150, Dinner: 450 },
      muscle_gain: { Breakfast: 500, Lunch: 600, Snack: 250, Dinner: 700 },
      maintenance: { Breakfast: 400, Lunch: 500, Snack: 200, Dinner: 600 },
    }
    return calorieMap[goal as keyof typeof calorieMap]?.[mealType as keyof typeof calorieMap.weight_loss] || 400
  }

  const getMealColor = (mealType: string) => {
    const colors = {
      Breakfast: "bg-green-500",
      Lunch: "bg-yellow-500",
      Snack: "bg-orange-500",
      Dinner: "bg-red-500",
    }
    return colors[mealType as keyof typeof colors] || "bg-gray-500"
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Food Diary</h1>
            <p className="text-gray-400">07-20 July 2024</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
        </div>

        {/* AI Recommendation */}
        {profile && (
          <Card className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🥗</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Nutrition Recommendation</h3>
                  <p className="text-gray-300 text-sm">
                    For your <span className="text-green-400 font-medium">{profile.goal?.replace("_", " ")} goal</span>,
                    focus on{" "}
                    {profile.goal === "weight_loss"
                      ? "lean proteins and vegetables"
                      : profile.goal === "muscle_gain"
                        ? "high protein and complex carbs"
                        : "balanced macronutrients"}
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="bg-gradient-to-r from-orange-500/20 to-orange-600/20">
                <CardTitle className="text-white">Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-4 text-gray-300 font-medium">Time</th>
                        {weekDays.map((day) => (
                          <th key={day} className="text-center p-4 text-gray-300 font-medium min-w-[120px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mealTimes.map(({ time, type }) => (
                        <tr key={time} className="border-b border-slate-700">
                          <td className="p-4 text-gray-300 font-medium">{time}</td>
                          {weekDays.map((day) => {
                            const mealName = getMealRecommendations(type, day)
                            const calories = getMealCalories(profile?.goal || "maintenance", type)
                            const colorClass = getMealColor(type)

                            return (
                              <td key={day} className="p-2">
                                <div
                                  className={`${colorClass} rounded-lg p-3 text-white text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                  <div className="font-semibold mb-1">{type}</div>
                                  <div className="text-xs opacity-90 mb-2">{mealName}</div>
                                  <div className="text-xs font-bold">{calories} kcal</div>
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
                {Object.entries(todayStats).map(([meal, stats]) => (
                  <div key={meal} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{meal}</span>
                      <span className="text-white text-sm">
                        {stats.consumed}/{stats.target} kcal
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={stats.percentage} className="h-2" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{stats.percentage}%</span>
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
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Calories</span>
                  <span className="text-white font-bold">{dailySummary.totalCalories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Protein</span>
                  <span className="text-white">{dailySummary.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Carbs</span>
                  <span className="text-white">{dailySummary.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fat</span>
                  <span className="text-white">{dailySummary.fat}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center">
                    <Droplets className="h-4 w-4 mr-1" />
                    Water
                  </span>
                  <span className="text-white">
                    {dailySummary.water}L / {dailySummary.waterTarget}L
                  </span>
                </div>
                <Progress value={(dailySummary.water / dailySummary.waterTarget) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
