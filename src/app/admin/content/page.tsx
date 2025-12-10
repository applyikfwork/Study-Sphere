"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ArrowLeft, Search, Trash2, Edit, Eye, FileText, 
  BookOpen, HelpCircle, Loader2, AlertCircle, ExternalLink,
  Filter, X, Calendar, SortAsc, SortDesc, ChevronDown
} from "lucide-react";
import { useRealtimeContent } from "@/lib/supabase/realtime";
import { deleteContent, updateContent, getSubjects } from "@/lib/supabase/admin-actions";

type ContentTab = 'notes' | 'sample_papers' | 'pyqs';
type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'title_asc' | 'title_desc';
type PublishFilter = 'all' | 'published' | 'draft';

interface Subject {
  id: string;
  name: string;
  slug: string;
}

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

const noteTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'notes', name: 'Notes' },
  { id: 'important_questions', name: 'Important Questions' },
  { id: 'mcqs', name: 'MCQs' },
  { id: 'summary', name: 'Summary' },
  { id: 'mind_map', name: 'Mind Map' },
];

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'most_viewed', label: 'Most Viewed' },
  { id: 'title_asc', label: 'Title (A-Z)' },
  { id: 'title_desc', label: 'Title (Z-A)' },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('notes');
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedNoteType, setSelectedNoteType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const { content, loading, refetch } = useRealtimeContent(activeTab);

  useEffect(() => {
    async function loadSubjects() {
      const data = await getSubjects();
      setSubjects(data);
    }
    loadSubjects();
  }, []);

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    content.forEach(item => {
      if (item.year) yearSet.add(item.year);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [content]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubject !== 'all') count++;
    if (selectedNoteType !== 'all') count++;
    if (selectedYear !== 'all') count++;
    if (publishFilter !== 'all') count++;
    return count;
  }, [selectedSubject, selectedNoteType, selectedYear, publishFilter]);

  const filteredAndSortedContent = useMemo(() => {
    let filtered = content.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(item => {
        const subjectSlug = item.chapters?.subjects?.slug || item.subjects?.slug;
        return subjectSlug === selectedSubject;
      });
    }

    if (activeTab === 'notes' && selectedNoteType !== 'all') {
      filtered = filtered.filter(item => item.note_type === selectedNoteType);
    }

    if ((activeTab === 'sample_papers' || activeTab === 'pyqs') && selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year?.toString() === selectedYear);
    }

    if (publishFilter !== 'all') {
      filtered = filtered.filter(item => {
        const isPublished = item.is_published !== false;
        return publishFilter === 'published' ? isPublished : !isPublished;
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'most_viewed':
          return (b.views || 0) - (a.views || 0);
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [content, searchQuery, selectedSubject, selectedNoteType, selectedYear, publishFilter, sortBy, activeTab]);

  const clearAllFilters = () => {
    setSelectedSubject('all');
    setSelectedNoteType('all');
    setSelectedYear('all');
    setPublishFilter('all');
    setSearchQuery('');
  };

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
    { id: 'notes' as ContentTab, label: 'Notes', icon: FileText },
    { id: 'sample_papers' as ContentTab, label: 'Sample Papers', icon: BookOpen },
    { id: 'pyqs' as ContentTab, label: 'PYQs', icon: HelpCircle },
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
              <p className="text-gray-600">View, edit, filter, and manage your uploaded content</p>
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
          <CardHeader className="border-b space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedNoteType('all');
                        setSelectedYear('all');
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
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
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="gap-2"
                  >
                    {sortBy === 'newest' || sortBy === 'oldest' ? (
                      sortBy === 'newest' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortAsc className="h-4 w-4" />
                    )}
                    Sort
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10">
                      {sortOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                            sortBy === option.id ? 'bg-gray-50 font-medium' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-gray-700">Filter Options</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.slug}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  {activeTab === 'notes' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Content Type</label>
                      <select
                        value={selectedNoteType}
                        onChange={(e) => setSelectedNoteType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      >
                        {noteTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(activeTab === 'sample_papers' || activeTab === 'pyqs') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Year
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="all">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year.toString()}>{year}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select
                      value={publishFilter}
                      onChange={(e) => setPublishFilter(e.target.value as PublishFilter)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredAndSortedContent.length}</span> of{" "}
                <span className="font-medium">{content.length}</span> items
              </p>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Active filters:</span>
                  {selectedSubject !== 'all' && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                      {subjects.find(s => s.slug === selectedSubject)?.name || selectedSubject}
                    </span>
                  )}
                  {selectedNoteType !== 'all' && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                      {noteTypes.find(t => t.id === selectedNoteType)?.name}
                    </span>
                  )}
                  {selectedYear !== 'all' && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                      {selectedYear}
                    </span>
                  )}
                  {publishFilter !== 'all' && (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      publishFilter === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {publishFilter === 'published' ? 'Published' : 'Draft'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading content...</p>
              </div>
            ) : filteredAndSortedContent.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {searchQuery || activeFiltersCount > 0 
                    ? "No content matches your filters" 
                    : "No content uploaded yet"}
                </p>
                {(searchQuery || activeFiltersCount > 0) && (
                  <Button variant="link" className="mt-2" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                )}
                {!searchQuery && activeFiltersCount === 0 && (
                  <Link href="/admin/upload">
                    <Button variant="link" className="mt-2">Upload your first content</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredAndSortedContent.map((item) => (
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
                              <div className="flex flex-wrap items-center gap-2 mt-1">
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
