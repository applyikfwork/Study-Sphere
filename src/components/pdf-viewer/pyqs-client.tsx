"use client"

import React from "react"
import { PyqCardWithViewer } from "./content-card-with-viewer"

interface Pyq {
  id: string
  title: string
  file_url: string | null
  year: number
  subjects?: {
    name: string
    slug: string
  } | null
}

interface PyqsClientProps {
  groupedPYQs: Record<string, Pyq[]>
  getSubjectColor: (subject: string) => {
    bg: string
    text: string
    light: string
  }
}

export function PyqsClient({ groupedPYQs, getSubjectColor }: PyqsClientProps) {
  return (
    <>
      {Object.entries(groupedPYQs).map(([subject, papers]) => {
        const colors = getSubjectColor(subject)

        return (
          <div key={subject} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
              {subject} Previous Year Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {papers.map((paper) => (
                <PyqCardWithViewer
                  key={paper.id}
                  id={paper.id}
                  title={paper.title}
                  fileUrl={paper.file_url}
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
