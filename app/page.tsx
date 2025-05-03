import Link from "next/link"
import Image from "next/image"
import {
  Rocket,
  Filter,
  BarChart,
  User,
  Play,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  Zap,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/app/stat-card"
import { PricingCard } from "@/app/pricing-card"
import { NavBar } from "@/app/nav-bar"
import { Footer } from "@/app/footer"
import { TestimonialCard } from "@/app/testimonial-card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NavBar />

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-xl border border-white/20 shadow-lg hover-lift">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-gradient font-medium">Made for students, by students</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="text-gradient">Land Your Dream</span>
                  <br />
                  Internship or First Job
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Apply to hundreds of student-friendly positions with one click. Focus on your studies while we handle
                  your job search.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <button className="button-primary group">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <button className="glassmorphism flex items-center justify-center gap-2 px-4 py-2 text-primary hover:text-primary/80 transition-all">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="glass-card flex items-center gap-3 p-3 hover-lift">
                  <div className="text-2xl font-bold text-gradient">10,000+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="glass-card flex items-center gap-3 p-3 hover-lift">
                  <div className="text-2xl font-bold text-gradient">500+</div>
                  <div className="text-sm text-gray-600">Universities</div>
                </div>
                <div className="glass-card flex items-center gap-3 p-3 hover-lift">
                  <div className="text-2xl font-bold text-gradient">80%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl hover-lift">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 mix-blend-overlay"></div>
                <Image
                  src="/image.png"
                  alt="EazyApply Dashboard Analytics"
                  fill
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="w-full py-12 md:py-16 bg-white/50 backdrop-blur-xl border-y border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-600 tracking-wide">TRUSTED BY STUDENTS FROM TOP UNIVERSITIES</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75">
            <div className="university-logo h-14 w-36 bg-slate-50 flex items-center justify-center rounded-md text-slate-700 font-bold text-sm hover:shadow-md transition-all border border-slate-200">MIT</div>
            <div className="university-logo h-14 w-36 bg-slate-50 flex items-center justify-center rounded-md text-slate-700 font-bold text-sm hover:shadow-md transition-all border border-slate-200">STANFORD</div>
            <div className="university-logo h-14 w-36 bg-slate-50 flex items-center justify-center rounded-md text-slate-700 font-bold text-sm hover:shadow-md transition-all border border-slate-200">HARVARD</div>
            <div className="university-logo h-14 w-36 bg-slate-50 flex items-center justify-center rounded-md text-slate-700 font-bold text-sm hover:shadow-md transition-all border border-slate-200">BERKELEY</div>
            <div className="university-logo h-14 w-36 bg-slate-50 flex items-center justify-center rounded-md text-slate-700 font-bold text-sm hover:shadow-md transition-all border border-slate-200">NYU</div>
            <div className="university-logo h-14 w-36 bg-slate-50 flex items-center justify-center rounded-md text-slate-700 font-bold text-sm hover:shadow-md transition-all border border-slate-200">UCLA</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm backdrop-blur-xl border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Simple Process</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient">
                How It Works
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Three simple steps to revolutionize your job search experience
              </p>
            </div>
          </div>
          <div className="grid gap-8 mt-16 md:grid-cols-3">
            <div className="enhanced-card p-6 text-center space-y-4">
              <div className="relative inline-block">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient text-white text-xl font-bold">
                  1
                </div>
                <div className="absolute top-0 right-0 -mr-2 -mt-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <User className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Create Your Profile</h3>
              <p className="text-gray-600">
                Upload your resume, add your skills and preferences. We'll handle the rest.
              </p>
            </div>
            <div className="enhanced-card p-6 text-center space-y-4">
              <div className="relative inline-block">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient text-white text-xl font-bold">
                  2
                </div>
                <div className="absolute top-0 right-0 -mr-2 -mt-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <Filter className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Set Your Filters</h3>
              <p className="text-gray-600">Choose job types, locations, and industries that match your career goals.</p>
            </div>
            <div className="enhanced-card p-6 text-center space-y-4">
              <div className="relative inline-block">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient text-white text-xl font-bold">
                  3
                </div>
                <div className="absolute top-0 right-0 -mr-2 -mt-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <Rocket className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Apply Automatically</h3>
              <p className="text-gray-600">
                One click applies to all matching positions. Receive updates on your applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-xl border border-white/20">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-gradient font-medium">Student-Focused Features</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <span className="text-gradient">Tools Built for Student Success</span>
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Features designed specifically for students and recent graduates
              </p>
            </div>
          </div>
          <div className="grid gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-2xl bg-gradient p-3 shadow-glow">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">One-Click Apply</h3>
                  <div className="text-sm text-accent font-medium mt-1">New Feature</div>
                </div>
              </div>
              <p className="text-gray-600">
                Apply to hundreds of internships and entry-level positions with a single click. Perfect for busy students.
              </p>
            </div>
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-2xl bg-gradient p-3 shadow-glow">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Campus Recruiting</h3>
                </div>
              </div>
              <p className="text-gray-600">
                Get notified about companies recruiting at your campus. Never miss an opportunity to connect.
              </p>
            </div>
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-2xl bg-gradient p-3 shadow-glow">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Resume Builder</h3>
                </div>
              </div>
              <p className="text-gray-600">
                Create professional resumes that highlight your academic achievements and limited work experience
                effectively.
              </p>
            </div>
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-2xl bg-gradient p-3 shadow-glow">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Deadline Reminders</h3>
                </div>
              </div>
              <p className="text-gray-600">
                Never miss application deadlines. Get timely reminders for important opportunities and follow-ups.
              </p>
            </div>
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-2xl bg-gradient p-3 shadow-glow">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Application Tracking</h3>
                </div>
              </div>
              <p className="text-gray-600">
                Track all your applications in one place. See status updates and manage follow-ups efficiently.
              </p>
            </div>
            <div className="enhanced-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-2xl bg-gradient p-3 shadow-glow">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Internship Finder</h3>
                </div>
              </div>
              <p className="text-gray-600">
                Specialized search for internships, co-ops, and entry-level positions that match your field of study.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <User className="h-4 w-4" />
              <span>Student Success Stories</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Hear From Our Students
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See how EazyApply has helped students land their dream opportunities
              </p>
            </div>
          </div>
          <div className="grid gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="EazyApply helped me land my dream internship at Google while I was still focusing on my finals. The one-click apply feature saved me countless hours!"
              name="Alex Johnson"
              role="Computer Science Student"
              university="Stanford University"
              imageSrc="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              quote="As a first-generation college student, I had no idea how to approach job hunting. EazyApply made it simple and I got 3 interview offers in my first week!"
              name="Maria Rodriguez"
              role="Business Administration"
              university="NYU"
              imageSrc="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              quote="The resume builder helped me highlight my academic projects since I had limited work experience. I secured a summer internship that turned into a full-time offer!"
              name="David Kim"
              role="Mechanical Engineering"
              university="MIT"
              imageSrc="/placeholder.svg?height=100&width=100"
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <BarChart className="h-4 w-4" />
              <span>Student Impact</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Our Impact in Numbers
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See how EazyApply is transforming the student job search experience
              </p>
            </div>
          </div>
          <div className="grid gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Student Applications"
              value="500K+"
              change="+42%"
              positive={true}
              description="Applications submitted by students"
            />
            <StatCard
              title="Interview Rate"
              value="38%"
              change="+12%"
              positive={true}
              description="Students who secured interviews"
            />
            <StatCard
              title="Study Time Saved"
              value="85K+"
              change=""
              positive={true}
              description="Hours students got back for studying"
            />
            <StatCard
              title="Campus Partners"
              value="500+"
              change="+25%"
              positive={true}
              description="Universities with active students"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <GraduationCap className="h-4 w-4" />
              <span>Student-Friendly Pricing</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Choose Your Plan
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Affordable options designed for student budgets
              </p>
            </div>
          </div>
          <div className="grid gap-6 pt-12 lg:grid-cols-3 lg:gap-8">
            <PricingCard
              title="Student Free"
              price="$0"
              description="Perfect for casual job seekers"
              features={[
                "50 applications/month",
                "Basic filtering",
                "Single profile",
                "7-day application history",
                "Resume builder",
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            <PricingCard
              title="Student Pro"
              price="$9"
              description="For serious job hunters"
              features={[
                "Unlimited applications",
                "Advanced filtering",
                "Multiple profiles",
                "Full application history",
                "Analytics dashboard",
                "Priority for campus events",
              ]}
              buttonText="Choose Pro"
              buttonVariant="default"
              popular={true}
            />
            <PricingCard
              title="Career Services"
              price="Custom"
              description="For university career centers"
              features={[
                "Bulk student accounts",
                "Admin dashboard",
                "Campus recruiting tools",
                "API access",
                "Custom integrations",
                "Dedicated support",
              ]}
              buttonText="Contact Sales"
              buttonVariant="outline"
            />
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-primary">Student Discount:</span> Verify your student status with a .edu
              email and get 50% off any paid plan!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Land Your Dream Opportunity?
              </h2>
              <p className="text-xl text-white/80">
                Join thousands of students who are saving time and getting more interviews with EazyApply.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 button-animation">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Students using EazyApply"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

