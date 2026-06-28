'use server'

import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { count, sum, sql, eq } from 'drizzle-orm'

export async function getAdminStats() {
  try {
    const totalResult = await db
      .select({ value: count() })
      .from(orders)

    const revenueResult = await db
      .select({ value: sum(orders.price) })
      .from(orders)

    const newOrdersResult = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, 'new'))

    const packageBreakdown = await db
      .select({
        name: orders.packageName,
        count: count(),
        revenue: sum(orders.price),
      })
      .from(orders)
      .groupBy(orders.packageName)

    return {
      ok: true,
      data: {
        totalOrders: totalResult[0]?.value ?? 0,
        totalRevenue: revenueResult[0]?.value ?? 0,
        newOrders: newOrdersResult[0]?.value ?? 0,
        packageBreakdown,
        generatedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('[v0] Failed to fetch admin stats:', error)
    return {
      ok: false,
      error: 'Could not load stats',
    }
  }
}
