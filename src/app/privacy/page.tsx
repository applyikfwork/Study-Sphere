import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | Online School",
  description: "Privacy Policy for Online School - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-100">Last Updated: December 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              At Online School, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, store, and protect information when you use our website.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">a) Information You Provide</h3>
              <p className="text-gray-600 mb-4">We may collect:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Name (optional)</li>
                <li>Email address (optional)</li>
                <li>Messages submitted through forms</li>
                <li>Comments or feedback</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">b) Automatically Collected Data</h3>
              <p className="text-gray-600 mb-4">When you visit our website, we may automatically collect:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Device information</li>
                <li>Browser information</li>
                <li>Cookies</li>
                <li>IP address</li>
                <li>Time spent on pages</li>
              </ul>
              <p className="text-gray-600">This is only for analytics and improving our service.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your data to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Improve website performance</li>
                <li>Provide study materials</li>
                <li>Respond to messages</li>
                <li>Enhance user experience</li>
                <li>Prevent spam and abuse</li>
              </ul>
              <p className="text-gray-600 font-semibold">We never sell your data to anyone.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies Policy</h2>
              <p className="text-gray-600 mb-4">We use cookies to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Improve site speed</li>
                <li>Remember preferences</li>
                <li>Analyze website traffic</li>
              </ul>
              <p className="text-gray-600">Users may turn off cookies in browser settings.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">We may use:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Google Analytics</li>
                <li>AdSense (Ads)</li>
                <li>Firebase or other hosting tools</li>
              </ul>
              <p className="text-gray-600">These third parties have their own privacy policies.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Children&apos;s Privacy</h2>
              <p className="text-gray-600">
                Our platform is designed for students, but we do not collect personal information from children knowingly.
                All content is safe and educational.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-600 mb-4">We use:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Secure servers</li>
                <li>HTTPS</li>
                <li>Encryption tools (where available)</li>
              </ul>
              <p className="text-gray-600">
                However, no website is 100% secure, and we are not responsible for security breaches beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Content Source Disclaimer</h2>
              <p className="text-gray-600 mb-4">Some content on our website may be:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>AI-generated</li>
                <li>Collected from open educational resources</li>
                <li>Created by our team</li>
                <li>Inspired by exam patterns</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We do not claim 100% ownership of non-original content and follow fair-use policies for educational purposes.
              </p>
              <p className="text-gray-600">
                If any copyrighted content is found, contact us, and we will remove it immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Privacy Policy</h2>
              <p className="text-gray-600">
                We may update this policy anytime. Users are encouraged to review the policy periodically.
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions or want content removed, contact us at:{" "}
                <a href="mailto:support@onlineschool.com" className="text-primary hover:underline">
                  support@onlineschool.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/terms" className="text-primary hover:underline">
            View Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
