/**
 * User Retention Features
 * Strategies to keep customers coming back and increase lifetime value
 */

import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Check if customer qualifies for repeat purchase discount
 * Rule: 10% off if this is their 2nd+ order
 *
 * @param email - Customer email
 * @returns { eligible: boolean, discount: number, orderCount: number }
 */
export async function checkRepeatCustomerDiscount(email: string): Promise<{
  eligible: boolean
  discount: number // in percent (10)
  orderCount: number
  message: string
}> {
  try {
    // Count completed orders by this email
    const customerOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.email, email.toLowerCase().trim()),
          eq(orders.paymentStatus, 'completed'),
        ),
      )

    const orderCount = customerOrders.length

    if (orderCount >= 1) {
      // Already has 1+ completed orders = eligible for repeat discount
      return {
        eligible: true,
        discount: 10,
        orderCount: orderCount + 1, // +1 for current order
        message: '10% repeat customer discount applied!',
      }
    }

    return {
      eligible: false,
      discount: 0,
      orderCount,
      message: 'First time? No discount yet.',
    }
  } catch (error) {
    console.error('[v0] Repeat customer check error:', error)
    return {
      eligible: false,
      discount: 0,
      orderCount: 0,
      message: 'Could not verify discount status.',
    }
  }
}

/**
 * Calculate discounted price
 * @param basePrice - Price in cents (2700 for $27)
 * @param discountPercent - Discount as whole number (10 for 10%)
 * @returns Discounted price in cents
 */
export function applyDiscount(
  basePrice: number,
  discountPercent: number,
): number {
  const discountAmount = Math.round((basePrice * discountPercent) / 100)
  return basePrice - discountAmount
}

/**
 * Generate referral code for customer
 * Format: REF-<EMAIL_HASH>-<RANDOM>
 * @param email - Customer email
 * @returns Referral code
 */
export function generateReferralCode(email: string): string {
  const crypto = require('crypto')
  const hash = crypto
    .createHash('md5')
    .update(email)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `REF-${hash}-${random}`
}

/**
 * Calculate referral reward
 * Rule: Refer a friend → Get $5 credit on next order
 * Friend also gets $5 off when they use your code
 *
 * @param referralCode - The referral code used
 * @returns Reward in cents (500 = $5)
 */
export function getReferralReward(): number {
  return 500 // $5 in cents
}

/**
 * Build customer retention email content
 * Sent after successful order to encourage repeat purchases
 */
export function buildRetentionEmailContent(input: {
  email: string
  orderCode: string
  packageName: string
  downloadUrl: string
  referralCode: string
}): string {
  return `
Hey!

Your GlitchStudio order is ready:

Order Code: ${input.orderCode}
Download: ${input.downloadUrl}

---

💝 SPECIAL OFFER

Next order? Get 10% off!
Just use your email (${input.email}) at checkout.

Your repeat customer code is automatically applied.

---

🎁 REFER A FRIEND

Earn $5 credit on your next order:

Share your referral code: ${input.referralCode}

When your friend uses it:
• They get $5 off their first order
• You get $5 credit on your next order

Win-win!

---

Questions? Reply to this email.

Thanks for using GlitchStudio!
Team
  `.trim()
}

/**
 * Get customer lifetime value
 * @param email - Customer email
 * @returns Total spent in dollars
 */
export async function getCustomerLifetimeValue(
  email: string,
): Promise<{ totalSpent: number; orderCount: number }> {
  try {
    const customerOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.email, email.toLowerCase().trim()),
          eq(orders.paymentStatus, 'completed'),
        ),
      )

    const totalCents = customerOrders.reduce((sum, o) => sum + o.price, 0)
    return {
      totalSpent: totalCents / 100,
      orderCount: customerOrders.length,
    }
  } catch (error) {
    console.error('[v0] LTV calculation error:', error)
    return { totalSpent: 0, orderCount: 0 }
  }
}

/**
 * Send follow-up email sequence
 * - Day 0: Download ready email (already sent)
 * - Day 1: "Check out your files" + referral code
 * - Day 3: "20% off next order" promotion
 * - Day 7: "Try a different package" upsell
 */
export async function scheduleFollowupEmails(input: {
  email: string
  orderCode: string
  packageName: string
  referralCode: string
}) {
  // Note: This should be implemented with a background job queue (Bull/Agenda)
  // For now, this is a placeholder to show the concept

  console.log('[v0] Follow-up email sequence scheduled for:', input.email)

  const mailSequence = [
    {
      delay: 1000 * 60 * 60 * 24, // 1 day
      subject: 'Check out your beautiful glitch art!',
      template: 'followup_checkout',
    },
    {
      delay: 1000 * 60 * 60 * 24 * 3, // 3 days
      subject: '20% off your next transformation',
      template: 'followup_discount',
    },
    {
      delay: 1000 * 60 * 60 * 24 * 7, // 7 days
      subject: 'Try the Full Archive tier (8 photos)',
      template: 'followup_upsell',
    },
  ]

  // TODO: Integrate with Bull/Agenda to schedule these emails
  return mailSequence
}

/**
 * Viral coefficient calculation
 * How many new customers does one customer bring?
 *
 * Formula: (referrals per customer) × (conversion rate of referral)
 *
 * Target: 1.0 = Viral growth (each customer brings 1 more)
 */
export function calculateViralCoefficient(input: {
  customersWithReferrals: number
  totalCustomers: number
  referralsPerCustomer: number
  conversionRate: number // 0.1 = 10%
}): number {
  if (input.totalCustomers === 0) return 0

  const virality =
    input.referralsPerCustomer * input.conversionRate
  return virality
}
