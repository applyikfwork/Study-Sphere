"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ArrowLeft, Search, Trash2, Edit, Eye, FileText, 
  BookOpen, HelpCircle, Loader2, AlertCircle, ExternalLink
} from "lucide-react";
import { useRealtimeContent } from "@/lib/supabase/realtime";
import { deleteContent, updateContent } from "@/lib/supabase/admin-actions";

type ContentTab = 'notes' | 'sample_papers' | 'pyqs';

function getContentTypeIcon(type: string) {
  switch (type) {
    case 'notes': return <FileText className="h-4 w-4" />;
    case 'sample_paper': return <BookOpen className="h-4 w-4" />;
    case 'pyq': return <HelpCircle className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
}

function getContentTypeBadge(type: string) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    'notes': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Notes' },
    'important_questions': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Important Q' },
    'mcqs': { bg: 'bg-green-100', text: 'text-green-700', label: 'MCQs' },
    'summary': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Summary' },
    'mind_map': { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Mind Map' },
  };
  const badge = badges[type] || { bg: 'bg-gray-100', text: 'text-gray-700', label: type };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  );
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('notes');
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  const { content, loading, refetch } = useRealtimeContent(activeTab);

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const result = await deleteContent(type, id);
      if (!result.success) {
        setError(result.error || "Failed to delete");
      } else {
        refetch();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item: { id: string; title: string }) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleSaveEdit = async (id: string, type: string) => {
    if (!editTitle.trim()) {
      setError("Title cannot be empty");
      return;
    }

    try {
      const result = await updateContent(type, id, { title: editTitle });
      if (!result.success) {
        setError(result.error || "Failed to update");
      } else {
        setEditingId(null);
        refetch();
      }
    } catch (err) {
      console.error('Update error:', err);
      setError("An error occurred");
    }
  };

  const handleTogglePublish = async (id: string, type: string, currentStatus: boolean) => {
    try {
      const result = await updateContent(type, id, { is_published: !currentStatus });
      if (!result.success) {
        setError(result.error || "Failed to update");
      } else {
        refetch();
      }
    } catch (err) {
      console.error('Toggle error:', err);
      setError("An error occurred");
    }
  };

  const tabs = [
    { id: 'notes' as ContentTab, label: 'Notes', count: 0 },
    { id: 'sample_papers' as ContentTab, label: 'Sample Papers', count: 0 },
    { id: 'pyqs' as ContentTab, label: 'PYQs', count: 0 },
  ];

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
              <h1 className="text-2xl font-bold">Manage Content</h1>
              <p className="text-gray-600">View, edit, and delete your uploaded content</p>
            </div>
            <Link href="/admin/upload">
              <Button>Upload New</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
              &times;
            </button>
          </div>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading content...</p>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? "No content matches your search" : "No content uploaded yet"}
                </p>
                <Link href="/admin/upload">
                  <Button variant="link" className="mt-2">Upload your first content</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {filteredContent.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {getContentTypeIcon(activeTab === 'notes' ? (item.note_type || 'notes') : activeTab)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingId === item.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="flex-1"
                                autoFocus
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleSaveEdit(item.id, activeTab === 'notes' ? (item.note_type || 'notes') : activeTab)}
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-900 truncate">{item.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {activeTab === 'notes' && getContentTypeBadge(item.note_type || 'notes')}
                                {item.chapters?.subjects?.name && (
                                  <span className="text-xs text-gray-500">
                                    {item.chapters.subjects.name} - Ch. {item.chapters.chapter_number}
                                  </span>
                                )}
                                {item.subjects?.name && (
                                  <span className="text-xs text-gray-500">{item.subjects.name}</span>
                                )}
                                {item.year && (
                                  <span className="text-xs text-gray-500">Year: {item.year}</span>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.is_published !== false 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {item.is_published !== false ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Eye className="h-4 w-4" />
                          {item.views || 0}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {item.file_url && (
                            <a 
                              href={item.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                            disabled={editingId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(
                              item.id, 
                              activeTab === 'notes' ? (item.note_type || 'notes') : activeTab, 
                              item.is_published !== false
                            )}
                            className={`px-2 py-1 text-xs rounded ${
                              item.is_published !== false 
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                          >
                            {item.is_published !== false ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, activeTab === 'notes' ? (item.note_type || 'notes') : activeTab)}
                            className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600"
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Real-time updates enabled - Changes appear automatically
        </p>
      </div>
    </div>
  );
}
