import { getOrderByToken } from '@/app/actions/payments'
import { get } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Missing download token' },
        { status: 400 },
      )
    }

    // Verify token and get order details
    const orderResult = await getOrderByToken(token)
    if (!orderResult.ok) {
      return NextResponse.json(
        { error: orderResult.error },
        { status: 403 },
      )
    }

    const order = orderResult.order

    // Stream files as ZIP archive
    const zip = new JSZip()

    // Add each photo to the ZIP
    for (let i = 0; i < order.photoUrls.length; i++) {
      const pathname = order.photoUrls[i]
      try {
        const fileResult = await get(pathname, {
          access: 'private',
        })

        if (fileResult?.stream) {
          const buffer = await streamToBuffer(fileResult.stream)
          // Extract filename from pathname
          const filename = pathname.split('/').pop() || `glitch-${i + 1}.png`
          zip.file(filename, buffer)
        }
      } catch (e) {
        console.error(`[v0] Failed to fetch file ${pathname}:`, e)
        // Continue with other files even if one fails
      }
    }

    // Create a readme file
    const readme = [
      `# GlitchStudio Order ${order.orderCode}`,
      ``,
      `Package: ${order.packageName}`,
      `Vibe: ${order.vibe}`,
      ``,
      `Your glitched files are ready to use!`,
      `Download expires in 30 days from purchase.`,
      ``,
      `Questions? Email support@glitchstudio.com`,
    ].join('\n')

    zip.file('README.txt', readme)

    // Generate ZIP and return
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${order.orderCode}-glitch-files.zip"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[v0] Download error:', error)
    return NextResponse.json(
      { error: 'Download failed. Try again or contact support.' },
      { status: 500 },
    )
  }
}

/**
 * Convert a ReadableStream to Buffer
 */
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  const reader = stream.getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return Buffer.concat(chunks.map((c) => Buffer.from(c)))
}
