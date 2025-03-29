"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Phone } from "lucide-react"

export default function AuthorFloatingIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show the floating icon after the user has scrolled a bit
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-16 right-0 mb-2 w-64 rounded-lg bg-card p-4 shadow-lg border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src="/images/saim-profile.png"
                      alt="Saim Amir"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Saim Amir</h3>
                    <p className="text-xs text-muted-foreground">Developer & Optimizer</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  Need help with optimization? Feel free to reach out!
                </p>

                <div className="flex flex-col gap-2">
                  <Link href="https://wa.me/923165696811" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      WhatsApp Chat
                    </Button>
                  </Link>
                  <Link href="https://t.me/Saiami771" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Telegram
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group relative h-14 w-14 overflow-hidden rounded-full bg-primary shadow-lg ring-2 ring-background flex items-center justify-center"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-primary-foreground" />
              ) : (
                <div className="h-full w-full overflow-hidden">
                  <Image
                    src="/images/saim-profile.png"
                    alt="Saim Amir"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <span className="absolute -bottom-10 left-0 right-0 bg-primary text-xs text-primary-foreground text-center py-1 transition-all duration-300 group-hover:bottom-0">
                Saim Amir
              </span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

