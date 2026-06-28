'use server'

import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_MODE,
  PAYPAL_API_BASE,
  generateDownloadToken,
  getDownloadTokenExpiry,
  type PayPalOrderData,
  type PayPalCaptureResult,
} from '@/lib/paypal'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

/**
 * Create a PayPal order for an existing GlitchStudio order.
 * This is called client-side to get the order ID to pass to PayPal buttons.
 */
export async function createPayPalOrder(input: {
  orderCode: string
  amount: number // in cents
  description: string
}) {
  try {
    const baseUrl = PAYPAL_API_BASE[PAYPAL_MODE as keyof typeof PAYPAL_API_BASE]
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    ).toString('base64')

    // Step 1: Get access token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenRes.ok) {
      console.error('[v0] PayPal token error:', tokenRes.status)
      return { ok: false, error: 'Payment setup failed. Try again.' }
    }

    const { access_token } = await tokenRes.json()

    // Step 2: Create order with PayPal
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: input.orderCode,
            amount: {
              currency_code: 'USD',
              value: (input.amount / 100).toFixed(2),
            },
            description: input.description,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/order/success`,
              cancel_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/order/cancel`,
            },
          },
        },
      }),
    })

    if (!orderRes.ok) {
      console.error('[v0] PayPal order creation error:', orderRes.status)
      return { ok: false, error: 'Could not create payment. Try again.' }
    }

    const paypalOrder: PayPalOrderData = await orderRes.json()
    return { ok: true, paypalOrderId: paypalOrder.id }
  } catch (error) {
    console.error('[v0] PayPal order creation error:', error)
    return { ok: false, error: 'Payment setup failed. Try again.' }
  }
}

/**
 * Capture a PayPal order (called on success page).
 * Updates the GlitchStudio order with payment details and generates download token.
 */
export async function capturePayPalOrder(input: {
  paypalOrderId: string
  orderCode: string
}) {
  try {
    const baseUrl = PAYPAL_API_BASE[PAYPAL_MODE as keyof typeof PAYPAL_API_BASE]
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    ).toString('base64')

    // Get access token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const { access_token } = await tokenRes.json()

    // Capture the order
    const captureRes = await fetch(
      `${baseUrl}/v2/checkout/orders/${input.paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
      },
    )

    if (!captureRes.ok) {
      console.error('[v0] PayPal capture error:', captureRes.status)
      return { ok: false, error: 'Payment capture failed. Please contact support.' }
    }

    const result: PayPalCaptureResult = await captureRes.json()

    if (result.status !== 'COMPLETED') {
      console.error('[v0] PayPal capture not completed:', result.status)
      return { ok: false, error: 'Payment was not captured. Please try again.' }
    }

    // Generate download token for this order
    const downloadToken = generateDownloadToken()
    const downloadExpiresAt = getDownloadTokenExpiry()

    // Get order details to send confirmation email
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.orderCode, input.orderCode))

    if (!order.length) {
      return { ok: false, error: 'Order not found after payment.' }
    }

    const orderData = order[0]

    // Update order with payment details
    await db
      .update(orders)
      .set({
        paymentStatus: 'completed',
        paypalOrderId: input.paypalOrderId,
        paypalTransactionId: result.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        paidAt: new Date(),
        downloadToken,
        downloadExpiresAt,
        status: 'completed',
      })
      .where(eq(orders.orderCode, input.orderCode))

    // Send order confirmation email (fire and forget)
    void sendOrderConfirmationEmail({
      orderCode: input.orderCode,
      email: orderData.email,
      packageName: orderData.packageName,
      price: orderData.price,
      vibe: orderData.vibe,
      downloadToken,
    }).catch((e) => console.error('[v0] Order confirmation email failed:', e))

    // Send admin notification about payment
    void sendAdminPaymentNotification({
      orderCode: input.orderCode,
      email: orderData.email,
      packageName: orderData.packageName,
      price: orderData.price,
      transactionId: result.purchase_units?.[0]?.payments?.captures?.[0]?.id || 'unknown',
    }).catch((e) => console.error('[v0] Admin payment notification failed:', e))

    revalidatePath('/order/success')
    return {
      ok: true,
      downloadToken,
      message: 'Payment received! Files are ready to download.',
    }
  } catch (error) {
    console.error('[v0] PayPal capture error:', error)
    return { ok: false, error: 'Payment verification failed. Try again or contact support.' }
  }
}

/**
 * Get order details by download token.
 * Used to fetch and deliver files after payment.
 */
export async function getOrderByToken(token: string) {
  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.downloadToken, token))

    if (!order.length) {
      return { ok: false, error: 'Download link not found or expired.' }
    }

    const o = order[0]

    // Check if token has expired
    if (o.downloadExpiresAt && new Date() > o.downloadExpiresAt) {
      return { ok: false, error: 'Download link has expired. Email support for a new link.' }
    }

    if (o.paymentStatus !== 'completed') {
      return { ok: false, error: 'Payment not confirmed. Try again shortly.' }
    }

    return {
      ok: true,
      order: {
        orderCode: o.orderCode,
        packageName: o.packageName,
        photoUrls: o.photoUrls,
        vibe: o.vibe,
      },
    }
  } catch (error) {
    console.error('[v0] Get order by token error:', error)
    return { ok: false, error: 'Could not retrieve order. Try again.' }
  }
}

/**
 * Send order confirmation email to customer with download link
 */
async function sendOrderConfirmationEmail(data: {
  orderCode: string
  email: string
  packageName: string
  price: number
  vibe: string
  downloadToken: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[v0] Skipping customer email — RESEND_API_KEY not set.')
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const downloadUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/download?token=${encodeURIComponent(data.downloadToken)}`

  await resend.emails.send({
    from: 'GlitchStudio <onboarding@resend.dev>',
    to: data.email,
    subject: `Your GlitchStudio Order Is Ready // ${data.orderCode}`,
    text: [
      `Hey there!`,
      ``,
      `Your glitch art is ready to download.`,
      ``,
      `Order Details:`,
      `Code:     ${data.orderCode}`,
      `Package:  ${data.packageName}`,
      `Vibe:     ${data.vibe}`,
      `Amount:   $${(data.price / 100).toFixed(2)}`,
      ``,
      `Download your files here:`,
      downloadUrl,
      ``,
      `This link works for 30 days. After that, email us for a new one.`,
      ``,
      `Questions? Hit us up at support@glitchstudio.com`,
      ``,
      `Stay glitchy,`,
      `GlitchStudio Team`,
    ].join('\n'),
  })
}

/**
 * Send payment notification to admin
 */
async function sendAdminPaymentNotification(data: {
  orderCode: string
  email: string
  packageName: string
  price: number
  transactionId: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_EMAIL
  if (!apiKey || !to) {
    console.log('[v0] Skipping admin email — RESEND_API_KEY or ADMIN_EMAIL not set.')
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: 'GlitchStudio <onboarding@resend.dev>',
    to,
    subject: `✓ PAYMENT RECEIVED // ${data.orderCode}`,
    text: [
      `Payment captured for order ${data.orderCode}`,
      ``,
      `Order Code:    ${data.orderCode}`,
      `Customer:      ${data.email}`,
      `Package:       ${data.packageName}`,
      `Amount:        $${(data.price / 100).toFixed(2)}`,
      `PayPal TxID:   ${data.transactionId}`,
      `Status:        ✓ COMPLETED`,
      ``,
      `View order in admin: /admin`,
    ].join('\n'),
  })
}
