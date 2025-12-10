'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, BookOpen, HelpCircle, Trash2, Loader2, Eye, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SavedNote {
  id: string
  contentId: string
  title: string
  subject: string
  chapter: number
  fileUrl: string | null
}

interface SavedSamplePaper {
  id: string
  contentId: string
  title: string
  subject: string
  year: number
  fileUrl: string | null
}

interface SavedPyq {
  id: string
  contentId: string
  title: string
  subject: string
  year: number
  fileUrl: string | null
}

interface SavedContentTabsProps {
  notes: SavedNote[]
  samplePapers: SavedSamplePaper[]
  pyqs: SavedPyq[]
}

type TabType = 'notes' | 'sample_papers' | 'pyqs'

export function SavedContentTabs({ notes, samplePapers, pyqs }: SavedContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('notes')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const router = useRouter()

  const tabs = [
    { id: 'notes' as TabType, label: 'Notes', count: notes.length, icon: FileText },
    { id: 'sample_papers' as TabType, label: 'Sample Papers', count: samplePapers.length, icon: BookOpen },
    { id: 'pyqs' as TabType, label: 'PYQs', count: pyqs.length, icon: HelpCircle },
  ]

  async function handleRemove(savedItemId: string) {
    setRemovingId(savedItemId)
    
    const supabase = createClient()
    if (!supabase) {
      setRemovingId(null)
      return
    }

    try {
      await supabase
        .from('saved_items')
        .delete()
        .eq('id', savedItemId)

      router.refresh()
    } catch (error) {
      console.error('Remove error:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const renderContent = () => {
    if (activeTab === 'notes') {
      if (notes.length === 0) {
        return (
          <div className="text-center py-6">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No saved notes</p>
            <Link href="/notes">
              <Button variant="link" size="sm">Browse Notes</Button>
            </Link>
          </div>
        )
      }
      return (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{note.title}</p>
                  <p className="text-sm text-gray-500">{note.subject} - Chapter {note.chapter}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline" className="hidden sm:inline-flex">{note.subject}</Badge>
                {note.fileUrl && (
                  <>
                    <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={note.fileUrl} download>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemove(note.id)}
                  disabled={removingId === note.id}
                >
                  {removingId === note.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'sample_papers') {
      if (samplePapers.length === 0) {
        return (
          <div className="text-center py-6">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No saved sample papers</p>
            <Link href="/sample-papers">
              <Button variant="link" size="sm">Browse Sample Papers</Button>
            </Link>
          </div>
        )
      }
      return (
        <div className="space-y-3">
          {samplePapers.map((paper) => (
            <div key={paper.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{paper.title}</p>
                  <p className="text-sm text-gray-500">{paper.subject} - {paper.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline" className="hidden sm:inline-flex">{paper.year}</Badge>
                {paper.fileUrl && (
                  <>
                    <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={paper.fileUrl} download>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemove(paper.id)}
                  disabled={removingId === paper.id}
                >
                  {removingId === paper.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'pyqs') {
      if (pyqs.length === 0) {
        return (
          <div className="text-center py-6">
            <HelpCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No saved PYQs</p>
            <Link href="/pyqs">
              <Button variant="link" size="sm">Browse PYQs</Button>
            </Link>
          </div>
        )
      }
      return (
        <div className="space-y-3">
          {pyqs.map((pyq) => (
            <div key={pyq.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{pyq.title}</p>
                  <p className="text-sm text-gray-500">{pyq.subject} - {pyq.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline" className="hidden sm:inline-flex">{pyq.year}</Badge>
                {pyq.fileUrl && (
                  <>
                    <a href={pyq.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={pyq.fileUrl} download>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemove(pyq.id)}
                  disabled={removingId === pyq.id}
                >
                  {removingId === pyq.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 border-b pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">{tab.count}</span>
            </button>
          )
        })}
      </div>
      {renderContent()}
    </div>
  )
}
