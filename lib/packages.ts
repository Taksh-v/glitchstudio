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
    price: 24,
    maxPhotos: 1,
    features: [
      '1 photo corrupted',
      'A4 archival matte print',
      '3 glitch passes',
      'Digital file included',
    ],
  },
  {
    id: 'triptych',
    name: 'TRIPTYCH.RAW',
    tagline: 'Three frames, datamoshed into a series.',
    price: 59,
    maxPhotos: 3,
    featured: true,
    features: [
      'Up to 3 photos',
      '3x A4 archival prints',
      '6 glitch passes per frame',
      'Matched color decay',
      'Digital files included',
    ],
  },
  {
    id: 'archive',
    name: 'FULL_ARCHIVE',
    tagline: 'Dump your camera roll into the machine.',
    price: 119,
    maxPhotos: 8,
    features: [
      'Up to 8 photos',
      'Large-format A3 prints',
      'Unlimited glitch passes',
      'Custom corruption brief',
      'Priority queue',
      'Digital files included',
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
