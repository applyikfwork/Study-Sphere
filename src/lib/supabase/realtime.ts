'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface AdminStats {
  total_students: number
  total_admins: number
  total_notes: number
  total_sample_papers: number
  total_pyqs: number
  total_views: number
  new_users_today: number
  new_content_today: number
}

export interface RecentUpload {
  id: string
  title: string
  content_type: string
  subject_name: string | null
  views: number
  created_at: string
}

export interface MostViewed {
  id: string
  title: string
  content_type: string
  subject_name: string | null
  views: number
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }

    try {
      const { data, error: rpcError } = await supabase.rpc('get_admin_stats')
      if (rpcError) throw rpcError
      setStats(data as AdminStats)
      setError(null)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()

    const supabase = createClient()
    if (!supabase) return

    const channels: RealtimeChannel[] = []

    const tablesForStats = ['profiles', 'notes', 'sample_papers', 'pyqs']
    
    tablesForStats.forEach(table => {
      const channel = supabase
        .channel(`stats-${table}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          () => {
            fetchStats()
          }
        )
        .subscribe()
      
      channels.push(channel)
    })

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
    }
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

export function useRealtimeRecentUploads(limit: number = 10) {
  const [uploads, setUploads] = useState<RecentUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUploads = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }

    try {
      const { data, error: rpcError } = await supabase.rpc('get_recent_uploads', { limit_count: limit })
      if (rpcError) throw rpcError
      setUploads(data as RecentUpload[])
      setError(null)
    } catch (err) {
      console.error('Error fetching uploads:', err)
      setError('Failed to fetch recent uploads')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchUploads()

    const supabase = createClient()
    if (!supabase) return

    const channels: RealtimeChannel[] = []
    const tables = ['notes', 'sample_papers', 'pyqs']
    
    tables.forEach(table => {
      const channel = supabase
        .channel(`uploads-${table}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table },
          () => {
            fetchUploads()
          }
        )
        .subscribe()
      
      channels.push(channel)
    })

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
    }
  }, [fetchUploads])

  return { uploads, loading, error, refetch: fetchUploads }
}

export function useRealtimeMostViewed(limit: number = 10) {
  const [items, setItems] = useState<MostViewed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }

    try {
      const { data, error: rpcError } = await supabase.rpc('get_most_viewed', { limit_count: limit })
      if (rpcError) throw rpcError
      setItems(data as MostViewed[])
      setError(null)
    } catch (err) {
      console.error('Error fetching most viewed:', err)
      setError('Failed to fetch most viewed')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchItems()

    const supabase = createClient()
    if (!supabase) return

    const channels: RealtimeChannel[] = []
    const tables = ['notes', 'sample_papers', 'pyqs']
    
    tables.forEach(table => {
      const channel = supabase
        .channel(`views-${table}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table },
          () => {
            fetchItems()
          }
        )
        .subscribe()
      
      channels.push(channel)
    })

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel)
      })
    }
  }, [fetchItems])

  return { items, loading, error, refetch: fetchItems }
}

export function useRealtimeUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      setUsers(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()

    const supabase = createClient()
    if (!supabase) return

    const channel = supabase
      .channel('users-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchUsers])

  return { users, loading, error, refetch: fetchUsers }
}

export function useRealtimeContent(contentType: 'notes' | 'sample_papers' | 'pyqs') {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }

    try {
      let query

      if (contentType === 'notes') {
        query = supabase
          .from('notes')
          .select(`
            *,
            chapters (
              title,
              chapter_number,
              subjects (name, slug)
            )
          `)
          .order('created_at', { ascending: false })
      } else if (contentType === 'sample_papers') {
        query = supabase
          .from('sample_papers')
          .select(`
            *,
            subjects (name, slug)
          `)
          .order('created_at', { ascending: false })
      } else {
        query = supabase
          .from('pyqs')
          .select(`
            *,
            subjects (name, slug)
          `)
          .order('created_at', { ascending: false })
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      setContent(data || [])
      setError(null)
    } catch (err) {
      console.error(`Error fetching ${contentType}:`, err)
      setError(`Failed to fetch ${contentType}`)
    } finally {
      setLoading(false)
    }
  }, [contentType])

  useEffect(() => {
    fetchContent()

    const supabase = createClient()
    if (!supabase) return

    const channel = supabase
      .channel(`${contentType}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: contentType },
        () => {
          fetchContent()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [contentType, fetchContent])

  return { content, loading, error, refetch: fetchContent }
}
