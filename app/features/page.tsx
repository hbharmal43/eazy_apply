import Link from "next/link";
import { Check, Chrome, Clock, Search, Mail, Calendar, BarChart, Zap } from "lucide-react";
import { NavBar } from "@/app/nav-bar";
import { Footer } from "@/app/footer";

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      <NavBar />
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Powerful Features to Simplify Your Job Search
            </h1>
            <p className="text-xl text-muted-foreground md:w-3/4 mx-auto">
              Discover all the tools and features designed to make your job application process efficient and effective.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Chrome className="h-10 w-10 text-primary" />}
              title="Browser Extension"
              description="Apply to jobs with a single click. Our extension automatically fills applications, saving you hours of repetitive work."
            />
            <FeatureCard
              icon={<BarChart className="h-10 w-10 text-primary" />}
              title="Application Tracking"
              description="Keep track of all your applications in one place with detailed statistics and insights."
            />
            <FeatureCard
              icon={<Search className="h-10 w-10 text-primary" />}
              title="Job Discovery"
              description="Find relevant job opportunities based on your skills, experience, and preferences."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Interview Scheduler"
              description="Manage your interview schedule and never miss an important meeting."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="AI-Powered Insights"
              description="Get personalized recommendations and insights to improve your job search strategy."
            />
          </div>
        </div>
      </section>

      {/* Detailed Feature Description */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="space-y-16">
            <DetailedFeature
              title="Browser Extension"
              description="Our Chrome extension revolutionizes how you apply for jobs. With just one click, it automatically fills out application forms using your pre-saved profile information, attaches your resume, and even helps you craft personalized cover letters. Stop wasting time on repetitive data entry and focus on what matters - finding the right opportunity."
              benefits={[
                "Auto-fill job applications across multiple platforms",
                "Save multiple profile variations for different job types",
                "Track application status directly in your browser",
                "Receive notifications for application updates",
              ]}
              isReversed={false}
            />
            <DetailedFeature
              title="Application Tracking Dashboard"
              description="Keep your job search organized with our comprehensive tracking dashboard. Visualize your application progress, track response rates, and manage follow-ups all in one place. Our intuitive interface gives you a bird's eye view of your entire job search journey, helping you stay on top of opportunities and identify the most promising leads."
              benefits={[
                "Visual statistics and progress tracking",
                "Daily and weekly application metrics",
                "Follow-up reminders and scheduling",
                "Custom tagging and filtering options",
              ]}
              isReversed={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of job seekers who have simplified their application process and landed their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add Footer */}
      <Footer />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface DetailedFeatureProps {
  title: string;
  description: string;
  benefits: string[];
  isReversed: boolean;
}

function DetailedFeature({ title, description, benefits, isReversed }: DetailedFeatureProps) {
  return (
    <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
      <div className="md:w-1/2">
        <div className="bg-slate-100 rounded-lg h-80 w-full flex items-center justify-center">
          <p className="text-slate-400 text-lg">[Feature Screenshot]</p>
        </div>
      </div>
      <div className="md:w-1/2 space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 