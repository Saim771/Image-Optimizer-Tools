"use client"

import type React from "react"

import { useState, useRef } from "react"
import { mergePdfs } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, FileText, FilePlus2, X } from "lucide-react"
import { motion } from "framer-motion"

type PdfFile = {
  name: string
  size: number
  dataUrl: string
}

export default function PdfMerger() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([])
  const [mergedPdf, setMergedPdf] = useState<string | null>(null)
  const [mergedSize, setMergedSize] = useState<number>(0)
  const [isMerging, setIsMerging] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

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

    // Process each file
    const newPdfFiles: PdfFile[] = []
    let filesProcessed = 0

    Array.from(files).forEach((file) => {
      if (file.type !== "application/pdf") return

      const reader = new FileReader()
      reader.onload = (event) => {
        newPdfFiles.push({
          name: file.name,
          size: file.size,
          dataUrl: event.target?.result as string,
        })

        filesProcessed++
        if (filesProcessed === files.length) {
          setPdfFiles((prev) => [...prev, ...newPdfFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveFile = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index))
    setMergedPdf(null)
    setMergedSize(0)
  }

  const handleMerge = async () => {
    if (pdfFiles.length < 2) return

    setIsMerging(true)
    try {
      const result = await mergePdfs(pdfFiles.map((file) => file.dataUrl))
      setMergedPdf(result.mergedPdf)
      setMergedSize(result.mergedSize)
    } catch (error) {
      console.error("Error merging PDFs:", error)
    } finally {
      setIsMerging(false)
    }
  }

  const handleDownload = () => {
    if (!mergedPdf) return

    const link = document.createElement("a")
    link.href = mergedPdf
    link.download = "merged-document.pdf"
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

  const getTotalSize = (): number => {
    return pdfFiles.reduce((total, file) => total + file.size, 0)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8 overflow-hidden border-border/50 shadow-lg">
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-12 cursor-pointer bg-gradient-to-br from-purple-500/5 to-pink-500/10 hover:from-purple-500/10 hover:to-pink-500/20 transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              multiple
              className="hidden"
            />

            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-6"
            >
              <Upload className="h-10 w-10 text-primary" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-2">Add PDF files</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select multiple PDF files to merge them into a single document. You can also drag and drop files here.
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

      {pdfFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Card className="border-border/50 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Selected PDF Files</h3>
                <p className="text-sm text-muted-foreground">
                  Total: {pdfFiles.length} files ({formatSize(getTotalSize())})
                </p>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {pdfFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[200px] md:max-w-[300px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" /> Add More Files
                </Button>
                <Button onClick={handleMerge} disabled={pdfFiles.length < 2 || isMerging} className="flex-1">
                  {isMerging ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Merging...
                    </>
                  ) : (
                    <>
                      <FilePlus2 className="mr-2 h-4 w-4" /> Merge PDFs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {mergedPdf && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="border-border/50 shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FilePlus2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Merged PDF</h3>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-6 text-center border border-border/50">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium mb-1">merged-document.pdf</p>
                    <p className="text-sm text-muted-foreground mb-4">{formatSize(mergedSize)}</p>
                    <Button onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" /> Download Merged PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <FilePlus2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Merge Results</h3>
                    <p className="text-muted-foreground mb-4">
                      Your PDFs have been successfully merged into a single document:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground">Files Merged</p>
                        <p className="text-lg font-bold">{pdfFiles.length}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground">Total Input Size</p>
                        <p className="text-lg font-bold">{formatSize(getTotalSize())}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground">Output Size</p>
                        <p className="text-lg font-bold">{formatSize(mergedSize)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

