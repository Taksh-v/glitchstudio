import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await db.execute('SELECT 1')

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
      },
    })
  } catch (error) {
    console.error('[v0] Health check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 503 },
    )
  }
}
