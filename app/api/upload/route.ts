import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { validateUploadFile } from '@/lib/upload'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    if (!rateLimit(`upload:${ip}`, 20, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many uploads. Try again in a minute.' },
        { status: 429 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file constraints
    const validation = validateUploadFile(file)
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Sanitize filename to prevent path traversal
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 100)

    const blob = await put(`uploads/${Date.now()}-${safeName}`, file, {
      access: 'private',
      addRandomSuffix: true,
    })

    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Try again later.' },
      { status: 500 },
    )
  }
}
