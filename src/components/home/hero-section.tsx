import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, PlayCircle, BookOpen, Users, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
              Board Exams 2025 - Full Preparation Kit
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              India&apos;s Fastest{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Notes Library
              </span>{" "}
              for Class 10
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Study Smart. Score High. Access high-quality notes, sample papers, 
              PYQs, and practice tests - all in one place. Prepare for your 
              Board Exams 2025 with confidence.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/notes">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Download className="h-5 w-5" />
                  Download Notes
                </Button>
              </Link>
              <Link href="/class-10">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Start Practice
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">500+ Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">10K+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Top Results</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Science Notes</p>
                      <p className="text-sm text-gray-500">13 Chapters Available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Maths Practice</p>
                      <p className="text-sm text-gray-500">14 Chapters Available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sample Papers 2025</p>
                      <p className="text-sm text-gray-500">Latest Pattern</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
