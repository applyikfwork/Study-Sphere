import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { subjects } from "@/lib/data";
import { FileText, HelpCircle, BookOpen, CheckSquare, ArrowLeft } from "lucide-react";

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

export async function generateMetadata({ params }: SubjectPageProps) {
  const { subject: subjectId } = await params;
  const subject = subjects.find((s) => s.id === subjectId);
  
  if (!subject) {
    return { title: "Subject Not Found" };
  }

  return {
    title: `Class 10 ${subject.name} Notes - Chapter-wise Study Material | Online School`,
    description: `Free Class 10 ${subject.name} notes, NCERT solutions, PYQs, important questions, and MCQs. Complete chapter-wise study material for CBSE Board 2025.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectId } = await params;
  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    notFound();
  }

  const colorMap: Record<string, { bg: string; text: string; light: string }> = {
    science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
    maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
    sst: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
    english: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" },
    hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
  };

  const colors = colorMap[subjectId] || colorMap.science;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${colors.bg} text-white py-12`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/class-10" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Class 10
          </Link>
          <h1 className="text-4xl font-bold mb-2">Class 10 {subject.name}</h1>
          <p className="text-lg opacity-90">{subject.description}</p>
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {subject.chapters.length} Chapters
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid gap-4">
          {subject.chapters.map((chapter) => (
            <Link key={chapter.id} href={`/class-10/${subjectId}/chapter-${chapter.id}`}>
              <Card className="card-hover border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                      <span className={`font-bold ${colors.text}`}>{chapter.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        Chapter {chapter.id}: {chapter.name}
                      </h3>
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
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CheckSquare className="h-4 w-4" />
                          <span>{chapter.topics} Topics</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className={colors.text}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
