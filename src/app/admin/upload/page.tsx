"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Check, AlertCircle, Loader2, Link as LinkIcon } from "lucide-react";
import { getSubjects, getChaptersBySubject } from "@/lib/supabase/admin-actions";

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface Chapter {
  id: string;
  title: string;
  chapter_number: number;
}

export default function UploadPage() {
  const router = useRouter();
  const [contentType, setContentType] = useState("notes");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [fakeViews, setFakeViews] = useState("0");
  const [fakeDownloads, setFakeDownloads] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file");
  const [supabaseLink, setSupabaseLink] = useState("");
  const [fileName, setFileName] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);

  const contentTypes = [
    { id: "notes", name: "Notes", needsChapter: true },
    { id: "important_questions", name: "Important Questions", needsChapter: true },
    { id: "mcqs", name: "MCQs", needsChapter: true },
    { id: "summary", name: "Summary", needsChapter: true },
    { id: "mind_map", name: "Mind Map", needsChapter: true },
    { id: "sample_paper", name: "Sample Paper", needsChapter: false },
    { id: "pyq", name: "PYQ", needsChapter: false },
  ];

  const needsChapter = contentTypes.find(t => t.id === contentType)?.needsChapter ?? true;
  const _needsYear = contentType === "sample_paper" || contentType === "pyq";
  void _needsYear;

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error('Error loading subjects:', err);
        setError('Failed to load subjects');
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    async function loadChapters() {
      if (!subjectId || !needsChapter) {
        setChapters([]);
        return;
      }
      
      setLoadingChapters(true);
      try {
        const data = await getChaptersBySubject(subjectId);
        setChapters(data);
      } catch (err) {
        console.error('Error loading chapters:', err);
      } finally {
        setLoadingChapters(false);
      }
    }
    loadChapters();
  }, [subjectId, needsChapter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    
    if (uploadMethod === "file" && !file) {
      setError("Please select a file to upload");
      return;
    }

    if (uploadMethod === "link") {
      if (!supabaseLink.trim()) {
        setError("Please enter the Supabase storage link");
        return;
      }
      if (!supabaseLink.includes('supabase') || !supabaseLink.startsWith('http')) {
        setError("Please enter a valid Supabase storage URL");
        return;
      }
      if (!fileName.trim()) {
        setError("Please enter the file name");
        return;
      }
    }

    if (needsChapter) {
      if (!subjectId) {
        setError("Please select a subject to load chapters");
        return;
      }
      if (!chapterId) {
        setError("Please select a chapter");
        return;
      }
    } else {
      if (!subjectId) {
        setError("Please select a subject");
        return;
      }
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('contentType', contentType);
      formData.append('subjectId', subjectId);
      formData.append('chapterId', chapterId);
      formData.append('title', title);
      formData.append('year', year);
      formData.append('fakeViews', fakeViews);
      formData.append('fakeDownloads', fakeDownloads);
      formData.append('uploadMethod', uploadMethod);

      if (uploadMethod === "file" && file) {
        formData.append('file', file);
      } else if (uploadMethod === "link") {
        formData.append('supabaseLink', supabaseLink);
        formData.append('fileName', fileName);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const text = await response.text();
        if (text.includes('Request Entity Too Large') || text.includes('413')) {
          setError("File is too large. Maximum file size is 4MB. Use 'Paste Supabase Link' option for larger files.");
          return;
        }
        setError(`Upload failed: ${response.status} - ${text.slice(0, 100)}`);
        return;
      }
      
      let result;
      try {
        result = await response.json();
      } catch {
        setError("Server returned an invalid response. Please try again.");
        return;
      }
      
      if (!result) {
        setError("Server error: No response from upload service. Please check your Supabase configuration.");
        return;
      }
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setTitle("");
          setFile(null);
          setChapterId("");
          setFakeViews("0");
          setFakeDownloads("0");
          setSupabaseLink("");
          setFileName("");
        }, 3000);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred during upload";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
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
              <p className="text-gray-600 mb-6">Your content has been uploaded and is now available to students.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSuccess(false)}>
                  Upload Another
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin/content')}>
                  View All Content
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upload New Content</CardTitle>
              <CardDescription>
                Upload a file directly or paste a Supabase storage link for larger files (4MB+)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload Error</p>
                      <p className="text-sm mt-1">{error}</p>
                      {error.includes('schema') && (
                        <p className="text-xs mt-2 text-red-600">
                          Tip: Go to Supabase Dashboard &gt; SQL Editor and run the supabase-add-columns.sql script, then reload schema in Project Settings &gt; API.
                        </p>
                      )}
                      {(error.includes('bucket') || error.includes('not found') || error.includes('Bucket not found')) && (
                        <p className="text-xs mt-2 text-red-600">
                          Tip: Go to Supabase Dashboard &gt; Storage and create a new public bucket named &quot;content-files&quot;.
                        </p>
                      )}
                      {(error.includes('policy') || error.includes('denied') || error.includes('permission') || error.includes('violates row-level security')) && (
                        <p className="text-xs mt-2 text-red-600">
                          Tip: Go to Supabase Dashboard &gt; SQL Editor and run the supabase-fix-policies.sql script to fix storage permissions.
                        </p>
                      )}
                      {error.includes('Not authorized') && (
                        <p className="text-xs mt-2 text-red-600">
                          Tip: Make sure you are logged in with an admin account. Check your profile role in Supabase Dashboard &gt; Table Editor &gt; profiles.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {contentTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setContentType(type.id);
                          setChapterId("");
                        }}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject *</label>
                    <select
                      value={subjectId}
                      onChange={(e) => {
                        setSubjectId(e.target.value);
                        setChapterId("");
                      }}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                      disabled={loadingSubjects}
                    >
                      <option value="">
                        {loadingSubjects ? "Loading subjects..." : "Select Subject"}
                      </option>
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  {needsChapter ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chapter *</label>
                      <select
                        value={chapterId}
                        onChange={(e) => setChapterId(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        required
                        disabled={!subjectId || loadingChapters}
                      >
                        <option value="">
                          {loadingChapters ? "Loading chapters..." : 
                           !subjectId ? "Select subject first" : "Select Chapter"}
                        </option>
                        {chapters.map((ch) => (
                          <option key={ch.id} value={ch.id}>
                            {ch.chapter_number}. {ch.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Year *</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        required
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const y = new Date().getFullYear() - i;
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    type="text"
                    placeholder="Enter content title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial View Count</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={fakeViews}
                      onChange={(e) => setFakeViews(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Set initial view count for this content</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Download Count</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={fakeDownloads}
                      onChange={(e) => setFakeDownloads(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Set initial download count for this content</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadMethod("file");
                          setSupabaseLink("");
                          setFileName("");
                        }}
                        className={`p-4 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          uploadMethod === "file"
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadMethod("link");
                          setFile(null);
                        }}
                        className={`p-4 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          uploadMethod === "link"
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                        }`}
                      >
                        <LinkIcon className="h-4 w-4" />
                        Paste Supabase Link
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use &quot;Paste Supabase Link&quot; for files larger than 4MB to avoid upload limits
                    </p>
                  </div>

                  {uploadMethod === "file" ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload File (PDF) *</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {file ? (
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="h-8 w-8 text-primary" />
                              <span className="font-medium text-gray-900">{file.name}</span>
                              <span className="text-sm text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                              {file.size > 4 * 1024 * 1024 && (
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                  Warning: File is larger than 4MB. Consider using &quot;Paste Supabase Link&quot; option.
                                </span>
                              )}
                            </div>
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600">Click to upload or drag and drop</p>
                              <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX, PPT, PPTX (max 4MB recommended)</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Supabase Storage URL *</label>
                        <Input
                          type="url"
                          placeholder="https://xxx.supabase.co/storage/v1/object/public/content-files/..."
                          value={supabaseLink}
                          onChange={(e) => setSupabaseLink(e.target.value)}
                        />
                        <p className="text-xs text-gray-600">
                          Upload your file to Supabase Storage directly, then paste the public URL here
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">File Name *</label>
                        <Input
                          type="text"
                          placeholder="e.g., Chapter-1-Notes.pdf"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                        />
                        <p className="text-xs text-gray-600">
                          Enter the original file name (will be shown to students)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {uploadMethod === "file" ? "Uploading to Supabase..." : "Saving Content..."}
                    </>
                  ) : (
                    <>
                      {uploadMethod === "file" ? <Upload className="h-4 w-4 mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                      {uploadMethod === "file" ? "Upload Content" : "Save Content with Link"}
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
