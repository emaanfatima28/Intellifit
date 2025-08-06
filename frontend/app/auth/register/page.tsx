"use client"
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
import Image from "next/image"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/users/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data = await response.json()
      router.push("/auth/login")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#f8fafc] via-[#e0e7ef] to-[#f8fafc]">
      {/* Left side - Register Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)' }}>
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-2xl border-2 border-[#2563eb]/10 mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2563eb] mb-2">Create an Account</h1>
            <p className="text-[#64748b]">Join thousands on their fitness journey</p>
          </div>
          <Card className="bg-white border-[#e2e8f0] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#1e293b] text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                {error && (
                  <Alert className="bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#2563eb] font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-[#f8fafc] border-[#2563eb]/30 text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2563eb] font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#f8fafc] border-[#2563eb]/30 text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#2563eb] font-semibold">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#f8fafc] border-[#2563eb]/30 text-[#1e293b] placeholder:text-[#64748b] pr-10 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748b] hover:text-[#2563eb]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#2563eb] font-semibold">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[#f8fafc] border-[#2563eb]/30 text-[#1e293b] placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563eb] hover:bg-[#f59e42] text-white font-semibold shadow-lg transition-colors duration-200"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <div className="text-center">
                  <span className="text-[#64748b]">Already have an account? </span>
                  <Link href="/auth/login" className="text-[#2563eb] hover:text-[#f59e42] font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 relative">
        <Image src="/ImageGenerator_A full background illust (1).png?height=800&width=600" alt="Signup Visual" fill className="object-cover rounded-l-lg shadow-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/70 to-transparent rounded-l-lg"></div>
      </div>
    </div>
  )
}
