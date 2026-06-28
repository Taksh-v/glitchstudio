'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    q: 'What is GlitchStudio?',
    a: 'GlitchStudio transforms your photos into glitch art—corrupted, datamoshed digital creations with that authentic Y2K aesthetic. Upload, pick your vibe, and download ultra-high-res files within 24 hours.',
  },
  {
    q: 'How much does it cost?',
    a: 'Single Frame: $11 (1 photo), Triptych.Raw: $28 (up to 3 photos), Full Archive: $49 (up to 8 photos). All prices are one-time, no hidden fees or subscriptions.',
  },
  {
    q: 'What file formats do I get?',
    a: 'High-resolution PNG files (4K, 3840x2160 or higher depending on input). Perfect for printing, social media, or digital use. All files come in a ZIP archive.',
  },
  {
    q: 'How long does processing take?',
    a: 'Your files are processed and ready to download within 24-48 hours. Download links are valid for 30 days from purchase.',
  },
  {
    q: 'Can I use the glitch files commercially?',
    a: "Yes! You retain full rights to use glitch outputs for personal projects, commercial work, prints, merch, and social media. Attribute us if you'd like—we love seeing glitch art in the wild.",
  },
  {
    q: "What if I don't like the output?",
    a: 'We offer a 30-day money-back guarantee. Not satisfied? Email support@glitchstudio.com with your order code and get a full refund, no questions asked.',
  },
  {
    q: "What vibes are available?",
    a: "Datamosh (smeared pixels), CRT Decay (scanlines + burn-in), Chromatic (RGB split), Y2K Cyber (neon chrome), Vaporwave (faded pastels), and Wildcard (let the machine decide).",
  },
  {
    q: "What if my photos don't upload?",
    a: "Check file size (max 10MB), format (JPG, PNG, WebP), and internet connection. Still having issues? Email support@glitchstudio.com and we'll help troubleshoot.",
  },
  {
    q: "Is my photo data safe?",
    a: "Yes. Your photos are encrypted, stored securely on Vercel Blob, and deleted after 90 days (unless you request longer retention). See our Privacy Policy for details.",
  },
  {
    q: "Can I download my files multiple times?",
    a: "Yes, download as many times as you want during the 30-day window. After 30 days, email support@glitchstudio.com for a new link.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account needed. Just enter your email, upload photos, and pay. You'll get a unique order code to track your order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "PayPal only. We use PayPal for secure payment processing. No credit card data is stored on our servers.",
  },
  {
    q: "Can I gift GlitchStudio to someone?",
    a: "Absolutely! Have the recipient complete the upload and checkout. You can pay for their order by using their email and photos.",
  },
  {
    q: "What if I want more control over the glitch effect?",
    a: "Email support@glitchstudio.com with \"Custom Brief\" in the subject. For Full Archive orders, we offer custom corruption briefs at no extra cost.",
  },
  {
    q: "How is GlitchStudio different from other glitch art tools?",
    a: "We combine algorithmic corruption, curated vibe presets, and high-resolution output into one simple interface. No steep learning curves—just upload, vibe, and download.",
  },
  {
    q: "Can I request different effects or vibes?",
    a: "Full Archive orders include a custom corruption brief. Contact support@glitchstudio.com to discuss your specific vision.",
  },
  {
    q: "What if my download link expires?",
    a: "Links expire after 30 days. Email support@glitchstudio.com with your order code and we'll send a new link.",
  },
  {
    q: "Is there a community or gallery of glitch art?",
    a: "Yes! Share your glitch art on Instagram/Twitter with #GlitchStudio or #GlitchStudioArt. We feature customer work on our site and social media.",
  },
  {
    q: "What if I have a feature request or bug report?",
    a: "Email us at support@glitchstudio.com with \"Feature Request\" or \"Bug Report\" in the subject. We read and respond to all feedback.",
  },
]

export default function FAQPage() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-center font-mono text-3xl font-bold tracking-tighter text-primary">
          FREQUENTLY <span className="text-glitch-magenta">ASKED</span>
        </h1>
        <p className="mb-12 text-center font-mono text-sm tracking-widest text-muted-foreground">
          /// GLITCH_QUESTIONS.faq
        </p>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <button
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3 rounded-md border border-border bg-card p-4 hover:border-primary hover:bg-secondary transition-all">
                <span className="mt-0.5 text-glitch-magenta font-bold">
                  {expanded === i ? '▼' : '▶'}
                </span>
                <div className="flex-1">
                  <h3 className="font-mono font-bold tracking-tight text-foreground">
                    {item.q}
                  </h3>
                  {expanded === i && (
                    <p className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 rounded-md border border-glitch-magenta bg-glitch-magenta/10 p-6 text-center">
          <h2 className="mb-2 font-mono text-lg font-bold text-glitch-magenta">STILL HAVE QUESTIONS?</h2>
          <p className="mb-4 font-mono text-sm text-foreground">
            Can't find the answer you're looking for?
          </p>
          <a
            href="mailto:support@glitchstudio.com"
            className="inline-block rounded-md bg-primary px-6 py-2 font-mono text-sm font-bold tracking-widest text-background hover:opacity-90 transition"
          >
            EMAIL SUPPORT →
          </a>
        </div>

        <div className="mt-12 space-y-3 border-t border-border pt-8">
          <h2 className="font-mono text-lg font-bold text-primary">QUICK LINKS</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Link
              href="/legal/terms"
              className="rounded-md border border-border p-2 text-center font-mono text-xs hover:bg-secondary transition"
            >
              Terms
            </Link>
            <Link
              href="/legal/privacy"
              className="rounded-md border border-border p-2 text-center font-mono text-xs hover:bg-secondary transition"
            >
              Privacy
            </Link>
            <Link
              href="/legal/refunds"
              className="rounded-md border border-border p-2 text-center font-mono text-xs hover:bg-secondary transition"
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
