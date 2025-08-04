"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share, Trophy, Plus } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    user: { name: "Sarah Johnson", avatar: "SJ", badge: "Advanced" },
    content:
      "Just completed my first marathon! 26.2 miles in 3:45:32. The training was intense but so worth it. Thanks to everyone who supported me along the way! 🏃‍♀️💪",
    achievement: { type: "Marathon Finish", color: "bg-green-500" },
    stats: { distance: "26.2 miles", time: "3:45:32", pace: "8:35/mile" },
    likes: 89,
    comments: 23,
    shares: 12,
    timestamp: "2 hours ago",
    tags: ["#marathon", "#running", "#achievement"],
  },
  {
    id: 2,
    user: { name: "Mike Chen", avatar: "MC", badge: "Intermediate" },
    content:
      "New PR on deadlift today! 315lbs x 5 reps. Form felt solid and controlled. Working towards that 400lb single rep goal by year end. Who else is chasing PRs this week?",
    achievement: { type: "Deadlift PR", color: "bg-red-500" },
    stats: { weight: "315 lbs", reps: "5", previous: "300 lbs" },
    likes: 156,
    comments: 34,
    shares: 8,
    timestamp: "5 hours ago",
    tags: ["#deadlift", "#PR", "#strength"],
  },
  {
    id: 3,
    user: { name: "Emma Rodriguez", avatar: "ER", badge: "Expert" },
    content:
      "Week 3 of my fitness journey completed! Lost 4 pounds and feeling stronger every day. The community support here is incredible. Special thanks to @coach_martinez for the motivation! 💚",
    achievement: null,
    stats: { weightLoss: "4 lbs", weeks: "3", workouts: "12" },
    likes: 67,
    comments: 18,
    shares: 5,
    timestamp: "1 day ago",
    tags: ["#transformation", "#weightloss", "#motivation"],
  },
]

const trendingTags = [
  { tag: "#motivation", posts: 1247 },
  { tag: "#transformation", posts: 892 },
  { tag: "#strength", posts: 756 },
  { tag: "#cardio", posts: 634 },
  { tag: "#nutrition", posts: 523 },
  { tag: "#marathon", posts: 445 },
]

const suggestedFriends = [
  { name: "Alex Thompson", avatar: "AT", mutualFriends: 5, specialty: "Yoga Instructor" },
  { name: "Jessica Lee", avatar: "JL", mutualFriends: 3, specialty: "Nutritionist" },
  { name: "David Kim", avatar: "DK", mutualFriends: 8, specialty: "Personal Trainer" },
  { name: "Maria Santos", avatar: "MS", mutualFriends: 2, specialty: "Pilates Expert" },
]

const userStats = {
  followers: 1247,
  following: 892,
  posts: 156,
  likesReceived: 3241,
}

export default function CommunityPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState("")

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
  }, [user, token, router])

  const handleCreatePost = () => {
    if (!newPost.trim()) return
    // Here you would typically send the post to your backend
    console.log("Creating post:", newPost)
    setNewPost("")
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
            <p className="text-gray-400">Connect, share, and grow together</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="feed" className="data-[state=active]:bg-orange-500">
                  Feed
                </TabsTrigger>
                <TabsTrigger value="challenges" className="data-[state=active]:bg-orange-500">
                  Challenges
                </TabsTrigger>
                <TabsTrigger value="groups" className="data-[state=active]:bg-orange-500">
                  Groups
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-orange-500">
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                {/* Create Post */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar className="w-10 h-10 bg-orange-500">
                        <AvatarFallback className="text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-4">
                        <Input
                          placeholder="Share your fitness journey..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-gray-400 hover:bg-slate-700 bg-transparent"
                            >
                              📷 Photo
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-gray-400 hover:bg-slate-700 bg-transparent"
                            >
                              🏆 Achievement
                            </Button>
                          </div>
                          <Button
                            onClick={handleCreatePost}
                            disabled={!newPost.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {communityPosts.map((post) => (
                    <Card key={post.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              className={`w-10 h-10 ${post.user.badge === "Advanced" ? "bg-green-500" : post.user.badge === "Expert" ? "bg-purple-500" : "bg-blue-500"}`}
                            >
                              <AvatarFallback className="text-white font-bold">{post.user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-white font-semibold">{post.user.name}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={`text-xs ${
                                    post.user.badge === "Advanced"
                                      ? "bg-green-500/20 text-green-400"
                                      : post.user.badge === "Expert"
                                        ? "bg-purple-500/20 text-purple-400"
                                        : "bg-blue-500/20 text-blue-400"
                                  }`}
                                >
                                  {post.user.badge}
                                </Badge>
                                <span className="text-gray-400 text-sm">{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            •••
                          </Button>
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-300 mb-4">{post.content}</p>

                        {/* Achievement Badge */}
                        {post.achievement && (
                          <div className={`${post.achievement.color} rounded-lg p-6 mb-4 text-center`}>
                            <Trophy className="h-12 w-12 text-white mx-auto mb-2" />
                            <h3 className="text-white text-xl font-bold mb-2">{post.achievement.type}</h3>
                            <div className="flex justify-center space-x-6 text-white text-sm">
                              {Object.entries(post.stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="font-bold">{value}</div>
                                  <div className="opacity-80 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 cursor-pointer"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                          <div className="flex space-x-6">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                              <Heart className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                              <Share className="h-4 w-4 mr-2" />
                              {post.shares}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: "30-Day Push-up Challenge", participants: 1247, daysLeft: 15, difficulty: "Beginner" },
                    { title: "Summer Shred Challenge", participants: 892, daysLeft: 45, difficulty: "Intermediate" },
                    { title: "Marathon Training", participants: 334, daysLeft: 90, difficulty: "Advanced" },
                    { title: "Flexibility Focus", participants: 567, daysLeft: 21, difficulty: "All Levels" },
                  ].map((challenge, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-white font-semibold mb-2">{challenge.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Participants</span>
                            <span className="text-white">{challenge.participants.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Days Left</span>
                            <span className="text-white">{challenge.daysLeft}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Difficulty</span>
                            <Badge className="bg-orange-500/20 text-orange-400">{challenge.difficulty}</Badge>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Join Challenge</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { name: "Weight Loss Warriors", members: 2341, posts: 156, category: "Weight Loss" },
                    { name: "Strength Training Squad", members: 1876, posts: 234, category: "Strength" },
                    { name: "Running Club", members: 1543, posts: 189, category: "Cardio" },
                    { name: "Yoga & Mindfulness", members: 987, posts: 98, category: "Wellness" },
                  ].map((group, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <h3 className="text-white font-semibold mb-2">{group.name}</h3>
                        <Badge className="mb-4 bg-blue-500/20 text-blue-400">{group.category}</Badge>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Members</span>
                            <span className="text-white">{group.members.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Posts this week</span>
                            <span className="text-white">{group.posts}</span>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Join Group</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Weekly Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { rank: 1, name: "Alex Rodriguez", points: 2847, badge: "🥇" },
                        { rank: 2, name: "Sarah Johnson", points: 2634, badge: "🥈" },
                        { rank: 3, name: "Mike Chen", points: 2456, badge: "🥉" },
                        { rank: 4, name: "Emma Davis", points: 2234, badge: "" },
                        { rank: 5, name: "David Kim", points: 2156, badge: "" },
                      ].map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{user.badge || user.rank}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{user.name}</h3>
                              <p className="text-gray-400 text-sm">Rank #{user.rank}</p>
                            </div>
                          </div>
                          <div className="text-orange-400 font-bold">{user.points.toLocaleString()} pts</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats.followers.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats.following}</div>
                    <div className="text-gray-400 text-sm">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats.posts}</div>
                    <div className="text-gray-400 text-sm">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userStats.likesReceived.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Likes Received</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Trending Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTags.map((tag, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 cursor-pointer">
                      {tag.tag}
                    </Badge>
                    <span className="text-gray-400 text-sm">{tag.posts} posts</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Friends */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Suggested Friends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedFriends.map((friend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8 bg-blue-500">
                        <AvatarFallback className="text-white text-sm font-bold">{friend.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-white text-sm font-medium">{friend.name}</h4>
                        <p className="text-gray-400 text-xs">{friend.specialty}</p>
                        <p className="text-gray-500 text-xs">{friend.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

