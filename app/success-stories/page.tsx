import { Star, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/app/nav-bar";
import { Footer } from "@/app/footer";

export default function SuccessStoriesPage() {
  return (
    <div className="bg-white">
      <NavBar />
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground md:w-3/4 mx-auto">
              Discover how EazyApply has helped students and job seekers land their dream positions.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Success Story */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h2 className="text-3xl font-bold">From 2 Applications a Day to 20: Sarah&apos;s Story</h2>
              <blockquote className="text-xl italic border-l-4 border-primary pl-4 py-2">
                &quot;Before EazyApply, I spent hours filling out applications. Now I can apply to multiple positions in minutes, letting me focus on interview prep and networking.&quot;
              </blockquote>
              <p className="text-muted-foreground">
                Sarah was struggling with her job search, spending countless hours filling out repetitive applications. After discovering EazyApply, she was able to streamline her process and increase her application volume tenfold. Within three weeks, she received multiple interview offers and ultimately landed a position at a Fortune 500 company.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  <p className="text-slate-500">SA</p>
                </div>
                <div>
                  <p className="font-medium">Sarah A.</p>
                  <p className="text-sm text-muted-foreground">Software Engineer at TechCorp</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-slate-100 rounded-lg h-80 w-full flex items-center justify-center">
                <p className="text-slate-400 text-lg">[Success Story Image]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Hear From Our Users</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Students and professionals from all backgrounds have accelerated their job search with EazyApply.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The browser extension is a game-changer. I applied to 15 jobs in one afternoon!"
              name="Michael T."
              role="Marketing Graduate"
              company="University of Michigan"
            />
            <TestimonialCard 
              quote="I tracked my applications meticulously with EazyApply and noticed which resume versions got the most responses."
              name="Priya S."
              role="Data Analyst"
              company="Previously: Finance Major"
            />
            <TestimonialCard 
              quote="The cold email generator helped me reach out to 5 companies that weren&apos;t even advertising positions. I got 3 interviews!"
              name="Carlos M."
              role="Business Development Associate"
              company="StartupCo"
            />
            <TestimonialCard 
              quote="As an international student, finding job opportunities was incredibly challenging. EazyApply made it so much easier to track deadlines and follow-ups."
              name="Wei L."
              role="UX Designer"
              company="DesignHub"
            />
            <TestimonialCard 
              quote="I was applying to 50+ positions a week without any system. EazyApply helped me organize my search and focus on quality applications."
              name="Jessica K."
              role="Product Manager"
              company="TechStart Inc."
            />
            <TestimonialCard 
              quote="The dashboard analytics showed me which job boards were actually resulting in interviews. Total game-changer for my search strategy."
              name="Aiden P."
              role="Financial Analyst"
              company="Global Finance Corp"
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">85%</h3>
              <p className="text-primary-foreground/80">Increase in application volume</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">68%</h3>
              <p className="text-primary-foreground/80">Higher interview rate</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">15hrs</h3>
              <p className="text-primary-foreground/80">Saved per week on average</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">91%</h3>
              <p className="text-primary-foreground/80">User satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Video Success Stories</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Watch how EazyApply has transformed the job search for recent graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-100 rounded-lg flex items-center justify-center h-72">
              <p className="text-slate-400 text-lg">[Video Testimonial 1]</p>
            </div>
            <div className="bg-slate-100 rounded-lg flex items-center justify-center h-72">
              <p className="text-slate-400 text-lg">[Video Testimonial 2]</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            Join Our Success Stories
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Start your journey to career success with EazyApply today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
            >
              Get Started Free
            </Link>
            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add Footer */}
      <Footer />
    </div>
  );
}

function TestimonialCard({ quote, name, role, company }: { 
  quote: string;
  name: string;
  role: string;
  company: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow space-y-4">
      <Quote className="h-8 w-8 text-primary/20" />
      <p className="italic">{quote}</p>
      <div className="flex items-center gap-4 pt-4 border-t">
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          <p className="text-slate-500">{name.split(' ')[0][0]}{name.split(' ')[1][0]}</p>
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
} 