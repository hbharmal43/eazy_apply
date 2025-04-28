import Link from "next/link";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 lg:py-20 bg-slate-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">EazyApply for Students</h3>
            <p className="text-sm text-white/80">
              Helping students land internships and entry-level jobs with less effort and more success.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-white hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-white hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-white hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Internship Finder
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Student Discounts
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Campus Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Stay Updated</h3>
            <p className="text-sm text-white/80">Get the latest on internship opportunities and career tips.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your .edu email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} EazyApply for Students. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 