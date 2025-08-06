"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Inter } from 'next/font/google'
import './globals.css '
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg"></div>
              <span className="text-2xl font-bold text-white">IntelliFit</span>
            </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">✨ AI-Powered Fitness</Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Start eating
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  {" "}
                  healthy
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Prioritize expert advice and personalized plans to help you achieve your health and wellness goals
              </p>
            </div>
            <Link href="/auth/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                Contact us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="relative w-full h-96 rounded-2xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Healthy food arrangement"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-gray-400">Lives saved</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">150+</div>
              <div className="text-gray-400">Happy clients</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">5+</div>
              <div className="text-gray-400">Years experience</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-400">Success rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Healthy meal"
              width={400}
              height={400}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Wanna stay fit & healthy?</h2>
              <p className="text-gray-300 text-lg">
                As qualified diet consultants, we're dedicated to creating delightful, well-balanced meal experiences
                for you. We're dedicated to global more individual and healthier eating habits.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-white">Certified nutritionists</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-white">Innovative meal plans</span>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Explore</Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How we can help you</h2>
          <p className="text-gray-300 text-lg">Here are the services we offer to help you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Detox and cleanse programs</h3>
              <p className="text-gray-300 mb-6">
                Boost your well-being with our detox programs designed to reset your eating habits and enhance overall
                health.
              </p>
              <Button
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white bg-transparent"
              >
                Learn more
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Personalized meal plans</h3>
              <p className="text-gray-300 mb-6">
                Get customized meal plans tailored to your specific dietary needs, preferences, and health goals for
                optimal results.
              </p>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                Learn more
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border-teal-500/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">We provide the most enjoyable experience</h3>
            <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto">
              The personalized advice and support I received have dramatically improved my health and vitality. I've
              never felt better, and the holistic approach was truly beyond my expectations.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">AJ</span>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Maria</div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white">Go to FitLux</Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg"></div>
                <span className="text-2xl font-bold text-white">FitLux</span>
              </div>
              <p className="text-gray-400">Your journey to better health starts here.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: hello@fitlux.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FitLux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
