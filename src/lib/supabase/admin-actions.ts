'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'

export async function checkAdminAccess(): Promise<{ 
  isAdmin: boolean; 
  userId?: string; 
  error: string | null;
  supabase?: SupabaseClient;
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return { isAdmin: false, error: 'Authentication failed: ' + authError.message }
    }
    
    if (!user) {
      return { isAdmin: false, error: 'Not authenticated. Please log in.' }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile error:', profileError)
    }

    const isAdmin = profile?.role === 'admin' || user.email === 'xyzapplywork@gmail.com'
    
    return { 
      isAdmin, 
      userId: user.id, 
      error: isAdmin ? null : 'Not authorized. Admin access required.',
      supabase: isAdmin ? supabase : undefined
    }
  } catch (err) {
    console.error('Admin access check error:', err)
    return { isAdmin: false, error: 'Failed to verify admin access' }
  }
}

export async function uploadContent(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const { isAdmin, userId, error: authError, supabase } = await checkAdminAccess()
    if (!isAdmin || !supabase) {
      return { success: false, error: authError || 'Not authorized' }
    }
    
    const contentType = formData.get('contentType') as string
    const subjectId = formData.get('subjectId') as string
    const chapterId = formData.get('chapterId') as string
    const title = formData.get('title') as string
    const year = formData.get('year') as string
    const fakeViews = parseInt(formData.get('fakeViews') as string) || 0
    const fakeDownloads = parseInt(formData.get('fakeDownloads') as string) || 0
    const file = formData.get('file') as File

    if (!title || !file) {
      return { success: false, error: 'Title and file are required' }
    }

    if (!contentType) {
      return { success: false, error: 'Content type is required' }
    }
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 9)
    const fileName = `${contentType}/${timestamp}-${randomStr}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('content-files')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/pdf'
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
        return { success: false, error: 'Storage bucket "content-files" not found. Please create it in Supabase Storage.' }
      }
      if (uploadError.message.includes('policy')) {
        return { success: false, error: 'Storage permission denied. Please check your Supabase storage policies.' }
      }
      return { success: false, error: 'File upload failed: ' + uploadError.message }
    }

    const { data: urlData } = supabase.storage
      .from('content-files')
      .getPublicUrl(fileName)

    const fileUrl = urlData.publicUrl

    let dbError = null
    let errorDetails = ''

    if (contentType === 'notes' || contentType === 'important_questions' || contentType === 'mcqs' || contentType === 'summary' || contentType === 'mind_map') {
      if (!chapterId) {
        return { success: false, error: 'Chapter is required for notes' }
      }

      const { error } = await supabase
        .from('notes')
        .insert({
          chapter_id: chapterId,
          title,
          file_url: fileUrl,
          file_name: file.name,
          file_size: file.size,
          note_type: contentType,
          is_published: true,
          views: fakeViews,
          downloads: fakeDownloads
        })
      
      dbError = error
      errorDetails = 'notes table'
    } else if (contentType === 'sample_paper') {
      if (!subjectId || !year) {
        return { success: false, error: 'Subject and year are required for sample papers' }
      }

      const { error } = await supabase
        .from('sample_papers')
        .insert({
          subject_id: subjectId,
          title,
          year: parseInt(year),
          file_url: fileUrl,
          file_name: file.name,
          file_size: file.size,
          is_published: true,
          views: fakeViews,
          downloads: fakeDownloads
        })
      
      dbError = error
      errorDetails = 'sample_papers table'
    } else if (contentType === 'pyq') {
      if (!subjectId || !year) {
        return { success: false, error: 'Subject and year are required for PYQs' }
      }

      const { error } = await supabase
        .from('pyqs')
        .insert({
          subject_id: subjectId,
          title,
          year: parseInt(year),
          file_url: fileUrl,
          file_name: file.name,
          file_size: file.size,
          is_published: true,
          views: fakeViews,
          downloads: fakeDownloads
        })
      
      dbError = error
      errorDetails = 'pyqs table'
    } else {
      return { success: false, error: 'Invalid content type: ' + contentType }
    }

    if (dbError) {
      console.error('Database insert error:', dbError)
      if (dbError.message.includes('column') && dbError.message.includes('schema cache')) {
        return { 
          success: false, 
          error: `Database schema issue: Missing columns in ${errorDetails}. Please run the supabase-add-columns.sql script in your Supabase SQL Editor to add the required columns, then reload the schema cache.`
        }
      }
      if (dbError.message.includes('foreign key') || dbError.message.includes('violates')) {
        return { success: false, error: 'Invalid reference: The selected subject or chapter may not exist.' }
      }
      if (dbError.message.includes('policy') || dbError.message.includes('denied')) {
        return { success: false, error: 'Permission denied. Please check your Supabase RLS policies.' }
      }
      return { success: false, error: 'Database error: ' + dbError.message }
    }

    try {
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: userId,
          action: 'upload',
          entity_type: contentType,
          entity_title: title,
          details: { file_name: file.name, file_size: file.size }
        })
    } catch {
    }

    revalidatePath('/admin')
    revalidatePath('/admin/content')
    revalidatePath('/notes')
    revalidatePath('/sample-papers')
    revalidatePath('/pyqs')
    
    return { success: true }
  } catch (err) {
    console.error('Upload error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: 'Failed to upload content: ' + errorMessage }
  }
}

export async function deleteContent(contentType: string, id: string): Promise<{ success: boolean; error?: string | null }> {
  const { isAdmin, userId, error: authError, supabase } = await checkAdminAccess()
  if (!isAdmin || !supabase) {
    return { success: false, error: authError }
  }
  
  try {
    let tableName: string
    if (contentType === 'notes' || contentType === 'important_questions' || contentType === 'mcqs' || contentType === 'summary' || contentType === 'mind_map') {
      tableName = 'notes'
    } else if (contentType === 'sample_paper') {
      tableName = 'sample_papers'
    } else if (contentType === 'pyq') {
      tableName = 'pyqs'
    } else {
      return { success: false, error: 'Invalid content type' }
    }

    const { data: existing } = await supabase
      .from(tableName)
      .select('title, file_url')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    try {
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: userId,
          action: 'delete',
          entity_type: contentType,
          entity_id: id,
          entity_title: existing?.title,
          details: { file_url: existing?.file_url }
        })
    } catch {
      // Ignore admin activity logging errors
    }

    revalidatePath('/admin')
    revalidatePath('/admin/content')
    
    return { success: true }
  } catch (err) {
    console.error('Delete error:', err)
    return { success: false, error: 'Failed to delete content' }
  }
}

export async function updateContent(contentType: string, id: string, data: Record<string, string | number | boolean>): Promise<{ success: boolean; error?: string | null }> {
  const { isAdmin, userId, error: authError, supabase } = await checkAdminAccess()
  if (!isAdmin || !supabase) {
    return { success: false, error: authError }
  }
  
  try {
    let tableName: string
    if (contentType === 'notes' || contentType === 'important_questions' || contentType === 'mcqs' || contentType === 'summary' || contentType === 'mind_map') {
      tableName = 'notes'
    } else if (contentType === 'sample_paper') {
      tableName = 'sample_papers'
    } else if (contentType === 'pyq') {
      tableName = 'pyqs'
    } else {
      return { success: false, error: 'Invalid content type' }
    }

    const { error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    try {
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: userId,
          action: 'update',
          entity_type: contentType,
          entity_id: id,
          details: data
        })
    } catch {
      // Ignore admin activity logging errors
    }

    revalidatePath('/admin')
    revalidatePath('/admin/content')
    
    return { success: true }
  } catch (err) {
    console.error('Update error:', err)
    return { success: false, error: 'Failed to update content' }
  }
}

export async function updateUserRole(userId: string, newRole: 'student' | 'admin'): Promise<{ success: boolean; error?: string | null }> {
  const { isAdmin, userId: adminId, error: authError, supabase } = await checkAdminAccess()
  if (!isAdmin || !supabase) {
    return { success: false, error: authError }
  }
  
  try {
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    try {
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: adminId,
          action: 'role_change',
          entity_type: 'user',
          entity_id: userId,
          entity_title: targetUser?.email,
          details: { new_role: newRole, full_name: targetUser?.full_name }
        })
    } catch {
      // Ignore admin activity logging errors
    }

    revalidatePath('/admin/users')
    
    return { success: true }
  } catch (err) {
    console.error('Role update error:', err)
    return { success: false, error: 'Failed to update user role' }
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean; error?: string | null }> {
  const { isAdmin, userId: adminId, error: authError, supabase } = await checkAdminAccess()
  if (!isAdmin || !supabase) {
    return { success: false, error: authError }
  }
  
  try {
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    try {
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: adminId,
          action: isActive ? 'activate_user' : 'deactivate_user',
          entity_type: 'user',
          entity_id: userId,
          entity_title: targetUser?.email,
          details: { full_name: targetUser?.full_name }
        })
    } catch {
      // Ignore admin activity logging errors
    }

    revalidatePath('/admin/users')
    
    return { success: true }
  } catch (err) {
    console.error('Status update error:', err)
    return { success: false, error: 'Failed to update user status' }
  }
}

export async function getSubjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Error fetching subjects:', error)
    return []
  }
  
  return data
}

export async function getChaptersBySubject(subjectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('subject_id', subjectId)
    .order('chapter_number')
  
  if (error) {
    console.error('Error fetching chapters:', error)
    return []
  }
  
  return data
}

export async function bulkUploadContent(formData: FormData): Promise<{ success: boolean; error?: string; results: { id: string; success: boolean; error?: string }[]; message?: string }> {
  try {
    const { isAdmin, userId, error: authError, supabase } = await checkAdminAccess()
    if (!isAdmin || !supabase) {
      return { success: false, error: authError || 'Not authorized', results: [] }
    }
    
    const contentType = formData.get('contentType') as string
    const subjectId = formData.get('subjectId') as string
    const chapterId = formData.get('chapterId') as string
    const year = formData.get('year') as string
    const fileCount = parseInt(formData.get('fileCount') as string) || 0

    if (fileCount === 0) {
      return { success: false, error: 'No files to upload', results: [] }
    }

    const results: { id: string; success: boolean; error?: string }[] = []

    for (let i = 0; i < fileCount; i++) {
      const fileId = formData.get(`file_${i}_id`) as string
      const file = formData.get(`file_${i}`) as File
      const title = formData.get(`file_${i}_title`) as string
      const fakeViews = parseInt(formData.get(`file_${i}_views`) as string) || 0
      const fakeDownloads = parseInt(formData.get(`file_${i}_downloads`) as string) || 0

      try {
        if (!title || !file) {
          results.push({ id: fileId, success: false, error: 'Title and file are required' })
          continue
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf'
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 9)
        const fileName = `${contentType}/${timestamp}-${randomStr}-${i}.${fileExt}`

        const arrayBuffer = await file.arrayBuffer()
        const fileBuffer = new Uint8Array(arrayBuffer)

        const { error: uploadError } = await supabase.storage
          .from('content-files')
          .upload(fileName, fileBuffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/pdf'
          })

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          results.push({ id: fileId, success: false, error: 'File upload failed: ' + uploadError.message })
          continue
        }

        const { data: urlData } = supabase.storage
          .from('content-files')
          .getPublicUrl(fileName)

        const fileUrl = urlData.publicUrl

        let dbError = null

        if (contentType === 'notes' || contentType === 'important_questions' || contentType === 'mcqs' || contentType === 'summary' || contentType === 'mind_map') {
          const { error } = await supabase
            .from('notes')
            .insert({
              chapter_id: chapterId,
              title,
              file_url: fileUrl,
              file_name: file.name,
              file_size: file.size,
              note_type: contentType,
              is_published: true,
              views: fakeViews,
              downloads: fakeDownloads
            })
          dbError = error
        } else if (contentType === 'sample_paper') {
          const { error } = await supabase
            .from('sample_papers')
            .insert({
              subject_id: subjectId,
              title,
              year: parseInt(year),
              file_url: fileUrl,
              file_name: file.name,
              file_size: file.size,
              is_published: true,
              views: fakeViews,
              downloads: fakeDownloads
            })
          dbError = error
        } else if (contentType === 'pyq') {
          const { error } = await supabase
            .from('pyqs')
            .insert({
              subject_id: subjectId,
              title,
              year: parseInt(year),
              file_url: fileUrl,
              file_name: file.name,
              file_size: file.size,
              is_published: true,
              views: fakeViews,
              downloads: fakeDownloads
            })
          dbError = error
        }

        if (dbError) {
          console.error('Database insert error:', dbError)
          results.push({ id: fileId, success: false, error: 'Database error: ' + dbError.message })
          continue
        }

        try {
          await supabase
            .from('admin_activity')
            .insert({
              admin_id: userId,
              action: 'bulk_upload',
              entity_type: contentType,
              entity_title: title,
              details: { file_name: file.name, file_size: file.size }
            })
        } catch {
        }

        results.push({ id: fileId, success: true })
      } catch (err) {
        console.error('Upload error for file:', fileId, err)
        results.push({ id: fileId, success: false, error: err instanceof Error ? err.message : 'Upload failed' })
      }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/content')
    revalidatePath('/notes')
    revalidatePath('/sample-papers')
    revalidatePath('/pyqs')

    const successCount = results.filter(r => r.success).length
    const allSuccess = successCount === fileCount

    return { 
      success: allSuccess, 
      results,
      message: `Uploaded ${successCount} of ${fileCount} files`
    }
  } catch (err) {
    console.error('Bulk upload error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: 'Failed to upload content: ' + errorMessage, results: [] }
  }
}
