"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, User, Target, Activity } from "lucide-react"

export default function ProfileSetup() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: Number.parseInt(formData.age),
          gender: formData.gender,
          height: Number.parseInt(formData.height),
          weight: Number.parseInt(formData.weight),
          goal: formData.goal,
          activityLevel: formData.activityLevel,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create profile")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age && formData.gender && formData.height && formData.weight
      case 2:
        return formData.goal
      case 3:
        return formData.activityLevel
      default:
        return false
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg"></div>
            <span className="text-3xl font-bold text-white">FitLux</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">Help us personalize your fitness journey</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {step === 1 && (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </>
              )}
              {step === 2 && (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Fitness Goals
                </>
              )}
              {step === 3 && (
                <>
                  <Activity className="h-5 w-5 mr-2" />
                  Activity Level
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-300">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-300">
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-gray-300">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-gray-300">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Fitness Goals */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-gray-300">What's your primary fitness goal?</p>
                <div className="grid gap-3">
                  {[
                    { value: "weight_loss", label: "Weight Loss", desc: "Lose weight and burn fat" },
                    { value: "muscle_gain", label: "Muscle Gain", desc: "Build muscle and strength" },
                    { value: "maintenance", label: "Maintenance", desc: "Maintain current fitness level" },
                  ].map((goal) => (
                    <div
                      key={goal.value}
                      onClick={() => handleInputChange("goal", goal.value)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.goal === goal.value
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-slate-600 bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.goal === goal.value ? "border-orange-500 bg-orange-500" : "border-slate-400"
                          }`}
                        />
                        <div>
                          <p className="text-white font-medium">{goal.label}</p>
                          <p className="text-gray-400 text-sm">{goal.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Activity Level */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-gray-300">How active are you currently?</p>
                <div className="grid gap-3">
                  {[
                    { value: "low", label: "Low Activity", desc: "Sedentary lifestyle, little to no exercise" },
                    { value: "moderate", label: "Moderate Activity", desc: "Light exercise 1-3 days per week" },
                    { value: "high", label: "High Activity", desc: "Regular exercise 4+ days per week" },
                  ].map((level) => (
                    <div
                      key={level.value}
                      onClick={() => handleInputChange("activityLevel", level.value)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.activityLevel === level.value
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-slate-600 bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.activityLevel === level.value
                              ? "border-orange-500 bg-orange-500"
                              : "border-slate-400"
                          }`}
                        />
                        <div>
                          <p className="text-white font-medium">{level.label}</p>
                          <p className="text-gray-400 text-sm">{level.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
              >
                Back
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
