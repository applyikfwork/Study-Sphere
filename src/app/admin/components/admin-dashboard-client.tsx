'use client'

import { useRealtimeStats, useRealtimeRecentUploads, useRealtimeMostViewed } from '@/lib/supabase/realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Upload, 
  Eye,
  Clock,
  RefreshCw,
  AlertCircle,
  Settings,
  FolderOpen,
  UserCog
} from 'lucide-react'

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return date.toLocaleDateString()
}

function getContentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'notes': 'Notes',
    'important_questions': 'Important Questions',
    'mcqs': 'MCQs',
    'summary': 'Summary',
    'mind_map': 'Mind Map',
    'sample_paper': 'Sample Paper',
    'pyq': 'PYQ'
  }
  return labels[type] || type
}

function getContentTypeBadgeColor(type: string): string {
  const colors: Record<string, string> = {
    'notes': 'bg-blue-100 text-blue-700',
    'important_questions': 'bg-purple-100 text-purple-700',
    'mcqs': 'bg-green-100 text-green-700',
    'summary': 'bg-yellow-100 text-yellow-700',
    'mind_map': 'bg-pink-100 text-pink-700',
    'sample_paper': 'bg-orange-100 text-orange-700',
    'pyq': 'bg-red-100 text-red-700'
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

export default function AdminDashboardClient() {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useRealtimeStats()
  const { uploads, loading: uploadsLoading, refetch: refetchUploads } = useRealtimeRecentUploads(5)
  const { items: mostViewed, loading: viewedLoading, refetch: refetchViewed } = useRealtimeMostViewed(5)

  const statsCards = [
    { 
      label: "Total Students", 
      value: stats?.total_students || 0, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      subValue: stats?.new_users_today ? `+${stats.new_users_today} today` : null
    },
    { 
      label: "Total Notes", 
      value: stats?.total_notes || 0, 
      icon: FileText, 
      color: "text-green-600", 
      bg: "bg-green-50",
      subValue: null
    },
    { 
      label: "Sample Papers", 
      value: stats?.total_sample_papers || 0, 
      icon: BookOpen, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      subValue: null
    },
    { 
      label: "Total Views", 
      value: stats?.total_views || 0, 
      icon: TrendingUp, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      subValue: null
    },
  ]

  const handleRefresh = () => {
    refetchStats()
    refetchUploads()
    refetchViewed()
  }

  if (statsError) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Database Not Connected</h2>
        <p className="text-gray-600 mb-4">
          Please run the SQL setup commands in your Supabase dashboard to create the required tables and functions.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Check the <code className="bg-gray-100 px-2 py-1 rounded">supabase-setup.sql</code> file for the complete setup.
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Real-time statistics from your database</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">
                    {statsLoading ? (
                      <span className="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block"></span>
                    ) : (
                      formatNumber(stat.value)
                    )}
                  </p>
                  {stat.subValue && (
                    <p className="text-xs text-green-600 mt-1">{stat.subValue}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/admin/upload">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Upload Content</p>
                <p className="text-sm text-gray-500">Add new study materials</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/content">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Manage Content</p>
                <p className="text-sm text-gray-500">Edit or delete materials</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <UserCog className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Manage Users</p>
                <p className="text-sm text-gray-500">User roles & permissions</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">Site Settings</p>
                <p className="text-sm text-gray-500">Logo & configuration</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-100 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : uploads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No uploads yet</p>
                <Link href="/admin/upload">
                  <Button variant="link" className="mt-2">Upload your first content</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {uploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{upload.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getContentTypeBadgeColor(upload.content_type)}`}>
                          {getContentTypeLabel(upload.content_type)}
                        </span>
                        {upload.subject_name && (
                          <span className="text-xs text-gray-500">{upload.subject_name}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">{upload.views}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(upload.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              Most Viewed Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewedLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-100 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : mostViewed.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No views recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {mostViewed.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' : 
                        index === 2 ? 'bg-orange-100 text-orange-700' : 
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getContentTypeBadgeColor(item.content_type)}`}>
                            {getContentTypeLabel(item.content_type)}
                          </span>
                          {item.subject_name && (
                            <span className="text-xs text-gray-500">{item.subject_name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatNumber(item.views)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-xs text-gray-400 pt-4 border-t">
        Real-time data • Updates automatically when changes occur
      </div>
    </div>
  )
}
