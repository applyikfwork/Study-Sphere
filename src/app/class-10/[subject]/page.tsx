import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getSubjectWithChapters, getNotesBySubject, getSamplePapersBySubject, getPYQsBySubject } from "@/lib/supabase/public-data";
import { FileText, ArrowLeft, BookOpen, ClipboardList, History } from "lucide-react";
import { Metadata } from "next";
import { SubjectContentTabs } from "@/components/subject/subject-content-tabs";

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

export const dynamic = 'force-dynamic';

const colorMap: Record<string, { bg: string; text: string; light: string; gradient: string }> = {
  science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50", gradient: "from-green-600 to-emerald-700" },
  maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50", gradient: "from-blue-600 to-indigo-700" },
  sst: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50", gradient: "from-orange-600 to-amber-700" },
  english: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50", gradient: "from-purple-600 to-violet-700" },
  hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50", gradient: "from-pink-600 to-rose-700" },
};

const subjectFallbackInfo: Record<string, { name: string; description: string }> = {
  science: { name: "Science", description: "Physics, Chemistry, and Biology for Class 10 CBSE" },
  maths: { name: "Mathematics", description: "Complete Mathematics syllabus for Class 10 CBSE" },
  sst: { name: "Social Science", description: "History, Geography, Political Science, and Economics" },
  english: { name: "English", description: "English Literature and Grammar for Class 10 CBSE" },
  hindi: { name: "Hindi", description: "Hindi Course A and B for Class 10 CBSE" },
};

const subjectSEOKeywords: Record<string, string[]> = {
  science: [
    "class 10 science notes",
    "class 10 science notes pdf",
    "class 10 science chapter wise notes",
    "class 10 science important questions",
    "ncert solutions class 10 science",
    "class 10 science mcqs",
    "class 10 science short notes",
    "class 10 science formula sheet",
    "class 10 physics notes",
    "class 10 chemistry notes",
    "class 10 biology notes",
    "class 10 science ncert solutions",
    "class 10 science pyq",
    "class 10 science sample paper 2025",
  ],
  maths: [
    "class 10 maths notes",
    "class 10 maths notes pdf",
    "class 10 maths formulas",
    "class 10 maths important questions",
    "class 10 maths ncert solutions",
    "class 10 maths mcqs",
    "class 10 maths question bank",
    "class 10 maths chapter wise notes",
    "class 10 algebra notes",
    "class 10 geometry notes",
    "class 10 trigonometry notes",
    "class 10 maths pyq",
    "class 10 maths sample paper 2025",
  ],
  sst: [
    "class 10 sst notes",
    "class 10 social science notes",
    "class 10 sst notes pdf",
    "class 10 history notes",
    "class 10 geography notes",
    "class 10 civics notes",
    "class 10 economics notes",
    "class 10 sst important questions",
    "class 10 sst ncert solutions",
    "class 10 sst chapter wise notes",
    "class 10 sst pyq",
    "class 10 sst sample paper 2025",
  ],
  english: [
    "class 10 english notes",
    "class 10 english notes pdf",
    "class 10 english summary",
    "class 10 english important questions",
    "class 10 english ncert solutions",
    "class 10 first flight notes",
    "class 10 footprints without feet notes",
    "class 10 poems summary",
    "class 10 english grammar notes",
    "class 10 english writing skills",
    "class 10 letter writing format",
    "class 10 english pyq",
    "class 10 english sample paper 2025",
  ],
  hindi: [
    "class 10 hindi notes",
    "class 10 hindi notes pdf",
    "class 10 hindi important questions",
    "class 10 hindi ncert solutions",
    "class 10 hindi grammar",
    "class 10 hindi vyakaran notes",
    "class 10 hindi kshitij notes",
    "class 10 hindi kritika notes",
    "class 10 hindi sparsh notes",
    "class 10 hindi sanchayan notes",
    "class 10 hindi pyq",
    "class 10 hindi sample paper 2025",
  ],
};

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { subject: subjectSlug } = await params;
  const subject = await getSubjectWithChapters(subjectSlug);
  const fallback = subjectFallbackInfo[subjectSlug];
  
  if (!subject && !fallback) {
    return { title: "Subject Not Found" };
  }

  const name = subject?.name || fallback?.name || subjectSlug;
  const keywords = subjectSEOKeywords[subjectSlug] || [];
  
  return {
    title: `Class 10 ${name} Notes PDF Free Download - Chapter Wise NCERT Solutions 2025`,
    description: `Download free Class 10 ${name} notes PDF. Get chapter-wise ${name} notes, NCERT solutions, important questions, MCQs, PYQs, and sample papers. Complete ${name} study material for CBSE Board Exam 2025. Best ${name} notes for Class 10.`,
    keywords: keywords,
    openGraph: {
      title: `Class 10 ${name} Notes PDF Free Download - NCERT Solutions 2025 | Online School`,
      description: `Free Class 10 ${name} notes PDF. Chapter-wise notes, NCERT solutions, important questions, MCQs for CBSE Board Exam 2025.`,
      type: "website",
    },
  };
}

function generateSubjectJsonLd(subjectName: string, subjectSlug: string, chapters: { chapter_number: number; title: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `Class 10 ${subjectName}`,
    description: `Complete Class 10 ${subjectName} study material with notes, NCERT solutions, and important questions`,
    provider: {
      "@type": "Organization",
      name: "Online School",
    },
    educationalLevel: "Class 10",
    hasCourseInstance: chapters.map((ch, index) => ({
      "@type": "CourseInstance",
      position: index + 1,
      name: `Chapter ${ch.chapter_number}: ${ch.title}`,
      description: `Class 10 ${subjectName} Chapter ${ch.chapter_number} - ${ch.title}`,
    })),
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject: subjectSlug } = await params;
  
  const [subject, notes, samplePapers, pyqs] = await Promise.all([
    getSubjectWithChapters(subjectSlug),
    getNotesBySubject(subjectSlug),
    getSamplePapersBySubject(subjectSlug),
    getPYQsBySubject(subjectSlug)
  ]);

  const fallback = subjectFallbackInfo[subjectSlug];
  
  if (!subject && !fallback) {
    notFound();
  }

  const subjectData = subject || { 
    name: fallback?.name || subjectSlug, 
    description: fallback?.description || '', 
    chapters: [] as { id: string; chapter_number: number; title: string; description?: string | null }[]
  };

  const colors = colorMap[subjectSlug] || colorMap.science;

  const jsonLd = generateSubjectJsonLd(
    subjectData.name, 
    subjectSlug, 
    subjectData.chapters.map((ch: { chapter_number: number; title: string }) => ({ chapter_number: ch.chapter_number, title: ch.title }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`bg-gradient-to-r ${colors.gradient} text-white py-12`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/class-10" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Hub
          </Link>
          <h1 className="text-4xl font-bold mb-2">Class 10 {subjectData.name}</h1>
          <p className="text-lg opacity-90 mb-4">{subjectData.description}</p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {subjectData.chapters.length} Chapters
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {notes.length} Notes
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 flex items-center gap-1">
              <ClipboardList className="h-3 w-3" />
              {samplePapers.length} Sample Papers
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 flex items-center gap-1">
              <History className="h-3 w-3" />
              {pyqs.length} PYQs
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <SubjectContentTabs
          subjectSlug={subjectSlug}
          subjectName={subjectData.name}
          chapters={subjectData.chapters}
          notes={notes}
          samplePapers={samplePapers}
          pyqs={pyqs}
          colors={colors}
        />
      </div>
    </div>
  );
}
