import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { SubjectsSection } from "@/components/home/subjects-section";
import { ExamSection } from "@/components/home/exam-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Class 10 Notes PDF Free Download 2025 - CBSE NCERT Solutions, Sample Papers | Online School",
  description: "Download free Class 10 notes PDF for CBSE Board Exam 2025. Get NCERT solutions, sample papers with solutions, previous year questions (PYQs), chapter-wise notes for Science, Maths, Social Science, English, Hindi. India's best Class 10 study material.",
  keywords: [
    "class 10 notes pdf",
    "class 10 notes free download",
    "cbse class 10 notes 2025",
    "ncert class 10 solutions",
    "class 10 sample paper 2025",
    "class 10 pyq",
    "class 10 board exam preparation",
    "class 10 study material free",
    "class 10 all subjects notes",
    "class 10 toppers notes",
  ],
  openGraph: {
    title: "Class 10 Notes PDF Free Download 2025 - CBSE NCERT Solutions | Online School",
    description: "Download free Class 10 notes PDF for CBSE Board Exam 2025. NCERT solutions, sample papers, PYQs for Science, Maths, SST, English, Hindi.",
    type: "website",
  },
};

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Class 10 Notes PDF Free Download - Online School",
  description: "Free Class 10 CBSE notes, sample papers, PYQs, NCERT solutions for Board Exam 2025",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Course",
        position: 1,
        name: "Class 10 Science Notes",
        description: "Complete chapter-wise Science notes for CBSE Class 10",
        provider: { "@type": "Organization", name: "Online School" },
        educationalLevel: "Class 10",
      },
      {
        "@type": "Course",
        position: 2,
        name: "Class 10 Maths Notes",
        description: "Complete chapter-wise Mathematics notes with formulas for CBSE Class 10",
        provider: { "@type": "Organization", name: "Online School" },
        educationalLevel: "Class 10",
      },
      {
        "@type": "Course",
        position: 3,
        name: "Class 10 Social Science Notes",
        description: "Complete History, Geography, Civics, Economics notes for CBSE Class 10",
        provider: { "@type": "Organization", name: "Online School" },
        educationalLevel: "Class 10",
      },
      {
        "@type": "Course",
        position: 4,
        name: "Class 10 English Notes",
        description: "Complete First Flight, Footprints, Grammar notes for CBSE Class 10",
        provider: { "@type": "Organization", name: "Online School" },
        educationalLevel: "Class 10",
      },
      {
        "@type": "Course",
        position: 5,
        name: "Class 10 Hindi Notes",
        description: "Complete Kshitij, Kritika, Sparsh, Sanchayan notes for CBSE Class 10",
        provider: { "@type": "Organization", name: "Online School" },
        educationalLevel: "Class 10",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <ExamSection />
    </>
  );
}
