import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getChapterWithNotes } from "@/lib/supabase/public-data";
import { FileText, HelpCircle, BookOpen, CheckSquare, Download, ArrowLeft, Brain, ExternalLink, Eye } from "lucide-react";

interface ChapterPageProps {
  params: Promise<{ subject: string; chapter: string }>;
}

export const dynamic = 'force-dynamic';

const subjectFallbackInfo: Record<string, { name: string }> = {
  science: { name: "Science" },
  maths: { name: "Mathematics" },
  sst: { name: "Social Science" },
  english: { name: "English" },
  hindi: { name: "Hindi" },
};

export async function generateMetadata({ params }: ChapterPageProps) {
  const { subject: subjectSlug, chapter: chapterSlug } = await params;
  const chapterNumber = parseInt(chapterSlug.replace("chapter-", ""));
  
  const data = await getChapterWithNotes(subjectSlug, chapterNumber);
  const fallback = subjectFallbackInfo[subjectSlug];
  
  if (!data && !fallback) {
    return { title: "Chapter Not Found" };
  }

  const subjectName = data?.subject?.name || fallback?.name || subjectSlug;
  const chapterTitle = data?.chapter?.title || `Chapter ${chapterNumber}`;

  return {
    title: `${chapterTitle} - Class 10 ${subjectName} Notes | Online School`,
    description: `Free notes, NCERT solutions, PYQs, and important questions for ${chapterTitle}. Class 10 ${subjectName} Chapter ${chapterNumber} complete study material.`,
  };
}

const colorMap: Record<string, { bg: string; text: string; light: string; gradient: string }> = {
  science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50", gradient: "from-green-500 to-emerald-600" },
  maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50", gradient: "from-blue-500 to-indigo-600" },
  sst: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50", gradient: "from-orange-500 to-red-600" },
  english: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50", gradient: "from-purple-500 to-violet-600" },
  hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50", gradient: "from-pink-500 to-rose-600" },
};

const noteTypeIcons: Record<string, typeof FileText> = {
  notes: FileText,
  important_questions: HelpCircle,
  mcqs: CheckSquare,
  summary: BookOpen,
  mind_map: Brain,
};

const noteTypeLabels: Record<string, string> = {
  notes: 'Notes',
  important_questions: 'Important Questions',
  mcqs: 'MCQs',
  summary: 'Summary',
  mind_map: 'Mind Map',
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { subject: subjectSlug, chapter: chapterSlug } = await params;
  const chapterNumber = parseInt(chapterSlug.replace("chapter-", ""));
  
  const data = await getChapterWithNotes(subjectSlug, chapterNumber);

  const fallback = subjectFallbackInfo[subjectSlug];
  
  if (!data && !fallback) {
    notFound();
  }

  const subject = data?.subject || { name: fallback?.name || subjectSlug, slug: subjectSlug };
  const chapter = data?.chapter || { chapter_number: chapterNumber, title: `Chapter ${chapterNumber}` };
  const notes = data?.notes || [];
  const colors = colorMap[subjectSlug] || colorMap.science;

  const notesByType = notes.reduce((acc, note) => {
    const type = note.note_type || 'notes';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  const hasNotes = notes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${colors.gradient} text-white py-12`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href={`/class-10/${subjectSlug}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to {subject.name}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Chapter {chapter.chapter_number}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{chapter.title}</h1>
          <p className="text-lg opacity-90">Class 10 {subject.name}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {!hasNotes ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No study materials available yet</h2>
            <p className="text-gray-500 mb-6">Content for this chapter will be uploaded soon!</p>
            <Link href={`/class-10/${subjectSlug}`}>
              <Button variant="outline">Back to {subject.name}</Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Resources</h2>
            
            <div className="space-y-8">
              {Object.entries(notesByType).map(([type, typeNotes]) => {
                const Icon = noteTypeIcons[type] || FileText;
                const label = noteTypeLabels[type] || type;

                return (
                  <div key={type}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                      {label}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typeNotes.map((note) => (
                        <Card key={note.id} className="card-hover border-0 shadow-lg">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                                <Icon className={`h-6 w-6 ${colors.text}`} />
                              </div>
                              <Badge variant="secondary">{label}</Badge>
                            </div>
                            <CardTitle className="text-lg mt-4">{note.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{note.views} views</span>
                              </div>
                              {note.file_name && (
                                <span className="truncate">{note.file_name}</span>
                              )}
                            </div>
                            {note.file_url ? (
                              <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full gap-2">
                                  <Download className="h-4 w-4" />
                                  Download {label}
                                </Button>
                              </a>
                            ) : (
                              <Button className="w-full gap-2" disabled>
                                <ExternalLink className="h-4 w-4" />
                                Coming Soon
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Need More Practice?</h3>
                  <p className="text-gray-600">
                    Access our comprehensive practice tests and sample papers to boost your preparation.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/sample-papers">
                    <Button variant="outline">Sample Papers</Button>
                  </Link>
                  <Link href="/pyqs">
                    <Button>Practice Tests</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
