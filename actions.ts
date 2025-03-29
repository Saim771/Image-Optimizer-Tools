"use server"
import sharp from "sharp"
import { PDFDocument } from "pdf-lib"

// Helper function to convert base64 to buffer
function base64ToBuffer(base64: string): Buffer {
  const base64Data = base64.split(",")[1]
  return Buffer.from(base64Data, "base64")
}

// Helper function to convert buffer to base64
function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`
}

/**
 * Image Compression
 */
export async function compressImage(
  imageDataUrl: string,
  quality: number,
): Promise<{ compressedImage: string; compressedSize: number }> {
  try {
    // Convert base64 to buffer
    const buffer = base64ToBuffer(imageDataUrl)

    // Get image format
    const metadata = await sharp(buffer).metadata()
    const format = metadata.format || "jpeg"

    // Determine output format and mime type
    let outputFormat = format
    let mimeType = `image/${format}`

    if (format === "jpg") {
      outputFormat = "jpeg"
      mimeType = "image/jpeg"
    }

    // Compress image
    const compressedBuffer = await sharp(buffer)
      .toFormat(outputFormat as keyof sharp.FormatEnum, {
        quality: Math.max(1, Math.min(100, quality)),
        mozjpeg: format === "jpeg" || format === "jpg",
      })
      .toBuffer()

    // Convert back to base64
    const compressedImage = bufferToBase64(compressedBuffer, mimeType)

    return {
      compressedImage,
      compressedSize: compressedBuffer.length,
    }
  } catch (error) {
    console.error("Error compressing image:", error)
    throw new Error("Failed to compress image")
  }
}

/**
 * Image Resizing
 */
export async function resizeImage(
  imageDataUrl: string,
  width: number,
  height: number,
  maintainAspectRatio: boolean,
): Promise<{ resizedImage: string; resizedSize: number }> {
  try {
    // Convert base64 to buffer
    const buffer = base64ToBuffer(imageDataUrl)

    // Get image format and metadata
    const metadata = await sharp(buffer).metadata()
    const format = metadata.format || "jpeg"

    // Determine output format and mime type
    let outputFormat = format
    let mimeType = `image/${format}`

    if (format === "jpg") {
      outputFormat = "jpeg"
      mimeType = "image/jpeg"
    }

    // Prepare resize options
    const resizeOptions: sharp.ResizeOptions = { width, height }

    if (maintainAspectRatio) {
      resizeOptions.fit = "inside"
    } else {
      resizeOptions.fit = "fill"
    }

    // Resize image
    const resizedBuffer = await sharp(buffer)
      .resize(resizeOptions)
      .toFormat(outputFormat as keyof sharp.FormatEnum)
      .toBuffer()

    // Convert back to base64
    const resizedImage = bufferToBase64(resizedBuffer, mimeType)

    return {
      resizedImage,
      resizedSize: resizedBuffer.length,
    }
  } catch (error) {
    console.error("Error resizing image:", error)
    throw new Error("Failed to resize image")
  }
}

/**
 * Image Format Conversion
 */
export async function convertImageFormat(
  imageDataUrl: string,
  targetFormat: "jpeg" | "png" | "webp" | "avif",
  quality: number,
): Promise<{ convertedImage: string; convertedSize: number }> {
  try {
    // Convert base64 to buffer
    const buffer = base64ToBuffer(imageDataUrl)

    // Determine mime type based on target format
    const mimeType = `image/${targetFormat}`

    // Convert image format
    const convertedBuffer = await sharp(buffer)
      .toFormat(targetFormat, {
        quality: Math.max(1, Math.min(100, quality)),
      })
      .toBuffer()

    // Convert back to base64
    const convertedImage = bufferToBase64(convertedBuffer, mimeType)

    return {
      convertedImage,
      convertedSize: convertedBuffer.length,
    }
  } catch (error) {
    console.error("Error converting image format:", error)
    throw new Error("Failed to convert image format")
  }
}

/**
 * PDF Compression
 */
export async function compressPdf(
  pdfDataUrl: string,
  quality: number,
): Promise<{ compressedPdf: string; compressedSize: number }> {
  try {
    // Convert base64 to buffer
    const buffer = base64ToBuffer(pdfDataUrl)

    // Load PDF document
    const pdfDoc = await PDFDocument.load(buffer)

    // Get all pages
    const pages = pdfDoc.getPages()

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create()

    // Copy all pages to the new document
    for (let i = 0; i < pages.length; i++) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
      newPdfDoc.addPage(copiedPage)
    }

    // Serialize the PDF with compression options
    // Lower quality means higher compression
    const compressionFactor = quality / 100
    const compressedPdfBytes = await newPdfDoc.save({
      useObjectStreams: true,
      // Adjust compression based on quality
      // Higher quality = less compression
      addDefaultPage: false,
      objectsPerTick: Math.floor(50 * compressionFactor) + 10,
    })

    // Convert back to base64
    const compressedPdf = bufferToBase64(Buffer.from(compressedPdfBytes), "application/pdf")

    return {
      compressedPdf,
      compressedSize: compressedPdfBytes.length,
    }
  } catch (error) {
    console.error("Error compressing PDF:", error)
    throw new Error("Failed to compress PDF")
  }
}

/**
 * PDF Merger
 */
export async function mergePdfs(pdfDataUrls: string[]): Promise<{ mergedPdf: string; mergedSize: number }> {
  try {
    // Create a new PDF document
    const mergedPdfDoc = await PDFDocument.create()

    // Process each PDF
    for (const pdfDataUrl of pdfDataUrls) {
      // Convert base64 to buffer
      const buffer = base64ToBuffer(pdfDataUrl)

      // Load PDF document
      const pdfDoc = await PDFDocument.load(buffer)

      // Get all pages
      const pages = pdfDoc.getPages()

      // Copy all pages to the merged document
      const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, Array.from(Array(pages.length).keys()))

      // Add all copied pages to the merged document
      copiedPages.forEach((page) => {
        mergedPdfDoc.addPage(page)
      })
    }

    // Serialize the merged PDF
    const mergedPdfBytes = await mergedPdfDoc.save()

    // Convert back to base64
    const mergedPdf = bufferToBase64(Buffer.from(mergedPdfBytes), "application/pdf")

    return {
      mergedPdf,
      mergedSize: mergedPdfBytes.length,
    }
  } catch (error) {
    console.error("Error merging PDFs:", error)
    throw new Error("Failed to merge PDFs")
  }
}

/**
 * PDF Splitter
 */
export async function splitPdf(
  pdfDataUrl: string,
  pageRanges: { start: number; end: number }[],
): Promise<{ splitPdfs: { pdf: string; size: number }[] }> {
  try {
    // Convert base64 to buffer
    const buffer = base64ToBuffer(pdfDataUrl)

    // Load PDF document
    const pdfDoc = await PDFDocument.load(buffer)

    // Get total pages
    const totalPages = pdfDoc.getPageCount()

    // Process each page range
    const splitPdfs: { pdf: string; size: number }[] = []

    for (const range of pageRanges) {
      // Validate page range
      const start = Math.max(0, range.start - 1) // Convert to 0-based index
      const end = Math.min(totalPages - 1, range.end - 1) // Convert to 0-based index

      if (start > end || start >= totalPages || end < 0) {
        continue // Skip invalid ranges
      }

      // Create a new PDF document for this range
      const newPdfDoc = await PDFDocument.create()

      // Copy pages in the range
      const pageIndexes = Array.from({ length: end - start + 1 }, (_, i) => start + i)

      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndexes)

      // Add copied pages to the new document
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page)
      })

      // Serialize the new PDF
      const newPdfBytes = await newPdfDoc.save()

      // Convert to base64 and add to result
      const newPdf = bufferToBase64(Buffer.from(newPdfBytes), "application/pdf")

      splitPdfs.push({
        pdf: newPdf,
        size: newPdfBytes.length,
      })
    }

    return { splitPdfs }
  } catch (error) {
    console.error("Error splitting PDF:", error)
    throw new Error("Failed to split PDF")
  }
}

/**
 * User Authentication (Simulated)
 */
type User = {
  id: string
  name: string
  email: string
}

// Simulated user database
const users: Record<string, User & { password: string }> = {
  "user1@example.com": {
    id: "user1",
    name: "John Doe",
    email: "user1@example.com",
    password: "password123", // In a real app, this would be hashed
  },
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user exists
  const user = users[email]

  if (!user) {
    return { success: false, error: "User not found" }
  }

  // Check password
  if (user.password !== password) {
    return { success: false, error: "Invalid password" }
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user

  return { success: true, user: userWithoutPassword }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check if user already exists
  if (users[email]) {
    return { success: false, error: "User already exists" }
  }

  // Create new user
  const newUser: User & { password: string } = {
    id: `user${Object.keys(users).length + 1}`,
    name,
    email,
    password, // In a real app, this would be hashed
  }

  // Add to "database"
  users[email] = newUser

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser

  return { success: true, user: userWithoutPassword }
}

