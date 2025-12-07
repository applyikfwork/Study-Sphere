import { redirect } from "next/navigation";
import { createClientSafe, isSupabaseConfigured } from "@/lib/supabase/server";
import { LayoutDashboard, AlertCircle } from "lucide-react";
import AdminDashboardClient from "./components/admin-dashboard-client";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Admin Dashboard | Online School",
  description: "Admin panel for managing notes, sample papers, and content.",
};

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Supabase Not Configured</h1>
            <p className="text-gray-600 mb-4">
              Please configure your Supabase environment variables to access the admin panel.
            </p>
            <div className="text-left bg-gray-50 p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">Required environment variables:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createClientSafe();
  
  if (!supabase) {
    redirect("/login");
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <AdminDashboardClient />
      </div>
    </div>
  );
}
