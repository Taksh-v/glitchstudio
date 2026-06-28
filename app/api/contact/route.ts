import { rateLimit } from '@/lib/rate-limit'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP - max 5 messages per hour
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      )
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters' },
        { status: 400 },
      )
    }

    // Send email to admin
    const apiKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL

    if (!apiKey || !adminEmail) {
      console.log('[v0] Contact form: email configuration missing, skipping')
      return NextResponse.json({ ok: true })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'GlitchStudio Contact <onboarding@resend.dev>',
      to: adminEmail,
      replyTo: email,
      subject: `CONTACT FORM // ${subject}`,
      text: [
        `New message from ${name}`,
        ``,
        `Subject: ${subject}`,
        `From: ${email}`,
        ``,
        `Message:`,
        message,
      ].join('\n'),
    })

    // Optional: send confirmation to customer
    await resend.emails.send({
      from: 'GlitchStudio <onboarding@resend.dev>',
      to: email,
      subject: 'We got your message',
      text: [
        `Hey ${name},`,
        ``,
        `Thanks for reaching out! We got your message about "${subject}" and we'll get back to you within 24 hours.`,
        ``,
        `In the meantime, check out our FAQ: https://glitchstudio.com/faq`,
        ``,
        `Stay glitchy,`,
        `GlitchStudio Support`,
      ].join('\n'),
    }).catch(() => {
      // Fail silently if customer confirmation fails
      console.log('[v0] Customer confirmation email failed (non-critical)')
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }
}
