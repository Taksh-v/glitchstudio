import { SiteHeader } from '@/components/site-header'
import { GlitchHero } from '@/components/glitch-hero'
import { MarqueeStrip } from '@/components/marquee-strip'
import { HowItWorks } from '@/components/how-it-works'
import { Gallery } from '@/components/gallery'
import { Pricing } from '@/components/pricing'
import { OrderSection } from '@/components/order-section'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <GlitchHero />
      <MarqueeStrip />
      <HowItWorks />
      <Gallery />
      <Pricing />
      <OrderSection />
      <SiteFooter />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              'font-mono text-xs border-border bg-card text-foreground rounded-md',
          },
        }}
      />
    </main>
  )
}
