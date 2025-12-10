import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = [
  'supabase.co',
  'supabase.in',
  'supabase.net',
]

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') {
      return false
    }
    return ALLOWED_HOSTS.some(host => parsed.hostname.endsWith(host))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(url)
    
    if (!isAllowedUrl(decodedUrl)) {
      return new NextResponse('URL not allowed', { status: 403 })
    }
    
    const response = await fetch(decodedUrl, {
      headers: {
        'Accept': 'application/pdf,*/*',
      },
    })

    if (!response.ok) {
      return new NextResponse('Failed to fetch PDF', { status: response.status })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('pdf') && !contentType.includes('octet-stream')) {
      return new NextResponse('Invalid content type', { status: 400 })
    }

    const pdfBuffer = await response.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('PDF proxy error:', error)
    return new NextResponse('Failed to fetch PDF', { status: 500 })
  }
}
