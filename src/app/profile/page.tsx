import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BookMarked, FileText, Settings, LogOut, Bookmark, Clock, Award, LayoutDashboard } from "lucide-react";

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

  const { data: savedNotesData } = await supabase
    .from('saved_notes')
    .select(`
      id,
      notes (
        id,
        title,
        chapters (
          chapter_number,
          subjects (name)
        )
      )
    `)
    .eq('user_id', user.id)
    .limit(5);

  const { data: activityData } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const savedNotes = savedNotesData?.map((item: Record<string, unknown>) => ({
    id: item.id as string,
    title: (item.notes as Record<string, unknown>)?.title as string || 'Untitled',
    subject: ((item.notes as Record<string, unknown>)?.chapters as Record<string, unknown>)?.subjects as string || 'Unknown',
    chapter: ((item.notes as Record<string, unknown>)?.chapters as Record<string, unknown>)?.chapter_number as number || 1,
  })) || [
    { id: 1, title: "Chemical Reactions & Equations", subject: "Science", chapter: 1 },
    { id: 2, title: "Real Numbers", subject: "Maths", chapter: 1 },
    { id: 3, title: "Nationalism in India", subject: "SST", chapter: 2 },
  ];

  const recentActivity = activityData?.map((item: Record<string, unknown>) => ({
    id: item.id as string,
    action: item.action as string,
    item: item.item_title as string,
    time: getTimeAgo(new Date(item.created_at as string)),
  })) || [
    { id: 1, action: "Viewed Notes", item: "Acids, Bases and Salts", time: "2 hours ago" },
    { id: 2, action: "Downloaded", item: "Science Sample Paper 2025", time: "5 hours ago" },
    { id: 3, action: "Completed Quiz", item: "Maths Chapter 1 MCQs", time: "1 day ago" },
  ];

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
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  Saved Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedNotes.length > 0 ? (
                  <div className="space-y-3">
                    {savedNotes.map((note) => (
                      <Link key={note.id} href={`/class-10/${note.subject.toLowerCase()}/chapter-${note.chapter}`}>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{note.title}</p>
                              <p className="text-sm text-gray-500">{note.subject} - Chapter {note.chapter}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{note.subject}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookMarked className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved notes yet</p>
                    <Link href="/notes">
                      <Button variant="link" className="mt-2">Browse Notes</Button>
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Notes Read</span>
                      <span className="font-medium">12/50</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tests Completed</span>
                      <span className="font-medium">5/20</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>PYQs Solved</span>
                      <span className="font-medium">3/10</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "30%" }} />
                    </div>
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
                    <FileText className="h-4 w-4" />
                    Sample Papers
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
