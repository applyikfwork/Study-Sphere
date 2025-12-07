import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, BookOpen, TrendingUp, Upload, 
  Settings, LayoutDashboard, FolderOpen, Eye 
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Online School",
  description: "Admin panel for managing notes, sample papers, and content.",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin' || user.email === 'xyzapplywork@gmail.com';

  if (!isAdmin) {
    redirect("/profile");
  }

  const stats = [
    { label: "Total Students", value: "10,245", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Notes", value: "523", icon: FileText, color: "text-green-600", bg: "bg-green-50" },
    { label: "Sample Papers", value: "45", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Views", value: "156K", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const recentUploads = [
    { id: 1, title: "Science Chapter 5 Notes", type: "Notes", date: "2 hours ago", views: 234 },
    { id: 2, title: "Maths Sample Paper Set 3", type: "Sample Paper", date: "5 hours ago", views: 189 },
    { id: 3, title: "SST PYQ 2024", type: "PYQ", date: "1 day ago", views: 567 },
    { id: 4, title: "English Grammar Notes", type: "Notes", date: "2 days ago", views: 432 },
  ];

  const mostViewedNotes = [
    { id: 1, title: "Chemical Reactions & Equations", subject: "Science", views: 12453 },
    { id: 2, title: "Real Numbers", subject: "Maths", views: 10234 },
    { id: 3, title: "Nationalism in India", subject: "SST", views: 8765 },
    { id: 4, title: "A Letter to God", subject: "English", views: 7654 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <Link href="/admin/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Content
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Uploads</CardTitle>
              <Link href="/admin/content">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{upload.title}</p>
                        <p className="text-xs text-gray-500">{upload.type} - {upload.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      {upload.views}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Most Viewed Notes</CardTitle>
              <Link href="/admin/analytics">
                <Button variant="ghost" size="sm">Analytics</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mostViewedNotes.map((note, index) => (
                  <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{note.title}</p>
                        <p className="text-xs text-gray-500">{note.subject}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {note.views.toLocaleString()} views
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/upload">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">Upload Content</h3>
                <p className="text-sm text-gray-500 mt-1">Add notes, papers, PYQs</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/content">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FolderOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">Manage Content</h3>
                <p className="text-sm text-gray-500 mt-1">Edit or delete content</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/settings">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900">Site Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Customize website</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
