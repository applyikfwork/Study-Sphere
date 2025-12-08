"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Check, AlertCircle, Loader2, X, Files } from "lucide-react";
import { bulkUploadContent, getSubjects, getChaptersBySubject } from "@/lib/supabase/admin-actions";

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

interface FileItem {
  id: string;
  file: File;
  title: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  fakeViews: string;
  fakeDownloads: string;
}

export default function BulkUploadPage() {
  const [contentType, setContentType] = useState("notes");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [defaultFakeViews, setDefaultFakeViews] = useState("0");
  const [defaultFakeDownloads, setDefaultFakeDownloads] = useState("0");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [globalError, setGlobalError] = useState("");

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

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error('Error loading subjects:', err);
        setGlobalError('Failed to load subjects');
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

  const generateTitleFromFile = (fileName: string): string => {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.size > 10 * 1024 * 1024) {
        setGlobalError(`File "${file.name}" exceeds 10MB limit and was skipped`);
        continue;
      }
      
      newFiles.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        title: generateTitleFromFile(file.name),
        status: 'pending',
        fakeViews: defaultFakeViews,
        fakeDownloads: defaultFakeDownloads,
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  }, [defaultFakeViews, defaultFakeDownloads]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileTitle = (id: string, title: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, title } : f));
  };

  const updateFileViews = (id: string, fakeViews: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, fakeViews } : f));
  };

  const updateFileDownloads = (id: string, fakeDownloads: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, fakeDownloads } : f));
  };

  const applyDefaultViewsToAll = () => {
    setFiles(prev => prev.map(f => ({ ...f, fakeViews: defaultFakeViews, fakeDownloads: defaultFakeDownloads })));
  };

  const handleBulkUpload = async () => {
    setGlobalError("");
    
    if (files.length === 0) {
      setGlobalError("Please add files to upload");
      return;
    }

    if (needsChapter) {
      if (!subjectId) {
        setGlobalError("Please select a subject");
        return;
      }
      if (!chapterId) {
        setGlobalError("Please select a chapter");
        return;
      }
    } else {
      if (!subjectId) {
        setGlobalError("Please select a subject");
        return;
      }
    }

    setUploading(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })));

    try {
      const formData = new FormData();
      formData.append('contentType', contentType);
      formData.append('subjectId', subjectId);
      formData.append('chapterId', chapterId);
      formData.append('year', year);
      formData.append('fileCount', files.length.toString());

      files.forEach((f, index) => {
        formData.append(`file_${index}_id`, f.id);
        formData.append(`file_${index}`, f.file);
        formData.append(`file_${index}_title`, f.title);
        formData.append(`file_${index}_views`, f.fakeViews);
        formData.append(`file_${index}_downloads`, f.fakeDownloads);
      });

      const result = await bulkUploadContent(formData);

      if (!result) {
        setGlobalError("Server error: No response from upload service");
        setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: 'Server error' })));
        return;
      }

      if (result.results) {
        setFiles(prev => prev.map(f => {
          const fileResult = result.results.find((r: { id: string; success: boolean; error?: string }) => r.id === f.id);
          if (fileResult) {
            return {
              ...f,
              status: fileResult.success ? 'success' : 'error',
              error: fileResult.error,
            };
          }
          return f;
        }));
      }

      const successCount = result.results?.filter((r: { success: boolean }) => r.success).length || 0;
      const totalCount = files.length;
      
      if (successCount === totalCount) {
        setCompleted(true);
      }

    } catch (err) {
      console.error('Bulk upload error:', err);
      setGlobalError(err instanceof Error ? err.message : "An error occurred during upload");
      setFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, status: 'error', error: 'Upload failed' } : f));
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setCompleted(false);
    setGlobalError("");
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const pendingCount = files.filter(f => f.status === 'pending' || f.status === 'uploading').length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Files className="h-6 w-6" />
                Bulk Upload
              </h1>
              <p className="text-gray-600">Upload multiple files at once</p>
            </div>
            <Link href="/admin/upload">
              <Button variant="outline">Single Upload</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-8">
        {completed ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Upload Complete!</h2>
              <p className="text-gray-600 mb-2">
                Successfully uploaded {successCount} of {files.length} files.
              </p>
              {errorCount > 0 && (
                <p className="text-red-600 mb-4">
                  {errorCount} file(s) failed to upload.
                </p>
              )}
              <div className="flex gap-4 justify-center mt-6">
                <Button onClick={resetForm}>
                  Upload More Files
                </Button>
                <Link href="/admin/content">
                  <Button variant="outline">View All Content</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
                <CardDescription>
                  Configure settings that apply to all files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {globalError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Error</p>
                        <p className="text-sm mt-1">{globalError}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const y = new Date().getFullYear() - i;
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default View Count</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={defaultFakeViews}
                      onChange={(e) => setDefaultFakeViews(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Download Count</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={defaultFakeDownloads}
                      onChange={(e) => setDefaultFakeDownloads(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">&nbsp;</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={applyDefaultViewsToAll}
                      disabled={files.length === 0}
                    >
                      Apply to All Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Files ({files.length})</CardTitle>
                <CardDescription>
                  Add multiple PDF files to upload
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFilesChange}
                    className="hidden"
                    id="files-upload"
                    multiple
                  />
                  <label htmlFor="files-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Click to select multiple files</p>
                    <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX, PPT, PPTX (max 10MB each)</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {files.map((fileItem, index) => (
                      <div 
                        key={fileItem.id} 
                        className={`p-4 rounded-lg border ${
                          fileItem.status === 'success' ? 'bg-green-50 border-green-200' :
                          fileItem.status === 'error' ? 'bg-red-50 border-red-200' :
                          fileItem.status === 'uploading' ? 'bg-blue-50 border-blue-200' :
                          'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {fileItem.status === 'success' ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : fileItem.status === 'error' ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : fileItem.status === 'uploading' ? (
                              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500">#{index + 1}</span>
                              <span className="text-xs text-gray-400 truncate">{fileItem.file.name}</span>
                              <span className="text-xs text-gray-400">
                                ({(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <Input
                                type="text"
                                placeholder="Title"
                                value={fileItem.title}
                                onChange={(e) => updateFileTitle(fileItem.id, e.target.value)}
                                disabled={fileItem.status !== 'pending'}
                                className="text-sm"
                              />
                              <Input
                                type="number"
                                min="0"
                                placeholder="Views"
                                value={fileItem.fakeViews}
                                onChange={(e) => updateFileViews(fileItem.id, e.target.value)}
                                disabled={fileItem.status !== 'pending'}
                                className="text-sm"
                              />
                              <Input
                                type="number"
                                min="0"
                                placeholder="Downloads"
                                value={fileItem.fakeDownloads}
                                onChange={(e) => updateFileDownloads(fileItem.id, e.target.value)}
                                disabled={fileItem.status !== 'pending'}
                                className="text-sm"
                              />
                            </div>
                            {fileItem.status === 'error' && fileItem.error && (
                              <p className="text-xs text-red-600 mt-2">{fileItem.error}</p>
                            )}
                          </div>
                          {fileItem.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => removeFile(fileItem.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <X className="h-4 w-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {uploading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading {pendingCount} files...
                        </span>
                      ) : (
                        <>
                          {successCount > 0 && <span className="text-green-600 mr-3">{successCount} uploaded</span>}
                          {errorCount > 0 && <span className="text-red-600 mr-3">{errorCount} failed</span>}
                          {pendingCount > 0 && <span className="text-gray-600">{pendingCount} pending</span>}
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={uploading}
                      >
                        Clear All
                      </Button>
                      <Button
                        type="button"
                        onClick={handleBulkUpload}
                        disabled={uploading || files.length === 0}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload All ({files.length})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
