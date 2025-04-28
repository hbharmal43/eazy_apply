import { Rocket, BookOpen, Calendar, ChevronRight, Clock, User, Search, ArrowRight, Filter, Download, Mic, BookOpen as BookIcon, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/app/nav-bar";
import { Footer } from "@/app/footer";

export default function ResourcesPage() {
  return (
    <div className="bg-white">
      <NavBar />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Job Search Resources
            </h1>
            <p className="text-xl text-muted-foreground md:w-3/4 mx-auto">
              Everything you need to succeed in your job search — from resume templates to interview preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12 bg-slate-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Resource Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResourceCategory
              icon={<BookIcon className="h-6 w-6" />}
              title="Resume Templates"
              description="Professional templates optimized for ATS systems and specific industries."
              href="/resources/resume-templates"
            />
            <ResourceCategory
              icon={<GraduationCap className="h-6 w-6" />}
              title="Job Search Guides"
              description="Step-by-step guides for every stage of your job hunt."
              href="/resources/job-search-guides"
            />
            <ResourceCategory
              icon={<Mic className="h-6 w-6" />}
              title="Interview Prep"
              description="Common questions, practice exercises, and expert advice."
              href="/resources/interview-prep"
            />
            <ResourceCategory
              icon={<Briefcase className="h-6 w-6" />}
              title="Career Development"
              description="Resources for advancing your career and professional development."
              href="/resources/career-development"
            />
            <ResourceCategory
              icon={<Filter className="h-6 w-6" />}
              title="Job Board Reviews"
              description="Analysis of the best job boards for different industries."
              href="/resources/job-board-reviews"
            />
            <ResourceCategory
              icon={<Download className="h-6 w-6" />}
              title="Downloadable Tools"
              description="Spreadsheets, checklists, and templates to organize your search."
              href="/resources/downloadable-tools"
            />
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
            <Link href="/resources/articles" className="flex items-center text-primary hover:underline mt-4 md:mt-0">
              View all articles <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ArticleCard
              image="/images/placeholder.svg"
              title="How to Stand Out in a Competitive Job Market"
              excerpt="Learn actionable strategies to differentiate yourself and get noticed by hiring managers."
              author="Career Experts Team"
              date="June 15, 2023"
              readTime="8 min read"
              href="/resources/articles/stand-out-job-market"
            />
            <ArticleCard
              image="/images/placeholder.svg"
              title="Master the Virtual Interview: Tips from Hiring Managers"
              excerpt="Practical advice for acing your next video interview with confidence and professionalism."
              author="Interview Coach"
              date="May 22, 2023"
              readTime="12 min read"
              href="/resources/articles/virtual-interview-tips"
            />
            <ArticleCard
              image="/images/placeholder.svg"
              title="The Science of ATS: How to Optimize Your Resume"
              excerpt="Understand how applicant tracking systems work and ensure your resume gets past the first screening."
              author="Tech Recruitment Specialist"
              date="April 3, 2023"
              readTime="10 min read"
              href="/resources/articles/ats-resume-optimization"
            />
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Free Tools to Boost Your Job Search</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ToolCard
              icon={<Search className="h-8 w-8 text-primary" />}
              title="Resume Keyword Scanner"
              description="Upload your resume and job description to see how well they match. Get suggestions to improve your keyword optimization and beat the ATS."
              buttonText="Try It Free"
              href="/tools/resume-scanner"
            />
            <ToolCard
              icon={<Mic className="h-8 w-8 text-primary" />}
              title="Interview Question Generator"
              description="Enter a job title and company to generate likely interview questions specific to that role. Includes technical and behavioral questions."
              buttonText="Generate Questions"
              href="/tools/interview-questions"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upcoming Webinars</h2>
            <Link href="/resources/webinars" className="flex items-center text-primary hover:underline mt-4 md:mt-0">
              View all webinars <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <WebinarCard
              title="Networking in the Digital Age: Building Meaningful Connections"
              description="Learn how to build and leverage your professional network effectively, even in remote work environments."
              date="July 10, 2023"
              time="1:00 PM - 2:30 PM EST"
              host="Networking Expert & Career Coach"
              href="/resources/webinars/digital-networking"
            />
            <WebinarCard
              title="Salary Negotiation: Know Your Worth"
              description="Practical strategies to negotiate your salary with confidence and secure the compensation you deserve."
              date="July 17, 2023"
              time="12:00 PM - 1:00 PM EST"
              host="Compensation Specialist"
              href="/resources/webinars/salary-negotiation"
            />
            <WebinarCard
              title="Breaking Into Tech: A Guide for Career Changers"
              description="Discover pathways into the tech industry for professionals from non-technical backgrounds."
              date="July 24, 2023"
              time="2:00 PM - 3:30 PM EST"
              host="Senior Tech Recruiter"
              href="/resources/webinars/breaking-into-tech"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Stay Updated with Job Search Trends</h2>
              <p className="text-primary-foreground/90 text-lg">
                Subscribe to our newsletter and receive:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                  <span>Weekly job search tips and strategies</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                  <span>Exclusive resource downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                  <span>Early access to webinars and events</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                  <span>Industry insights and market trends</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" className="w-full rounded-md border border-gray-300 p-2" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" className="w-full rounded-md border border-gray-300 p-2" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="career-interest" className="text-sm font-medium text-gray-700">Primary Career Interest</label>
                  <select id="career-interest" className="w-full rounded-md border border-gray-300 p-2">
                    <option>Select an option</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 hover:bg-primary/90 transition-colors">
                  Subscribe to Newsletter
                </button>
                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. You can unsubscribe at any time. By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resource */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-slate-100 rounded-lg h-80 w-full flex items-center justify-center">
                <p className="text-slate-400 text-lg">[Resource eBook Cover]</p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">The Complete Job Seeker&apos;s Handbook</h2>
              <p className="text-muted-foreground">
                Our comprehensive 100-page guide covers every aspect of the job search process, from crafting the perfect resume to negotiating your offer. Developed by career experts with insider knowledge of what employers really look for.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Resume and cover letter templates for 10+ industries</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>200+ powerful action verbs and keyword suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Interview preparation checklists and common questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Step-by-step salary negotiation scripts</span>
                </li>
              </ul>
              <Link
                href="/resources/job-seekers-handbook"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
              >
                Download Free Copy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add Footer */}
      <Footer />
    </div>
  );
}

function ResourceCategory({ icon, title, description, href }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="p-2 bg-primary/10 rounded-md w-fit mb-4">
          {icon}
        </div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="mt-4 pt-4 border-t flex items-center text-primary text-sm font-medium mt-auto">
          Explore resources <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ image, title, excerpt, author, date, readTime, href }: {
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
        <div className="h-48 bg-slate-200 flex items-center justify-center">
          <p className="text-slate-400">[Article Image]</p>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-xl mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{excerpt}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-auto pt-4 border-t">
            <User className="h-4 w-4 mr-1" />
            <span className="mr-4">{author}</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ToolCard({ icon, title, description, buttonText, href }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link
        href={href}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
      >
        {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}

function WebinarCard({ title, description, date, time, host, href }: {
  title: string;
  description: string;
  date: string;
  time: string;
  host: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="bg-primary/10 text-primary font-medium text-sm py-1 px-3 rounded-full w-fit mb-4">
          Upcoming Webinar
        </div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
        <div className="space-y-2 mt-auto pt-4 border-t">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{host}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 