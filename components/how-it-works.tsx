const STEPS = [
  {
    n: '01',
    title: 'UPLOAD',
    body: 'Drop in your favorite (or least favorite) photos. JPG, PNG, whatever your phone spits out.',
  },
  {
    n: '02',
    title: 'PICK_A_VIBE',
    body: 'Choose your corruption: datamosh, CRT decay, chromatic split, Y2K cyber, or full wildcard.',
  },
  {
    n: '03',
    title: 'WE_DESTROY_IT',
    body: 'Our operators run your image through layered glitch passes by hand. No two outputs are alike.',
  },
  {
    n: '04',
    title: 'PRINTED + SHIPPED',
    body: 'Your corrupted art lands on archival matte paper and ships within 72 hours.',
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-mono text-2xl font-bold tracking-tighter sm:text-3xl">
            HOW THE{' '}
            <span className="text-primary text-glow">MACHINE</span> WORKS
          </h2>
          <span className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">
            /// 4 STEPS
          </span>
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="group relative bg-card p-6 transition-colors hover:bg-secondary"
            >
              <div className="mb-6 font-mono text-4xl font-bold text-primary/30 transition-colors group-hover:text-primary">
                {step.n}
              </div>
              <h3 className="mb-2 font-mono text-sm font-bold tracking-widest text-foreground">
                {step.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
