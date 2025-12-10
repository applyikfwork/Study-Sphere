import { FileText, ClipboardList, History, GraduationCap } from "lucide-react";
import { getAllSubjectsWithContent } from "@/lib/supabase/public-data";
import { Metadata } from "next";
import { LearningHub } from "@/components/learning-hub/learning-hub";

export const metadata: Metadata = {
  title: "Class 10 Study Materials - Notes, NCERT Solutions, PYQs, Sample Papers 2025",
  description: "Complete Class 10 CBSE study materials for Board Exam 2025. Free chapter-wise notes PDF, NCERT solutions, previous year questions (PYQs), sample papers with solutions for Science, Maths, Social Science, English, Hindi. Best Class 10 preparation resources.",
  keywords: [
    "class 10 study material",
    "class 10 notes pdf",
    "class 10 ncert solutions",
    "class 10 chapter wise notes",
    "class 10 all subjects notes",
    "cbse class 10 preparation 2025",
    "class 10 science notes",
    "class 10 maths notes",
    "class 10 sst notes",
    "class 10 english notes",
    "class 10 hindi notes",
    "class 10 board exam material",
    "class 10 important questions",
    "class 10 revision notes",
    "class 10 toppers notes",
  ],
  openGraph: {
    title: "Class 10 Study Materials - Notes, NCERT Solutions, Sample Papers 2025 | Online School",
    description: "Complete Class 10 CBSE study materials. Free chapter-wise notes, NCERT solutions, PYQs, sample papers for Science, Maths, SST, English, Hindi.",
    type: "website",
  },
};

export const dynamic = 'force-dynamic';

const class10JsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Class 10 Study Materials - CBSE Board Exam 2025",
  description: "Complete study materials for Class 10 CBSE students including notes, NCERT solutions, sample papers, and PYQs",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Course",
        position: 1,
        name: "Class 10 Science",
        description: "Physics, Chemistry, Biology notes and NCERT solutions",
        educationalLevel: "Class 10",
        provider: { "@type": "Organization", name: "Online School" },
      },
      {
        "@type": "Course",
        position: 2,
        name: "Class 10 Mathematics",
        description: "Algebra, Geometry, Trigonometry notes with formulas",
        educationalLevel: "Class 10",
        provider: { "@type": "Organization", name: "Online School" },
      },
      {
        "@type": "Course",
        position: 3,
        name: "Class 10 Social Science",
        description: "History, Geography, Civics, Economics notes",
        educationalLevel: "Class 10",
        provider: { "@type": "Organization", name: "Online School" },
      },
      {
        "@type": "Course",
        position: 4,
        name: "Class 10 English",
        description: "First Flight, Footprints, Grammar and Writing Skills",
        educationalLevel: "Class 10",
        provider: { "@type": "Organization", name: "Online School" },
      },
      {
        "@type": "Course",
        position: 5,
        name: "Class 10 Hindi",
        description: "Kshitij, Kritika, Sparsh, Sanchayan notes",
        educationalLevel: "Class 10",
        provider: { "@type": "Organization", name: "Online School" },
      },
    ],
  },
};

const defaultSubjects = [
  { id: "1", name: "Science", slug: "science", description: "Physics, Chemistry, and Biology", chaptersCount: 0, samplePapersCount: 0, pyqsCount: 0 },
  { id: "2", name: "Mathematics", slug: "maths", description: "Algebra, Geometry, and Trigonometry", chaptersCount: 0, samplePapersCount: 0, pyqsCount: 0 },
  { id: "3", name: "Social Science", slug: "sst", description: "History, Geography, Civics, Economics", chaptersCount: 0, samplePapersCount: 0, pyqsCount: 0 },
  { id: "4", name: "English", slug: "english", description: "First Flight, Footprints, Grammar", chaptersCount: 0, samplePapersCount: 0, pyqsCount: 0 },
  { id: "5", name: "Hindi", slug: "hindi", description: "Kshitij, Kritika, Sparsh, Sanchayan", chaptersCount: 0, samplePapersCount: 0, pyqsCount: 0 },
];

export default async function Class10Page() {
  const subjects = await getAllSubjectsWithContent();
  const displaySubjects = subjects.length > 0 ? subjects : defaultSubjects;

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(class10JsonLd) }}
      />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <GraduationCap className="h-5 w-5" />
            <span className="font-medium">Learning Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Class 10 Study Materials</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Your centralized hub for complete CBSE Class 10 preparation. Access chapter-wise notes, 
            sample papers, PYQs, and NCERT solutions - all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <FileText className="h-5 w-5" />
              <span>Notes & NCERT Solutions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <ClipboardList className="h-5 w-5" />
              <span>Sample Papers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <History className="h-5 w-5" />
              <span>Previous Year Questions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <LearningHub subjects={displaySubjects} />
      </div>
    </div>
  );
}
