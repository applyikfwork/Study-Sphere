'use server'

import { createClientSafe } from './server'

export interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  class: string
  order_index: number
}

export interface Chapter {
  id: string
  subject_id: string
  title: string
  slug: string
  chapter_number: number
  description: string | null
}

export interface Note {
  id: string
  chapter_id: string
  title: string
  content: string | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  note_type: string
  views: number
  downloads: number
  is_published: boolean
  created_at: string
  chapters?: {
    title: string
    chapter_number: number
    subject_id: string
    subjects?: {
      name: string
      slug: string
    } | null
  } | null
}

export interface SamplePaper {
  id: string
  subject_id: string
  title: string
  year: number
  set_number: number
  file_url: string | null
  file_name: string | null
  file_size: number | null
  solution_url: string | null
  views: number
  downloads: number
  is_published: boolean
  created_at: string
  subjects?: {
    name: string
    slug: string
  } | null
}

export interface PYQ {
  id: string
  subject_id: string
  title: string
  year: number
  file_url: string | null
  file_name: string | null
  file_size: number | null
  solution_url: string | null
  views: number
  downloads: number
  is_published: boolean
  created_at: string
  subjects?: {
    name: string
    slug: string
  } | null
}

export async function getPublicSubjects(): Promise<Subject[]> {
  try {
    const supabase = await createClientSafe()
    if (!supabase) {
      console.log('[DEBUG] Supabase client is null - check environment variables')
      return []
    }
    
    console.log('[DEBUG] Fetching subjects from Supabase...')
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('order_index')
    
    if (error) {
      console.error('[DEBUG] Error fetching subjects:', error.message, error.code)
      return []
    }
    
    console.log('[DEBUG] Subjects fetched:', data?.length || 0, 'items')
    return data || []
  } catch (err) {
    console.error('[DEBUG] Exception in getPublicSubjects:', err)
    return []
  }
}

export async function getPublicChapters(subjectSlug: string): Promise<Chapter[]> {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return []
    
    const { data: subject } = await supabase
      .from('subjects')
      .select('id')
      .eq('slug', subjectSlug)
      .single()
    
    if (!subject) return []
    
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subject.id)
      .order('chapter_number')
    
    if (error) {
      console.error('Error fetching chapters:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('Error in getPublicChapters:', err)
    return []
  }
}

export async function getSubjectWithChapters(subjectSlug: string) {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return null
    
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', subjectSlug)
      .single()
    
    if (subjectError || !subject) return null
    
    const { data: chapters } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subject.id)
      .order('chapter_number')
    
    return { ...subject, chapters: chapters || [] }
  } catch (err) {
    console.error('Error in getSubjectWithChapters:', err)
    return null
  }
}

export async function getChapterWithNotes(subjectSlug: string, chapterNumber: number) {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return null
    
    const { data: subject } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', subjectSlug)
      .single()
    
    if (!subject) return null
    
    const { data: chapter } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subject.id)
      .eq('chapter_number', chapterNumber)
      .single()
    
    if (!chapter) return null
    
    const { data: notes } = await supabase
      .from('notes')
      .select('*')
      .eq('chapter_id', chapter.id)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    return { subject, chapter, notes: notes || [] }
  } catch (err) {
    console.error('Error in getChapterWithNotes:', err)
    return null
  }
}

export async function getPublicNotes(): Promise<Note[]> {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('notes')
      .select(`
        id,
        chapter_id,
        title,
        content,
        file_url,
        file_name,
        file_size,
        note_type,
        views,
        is_published,
        created_at,
        chapters (
          title,
          chapter_number,
          subject_id,
          subjects (
            name,
            slug
          )
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching notes:', error)
      return []
    }
    
    if (!data) return []
    
    return data as unknown as Note[]
  } catch (err) {
    console.error('Error in getPublicNotes:', err)
    return []
  }
}

export async function getNotesBySubject(subjectSlug: string): Promise<Note[]> {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return []
    
    const { data: subject } = await supabase
      .from('subjects')
      .select('id')
      .eq('slug', subjectSlug)
      .single()
    
    if (!subject) return []
    
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('subject_id', subject.id)
    
    if (!chapters || chapters.length === 0) return []
    
    const chapterIds = chapters.map(c => c.id)
    
    const { data, error } = await supabase
      .from('notes')
      .select(`
        id,
        chapter_id,
        title,
        content,
        file_url,
        file_name,
        file_size,
        note_type,
        views,
        is_published,
        created_at,
        chapters (
          title,
          chapter_number,
          subject_id,
          subjects (
            name,
            slug
          )
        )
      `)
      .in('chapter_id', chapterIds)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching notes by subject:', error)
      return []
    }
    
    if (!data) return []
    
    return data as unknown as Note[]
  } catch (err) {
    console.error('Error in getNotesBySubject:', err)
    return []
  }
}

export async function getPublicSamplePapers(): Promise<SamplePaper[]> {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('sample_papers')
      .select(`
        id,
        subject_id,
        title,
        year,
        set_number,
        file_url,
        file_name,
        file_size,
        solution_url,
        views,
        is_published,
        created_at,
        subjects (
          name,
          slug
        )
      `)
      .eq('is_published', true)
      .order('year', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching sample papers:', error)
      return []
    }
    
    if (!data) return []
    
    return data as unknown as SamplePaper[]
  } catch (err) {
    console.error('Error in getPublicSamplePapers:', err)
    return []
  }
}

export async function getPublicPYQs(): Promise<PYQ[]> {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('pyqs')
      .select(`
        id,
        subject_id,
        title,
        year,
        file_url,
        file_name,
        file_size,
        solution_url,
        views,
        is_published,
        created_at,
        subjects (
          name,
          slug
        )
      `)
      .eq('is_published', true)
      .order('year', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching PYQs:', error)
      return []
    }
    
    if (!data) return []
    
    return data as unknown as PYQ[]
  } catch (err) {
    console.error('Error in getPublicPYQs:', err)
    return []
  }
}

export async function incrementViews(tableName: string, id: string) {
  try {
    const supabase = await createClientSafe()
    if (!supabase) return
    
    await supabase.rpc('increment_views', { table_name: tableName, row_id: id })
  } catch (err) {
    console.error('Error incrementing views:', err)
  }
}
