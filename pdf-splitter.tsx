"use client"

import type React from "react"

import { useState, useRef } from "react"
import { splitPdf } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Download, Upload, FileText, Scissors, Plus, Trash } from "lucide-react"
import { motion } from "framer-motion"

type PageRange = {
  id: string
  start: number
  end: number
}

type SplitPdf = {
  pdf: string
  size: number
}

export default function PdfSplitter() {
  const [originalPdf, setOriginalPdf] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [fileName, setFileName] = useState<string>("")
  const [pageCount, setPageCount] = useState<number>(0)
  const [pageRanges, setPageRanges] = useState<PageRange[]>([{ id: "range-1", start: 1, end: 1 }])
  const [splitPdfs, setSplitPdfs] = useState<SplitPdf[]>([])
  const [isSplitting, setIsSplitting] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file")
      return
    }

    setFileName(file.name)
    setOriginalSize(file.size)
    setSplitPdfs([])
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
      setOriginalPdf(event.target?.result as string)

      // Simulate getting page count (in a real app, you'd extract this from the PDF)
      // For demo purposes, we'll set a random page count between 5 and 20
      const simulatedPageCount = Math.floor(Math.random() * 16) + 5
      setPageCount(simulatedPageCount)

      // Update the end page of the first range to match the page count
      setPageRanges([{ id: "range-1", start: 1, end: simulatedPageCount }])
    }
    reader.readAsDataURL(file)
  }

  const addPageRange = () => {
    const newId = `range-${pageRanges.length + 1}`
    setPageRanges([...pageRanges, { id: newId, start: 1, end: pageCount }])
  }

  const removePageRange = (id: string) => {
    if (pageRanges.length === 1) return
    setPageRanges(pageRanges.filter((range) => range.id !== id))
  }

  const updatePageRange = (id: string, field: "start" | "end", value: number) => {
    setPageRanges(
      pageRanges.map((range) => {
        if (range.id === id) {
          return { ...range, [field]: value }
        }
        return range
      }),
    )
  }

  const handleSplit = async () => {
    if (!originalPdf || pageCount === 0) return

    // Validate page ranges
    const validRanges = pageRanges.filter(
      (range) => range.start <= range.end && range.start >= 1 && range.end <= pageCount,
    )

    if (validRanges.length === 0) {
      alert("Please provide valid page ranges")
      return
    }

    setIsSplitting(true)
    try {
      const result = await splitPdf(originalPdf, validRanges)
      setSplitPdfs(result.splitPdfs)
    } catch (error) {
      console.error("Error splitting PDF:", error)
    } finally {
      setIsSplitting(false)
    }
  }

  const handleDownload = (index: number) => {
    if (!splitPdfs[index]) return

    const link = document.createElement("a")
    link.href = splitPdfs[index].pdf
    link.download = `split-${index + 1}-${fileName}`
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
            className="flex flex-col items-center justify-center p-12 cursor-pointer bg-gradient-to-br from-amber-500/5 to-yellow-500/10 hover:from-amber-500/10 hover:to-yellow-500/20 transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />

            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-6"
            >
              <Upload className="h-10 w-10 text-primary" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-2">Upload a PDF to split</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select a PDF file to split into multiple documents based on page ranges.
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

      {originalPdf && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Card className="border-border/50 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Original PDF</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {pageCount} pages • {formatSize(originalSize)}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/50 mb-6">
                <p className="font-medium">{fileName}</p>
              </div>

              <h4 className="text-lg font-semibold mb-4">Define Page Ranges to Split</h4>

              <div className="space-y-4 mb-6">
                {pageRanges.map((range) => (
                  <div key={range.id} className="flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor={`start-${range.id}`} className="text-sm font-medium">
                          Start Page
                        </label>
                        <Input
                          id={`start-${range.id}`}
                          type="number"
                          min={1}
                          max={pageCount}
                          value={range.start}
                          onChange={(e) => updatePageRange(range.id, "start", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor={`end-${range.id}`} className="text-sm font-medium">
                          End Page
                        </label>
                        <Input
                          id={`end-${range.id}`}
                          type="number"
                          min={1}
                          max={pageCount}
                          value={range.end}
                          onChange={(e) => updatePageRange(range.id, "end", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePageRange(range.id)}
                      disabled={pageRanges.length === 1}
                      className="mt-6"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" onClick={addPageRange} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" /> Add Page Range
                </Button>
                <Button onClick={handleSplit} disabled={!originalPdf || isSplitting} className="flex-1">
                  {isSplitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Splitting...
                    </>
                  ) : (
                    <>
                      <Scissors className="mr-2 h-4 w-4" /> Split PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {splitPdfs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="border-border/50 shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Scissors className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Split Results</h3>
                  </div>

                  <div className="space-y-4">
                    {splitPdfs.map((pdf, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Split {index + 1} - {fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatSize(pdf.size)}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(index)}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Split Complete</h3>
                    <p className="text-muted-foreground mb-4">
                      Your PDF has been successfully split into {splitPdfs.length} separate documents.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground">Original Size</p>
                        <p className="text-lg font-bold">{formatSize(originalSize)}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground">Files Created</p>
                        <p className="text-lg font-bold">{splitPdfs.length}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground">Total Output Size</p>
                        <p className="text-lg font-bold">
                          {formatSize(splitPdfs.reduce((total, pdf) => total + pdf.size, 0))}
                        </p>
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

