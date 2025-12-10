"use client"

import React, { useState, useMemo } from "react"
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
  CheckSquare,
  Filter,
  ChevronDown
} from "lucide-react"

const PdfViewerDialog = dynamic(
  () => import("@/components/pdf-viewer/pdf-viewer-dialog").then((mod) => mod.PdfViewerDialog),
  { ssr: false }
)

const noteTypeConfig: Record<string, { label: string; icon: typeof FileText }> = {
  all: { label: "All Types", icon: Filter },
  notes: { label: "Notes", icon: FileText },
  important_questions: { label: "Important Questions", icon: HelpCircle },
  mcqs: { label: "MCQs", icon: CheckSquare },
  summary: { label: "Summary", icon: BookOpen },
  mind_map: { label: "Mind Map", icon: Brain },
}

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
  const [noteTypeFilter, setNoteTypeFilter] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  const availableNoteTypes = useMemo(() => {
    const types = new Set<string>()
    notes.forEach(note => {
      if (note.note_type) types.add(note.note_type)
    })
    return Array.from(types)
  }, [notes])

  const filteredNotes = useMemo(() => {
    if (noteTypeFilter === "all") return notes
    return notes.filter(note => note.note_type === noteTypeFilter)
  }, [notes, noteTypeFilter])

  const getIconForType = (type: string) => {
    const config = noteTypeConfig[type]
    return config?.icon || FileText
  }

  const getLabelForType = (type: string) => {
    const config = noteTypeConfig[type]
    return config?.label || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  return (
    <>
      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-8 h-auto p-1">
          <TabsTrigger value="chapters" className="gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm flex-col sm:flex-row">
            <BookOpen className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Chapters</span>
            <Badge variant="secondary" className="ml-0 sm:ml-1 text-xs">{chapters.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm flex-col sm:flex-row">
            <FileText className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Notes</span>
            <Badge variant="secondary" className="ml-0 sm:ml-1 text-xs">{notes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="sample-papers" className="gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm flex-col sm:flex-row">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Papers</span>
            <Badge variant="secondary" className="ml-0 sm:ml-1 text-xs">{samplePapers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pyqs" className="gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm flex-col sm:flex-row">
            <History className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">PYQs</span>
            <Badge variant="secondary" className="ml-0 sm:ml-1 text-xs">{pyqs.length}</Badge>
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
            <div className="grid gap-3 sm:gap-4">
              {chapters.map((chapter) => {
                const chapterNoteCount = notesByChapter[chapter.chapter_number] || 0
                
                return (
                  <Link key={chapter.id} href={`/class-10/${subjectSlug}/chapter-${chapter.chapter_number}`}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                            <span className={`font-bold text-sm sm:text-base ${colors.text}`}>{chapter.chapter_number}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 line-clamp-2">
                              Chapter {chapter.chapter_number}: {chapter.title}
                            </h3>
                            {chapter.description && (
                              <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{chapter.description}</p>
                            )}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                <FileText className="h-3 w-3" />
                                <span>Notes</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                <HelpCircle className="h-3 w-3" />
                                <span className="hidden xs:inline">Important</span> Qs
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                <CheckSquare className="h-3 w-3" />
                                <span>MCQs</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                <Brain className="h-3 w-3" />
                                <span className="hidden sm:inline">Mind Map</span><span className="sm:hidden">Map</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                <BookOpen className="h-3 w-3" />
                                <span>Summary</span>
                              </div>
                              {chapterNoteCount > 0 && (
                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                  <Download className="h-3 w-3" />
                                  <span>{chapterNoteCount}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" className={`${colors.text} hidden sm:flex text-sm`}>
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
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Study Materials</h3>
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                  >
                    {(() => {
                      const Icon = getIconForType(noteTypeFilter)
                      return <Icon className={`h-4 w-4 ${colors.text}`} />
                    })()}
                    <span className="text-sm font-medium">{getLabelForType(noteTypeFilter)}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute top-full left-0 right-0 sm:right-auto sm:left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
                      <div className="p-2">
                        <button
                          onClick={() => { setNoteTypeFilter("all"); setIsFilterOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${noteTypeFilter === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                        >
                          <Filter className="h-4 w-4 text-gray-500" />
                          <span>All Types</span>
                          <Badge variant="secondary" className="ml-auto">{notes.length}</Badge>
                        </button>
                        {availableNoteTypes.map(type => {
                          const Icon = getIconForType(type)
                          const count = notes.filter(n => n.note_type === type).length
                          return (
                            <button
                              key={type}
                              onClick={() => { setNoteTypeFilter(type); setIsFilterOpen(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${noteTypeFilter === type ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                            >
                              <Icon className={`h-4 w-4 ${colors.text}`} />
                              <span>{getLabelForType(type)}</span>
                              <Badge variant="secondary" className="ml-auto">{count}</Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No {getLabelForType(noteTypeFilter).toLowerCase()} available</p>
                  <Button variant="link" onClick={() => setNoteTypeFilter("all")} className="mt-2">
                    Show all types
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredNotes.map((note) => {
                    const NoteIcon = getIconForType(note.note_type)
                    return (
                      <Card key={note.id} className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center mb-3 sm:mb-4`}>
                            <NoteIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.text}`} />
                          </div>
                          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{note.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{note.views} views</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">{getLabelForType(note.note_type)}</Badge>
                          </div>
                          {note.file_url ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                className="flex-1 gap-2 text-sm"
                                onClick={() => openViewer(note.file_url!, note.title)}
                              >
                                <Eye className="h-4 w-4" />
                                View PDF
                              </Button>
                              <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button className="w-full gap-2 text-sm" variant="outline">
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                              </a>
                            </div>
                          ) : (
                            <Button className="w-full text-sm" disabled>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Coming Soon
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {samplePapers.map((paper) => (
                <Card key={paper.id} className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                        <ClipboardList className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.text}`} />
                      </div>
                      <Badge>{paper.year}</Badge>
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{paper.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      {subjectName} sample paper with solutions.
                    </p>
                    <div className="space-y-2">
                      {paper.file_url ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 gap-2 text-sm"
                            onClick={() => openViewer(paper.file_url!, paper.title)}
                          >
                            <Eye className="h-4 w-4" />
                            View PDF
                          </Button>
                          <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button className="w-full gap-2 text-sm" variant="outline">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <Button className="w-full text-sm" disabled>
                          Coming Soon
                        </Button>
                      )}
                      {paper.solution_url && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            className="flex-1 gap-2 text-sm"
                            onClick={() => openViewer(paper.solution_url!, `${paper.title} - Solutions`)}
                          >
                            <Eye className="h-4 w-4" />
                            Solutions
                          </Button>
                          <a href={paper.solution_url} target="_blank" rel="noopener noreferrer" className="flex-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pyqs.map((pyq) => (
                <Card key={pyq.id} className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                        <span className={`font-bold text-base sm:text-lg ${colors.text}`}>{pyq.year.toString().slice(-2)}</span>
                      </div>
                      <Badge variant="outline">{pyq.year}</Badge>
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{pyq.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      CBSE Class 10 {subjectName} {pyq.year}
                    </p>
                    {pyq.file_url ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2 text-sm"
                          onClick={() => openViewer(pyq.file_url!, pyq.title)}
                        >
                          <Eye className="h-4 w-4" />
                          View PDF
                        </Button>
                        <a href={pyq.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full gap-2 text-sm" variant="outline">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <Button className="w-full text-sm" disabled>
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
