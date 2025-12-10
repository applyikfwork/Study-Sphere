"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

export async function saveItem(contentId: string, contentType: 'note' | 'pyq' | 'sample_paper') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "You must be logged in to save items" }
  }

  const { error } = await supabase
    .from('saved_items')
    .insert({
      user_id: user.id,
      content_id: contentId,
      content_type: contentType
    })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: "Item already saved" }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function unsaveItem(contentId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "You must be logged in" }
  }

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', user.id)
    .eq('content_id', contentId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function isItemSaved(contentId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .single()

  return !!data
}

export async function getSavedItems() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getSavedItemsWithDetails() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { notes: [], pyqs: [], samplePapers: [] }

  const { data: savedItems } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!savedItems || savedItems.length === 0) {
    return { notes: [], pyqs: [], samplePapers: [] }
  }

  const noteIds = savedItems.filter(i => i.content_type === 'note').map(i => i.content_id)
  const pyqIds = savedItems.filter(i => i.content_type === 'pyq').map(i => i.content_id)
  const samplePaperIds = savedItems.filter(i => i.content_type === 'sample_paper').map(i => i.content_id)

  const [notesResult, pyqsResult, samplePapersResult] = await Promise.all([
    noteIds.length > 0 
      ? supabase.from('notes').select('id, title, file_url, note_type, chapters(chapter_number, subjects(name))').in('id', noteIds)
      : { data: [] },
    pyqIds.length > 0 
      ? supabase.from('pyqs').select('id, title, file_url, year, subjects(name)').in('id', pyqIds)
      : { data: [] },
    samplePaperIds.length > 0 
      ? supabase.from('sample_papers').select('id, title, file_url, year, subjects(name)').in('id', samplePaperIds)
      : { data: [] }
  ])

  return {
    notes: notesResult.data || [],
    pyqs: pyqsResult.data || [],
    samplePapers: samplePapersResult.data || []
  }
}
