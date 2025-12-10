"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
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
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfViewerDialogProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

function getGoogleDocsViewerUrl(url: string): string {
  const fullUrl = url.startsWith('http') ? url : `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`
  return `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`
}

function getMicrosoftViewerUrl(url: string): string {
  const fullUrl = url.startsWith('http') ? url : `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`
}

export function PdfViewerDialog({
  isOpen,
  onClose,
  pdfUrl,
  title = "PDF Viewer",
}: PdfViewerDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<boolean>(false)
  const [viewerIndex, setViewerIndex] = useState<number>(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const viewers = [
    { name: "Google Docs", getUrl: getGoogleDocsViewerUrl },
    { name: "Microsoft", getUrl: getMicrosoftViewerUrl },
    { name: "Direct", getUrl: (url: string) => url },
  ]

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setLoadError(false)
      setViewerIndex(0)
      
      loadTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    }
    
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [isOpen, pdfUrl])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFullscreen])

  const handleIframeLoad = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }
    setIsLoading(false)
    setLoadError(false)
  }, [])

  const handleRetry = useCallback(() => {
    const nextIndex = (viewerIndex + 1) % viewers.length
    setViewerIndex(nextIndex)
    setIsLoading(true)
    setLoadError(false)
    
    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [viewerIndex, viewers.length])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.target = '_blank'
    link.download = title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [pdfUrl, title])

  const handlePrint = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print()
    } else {
      window.open(pdfUrl, '_blank')
    }
  }, [pdfUrl])

  const currentViewerUrl = viewers[viewerIndex].getUrl(pdfUrl)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "flex flex-col p-0 gap-0 overflow-hidden border-0 shadow-2xl",
          isFullscreen
            ? "fixed inset-0 max-w-none w-screen h-screen rounded-none translate-x-0 translate-y-0 left-0 top-0 z-[100]"
            : "max-w-[95vw] w-full md:max-w-6xl lg:max-w-7xl h-[95vh] md:h-[90vh] rounded-xl"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="text-sm md:text-base font-medium truncate max-w-[200px] md:max-w-[400px]">
              {title}
            </h2>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              onClick={handlePrint}
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>

            <div className="w-px h-5 bg-white/20 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
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
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">Loading PDF...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
                </div>
              </div>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center p-8 max-w-md">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Unable to load PDF
                </h3>
                <p className="text-gray-600 mb-6">
                  The PDF couldn't be displayed. Try downloading it instead.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleRetry} variant="outline" className="gap-2">
                    <RotateCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={currentViewerUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title={title}
              allow="autoplay"
              style={{ background: '#f5f5f5' }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
