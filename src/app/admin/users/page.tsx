"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, Search, Users, Shield, ShieldCheck, 
  UserX, UserCheck, Loader2, AlertCircle, Mail, Calendar
} from "lucide-react";
import { useRealtimeUsers } from "@/lib/supabase/realtime";
import { updateUserRole, toggleUserStatus } from "@/lib/supabase/admin-actions";

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { users, loading, refetch } = useRealtimeUsers();

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: 'student' | 'admin') => {
    if (!confirm(`Are you sure you want to make this user ${newRole === 'admin' ? 'an admin' : 'a student'}?`)) {
      return;
    }

    setUpdatingId(userId);
    setError("");

    try {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        setError(result.error || "Failed to update role");
      } else {
        refetch();
      }
    } catch (err) {
      console.error('Role update error:', err);
      setError("An error occurred");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      return;
    }

    setUpdatingId(userId);
    setError("");

    try {
      const result = await toggleUserStatus(userId, !currentStatus);
      if (!result.success) {
        setError(result.error || "Failed to update status");
      } else {
        refetch();
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError("An error occurred");
    } finally {
      setUpdatingId(null);
    }
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const studentCount = users.filter(u => u.role === 'student').length;
  const activeCount = users.filter(u => u.is_active !== false).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-gray-600">View and manage user accounts and roles</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adminCount}</p>
                <p className="text-sm text-gray-500">Admins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studentCount}</p>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <CardTitle className="text-lg">All Users</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {(['all', 'student', 'admin'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        roleFilter === role
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {role === 'all' ? 'All' : role === 'admin' ? 'Admins' : 'Students'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {searchQuery || roleFilter !== 'all' 
                    ? "No users match your filters" 
                    : "No users found"}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">
                              {user.full_name || 'Unnamed User'}
                            </p>
                            {user.role === 'admin' && (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                <Shield className="h-3 w-3" />
                                Admin
                              </span>
                            )}
                            {user.is_active === false && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(user.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {updatingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleChange(
                                user.id, 
                                user.role === 'admin' ? 'student' : 'admin'
                              )}
                              className={user.role === 'admin' ? 'text-gray-600' : 'text-purple-600 border-purple-200'}
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-1" />
                                  Make Admin
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id, user.is_active !== false)}
                              className={user.is_active !== false ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}
                            >
                              {user.is_active !== false ? (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </>
                        )}
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
