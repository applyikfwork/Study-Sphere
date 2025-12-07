"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Check } from "lucide-react";

export default function UploadPage() {
  const [contentType, setContentType] = useState("notes");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subjects = [
    { id: "science", name: "Science" },
    { id: "maths", name: "Mathematics" },
    { id: "sst", name: "Social Science" },
    { id: "english", name: "English" },
    { id: "hindi", name: "Hindi" },
  ];

  const contentTypes = [
    { id: "notes", name: "Notes" },
    { id: "sample-paper", name: "Sample Paper" },
    { id: "pyq", name: "Previous Year Question" },
    { id: "important-questions", name: "Important Questions" },
    { id: "mind-map", name: "Mind Map" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploading(false);
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      setTitle("");
      setFile(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Upload Content</h1>
          <p className="text-gray-600">Add new notes, sample papers, or other study materials</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-8">
        {success ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
              <p className="text-gray-600">Your content has been uploaded and is now available to students.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upload New Content</CardTitle>
              <CardDescription>
                Fill in the details and upload your file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setContentType(type.id)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          contentType === type.id
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chapter (Optional)</label>
                    <select
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select Chapter</option>
                      {[...Array(15)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Chapter {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    type="text"
                    placeholder="Enter content title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload File (PDF)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-8 w-8 text-primary" />
                          <span className="font-medium text-gray-900">{file.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400 mt-1">PDF files only (max 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Content
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
