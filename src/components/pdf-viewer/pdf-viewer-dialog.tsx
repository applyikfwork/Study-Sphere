"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  X,
  Loader2,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfViewerDialogProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

export function PdfViewerDialog({
  isOpen,
  onClose,
  pdfUrl,
  title = "PDF Viewer",
}: PdfViewerDialogProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [workerReady, setWorkerReady] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const numPagesRef = useRef(numPages)
  const pageNumberRef = useRef(pageNumber)
  
  useEffect(() => {
    numPagesRef.current = numPages
  }, [numPages])
  
  useEffect(() => {
    pageNumberRef.current = pageNumber
  }, [pageNumber])

  useEffect(() => {
    if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
    }
    setWorkerReady(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setPageNumber(1)
      setScale(1)
      setIsLoading(true)
      setError(null)
    }
  }, [isOpen, pdfUrl])

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setContainerWidth(width)
      }
    }

    if (isOpen) {
      updateWidth()
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setPageNumber((prev) => Math.max(prev - 1, 1))
          break
        case "ArrowRight":
          setPageNumber((prev) => Math.min(prev + 1, numPagesRef.current))
          break
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false)
          }
          break
        case "+":
        case "=":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale((prev) => Math.min(prev + 0.25, 3))
          }
          break
        case "-":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale((prev) => Math.max(prev - 0.25, 0.5))
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFullscreen])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("PDF load error:", error)
    setIsLoading(false)
    setError("Failed to load PDF. Please try again or download the file.")
  }, [])

  const goToPrevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }, [numPages])

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const handleDownload = useCallback(() => {
    window.open(pdfUrl, "_blank")
  }, [pdfUrl])

  const getPageWidth = useCallback(() => {
    if (!containerWidth) return 600
    
    const padding = isFullscreen ? 40 : 60
    const maxWidth = containerWidth - padding
    
    if (isFullscreen) {
      return Math.min(maxWidth, 1200) * scale
    }
    
    return Math.min(maxWidth, 800) * scale
  }, [containerWidth, scale, isFullscreen])

  if (!workerReady) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "flex flex-col p-0 gap-0 overflow-hidden",
          isFullscreen
            ? "fixed inset-0 max-w-none w-screen h-screen rounded-none translate-x-0 translate-y-0 left-0 top-0"
            : "max-w-[95vw] w-full md:max-w-4xl lg:max-w-5xl h-[90vh] md:h-[85vh]"
        )}
      >
        <DialogHeader className="flex-shrink-0 px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <DialogTitle className="text-base md:text-lg font-semibold truncate">
                {title}
              </DialogTitle>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-white rounded-lg border px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  className="px-2 text-sm font-medium hover:bg-gray-100 rounded"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={zoomIn}
                  disabled={scale >= 3}
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDownload}
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-200 relative"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF Instead
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-4 min-h-full">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
                className="pdf-document"
              >
                <Page
                  pageNumber={pageNumber}
                  width={getPageWidth()}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={null}
                  className="shadow-lg"
                />
              </Document>
            </div>
          )}
        </div>

        {numPages > 0 && !error && (
          <div className="flex-shrink-0 px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex sm:hidden items-center gap-1 bg-white rounded-lg border px-1 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-xs font-medium px-1">{Math.round(scale * 100)}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomIn}
                  disabled={scale >= 3}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-2 md:gap-4 mx-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border">
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const page = parseInt(e.target.value)
                      if (page >= 1 && page <= numPages) {
                        setPageNumber(page)
                      }
                    }}
                    className="w-12 text-center text-sm font-medium border-none outline-none bg-transparent"
                  />
                  <span className="text-sm text-gray-500">of {numPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden sm:block w-24"></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
