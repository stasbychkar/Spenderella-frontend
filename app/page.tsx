"use client"

import type React from "react"

import styles from "./landing.module.css"
import { useState } from "react"
import { ArrowRight, Shield, Play, Check, RefreshCcw, SquareChartGantt, Mail, User, MessageSquare, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GlassCard } from "@/components/glass-card"
import Image from "next/image"
import Link from "next/link"
import { BASE_URL } from "@/lib/api/database"

export default function Landing() {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false)
  const [accessFormData, setAccessFormData] = useState({
    name: "",
    email: "",
    hearAbout: "",
    problem: "",
    openToCall: false,
  })
  const [isAccessFormSubmitted, setIsAccessFormSubmitted] = useState(false)

  const handleAccessFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessFormData.name && accessFormData.email && accessFormData.problem) {
      setIsAccessFormSubmitted(true)
      // TODO: y send the form data to backend
      setTimeout(() => {
        setAccessFormData({
          name: "",
          email: "",
          hearAbout: "",
          problem: "",
          openToCall: false,
        })
        setIsAccessFormSubmitted(false)
        setIsAccessModalOpen(false)
      }, 3000)
    }
  }

  const handleAccessFormChange = (field: string, value: string | boolean) => {
    setAccessFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTryDemo = async () => {
    const res = await fetch(`${BASE_URL}/db-create-demo-user`, {
      method: "POST"
    });
  
    if (!res.ok) {
      console.error("Failed to create demo user");
      return;
    }
  
    const data = await res.json();
    const demoId = data.user_id;
  
    // Store ID for future requests
    localStorage.setItem("demo_user_id", demoId);
  
    // Redirect to dashboard
    window.location.href = "/demo/dashboard";
  };  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
      <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10">

        {/* Hero Section */}
        <section className={styles.sectionLargePadding}>
          <div className="mx-auto max-w-7xl">
            <div className={styles.heroGrid}>

              {/* Left Column - Content */}
              <div className={styles.spaceY8}>
                <div className={styles.spaceY6}>
                  <h1 className={styles.h1}>
                    <span className={styles.gradientText}>
                      Spenderella
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed">
                    Smart. Secure. Stress-free money tracking.
                  </p>
                  <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                    Transform your financial life with expense tracking that works like magic. Connect your
                    accounts and take control of your spending.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/demo/dashboard">
                    <Button
                      variant="outline"
                      size="lg"
                      className={`bg-white/40 backdrop-blur-sm border-white/30 hover:bg-white/60 text-gray-800 transition-all duration-300 text-lg px-8 py-6 h-auto group ${styles.demoButton}`}
                      onClick={handleTryDemo}
                    >
                      <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Try Demo
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 h-auto group"
                    style={{ animationDuration: "0.3s" }}
                    onClick={() => setIsAccessModalOpen(true)}
                  >
                    Request Full Access
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className={styles.flexRow}>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className={styles.iconSmallGreen} />
                    Bank-level security
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Check className={styles.iconSmallGreen} />
                    10,000+ banks supported
                  </div>
                </div>
              </div>

              {/* Right Column - Product Demo */}
              <div className="relative">
                <GlassCard className="p-8 bg-white/30 border-white/40 shadow-2xl">

                  {/* Browser Frame */}
                  <div className="space-y-4">

                    {/* Browser Header */}
                    <div className="flex items-center gap-2 pb-4 border-b border-white/30">
                      <div className="flex gap-2">
                        <div className={`${styles.trafficLight} ${styles.redLight}`} />
                        <div className={`${styles.trafficLight} ${styles.yellowLight}`} />
                        <div className={`${styles.trafficLight} ${styles.greenLight}`} />
                      </div>
                      <div className="flex-1 text-center">
                        <div className="inline-block px-4 py-1 bg-white/40 rounded-full text-xs text-gray-600">
                          spenderella.com
                        </div>
                      </div>
                    </div>

                    {/* Demo Video */}
                    <video
                      className="top-0 left-0 w-full h-full object-cover"
                      src="demo.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>

                </GlassCard>

                {/* Floating Elements */}
                <div className={`${styles.floatingCircle} ${styles.topRightCircle}`} />
                <div className={`${styles.floatingCircle} ${styles.bottomLeftCircle}`} />

              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featureSectionPadding}>
          <div>
            <div className={styles.textCenterSpacing}>
              <h2 className={styles.heading}>
                Your spending story, {" "}
                <span className={styles.gradientH2}>beautifully told.</span>
              </h2>
            </div>

            <div className={styles.featuresContainer}>

              {/* Feature 1 */}
              <GlassCard className={`${styles.featureCard} group`}>
                <div className={styles.iconWrapper1}>
                  <RefreshCcw className={styles.icon1}/>
                </div>
                <h3 className={styles.featureTitle}>Real-time Bank Sync</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect your bank accounts instantly and see your transactions update live. No manual entry or delays — always know exactly where your money is.
                </p>
              </GlassCard>

              {/* Feature 2 */}
              <GlassCard className={`${styles.featureCard} group`}>
                <div className={styles.iconWrapper2}>
                  <Shield className={styles.icon1}/>
                </div>
                <h3 className={styles.featureTitle}>Powered by Plaid</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use Plaid, the industry standard for bank connections. Enjoy seamless account linking with bank-level encryption and trusted security.
                </p>
              </GlassCard>

              {/* Feature 3 */}
              <GlassCard className={`${styles.featureCard} group`}>
                <div className={styles.iconWrapper3}>
                  <SquareChartGantt className={styles.icon1}/>
                </div>
                <h3 className={styles.featureTitle}>Smart Categorization</h3>
                <p className="text-gray-600 leading-relaxed">
                Spenderella automatically sorts your spending into categories, and you can customize them anytime to fit your personal budgeting style.
                </p>
              </GlassCard>

            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.flexColMdRow}>
              <div className={styles.flexRowItemsCenterGap3}>
                <Image src="/logo.png" alt="Spenderella Logo" width={32} height={32} className="object-contain" />
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Spenderella
                </span>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-600">
                <Link href="#" className="hover:text-gray-800 transition-colors">
                  Privacy
                </Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">
                  Terms
                </Link>
                <Link href="#" className="hover:text-gray-800 transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <div className={styles.mt8Pt8BorderTopTextCenter}>
              <p className="text-sm text-gray-500">
                © 2025 Spenderella. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Full Access Request Modal */}
        <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
          <DialogContent className={styles.dialogContent}>

            {isAccessFormSubmitted ? (
              <div className="py-8 text-center space-y-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
                  <Check className="h-10 w-10 text-green-600"/>
                </div>
                <div className="space-y-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Request submitted!
                  </span>
                  <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                    Thank you for your interest in Spenderella. We'll get back to you soon!
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <DialogHeader className="space-y-4 pb-6 border-b border-white/20">
                  <DialogTitle className="text-3xl font-bold text-center">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Request Full Access
                    </span>
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAccessFormSubmit} className="space-y-6 py-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={accessFormData.name}
                    onChange={(e) => handleAccessFormChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                    autoComplete="off"
                    className="bg-white/60 border-2 border-white/60 hover:border-white/80 focus:border-blue-400 h-12 text-base"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="access-email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="access-email"
                    type="email"
                    value={accessFormData.email}
                    onChange={(e) => handleAccessFormChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    required
                    autoComplete="off"
                    className="bg-white/60 border-2 border-white/60 hover:border-white/80 focus:border-blue-400 h-12 text-base"
                  />
                </div>

                {/* Problem to solve */}
                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    What problem do you hope to solve with Spenderella? *
                  </Label>
                  <Textarea
                    id="problem"
                    value={accessFormData.problem}
                    onChange={(e) => handleAccessFormChange("problem", e.target.value)}
                    placeholder="Tell us about your current financial tracking challenges and what you hope to achieve..."
                    required
                    rows={4}
                    className="bg-white/60 border-2 border-white/60 hover:border-white/80 focus:border-blue-400 text-base resize-none"
                  />
                </div>

                {/* Call checkbox */}
                <div className={styles.alertBox}>
                  <Checkbox
                    id="open-to-call"
                    checked={accessFormData.openToCall}
                    onCheckedChange={(checked) => handleAccessFormChange("openToCall", checked as boolean)}
                  />
                  <div className="space-y-2">
                    <Label
                      htmlFor="open-to-call"
                      className={styles.label}
                    >
                      I'm open to a 15-minute call to help improve the product
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAccessModalOpen(false)}
                    className="flex-1 bg-white/60 border-2 border-white/60 hover:bg-white/80 text-gray-700 h-12"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl h-12 font-semibold transition-all duration-300"
                    disabled={!accessFormData.name || !accessFormData.email || !accessFormData.problem}
                  >
                    Submit Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>

              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
