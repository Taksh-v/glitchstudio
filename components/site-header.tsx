'use client'

import { Button } from '@/components/ui/button'

const NAV = [
  { label: 'PROCESS', href: '#process' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'PRICING', href: '#pricing' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a
          href="#top"
          className="glitch-hover font-mono text-lg font-bold tracking-tight text-primary text-glow"
        >
          GLITCH<span className="text-foreground">STUDIO</span>
          <span className="ml-1 animate-flicker text-glitch-magenta">_</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-1.5 font-mono text-xs tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button
          render={<a href="#order">START_UPLOAD</a>}
          nativeButton={false}
          size="sm"
          className="font-mono text-xs font-bold tracking-widest"
        />
      </div>
    </header>
  )
}
