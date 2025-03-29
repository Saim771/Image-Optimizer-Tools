import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Instagram, Github } from "lucide-react"
import Link from "next/link"

export default function AuthorSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-lg">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Meet the Author</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Saim Amir is a developer and digital optimization expert with over 8 years of experience in web
              development and digital asset optimization. Connect with me on social media or reach out directly via
              WhatsApp at +923165696811.
            </p>
            <p className="text-muted-foreground mb-6">
              Passionate about creating tools that help people optimize their digital presence, Saim has developed this
              suite of tools to make optimization accessible to everyone.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="https://x.com/Arshman771?t=-aSkU-mcIgRVf_VYZL2joQ&s=09"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://www.facebook.com/saim.king.505" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link
                href="https://www.instagram.com/saim3717771?igsh=YzljYTk1ODg3Zg=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
              <Link href="https://t.me/Saiami771" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-send"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                  <span className="sr-only">Telegram</span>
                </Button>
              </Link>
              <Link href="https://tiktok.com/@saim.amir786" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M15 8v8a4 4 0 0 1-4 4" />
                    <line x1="15" y1="4" x2="15" y2="12" />
                  </svg>
                  <span className="sr-only">TikTok</span>
                </Button>
              </Link>
              <Link href="https://wa.me/923165696811" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                    <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                  </svg>
                  <span className="sr-only">WhatsApp</span>
                </Button>
              </Link>
              <Link href="https://github.com/saimamir" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
            </div>
            <Button asChild>
              <Link href="/about">Learn More About Saim</Link>
            </Button>
          </div>
          <div className="bg-muted h-full">
            <div className="relative h-full min-h-[300px] md:min-h-[400px]">
              <img
                src="/images/saim-amir.png"
                alt="Saim Amir"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

