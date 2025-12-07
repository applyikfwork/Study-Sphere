import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Calculator, BookMarked, Lightbulb } from "lucide-react";

const examResources = [
  {
    title: "Important Questions",
    description: "Most important questions for Board 2025",
    icon: FileQuestion,
    href: "/important-questions",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Formula Sheets",
    description: "Quick reference for all subjects",
    icon: Calculator,
    href: "/formula-sheets",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Revision Notes",
    description: "Concise notes for quick revision",
    icon: BookMarked,
    href: "/notes",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Last-minute Tips",
    description: "Exam strategies and tips",
    icon: Lightbulb,
    href: "/exam-tips",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export function ExamSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
            Exam Season 2025
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Board Exams 2025 - Full Preparation Kit
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Get ready for your CBSE Board Exams with our comprehensive preparation resources
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examResources.map((resource) => (
            <Link key={resource.title} href={resource.href}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all group cursor-pointer">
                <div className={`w-12 h-12 rounded-lg ${resource.bgColor} flex items-center justify-center mb-4`}>
                  <resource.icon className={`h-6 w-6 ${resource.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-sm text-blue-100">{resource.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/class-10">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Your Preparation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
