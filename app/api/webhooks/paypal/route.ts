import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * PayPal Webhook Handler
 * Handles IPN (Instant Payment Notification) from PayPal
 * Ensures payment is confirmed even if user closes browser after checkout
 *
 * This is critical for capturing payments when users don't return to the success page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    // Log webhook for debugging
    console.log('[v0] PayPal webhook received:', {
      txn_id: params.get('txn_id'),
      custom: params.get('custom'),
      payment_status: params.get('payment_status'),
    })

    // Only handle completed payments
    const paymentStatus = params.get('payment_status')
    if (paymentStatus !== 'Completed' && paymentStatus !== 'Processed') {
      console.log('[v0] PayPal webhook: Not a completed payment, skipping')
      return NextResponse.json({ ok: true }) // Still return 200 to acknowledge
    }

    // Get order code from custom field
    const orderCode = params.get('custom')
    if (!orderCode) {
      console.log('[v0] PayPal webhook: No order code found')
      return NextResponse.json({ ok: true })
    }

    // Get transaction ID
    const txnId = params.get('txn_id')
    if (!txnId) {
      console.log('[v0] PayPal webhook: No transaction ID found')
      return NextResponse.json({ ok: true })
    }

    // Find the order
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.orderCode, orderCode))

    if (!order.length) {
      console.log('[v0] PayPal webhook: Order not found:', orderCode)
      return NextResponse.json({ ok: true })
    }

    const o = order[0]

    // If already marked as completed, skip
    if (o.paymentStatus === 'completed') {
      console.log('[v0] PayPal webhook: Order already completed, skipping')
      return NextResponse.json({ ok: true })
    }

    // Verify the amount matches
    const receivedAmount = parseFloat(params.get('mc_gross') || '0')
    const expectedAmount = o.price / 100

    if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
      console.error('[v0] PayPal webhook: Amount mismatch', {
        received: receivedAmount,
        expected: expectedAmount,
      })
      return NextResponse.json({ ok: true }) // Still acknowledge but don't process
    }

    // Mark order as completed
    await db
      .update(orders)
      .set({
        paymentStatus: 'completed',
        paypalTransactionId: txnId,
        paidAt: new Date(),
        status: 'completed',
      })
      .where(eq(orders.orderCode, orderCode))

    console.log('[v0] PayPal webhook: Order marked as completed', orderCode)

    // Send confirmation email to customer
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && o.downloadToken) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(apiKey)
        const downloadUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/download?token=${encodeURIComponent(o.downloadToken)}`

        await resend.emails.send({
          from: 'GlitchStudio <onboarding@resend.dev>',
          to: o.email,
          subject: `Your GlitchStudio Order Is Ready // ${orderCode}`,
          text: [
            `Payment confirmed! Your glitch art files are ready.`,
            ``,
            `Order Code: ${orderCode}`,
            `Package:    ${o.packageName}`,
            ``,
            `Download here:`,
            downloadUrl,
            ``,
            `This link works for 30 days. After that, reply to this email for a new one.`,
            ``,
            `Enjoy your glitches!`,
            `Team`,
          ].join('\n'),
        })
      } catch (emailError) {
        console.error('[v0] Failed to send webhook confirmation email:', emailError)
        // Don't fail the webhook if email fails
      }
    }

    // Send admin notification
    const to = process.env.ADMIN_EMAIL
    if (apiKey && to) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(apiKey)

        await resend.emails.send({
          from: 'GlitchStudio <onboarding@resend.dev>',
          to,
          subject: `✓ PAYMENT CONFIRMED (Webhook) // ${orderCode}`,
          text: [
            `Payment confirmed via PayPal webhook.`,
            ``,
            `Order Code:    ${orderCode}`,
            `Customer:      ${o.email}`,
            `Package:       ${o.packageName}`,
            `Amount:        $${(o.price / 100).toFixed(2)}`,
            `PayPal TxID:   ${txnId}`,
            `Status:        ✓ COMPLETED`,
            ``,
            `Note: This order may have been confirmed via webhook (user closed browser after payment).`,
          ].join('\n'),
        })
      } catch (emailError) {
        console.error('[v0] Failed to send webhook admin email:', emailError)
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({ ok: true, processed: true })
  } catch (error) {
    console.error('[v0] PayPal webhook error:', error)
    // Always return 200 to prevent PayPal from retrying
    // Errors are logged and should be monitored
    return NextResponse.json({ ok: true, error: 'Webhook processing error' })
  }
}
