import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Calculator, Globe, BookOpen, Languages, ArrowRight, FileText, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Class 10 Study Materials - Notes, PYQs, Sample Papers | Online School",
  description: "Complete Class 10 CBSE study materials. Chapter-wise notes, previous year questions, sample papers, and practice tests for Science, Maths, SST, English, Hindi.",
};

const subjects = [
  {
    id: "science",
    name: "Science",
    description: "Physics, Chemistry, Biology - Complete NCERT syllabus with notes, PYQs, and practice tests",
    chapters: 13,
    icon: Beaker,
    color: "#22c55e",
    bgLight: "bg-green-50",
  },
  {
    id: "maths",
    name: "Mathematics",
    description: "Algebra, Geometry, Trigonometry, Statistics - Formula sheets, solved examples, and MCQs",
    chapters: 14,
    icon: Calculator,
    color: "#3b82f6",
    bgLight: "bg-blue-50",
  },
  {
    id: "sst",
    name: "Social Science",
    description: "History, Geography, Political Science, Economics - Complete with maps and important dates",
    chapters: 18,
    icon: Globe,
    color: "#f97316",
    bgLight: "bg-orange-50",
  },
  {
    id: "english",
    name: "English",
    description: "First Flight, Footprints Without Feet - Summary, Q&A, Grammar, and Writing Skills",
    chapters: 14,
    icon: BookOpen,
    color: "#a855f7",
    bgLight: "bg-purple-50",
  },
  {
    id: "hindi",
    name: "Hindi",
    description: "Kshitij, Kritika - Prose, Poetry explanations, Grammar (Vyakaran)",
    chapters: 15,
    icon: Languages,
    color: "#ec4899",
    bgLight: "bg-pink-50",
  },
];

export default function Class10Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Class 10 Study Materials</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Complete CBSE Class 10 preparation with chapter-wise notes, solved questions, 
            PYQs, and sample papers for Board Exams 2025.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <FileText className="h-5 w-5" />
              <span>500+ Notes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <ClipboardList className="h-5 w-5" />
              <span>1000+ Questions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Subject</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/class-10/${subject.id}`}>
              <Card className="card-hover h-full border-0 shadow-lg overflow-hidden group">
                <div className="h-2" style={{ background: subject.color }} />
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${subject.bgLight} flex items-center justify-center mb-4`}>
                    <subject.icon className="h-7 w-7" style={{ color: subject.color }} />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{subject.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{subject.chapters} Chapters</span>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
