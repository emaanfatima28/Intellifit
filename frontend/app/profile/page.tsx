"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, User, Target, Settings } from "lucide-react"

export default function ProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
  })

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
        setFormData({
          age: data.age?.toString() || "",
          gender: data.gender || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          goal: data.goal || "",
          activityLevel: data.activityLevel || "",
        })
      } else if (response.status === 404) {
        // Profile not found, this is normal for new users
        setProfile(null)
      } else {
        console.error("Error fetching profile:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    setLoading(true)

    // Validate form data
    if (!formData.age || !formData.gender || !formData.height || !formData.weight || !formData.goal || !formData.activityLevel) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // Validate numbers
    if (isNaN(Number(formData.age)) || isNaN(Number(formData.height)) || isNaN(Number(formData.weight))) {
      setError("Age, height, and weight must be valid numbers")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: profile ? "PUT" : "POST",
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
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to update profile")
      }

      const data = await response.json()
      setProfile(data)
      setIsEditing(false)
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateBMI = () => {
    if (profile?.height && profile?.weight) {
      const heightInM = profile.height / 100
      return (profile.weight / (heightInM * heightInM)).toFixed(1)
    }
    return "N/A"
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = Number.parseFloat(bmi)
    if (bmiValue < 18.5) return { category: "Underweight", color: "text-blue-400" }
    if (bmiValue < 25) return { category: "Normal", color: "text-green-400" }
    if (bmiValue < 30) return { category: "Overweight", color: "text-yellow-400" }
    return { category: "Obese", color: "text-red-400" }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-black font-semibold text-lg bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent tracking-wide">
              Manage your personal information and fitness preferences
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="bg-orange-500 hover:bg-orange-600 text-white">
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
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

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="personal" className="data-[state=active]:bg-orange-500">
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="fitness" className="data-[state=active]:bg-orange-500">
              <Target className="h-4 w-4 mr-2" />
              Fitness Goals
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-orange-500">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* User Info */}
                    <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="text-white text-xl font-semibold">{user.name}</h3>
                        <p className="text-gray-400">{user.email}</p>
                        <Badge className="mt-1 bg-orange-500/20 text-orange-400">
                          Member since {new Date().getFullYear()}
                        </Badge>
                      </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-gray-300">
                          Age
                        </Label>
                        {isEditing ? (
                          <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        ) : (
                          <div className="p-3 bg-slate-700 rounded-md text-white">{profile?.age || "Not set"}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-gray-300">
                          Gender
                        </Label>
                        {isEditing ? (
                          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-3 bg-slate-700 rounded-md text-white capitalize">
                            {profile?.gender || "Not set"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-gray-300">
                          Height (cm)
                        </Label>
                        {isEditing ? (
                          <Input
                            id="height"
                            type="number"
                            value={formData.height}
                            onChange={(e) => handleInputChange("height", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        ) : (
                          <div className="p-3 bg-slate-700 rounded-md text-white">
                            {profile?.height ? `${profile.height} cm` : "Not set"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-gray-300">
                          Weight (kg)
                        </Label>
                        {isEditing ? (
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        ) : (
                          <div className="p-3 bg-slate-700 rounded-md text-white">
                            {profile?.weight ? `${profile.weight} kg` : "Not set"}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4">
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats Card */}
              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Health Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">BMI</span>
                      <span className="text-white font-semibold">{calculateBMI()}</span>
                    </div>
                    {profile?.height && profile?.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category</span>
                        <span className={`font-semibold ${getBMICategory(calculateBMI()).color}`}>
                          {getBMICategory(calculateBMI()).category}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age Group</span>
                      <span className="text-white">
                        {profile?.age
                          ? profile.age < 25
                            ? "Young Adult"
                            : profile.age < 40
                              ? "Adult"
                              : profile.age < 60
                                ? "Middle Age"
                                : "Senior"
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profile</span>
                      <Badge className={profile ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {profile ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subscription</span>
                      <Badge className="bg-blue-500/20 text-blue-400">Free</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Joined</span>
                      <span className="text-white text-sm">Jan 2024</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Fitness Goals & Activity Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-gray-300">Primary Goal</Label>
                    {isEditing ? (
                      <div className="space-y-3">
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
                    ) : (
                      <div className="p-4 bg-slate-700 rounded-lg">
                        <p className="text-white font-medium capitalize">
                          {profile?.goal?.replace("_", " ") || "Not set"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-300">Activity Level</Label>
                    {isEditing ? (
                      <div className="space-y-3">
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
                    ) : (
                      <div className="p-4 bg-slate-700 rounded-lg">
                        <p className="text-white font-medium capitalize">{profile?.activityLevel || "Not set"}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">App Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive workout reminders and progress updates</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Push Notifications</h3>
                      <p className="text-gray-400 text-sm">Get notified about new features and achievements</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Weekly Reports</h3>
                      <p className="text-gray-400 text-sm">Receive weekly progress summaries</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Profile Visibility</h3>
                      <p className="text-gray-400 text-sm">Make your profile visible to other users</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Share Progress</h3>
                      <p className="text-gray-400 text-sm">Allow others to see your workout achievements</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
    )
}

