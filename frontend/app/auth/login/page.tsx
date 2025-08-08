"use client"
import './login.css'
import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/users/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: password
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }
      const data = await response.json()
      console.log("Login response:", data)
      await login(data)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="w-full max-w-md space-y-8">
        <Card className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl">
          <CardHeader>
            {/* Logo inside container */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 intellifit-gradient rounded-lg"></div>
              <span className="text-2xl font-bold intellifit-light-text">IntelliFit</span>
            </div>
            <CardTitle className="intellifit-text text-center text-2xl font-bold">Welcome Back</CardTitle>
            <p className="intellifit-secondary-text text-center text-sm">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-600">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="intellifit-text font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="intellifit-text font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm intellifit-secondary-text">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm intellifit-accent-text hover:text-orange-600 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full intellifit-bg hover:intellifit-accent-bg intellifit-light-text font-semibold py-3 text-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <span className="intellifit-secondary-text">Don't have an account? </span>
                <Link href="/auth/register" className="intellifit-accent-text hover:text-orange-600 font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-gray-50 border border-gray-200 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm intellifit-text font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs intellifit-secondary-text">Admin: emaanfatima0613@gmail.com / 12345678</p>
            <p className="text-xs intellifit-secondary-text">User: user@fitlux.com / user123</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
