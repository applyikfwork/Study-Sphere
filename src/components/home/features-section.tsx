import { FileText, ClipboardList, History, Target, Brain, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "High-Quality Notes",
    description: "Well-structured chapter-wise notes prepared by expert teachers for easy understanding",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Sample Papers",
    description: "Practice with latest pattern sample papers aligned with Board Exams 2025",
    icon: ClipboardList,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Previous Year Questions",
    description: "Year-wise PYQs from 2015-2024 with detailed solutions and marking schemes",
    icon: History,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Practice Tests",
    description: "MCQ tests and short answer practice with instant scoring and performance tracking",
    icon: Target,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Mind Maps",
    description: "Visual learning aids for quick revision and crystal-clear concept clarity",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Formula Sheets",
    description: "Quick reference sheets for important formulas and concepts - perfect for last-minute revision",
    icon: Calculator,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ace Your Exams
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive study materials designed specifically for CBSE Class 10 students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover border-0 shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
