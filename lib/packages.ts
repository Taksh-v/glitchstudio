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
    name: 'Single Frame',
    tagline: 'Perfect for trying it out',
    price: 1000, // $10.00 in cents for PayPal
    maxPhotos: 1,
    features: [
      'Transform 1 photo',
      '4K quality download',
      '3 different glitch styles included',
      'Instant access (no waiting)',
      'Keep forever',
      'Use on prints, merch, social media',
    ],
  },
  {
    id: 'triptych',
    name: 'Triptych (Best Value)',
    tagline: 'Most popular. Best bang for buck.',
    price: 2700, // $27.00 in cents for PayPal
    maxPhotos: 3,
    featured: true,
    features: [
      'Transform up to 3 photos',
      '4K quality downloads',
      '6 different glitch styles per photo',
      'All downloaded at once',
      'Keep forever',
      'Use on prints, merch, social media',
    ],
  },
  {
    id: 'archive',
    name: 'Full Archive',
    tagline: 'For serious creators',
    price: 4500, // $45.00 in cents for PayPal
    maxPhotos: 8,
    features: [
      'Transform up to 8 photos',
      '4K quality downloads',
      'Unlimited glitch styles per photo',
      'Email us custom requests',
      'Priority processing',
      'Keep forever + lifetime re-downloads',
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
