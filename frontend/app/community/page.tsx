"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  TrendingUp, 
  Award,
  Calendar,
  MapPin,
  Clock,
  Star
} from "lucide-react"
import { motion } from "framer-motion"

export default function CommunityPage() {
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
  }, [user, token, router])

  if (!user) return null

  const communityPosts = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder-user.jpg",
        level: "Gold Member"
      },
      content: "Just completed my 30-day fitness challenge! Lost 5kg and feeling amazing. Consistency is key! 💪",
      likes: 24,
      comments: 8,
      shares: 3,
      timeAgo: "2 hours ago",
      tags: ["Weight Loss", "Motivation"]
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "/placeholder-user.jpg",
        level: "Silver Member"
      },
      content: "New personal record on bench press today! 100kg for 3 reps. The progressive overload is working wonders.",
      likes: 18,
      comments: 5,
      shares: 2,
      timeAgo: "4 hours ago",
      tags: ["Strength Training", "PR"]
    },
    {
      id: 3,
      user: {
        name: "Emma Davis",
        avatar: "/placeholder-user.jpg",
        level: "Platinum Member"
      },
      content: "Started my morning with a 5km run and some yoga. Perfect way to energize for the day ahead! 🌅",
      likes: 31,
      comments: 12,
      shares: 7,
      timeAgo: "6 hours ago",
      tags: ["Cardio", "Yoga", "Morning Routine"]
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Virtual Fitness Challenge",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      participants: 156,
      type: "Challenge"
    },
    {
      id: 2,
      title: "Nutrition Workshop",
      date: "Dec 20, 2024",
      time: "2:00 PM",
      participants: 89,
      type: "Workshop"
    },
    {
      id: 3,
      title: "Group Workout Session",
      date: "Dec 22, 2024",
      time: "9:00 AM",
      participants: 45,
      type: "Workout"
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
            <p className="text-black font-semibold text-lg bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent tracking-wide">
              Connect, share, and grow together
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </motion.div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Members</p>
                  <p className="text-2xl font-bold text-white">2,847</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Today</p>
                  <p className="text-2xl font-bold text-white">342</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Posts Today</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Challenges</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Community Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input 
                        placeholder="Share your fitness journey..." 
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      />
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            📷 Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            🏃‍♂️ Workout
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            🎯 Goal
                          </Button>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Community Posts */}
            {communityPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback className="bg-orange-500 text-white">
                          {post.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-white font-semibold">{post.user.name}</h3>
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            {post.user.level}
                          </Badge>
                          <span className="text-gray-400 text-sm">• {post.timeAgo}</span>
                        </div>
                        <p className="text-gray-300 mb-4">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="bg-slate-700 text-gray-300">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-6">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                            <Heart className="h-4 w-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                            <Share2 className="h-4 w-4 mr-2" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Events & Leaderboard */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-orange-500/20 text-orange-400 mb-1">
                          {event.type}
                        </Badge>
                        <p className="text-gray-400 text-sm">{event.participants} participants</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    This Week's Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Emma Davis", points: 2847, rank: 1, avatar: "/placeholder-user.jpg" },
                    { name: "Mike Chen", points: 2654, rank: 2, avatar: "/placeholder-user.jpg" },
                    { name: "Sarah Johnson", points: 2432, rank: 3, avatar: "/placeholder-user.jpg" },
                    { name: "Alex Rodriguez", points: 2218, rank: 4, avatar: "/placeholder-user.jpg" },
                    { name: "Lisa Wang", points: 1987, rank: 5, avatar: "/placeholder-user.jpg" }
                  ].map((leader, index) => (
                    <div key={leader.rank} className="flex items-center space-x-4 p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-sm">
                        {leader.rank}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={leader.avatar} />
                        <AvatarFallback className="bg-orange-500 text-white">
                          {leader.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{leader.name}</h4>
                        <p className="text-gray-400 text-xs">{leader.points} points</p>
                      </div>
                      {index < 3 && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
