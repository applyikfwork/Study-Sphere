import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, Target, Users, Award, CheckCircle, Lightbulb, 
  Rocket, Heart, Star, GraduationCap, Brain, FileText,
  Calculator, FlaskConical, Globe2, Languages, ArrowRight,
  Sparkles, Clock, Shield, Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Online School | Your Complete Learning Partner for Class 10 Success",
  description: "Online School is India's trusted Class 10 learning platform. Access high-quality notes, NCERT solutions, PYQs, sample papers, MCQs, and smart study tools. Free study material for CBSE Board Exams 2025.",
  keywords: [
    "about online school",
    "class 10 learning platform",
    "CBSE class 10 notes",
    "class 10 study material",
    "free class 10 notes",
    "CBSE board exam preparation",
    "class 10 NCERT solutions",
    "class 10 PYQs",
    "class 10 sample papers",
    "class 10 important questions",
    "best class 10 notes website",
    "online school India",
    "class 10 exam preparation",
    "CBSE 2025 preparation",
    "class 10 science notes",
    "class 10 maths notes",
    "class 10 SST notes",
    "class 10 English notes",
    "class 10 Hindi notes"
  ],
  openGraph: {
    title: "About Us - Online School | Your Complete Learning Partner for Class 10 Success",
    description: "India's most trusted Class 10 learning platform. Free notes, NCERT solutions, PYQs, sample papers, and smart study tools for CBSE Board 2025.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Online School | Class 10 Learning Platform",
    description: "India's most trusted Class 10 learning platform. Free notes, NCERT solutions, PYQs, and sample papers for CBSE Board 2025.",
  },
  alternates: {
    canonical: "/about",
  },
};

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "text-blue-600", bg: "bg-blue-100" },
  { name: "Science", icon: FlaskConical, color: "text-green-600", bg: "bg-green-100", desc: "Physics, Chemistry, Biology" },
  { name: "Social Science", icon: Globe2, color: "text-orange-600", bg: "bg-orange-100", desc: "History, Civics, Geography, Economics" },
  { name: "English", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100" },
  { name: "Hindi", icon: Languages, color: "text-pink-600", bg: "bg-pink-100" },
];

const offerings = [
  { title: "NCERT Solutions", icon: FileText },
  { title: "NCERT Exemplar Problems", icon: Brain },
  { title: "PYQs (Last 10 years)", icon: Clock },
  { title: "Important Questions", icon: Star },
  { title: "Sample Papers with Solutions", icon: BookOpen },
  { title: "MCQs for Practice", icon: CheckCircle },
];

const studyTools = [
  { title: "Flashcards", icon: Zap, color: "from-yellow-400 to-orange-500" },
  { title: "Mind Maps", icon: Brain, color: "from-purple-400 to-pink-500" },
  { title: "Concept Boosters", icon: Rocket, color: "from-blue-400 to-cyan-500" },
  { title: "Formula Banks", icon: Calculator, color: "from-green-400 to-emerald-500" },
];

const whyLoveUs = [
  { text: "Clean & distraction-free interface", icon: Sparkles },
  { text: "Notes prepared from NCERT + board trends", icon: BookOpen },
  { text: "Perfect for revision and last-minute preparation", icon: Clock },
  { text: "Free access for all students", icon: Heart },
  { text: "Trusted by parents and teachers", icon: Shield },
];

const commitments = [
  "More chapters",
  "Practice tests",
  "Short videos",
  "Live doubt sessions (coming soon)",
  "Mobile app version",
  "AI-powered doubt solving",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-medium">India&apos;s Trusted Learning Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            About <span className="text-yellow-300">Online School</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Your Complete Learning Partner for Class 10 Success
          </p>
          <p className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed">
            A modern learning platform designed exclusively to help Class 10 students study smarter, 
            score higher, and achieve their academic goals with confidence.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-6">
                <Target className="h-4 w-4" />
                <span className="text-sm font-semibold">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Make Class 10 Learning <span className="text-blue-600">Easy, Engaging & Effective</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that the right guidance can transform exam preparation—and that is why we bring you 
                high-quality notes, chapter-wise explanations, PYQs, sample papers, MCQs, and smart study tools, 
                all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">100% Free Access</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Score 95%+</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-3" />
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-blue-100 text-sm">Study Notes</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <FileText className="h-10 w-10 mx-auto mb-3" />
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-green-100 text-sm">Sample Papers</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Users className="h-10 w-10 mx-auto mb-3" />
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-purple-100 text-sm">Students</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Award className="h-10 w-10 mx-auto mb-3" />
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-orange-100 text-sm">Years PYQs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-2 mb-4">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-semibold">The Problem We Solve</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why We Created Online School
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Today&apos;s students face huge competition, and the exam pressure between December to March is intense. 
              While platforms like PW, Vedantu, Unacademy provide large-scale learning, students often still need more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              "Simple language notes",
              "Quick revision material",
              "Chapter-wise important questions",
              "Reliable resources to score 95%+",
              "Content available anytime, anywhere"
            ].map((need, index) => (
              <Card key={index} className="border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">{need}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-lg text-gray-600 mt-8">
            <span className="font-semibold text-blue-600">Online School</span> is built to solve these exact problems 
            with clean design, fast access, and smart organization.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4" />
              <span className="text-sm font-semibold">What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Class 10 Notes (All Subjects)
            </h2>
            <p className="text-lg text-gray-600">
              Each chapter is written in easy language, short points, and board-exam focused format.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
            {subjects.map((subject, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${subject.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <subject.icon className={`h-8 w-8 ${subject.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{subject.name}</h3>
                  {subject.desc && (
                    <p className="text-xs text-gray-500">{subject.desc}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Board Exam-Oriented Content</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {offerings.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-gray-800">{item.title}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Study Tools</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyTools.map((tool, index) => (
              <Card key={index} className={`bg-gradient-to-br ${tool.color} text-white border-0 shadow-xl hover:scale-105 transition-transform`}>
                <CardContent className="p-6 text-center">
                  <tool.icon className="h-10 w-10 mx-auto mb-3" />
                  <h4 className="font-bold text-lg">{tool.title}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 mb-6">
                <Rocket className="h-4 w-4" />
                <span className="text-sm font-semibold">Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                India&apos;s Most Trusted Class 10 Learning Platform
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To create a platform where students can prepare without stress, save time, 
                and understand every concept clearly.
              </p>
              <div className="space-y-4">
                {[
                  "Learning becomes interesting",
                  "Doubts vanish instantly",
                  "Exam confidence stays high",
                  "Scores improve naturally"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-semibold">Our Approach</span>
              </div>
              <h3 className="text-2xl font-bold mb-8">Student-First Philosophy</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Simple Explanation</p>
                    <p className="text-sm text-indigo-200">Strong Understanding</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Strong Understanding</p>
                    <p className="text-sm text-indigo-200">Top Marks</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Top Marks</p>
                    <p className="text-sm text-indigo-200">Bright Future</p>
                  </div>
                  <Star className="h-5 w-5 ml-auto text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-4 py-2 mb-4">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">Why Students Love Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Thousands of Students
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {whyLoveUs.map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <Rocket className="h-4 w-4" />
              <span className="text-sm font-semibold">Our Commitment</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Promise to Keep Improving
            </h2>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Online School is growing every day—and our goal is to support every Indian Class 10 student on their journey to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {commitments.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Join Online School Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Because Class 10 is the foundation of your future, and you deserve the smartest way to learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/class-10">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/notes">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 font-bold px-8 py-6 text-lg rounded-xl">
                Explore Notes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Online School",
            "description": "India's trusted Class 10 learning platform. Free notes, NCERT solutions, PYQs, sample papers, and study tools for CBSE Board Exams.",
            "url": "https://class10thpdf.vercel.app/about",
            "sameAs": [],
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "educationalCredentialAwarded": "CBSE Class 10 Board Exam Preparation",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Class 10 Study Materials",
              "itemListElement": [
                {
                  "@type": "Course",
                  "name": "Class 10 Mathematics",
                  "description": "Complete Mathematics notes and solutions for CBSE Class 10"
                },
                {
                  "@type": "Course",
                  "name": "Class 10 Science",
                  "description": "Physics, Chemistry, Biology notes for CBSE Class 10"
                },
                {
                  "@type": "Course",
                  "name": "Class 10 Social Science",
                  "description": "History, Civics, Geography, Economics notes for CBSE Class 10"
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
