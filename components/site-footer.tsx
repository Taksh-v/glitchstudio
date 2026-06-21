export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="font-mono text-lg font-bold tracking-tight text-primary text-glow">
              GLITCH<span className="text-foreground">STUDIO</span>
            </div>
            <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
              We take perfectly good photographs and lovingly destroy them.
              Printed on archival paper. Shipped worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 font-mono text-xs sm:grid-cols-3">
            <div>
              <h4 className="mb-3 tracking-widest text-foreground">STUDIO</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#process" className="hover:text-primary">Process</a></li>
                <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 tracking-widest text-foreground">VIBES</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Datamosh</li>
                <li>CRT Decay</li>
                <li>Chromatic</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 tracking-widest text-foreground">SIGNAL</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>hello@glitch.studio</li>
                <li>@glitchstudio</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[10px] tracking-widest text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} GLITCHSTUDIO // ALL RIGHTS CORRUPTED</span>
          <span className="animate-flicker">SYSTEM STATUS: ONLINE</span>
        </div>
      </div>
    </footer>
  )
}
