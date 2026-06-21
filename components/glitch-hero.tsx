import { Button } from '@/components/ui/button'
import { BeforeAfter } from '@/components/before-after'

export function GlitchHero() {
  return (
    <section
      id="top"
      className="scanlines noise-grid relative overflow-hidden border-b border-border"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[11px] tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-primary" />
            SYSTEM ONLINE // QUEUE OPEN
          </div>

          <h1 className="text-balance font-mono text-4xl font-bold leading-[1.05] tracking-tighter sm:text-5xl md:text-6xl">
            YOUR PHOTOS ARE{' '}
            <span className="text-muted-foreground line-through">BORING</span>.
            <br />
            <span className="glitch-text glitch-hover inline-block text-primary">
              CORRUPT THEM.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
            GlitchStudio feeds your photos through the machine — datamosh,
            chromatic aberration, CRT decay, Y2K rot — then prints them on real
            archival paper and ships them to your door.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              render={<a href="#order">UPLOAD A PHOTO →</a>}
              size="lg"
              className="font-mono text-sm font-bold tracking-widest"
            />
            <Button
              render={<a href="#gallery">SEE THE DAMAGE</a>}
              size="lg"
              variant="outline"
              className="border-border bg-transparent font-mono text-sm tracking-widest hover:bg-secondary"
            />
          </div>

          <div className="mt-8 flex gap-8 font-mono text-xs text-muted-foreground">
            <div>
              <div className="text-xl font-bold text-foreground">14k+</div>
              PHOTOS RUINED
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">4.9★</div>
              AVG RATING
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">72h</div>
              SHIP TIME
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <BeforeAfter
            beforeSrc="/gallery/clean-portrait.png"
            afterSrc="/gallery/glitch-portrait.png"
          />
          <p className="mt-3 text-center font-mono text-[11px] tracking-widest text-muted-foreground">
            ↔ DRAG TO SEE BEFORE / AFTER
          </p>
        </div>
      </div>
    </section>
  )
}
