import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Calculator, Globe, BookOpen, Languages, ArrowRight, FileText, ClipboardList } from "lucide-react";
import { getPublicSubjects } from "@/lib/supabase/public-data";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Class 10 Study Materials - Notes, PYQs, Sample Papers | Online School",
  description: "Complete Class 10 CBSE study materials. Chapter-wise notes, previous year questions, sample papers, and practice tests for Science, Maths, SST, English, Hindi.",
};

export const dynamic = 'force-dynamic';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  science: Beaker,
  maths: Calculator,
  sst: Globe,
  english: BookOpen,
  hindi: Languages,
};

const colorMap: Record<string, { color: string; bgLight: string }> = {
  science: { color: "#22c55e", bgLight: "bg-green-50" },
  maths: { color: "#3b82f6", bgLight: "bg-blue-50" },
  sst: { color: "#f97316", bgLight: "bg-orange-50" },
  english: { color: "#a855f7", bgLight: "bg-purple-50" },
  hindi: { color: "#ec4899", bgLight: "bg-pink-50" },
};

function getSubjectIcon(slug: string) {
  return iconMap[slug] || FileText;
}

function getSubjectColor(slug: string) {
  return colorMap[slug] || { color: "#6b7280", bgLight: "bg-gray-50" };
}

export default async function Class10Page() {
  const subjects = await getPublicSubjects();

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
              <span>Notes & Resources</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <ClipboardList className="h-5 w-5" />
              <span>Practice Materials</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Subject</h2>
        
        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No subjects available yet</h3>
            <p className="text-gray-500">Content is being prepared. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const Icon = getSubjectIcon(subject.slug);
              const colors = getSubjectColor(subject.slug);

              return (
                <Link key={subject.id} href={`/class-10/${subject.slug}`}>
                  <Card className="card-hover h-full border-0 shadow-lg overflow-hidden group">
                    <div className="h-2" style={{ background: colors.color }} />
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl ${colors.bgLight} flex items-center justify-center mb-4`}>
                        <Icon className="h-7 w-7" style={{ color: colors.color }} />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{subject.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{subject.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{subject.class ? `Class ${subject.class}` : 'Class 10'}</Badge>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
