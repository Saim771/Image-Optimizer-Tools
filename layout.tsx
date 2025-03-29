import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "ImageOptimizer - Fast & Easy Image & PDF Compression",
  description: "Compress and optimize your images and PDFs online without losing quality",
  keywords: "image compression, pdf optimizer, compress images, reduce image size, Saim Amir",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}



import './globals.css'