import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  console.log('[API Upload] Starting upload request...')
  
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('[API Upload] Auth error:', authError)
      return NextResponse.json(
        { success: false, error: 'Not authenticated. Please log in.' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || user.email === 'xyzapplywork@gmail.com'
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Not authorized. Admin access required.' },
        { status: 403 }
      )
    }

    console.log('[API Upload] Admin verified:', user.id)

    const formData = await request.formData()
    
    const contentType = formData.get('contentType') as string
    const subjectId = formData.get('subjectId') as string
    const chapterId = formData.get('chapterId') as string
    const title = formData.get('title') as string
    const year = formData.get('year') as string
    const fakeViews = parseInt(formData.get('fakeViews') as string) || 0
    const fakeDownloads = parseInt(formData.get('fakeDownloads') as string) || 0
    const file = formData.get('file') as File

    if (!title || !file) {
      return NextResponse.json(
        { success: false, error: 'Title and file are required' },
        { status: 400 }
      )
    }

    if (!contentType) {
      return NextResponse.json(
        { success: false, error: 'Content type is required' },
        { status: 400 }
      )
    }

    console.log('[API Upload] Processing file:', { 
      fileName: file.name, 
      fileType: file.type, 
      fileSize: file.size,
      contentType 
    })

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 9)
    const fileName = `${contentType}/${timestamp}-${randomStr}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    console.log('[API Upload] Uploading to Supabase Storage...')
    
    const { error: uploadError } = await supabase.storage
      .from('content-files')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/pdf'
      })

    if (uploadError) {
      console.error('[API Upload] Storage upload error:', uploadError)
      if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
        return NextResponse.json(
          { success: false, error: 'Storage bucket "content-files" not found. Please create it in Supabase Storage.' },
          { status: 500 }
        )
      }
      if (uploadError.message.includes('policy')) {
        return NextResponse.json(
          { success: false, error: 'Storage permission denied. Please check your Supabase storage policies.' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { success: false, error: 'File upload failed: ' + uploadError.message },
        { status: 500 }
      )
    }

    console.log('[API Upload] File uploaded to storage successfully')

    const { data: urlData } = supabase.storage
      .from('content-files')
      .getPublicUrl(fileName)

    const fileUrl = urlData.publicUrl

    let dbError = null
    let errorDetails = ''

    if (contentType === 'notes' || contentType === 'important_questions' || contentType === 'mcqs' || contentType === 'summary' || contentType === 'mind_map') {
      if (!chapterId) {
        return NextResponse.json(
          { success: false, error: 'Chapter is required for notes' },
          { status: 400 }
        )
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
        return NextResponse.json(
          { success: false, error: 'Subject and year are required for sample papers' },
          { status: 400 }
        )
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
        return NextResponse.json(
          { success: false, error: 'Subject and year are required for PYQs' },
          { status: 400 }
        )
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
      return NextResponse.json(
        { success: false, error: 'Invalid content type: ' + contentType },
        { status: 400 }
      )
    }

    if (dbError) {
      console.error('[API Upload] Database insert error:', dbError)
      if (dbError.message.includes('column') && dbError.message.includes('schema cache')) {
        return NextResponse.json({ 
          success: false, 
          error: `Database schema issue: Missing columns in ${errorDetails}. Please run the supabase-add-columns.sql script.`
        }, { status: 500 })
      }
      if (dbError.message.includes('foreign key') || dbError.message.includes('violates')) {
        return NextResponse.json(
          { success: false, error: 'Invalid reference: The selected subject or chapter may not exist.' },
          { status: 500 }
        )
      }
      if (dbError.message.includes('policy') || dbError.message.includes('denied')) {
        return NextResponse.json(
          { success: false, error: 'Permission denied. Please check your Supabase RLS policies.' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { success: false, error: 'Database error: ' + dbError.message },
        { status: 500 }
      )
    }

    try {
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: user.id,
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
    
    console.log('[API Upload] Upload successful!')
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('[API Upload] Unhandled error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    return NextResponse.json(
      { success: false, error: 'Failed to upload content: ' + errorMessage },
      { status: 500 }
    )
  }
}
