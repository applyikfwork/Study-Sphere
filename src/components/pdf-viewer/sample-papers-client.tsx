"use client"

import React from "react"
import { SamplePaperCardWithViewer } from "./content-card-with-viewer"

interface SamplePaper {
  id: string
  title: string
  file_url: string | null
  solution_url?: string | null
  year: number
  subjects?: {
    name: string
    slug: string
  } | null
}

interface SamplePapersClientProps {
  groupedPapers: Record<string, SamplePaper[]>
  getSubjectColor: (subject: string) => {
    bg: string
    text: string
    light: string
  }
}

export function SamplePapersClient({ groupedPapers, getSubjectColor }: SamplePapersClientProps) {
  return (
    <>
      {Object.entries(groupedPapers).map(([subject, papers]) => {
        const colors = getSubjectColor(subject)

        return (
          <div key={subject} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
              {subject} Sample Papers 2025
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map((paper) => (
                <SamplePaperCardWithViewer
                  key={paper.id}
                  id={paper.id}
                  title={paper.title}
                  fileUrl={paper.file_url}
                  solutionUrl={paper.solution_url}
                  year={paper.year}
                  subject={subject}
                  colors={colors}
                />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}
