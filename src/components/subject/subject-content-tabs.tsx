"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  ClipboardList, 
  History, 
  BookOpen,
  Download,
  Eye,
  ExternalLink,
  HelpCircle,
  Brain,
  CheckSquare
} from "lucide-react"

const PdfViewerDialog = dynamic(
  () => import("@/components/pdf-viewer/pdf-viewer-dialog").then((mod) => mod.PdfViewerDialog),
  { ssr: false }
)

interface Chapter {
  id: string
  chapter_number: number
  title: string
  description?: string | null
}

interface Note {
  id: string
  title: string
  file_url: string | null
  note_type: string
  views: number
  chapters?: {
    chapter_number: number
  } | null
}

interface SamplePaper {
  id: string
  title: string
  file_url: string | null
  solution_url?: string | null
  year: number
}

interface PYQ {
  id: string
  title: string
  file_url: string | null
  year: number
}

interface SubjectContentTabsProps {
  subjectSlug: string
  subjectName: string
  chapters: Chapter[]
  notes: Note[]
  samplePapers: SamplePaper[]
  pyqs: PYQ[]
  colors: {
    bg: string
    text: string
    light: string
  }
}

export function SubjectContentTabs({
  subjectSlug,
  subjectName,
  chapters,
  notes,
  samplePapers,
  pyqs,
  colors
}: SubjectContentTabsProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentPdf, setCurrentPdf] = useState<{ url: string; title: string }>({ url: "", title: "" })

  const openViewer = (url: string, title: string) => {
    setCurrentPdf({ url, title })
    setViewerOpen(true)
  }

  const notesByChapter = notes.reduce((acc, note) => {
    const chapterNum = note.chapters?.chapter_number
    if (chapterNum) {
      if (!acc[chapterNum]) acc[chapterNum] = 0
      acc[chapterNum]++
    }
    return acc
  }, {} as Record<number, number>)

  return (
    <>
      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="chapters" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Chapters</span>
            <Badge variant="secondary" className="ml-1">{chapters.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
            <Badge variant="secondary" className="ml-1">{notes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="sample-papers" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Sample Papers</span>
            <Badge variant="secondary" className="ml-1">{samplePapers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pyqs" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">PYQs</span>
            <Badge variant="secondary" className="ml-1">{pyqs.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chapters">
          {chapters.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No chapters available yet</h2>
              <p className="text-gray-500">Content is being prepared for this subject.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {chapters.map((chapter) => {
                const chapterNoteCount = notesByChapter[chapter.chapter_number] || 0
                
                return (
                  <Link key={chapter.id} href={`/class-10/${subjectSlug}/chapter-${chapter.chapter_number}`}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                            <span className={`font-bold ${colors.text}`}>{chapter.chapter_number}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              Chapter {chapter.chapter_number}: {chapter.title}
                            </h3>
                            {chapter.description && (
                              <p className="text-sm text-gray-500 mb-2">{chapter.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-3">
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                <FileText className="h-3 w-3" />
                                <span>Notes</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                <HelpCircle className="h-3 w-3" />
                                <span>Important Qs</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                <CheckSquare className="h-3 w-3" />
                                <span>MCQs</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                <Brain className="h-3 w-3" />
                                <span>Mind Map</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                <BookOpen className="h-3 w-3" />
                                <span>Summary</span>
                              </div>
                              {chapterNoteCount > 0 && (
                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                  <Download className="h-3 w-3" />
                                  <span>{chapterNoteCount} Downloads</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" className={colors.text}>
                            View Notes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes">
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No notes available yet</h2>
              <p className="text-gray-500">Check back soon for study materials!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Card key={note.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center mb-4`}>
                      <FileText className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Eye className="h-4 w-4" />
                      <span>{note.views} views</span>
                      <Badge variant="secondary">{note.note_type}</Badge>
                    </div>
                    {note.file_url ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => openViewer(note.file_url!, note.title)}
                        >
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full gap-2" variant="outline">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <Button className="w-full" disabled>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sample-papers">
          {samplePapers.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No sample papers available yet</h2>
              <p className="text-gray-500">Check back soon for practice papers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {samplePapers.map((paper) => (
                <Card key={paper.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                        <ClipboardList className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <Badge>{paper.year}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {subjectName} sample paper with solutions and marking scheme.
                    </p>
                    <div className="space-y-2">
                      {paper.file_url ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => openViewer(paper.file_url!, paper.title)}
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </Button>
                          <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button className="w-full gap-2" variant="outline">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <Button className="w-full" disabled>
                          Coming Soon
                        </Button>
                      )}
                      {paper.solution_url && (
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 gap-2"
                            onClick={() => openViewer(paper.solution_url!, `${paper.title} - Solutions`)}
                          >
                            <Eye className="h-4 w-4" />
                            View Solutions
                          </Button>
                          <a href={paper.solution_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button className="w-full gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pyqs">
          {pyqs.length === 0 ? (
            <div className="text-center py-16">
              <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No PYQs available yet</h2>
              <p className="text-gray-500">Check back soon for previous year papers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pyqs.map((pyq) => (
                <Card key={pyq.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                        <span className={`font-bold text-lg ${colors.text}`}>{pyq.year.toString().slice(-2)}</span>
                      </div>
                      <Badge variant="outline">{pyq.year}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{pyq.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      CBSE Class 10 {subjectName} {pyq.year}
                    </p>
                    {pyq.file_url ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => openViewer(pyq.file_url!, pyq.title)}
                        >
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                        <a href={pyq.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full gap-2" variant="outline">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <Button className="w-full" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {currentPdf.url && (
        <PdfViewerDialog
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          pdfUrl={currentPdf.url}
          title={currentPdf.title}
        />
      )}
    </>
  )
}
