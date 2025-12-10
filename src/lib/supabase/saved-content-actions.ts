'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'

export type ContentType = 'note' | 'sample_paper' | 'pyq'

export async function saveContent(contentType: ContentType, contentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Please log in to save content' }
    }

    const { data: existing } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single()

    if (existing) {
      return { success: true }
    }

    const { error } = await supabase
      .from('saved_items')
      .insert({
        user_id: user.id,
        content_id: contentId,
        content_type: contentType
      })

    if (error) {
      console.error('Save content error:', error)
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return { success: false, error: 'Save feature is being set up. Please try again later.' }
      }
      return { success: false, error: 'Failed to save content' }
    }

    revalidatePath('/profile')
    return { success: true }
  } catch (err) {
    console.error('Save content error:', err)
    return { success: false, error: 'Failed to save content' }
  }
}

export async function unsaveContent(contentType: ContentType, contentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Please log in to manage saved content' }
    }

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)

    if (error) {
      console.error('Unsave content error:', error)
      return { success: false, error: 'Failed to remove from saved' }
    }

    revalidatePath('/profile')
    return { success: true }
  } catch (err) {
    console.error('Unsave content error:', err)
    return { success: false, error: 'Failed to remove from saved' }
  }
}

export async function checkIfSaved(contentType: ContentType, contentId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single()

    return !!data
  } catch {
    return false
  }
}

export async function removeSavedItem(savedItemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Please log in to manage saved content' }
    }

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('id', savedItemId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Remove saved item error:', error)
      return { success: false, error: 'Failed to remove item' }
    }

    revalidatePath('/profile')
    return { success: true }
  } catch (err) {
    console.error('Remove saved item error:', err)
    return { success: false, error: 'Failed to remove item' }
  }
}
