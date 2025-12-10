import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BookMarked, FileText, Settings, LogOut, Bookmark, Clock, Award, LayoutDashboard, BookOpen, HelpCircle } from "lucide-react";
import { SavedContentTabs } from "./saved-content-tabs";

export const metadata = {
  title: "My Profile | Online School",
  description: "Manage your profile, saved notes, and track your learning progress.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: savedItemsData } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const savedNotes: Array<{ id: string; contentId: string; title: string; subject: string; chapter: number; fileUrl: string | null }> = [];
  const savedSamplePapers: Array<{ id: string; contentId: string; title: string; subject: string; year: number; fileUrl: string | null }> = [];
  const savedPyqs: Array<{ id: string; contentId: string; title: string; subject: string; year: number; fileUrl: string | null }> = [];

  if (savedItemsData) {
    for (const item of savedItemsData) {
      if (item.content_type === 'note') {
        const { data: noteData } = await supabase
          .from('notes')
          .select(`
            id,
            title,
            file_url,
            chapters (
              chapter_number,
              subjects (name)
            )
          `)
          .eq('id', item.content_id)
          .single();
        
        if (noteData) {
          const chapters = noteData.chapters as unknown as { chapter_number: number; subjects: { name: string } | null } | null;
          savedNotes.push({
            id: item.id,
            contentId: item.content_id,
            title: noteData.title || 'Untitled',
            subject: chapters?.subjects?.name || 'Unknown',
            chapter: chapters?.chapter_number || 1,
            fileUrl: noteData.file_url
          });
        }
      } else if (item.content_type === 'sample_paper') {
        const { data: paperData } = await supabase
          .from('sample_papers')
          .select(`
            id,
            title,
            file_url,
            year,
            subjects (name)
          `)
          .eq('id', item.content_id)
          .single();
        
        if (paperData) {
          const subjects = paperData.subjects as unknown as { name: string } | null;
          savedSamplePapers.push({
            id: item.id,
            contentId: item.content_id,
            title: paperData.title || 'Untitled',
            subject: subjects?.name || 'Unknown',
            year: paperData.year || 2024,
            fileUrl: paperData.file_url
          });
        }
      } else if (item.content_type === 'pyq') {
        const { data: pyqData } = await supabase
          .from('pyqs')
          .select(`
            id,
            title,
            file_url,
            year,
            subjects (name)
          `)
          .eq('id', item.content_id)
          .single();
        
        if (pyqData) {
          const subjects = pyqData.subjects as unknown as { name: string } | null;
          savedPyqs.push({
            id: item.id,
            contentId: item.content_id,
            title: pyqData.title || 'Untitled',
            subject: subjects?.name || 'Unknown',
            year: pyqData.year || 2024,
            fileUrl: pyqData.file_url
          });
        }
      }
    }
  }

  const { data: activityData } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const recentActivity = activityData?.map((item: Record<string, unknown>) => ({
    id: item.id as string,
    action: item.action as string,
    item: item.item_title as string,
    time: getTimeAgo(new Date(item.created_at as string)),
  })) || [];

  function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  const userName = profile?.full_name || user.user_metadata?.full_name || "Student";
  const userRole = profile?.role || 'student';

  const totalSaved = savedNotes.length + savedSamplePapers.length + savedPyqs.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userName}</h1>
              <p className="text-blue-100">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Class 10 Student
                </Badge>
                {userRole === 'admin' && (
                  <Badge variant="secondary" className="bg-yellow-500/80 text-white border-0">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-primary" />
                    Saved Content
                  </CardTitle>
                  <Badge variant="outline">{totalSaved} items</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {totalSaved > 0 ? (
                  <SavedContentTabs 
                    notes={savedNotes}
                    samplePapers={savedSamplePapers}
                    pyqs={savedPyqs}
                  />
                ) : (
                  <div className="text-center py-8">
                    <BookMarked className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved content yet</p>
                    <p className="text-sm text-gray-400 mt-1">Save notes, sample papers, and PYQs to access them quickly</p>
                    <Link href="/notes">
                      <Button variant="link" className="mt-2">Browse Content</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}:</span>{" "}
                            {activity.item}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Saved Notes</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{savedNotes.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Sample Papers</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{savedSamplePapers.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium">Saved PYQs</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">{savedPyqs.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userRole === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start gap-2 text-primary border-primary">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/notes">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Browse Notes
                  </Button>
                </Link>
                <Link href="/sample-papers">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BookOpen className="h-4 w-4" />
                    Sample Papers
                  </Button>
                </Link>
                <Link href="/pyqs">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Previous Year Questions
                  </Button>
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700" type="submit">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
