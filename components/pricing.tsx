'use client'

import { Button } from '@/components/ui/button'
import { PACKAGES } from '@/lib/packages'
import { Check } from 'lucide-react'

export function Pricing() {
  function selectPackage(id: string) {
    window.dispatchEvent(new CustomEvent('gs:select-package', { detail: id }))
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-mono text-2xl font-bold tracking-tighter sm:text-3xl">
            PICK YOUR <span className="text-primary text-glow">PACKAGE</span>
          </h2>
          <span className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">
            /// FREE SHIPPING
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-md border bg-card p-6 ${
                pkg.featured
                  ? 'border-primary shadow-[0_0_30px_-10px_var(--primary)]'
                  : 'border-border'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-2.5 left-6 rounded-sm bg-primary px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-primary-foreground">
                  MOST CORRUPTED
                </span>
              )}
              <h3 className="font-mono text-lg font-bold tracking-tight text-foreground">
                {pkg.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {pkg.tagline}
              </p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-mono text-4xl font-bold tracking-tighter text-foreground">
                  ${pkg.price}
                </span>
                <span className="mb-1 font-mono text-xs text-muted-foreground">
                  /order
                </span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 font-mono text-xs text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => selectPackage(pkg.id)}
                variant={pkg.featured ? 'default' : 'outline'}
                className={`mt-6 font-mono text-xs font-bold tracking-widest ${
                  pkg.featured ? '' : 'border-border bg-transparent hover:bg-secondary'
                }`}
              >
                SELECT_{pkg.id.toUpperCase()}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
