"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Check, AlertCircle, Loader2, X, Files, Link as LinkIcon, Plus } from "lucide-react";
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

interface FileItem {
  id: string;
  uploadMethod: 'file' | 'link';
  file: File | null;
  supabaseLink: string;
  fileName: string;
  title: string;
  contentType: string;
  subjectId: string;
  chapterId: string;
  year: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  fakeViews: string;
  fakeDownloads: string;
}

export default function BulkUploadPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chaptersMap, setChaptersMap] = useState<Record<string, Chapter[]>>({});
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState<Record<string, boolean>>({});

  const [defaultContentType, setDefaultContentType] = useState("notes");
  const [defaultSubjectId, setDefaultSubjectId] = useState("");
  const [defaultChapterId, setDefaultChapterId] = useState("");
  const [defaultYear, setDefaultYear] = useState(new Date().getFullYear().toString());
  const [defaultFakeViews, setDefaultFakeViews] = useState("0");
  const [defaultFakeDownloads, setDefaultFakeDownloads] = useState("0");
  const [defaultChapters, setDefaultChapters] = useState<Chapter[]>([]);
  const [loadingDefaultChapters, setLoadingDefaultChapters] = useState(false);

  const contentTypes = [
    { id: "notes", name: "Notes", needsChapter: true },
    { id: "important_questions", name: "Important Questions", needsChapter: true },
    { id: "mcqs", name: "MCQs", needsChapter: true },
    { id: "summary", name: "Summary", needsChapter: true },
    { id: "mind_map", name: "Mind Map", needsChapter: true },
    { id: "sample_paper", name: "Sample Paper", needsChapter: false },
    { id: "pyq", name: "PYQ", needsChapter: false },
  ];

  const needsChapterForType = useCallback((type: string) => contentTypes.find(t => t.id === type)?.needsChapter ?? true, []);

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
    async function loadDefaultChapters() {
      if (!defaultSubjectId || !needsChapterForType(defaultContentType)) {
        setDefaultChapters([]);
        return;
      }
      
      setLoadingDefaultChapters(true);
      try {
        const data = await getChaptersBySubject(defaultSubjectId);
        setDefaultChapters(data);
        setChaptersMap(prev => ({ ...prev, [defaultSubjectId]: data }));
      } catch (err) {
        console.error('Error loading chapters:', err);
      } finally {
        setLoadingDefaultChapters(false);
      }
    }
    loadDefaultChapters();
  }, [defaultSubjectId, defaultContentType, needsChapterForType]);

  const loadChaptersForFile = useCallback(async (subjectId: string) => {
    if (!subjectId || chaptersMap[subjectId]) return;
    
    setLoadingChapters(prev => ({ ...prev, [subjectId]: true }));
    try {
      const data = await getChaptersBySubject(subjectId);
      setChaptersMap(prev => ({ ...prev, [subjectId]: data }));
    } catch (err) {
      console.error('Error loading chapters:', err);
    } finally {
      setLoadingChapters(prev => ({ ...prev, [subjectId]: false }));
    }
  }, [chaptersMap]);

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
        uploadMethod: 'file',
        file,
        supabaseLink: '',
        fileName: file.name,
        title: generateTitleFromFile(file.name),
        contentType: defaultContentType,
        subjectId: defaultSubjectId,
        chapterId: defaultChapterId,
        year: defaultYear,
        status: 'pending',
        fakeViews: defaultFakeViews,
        fakeDownloads: defaultFakeDownloads,
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  }, [defaultContentType, defaultSubjectId, defaultChapterId, defaultYear, defaultFakeViews, defaultFakeDownloads]);

  const addLinkItem = () => {
    const newItem: FileItem = {
      id: `${Date.now()}-link-${Math.random().toString(36).substr(2, 9)}`,
      uploadMethod: 'link',
      file: null,
      supabaseLink: '',
      fileName: '',
      title: '',
      contentType: defaultContentType,
      subjectId: defaultSubjectId,
      chapterId: defaultChapterId,
      year: defaultYear,
      status: 'pending',
      fakeViews: defaultFakeViews,
      fakeDownloads: defaultFakeDownloads,
    };
    setFiles(prev => [...prev, newItem]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFile = (id: string, updates: Partial<FileItem>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const applyDefaultsToAll = () => {
    setFiles(prev => prev.map(f => ({
      ...f,
      contentType: defaultContentType,
      subjectId: defaultSubjectId,
      chapterId: defaultChapterId,
      year: defaultYear,
      fakeViews: defaultFakeViews,
      fakeDownloads: defaultFakeDownloads,
    })));
  };

  const handleBulkUpload = async () => {
    setGlobalError("");
    
    if (files.length === 0) {
      setGlobalError("Please add files to upload");
      return;
    }

    for (const f of files) {
      if (!f.title.trim()) {
        setGlobalError(`Please enter a title for all items`);
        return;
      }
      if (f.uploadMethod === 'file' && !f.file) {
        setGlobalError(`File is missing for item: ${f.title || 'Untitled'}`);
        return;
      }
      if (f.uploadMethod === 'link' && (!f.supabaseLink.trim() || !f.fileName.trim())) {
        setGlobalError(`Supabase link and file name required for: ${f.title || 'Untitled'}`);
        return;
      }
      if (!f.subjectId) {
        setGlobalError(`Please select a subject for: ${f.title}`);
        return;
      }
      if (needsChapterForType(f.contentType) && !f.chapterId) {
        setGlobalError(`Please select a chapter for: ${f.title}`);
        return;
      }
    }

    setUploading(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })));

    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const fileItem of files) {
      try {
        const formData = new FormData();
        formData.append('contentType', fileItem.contentType);
        formData.append('subjectId', fileItem.subjectId);
        formData.append('chapterId', fileItem.chapterId);
        formData.append('title', fileItem.title);
        formData.append('year', fileItem.year);
        formData.append('fakeViews', fileItem.fakeViews);
        formData.append('fakeDownloads', fileItem.fakeDownloads);
        formData.append('uploadMethod', fileItem.uploadMethod);

        if (fileItem.uploadMethod === 'file' && fileItem.file) {
          formData.append('file', fileItem.file);
        } else if (fileItem.uploadMethod === 'link') {
          formData.append('supabaseLink', fileItem.supabaseLink);
          formData.append('fileName', fileItem.fileName);
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const text = await response.text();
          if (text.includes('Request Entity Too Large') || text.includes('413')) {
            results.push({ id: fileItem.id, success: false, error: 'File too large (max 4MB). Use Supabase link option.' });
          } else {
            results.push({ id: fileItem.id, success: false, error: text.slice(0, 100) });
          }
          continue;
        }

        let result;
        try {
          result = await response.json();
        } catch {
          results.push({ id: fileItem.id, success: false, error: 'Invalid server response' });
          continue;
        }

        if (result?.success) {
          results.push({ id: fileItem.id, success: true });
        } else {
          results.push({ id: fileItem.id, success: false, error: result?.error || 'Upload failed' });
        }
      } catch (err) {
        results.push({ id: fileItem.id, success: false, error: err instanceof Error ? err.message : 'Upload failed' });
      }
    }

    setFiles(prev => prev.map(f => {
      const result = results.find(r => r.id === f.id);
      if (result) {
        return {
          ...f,
          status: result.success ? 'success' : 'error',
          error: result.error,
        };
      }
      return f;
    }));

    const successCount = results.filter(r => r.success).length;
    if (successCount === files.length) {
      setCompleted(true);
    }

    setUploading(false);
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
              <p className="text-gray-600">Upload multiple files with individual settings</p>
            </div>
            <Link href="/admin/upload">
              <Button variant="outline">Single Upload</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
        {completed ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Upload Complete!</h2>
              <p className="text-gray-600 mb-2">
                Successfully uploaded {successCount} of {files.length} items.
              </p>
              {errorCount > 0 && (
                <p className="text-red-600 mb-4">
                  {errorCount} item(s) failed to upload.
                </p>
              )}
              <div className="flex gap-4 justify-center mt-6">
                <Button onClick={resetForm}>
                  Upload More
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
                <CardTitle>Default Settings</CardTitle>
                <CardDescription>
                  Set defaults for new items. You can customize each item individually below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {globalError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{globalError}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setDefaultContentType(type.id);
                        setDefaultChapterId("");
                      }}
                      className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                        defaultContentType === type.id
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Subject</label>
                    <select
                      value={defaultSubjectId}
                      onChange={(e) => {
                        setDefaultSubjectId(e.target.value);
                        setDefaultChapterId("");
                      }}
                      className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                      disabled={loadingSubjects}
                    >
                      <option value="">{loadingSubjects ? "Loading..." : "Select"}</option>
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  {needsChapterForType(defaultContentType) ? (
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Chapter</label>
                      <select
                        value={defaultChapterId}
                        onChange={(e) => setDefaultChapterId(e.target.value)}
                        className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                        disabled={!defaultSubjectId || loadingDefaultChapters}
                      >
                        <option value="">{loadingDefaultChapters ? "Loading..." : "Select"}</option>
                        {defaultChapters.map((ch) => (
                          <option key={ch.id} value={ch.id}>{ch.chapter_number}. {ch.title}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Year</label>
                      <select
                        value={defaultYear}
                        onChange={(e) => setDefaultYear(e.target.value)}
                        className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const y = new Date().getFullYear() - i;
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Views</label>
                    <Input
                      type="number"
                      min="0"
                      value={defaultFakeViews}
                      onChange={(e) => setDefaultFakeViews(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Downloads</label>
                    <Input
                      type="number"
                      min="0"
                      value={defaultFakeDownloads}
                      onChange={(e) => setDefaultFakeDownloads(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">&nbsp;</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="w-full h-9"
                      onClick={applyDefaultsToAll}
                      disabled={files.length === 0}
                    >
                      Apply to All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Items ({files.length})</CardTitle>
                    <CardDescription>
                      Add files or Supabase links with individual settings
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLinkItem}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFilesChange}
                    className="hidden"
                    id="files-upload"
                    multiple
                  />
                  <label htmlFor="files-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Click to select files</p>
                    <p className="text-xs text-gray-400 mt-1">or use &quot;Add Link&quot; for Supabase URLs</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
                            ) : fileItem.uploadMethod === 'link' ? (
                              <LinkIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">#{index + 1}</span>
                              {fileItem.uploadMethod === 'file' && fileItem.file && (
                                <>
                                  <span className="text-xs text-gray-500 truncate">{fileItem.file.name}</span>
                                  <span className="text-xs text-gray-400">
                                    ({(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB)
                                  </span>
                                  {fileItem.file.size > 4 * 1024 * 1024 && (
                                    <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                      Large file - may fail
                                    </span>
                                  )}
                                </>
                              )}
                              {fileItem.uploadMethod === 'link' && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Supabase Link</span>
                              )}
                            </div>

                            {fileItem.uploadMethod === 'link' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Input
                                  type="url"
                                  placeholder="Supabase storage URL"
                                  value={fileItem.supabaseLink}
                                  onChange={(e) => updateFile(fileItem.id, { supabaseLink: e.target.value })}
                                  disabled={fileItem.status !== 'pending'}
                                  className="text-sm h-8"
                                />
                                <Input
                                  type="text"
                                  placeholder="File name (e.g., Notes.pdf)"
                                  value={fileItem.fileName}
                                  onChange={(e) => updateFile(fileItem.id, { fileName: e.target.value })}
                                  disabled={fileItem.status !== 'pending'}
                                  className="text-sm h-8"
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                              <Input
                                type="text"
                                placeholder="Title"
                                value={fileItem.title}
                                onChange={(e) => updateFile(fileItem.id, { title: e.target.value })}
                                disabled={fileItem.status !== 'pending'}
                                className="text-sm h-8 col-span-2"
                              />
                              <select
                                value={fileItem.contentType}
                                onChange={(e) => updateFile(fileItem.id, { contentType: e.target.value, chapterId: '' })}
                                disabled={fileItem.status !== 'pending'}
                                className="h-8 px-2 rounded-md border border-input bg-background text-xs"
                              >
                                {contentTypes.map((type) => (
                                  <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                              </select>
                              <select
                                value={fileItem.subjectId}
                                onChange={(e) => {
                                  updateFile(fileItem.id, { subjectId: e.target.value, chapterId: '' });
                                  if (e.target.value) loadChaptersForFile(e.target.value);
                                }}
                                disabled={fileItem.status !== 'pending' || loadingSubjects}
                                className="h-8 px-2 rounded-md border border-input bg-background text-xs"
                              >
                                <option value="">Subject</option>
                                {subjects.map((sub) => (
                                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                              </select>
                              {needsChapterForType(fileItem.contentType) ? (
                                <select
                                  value={fileItem.chapterId}
                                  onChange={(e) => updateFile(fileItem.id, { chapterId: e.target.value })}
                                  disabled={fileItem.status !== 'pending' || !fileItem.subjectId || loadingChapters[fileItem.subjectId]}
                                  className="h-8 px-2 rounded-md border border-input bg-background text-xs"
                                >
                                  <option value="">
                                    {loadingChapters[fileItem.subjectId] ? "Loading..." : "Chapter"}
                                  </option>
                                  {(chaptersMap[fileItem.subjectId] || []).map((ch) => (
                                    <option key={ch.id} value={ch.id}>{ch.chapter_number}. {ch.title}</option>
                                  ))}
                                </select>
                              ) : (
                                <select
                                  value={fileItem.year}
                                  onChange={(e) => updateFile(fileItem.id, { year: e.target.value })}
                                  disabled={fileItem.status !== 'pending'}
                                  className="h-8 px-2 rounded-md border border-input bg-background text-xs"
                                >
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const y = new Date().getFullYear() - i;
                                    return <option key={y} value={y}>{y}</option>;
                                  })}
                                </select>
                              )}
                              <div className="flex gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Views"
                                  value={fileItem.fakeViews}
                                  onChange={(e) => updateFile(fileItem.id, { fakeViews: e.target.value })}
                                  disabled={fileItem.status !== 'pending'}
                                  className="text-xs h-8 w-16"
                                />
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="DL"
                                  value={fileItem.fakeDownloads}
                                  onChange={(e) => updateFile(fileItem.id, { fakeDownloads: e.target.value })}
                                  disabled={fileItem.status !== 'pending'}
                                  className="text-xs h-8 w-16"
                                />
                              </div>
                            </div>
                            
                            {fileItem.status === 'error' && fileItem.error && (
                              <p className="text-xs text-red-600">{fileItem.error}</p>
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
                          Uploading...
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
