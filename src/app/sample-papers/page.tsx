import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicSamplePapers } from "@/lib/supabase/public-data";
import { ClipboardList, Clock, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { SamplePapersClient } from "@/components/pdf-viewer/sample-papers-client";

export const metadata: Metadata = {
  title: "Class 10 Sample Papers 2025 PDF Download - CBSE Board Exam with Solutions",
  description: "Download free Class 10 sample papers 2025 with solutions for CBSE Board Exams. Latest pattern sample papers PDF for Science, Maths, Social Science, English, Hindi. Practice papers with marking scheme and answers for Class 10 Board Exam preparation.",
  keywords: [
    "class 10 sample paper 2025",
    "class 10 sample paper pdf",
    "cbse sample paper 2025 class 10",
    "class 10 sample paper with solutions",
    "class 10 science sample paper 2025",
    "class 10 maths sample paper 2025",
    "class 10 sst sample paper 2025",
    "class 10 english sample paper 2025",
    "class 10 hindi sample paper 2025",
    "class 10 practice paper",
    "class 10 model paper 2025",
    "cbse class 10 question paper",
    "class 10 board exam paper",
    "class 10 sample paper download",
    "class 10 mock test paper",
  ],
  openGraph: {
    title: "Class 10 Sample Papers 2025 PDF Download with Solutions | Online School",
    description: "Download free Class 10 sample papers 2025 for CBSE Board Exams. Latest pattern sample papers with solutions for Science, Maths, SST, English, Hindi.",
    type: "website",
  },
};

export const dynamic = 'force-dynamic';

const subjectColors: Record<string, { bg: string; text: string; light: string }> = {
  Science: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
  Maths: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  Mathematics: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  SST: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  "Social Science": { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  English: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" },
  Hindi: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
};

function getSubjectColor(subjectName: string) {
  return subjectColors[subjectName] || { bg: "bg-gray-500", text: "text-gray-600", light: "bg-gray-50" };
}

const samplePapersJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Class 10 Sample Papers 2025 - CBSE Board Exam",
  description: "Free Class 10 sample papers with solutions for CBSE Board Exam 2025",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "CreativeWork",
        position: 1,
        name: "Class 10 Science Sample Paper 2025",
        description: "CBSE Class 10 Science sample paper with solutions and marking scheme",
        educationalLevel: "Class 10",
        learningResourceType: "Sample Paper",
      },
      {
        "@type": "CreativeWork",
        position: 2,
        name: "Class 10 Maths Sample Paper 2025",
        description: "CBSE Class 10 Mathematics sample paper with solutions and marking scheme",
        educationalLevel: "Class 10",
        learningResourceType: "Sample Paper",
      },
      {
        "@type": "CreativeWork",
        position: 3,
        name: "Class 10 SST Sample Paper 2025",
        description: "CBSE Class 10 Social Science sample paper with solutions and marking scheme",
        educationalLevel: "Class 10",
        learningResourceType: "Sample Paper",
      },
      {
        "@type": "CreativeWork",
        position: 4,
        name: "Class 10 English Sample Paper 2025",
        description: "CBSE Class 10 English sample paper with solutions and marking scheme",
        educationalLevel: "Class 10",
        learningResourceType: "Sample Paper",
      },
      {
        "@type": "CreativeWork",
        position: 5,
        name: "Class 10 Hindi Sample Paper 2025",
        description: "CBSE Class 10 Hindi sample paper with solutions and marking scheme",
        educationalLevel: "Class 10",
        learningResourceType: "Sample Paper",
      },
    ],
  },
};

export default async function SamplePapersPage() {
  const samplePapers = await getPublicSamplePapers();

  const groupedPapers = samplePapers.reduce((acc, paper) => {
    const subjectName = paper.subjects?.name || 'Other';
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push(paper);
    return acc;
  }, {} as Record<string, typeof samplePapers>);

  const hasAnyPapers = samplePapers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(samplePapersJsonLd) }}
      />
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="h-10 w-10" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Latest Pattern 2025
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Class 10 Sample Papers 2025</h1>
          <p className="text-lg text-green-100 max-w-2xl">
            Practice with the latest pattern CBSE sample papers for Class 10 Board Exams 2025. 
            Complete with marking schemes and solutions. Free PDF download available.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Clock className="h-5 w-5" />
              <span>3 Hours Duration</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Star className="h-5 w-5" />
              <span>80 Marks</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {!hasAnyPapers ? (
          <div className="text-center py-16">
            <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No sample papers available yet</h2>
            <p className="text-gray-500 mb-6">Check back soon for practice materials!</p>
            <Link href="/class-10">
              <Button>Browse Subjects</Button>
            </Link>
          </div>
        ) : (
          <SamplePapersClient groupedPapers={groupedPapers} getSubjectColor={getSubjectColor} />
        )}
      </div>
    </div>
  );
}
