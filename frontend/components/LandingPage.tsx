"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import FoodModel3D from "./3DFoodModel"

export default function LandingPage() {
  // Refs for smooth scroll
  const aboutRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  // State for letter-by-letter animation
  const [displayedText, setDisplayedText] = useState("")
  const fullText = "Start eating healthy"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100) // Speed of letter appearance

    return () => clearInterval(timer)
  }, [])

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
        <div className="flex items-center space-x-8">
          <button onClick={() => scrollToSection(aboutRef)} className="intellifit-secondary-text hover:intellifit-text transition-colors font-medium">About</button>
          <button onClick={() => scrollToSection(contactRef)} className="intellifit-secondary-text hover:intellifit-text transition-colors font-medium">Contact</button>
          <Link href="/auth/login">
            <Button variant="ghost" className="intellifit-text hover:intellifit-accent-bg">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="intellifit-bg hover:intellifit-accent-bg intellifit-light-text">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/30 animate-pulse shadow-lg">✨ AI-Powered Fitness</Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl font-extrabold text-[#1e293b] leading-tight drop-shadow-lg"
              >
                {displayedText}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient"> healthy</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl intellifit-secondary-text leading-relaxed"
              >
                Prioritize expert advice and personalized plans to help you achieve your health and wellness goals
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/auth/login">
                <Button size="lg" className="intellifit-bg hover:intellifit-accent-bg intellifit-light-text px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
                  Explore Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 transform hover:scale-105 transition-transform duration-500">
              <FoodModel3D />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Cards Section */}
      <motion.section ref={featuresRef} id="features" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-[#1e293b] mb-12 text-center">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Meal Plan", desc: "Personalized meal plans for your goals.", img: "/carrots-2106825_1280.jpg" },
            { title: "Workout", desc: "Custom workouts for every fitness level.", img: "/man-2264825_1280.jpg" },
            { title: "AI Assistant", desc: "Smart AI to guide your fitness journey.", img: "/ai-7977960_1280.jpg" },
          ].map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
              <Card className="bg-white/80 border-primary/10 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center p-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-6 flex items-center justify-center bg-gray-100">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#1e293b] mb-2">{feature.title}</h3>
                <p className="intellifit-secondary-text text-center">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section ref={howItWorksRef} id="how-it-works" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">HOW IT WORKS</Badge>
          <h2 className="text-4xl font-bold text-[#1e293b] mb-4">Just Three Easy Steps</h2>
          <p className="intellifit-secondary-text text-lg">We keep the process simple, so you can focus on what matters.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: 1, title: "FREE CONSULTATION", desc: "We meet and learn about your needs and goals." },
            { step: 2, title: "PERSONAL PLAN", desc: "You get a plan tailored to your unique situation." },
            { step: 3, title: "YOUR JOURNEY BEGINS", desc: "You receive support until you flourish on your own." },
          ].map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }} className="flex flex-col items-center">
              <div className="text-6xl font-bold text-primary mb-4">{item.step}.</div>
              <h3 className="text-xl font-semibold text-[#1e293b] mb-2">{item.title}</h3>
              <p className="intellifit-secondary-text text-center">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section ref={aboutRef} id="about" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Image
              src="/ImageGenerator_A high-resolution, wides (11).png"
              alt="About Us"
              width={400}
              height={400}
              className="rounded-2xl shadow-lg object-cover w-full h-auto"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">About Us</h2>
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
        <div className="bg-[#1e293b] rounded-2xl shadow-xl p-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Contact Us</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">First Name*</label>
                <input type="text" className="w-full border border-primary bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400" placeholder="First Name" required />
              </div>
              <div>
                <label className="block text-white mb-2">Last Name*</label>
                <input type="text" className="w-full border border-primary bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400" placeholder="Last Name" required />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Email Address*</label>
              <input type="email" className="w-full border border-primary bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400" placeholder="you@email.com" required />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Phone*</label>
                <input type="text" className="w-full border border-primary bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400" placeholder="Phone" required />
              </div>
              <div>
                <label className="block text-white mb-2">Subject*</label>
                <input type="text" className="w-full border border-primary bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400" placeholder="Subject" required />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Message*</label>
              <textarea className="w-full border border-primary bg-transparent text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400" rows={4} placeholder="How can we help you?" required />
            </div>
            <Button type="submit" className="w-full intellifit-accent-bg hover:intellifit-bg text-white py-3 text-lg transition-transform duration-200 hover:scale-105">Send Message</Button>
          </form>
        </div>
      </motion.section>
    </div>
  )
}
