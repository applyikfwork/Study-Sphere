import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicPYQs } from "@/lib/supabase/public-data";
import { History, Download, FileText, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Class 10 Previous Year Questions (PYQs) - CBSE Board | Online School",
  description: "Download Class 10 previous year question papers (PYQs) from 2015-2024. Year-wise CBSE Board exam papers with solutions for Science, Maths, SST, English, Hindi.",
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

export default async function PYQsPage() {
  const pyqs = await getPublicPYQs();

  const groupedPYQs = pyqs.reduce((acc, pyq) => {
    const subjectName = pyq.subjects?.name || 'Other';
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push(pyq);
    return acc;
  }, {} as Record<string, typeof pyqs>);

  const hasAnyPYQs = pyqs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <History className="h-10 w-10" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              2015-2024
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Previous Year Questions</h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            Practice with actual CBSE Board exam papers from previous years. 
            Understand the exam pattern and frequently asked questions.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <CheckCircle className="h-5 w-5" />
              <span>With Solutions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <FileText className="h-5 w-5" />
              <span>All Sets</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {!hasAnyPYQs ? (
          <div className="text-center py-16">
            <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No PYQs available yet</h2>
            <p className="text-gray-500 mb-6">Check back soon for practice materials!</p>
            <Link href="/class-10">
              <Button>Browse Subjects</Button>
            </Link>
          </div>
        ) : (
          Object.entries(groupedPYQs).map(([subject, papers]) => {
            const colors = getSubjectColor(subject);

            return (
              <div key={subject} className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                  {subject} PYQs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {papers.map((paper) => (
                    <Card key={paper.id} className="card-hover border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg ${colors.light} flex items-center justify-center`}>
                            <span className={`font-bold text-lg ${colors.text}`}>{paper.year.toString().slice(-2)}</span>
                          </div>
                          <Badge variant="outline">{paper.year}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          CBSE Class 10 {paper.year}
                        </p>
                        {paper.file_url ? (
                          <a href={paper.file_url} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full gap-2" variant="outline">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        ) : (
                          <Button className="w-full gap-2" variant="outline" disabled>
                            <ExternalLink className="h-4 w-4" />
                            Coming Soon
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
