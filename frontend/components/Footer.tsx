"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Users,
  Target,
  Zap,
  Shield,
  Star
} from "lucide-react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  // Check if we're on a dashboard page (has sidebar)
  const isDashboardPage = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/workouts') ||
    pathname.startsWith('/meals') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/chatbot') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/community') ||
    pathname.startsWith('/settings')

  return (
    <footer className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden ${isDashboardPage ? 'lg:ml-64' : ''}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5 pointer-events-none select-none"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none select-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none select-none"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  IntelliFit
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Your AI-powered fitness companion. Personalized meal plans, workout routines, and progress tracking to help you achieve your health goals.
              </p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 rounded-full">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 rounded-full">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 rounded-full">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-400" />
                Product
              </h4>
              <div className="space-y-4">
                <Link href="/meals" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Meal Plans
                  </span>
                </Link>
                <Link href="/workouts" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Workout Routines
                  </span>
                </Link>
                <Link href="/chatbot" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    AI Assistant
                  </span>
                </Link>
                <Link href="/progress" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Progress Tracking
                  </span>
                </Link>
                <Link href="/profile" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Profile Settings
                  </span>
                </Link>
                <Link href="/dashboard" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Dashboard
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-400" />
                Company
              </h4>
              <div className="space-y-4">
                <Link href="/" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About Us
                  </span>
                </Link>
                <Link href="/auth/register" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Join Our Team
                  </span>
                </Link>
                <Link href="/feedback" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Feedback
                  </span>
                </Link>
                <Link href="/settings" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Privacy Policy
                  </span>
                </Link>
                <Link href="/settings" className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 group">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Terms of Service
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-orange-400" />
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-orange-400" />
                  <span>hello@intellifit.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-3 text-orange-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-orange-400" />
                  <span>123 Fitness Street, Health City, HC 12345</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8">
                <h5 className="text-lg font-semibold mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-orange-400" />
                  Stay Updated
                </h5>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-white/10 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-gray-300">
                <p>&copy; {currentYear} IntelliFit. All rights reserved.</p>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center">
                  Made with <Heart className="h-4 w-4 mx-1 text-red-400" /> for your health
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure & Private
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
