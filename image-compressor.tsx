"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { compressImage } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, ImageIcon, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [compressionLevel, setCompressionLevel] = useState<number>(75)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setOriginalSize(file.size)
    setCompressedImage(null)
    setCompressedSize(0)
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
      setOriginalImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCompression = async () => {
    if (!originalImage) return

    setIsCompressing(true)
    try {
      const result = await compressImage(originalImage, compressionLevel)
      setCompressedImage(result.compressedImage)
      setCompressedSize(result.compressedSize)
    } catch (error) {
      console.error("Error compressing image:", error)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedImage) return

    const link = document.createElement("a")
    link.href = compressedImage
    link.download = `compressed-${fileName}`
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

  const calculateSavings = (): string => {
    if (originalSize === 0 || compressedSize === 0) return "0%"
    const savings = ((originalSize - compressedSize) / originalSize) * 100
    return savings.toFixed(1) + "%"
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8 overflow-hidden border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-12 cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300"
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
              Drag and drop your image or click to browse. We support JPG, PNG, and WebP formats up to 10MB.
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
                  <p className="text-xs text-muted-foreground">{fileName}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Compressed Image</h3>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/50">
                  {compressedImage ? (
                    <Image
                      src={compressedImage || "/placeholder.svg"}
                      alt="Compressed image"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isCompressing ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2"></div>
                          <p className="text-muted-foreground">Optimizing your image...</p>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <p className="text-muted-foreground mb-2">Compression preview</p>
                          <Button variant="outline" size="sm" onClick={handleCompression} disabled={!originalImage}>
                            Generate Preview
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {compressedSize > 0 ? `Size: ${formatSize(compressedSize)}` : "Size: -"}
                  </p>
                  {compressedSize > 0 && (
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {calculateSavings()} saved
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <span>Compression Level:</span>
                    <span className="text-lg font-bold text-primary">{compressionLevel}%</span>
                  </label>
                  <span className="text-sm px-3 py-1 rounded-full bg-muted">
                    {compressionLevel < 30 ? "High Compression" : compressionLevel < 70 ? "Balanced" : "High Quality"}
                  </span>
                </div>
                <Slider
                  value={[compressionLevel]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setCompressionLevel(value[0])}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Smaller File</span>
                  <span>Better Quality</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleCompression}
                  disabled={!originalImage || isCompressing}
                  size="lg"
                  className="w-full"
                >
                  {isCompressing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Compress Image
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!compressedImage}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {compressedImage && (
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Compression Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Your image has been successfully compressed with the following results:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Original Size</p>
                      <p className="text-lg font-bold">{formatSize(originalSize)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Compressed Size</p>
                      <p className="text-lg font-bold">{formatSize(compressedSize)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Reduction</p>
                      <p className="text-lg font-bold text-primary">{calculateSavings()}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Quality Level</p>
                      <p className="text-lg font-bold">{compressionLevel}%</p>
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

