'use client'

import { Button } from '@/components/ui/button'
import { PACKAGES } from '@/lib/packages'
import { Check, Shield } from 'lucide-react'

export function Pricing() {
  function selectPackage(id: string) {
    window.dispatchEvent(new CustomEvent('gs:select-package', { detail: id }))
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-3">
          <h2 className="font-mono text-2xl font-bold tracking-tighter sm:text-3xl">
            Simple Pricing. No Hidden Fees.
          </h2>
        </div>
        <p className="mb-8 font-mono text-sm text-muted-foreground">
          Choose a package, upload photos, get results instantly. 30-day money-back guarantee on all orders.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-lg border-2 p-6 transition-all ${
                pkg.featured
                  ? 'border-primary bg-card/50 shadow-[0_0_40px_-15px_var(--primary)] ring-1 ring-primary/20 md:scale-105'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {pkg.featured && (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 border border-primary/30">
                  <span className="text-xs font-bold tracking-widest text-primary">⭐ BEST VALUE</span>
                </div>
              )}

              <h3 className="font-mono text-lg font-bold tracking-tight text-foreground">
                {pkg.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {pkg.tagline}
              </p>

              {/* Price - Crystal Clear */}
              <div className="mt-6 mb-6 flex items-baseline gap-1">
                <span className="font-mono text-5xl font-bold text-primary">${(pkg.price / 100).toFixed(0)}</span>
                <span className="font-mono text-sm text-muted-foreground">one-time</span>
              </div>

              {/* Features - Plain Language */}
              <ul className="mb-6 flex-1 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="font-mono text-xs leading-relaxed text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Trust Badges */}
              <div className="mb-6 space-y-2 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  30-day money-back guarantee
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  ✓ Download instantly • ✓ Use commercially • ✓ Keep forever
                </div>
              </div>

              {/* CTA - Super Clear */}
              <Button
                onClick={() => selectPackage(pkg.id)}
                variant={pkg.featured ? 'default' : 'outline'}
                size="lg"
                className={`w-full font-mono text-sm font-bold tracking-wide ${
                  pkg.featured ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border bg-transparent hover:bg-secondary'
                }`}
              >
                {pkg.featured ? 'Choose This (Best Value)' : 'Choose This'}
              </Button>
            </div>
          ))}
        </div>

        {/* Confidence Builder - Bottom Trust Section */}
        <div className="mt-12 rounded-lg border border-border bg-card/30 p-6">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div>
              <div className="font-mono text-sm font-bold text-primary">✓ Instant Delivery</div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">Get your files immediately after purchase. No waiting.</p>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-primary">✓ Hassle-Free Returns</div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">Not happy? Full refund within 30 days. No questions asked.</p>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-primary">✓ Full Commercial Rights</div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">Use on merch, prints, social media, or anything else.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
