import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicPYQs } from "@/lib/supabase/public-data";
import { History, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { PyqsClient } from "@/components/pdf-viewer/pyqs-client";

export const metadata: Metadata = {
  title: "Class 10 Previous Year Questions (PYQs) PDF Download - CBSE Board 2015-2024",
  description: "Download Class 10 previous year question papers (PYQs) PDF from 2015-2024. Year-wise CBSE Board exam papers with solutions for Science, Maths, Social Science, English, Hindi. Free PYQ papers for Class 10 Board Exam preparation.",
  keywords: [
    "class 10 pyq",
    "class 10 previous year questions",
    "class 10 pyq pdf",
    "cbse class 10 question paper",
    "class 10 board paper",
    "class 10 pyq with solutions",
    "class 10 science pyq",
    "class 10 maths pyq",
    "class 10 sst pyq",
    "class 10 english pyq",
    "class 10 hindi pyq",
    "cbse board exam papers",
    "class 10 previous year paper 2024",
    "class 10 previous year paper 2023",
    "class 10 board exam question paper",
    "class 10 pyq download",
    "class 10 solved papers",
  ],
  openGraph: {
    title: "Class 10 PYQs PDF Download - Previous Year Questions 2015-2024 | Online School",
    description: "Download Class 10 previous year question papers (PYQs) from 2015-2024. CBSE Board exam papers with solutions for Science, Maths, SST, English, Hindi.",
    type: "website",
  },
};

export const dynamic = 'force-dynamic';

const pyqsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Class 10 Previous Year Questions (PYQs) - CBSE Board 2015-2024",
  description: "CBSE Class 10 previous year question papers with solutions from 2015-2024",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "CreativeWork",
        position: 1,
        name: "Class 10 Science PYQs",
        description: "CBSE Class 10 Science previous year question papers with solutions",
        educationalLevel: "Class 10",
        learningResourceType: "Previous Year Questions",
      },
      {
        "@type": "CreativeWork",
        position: 2,
        name: "Class 10 Maths PYQs",
        description: "CBSE Class 10 Mathematics previous year question papers with solutions",
        educationalLevel: "Class 10",
        learningResourceType: "Previous Year Questions",
      },
      {
        "@type": "CreativeWork",
        position: 3,
        name: "Class 10 SST PYQs",
        description: "CBSE Class 10 Social Science previous year question papers with solutions",
        educationalLevel: "Class 10",
        learningResourceType: "Previous Year Questions",
      },
      {
        "@type": "CreativeWork",
        position: 4,
        name: "Class 10 English PYQs",
        description: "CBSE Class 10 English previous year question papers with solutions",
        educationalLevel: "Class 10",
        learningResourceType: "Previous Year Questions",
      },
      {
        "@type": "CreativeWork",
        position: 5,
        name: "Class 10 Hindi PYQs",
        description: "CBSE Class 10 Hindi previous year question papers with solutions",
        educationalLevel: "Class 10",
        learningResourceType: "Previous Year Questions",
      },
    ],
  },
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pyqsJsonLd) }}
      />
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <History className="h-10 w-10" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              2015-2024 Papers
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Class 10 Previous Year Questions (PYQs)</h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            Practice with actual CBSE Board exam papers from previous years (2015-2024). 
            Understand the exam pattern and frequently asked questions. Free PDF download.
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
          <PyqsClient groupedPYQs={groupedPYQs} />
        )}
      </div>
    </div>
  );
}
