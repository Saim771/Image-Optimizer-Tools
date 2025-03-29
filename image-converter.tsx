"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { convertImageFormat } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload, ImageIcon, FileType } from "lucide-react"
import { motion } from "framer-motion"

type ImageFormat = "jpeg" | "png" | "webp" | "avif"

export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [convertedSize, setConvertedSize] = useState<number>(0)
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("webp")
  const [quality, setQuality] = useState<number>(80)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [originalFormat, setOriginalFormat] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setOriginalSize(file.size)
    setConvertedImage(null)
    setConvertedSize(0)
    setIsUploading(true)
    setUploadProgress(0)

    // Get original format from file type
    const format = file.type.split("/")[1]
    setOriginalFormat(format)

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

  const handleConversion = async () => {
    if (!originalImage) return

    setIsConverting(true)
    try {
      const result = await convertImageFormat(originalImage, targetFormat, quality)
      setConvertedImage(result.convertedImage)
      setConvertedSize(result.convertedSize)
    } catch (error) {
      console.error("Error converting image:", error)
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedImage) return

    const fileExtension = targetFormat === "jpeg" ? "jpg" : targetFormat
    const baseFileName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName
    const newFileName = `${baseFileName}.${fileExtension}`

    const link = document.createElement("a")
    link.href = convertedImage
    link.download = newFileName
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8 overflow-hidden border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-12 cursor-pointer bg-gradient-to-br from-cyan-500/5 to-blue-500/10 hover:from-cyan-500/10 hover:to-blue-500/20 transition-all duration-300"
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
              Drag and drop your image or click to browse. We support JPG, PNG, WebP, and other common formats.
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
                  <p className="text-xs text-muted-foreground">Format: {originalFormat.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileType className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Converted Image</h3>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/50">
                  {convertedImage ? (
                    <Image
                      src={convertedImage || "/placeholder.svg"}
                      alt="Converted image"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isConverting ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2"></div>
                          <p className="text-muted-foreground">Converting your image...</p>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <p className="text-muted-foreground mb-2">Conversion preview</p>
                          <Button variant="outline" size="sm" onClick={handleConversion} disabled={!originalImage}>
                            Generate Preview
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {convertedSize > 0 ? `Size: ${formatSize(convertedSize)}` : "Size: -"}
                  </p>
                  {convertedImage && (
                    <p className="text-xs text-muted-foreground">Format: {targetFormat.toUpperCase()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6">Conversion Settings</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="format" className="text-sm font-medium">
                    Target Format
                  </label>
                  <Select value={targetFormat} onValueChange={(value) => setTargetFormat(value as ImageFormat)}>
                    <SelectTrigger id="format" className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="avif">AVIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span>Quality:</span>
                      <span className="text-lg font-bold text-primary">{quality}%</span>
                    </label>
                    <span className="text-sm px-3 py-1 rounded-full bg-muted">
                      {quality < 30 ? "Low" : quality < 70 ? "Medium" : "High"}
                    </span>
                  </div>
                  <Slider
                    value={[quality]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setQuality(value[0])}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Smaller File</span>
                    <span>Better Quality</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button
                  onClick={handleConversion}
                  disabled={!originalImage || isConverting}
                  size="lg"
                  className="w-full"
                >
                  {isConverting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileType className="mr-2 h-4 w-4" /> Convert Image
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!convertedImage}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {convertedImage && (
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <FileType className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Conversion Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Your image has been successfully converted with the following results:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Original Size</p>
                      <p className="text-lg font-bold">{formatSize(originalSize)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Converted Size</p>
                      <p className="text-lg font-bold">{formatSize(convertedSize)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">Original Format</p>
                      <p className="text-lg font-bold">{originalFormat.toUpperCase()}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground">New Format</p>
                      <p className="text-lg font-bold">{targetFormat.toUpperCase()}</p>
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

