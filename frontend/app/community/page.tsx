"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Upload,
  Trophy,
  Target,
  Calendar,
  Plus,
  Image as ImageIcon,
  Send,
  Users2,
  Award,
  TrendingUp
} from "lucide-react"
import { motion } from "framer-motion"

interface Post {
  id: string
  userId: string
  userName: string
  userAvatar: string
  image?: string
  description: string
  likes: number
  isLiked: boolean
  comments: Comment[]
  timestamp: Date
}

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
}

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  maxParticipants: number
  endDate: Date
  isJoined: boolean
  image: string
}

interface Group {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  isJoined: boolean
  image: string
}

export default function CommunityPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [newPostDescription, setNewPostDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }

    loadCommunityData()
  }, [user, token, router])

  const loadCommunityData = () => {
    // Mock data - replace with actual API calls
    const mockPosts: Post[] = [
      {
        id: "1",
        userId: "user1",
        userName: "Sarah Johnson",
        userAvatar: "/placeholder-user.jpg",
        image: "/placeholder.jpg",
        description: "Just completed my morning workout! 💪 30 minutes of HIIT training. Feeling energized and ready for the day!",
        likes: 24,
        isLiked: false,
        comments: [
          { id: "1", userId: "user2", userName: "Mike Chen", content: "Great job! Keep it up!", timestamp: new Date() }
        ],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: "2",
        userId: "user2",
        userName: "Mike Chen",
        userAvatar: "/placeholder-user.jpg",
        description: "Hit a new personal record today! Deadlifted 225lbs for 5 reps. Progress feels amazing! 🏋️‍♂️",
        likes: 18,
        isLiked: true,
        comments: [],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]

    const mockChallenges: Challenge[] = [
      {
        id: "1",
        title: "30-Day Push-up Challenge",
        description: "Complete 100 push-ups daily for 30 days. Build strength and endurance together!",
        participants: 156,
        maxParticipants: 200,
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isJoined: false,
        image: "/placeholder.jpg"
      },
      {
        id: "2",
        title: "Summer Body Transformation",
        description: "12-week program to get your best summer body. Nutrition and workout guidance included.",
        participants: 89,
        maxParticipants: 100,
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isJoined: true,
        image: "/placeholder.jpg"
      }
    ]

    const mockGroups: Group[] = [
      {
        id: "1",
        name: "Weightlifting Warriors",
        description: "A community for serious weightlifters. Share tips, progress, and motivate each other.",
        members: 342,
        maxMembers: 500,
        isJoined: false,
        image: "/placeholder.jpg"
      },
      {
        id: "2",
        name: "Yoga & Mindfulness",
        description: "Find your inner peace through yoga and meditation. All levels welcome!",
        members: 189,
        maxMembers: 300,
        isJoined: true,
        image: "/placeholder.jpg"
      }
    ]

    setPosts(mockPosts)
    setChallenges(mockChallenges)
    setGroups(mockGroups)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreatePost = () => {
    if (!newPostDescription.trim() && !selectedImage) return

    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || "/placeholder-user.jpg",
      image: imagePreview,
      description: newPostDescription,
      likes: 0,
      isLiked: false,
      comments: [],
      timestamp: new Date()
    }

    setPosts([newPost, ...posts])
    setNewPostDescription("")
    setSelectedImage(null)
    setImagePreview("")
  }

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        }
      }
      return post
    }))
  }

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          participants: challenge.isJoined ? challenge.participants - 1 : challenge.participants + 1,
          isJoined: !challenge.isJoined
        }
      }
      return challenge
    }))
  }

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.isJoined ? group.members - 1 : group.members + 1,
          isJoined: !group.isJoined
        }
      }
      return group
    }))
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8 py-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-black flex items-center justify-center">
            <Users className="h-10 w-10 mr-3 text-primary" />
            Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, share, and grow together with fitness enthusiasts from around the world
          </p>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="feed" className="text-black">Feed</TabsTrigger>
            <TabsTrigger value="challenges" className="text-black">Challenges</TabsTrigger>
            <TabsTrigger value="groups" className="text-black">Groups</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Share Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder-user.jpg"} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="What's your fitness achievement today? Share your progress, tips, or motivation..."
                      value={newPostDescription}
                      onChange={(e) => setNewPostDescription(e.target.value)}
                      className="min-h-[100px] text-black"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full max-w-md rounded-lg" />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedImage(null)
                            setImagePreview("")
                          }}
                          className="absolute top-2 right-2"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-black"
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Add Photo
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </div>
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPostDescription.trim() && !selectedImage}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.userAvatar} />
                          <AvatarFallback>{post.userName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-black">{post.userName}</h3>
                          <p className="text-sm text-gray-500">
                            {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />
                      )}

                      <p className="text-black mb-4">{post.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments.length}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-lg h-full">
                    <div className="relative">
                      <img src={challenge.image} alt={challenge.title} className="w-full h-48 object-cover rounded-t-lg" />
                      <Badge className="absolute top-4 right-4 bg-primary text-white">
                        <Trophy className="h-3 w-3 mr-1" />
                        Challenge
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-black mb-2">{challenge.title}</h3>
                      <p className="text-gray-600 mb-4">{challenge.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Participants:</span>
                          <span className="text-black font-semibold">
                            {challenge.participants}/{challenge.maxParticipants}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Ends:</span>
                          <span className="text-black font-semibold">
                            {challenge.endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleJoinChallenge(challenge.id)}
                        className={`w-full ${challenge.isJoined
                          ? 'bg-gray-500 hover:bg-gray-600'
                          : 'bg-primary hover:bg-primary/90'
                          } text-white`}
                      >
                        {challenge.isJoined ? 'Leave Challenge' : 'Join Challenge'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white shadow-lg h-full">
                    <div className="relative">
                      <img src={group.image} alt={group.name} className="w-full h-48 object-cover rounded-t-lg" />
                      <Badge className="absolute top-4 right-4 bg-secondary text-white">
                        <Users2 className="h-3 w-3 mr-1" />
                        Group
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-black mb-2">{group.name}</h3>
                      <p className="text-gray-600 mb-4">{group.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Members:</span>
                          <span className="text-black font-semibold">
                            {group.members}/{group.maxMembers}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleJoinGroup(group.id)}
                        className={`w-full ${group.isJoined
                          ? 'bg-gray-500 hover:bg-gray-600'
                          : 'bg-secondary hover:bg-secondary/90'
                          } text-white`}
                      >
                        {group.isJoined ? 'Leave Group' : 'Join Group'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  )
}
