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
}

const subjectColors: Record<string, { bg: string; text: string; light: string }> = {
  Science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
  Maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  Mathematics: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  SST: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  "Social Science": { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  English: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" },
  Hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
}

function getSubjectColor(subjectName: string) {
  return subjectColors[subjectName] || { bg: "bg-gray-500", text: "text-gray-600", light: "bg-gray-50" }
}

export function PyqsClient({ groupedPYQs }: PyqsClientProps) {
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
