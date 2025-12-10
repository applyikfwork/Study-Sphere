"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, ExternalLink } from "lucide-react"

const PdfViewerDialog = dynamic(
  () => import("./pdf-viewer-dialog").then((mod) => mod.PdfViewerDialog),
  { ssr: false }
)

interface NoteCardWithViewerProps {
  id: string
  title: string
  fileUrl: string | null
  fileName?: string | null
  views?: number
  noteType: string
  noteTypeLabel: string
  Icon: React.ComponentType<{ className?: string }>
  colors: {
    bg: string
    text: string
    light: string
  }
}

export function NoteCardWithViewer({
  title,
  fileUrl,
  fileName,
  views,
  noteTypeLabel,
  Icon,
  colors,
}: NoteCardWithViewerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  return (
    <>
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.text}`} />
            </div>
            <Badge variant="secondary" className="text-xs">{noteTypeLabel}</Badge>
          </div>
          <CardTitle className="text-base sm:text-lg mt-3 sm:mt-4 line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            {views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{views} views</span>
              </div>
            )}
            {fileName && (
              <span className="truncate max-w-[150px] text-xs">{fileName}</span>
            )}
          </div>
          {fileUrl ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-1 gap-2 text-sm"
                variant="outline"
                onClick={() => setIsViewerOpen(true)}
              >
                <Eye className="h-4 w-4" />
                View PDF
              </Button>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full gap-2 text-sm">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
            </div>
          ) : (
            <Button className="w-full gap-2 text-sm" disabled>
              <ExternalLink className="h-4 w-4" />
              Coming Soon
            </Button>
          )}
        </CardContent>
      </Card>

      {fileUrl && (
        <PdfViewerDialog
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          pdfUrl={fileUrl}
          title={title}
        />
      )}
    </>
  )
}

interface SamplePaperCardWithViewerProps {
  id: string
  title: string
  fileUrl: string | null
  solutionUrl?: string | null
  year: number
  subject: string
  colors: {
    bg: string
    text: string
    light: string
  }
}

export function SamplePaperCardWithViewer({
  title,
  fileUrl,
  solutionUrl,
  year,
  subject,
  colors,
}: SamplePaperCardWithViewerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isSolutionViewerOpen, setIsSolutionViewerOpen] = useState(false)

  return (
    <>
      <Card className="card-hover border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
              <FileText className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.text}`} />
            </div>
            <Badge>{year}</Badge>
          </div>
          <CardTitle className="text-base sm:text-lg mt-3 sm:mt-4 line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            {subject} sample paper with solutions.
          </p>
          <div className="flex flex-col gap-2">
            {fileUrl ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1 gap-2 text-sm"
                  variant="outline"
                  onClick={() => setIsViewerOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                  View PDF
                </Button>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gap-2 text-sm" variant="outline">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </a>
              </div>
            ) : (
              <Button className="w-full gap-2 text-sm" variant="outline" disabled>
                <ExternalLink className="h-4 w-4" />
                Coming Soon
              </Button>
            )}
            {solutionUrl && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1 gap-2 text-sm"
                  onClick={() => setIsSolutionViewerOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                  Solutions
                </Button>
                <a href={solutionUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {fileUrl && (
        <PdfViewerDialog
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          pdfUrl={fileUrl}
          title={title}
        />
      )}

      {solutionUrl && (
        <PdfViewerDialog
          isOpen={isSolutionViewerOpen}
          onClose={() => setIsSolutionViewerOpen(false)}
          pdfUrl={solutionUrl}
          title={`${title} - Solutions`}
        />
      )}
    </>
  )
}

interface PyqCardWithViewerProps {
  id: string
  title: string
  fileUrl: string | null
  year: number
  subject: string
  colors: {
    bg: string
    text: string
    light: string
  }
}

export function PyqCardWithViewer({
  title,
  fileUrl,
  year,
  subject,
  colors,
}: PyqCardWithViewerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  return (
    <>
      <Card className="card-hover border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
              <span className={`font-bold text-base sm:text-lg ${colors.text}`}>{year.toString().slice(-2)}</span>
            </div>
            <Badge variant="outline">{year}</Badge>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg line-clamp-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            CBSE Class 10 {subject} {year}
          </p>
          {fileUrl ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-1 gap-2 text-sm"
                variant="outline"
                onClick={() => setIsViewerOpen(true)}
              >
                <Eye className="h-4 w-4" />
                View PDF
              </Button>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full gap-2 text-sm" variant="outline">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
            </div>
          ) : (
            <Button className="w-full gap-2 text-sm" variant="outline" disabled>
              <ExternalLink className="h-4 w-4" />
              Coming Soon
            </Button>
          )}
        </CardContent>
      </Card>

      {fileUrl && (
        <PdfViewerDialog
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          pdfUrl={fileUrl}
          title={title}
        />
      )}
    </>
  )
}
