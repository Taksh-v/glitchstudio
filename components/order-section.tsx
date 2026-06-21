import { OrderFlow } from '@/components/order-flow'

export function OrderSection() {
  return (
    <section
      id="order"
      className="noise-grid border-b border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-balance font-mono text-2xl font-bold tracking-tighter sm:text-3xl">
            FEED THE <span className="text-primary text-glow">MACHINE</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty font-mono text-xs leading-relaxed text-muted-foreground">
            Upload, choose your corruption, and check out. We handle the rest by
            hand.
          </p>
        </div>
        <OrderFlow />
      </div>
    </section>
  )
}
