const PIECES = [
  { src: '/gallery/glitch-portrait.png', title: 'SUBJECT_01.raw', vibe: 'CHROMATIC' },
  { src: '/gallery/glitch-city.png', title: 'NIGHT_GRID.raw', vibe: 'DATAMOSH' },
  { src: '/gallery/glitch-flowers.png', title: 'STILL_LIFE.raw', vibe: 'VAPORWAVE' },
  { src: '/gallery/glitch-car.png', title: 'CHROME_88.raw', vibe: 'Y2K_CYBER' },
]

export function Gallery() {
  return (
    <section id="gallery" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-mono text-2xl font-bold tracking-tighter sm:text-3xl">
            THE <span className="text-glitch-magenta">DAMAGE</span> REPORT
          </h2>
          <span className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">
            /// RECENT OUTPUT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PIECES.map((piece, i) => (
            <figure
              key={piece.title}
              className="group scanlines relative overflow-hidden rounded-md border border-border bg-card"
              style={{ rotate: `${i % 2 === 0 ? '-1.2' : '1.2'}deg` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={piece.src || '/placeholder.svg'}
                  alt={`Glitch art print titled ${piece.title}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:[filter:hue-rotate(20deg)_saturate(1.4)]"
                  crossOrigin="anonymous"
                />
              </div>
              <figcaption className="flex items-center justify-between border-t border-border p-2.5 font-mono text-[10px] tracking-widest">
                <span className="text-foreground">{piece.title}</span>
                <span className="text-primary">{piece.vibe}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
