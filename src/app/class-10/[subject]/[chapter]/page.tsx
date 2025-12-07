import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { subjects } from "@/lib/data";
import { FileText, HelpCircle, BookOpen, CheckSquare, Download, ArrowLeft, Brain, Calculator } from "lucide-react";

interface ChapterPageProps {
  params: Promise<{ subject: string; chapter: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { subject: subjectId, chapter: chapterSlug } = await params;
  const subject = subjects.find((s) => s.id === subjectId);
  const chapterId = parseInt(chapterSlug.replace("chapter-", ""));
  const chapter = subject?.chapters.find((c) => c.id === chapterId);

  if (!subject || !chapter) {
    return { title: "Chapter Not Found" };
  }

  return {
    title: `${chapter.name} - Class 10 ${subject.name} Notes | Online School`,
    description: `Free notes, NCERT solutions, PYQs, and important questions for ${chapter.name}. Class 10 ${subject.name} Chapter ${chapterId} complete study material.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { subject: subjectId, chapter: chapterSlug } = await params;
  const subject = subjects.find((s) => s.id === subjectId);
  const chapterId = parseInt(chapterSlug.replace("chapter-", ""));
  const chapter = subject?.chapters.find((c) => c.id === chapterId);

  if (!subject || !chapter) {
    notFound();
  }

  const colorMap: Record<string, { bg: string; text: string; light: string; gradient: string }> = {
    science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50", gradient: "from-green-500 to-emerald-600" },
    maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50", gradient: "from-blue-500 to-indigo-600" },
    sst: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50", gradient: "from-orange-500 to-red-600" },
    english: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50", gradient: "from-purple-500 to-violet-600" },
    hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50", gradient: "from-pink-500 to-rose-600" },
  };

  const colors = colorMap[subjectId] || colorMap.science;

  const resources = [
    {
      title: "Notes",
      description: "Comprehensive chapter notes with key concepts and explanations",
      icon: FileText,
      badge: "PDF Available",
    },
    {
      title: "NCERT Solutions",
      description: "Step-by-step solutions to all NCERT textbook questions",
      icon: BookOpen,
      badge: "All Questions",
    },
    {
      title: "Important Questions",
      description: "Most important questions for Board Exams 2025",
      icon: HelpCircle,
      badge: "Exam Focused",
    },
    {
      title: "Previous Year Questions",
      description: "PYQs from 2015-2024 with detailed solutions",
      icon: CheckSquare,
      badge: "Year-wise",
    },
    {
      title: "MCQ Practice",
      description: "Multiple choice questions for quick practice and revision",
      icon: CheckSquare,
      badge: "50+ MCQs",
    },
    {
      title: "Mind Maps",
      description: "Visual summary of the chapter for quick revision",
      icon: Brain,
      badge: "Visual",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${colors.gradient} text-white py-12`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href={`/class-10/${subjectId}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to {subject.name}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Chapter {chapterId}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {chapter.topics} Topics
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{chapter.name}</h1>
          <p className="text-lg opacity-90">Class 10 {subject.name}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.title} className="card-hover border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                    <resource.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <Badge variant="secondary">{resource.badge}</Badge>
                </div>
                <CardTitle className="text-lg mt-4">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Access {resource.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
