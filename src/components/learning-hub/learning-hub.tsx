"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Beaker, 
  Calculator, 
  Globe, 
  BookOpen, 
  Languages, 
  FileText, 
  ClipboardList, 
  History,
  ArrowRight,
  GraduationCap
} from "lucide-react"

interface SubjectWithContent {
  id: string
  name: string
  slug: string
  description: string | null
  chaptersCount: number
  samplePapersCount: number
  pyqsCount: number
}

interface LearningHubProps {
  subjects: SubjectWithContent[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  science: Beaker,
  maths: Calculator,
  sst: Globe,
  english: BookOpen,
  hindi: Languages,
}

const colorMap: Record<string, { primary: string; light: string; gradient: string }> = {
  science: { primary: "text-green-600", light: "bg-green-50", gradient: "from-green-500 to-emerald-600" },
  maths: { primary: "text-blue-600", light: "bg-blue-50", gradient: "from-blue-500 to-indigo-600" },
  sst: { primary: "text-orange-600", light: "bg-orange-50", gradient: "from-orange-500 to-amber-600" },
  english: { primary: "text-purple-600", light: "bg-purple-50", gradient: "from-purple-500 to-violet-600" },
  hindi: { primary: "text-pink-600", light: "bg-pink-50", gradient: "from-pink-500 to-rose-600" },
}

export function LearningHub({ subjects }: LearningHubProps) {
  return (
    <div className="py-8">
      <div className="relative">
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl">
              <GraduationCap className="h-14 w-14 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md">
              <span className="font-bold text-gray-800">Class 10</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subjects.map((subject) => {
            const Icon = iconMap[subject.slug] || FileText
            const colors = colorMap[subject.slug] || colorMap.science

            return (
              <Card 
                key={subject.id} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />
                
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl ${colors.light} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${colors.primary}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Link 
                      href={`/class-10/${subject.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group/link"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Chapters & Notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {subject.chaptersCount} chapters
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    <Link 
                      href={`/sample-papers?subject=${subject.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group/link"
                    >
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Sample Papers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {subject.samplePapersCount} papers
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    <Link 
                      href={`/pyqs?subject=${subject.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group/link"
                    >
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Previous Year Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {subject.pyqsCount} papers
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  <Link 
                    href={`/class-10/${subject.slug}`}
                    className={`block w-full py-2.5 rounded-lg text-center font-medium text-white bg-gradient-to-r ${colors.gradient} hover:opacity-90 transition-opacity`}
                  >
                    View All Resources
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Link href="/notes">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">All Notes</h4>
                  <p className="text-xs text-gray-500">Browse all chapter notes</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/sample-papers">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Sample Papers</h4>
                  <p className="text-xs text-gray-500">Practice with latest papers</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/pyqs">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <History className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">PYQs</h4>
                  <p className="text-xs text-gray-500">Previous year questions</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
