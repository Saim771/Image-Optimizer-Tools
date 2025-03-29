"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { MainNav, SocialLinks } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LoginModal } from "@/components/login-modal"
import { SignupModal } from "@/components/signup-modal"
import { useState } from "react"
import Link from "next/link"
import AuthorFloatingIcon from "@/components/author-floating-icon"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { UserNav } from "@/components/user-nav"

const inter = Inter({ subsets: ["latin"] })

function HeaderActions() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      {user ? (
        <UserNav user={user} />
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)} className="hidden md:inline-flex">
            Log in
          </Button>
          <Button size="sm" onClick={() => setIsSignupOpen(true)}>
            Sign up Free
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={() => {
          setIsLoginOpen(false)
          setIsSignupOpen(true)
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => {
          setIsSignupOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </>
  )
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Script - Replace with your AdSense code */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID" crossOrigin="anonymous"></script> */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">IO</span>
                      </div>
                      <div className="font-bold text-xl">ImageOptimizer</div>
                    </Link>
                  </div>

                  <MainNav />
                  <SocialLinks />

                  <HeaderActions />
                </div>
              </header>

              <main className="flex-1">{children}</main>

              <SiteFooter />

              <AuthorFloatingIcon />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

