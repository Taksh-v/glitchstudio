'use server'

import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { getPackage, VIBES } from '@/lib/packages'
import { desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type CreateOrderInput = {
  email: string
  packageId: string
  vibe: string
  notes?: string
  photoPathnames: string[]
}

export type CreateOrderResult =
  | { ok: true; orderCode: string }
  | { ok: false; error: string }

function makeOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `GLX-${code}`
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const pkg = getPackage(input.packageId)
  if (!pkg) return { ok: false, error: 'Unknown package selected.' }

  const email = input.email.trim().toLowerCase()
  // Stricter email validation
  if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: 'Enter a valid email address.' }
  }
  
  // Check for obvious spam patterns
  if (email.includes('test@test') || email.includes('fake')) {
    return { ok: false, error: 'Enter a real email address.' }
  }

  if (input.photoPathnames.length === 0) {
    return { ok: false, error: 'Upload at least one photo to corrupt.' }
  }
  if (input.photoPathnames.length > pkg.maxPhotos) {
    return {
      ok: false,
      error: `${pkg.name} allows up to ${pkg.maxPhotos} photo(s).`,
    }
  }

  const vibe = VIBES.find((v) => v.id === input.vibe)?.label ?? 'WILDCARD'
  const orderCode = makeOrderCode()

  try {
    await db.insert(orders).values({
      orderCode,
      email,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      vibe,
      notes: input.notes?.trim() || null,
      photoUrls: input.photoPathnames,
      status: 'new',
    })
  } catch (error) {
    console.error('[v0] Failed to insert order:', error)
    return { ok: false, error: 'Could not save your order. Try again.' }
  }

  // Fire the admin notification email — never block/break the order if it fails.
  void sendAdminNotification({
    orderCode,
    email,
    packageName: pkg.name,
    price: pkg.price,
    vibe,
    notes: input.notes?.trim() || '',
    photoCount: input.photoPathnames.length,
  }).catch((e) => console.error('[v0] Email notification failed:', e))

  revalidatePath('/admin')
  return { ok: true, orderCode }
}

async function sendAdminNotification(data: {
  orderCode: string
  email: string
  packageName: string
  price: number
  vibe: string
  notes: string
  photoCount: number
}) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_EMAIL
  if (!apiKey || !to) {
    console.log('[v0] Skipping email — RESEND_API_KEY or ADMIN_EMAIL not set.')
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: 'GlitchStudio <onboarding@resend.dev>',
    to,
    subject: `NEW ORDER ${data.orderCode} // ${data.packageName}`,
    text: [
      `New GlitchStudio order received.`,
      ``,
      `Order:    ${data.orderCode}`,
      `Package:  ${data.packageName} ($${data.price})`,
      `Vibe:     ${data.vibe}`,
      `Photos:   ${data.photoCount}`,
      `Customer: ${data.email}`,
      `Notes:    ${data.notes || '(none)'}`,
      ``,
      `View it in the admin dashboard at /admin.`,
    ].join('\n'),
  })
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt))
}
