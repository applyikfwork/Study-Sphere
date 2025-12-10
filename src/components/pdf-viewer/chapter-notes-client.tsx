"use client"

import React from "react"
import { FileText, HelpCircle, CheckSquare, BookOpen, Brain, ClipboardList, History, Lightbulb } from "lucide-react"
import { NoteCardWithViewer } from "./content-card-with-viewer"

interface Note {
  id: string
  title: string
  file_url: string | null
  file_name?: string | null
  views?: number
  note_type?: string
}

interface ChapterNotesClientProps {
  notesByType: Record<string, Note[]>
  colors: {
    bg: string
    text: string
    light: string
    gradient: string
  }
}

const noteTypeIcons: Record<string, typeof FileText> = {
  notes: FileText,
  important_questions: HelpCircle,
  mcqs: CheckSquare,
  summary: BookOpen,
  mind_map: Brain,
  sample_paper: ClipboardList,
  pyq: History,
  ncert_solutions: Lightbulb,
}

const noteTypeLabels: Record<string, string> = {
  notes: 'Notes PDF',
  important_questions: 'Important Questions',
  mcqs: 'MCQs',
  summary: 'Summary',
  mind_map: 'Mind Map',
  sample_paper: 'Sample Papers',
  pyq: 'Previous Year Questions',
  ncert_solutions: 'NCERT Solutions',
}

const noteTypeOrder = ['notes', 'important_questions', 'ncert_solutions', 'mcqs', 'summary', 'mind_map', 'sample_paper', 'pyq']

export function ChapterNotesClient({ notesByType, colors }: ChapterNotesClientProps) {
  const sortedTypes = noteTypeOrder.filter(type => notesByType[type]?.length > 0)
  const otherTypes = Object.keys(notesByType).filter(type => !noteTypeOrder.includes(type) && notesByType[type]?.length > 0)
  const allTypes = [...sortedTypes, ...otherTypes]

  return (
    <div className="space-y-8">
      {allTypes.map((type) => {
        const typeNotes = notesByType[type]
        if (!typeNotes || typeNotes.length === 0) return null
        
        const Icon = noteTypeIcons[type] || FileText
        const label = noteTypeLabels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

        return (
          <div key={type}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon className={`h-5 w-5 ${colors.text}`} />
              {label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeNotes.map((note) => (
                <NoteCardWithViewer
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  fileUrl={note.file_url}
                  fileName={note.file_name}
                  views={note.views}
                  noteType={type}
                  noteTypeLabel={label}
                  Icon={Icon}
                  colors={colors}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
