'use client'

import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Alex Chen',
    handle: '@alexchen',
    rating: 5,
    text: 'GlitchStudio completely transformed my social media aesthetic. The vibe selection is incredible and the results are exactly what I needed. Already bought 3 more times!',
    role: 'Designer',
  },
  {
    id: '2',
    name: 'Morgan Lee',
    handle: '@morganlee_art',
    rating: 5,
    text: 'As a digital artist, I was skeptical. But the quality of these glitch effects is professional-grade. My clients love them. Worth every penny.',
    role: 'Digital Artist',
  },
  {
    id: '3',
    name: 'Jordan Taylor',
    handle: '@jtaylor95',
    rating: 5,
    text: 'The free trial let me test it before buying. Loved the results so much I got the full archive tier. The customer service is also amazing.',
    role: 'Content Creator',
  },
  {
    id: '4',
    name: 'Casey Rivera',
    handle: '@caseyrivera',
    rating: 5,
    text: 'I use this for my TikTok videos. The Y2K_CYBER vibe gets me 3x more engagement than my normal content. Total game changer.',
    role: 'TikTok Creator',
  },
]

export function Testimonials() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="font-mono text-2xl font-bold tracking-tighter sm:text-3xl mb-2">
            LOVED BY <span className="text-glitch-magenta">CREATORS</span>
          </h2>
          <p className="text-muted-foreground text-sm">Real feedback from real users</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-glitch-magenta text-glitch-magenta"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-foreground mb-4 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-glitch-magenta to-glitch-cyan rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.handle} • {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-secondary border border-border rounded-lg p-8 text-center">
          <p className="text-foreground font-mono font-bold mb-2">
            1,200+ Happy Creators • 4.9/5 Rating • 30-Day Money Back Guarantee
          </p>
          <p className="text-muted-foreground text-sm">
            Join thousands of creators already using GlitchStudio
          </p>
        </div>
      </div>
    </section>
  )
}
