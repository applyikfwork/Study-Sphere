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
  BookOpen,
  File,
  LayoutGrid,
  RotateCcw,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfViewerDialogProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

function getProxiedUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('/api/')) return url
  return `/api/pdf-proxy?url=${encodeURIComponent(url)}`
}

type ViewMode = "single" | "book"

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
  const [viewMode, setViewMode] = useState<ViewMode>("single")
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false)
  const [visibleThumbnails, setVisibleThumbnails] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  
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
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
    }
    setWorkerReady(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setPageNumber(1)
      setScale(1)
      setIsLoading(true)
      setError(null)
      setVisibleThumbnails([])
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
      setTimeout(updateWidth, 100)
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }
  }, [isOpen])

  useEffect(() => {
    if (showThumbnails && numPages > 0 && thumbnailsRef.current) {
      const calculateVisibleThumbnails = () => {
        if (!thumbnailsRef.current) return
        
        const container = thumbnailsRef.current
        const scrollTop = container.scrollTop
        const containerHeight = container.clientHeight
        const itemHeight = 140
        
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2)
        const endIndex = Math.min(numPages, Math.ceil((scrollTop + containerHeight) / itemHeight) + 2)
        
        const visible: number[] = []
        for (let i = startIndex; i < endIndex; i++) {
          visible.push(i + 1)
        }
        setVisibleThumbnails(visible)
      }
      
      calculateVisibleThumbnails()
      const container = thumbnailsRef.current
      container.addEventListener("scroll", calculateVisibleThumbnails)
      return () => container.removeEventListener("scroll", calculateVisibleThumbnails)
    }
  }, [showThumbnails, numPages])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (viewMode === "book") {
            setPageNumber((prev) => Math.max(prev - 2, 1))
          } else {
            setPageNumber((prev) => Math.max(prev - 1, 1))
          }
          break
        case "ArrowRight":
          if (viewMode === "book") {
            setPageNumber((prev) => Math.min(prev + 2, numPagesRef.current))
          } else {
            setPageNumber((prev) => Math.min(prev + 1, numPagesRef.current))
          }
          break
        case "Home":
          e.preventDefault()
          setPageNumber(1)
          break
        case "End":
          e.preventDefault()
          setPageNumber(numPagesRef.current)
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
        case "b":
        case "B":
          if (!e.ctrlKey && !e.metaKey) {
            setViewMode((prev) => prev === "book" ? "single" : "book")
          }
          break
        case "t":
        case "T":
          if (!e.ctrlKey && !e.metaKey) {
            setShowThumbnails((prev) => !prev)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFullscreen, viewMode])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setError(null)
    const initialVisible: number[] = []
    for (let i = 1; i <= Math.min(10, numPages); i++) {
      initialVisible.push(i)
    }
    setVisibleThumbnails(initialVisible)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("PDF load error:", error)
    setIsLoading(false)
    setError("Failed to load PDF. Please try again or download the file.")
  }, [])

  const goToPrevPage = useCallback(() => {
    if (viewMode === "book") {
      setPageNumber((prev) => Math.max(prev - 2, 1))
    } else {
      setPageNumber((prev) => Math.max(prev - 1, 1))
    }
  }, [viewMode])

  const goToNextPage = useCallback(() => {
    if (viewMode === "book") {
      setPageNumber((prev) => Math.min(prev + 2, numPages))
    } else {
      setPageNumber((prev) => Math.min(prev + 1, numPages))
    }
  }, [numPages, viewMode])

  const goToFirstPage = useCallback(() => {
    setPageNumber(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setPageNumber(numPages)
  }, [numPages])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page)
      if (showThumbnails && window.innerWidth < 768) {
        setShowThumbnails(false)
      }
    }
  }, [numPages, showThumbnails])

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

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      if (prev === "single") return "book"
      return "single"
    })
  }, [])

  const toggleThumbnails = useCallback(() => {
    setShowThumbnails((prev) => !prev)
  }, [])

  const getPageWidth = useCallback(() => {
    if (!containerWidth) return 600
    
    const thumbnailWidth = showThumbnails ? 180 : 0
    const availableWidth = containerWidth - thumbnailWidth
    const padding = isFullscreen ? 40 : 60
    const maxWidth = availableWidth - padding
    
    if (viewMode === "book") {
      const bookPageWidth = (maxWidth - 20) / 2
      return Math.min(bookPageWidth, isFullscreen ? 600 : 450) * scale
    }
    
    if (isFullscreen) {
      return Math.min(maxWidth, 1200) * scale
    }
    
    return Math.min(maxWidth, 800) * scale
  }, [containerWidth, scale, isFullscreen, viewMode, showThumbnails])

  const getBookPages = useCallback(() => {
    if (viewMode !== "book") return [pageNumber]
    
    const leftPage = pageNumber % 2 === 0 ? pageNumber - 1 : pageNumber
    const rightPage = leftPage + 1
    
    const pages: number[] = []
    if (leftPage >= 1 && leftPage <= numPages) pages.push(leftPage)
    if (rightPage >= 1 && rightPage <= numPages) pages.push(rightPage)
    
    return pages
  }, [viewMode, pageNumber, numPages])

  const scrollToCurrentPage = useCallback(() => {
    if (thumbnailsRef.current && showThumbnails) {
      const itemHeight = 140
      const scrollPosition = (pageNumber - 1) * itemHeight - 100
      thumbnailsRef.current.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }
  }, [pageNumber, showThumbnails])

  useEffect(() => {
    scrollToCurrentPage()
  }, [pageNumber, scrollToCurrentPage])

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
            : "max-w-[95vw] w-full md:max-w-5xl lg:max-w-6xl h-[90vh] md:h-[85vh]"
        )}
      >
        <DialogHeader className="flex-shrink-0 px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <DialogTitle className="text-sm md:text-lg font-semibold truncate">
                {title}
              </DialogTitle>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="hidden md:flex items-center gap-1 bg-white rounded-lg border px-1 py-1 mr-2">
                <Button
                  variant={viewMode === "single" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("single")}
                  title="Single page view"
                >
                  <File className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "book" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("book")}
                  title="Book view (two pages)"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant={showThumbnails ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleThumbnails}
                  title="Toggle thumbnails (T)"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden sm:flex items-center gap-1 bg-white rounded-lg border px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  title="Zoom out (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  className="px-2 text-sm font-medium hover:bg-gray-100 rounded min-w-[50px]"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomIn}
                  disabled={scale >= 3}
                  title="Zoom in (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
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

        <div className="flex-1 flex overflow-hidden">
          {showThumbnails && numPages > 0 && !error && (
            <div 
              ref={thumbnailsRef}
              className="hidden md:flex flex-col w-44 border-r bg-gray-100 overflow-y-auto"
            >
              <Document
                file={getProxiedUrl(pdfUrl)}
                loading={null}
                error={null}
              >
                <div className="p-2 space-y-2">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={cn(
                        "w-full p-1 rounded-lg transition-all border-2",
                        pageNumber === pageNum || (viewMode === "book" && getBookPages().includes(pageNum))
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:border-gray-300 hover:bg-white"
                      )}
                    >
                      <div className="relative bg-white rounded shadow-sm overflow-hidden" style={{ minHeight: '120px' }}>
                        {visibleThumbnails.includes(pageNum) ? (
                          <Page
                            pageNumber={pageNum}
                            width={100}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={
                              <div className="flex items-center justify-center h-32 bg-gray-50">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                              </div>
                            }
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32 bg-gray-50">
                            <span className="text-gray-400 text-sm">{pageNum}</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
                          {pageNum}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Document>
            </div>
          )}

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
              <div className={cn(
                "flex justify-center py-4 min-h-full",
                viewMode === "book" ? "items-start" : "items-start"
              )}>
                <Document
                  file={getProxiedUrl(pdfUrl)}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={null}
                  className="pdf-document"
                >
                  {viewMode === "book" ? (
                    <div className="flex gap-1 items-start justify-center">
                      {getBookPages().map((pageNum, index) => (
                        <div
                          key={pageNum}
                          className={cn(
                            "relative bg-white",
                            index === 0 ? "shadow-[-4px_0_12px_rgba(0,0,0,0.15)]" : "shadow-[4px_0_12px_rgba(0,0,0,0.15)]"
                          )}
                        >
                          <Page
                            pageNumber={pageNum}
                            width={getPageWidth()}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            loading={null}
                          />
                          <div className="absolute bottom-2 left-0 right-0 text-center">
                            <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                              {pageNum}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Page
                      pageNumber={pageNumber}
                      width={getPageWidth()}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={null}
                      className="shadow-lg bg-white"
                    />
                  )}
                </Document>
              </div>
            )}
          </div>
        </div>

        {numPages > 0 && !error && (
          <div className="flex-shrink-0 px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex md:hidden items-center gap-1">
                <Button
                  variant={viewMode === "book" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleViewMode}
                  title="Toggle view mode"
                >
                  {viewMode === "book" ? <BookOpen className="h-4 w-4" /> : <File className="h-4 w-4" />}
                </Button>
              </div>

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
                <span className="text-xs font-medium px-1 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
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

              <div className="flex items-center gap-1 md:gap-2 mx-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hidden sm:flex"
                  onClick={goToFirstPage}
                  disabled={pageNumber <= 1}
                  title="First page (Home)"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="gap-1 h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>

                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border">
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
                    className="w-10 text-center text-sm font-medium border-none outline-none bg-transparent"
                  />
                  <span className="text-sm text-gray-500">/ {numPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={viewMode === "book" 
                    ? getBookPages()[getBookPages().length - 1] >= numPages 
                    : pageNumber >= numPages
                  }
                  className="gap-1 h-8"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hidden sm:flex"
                  onClick={goToLastPage}
                  disabled={pageNumber >= numPages}
                  title="Last page (End)"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
