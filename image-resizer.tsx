"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { resizeImage } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Upload, ImageIcon, ArrowRightIcon as ArrowsOutCardinal } from "lucide-react"
import { motion } from "framer-motion"

export default function ImageResizer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [resizedSize, setResizedSize] = useState<number>(0)
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setOriginalSize(file.size)
    setResizedImage(null)
    setResizedSize(0)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 100)

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setOriginalImage(dataUrl)

      // Get original dimensions
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const handleResize = async () => {
    if (!originalImage) return

    setIsResizing(true)
    try {
      const result = await resizeImage(originalImage, width, height, maintainAspectRatio)
      setResizedImage(result.resizedImage)
      setResizedSize(result.resizedSize)
    } catch (error) {
      console.error("Error resizing image:", error)
    } finally {
      setIsResizing(false)
    }
  }

  const handleDownload = () => {
    if (!resizedImage) return

    const link = document.createElement("a")
    link.href = resizedImage
    link.download = `resized-${fileName}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleAspectRatioChange = (checked: boolean) => {
    setMaintainAspectRatio(checked)

    if (checked && originalDimensions) {
      // Recalculate height based on width to maintain aspect ratio
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setHeight(Math.round(width / aspectRatio))
    }
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)

    if (maintainAspectRatio && originalDimensions) {
      // Recalculate height based on width to maintain aspect ratio
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)

    if (maintainAspectRatio && originalDimensions) {
      // Recalculate width based on height to maintain aspect ratio
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8 overflow-hidden border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-12 cursor-pointer bg-gradient-to-br from-green-500/5 to-emerald-500/10 hover:from-green-500/10 hover:to-emerald-500/20 transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-6"
            >
              <Upload className="h-10 w-10 text-primary" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-2">Drop your image here</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Drag and drop your image or click to browse. We support JPG, PNG, and WebP formats.
            </p>

            {isUploading && (
              <div className="w-full max-w-md mt-6">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center mt-2 text-muted-foreground">Uploading: {uploadProgress}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {originalImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <Card className="flex-1 overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Original Image</h3>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/50">
                  <Image
                    src={originalImage || "/placeholder.svg"}
                    alt="Original image"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm font-medium">Size: {formatSize(originalSize)}</p>
                  {originalDimensions && (
                    <p className="text-xs text-muted-foreground">
                      {originalDimensions.width} × {originalDimensions.height} px
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowsOutCardinal className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Resized Image</h3>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/50">
                  {resizedImage ? (
                    <Image
                      src={resizedImage || "/placeholder.svg"}
                      alt="Resized image"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isResizing ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2"></div>
                          <p className="text-muted-foreground">Resizing your image...</p>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <p className="text-muted-foreground mb-2">Resize preview</p>
                          <Button variant="outline" size="sm" onClick={handleResize} disabled={!originalImage}>
                            Generate Preview
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {resizedSize > 0 ? `Size: ${formatSize(resizedSize)}` : "Size: -"}
                  </p>
                  {resizedImage && (
                    <p className="text-xs text-muted-foreground">
                      {width} × {height} px
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6">Resize Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="width" className="text-sm font-medium">
                    Width (px)
                  </label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => handleWidthChange(Number.parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="height" className="text-sm font-medium">
                    Height (px)
                  </label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => handleHeightChange(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="aspectRatio" checked={maintainAspectRatio} onCheckedChange={handleAspectRatioChange} />
                <label
                  htmlFor="aspectRatio"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Maintain aspect ratio
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleResize} disabled={!originalImage || isResizing} size="lg" className="w-full">
                  {isResizing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Resizing...
                    </>
                  ) : (
                    <>
                      <ArrowsOutCardinal className="mr-2 h-4 w-4" /> Resize Image
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!resizedImage}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {resizedImage && (
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ArrowsOutCardinal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Resize Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Your image has been successfully resized with the following results:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Original Size</p>
                      <p className="text-lg font-bold">{formatSize(originalSize)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Resized Size</p>
                      <p className="text-lg font-bold">{formatSize(resizedSize)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Original Dimensions</p>
                      <p className="text-lg font-bold">
                        {originalDimensions?.width} × {originalDimensions?.height}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">New Dimensions</p>
                      <p className="text-lg font-bold">
                        {width} × {height}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

