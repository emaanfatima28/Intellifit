"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRef } from "react"

export default function LandingPage() {
  // Refs for smooth scroll
  const aboutRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen intellifit-light-bg">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 intellifit-gradient rounded-lg"></div>
          <span className="text-2xl font-bold intellifit-text">IntelliFit</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection(aboutRef)} className="intellifit-secondary-text hover:intellifit-text transition-colors font-medium">About</button>
          <button onClick={() => scrollToSection(contactRef)} className="intellifit-secondary-text hover:intellifit-text transition-colors font-medium">Contact</button>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="intellifit-text hover:intellifit-accent-bg">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="intellifit-bg hover:intellifit-accent-bg intellifit-light-text">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/30 animate-pulse">✨ AI-Powered Fitness</Badge>
              <h1 className="text-5xl lg:text-6xl font-bold intellifit-text leading-tight">
                Start eating
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient"> healthy</span>
              </h1>
              <p className="text-xl intellifit-secondary-text leading-relaxed">
                Prioritize expert advice and personalized plans to help you achieve your health and wellness goals
              </p>
            </div>
            <Link href="/auth/register">
              <Button size="lg" className="intellifit-bg hover:intellifit-accent-bg intellifit-light-text px-8 py-4 text-lg transition-transform duration-200 hover:scale-105">
                Contact us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="relative">
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Healthy food arrangement"
                fill
                className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[{ label: "Lives saved", value: "200+" }, { label: "Happy clients", value: "150+" }, { label: "Years experience", value: "5+" }, { label: "Success rate", value: "98%" }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
              <Card className="bg-white/80 border-primary/10 shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold intellifit-text mb-2">{stat.value}</div>
                  <div className="intellifit-secondary-text">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Healthy meal"
              width={400}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold intellifit-text mb-4">Wanna stay fit & healthy?</h2>
              <p className="text-secondary text-lg">
                As qualified diet consultants, we're dedicated to creating delightful, well-balanced meal experiences for you. We're dedicated to global more individual and healthier eating habits.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-success" />
                <span className="intellifit-text">Certified nutritionists</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-success" />
                <span className="intellifit-text">Innovative meal plans</span>
              </div>
            </div>
            <Button className="intellifit-bg hover:intellifit-accent-bg intellifit-light-text transition-transform duration-200 hover:scale-105">Explore</Button>
          </motion.div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section ref={aboutRef} id="about" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Image
              src="/aboutus-illustration.svg"
              alt="About Us"
              width={400}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h2 className="text-4xl font-bold intellifit-text mb-4">About Us</h2>
            <p className="text-lg intellifit-secondary-text mb-4">
              IntelliFit is a passionate team of certified nutritionists, trainers, and technologists dedicated to helping you achieve your health and fitness goals. Our mission is to empower individuals with personalized, AI-driven wellness solutions that are both effective and enjoyable.
            </p>
            <ul className="list-disc pl-6 text-secondary space-y-2">
              <li>Expert guidance from real professionals</li>
              <li>Cutting-edge AI for meal and workout plans</li>
              <li>Supportive community and resources</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section ref={contactRef} id="contact" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold intellifit-text mb-6 text-center">Contact Us</h2>
          <form className="space-y-6">
            <div>
              <label className="block intellifit-text mb-2">Name</label>
              <input type="text" className="w-full border border-primary rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Your Name" required />
            </div>
            <div>
              <label className="block intellifit-text mb-2">Email</label>
              <input type="email" className="w-full border border-primary rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="you@email.com" required />
            </div>
            <div>
              <label className="block intellifit-text mb-2">Message</label>
              <textarea className="w-full border border-primary rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" rows={4} placeholder="How can we help you?" required />
            </div>
            <Button type="submit" className="w-full intellifit-bg hover:intellifit-accent-bg intellifit-light-text py-3 text-lg transition-transform duration-200 hover:scale-105">Send Message</Button>
          </form>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-primary/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 intellifit-gradient rounded-lg"></div>
                <span className="text-2xl font-bold intellifit-text">IntelliFit</span>
              </div>
              <p className="text-secondary">Your journey to better health starts here.</p>
            </div>
            <div>
              <h4 className="text-primary font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-secondary hover:text-primary transition-colors">Features</a>
                <a href="#" className="block text-secondary hover:text-primary transition-colors">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="text-primary font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <button onClick={() => scrollToSection(aboutRef)} className="block text-secondary hover:text-primary transition-colors">About</button>
                <button onClick={() => scrollToSection(contactRef)} className="block text-secondary hover:text-primary transition-colors">Contact</button>
              </div>
            </div>
            <div>
              <h4 className="text-primary font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-secondary">
                <p>Email: hello@intellifit.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary/10 mt-12 pt-8 text-center text-secondary">
            <p>&copy; 2024 IntelliFit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
