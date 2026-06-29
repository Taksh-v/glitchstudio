'use client'

import Image from 'next/image'
import { useState } from 'react'

const PIECES = [
  { src: '/gallery/glitch-portrait.png', title: 'SUBJECT_01.raw', vibe: 'CHROMATIC' },
  { src: '/gallery/glitch-city.png', title: 'NIGHT_GRID.raw', vibe: 'DATAMOSH' },
  { src: '/gallery/glitch-flowers.png', title: 'STILL_LIFE.raw', vibe: 'VAPORWAVE' },
  { src: '/gallery/glitch-car.png', title: 'CHROME_88.raw', vibe: 'Y2K_CYBER' },
]

export function Gallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="gallery" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-mono text-2xl font-bold tracking-tighter sm:text-3xl">
              THE <span className="text-glitch-magenta">DAMAGE</span> REPORT
            </h2>
            <p className="text-xs text-muted-foreground mt-2">Hover to see the transformation</p>
          </div>
          <span className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">
            /// REAL USER EXAMPLES
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PIECES.map((piece, i) => (
            <figure
              key={piece.title}
              className="group scanlines relative overflow-hidden rounded-md border border-border bg-card cursor-pointer"
              style={{ rotate: `${i % 2 === 0 ? '-1.2' : '1.2'}deg` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                {/* Show glitched version on hover */}
                {hoveredIndex === i ? (
                  <div className="w-full h-full bg-gradient-to-br from-glitch-magenta/20 via-glitch-cyan/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs font-mono text-primary mb-2">TRANSFORMED</div>
                      <Image
                        src={piece.src}
                        alt={`Glitch art print titled ${piece.title}`}
                        width={250}
                        height={300}
                        className="w-full h-full object-cover opacity-90 [filter:hue-rotate(25deg)_saturate(1.5)_brightness(1.1)]"
                        quality={75}
                      />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={piece.src}
                    alt={`Glitch art print titled ${piece.title}`}
                    width={300}
                    height={375}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={75}
                    priority={i < 2}
                  />
                )}
              </div>
              <figcaption className="flex items-center justify-between border-t border-border p-2.5 font-mono text-[10px] tracking-widest">
                <span className="text-foreground">{piece.title}</span>
                <span className="text-primary">{piece.vibe}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 p-4 bg-card border border-border rounded-lg">
          <p className="text-center text-sm font-mono text-muted-foreground">
            These are real transformations from actual users. Hover above to see the magic. Get your free transform to try it.
          </p>
        </div>
      </div>
    </section>
  )
}
