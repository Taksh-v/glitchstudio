'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Download, RotateCcw, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

interface Order {
  id: string
  orderCode: string
  packageId: string
  price: number
  email: string
  numPhotos: number
  vibe: string
  paymentStatus: string
  downloadedAt?: Date
  createdAt: Date
}

interface UserDashboardProps {
  orders: Order[]
}

export function UserDashboard({ orders }: UserDashboardProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const session = await authClient.getSession()
      setUser(session.data?.user)
      setLoading(false)
    }
    getSession()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.price / 100), 0)
  const completedOrders = orders.filter((o) => o.paymentStatus === 'completed').length

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground font-mono text-sm">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/account/settings"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-mono text-muted-foreground mb-1">Total Orders</div>
          <div className="text-2xl font-bold text-foreground">{completedOrders}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-mono text-muted-foreground mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-mono text-muted-foreground mb-1">Member Since</div>
          <div className="text-sm font-mono text-foreground">
            {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Today'}
          </div>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Your First Transform
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-mono text-sm font-bold text-foreground">{order.orderCode}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">${(order.price / 100).toFixed(2)}</div>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded font-mono ${
                        order.paymentStatus === 'completed'
                          ? 'bg-green-500/10 text-green-600'
                          : order.paymentStatus === 'refunded'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Package</div>
                    <div className="font-mono text-foreground">{order.packageId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Vibe</div>
                    <div className="font-mono text-foreground">{order.vibe}</div>
                  </div>
                </div>

                {order.paymentStatus === 'completed' && (
                  <div className="flex gap-2">
                    <Link
                      href={`/download?token=${order.downloadToken}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Files
                    </Link>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-border text-sm rounded hover:bg-secondary transition-colors">
                      <RotateCcw className="w-4 h-4" />
                      Request Refund
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
