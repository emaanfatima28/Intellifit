"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Sparkles, Dumbbell, Apple, Target, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion" | "workout" | "meal"
}

export default function ChatbotPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickSuggestions = [
    { text: "Create a workout plan for me", icon: Dumbbell, type: "workout" },
    { text: "Suggest healthy meals", icon: Apple, type: "meal" },
    { text: "How can I lose weight?", icon: Target, type: "advice" },
    { text: "Track my progress", icon: TrendingUp, type: "progress" },
  ]

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }

    fetchProfile()
    initializeChat()
  }, [user, token, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const profileData = await response.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: `Hello ${user?.name}! 👋 I'm your AI fitness assistant. I'm here to help you with personalized workout plans, nutrition advice, and answer any fitness-related questions you might have. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    }
    setMessages([welcomeMessage])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: content,
          userProfile: profile,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: "ai",
          timestamp: new Date(),
          type: data.type || "text",
        }

        setMessages((prev) => [...prev, aiMessage])
      } else {
        // Fallback AI response
        const fallbackResponse = generateFallbackResponse(content)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Fallback AI response
      const fallbackResponse = generateFallbackResponse(content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      if (profile?.goal === "weight_loss") {
        return "For weight loss, I recommend focusing on cardio exercises like HIIT workouts, running, or cycling. Aim for 150 minutes of moderate-intensity exercise per week. Would you like me to create a specific workout plan for you?"
      } else if (profile?.goal === "muscle_gain") {
        return "For muscle gain, focus on strength training with compound exercises like squats, deadlifts, and bench press. Aim for 3-4 strength training sessions per week with progressive overload. Shall I design a muscle-building routine for you?"
      } else {
        return "Based on your fitness level, I'd recommend a balanced approach with both cardio and strength training. Start with 3 workouts per week and gradually increase intensity. What type of exercises do you enjoy most?"
      }
    } else if (lowerMessage.includes("meal") || lowerMessage.includes("nutrition") || lowerMessage.includes("diet")) {
      if (profile?.goal === "weight_loss") {
        return "For weight loss, focus on creating a caloric deficit with nutrient-dense foods. Include lean proteins, vegetables, whole grains, and healthy fats. Aim for smaller, frequent meals throughout the day. Would you like me to suggest some specific meal ideas?"
      } else if (profile?.goal === "muscle_gain") {
        return "For muscle gain, you'll need adequate protein (1.6-2.2g per kg body weight) and a slight caloric surplus. Include foods like chicken, fish, eggs, quinoa, and nuts. Don't forget post-workout nutrition! Shall I create a meal plan for you?"
      } else {
        return "A balanced diet with whole foods is key to maintaining good health. Focus on variety, portion control, and staying hydrated. What are your current eating habits like?"
      }
    } else if (lowerMessage.includes("weight") || lowerMessage.includes("lose") || lowerMessage.includes("gain")) {
      return "Weight management is about creating the right energy balance. For weight loss, you need a caloric deficit through diet and exercise. For weight gain, you need a surplus with proper nutrition. What's your current goal?"
    } else if (lowerMessage.includes("progress") || lowerMessage.includes("track")) {
      return "Tracking progress is essential for success! I recommend monitoring weight, body measurements, workout performance, and how you feel. Take progress photos and keep a workout log. What metrics would you like to focus on?"
    } else {
      return "I'm here to help with all your fitness and nutrition questions! Whether you need workout plans, meal suggestions, or general health advice, just let me know. What specific area would you like to focus on today?"
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputMessage)
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1e293b] flex items-center drop-shadow-lg">
              <Bot className="h-8 w-8 mr-3 text-primary" />
              AI Fitness Assistant
            </h1>
            <p className="text-[#64748b] mt-1">Get personalized fitness and nutrition advice</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Powered
          </Badge>
        </div>

        {/* Chat Interface */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-2xl shadow-2xl border-2 border-[#2563eb]/10 bg-white overflow-hidden">
          <Card className="bg-transparent border-none shadow-none h-[600px] flex flex-col">
            <CardHeader className="border-b border-[#e2e8f0] bg-[#f8fafc]">
              <CardTitle className="text-2xl font-bold text-[#1e293b] flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc] custom-scrollbar" style={{ maxHeight: '400px', minHeight: '200px' }}>
                {messages.map((message, i) => (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 shadow-md transition-all duration-300 ${message.sender === "user"
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#e0e7ef] text-[#1e293b]"
                        }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && <Bot className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />}
                        {message.sender === "user" && (
                          <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-base leading-relaxed">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#e0e7ef] text-[#1e293b] rounded-lg p-4 max-w-[80%] shadow-md">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="p-6 border-t border-[#e2e8f0] bg-[#f8fafc]">
                  <p className="text-[#64748b] text-sm mb-3">Quick suggestions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="border-[#e2e8f0] text-[#1e293b] hover:bg-[#2563eb]/10 bg-transparent justify-start"
                      >
                        <suggestion.icon className="h-4 w-4 mr-2" />
                        {suggestion.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {/* Input */}
              <div className="p-6 border-t border-[#e2e8f0] bg-[#f8fafc]">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about fitness, nutrition, or health..."
                    className="flex-1 bg-white border-[#e2e8f0] text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-[#2563eb] hover:bg-[#f59e42] text-white font-semibold shadow-lg transition-colors duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* AI Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            icon: Dumbbell,
            title: "Workout Plans",
            desc: "Get personalized workout routines based on your goals and fitness level",
            color: "bg-primary/20 border-primary/30"
          }, {
            icon: Apple,
            title: "Nutrition Advice",
            desc: "Receive meal suggestions and dietary recommendations tailored to you",
            color: "bg-secondary/20 border-secondary/30"
          }, {
            icon: Target,
            title: "Goal Tracking",
            desc: "Monitor your progress and get insights on achieving your fitness goals",
            color: "bg-accent/20 border-accent/30"
          }].map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
              <Card className={`${feature.color} transition-all duration-300 hover:scale-[1.02]`}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2">{feature.title}</h3>
                  <p className="text-[#64748b] text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
