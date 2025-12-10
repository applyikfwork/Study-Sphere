import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  title: {
    default: "Class 10 Notes PDF Free Download 2025 - CBSE NCERT Solutions, Sample Papers, PYQs | Online School",
    template: "%s | Online School - Class 10 CBSE Study Material",
  },
  description: "Free Class 10 notes PDF download for CBSE Board Exam 2025. Get chapter-wise NCERT solutions, sample papers with solutions, previous year questions (PYQs), important questions for Science, Maths, Social Science, English, Hindi. Best study material for Class 10 board preparation.",
  keywords: [
    "class 10 notes",
    "class 10 notes pdf",
    "class 10 study material",
    "class 10 chapter wise notes",
    "class 10 important questions",
    "class 10 ncert solutions",
    "class 10 question bank",
    "class 10 previous year questions",
    "class 10 pyq",
    "class 10 sample paper 2025",
    "class 10 board exam preparation",
    "class 10 exam 2025 notes",
    "class 10 revision notes",
    "ncert class 10 solutions",
    "cbse class 10 syllabus 2025",
    "class 10 full revision",
    "class 10 mock test",
    "class 10 practice questions",
    "class 10 online study",
    "class 10 science notes",
    "class 10 science important questions",
    "class 10 science chapter wise notes",
    "ncert solutions class 10 science",
    "class 10 science mcqs",
    "class 10 science short notes",
    "class 10 science formula sheet",
    "class 10 chemical reactions and equations notes",
    "class 10 acids bases and salts notes",
    "class 10 metals and non metals notes",
    "class 10 carbon and its compounds notes",
    "class 10 periodic classification of elements notes",
    "class 10 life processes notes",
    "class 10 control and coordination notes",
    "class 10 how do organisms reproduce notes",
    "class 10 heredity and evolution notes",
    "class 10 light reflection and refraction notes",
    "class 10 human eye and the colourful world notes",
    "class 10 electricity notes",
    "class 10 magnetic effects of electric current notes",
    "class 10 sources of energy notes",
    "class 10 our environment notes",
    "class 10 maths notes",
    "class 10 maths formulas",
    "class 10 maths important questions",
    "class 10 maths ncert solutions",
    "class 10 maths mcqs",
    "class 10 maths question bank",
    "class 10 real numbers notes",
    "class 10 polynomials notes",
    "class 10 pair of linear equations notes",
    "class 10 quadratic equations notes",
    "class 10 arithmetic progression notes",
    "class 10 ap notes",
    "class 10 triangles notes",
    "class 10 coordinate geometry notes",
    "class 10 surface areas and volumes notes",
    "class 10 trigonometry notes",
    "class 10 statistics notes",
    "class 10 probability notes",
    "class 10 history notes",
    "class 10 the rise of nationalism in europe notes",
    "class 10 nationalism in india notes",
    "class 10 print culture and the modern world notes",
    "class 10 the making of a global world notes",
    "class 10 the age of industrialisation notes",
    "class 10 geography notes",
    "class 10 resources and development notes",
    "class 10 forest and wildlife resources notes",
    "class 10 water resources notes",
    "class 10 agriculture notes",
    "class 10 minerals and energy resources notes",
    "class 10 manufacturing industries notes",
    "class 10 lifelines of national economy notes",
    "class 10 civics notes",
    "class 10 power sharing notes",
    "class 10 federalism notes",
    "class 10 gender religion and caste notes",
    "class 10 political parties notes",
    "class 10 outcomes of democracy notes",
    "class 10 economics notes",
    "class 10 development notes",
    "class 10 sectors of indian economy notes",
    "class 10 money and credit notes",
    "class 10 globalisation and the indian economy notes",
    "class 10 english notes",
    "class 10 english summary",
    "class 10 english important questions",
    "class 10 english ncert solutions",
    "class 10 first flight notes",
    "class 10 footprints without feet notes",
    "class 10 poems summary",
    "class 10 english grammar notes",
    "class 10 english writing skills",
    "class 10 letter writing format",
    "class 10 analytical paragraph writing",
    "class 10 story writing",
    "class 10 hindi notes",
    "class 10 hindi important questions",
    "class 10 hindi ncert solutions",
    "class 10 hindi grammar",
    "class 10 hindi vyakaran notes",
    "class 10 hindi kshitij notes",
    "class 10 hindi kritika notes",
    "class 10 hindi sparsh notes",
    "class 10 hindi sanchayan notes",
    "class 10 notes pdf free",
    "class 10 study notes free",
    "class 10 ncert notes pdf",
    "class 10 all chapters notes",
    "class 10 board preparation 2025",
    "class 10 chapter wise solutions",
    "class 10 handwritten notes",
    "class 10 most important questions",
    "class 10 sample paper with solutions",
    "cbse class 10 board exam notes",
    "class 10 toppers notes",
    "class 10 sst notes",
    "class 10 social science notes",
  ],
  authors: [{ name: "Online School" }],
  creator: "Online School",
  publisher: "Online School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
    siteName: "Online School",
    title: "Class 10 Notes PDF Free Download 2025 - CBSE NCERT Solutions | Online School",
    description: "Free Class 10 notes PDF for CBSE Board Exam 2025. Chapter-wise NCERT solutions, sample papers, PYQs, important questions for Science, Maths, SST, English, Hindi.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Class 10 Notes PDF Free Download 2025 - CBSE NCERT Solutions | Online School",
    description: "Free Class 10 notes PDF for CBSE Board Exam 2025. Chapter-wise NCERT solutions, sample papers, PYQs for Science, Maths, SST, English, Hindi.",
    creator: "@onlineschool",
  },
  verification: {
    google: "7pxorf98n9AhHb0Lkr-wpAQEbjvxNykqRjx0BU--Bp4",
  },
  category: "education",
  classification: "Educational Website",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app",
  },
  other: {
    "theme-color": "#3b82f6",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"}/#organization`,
      name: "Online School",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app",
      description: "India's fastest notes library for Class 10 CBSE students. Free notes, sample papers, PYQs, and study materials.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"}/#website`,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app",
      name: "Online School",
      description: "Free Class 10 CBSE notes, sample papers, PYQs, NCERT solutions for Board Exam 2025",
      publisher: {
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"}/#educationalOrganization`,
      name: "Online School",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app",
      description: "Online education platform providing free study materials for Class 10 CBSE students",
      educationalCredentialAwarded: "Class 10 Board Exam Preparation",
      hasCredential: "CBSE Class 10 Study Material Provider",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://class10thpdf.vercel.app"} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
