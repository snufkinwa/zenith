"use client"

import {
  Brain,
  Code,
  Search,
  Timer,
  PenTool,
  Lightbulb,
  BookOpen,
  Highlighter,
  Check,
  Star,
  Twitter,
  MessageCircle,
  Linkedin,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  Shield,
  Users
} from "lucide-react"
import { useState, useEffect } from "react"

import ZenithLogo from "./ui/logo";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "./ui/comp-ui";



export default function ZenithLanding() {
  const [scrollY, setScrollY] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [activeTab, setActiveTab] = useState('ai')

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Staatliches&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}, [])

  const testimonials = [
    {
      text: "Zenith transformed my coding interview prep. The AI feedback is incredibly insightful.",
      author: "Sarah Chen",
      role: "Software Engineer at Google"
    },
    {
      text: "The best coding platform I've used. Complex challenges that actually prepare you for real work.",
      author: "Marcus Johnson",
      role: "Senior Developer at Meta"
    },
    {
      text: "Love the visual thinking tools. Finally a platform that gets how developers actually think.",
      author: "Priya Patel",
      role: "Tech Lead at Stripe"
    }
  ]

  return (
    <div className="h-full w-full  text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
            mask: "linear-gradient(-20deg, transparent 50%, white)",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-end p-6">

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-[#33cc99] transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-[#33cc99] transition-colors">Pricing</a>
          <Button 
            size="sm" 
            className="bg-[#0bc39c] hover:bg-[#0aa083] text-white"
            onClick={() => window.location.href = '/login'}
          > Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section - Matching waitlist style */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8">
          <ZenithLogo />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#33cc99] font-['Staatliches']">
          FUTURE-PROOF YOUR CODING SKILLS
        </h1>

        <div className="max-w-2xl mx-auto mb-12 space-y-4">
          <p className="text-gray-300 text-xl">
            Master complex algorithms, receive intelligent feedback, and accelerate your software engineering career.
          </p>
          <p className="text-gray-400 text-lg">
            Join thousands of developers already using Zenith to level up their coding skills.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
          <Button size="lg" className="bg-[#0bc39c] hover:bg-[#0aa083] text-white px-8 py-3 text-lg font-semibold">
            Start Coding Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#33cc99] text-[#33cc99] hover:bg-[#33cc99] hover:text-black px-8 py-3 text-lg"
          >
            View Demo
          </Button>
        </div>

        {/* Simple stats */}
        <div className="grid grid-cols-3 gap-12  text-center">
          <div>
            <div className="text-3xl font-bold text-[#33cc99]">1000+</div>
            <div className="text-gray-400">Challenges</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#33cc99]">50K+</div>
            <div className="text-gray-400">Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#33cc99]">AI-Powered</div>
            <div className="text-gray-400">Feedback</div>
          </div>
        </div>

        {/* Avatar section */}
        <div className="flex items-center  gap-4 mt-12">
          <div className="flex -space-x-3">
            <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-black" />
            <img src="https://xsgames.co/randomusers/assets/avatars/female/60.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-black" />
            <img src="https://xsgames.co/randomusers/assets/avatars/male/76.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-black" />
          </div>
          <div className="text-sm text-gray-400">
            <div>50,000+ developers already coding</div>
            <div>Join the community today!</div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#33cc99]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative   z-10 py-24 px-4">
        {/* Additional subtle grid for features section */}
        <div className="absolute inset-0 opacity-5">
          <div
            style={{
              backgroundImage: `
                linear-gradient(rgba(51, 204, 153, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(51, 204, 153, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#33cc99] font-['Staatliches']">
              Built for Modern Developers
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8">
              Everything you need to master coding challenges and advance your career
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-900/50 rounded-lg p-1 border border-gray-800">
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'ai' 
                    ? 'bg-[#33cc99] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                AI-Powered
              </button>
              <button 
                onClick={() => setActiveTab('tools')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'tools' 
                    ? 'bg-[#33cc99] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Learning Tools
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'analytics' 
                    ? 'bg-[#33cc99] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'ai' && [
              {
                icon: Brain,
                title: "AI-Powered Feedback",
                description: "Get intelligent feedback and suggestions to improve your code quality and problem-solving approach"
              },
              {
                icon: Lightbulb,
                title: "Smart Hints",
                description: "Contextual hints that guide your thinking without giving away solutions"
              },
              {
                icon: Code,
                title: "Real-World Challenges",
                description: "Tackle problems inspired by actual tech company interviews"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-[#33cc99] transition-colors">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-[#33cc99] mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}

            {activeTab === 'tools' && [
              {
                icon: BookOpen,
                title: "Smart Note-Taking",
                description: "Take notes directly on problems and organize your learning for better retention"
              },
              {
                icon: Highlighter,
                title: "Highlight & Annotate",
                description: "Highlight important parts of problems and add annotations for focused learning"
              },
              {
                icon: PenTool,
                title: "Visual Thinking",
                description: "Draw out algorithms and visualize your problem-solving process"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-[#33cc99] transition-colors">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-[#33cc99] mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}

            {activeTab === 'analytics' && [
              {
                icon: Timer,
                title: "Focus Sessions",
                description: "Built-in Pomodoro timer to help you maintain focus and productivity"
              },
              {
                icon: Search,
                title: "Advanced Search",
                description: "Quickly find problems by difficulty, topic, or company with our search engine"
              },

              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Monitor your improvement with detailed analytics and performance metrics"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-[#33cc99] transition-colors">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-[#33cc99] mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-4 ">
        {/* Diagonal grid pattern for testimonials */}
        <div className="absolute inset-0 opacity-5 ">
          <div
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(18, 77, 255, 0.3) 1px, transparent 1px),
                linear-gradient(-45deg, rgba(18, 77, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-16 text-[#33cc99] font-['Staatliches']">
            What Developers Say
          </h2>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="mb-6 text-2xl text-[#33cc99]">★★★★★</div>
              <blockquote className="text-xl text-gray-200 mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-white">{testimonials[currentTestimonial].author}</div>
                <div className="text-gray-400 text-sm">{testimonials[currentTestimonial].role}</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-[#33cc99] w-8' : 'bg-gray-600'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-4">
        {/* Hexagonal grid pattern for pricing */}
        <div className="absolute inset-0 opacity-5">
          <div
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(51, 204, 153, 0.3) 2px, transparent 2px),
                radial-gradient(circle at 0% 50%, rgba(51, 204, 153, 0.2) 1px, transparent 1px),
                radial-gradient(circle at 100% 50%, rgba(51, 204, 153, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px, 40px 40px, 40px 40px",
              backgroundPosition: "0 0, 20px 20px, 20px 20px",
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#33cc99] font-['Staatliches']">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 text-xl">Start free and upgrade as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold text-white">
                  $0
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  Perfect for getting started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "50 coding challenges",
                    "Basic AI hints",
                    "Note-taking",
                    "Progress tracking"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#33cc99]" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gray-900/50 border-[#33cc99] relative scale-105">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#33cc99] text-black">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-white">
                  $19
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  For serious developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Unlimited challenges",
                    "Advanced AI feedback",
                    "Pomodoro timer",
                    "Drawing tools",
                    "Advanced search",
                    "Highlighting & annotations"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#33cc99]" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-[#0bc39c] hover:bg-[#0aa083] text-white">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-white">
                  $49
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <CardDescription className="text-gray-400">
                  For teams and organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Everything in Pro",
                    "Team management",
                    "Custom challenges",
                    "Analytics dashboard",
                    "Priority support",
                    "API access"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#33cc99]" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24  px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#33cc99] font-['Staatliches']">
            Ready to Elevate Your Coding Skills?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of developers mastering complex challenges
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#0bc39c] hover:bg-[#0aa083] text-white px-8 py-3 text-lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#33cc99] text-[#33cc99] hover:bg-[#33cc99] hover:text-black px-8 py-3 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer with original CSS styling */}
      <footer className="relative z-10 py-12 px-4">
        <div 
          className="absolute left-0 bottom-0 w-full h-[100px] border-t-[7px] border-solid"
          style={{
            borderImage: 'linear-gradient(to right, #33cc99 40%, #124dff 60%) 1',
            WebkitMask: 'var(--mask)',
            mask: 'var(--mask)',
    
            '--slope': '150px',
      
            '--mask': `radial-gradient(farthest-side, #000 99%, transparent 100%) 50% 0 / 150% calc(var(--slope) * 2) no-repeat, linear-gradient(#000, #000) 0 100% / 100% calc(100% - var(--slope)) no-repeat`,
          } as React.CSSProperties}
        />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <ZenithLogo />
              <span className="text-xl font-bold text-[#33cc99]">ZENITH</span>
            </div>

            <div className="flex items-center gap-6">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[#33cc99] cursor-pointer transition-colors" />
              <MessageCircle className="w-5 h-5 text-gray-400 hover:text-[#33cc99] cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#33cc99] cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="text-center text-gray-400">
            <p>&copy; 2024 Zenith. All rights reserved. Future-proof your coding skills.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}