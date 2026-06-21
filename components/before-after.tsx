'use client'

import { useCallback, useRef, useState } from 'react'

type Props = {
  beforeSrc: string
  afterSrc: string
  className?: string
}

export function BeforeAfter({ beforeSrc, afterSrc, className }: Props) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  return (
    <div
      ref={containerRef}
      className={`scanlines relative aspect-[4/5] w-full select-none overflow-hidden rounded-md border border-border bg-card ${className ?? ''}`}
      onPointerDown={(e) => {
        dragging.current = true
        updateFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX)
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* after (glitched) — base layer */}
      <img
        src={afterSrc || '/placeholder.svg'}
        alt="Photo after GlitchStudio corruption: heavy RGB split and datamosh"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        crossOrigin="anonymous"
      />
      {/* before (clean) — clipped layer */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={beforeSrc || '/placeholder.svg'}
          alt="Original photo before processing"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerRef.current?.clientWidth ?? '100%' }}
          draggable={false}
          crossOrigin="anonymous"
        />
        <span className="absolute left-2 top-2 rounded-sm bg-background/80 px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground">
          BEFORE
        </span>
      </div>

      <span className="absolute right-2 top-2 rounded-sm bg-primary px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-primary-foreground">
        AFTER
      </span>

      {/* handle */}
      <div
        className="absolute top-0 z-10 h-full w-0.5 bg-primary"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-xs text-primary">
          {'<>'}
        </div>
      </div>
    </div>
  )
}
