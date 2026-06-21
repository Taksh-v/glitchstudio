import type { Order } from '@/lib/db/schema'
import { adminLogout } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d))
}

export function AdminDashboard({ orders }: { orders: Order[] }) {
  const revenue = orders.reduce((sum, o) => sum + o.price, 0)
  const newCount = orders.filter((o) => o.status === 'new').length

  return (
    <div className="min-h-screen bg-background">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="font-mono text-sm font-bold tracking-widest text-primary text-glow">
            GLITCHSTUDIO // OPS
          </div>
          <form action={adminLogout}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-border bg-transparent font-mono text-xs tracking-widest hover:bg-secondary"
            >
              LOGOUT
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* stats */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: 'TOTAL ORDERS', value: orders.length },
            { label: 'NEW / UNSEEN', value: newCount },
            { label: 'GROSS REVENUE', value: `$${revenue}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-border bg-card p-4"
            >
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
                {stat.label}
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tracking-tighter text-foreground">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <h1 className="mb-4 font-mono text-sm font-bold tracking-widest text-foreground">
          INCOMING ORDERS
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-card p-12 text-center font-mono text-xs text-muted-foreground">
            NO ORDERS YET // the machine is hungry
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-md border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold tracking-widest text-primary">
                        {order.orderCode}
                      </span>
                      <span className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground">
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">
                      {order.email} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-foreground">
                      {order.packageName}
                    </div>
                    <div className="font-mono text-xs text-primary">
                      ${order.price} · {order.vibe}
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <p className="mt-3 border-l-2 border-glitch-magenta pl-3 font-mono text-xs italic text-muted-foreground">
                    “{order.notes}”
                  </p>
                )}

                {order.photoUrls.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.photoUrls.map((pathname) => (
                      <a
                        key={pathname}
                        href={`/api/file?pathname=${encodeURIComponent(pathname)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group block h-16 w-16 overflow-hidden rounded-sm border border-border bg-secondary"
                      >
                        <img
                          src={`/api/file?pathname=${encodeURIComponent(pathname)}`}
                          alt={`Uploaded photo for order ${order.orderCode}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
