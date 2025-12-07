import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  subjects: [
    { name: "Science", href: "/class-10/science" },
    { name: "Mathematics", href: "/class-10/maths" },
    { name: "Social Science", href: "/class-10/sst" },
    { name: "English", href: "/class-10/english" },
    { name: "Hindi", href: "/class-10/hindi" },
  ],
  resources: [
    { name: "Notes", href: "/notes" },
    { name: "Sample Papers", href: "/sample-papers" },
    { name: "PYQs", href: "/pyqs" },
    { name: "Important Questions", href: "/important-questions" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Online School</span>
            </Link>
            <p className="text-sm text-gray-400">
              India&apos;s fastest notes library for Class 10 students. Study smart, score high.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              App Coming Soon
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Subjects</h3>
            <ul className="space-y-3">
              {footerLinks.subjects.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Online School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
