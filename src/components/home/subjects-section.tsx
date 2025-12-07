import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Calculator, Globe, BookOpen, Languages, ArrowRight } from "lucide-react";

const subjects = [
  {
    id: "science",
    name: "Science",
    description: "Physics, Chemistry, Biology",
    chapters: 13,
    icon: Beaker,
    color: "#22c55e",
    bgLight: "bg-green-50",
  },
  {
    id: "maths",
    name: "Mathematics",
    description: "Algebra, Geometry, Statistics",
    chapters: 14,
    icon: Calculator,
    color: "#3b82f6",
    bgLight: "bg-blue-50",
  },
  {
    id: "sst",
    name: "Social Science",
    description: "History, Geography, Civics, Economics",
    chapters: 18,
    icon: Globe,
    color: "#f97316",
    bgLight: "bg-orange-50",
  },
  {
    id: "english",
    name: "English",
    description: "Literature, Grammar, Writing",
    chapters: 14,
    icon: BookOpen,
    color: "#a855f7",
    bgLight: "bg-purple-50",
  },
  {
    id: "hindi",
    name: "Hindi",
    description: "Kshitij, Kritika, Vyakaran",
    chapters: 15,
    icon: Languages,
    color: "#ec4899",
    bgLight: "bg-pink-50",
  },
];

export function SubjectsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Subject
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Complete Class 10 CBSE syllabus covered with chapter-wise materials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/class-10/${subject.id}`}>
              <Card className="card-hover h-full border-0 shadow-lg overflow-hidden group">
                <div className="h-2" style={{ background: `linear-gradient(to right, ${subject.color}, ${subject.color}dd)` }} />
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${subject.bgLight} flex items-center justify-center mb-4`}>
                    <subject.icon className="h-7 w-7" style={{ color: subject.color }} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{subject.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{subject.chapters} Chapters</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
