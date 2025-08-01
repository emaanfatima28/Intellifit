"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Dumbbell, Apple, TrendingUp } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion"
}

const quickSuggestions = [
  { icon: Dumbbell, text: "Create a workout plan for muscle gain", category: "Workout" },
  { icon: Apple, text: "Suggest healthy meals for weight loss", category: "Nutrition" },
  { icon: TrendingUp, text: "How can I improve my progress?", category: "Progress" },
  { icon: Sparkles, text: "Motivate me to stay consistent", category: "Motivation" },
]

export default function ChatbotPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${user?.name || "there"}! 👋 I'm your AI fitness assistant. I'm here to help you with personalized workout plans, nutrition advice, and motivation. What would you like to know today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
    fetchProfile()
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

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Personalized responses based on user profile
    const goal = profile?.goal || "maintenance"
    const activityLevel = profile?.activityLevel || "moderate"

    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      if (goal === "weight_loss") {
        return `Based on your weight loss goal, I recommend a combination of cardio and strength training. Try 3-4 cardio sessions per week (like HIIT or running) and 2-3 strength training sessions. This will help you burn calories while maintaining muscle mass. Would you like me to create a specific weekly plan?`
      } else if (goal === "muscle_gain") {
        return `For muscle gain, focus on compound movements like squats, deadlifts, and bench press. Aim for 4-5 strength training sessions per week with progressive overload. Include exercises like pull-ups, rows, and overhead press. Rest 48-72 hours between training the same muscle groups. Shall I design a detailed muscle-building routine?`
      } else {
        return `For maintenance, aim for 3-4 balanced workouts per week combining strength training and cardio. Include functional movements and activities you enjoy to stay consistent. Mix it up with yoga, swimming, or hiking to keep things interesting!`
      }
    }

    if (lowerMessage.includes("meal") || lowerMessage.includes("nutrition") || lowerMessage.includes("diet")) {
      if (goal === "weight_loss") {
        return `For weight loss, focus on creating a moderate caloric deficit. Prioritize lean proteins (chicken, fish, tofu), complex carbs (quinoa, sweet potatoes), and plenty of vegetables. Aim for 1.6-2.2g protein per kg body weight. Stay hydrated and consider meal prep to avoid impulsive food choices. Would you like specific meal ideas?`
      } else if (goal === "muscle_gain") {
        return `For muscle gain, you need adequate calories and protein. Aim for 2.2-2.6g protein per kg body weight. Include complex carbs around workouts for energy. Good sources: lean meats, eggs, dairy, legumes, nuts, and whole grains. Don't forget healthy fats from avocados, olive oil, and nuts. Shall I suggest a meal plan?`
      } else {
        return `For maintenance, focus on balanced nutrition with adequate protein, healthy fats, and complex carbohydrates. Listen to your hunger cues and eat mindfully. Include a variety of colorful fruits and vegetables for micronutrients.`
      }
    }

    if (lowerMessage.includes("motivat") || lowerMessage.includes("consistent")) {
      return `Staying consistent is key to success! Here are some tips: 1) Set small, achievable goals 2) Track your progress 3) Find a workout buddy or community 4) Celebrate small wins 5) Remember your 'why'. You've already taken the first step by being here. Every workout counts, even if it's just 10 minutes! 💪`
    }

    if (lowerMessage.includes("progress") || lowerMessage.includes("improve")) {
      return `Great question! To improve progress: 1) Track your workouts and nutrition consistently 2) Gradually increase intensity (progressive overload) 3) Ensure adequate rest and recovery 4) Stay hydrated and get quality sleep 5) Be patient - real changes take time. Based on your current activity level (${activityLevel}), consider gradually increasing workout frequency or intensity.`
    }

    // Default responses
    const defaultResponses = [
      `That's a great question! Based on your profile, I'd recommend focusing on your ${goal.replace("_", " ")} goal. What specific aspect would you like help with?`,
      `I'm here to help you succeed! Whether it's workouts, nutrition, or motivation, I can provide personalized advice based on your goals. What's on your mind?`,
      `Every fitness journey is unique! Given your ${activityLevel} activity level, I can suggest ways to optimize your routine. What would you like to explore?`,
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputMessage),
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">AI Fitness Assistant</h1>
          <p className="text-gray-400">Get personalized advice for your fitness journey</p>
        </div>

        {/* AI Assistant Card */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">FitLux AI Assistant</h3>
                <p className="text-gray-300 text-sm">
                  Powered by advanced AI • Personalized for your {profile?.goal?.replace("_", " ") || "fitness"} goals
                </p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Online</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <Avatar className={`w-8 h-8 ${message.sender === "ai" ? "bg-purple-500" : "bg-orange-500"}`}>
                        <AvatarFallback className="text-white">
                          {message.sender === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user" ? "bg-orange-500 text-white" : "bg-slate-700 text-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 bg-purple-500">
                        <AvatarFallback className="text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about fitness, nutrition, or motivation..."
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Suggestions Sidebar */}
          <div className="space-y-6">
            {/* Quick Suggestions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white bg-transparent"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <div className="flex items-start space-x-3">
                      <suggestion.icon className="h-4 w-4 mt-0.5 text-orange-400" />
                      <div>
                        <p className="text-sm font-medium">{suggestion.text}</p>
                        <Badge className="mt-1 text-xs bg-orange-500/20 text-orange-400">{suggestion.category}</Badge>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Personalized workout plans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Nutrition recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Progress tracking advice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Motivation & support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Goal-based guidance</span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Context */}
            {profile && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Your Profile Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Goal:</span>
                    <span className="text-white text-sm capitalize">{profile.goal?.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Activity:</span>
                    <span className="text-white text-sm capitalize">{profile.activityLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Weight:</span>
                    <span className="text-white text-sm">{profile.weight} kg</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
