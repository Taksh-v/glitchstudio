const ITEMS = [
  'DATAMOSH',
  'CHROMATIC ABERRATION',
  'CRT DECAY',
  'PIXEL SORT',
  'Y2K CORRUPTION',
  'VHS BLEED',
  'RGB SPLIT',
  'SCANLINES',
]

export function MarqueeStrip() {
  return (
    <div className="relative flex overflow-hidden border-y border-border bg-primary py-2.5 text-primary-foreground">
      <div className="animate-marquee flex shrink-0 items-center gap-6 whitespace-nowrap pr-6">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 font-mono text-xs font-bold tracking-widest"
          >
            {item}
            <span aria-hidden className="text-glitch-magenta">
              ✦
            </span>
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="animate-marquee flex shrink-0 items-center gap-6 whitespace-nowrap pr-6"
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 font-mono text-xs font-bold tracking-widest"
          >
            {item}
            <span className="text-glitch-magenta">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
