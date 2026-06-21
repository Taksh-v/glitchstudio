import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are accepted' },
        { status: 400 },
      )
    }

    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: 'private',
      addRandomSuffix: true,
    })

    // Private store: never return blob.url to the client. The pathname is used
    // later (server-side) to stream the file to the authed admin.
    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
