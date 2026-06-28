'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      toast.success('Message sent! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Try emailing us directly.')
      console.error('[v0] Contact form error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-2 text-center font-mono text-3xl font-bold tracking-tighter text-primary">
          GET IN <span className="text-glitch-magenta">TOUCH</span>
        </h1>
        <p className="mb-12 text-center font-mono text-sm tracking-widest text-muted-foreground">
          /// SEND_MESSAGE.request
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-mono text-xs font-bold tracking-widest text-foreground">
                  NAME
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="font-mono"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs font-bold tracking-widest text-foreground">
                  EMAIL
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="font-mono"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs font-bold tracking-widest text-foreground">
                  SUBJECT
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="font-mono"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs font-bold tracking-widest text-foreground">
                  MESSAGE
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="font-mono"
                  disabled={loading}
                />
              </div>

              <Button
                render={<button type="submit" disabled={loading}>{loading ? 'SENDING...' : 'SEND MESSAGE →'}</button>}
                nativeButton={false}
                className="w-full font-mono text-sm font-bold tracking-widest"
              />
            </form>
          </div>

          {/* Contact Info & Trust Signals */}
          <div className="space-y-6">
            <div className="rounded-md border border-primary bg-secondary/50 p-6">
              <h2 className="mb-4 font-mono text-lg font-bold text-primary">DIRECT CONTACT</h2>
              <p className="font-mono text-sm text-foreground mb-4">
                Prefer to email directly? We read and respond to every message.
              </p>
              <a
                href="mailto:support@glitchstudio.com"
                className="inline-block font-mono font-bold text-glitch-magenta hover:underline"
              >
                support@glitchstudio.com →
              </a>
            </div>

            <div className="rounded-md border border-glitch-magenta bg-glitch-magenta/10 p-6">
              <h2 className="mb-4 font-mono text-lg font-bold text-glitch-magenta">WHY GLITCHSTUDIO?</h2>
              <ul className="space-y-2 font-mono text-sm text-foreground">
                <li>✓ 30-day money-back guarantee</li>
                <li>✓ Instant digital delivery</li>
                <li>✓ 4K ultra high-res files</li>
                <li>✓ Commercial use included</li>
                <li>✓ Secure, encrypted storage</li>
              </ul>
            </div>

            <div className="rounded-md border border-border p-6">
              <h2 className="mb-4 font-mono text-lg font-bold text-foreground">QUICK LINKS</h2>
              <ul className="space-y-2 font-mono text-sm">
                <li>
                  <a href="/faq" className="text-primary hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/legal/refunds" className="text-primary hover:underline">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="/legal/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/" className="text-primary hover:underline">
                    Back to Home
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
