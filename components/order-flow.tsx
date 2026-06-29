'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PACKAGES, VIBES, getPackage } from '@/lib/packages'
import { createOrder } from '@/app/actions/orders'
import { toast } from 'sonner'
import { Loader2, Upload, X } from 'lucide-react'

type Photo = {
  id: string
  previewUrl: string
  pathname?: string
  status: 'uploading' | 'done' | 'error'
}

type Phase = 'build' | 'checkout' | 'done'

const CHECKOUT_LINES = [
  '> securing your payment...',
  '> processing through PayPal...',
  '> ✓ Payment confirmed',
  '> generating your glitch files...',
  '> applying corruption effects...',
  '> packaging your order...',
]

export function OrderFlow() {
  const [packageId, setPackageId] = useState('triptych')
  const [vibe, setVibe] = useState<string>('datamosh')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const [phase, setPhase] = useState<Phase>('build')
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [orderCode, setOrderCode] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const pkg = getPackage(packageId)!

  // Sync selection from the pricing section
  useEffect(() => {
    function onSelect(e: Event) {
      const id = (e as CustomEvent<string>).detail
      if (getPackage(id)) setPackageId(id)
    }
    window.addEventListener('gs:select-package', onSelect)
    return () => window.removeEventListener('gs:select-package', onSelect)
  }, [])

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (list.length === 0) {
      toast.error('Images only — that file type was rejected.')
      return
    }

    const remaining = pkg.maxPhotos - photos.length
    if (remaining <= 0) {
      toast.error(`${pkg.name} is capped at ${pkg.maxPhotos} photo(s).`)
      return
    }
    const accepted = list.slice(0, remaining)
    if (list.length > remaining) {
      toast.message(`Only ${remaining} more photo(s) fit this package.`)
    }

    for (const file of accepted) {
      const id = crypto.randomUUID()
      const previewUrl = URL.createObjectURL(file)
      setPhotos((p) => [...p, { id, previewUrl, status: 'uploading' }])

      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('upload failed')
        const { pathname } = await res.json()
        setPhotos((p) =>
          p.map((ph) =>
            ph.id === id ? { ...ph, pathname, status: 'done' } : ph,
          ),
        )
      } catch {
        setPhotos((p) =>
          p.map((ph) => (ph.id === id ? { ...ph, status: 'error' } : ph)),
        )
        toast.error('A photo failed to upload. Remove it and retry.')
      }
    }
  }

  function removePhoto(id: string) {
    setPhotos((p) => {
      const target = p.find((ph) => ph.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return p.filter((ph) => ph.id !== id)
    })
  }

  const uploadedPathnames = photos
    .filter((p) => p.status === 'done' && p.pathname)
    .map((p) => p.pathname!) as string[]

  const canCheckout =
    uploadedPathnames.length > 0 &&
    !photos.some((p) => p.status === 'uploading') &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function runCheckout() {
    if (!canCheckout) {
      toast.error('Add a photo and a valid email first.')
      return
    }
    setPhase('checkout')
    setCheckoutStep(0)

    // Animated fake terminal sequence
    for (let i = 0; i < CHECKOUT_LINES.length; i++) {
      await new Promise((r) => setTimeout(r, 520))
      setCheckoutStep(i + 1)
    }

    const result = await createOrder({
      email,
      packageId,
      vibe,
      notes,
      photoPathnames: uploadedPathnames,
    })

    if (result.ok) {
      setOrderCode(result.orderCode)
      setPhase('done')
    } else {
      toast.error(result.error)
      setPhase('build')
    }
  }

  function reset() {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    setPhotos([])
    setEmail('')
    setNotes('')
    setOrderCode('')
    setPhase('build')
  }

  /* ----------------------------- CHECKOUT VIEW ----------------------------- */
  if (phase === 'checkout') {
    return (
      <div className="scanlines mx-auto max-w-xl rounded-md border border-primary bg-card p-6 font-mono text-sm shadow-[0_0_40px_-12px_var(--primary)]">
        <div className="mb-4 flex items-center gap-2 text-primary">
          <span className="h-2 w-2 animate-flicker rounded-full bg-primary" />
          PROCESSING_ORDER // {pkg.name}
        </div>
        <div className="space-y-1.5">
          {CHECKOUT_LINES.slice(0, checkoutStep).map((line, i) => (
            <p key={i} className="text-muted-foreground">
              <span className="text-primary">{line}</span>
            </p>
          ))}
          {checkoutStep >= CHECKOUT_LINES.length && (
            <p className="flex items-center gap-2 text-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              finalizing...
            </p>
          )}
        </div>
      </div>
    )
  }

  /* ------------------------------- DONE VIEW ------------------------------- */
  if (phase === 'done') {
    return (
      <div className="scanlines relative mx-auto max-w-xl overflow-hidden rounded-md border border-primary bg-card p-8 text-center shadow-[0_0_40px_-12px_var(--primary)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan-sweep bg-gradient-to-b from-primary/25 to-transparent" />
        <p className="font-mono text-xs tracking-widest text-primary">
          ✓ PAYMENT CONFIRMED
        </p>
        <h3 className="glitch-text mt-3 font-mono text-3xl font-bold tracking-tighter text-foreground">
          ORDER RECEIVED
        </h3>
        <div className="mt-4 space-y-3 rounded-lg bg-secondary/50 p-4 border border-primary/20">
          <p className="font-mono text-sm text-foreground">
            Your order code: <span className="font-bold text-primary">{orderCode}</span>
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            A download link is being sent to <span className="text-foreground">{email}</span>
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Check your email for your files. They&apos;re ready to download immediately.
          </p>
        </div>

        <div className="mt-8 space-y-3 border-t border-border pt-6">
          <div className="font-mono text-xs text-foreground">
            <p className="font-bold text-primary mb-2">What happens next:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ Email confirmation sent with download link</li>
              <li>✓ Download expires in 30 days (request a new link anytime)</li>
              <li>✓ Use files commercially, on prints, merchandise, socials</li>
              <li>✓ Not happy? Email us for a full refund within 30 days</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={reset}
            className="flex-1 font-mono text-sm font-bold tracking-wide"
          >
            Transform Another Photo
          </Button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 font-mono text-sm font-bold tracking-wide hover:bg-secondary"
          >
            Home
          </a>
        </div>
      </div>
    )
  }

  /* ------------------------------- BUILD VIEW ------------------------------ */
  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* LEFT: build the order */}
      <div className="space-y-6 rounded-md border border-border bg-card p-6">
        {/* package */}
        <div>
          <Label className="font-mono text-xs tracking-widest text-muted-foreground">
            STEP 1: CHOOSE A PACKAGE
          </Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PACKAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackageId(p.id)}
                className={`rounded-sm border p-2.5 text-left transition-colors ${
                  packageId === p.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary hover:border-muted-foreground'
                }`}
              >
                <div className="font-mono text-[11px] font-bold tracking-tight text-foreground">
                  {p.name}
                </div>
                <div className="font-mono text-xs text-primary">${(p.price / 100).toFixed(2)}</div>
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                  ≤{p.maxPhotos} photo{p.maxPhotos > 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* upload */}
        <div>
          <Label className="font-mono text-xs tracking-widest text-muted-foreground">
            STEP 2: UPLOAD YOUR PHOTOS ({photos.length}/{pkg.maxPhotos})
          </Label>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              uploadFiles(e.dataTransfer.files)
            }}
            onClick={() => inputRef.current?.click()}
            className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary hover:border-muted-foreground'
            }`}
          >
            <Upload className="mb-2 h-5 w-5 text-primary" />
            <p className="font-mono text-xs text-foreground">
              DROP IMAGES or CLICK TO BROWSE
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              JPG / PNG / WEBP — they will be beautifully ruined
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) uploadFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          {photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative w-20 rounded-sm border border-border bg-background p-1.5 pb-3 shadow-md"
                  style={{ rotate: '-2deg' }}
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <img
                      src={photo.previewUrl || '/placeholder.svg'}
                      alt="Uploaded photo preview"
                      className="h-full w-full object-cover [filter:saturate(1.3)_contrast(1.1)]"
                    />
                    {photo.status === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                    {photo.status === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-destructive/40 font-mono text-[9px] text-foreground">
                        ERR
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removePhoto(photo.id)
                    }}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* vibe */}
        <div>
          <Label className="font-mono text-xs tracking-widest text-muted-foreground">
            STEP 3: PICK YOUR GLITCH STYLE
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {VIBES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVibe(v.id)}
                className={`rounded-sm border p-2.5 text-left transition-colors ${
                  vibe === v.id
                    ? 'border-glitch-magenta bg-glitch-magenta/10'
                    : 'border-border bg-secondary hover:border-muted-foreground'
                }`}
              >
                <div className="font-mono text-[11px] font-bold tracking-tight text-foreground">
                  {v.label}
                </div>
                <div className="font-mono text-[10px] leading-tight text-muted-foreground">
                  {v.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* notes */}
        <div>
          <Label
            htmlFor="notes"
            className="font-mono text-xs tracking-widest text-muted-foreground"
          >
            04 / NOTES (optional)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Make it look like a corrupted DVD menu from 2003..."
            className="mt-2 resize-none border-border bg-secondary font-mono text-xs"
            rows={2}
          />
        </div>
      </div>

      {/* RIGHT: summary + checkout */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="space-y-4 rounded-md border border-primary/30 bg-card p-6">
          <h3 className="font-mono text-sm font-bold tracking-widest text-foreground">
            YOUR ORDER
          </h3>

          <dl className="space-y-2 border-y border-border py-3 font-mono text-xs">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Package</dt>
              <dd className="text-primary font-bold">{pkg.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Photos</dt>
              <dd className="text-foreground">
                {photos.length} / {pkg.maxPhotos}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Glitch Style</dt>
              <dd className="text-glitch-magenta font-medium">
                {VIBES.find((v) => v.id === vibe)?.label}
              </dd>
            </div>
          </dl>

          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <span className="font-mono text-xs font-bold text-muted-foreground">TOTAL PRICE</span>
            <span className="font-mono text-3xl font-bold tracking-tighter text-primary">
              ${(pkg.price / 100).toFixed(2)}
            </span>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="font-mono text-[11px] tracking-widest text-muted-foreground"
            >
              STEP 4: YOUR EMAIL (WHERE WE SEND YOUR FILES)
            </Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1.5 border-border bg-secondary font-mono text-xs"
            />
          </div>

          <Button
            onClick={runCheckout}
            disabled={!canCheckout}
            className="w-full font-mono text-sm font-bold tracking-widest"
            size="lg"
          >
            Pay ${(pkg.price / 100).toFixed(2)} with PayPal → Get Your Files
          </Button>
        </div>
      </div>
    </div>
  )
}
