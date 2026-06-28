'use client'

import { useEffect, useState } from 'react'
import { getAdminStats } from '@/app/actions/admin-stats'
import { Loader2 } from 'lucide-react'

interface Stats {
  totalOrders: number
  totalRevenue: number
  newOrders: number
  packageBreakdown: Array<{ name: string; count: number; revenue: number | null }>
  generatedAt: string
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const result = await getAdminStats()
      if (result.ok) {
        setStats(result.data)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Could not load stats
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border border-border bg-secondary p-4">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            TOTAL ORDERS
          </p>
          <p className="font-mono text-2xl font-bold text-primary">
            {stats.totalOrders}
          </p>
        </div>
        <div className="rounded-md border border-border bg-secondary p-4">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            GROSS REVENUE
          </p>
          <p className="font-mono text-2xl font-bold text-glitch-magenta">
            ${stats.totalRevenue ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-border bg-secondary p-4">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            NEW / UNSEEN
          </p>
          <p className="font-mono text-2xl font-bold text-glitch-cyan">
            {stats.newOrders}
          </p>
        </div>
      </div>

      {stats.packageBreakdown.length > 0 && (
        <div className="rounded-md border border-border bg-secondary p-4">
          <p className="font-mono text-xs font-bold tracking-widest text-foreground mb-3">
            PACKAGE BREAKDOWN
          </p>
          <div className="space-y-2">
            {stats.packageBreakdown.map((pkg) => (
              <div
                key={pkg.name}
                className="flex items-center justify-between font-mono text-xs"
              >
                <span className="text-muted-foreground">{pkg.name}</span>
                <span className="text-foreground">
                  {pkg.count} orders • ${pkg.revenue ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center font-mono text-[10px] text-muted-foreground">
        Last updated: {new Date(stats.generatedAt).toLocaleTimeString()}
      </p>
    </div>
  )
}
