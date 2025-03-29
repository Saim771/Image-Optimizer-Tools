import Link from "next/link"
import Image from "next/image"
import { Twitter, Facebook, Instagram, Github } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-muted/30 border-t mt-12 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">IO</span>
              </div>
              <div className="font-bold text-xl">ImageOptimizer</div>
            </div>
            <p className="text-muted-foreground mb-4">
              The fastest way to optimize your images and PDFs for the web. Reduce file size without losing quality.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20">
                <Image
                  src="/images/saim-profile.png"
                  alt="Saim Amir"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm">
                Created by <span className="font-medium">Saim Amir</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://x.com/Arshman771?t=-aSkU-mcIgRVf_VYZL2joQ&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://www.facebook.com/saim.king.505"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/saim3717771?igsh=YzljYTk1ODg3Zg=="
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://t.me/Saiami771"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
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
              </Link>
              <Link
                href="https://tiktok.com/@saim.amir786"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
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
              </Link>
              <Link
                href="https://wa.me/923165696811"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
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
              </Link>
              <Link
                href="https://github.com/saimamir"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools/image-compressor"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/pdf-compressor"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/image-resizer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Image Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-merger" className="text-muted-foreground hover:text-primary transition-colors">
                  PDF Merger
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/image-converter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Image Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-splitter" className="text-muted-foreground hover:text-primary transition-colors">
                  PDF Splitter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ImageOptimizer by Saim Amir. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

