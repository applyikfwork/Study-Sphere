import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://onlineschool.com"),
  title: {
    default: "Online School - Class 10 Notes, Sample Papers, PYQs | CBSE Board 2025",
    template: "%s | Online School",
  },
  description: "India's fastest notes library for Class 10 students. Access high-quality notes, sample papers, PYQs, practice tests, and study materials for CBSE Board Exams 2025. Science, Maths, SST, English, Hindi.",
  keywords: [
    "class 10 notes",
    "class 10 science notes",
    "class 10 maths notes",
    "CBSE sample papers 2025",
    "class 10 PYQs",
    "board exam preparation",
    "class 10 important questions",
    "CBSE board exam",
    "class 10 study material",
    "free notes class 10",
  ],
  authors: [{ name: "Online School" }],
  creator: "Online School",
  publisher: "Online School",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Online School",
    title: "Online School - Class 10 Notes, Sample Papers, PYQs | CBSE Board 2025",
    description: "India's fastest notes library for Class 10 students. Access high-quality notes, sample papers, PYQs, practice tests, and study materials for CBSE Board Exams 2025.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online School - Class 10 Notes, Sample Papers, PYQs | CBSE Board 2025",
    description: "India's fastest notes library for Class 10 students. Access high-quality notes, sample papers, PYQs, practice tests, and study materials for CBSE Board Exams 2025.",
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
