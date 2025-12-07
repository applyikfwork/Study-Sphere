import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicSubjects, getPublicNotes } from "@/lib/supabase/public-data";
import { FileText, Download, ArrowRight, Beaker, Calculator, Globe, BookOpen, Languages, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Class 10 Notes - Free PDF Download | Online School",
  description: "Download free Class 10 notes for all subjects. Chapter-wise CBSE notes for Science, Maths, Social Science, English, and Hindi. Perfect for Board Exams 2025 preparation.",
};

export const dynamic = 'force-dynamic';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  science: Beaker,
  maths: Calculator,
  sst: Globe,
  english: BookOpen,
  hindi: Languages,
};

const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
  maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  sst: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  english: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" },
  hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
};

function getIconForSubject(slug: string) {
  return iconMap[slug] || FileText;
}

function getColorForSubject(slug: string) {
  return colorMap[slug] || colorMap.science;
}

export default async function NotesPage() {
  const [subjects, notes] = await Promise.all([
    getPublicSubjects(),
    getPublicNotes()
  ]);

  const notesBySubject = notes.reduce((acc, note) => {
    const subjectSlug = note.chapters?.subjects?.slug || 'other';
    if (!acc[subjectSlug]) {
      acc[subjectSlug] = [];
    }
    acc[subjectSlug].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  const hasAnyNotes = notes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-10 w-10" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Free Download
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Class 10 Notes</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            High-quality, chapter-wise notes prepared by expert teachers. 
            Download PDF notes for all subjects and ace your Board Exams 2025.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {!hasAnyNotes ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No notes available yet</h2>
            <p className="text-gray-500 mb-6">Check back soon for study materials!</p>
            <Link href="/class-10">
              <Button>Browse Subjects</Button>
            </Link>
          </div>
        ) : (
          subjects.map((subject) => {
            const subjectNotes = notesBySubject[subject.slug] || [];
            if (subjectNotes.length === 0) return null;

            const Icon = getIconForSubject(subject.slug);
            const colors = getColorForSubject(subject.slug);

            return (
              <div key={subject.id} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{subject.name}</h2>
                  <Badge variant="outline">{subjectNotes.length} Notes</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjectNotes.slice(0, 6).map((note) => (
                    <Card key={note.id} className="card-hover border-0 shadow-md group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                            <FileText className={`h-5 w-5 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {note.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {note.chapters?.title ? `Ch. ${note.chapters.chapter_number}: ${note.chapters.title}` : 'General Notes'}
                            </p>
                          </div>
                          {note.file_url ? (
                            <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>
                          ) : (
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {subjectNotes.length > 6 && (
                  <div className="mt-4">
                    <Link href={`/class-10/${subject.slug}`} className={`inline-flex items-center gap-2 ${colors.text} hover:underline font-medium`}>
                      View all {subjectNotes.length} notes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })
        )}

        {hasAnyNotes && Object.keys(notesBySubject).length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No notes available yet</h2>
            <p className="text-gray-500">Check back soon for study materials!</p>
          </div>
        )}
      </div>
    </div>
  );
}
