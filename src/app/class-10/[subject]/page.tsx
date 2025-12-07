import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubjectWithChapters, getNotesBySubject } from "@/lib/supabase/public-data";
import { FileText, HelpCircle, BookOpen, CheckSquare, ArrowLeft, Download } from "lucide-react";

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

export const dynamic = 'force-dynamic';

const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
  maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  sst: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  english: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" },
  hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
};

const subjectFallbackInfo: Record<string, { name: string; description: string }> = {
  science: { name: "Science", description: "Physics, Chemistry, and Biology for Class 10 CBSE" },
  maths: { name: "Mathematics", description: "Complete Mathematics syllabus for Class 10 CBSE" },
  sst: { name: "Social Science", description: "History, Geography, Political Science, and Economics" },
  english: { name: "English", description: "English Literature and Grammar for Class 10 CBSE" },
  hindi: { name: "Hindi", description: "Hindi Course A and B for Class 10 CBSE" },
};

export async function generateMetadata({ params }: SubjectPageProps) {
  const { subject: subjectSlug } = await params;
  const subject = await getSubjectWithChapters(subjectSlug);
  const fallback = subjectFallbackInfo[subjectSlug];
  
  if (!subject && !fallback) {
    return { title: "Subject Not Found" };
  }

  const name = subject?.name || fallback?.name || subjectSlug;
  
  return {
    title: `Class 10 ${name} Notes - Chapter-wise Study Material | Online School`,
    description: `Free Class 10 ${name} notes, NCERT solutions, PYQs, important questions, and MCQs. Complete chapter-wise study material for CBSE Board 2025.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectSlug } = await params;
  const [subject, notes] = await Promise.all([
    getSubjectWithChapters(subjectSlug),
    getNotesBySubject(subjectSlug)
  ]);

  const fallback = subjectFallbackInfo[subjectSlug];
  
  if (!subject && !fallback) {
    notFound();
  }

  const subjectData = subject || { 
    name: fallback?.name || subjectSlug, 
    description: fallback?.description || '', 
    chapters: [] 
  };

  const colors = colorMap[subjectSlug] || colorMap.science;

  const notesByChapter = notes.reduce((acc, note) => {
    const chapterNum = note.chapters?.chapter_number;
    if (chapterNum) {
      if (!acc[chapterNum]) {
        acc[chapterNum] = 0;
      }
      acc[chapterNum]++;
    }
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${colors.bg} text-white py-12`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/class-10" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Class 10
          </Link>
          <h1 className="text-4xl font-bold mb-2">Class 10 {subjectData.name}</h1>
          <p className="text-lg opacity-90">{subjectData.description}</p>
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {subjectData.chapters.length} Chapters
            </Badge>
            {notes.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {notes.length} Resources Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {subjectData.chapters.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No chapters available yet</h2>
            <p className="text-gray-500">Content is being prepared for this subject.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {subjectData.chapters.map((chapter) => {
              const chapterNoteCount = notesByChapter[chapter.chapter_number] || 0;
              
              return (
                <Link key={chapter.id} href={`/class-10/${subjectSlug}/chapter-${chapter.chapter_number}`}>
                  <Card className="card-hover border-0 shadow-md">
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
                          <div className="flex flex-wrap gap-3 mt-3">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <FileText className="h-4 w-4" />
                              <span>Notes</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <HelpCircle className="h-4 w-4" />
                              <span>PYQs</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <BookOpen className="h-4 w-4" />
                              <span>NCERT Solutions</span>
                            </div>
                            {chapterNoteCount > 0 && (
                              <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                <Download className="h-4 w-4" />
                                <span>{chapterNoteCount} Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" className={colors.text}>
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
