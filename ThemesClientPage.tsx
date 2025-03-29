"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Palette, Moon, Sun, Sparkles } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { toast } from "@/hooks/use-toast"

// Sample themes data
const themes = [
  {
    id: "default",
    name: "Default Blue",
    description: "The classic ImageOptimizer theme with a clean blue color scheme.",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    colors: [
      { name: "Primary", value: "hsl(221.2 83.2% 53.3%)" },
      { name: "Background", value: "hsl(0 0% 100%)" },
      { name: "Card", value: "hsl(0 0% 100%)" },
      { name: "Muted", value: "hsl(210 40% 96.1%)" },
    ],
    popular: true,
    image: "/placeholder.svg?height=300&width=600&text=Default+Blue+Theme",
  },
  {
    id: "purple",
    name: "Royal Purple",
    description: "A rich purple theme that gives your workspace a creative feel.",
    primaryColor: "hsl(270 95% 60%)",
    colors: [
      { name: "Primary", value: "hsl(270 95% 60%)" },
      { name: "Background", value: "hsl(0 0% 100%)" },
      { name: "Card", value: "hsl(0 0% 100%)" },
      { name: "Muted", value: "hsl(210 40% 96.1%)" },
    ],
    popular: false,
    image: "/placeholder.svg?height=300&width=600&text=Purple+Theme",
  },
  {
    id: "green",
    name: "Forest Green",
    description: "A calming green theme inspired by nature and productivity.",
    primaryColor: "hsl(142.1 76.2% 36.3%)",
    colors: [
      { name: "Primary", value: "hsl(142.1 76.2% 36.3%)" },
      { name: "Background", value: "hsl(0 0% 100%)" },
      { name: "Card", value: "hsl(0 0% 100%)" },
      { name: "Muted", value: "hsl(210 40% 96.1%)" },
    ],
    popular: false,
    image: "/placeholder.svg?height=300&width=600&text=Green+Theme",
  },
  {
    id: "orange",
    name: "Sunset Orange",
    description: "A warm and energetic theme that brings vibrancy to your work.",
    primaryColor: "hsl(24.6 95% 53.1%)",
    colors: [
      { name: "Primary", value: "hsl(24.6 95% 53.1%)" },
      { name: "Background", value: "hsl(0 0% 100%)" },
      { name: "Card", value: "hsl(0 0% 100%)" },
      { name: "Muted", value: "hsl(210 40% 96.1%)" },
    ],
    popular: true,
    image: "/placeholder.svg?height=300&width=600&text=Orange+Theme",
  },
  {
    id: "rose",
    name: "Rose Pink",
    description: "A soft and elegant theme with a modern pink accent.",
    primaryColor: "hsl(346.8 77.2% 49.8%)",
    colors: [
      { name: "Primary", value: "hsl(346.8 77.2% 49.8%)" },
      { name: "Background", value: "hsl(0 0% 100%)" },
      { name: "Card", value: "hsl(0 0% 100%)" },
      { name: "Muted", value: "hsl(210 40% 96.1%)" },
    ],
    popular: false,
    image: "/placeholder.svg?height=300&width=600&text=Rose+Theme",
  },
  {
    id: "custom",
    name: "Custom Theme",
    description: "Create your own custom theme with your preferred colors.",
    primaryColor: "linear-gradient(to right, #ff0080, #7928ca, #0070f3)",
    colors: [
      { name: "Primary", value: "Custom" },
      { name: "Background", value: "Custom" },
      { name: "Card", value: "Custom" },
      { name: "Muted", value: "Custom" },
    ],
    popular: false,
    isCustom: true,
    image: "/placeholder.svg?height=300&width=600&text=Custom+Theme",
  },
]

export default function ThemesClientPage() {
  const { setTheme: setColorMode, theme: currentColorMode } = useTheme()
  const [currentTheme, setCurrentTheme] = useState("default")
  const [colorMode, setColorModeState] = useState("light")

  useEffect(() => {
    // Get the saved theme from localStorage on component mount
    const savedTheme = localStorage.getItem("color-theme") || "default"
    setCurrentTheme(savedTheme)

    // Get the current color mode
    setColorModeState(currentColorMode || "light")
  }, [currentColorMode])

  const applyTheme = (themeId: string) => {
    // Set the theme in localStorage
    localStorage.setItem("color-theme", themeId)

    // Update the document with the theme class
    document.documentElement.classList.remove(
      "theme-default",
      "theme-purple",
      "theme-green",
      "theme-orange",
      "theme-rose",
    )
    document.documentElement.classList.add(`theme-${themeId}`)

    // Update state
    setCurrentTheme(themeId)

    // Show toast notification
    toast({
      title: "Theme updated",
      description: `The ${themes.find((t) => t.id === themeId)?.name} theme has been applied.`,
    })
  }

  const toggleColorMode = (mode: string) => {
    setColorMode(mode)
    setColorModeState(mode)

    toast({
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode activated`,
      description: `The application is now in ${mode} mode.`,
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold mb-4">Customize Your Experience</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Choose from our collection of beautiful themes or create your own to personalize your workspace.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full">
                  <Palette className="mr-2 h-5 w-5" /> Browse Themes
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="/pricing">Create Custom Theme</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative h-64 w-full">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Theme+Customization"
                  alt="Theme Customization"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-primary/20 rounded-full backdrop-blur-xl"></div>
                <div className="absolute -top-4 -left-4 h-16 w-16 bg-primary/20 rounded-full backdrop-blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Themes */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Themes</h2>
          <Link href="#all-themes" className="text-primary hover:underline flex items-center">
            View all themes <Sparkles className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes
            .filter((theme) => theme.popular)
            .slice(0, 3)
            .map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                featured
                current={currentTheme === theme.id}
                onApply={applyTheme}
              />
            ))}
        </div>
      </section>

      {/* All Themes */}
      <section id="all-themes" className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">All Available Themes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} current={currentTheme === theme.id} onApply={applyTheme} />
          ))}
        </div>
      </section>

      {/* Dark Mode Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <div className="relative h-64 w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-background to-background/0 z-10"></div>
                    <div className="flex">
                      <div className="w-1/2 h-64 bg-white rounded-l-lg shadow-lg flex items-center justify-center">
                        <Sun className="h-16 w-16 text-yellow-500" />
                      </div>
                      <div className="w-1/2 h-64 bg-gray-900 rounded-r-lg shadow-lg flex items-center justify-center">
                        <Moon className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Dark Mode Support</h2>
              <p className="text-lg text-muted-foreground mb-8">
                All our themes support both light and dark modes. Switch between them anytime to reduce eye strain and
                save battery life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  variant={colorMode === "light" ? "default" : "outline"}
                  onClick={() => toggleColorMode("light")}
                >
                  <Sun className="mr-2 h-5 w-5" /> Light Mode
                </Button>
                <Button
                  size="lg"
                  variant={colorMode === "dark" ? "default" : "outline"}
                  onClick={() => toggleColorMode("dark")}
                >
                  <Moon className="mr-2 h-5 w-5" /> Dark Mode
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Theme Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Create Your Own Theme</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Premium users can create and save custom themes with their preferred colors and styles.
            </p>
            <Button size="lg" asChild>
              <Link href="/pricing">Upgrade to Premium</Link>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Custom+Theme+Creator"
                alt="Custom Theme Creator"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ThemeCard({
  theme,
  featured = false,
  current = false,
  onApply,
}: { theme: any; featured?: boolean; current?: boolean; onApply: (id: string) => void }) {
  return (
    <Card
      className={`overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg ${current ? "border-primary" : ""} ${featured ? "shadow-md" : ""}`}
    >
      <div className="relative h-40 overflow-hidden">
        <Image src={theme.image || "/placeholder.svg"} alt={theme.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        {theme.popular && !current && (
          <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
            Popular
          </div>
        )}
        {current && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            Current
          </div>
        )}
      </div>
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">{theme.name}</CardTitle>
        <CardDescription>{theme.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex gap-2 mb-6">
          {theme.isCustom ? (
            <div className="h-12 w-full rounded" style={{ background: theme.primaryColor }}></div>
          ) : (
            theme.colors.map((color, index) => (
              <div key={index} className="h-12 flex-1 rounded" style={{ backgroundColor: color.value }}></div>
            ))
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {theme.colors.map((color, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{color.name}:</span>
              <span className="font-mono text-xs">
                {color.value === "Custom" ? "Custom" : color.value.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {current ? (
          <Button variant="outline" className="w-full" disabled>
            <Check className="mr-2 h-4 w-4" /> Current Theme
          </Button>
        ) : theme.isCustom ? (
          <Button className="w-full" asChild>
            <Link href="/pricing">
              <Palette className="mr-2 h-4 w-4" /> Create Custom
            </Link>
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onApply(theme.id)}>
            <Palette className="mr-2 h-4 w-4" /> Apply Theme
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

