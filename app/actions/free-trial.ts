'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { freeTrial } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

/**
 * Get the current user's free trial status
 */
export async function getFreeTrial() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return { ok: false, error: 'Not authenticated' }
    }

    const trial = await db
      .select()
      .from(freeTrial)
      .where(eq(freeTrial.userId, session.user.id))

    if (!trial.length) {
      // Create free trial for new user
      const newTrial = {
        id: crypto.randomUUID(),
        userId: session.user.id,
        used: false,
      }

      await db.insert(freeTrial).values(newTrial)
      return { ok: true, used: false, data: newTrial }
    }

    return { ok: true, used: trial[0].used, data: trial[0] }
  } catch (error) {
    console.error('[v0] Free trial check error:', error)
    return { ok: false, error: 'Failed to check free trial status' }
  }
}

/**
 * Mark free trial as used after first free transform
 */
export async function useFreeTrialTransform() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return { ok: false, error: 'Not authenticated' }
    }

    // Check if already used
    const trial = await db
      .select()
      .from(freeTrial)
      .where(eq(freeTrial.userId, session.user.id))

    if (!trial.length) {
      return { ok: false, error: 'Free trial not found' }
    }

    if (trial[0].used) {
      return { ok: false, error: 'Free trial already used' }
    }

    // Mark as used
    await db
      .update(freeTrial)
      .set({
        used: true,
        usedAt: new Date(),
      })
      .where(eq(freeTrial.userId, session.user.id))

    return { ok: true, message: 'Free trial marked as used' }
  } catch (error) {
    console.error('[v0] Mark free trial error:', error)
    return { ok: false, error: 'Failed to process free trial' }
  }
}
