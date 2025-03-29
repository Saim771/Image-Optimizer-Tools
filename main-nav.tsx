"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { Facebook, Twitter, Instagram, ChevronDown, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Tools" },
    {
      href: "#",
      label: "Customize",
      dropdown: [
        { href: "/themes", label: "Themes" },
        { href: "/plugins", label: "Plugins" },
      ],
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          if (item.dropdown) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.dropdown.map((dropdownItem) => (
                    <DropdownMenuItem key={dropdownItem.href} asChild>
                      <Link
                        href={dropdownItem.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          pathname === dropdownItem.href ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {dropdownItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <button className="p-2">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">IO</span>
                </div>
                <div className="font-bold text-xl">ImageOptimizer</div>
              </Link>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                if (item.dropdown) {
                  return (
                    <div key={item.label} className="space-y-3">
                      <div className="font-medium text-lg">{item.label}</div>
                      <div className="ml-4 flex flex-col gap-3">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className={cn(
                              "text-sm transition-colors hover:text-primary",
                              pathname === dropdownItem.href ? "text-primary font-medium" : "text-muted-foreground",
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 space-y-4">
              <div className="font-medium text-lg">Theme</div>
              <div className="flex items-center gap-4">
                <ThemeSelector />
                <ThemeToggle />
              </div>
            </div>

            <div className="mt-6">
              <div className="font-medium text-lg mb-4">Follow Us</div>
              <div className="flex gap-4">
                <Link
                  href="https://x.com/Arshman771?t=-aSkU-mcIgRVf_VYZL2joQ&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.facebook.com/saim.king.505"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/saim3717771?igsh=YzljYTk1ODg3Zg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export function SocialLinks() {
  return (
    <div className="hidden lg:flex items-center gap-2 ml-4">
      <Link
        href="https://x.com/Arshman771?t=-aSkU-mcIgRVf_VYZL2joQ&s=09"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Twitter className="h-4 w-4" />
      </Link>
      <Link
        href="https://www.facebook.com/saim.king.505"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Facebook className="h-4 w-4" />
      </Link>
      <Link
        href="https://www.instagram.com/saim3717771?igsh=YzljYTk1ODg3Zg=="
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Instagram className="h-4 w-4" />
      </Link>
    </div>
  )
}

