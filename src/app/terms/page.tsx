import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms & Conditions | Online School",
  description: "Terms and Conditions for Online School - Read our terms of service before using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-indigo-100">Last Updated: December 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 prose prose-gray max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing Online School, you agree to these Terms & Conditions.
                If you do not agree, please discontinue using our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Educational Purpose Only</h2>
              <p className="text-gray-600 mb-4">
                All study material (notes, questions, answers, PDFs) is provided for educational and informational use only.
              </p>
              <p className="text-gray-600 font-semibold">
                We are not officially affiliated with CBSE, NCERT, or any government body.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Content Policy & Ownership</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">a) AI-Generated & Sourced Content</h3>
              <p className="text-gray-600 mb-4">Some content is created using:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>AI tools</li>
                <li>Public exam resources</li>
                <li>Board patterns</li>
                <li>Community contributions</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We strive for accuracy, but we do not guarantee error-free content.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">b) Copyright Notice</h3>
              <p className="text-gray-600 mb-4">
                All third-party content belongs to respective owners. We follow:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Fair use for education</li>
                <li>Non-commercial sharing</li>
              </ul>
              <p className="text-gray-600">
                If any material violates your copyright, contact us and we will remove it within 48 hours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">Users agree:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Not to misuse or copy content for resale</li>
                <li>Not to upload harmful or illegal content</li>
                <li>Not to hack or disrupt the website</li>
              </ul>
              <p className="text-gray-600 font-semibold">
                Any abuse can lead to permanent IP ban.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disclaimer of Warranty</h2>
              <p className="text-gray-600 mb-4">
                Online School provides content &quot;as is&quot;, without guarantees such as:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Accuracy</li>
                <li>Completeness</li>
                <li>Timeliness</li>
                <li>Error-free content</li>
              </ul>
              <p className="text-gray-600 mb-4">We are not responsible for:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Exam results</li>
                <li>Any loss due to using our content</li>
                <li>Technical issues or downtime</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">Online School will not be liable for:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Damages</li>
                <li>Data loss</li>
                <li>Website errors</li>
                <li>Third-party service issues</li>
              </ul>
              <p className="text-gray-600 font-semibold">
                Your use of the site is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. External Links</h2>
              <p className="text-gray-600 mb-4">Our site may include links to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>YouTube</li>
                <li>Other educational websites</li>
                <li>Official government sites</li>
              </ul>
              <p className="text-gray-600">
                We are not responsible for their content or policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications to Terms</h2>
              <p className="text-gray-600">
                We may update these Terms at any time. Continued use means you accept the changes.
              </p>
            </section>

            <section className="bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions or concerns about these terms, contact us at:{" "}
                <a href="mailto:support@onlineschool.com" className="text-primary hover:underline">
                  support@onlineschool.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-primary hover:underline">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
