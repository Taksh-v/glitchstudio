export type GlitchPackage = {
  id: string
  name: string
  tagline: string
  price: number
  maxPhotos: number
  features: string[]
  featured?: boolean
}

export const PACKAGES: GlitchPackage[] = [
  {
    id: 'single',
    name: 'SINGLE_FRAME',
    tagline: 'One photo. One corruption. Pure chaos.',
    price: 1100, // $11.00 in cents for PayPal
    maxPhotos: 1,
    features: [
      '1 photo corrupted',
      'Ultra high-res digital file (4K)',
      '3 glitch effect variations',
      'Instant download link',
      '30-day refund guarantee',
    ],
  },
  {
    id: 'triptych',
    name: 'TRIPTYCH.RAW',
    tagline: 'Three frames, datamoshed into a series.',
    price: 2800, // $28.00 in cents for PayPal
    maxPhotos: 3,
    featured: true,
    features: [
      'Up to 3 photos corrupted',
      'Ultra high-res digital files (4K)',
      '6 glitch effect variations per frame',
      'Matched color decay aesthetic',
      'Instant download + archive',
      '30-day refund guarantee',
    ],
  },
  {
    id: 'archive',
    name: 'FULL_ARCHIVE',
    tagline: 'Dump your camera roll into the machine.',
    price: 4900, // $49.00 in cents for PayPal
    maxPhotos: 8,
    features: [
      'Up to 8 photos corrupted',
      'Ultra high-res digital files (4K)',
      'Unlimited glitch variations',
      'Custom corruption brief (email)',
      'Priority processing (24 hours)',
      'Lifetime access to all files',
      '30-day refund guarantee',
    ],
  },
]

export const VIBES = [
  { id: 'datamosh', label: 'DATAMOSH', desc: 'Smeared pixels, melting frames' },
  { id: 'crt-decay', label: 'CRT_DECAY', desc: 'Scanlines, burn-in, static' },
  { id: 'chromatic', label: 'CHROMATIC', desc: 'RGB split, ghosting edges' },
  { id: 'y2k-cyber', label: 'Y2K_CYBER', desc: 'Neon, chrome, low-res web' },
  { id: 'vaporwave', label: 'VAPORWAVE', desc: 'Faded pastels, marble, palms' },
  { id: 'wildcard', label: 'WILDCARD', desc: 'Let the machine decide' },
] as const

export function getPackage(id: string) {
  return PACKAGES.find((p) => p.id === id)
}
