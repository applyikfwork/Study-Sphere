"use client"

import React, { useState, useCallback, useEffect } from "react"
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
  Maximize2,
  Minimize2,
  Download,
  X,
  Loader2,
  FileText,
  RotateCcw,
  ExternalLink,
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

function getGoogleViewerUrl(url: string): string {
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`
}

export function PdfViewerDialog({
  isOpen,
  onClose,
  pdfUrl,
  title = "PDF Viewer",
}: PdfViewerDialogProps) {
  const [scale, setScale] = useState<number>(100)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerType, setViewerType] = useState<"native" | "google">("native")

  useEffect(() => {
    if (isOpen) {
      setScale(100)
      setIsLoading(true)
      setError(null)
      setViewerType("native")
    }
  }, [isOpen, pdfUrl])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false)
          }
          break
        case "+":
        case "=":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale((prev) => Math.min(prev + 25, 200))
          }
          break
        case "-":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale((prev) => Math.max(prev - 25, 50))
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFullscreen])

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    if (viewerType === "native") {
      setViewerType("google")
      setIsLoading(true)
    } else {
      setError("Failed to load PDF. Please try downloading the file.")
    }
  }, [viewerType])

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 25, 200))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 25, 50))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(100)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const handleDownload = useCallback(() => {
    window.open(pdfUrl, "_blank")
  }, [pdfUrl])

  const handleOpenInNewTab = useCallback(() => {
    const url = getProxiedUrl(pdfUrl)
    window.open(url, "_blank")
  }, [pdfUrl])

  const switchToGoogleViewer = useCallback(() => {
    setViewerType("google")
    setIsLoading(true)
    setError(null)
  }, [])

  const getViewerUrl = useCallback(() => {
    if (viewerType === "google") {
      return getGoogleViewerUrl(pdfUrl)
    }
    return getProxiedUrl(pdfUrl)
  }, [pdfUrl, viewerType])

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
              <div className="hidden sm:flex items-center gap-1 bg-white rounded-lg border px-2 py-1 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomOut}
                  disabled={scale <= 50}
                  title="Zoom out (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <button
                  className="px-2 text-sm font-medium hover:bg-gray-100 rounded min-w-[50px]"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  {scale}%
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomIn}
                  disabled={scale >= 200}
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
                onClick={handleOpenInNewTab}
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
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

        <div className="flex-1 overflow-hidden bg-gray-200 relative">
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
              <div className="text-center p-6 max-w-md">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {viewerType === "native" && (
                    <Button onClick={switchToGoogleViewer} variant="outline" className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Try Alternative Viewer
                    </Button>
                  )}
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-full overflow-auto"
              style={{
                transform: `scale(${scale / 100})`,
                transformOrigin: 'top left',
                width: `${10000 / scale}%`,
                height: `${10000 / scale}%`,
              }}
            >
              <iframe
                src={getViewerUrl()}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={title}
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-4 py-2 border-t bg-gray-50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex sm:hidden items-center gap-1 bg-white rounded-lg border px-1 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={zoomOut}
                disabled={scale <= 50}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium px-1 min-w-[40px] text-center">{scale}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={zoomIn}
                disabled={scale >= 200}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">
                {viewerType === "google" ? "Using Google Docs Viewer" : "Native PDF Viewer"}
              </span>
              {viewerType === "native" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={switchToGoogleViewer}
                  className="text-xs h-7"
                >
                  Switch Viewer
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
