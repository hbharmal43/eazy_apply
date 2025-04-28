import Link from "next/link";
import { Check } from "lucide-react";
import { NavBar } from "@/app/nav-bar";
import { Footer } from "@/app/footer";

export default function PricingPage() {
  return (
    <div className="bg-white">
      <NavBar />
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground md:w-3/4 mx-auto">
              Choose the plan that works best for your job search needs with no hidden fees or surprise charges.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="text-muted-foreground">Get started with essential features</p>
              </div>
              <div className="p-6 border-t">
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
                >
                  Get Started
                </Link>
              </div>
              <div className="p-6 border-t space-y-4">
                <h4 className="text-sm font-medium">What's included:</h4>
                <ul className="space-y-2">
                  <PricingFeature>Basic dashboard access</PricingFeature>
                  <PricingFeature>Track up to 25 applications</PricingFeature>
                  <PricingFeature>Basic application statistics</PricingFeature>
                  <PricingFeature>Community forum access</PricingFeature>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <div className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                  Most Popular
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-muted-foreground">For serious job seekers</p>
              </div>
              <div className="p-6 border-t">
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <Link
                  href="/signup?plan=pro"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
                >
                  Get Pro
                </Link>
              </div>
              <div className="p-6 border-t space-y-4">
                <h4 className="text-sm font-medium">Everything in Free, plus:</h4>
                <ul className="space-y-2">
                  <PricingFeature>Browser extension access</PricingFeature>
                  <PricingFeature>Unlimited application tracking</PricingFeature>
                  <PricingFeature>Advanced analytics and insights</PricingFeature>
                  <PricingFeature>Cold email generator</PricingFeature>
                  <PricingFeature>Resume template access</PricingFeature>
                  <PricingFeature>Email notifications & reminders</PricingFeature>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-muted-foreground">For career professionals</p>
              </div>
              <div className="p-6 border-t">
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold">$19.99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <Link
                  href="/signup?plan=premium"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
                >
                  Get Premium
                </Link>
              </div>
              <div className="p-6 border-t space-y-4">
                <h4 className="text-sm font-medium">Everything in Pro, plus:</h4>
                <ul className="space-y-2">
                  <PricingFeature>AI-powered job recommendations</PricingFeature>
                  <PricingFeature>Priority customer support</PricingFeature>
                  <PricingFeature>Interview preparation tools</PricingFeature>
                  <PricingFeature>Career coaching session (1/month)</PricingFeature>
                  <PricingFeature>Advanced customization options</PricingFeature>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Plans */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Compare Plans</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get a detailed overview of what each plan offers to find the perfect fit for your needs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-4 text-left font-medium">Feature</th>
                  <th className="p-4 text-center font-medium">Free</th>
                  <th className="p-4 text-center font-medium">Pro</th>
                  <th className="p-4 text-center font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                <TableRow feature="Application Tracking">
                  <LimitedCheck label="Up to 25" />
                  <CheckMark />
                  <CheckMark />
                </TableRow>
                <TableRow feature="Browser Extension">
                  <CrossMark />
                  <CheckMark />
                  <CheckMark />
                </TableRow>
                <TableRow feature="Analytics Dashboard">
                  <LimitedCheck label="Basic" />
                  <CheckMark />
                  <CheckMark />
                </TableRow>
                <TableRow feature="Resume Templates">
                  <CrossMark />
                  <CheckMark />
                  <CheckMark />
                </TableRow>
                <TableRow feature="AI Job Recommendations">
                  <CrossMark />
                  <CrossMark />
                  <CheckMark />
                </TableRow>
                <TableRow feature="Interview Preparation">
                  <CrossMark />
                  <CrossMark />
                  <CheckMark />
                </TableRow>
                <TableRow feature="Customer Support">
                  <LimitedCheck label="Email" />
                  <LimitedCheck label="Email & Chat" />
                  <LimitedCheck label="Priority" />
                </TableRow>
                <TableRow feature="Career Coaching">
                  <CrossMark />
                  <CrossMark />
                  <CheckMark />
                </TableRow>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our pricing and plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FAQItem 
              question="Can I switch between plans?" 
              answer="Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes will be applied to your next billing cycle." 
            />
            <FAQItem 
              question="Is there a free trial for paid plans?" 
              answer="Yes, both Pro and Premium plans come with a 14-day free trial. You won't be charged until the trial period ends." 
            />
            <FAQItem 
              question="What payment methods do you accept?" 
              answer="We accept all major credit cards, PayPal, and some regional payment methods depending on your location." 
            />
            <FAQItem 
              question="Is my data secure if I cancel my subscription?" 
              answer="Yes, your data remains secure. You'll have 30 days after cancellation to export your information before it's deleted." 
            />
            <FAQItem 
              question="Are there any hidden fees?" 
              answer="No, the price you see is the price you pay. There are no setup fees, hidden charges, or surprise costs." 
            />
            <FAQItem 
              question="Do you offer discounts for students?" 
              answer="Yes, we offer a 50% discount for verified students. Contact our support team with your student ID for verification." 
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
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add Footer */}
      <Footer />
    </div>
  );
}

// Component Helpers
interface PricingFeatureProps {
  children: React.ReactNode;
}

function PricingFeature({ children }: PricingFeatureProps) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary shrink-0" />
      <span className="text-sm">{children}</span>
    </li>
  );
}

interface TableRowProps {
  feature: string;
  children: React.ReactNode;
}

function TableRow({ feature, children }: TableRowProps) {
  return (
    <tr className="border-b">
      <td className="p-4 font-medium">{feature}</td>
      {children}
    </tr>
  );
}

function CheckMark() {
  return (
    <td className="p-4 text-center">
      <Check className="h-5 w-5 text-primary mx-auto" />
    </td>
  );
}

function CrossMark() {
  return (
    <td className="p-4 text-center">
      <div className="h-5 w-5 text-muted-foreground mx-auto">—</div>
    </td>
  );
}

interface LimitedCheckProps {
  label: string;
}

function LimitedCheck({ label }: LimitedCheckProps) {
  return (
    <td className="p-4 text-center">
      <div className="flex flex-col items-center">
        <Check className="h-5 w-5 text-primary" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </td>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
} 