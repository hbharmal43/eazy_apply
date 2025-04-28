"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">EazyApply</span>
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">for Students</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link
            href="/success-stories"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Success Stories
          </Link>
          <Link href="/resources" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Resources
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container px-4 py-4 flex flex-col gap-4">
            <Link
              href="/features"
              className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/success-stories"
              className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Success Stories
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signin">
                    <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

