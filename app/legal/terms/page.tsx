export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 font-mono text-sm">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter text-primary">
        TERMS OF SERVICE
      </h1>

      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">1. SERVICE OVERVIEW</h2>
          <p>
            GlitchStudio ("we", "us", "the Service") provides digital glitch art processing
            and delivery. By using our platform, you agree to these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">2. PAYMENT & BILLING</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Prices are displayed in USD and include all applicable taxes.</li>
            <li>PayPal processes all payments. Charges appear immediately upon order placement.</li>
            <li>One-time purchases are final. No recurring billing occurs.</li>
            <li>Invoice and receipt available via email after payment.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">3. DIGITAL DELIVERY</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Orders are delivered as digital files within 24-48 hours.</li>
            <li>Download links are valid for 30 days from purchase.</li>
            <li>Files are provided in high-resolution (4K) suitable for print and digital use.</li>
            <li>You are responsible for storing backup copies.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">4. USER CONTENT & RIGHTS</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>You grant GlitchStudio a license to use uploaded photos for order processing.</li>
            <li>You retain all rights to your original photos.</li>
            <li>GlitchStudio retains rights to glitch effects and corrupted outputs.</li>
            <li>You may use glitch outputs for personal and commercial purposes.</li>
            <li>Do not share output files without permission or bypass access controls.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">5. PROHIBITED CONTENT</h2>
          <p>Do not upload content that is:</p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Illegal, hateful, or violates any law</li>
            <li>Stolen or infringing on third-party intellectual property</li>
            <li>Explicit, abusive, or harmful to minors</li>
            <li>Used to harass, deceive, or defraud others</li>
          </ul>
          <p className="mt-2">
            Violations may result in order cancellation and account suspension.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">6. QUALITY & WARRANTIES</h2>
          <p>
            We provide glitch effects as-is without warranties. Results depend on photo quality,
            selected vibe, and random corruption algorithms. Outputs are unique and not
            guaranteed to match previews exactly.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">7. LIMITATION OF LIABILITY</h2>
          <p>
            GlitchStudio is provided "as-is". We are not liable for data loss, system errors,
            or service interruptions. Maximum liability is limited to the order amount paid.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">8. TERMINATION</h2>
          <p>
            We reserve the right to suspend or terminate access for violations of these Terms,
            illegal activity, or abuse of the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">9. CHANGES TO TERMS</h2>
          <p>
            We may update these Terms at any time. Continued use constitutes acceptance of
            updated Terms. Material changes will be announced via email.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">10. CONTACT</h2>
          <p>
            Questions about these Terms? Email:{' '}
            <a href="mailto:support@glitchstudio.com" className="text-primary hover:underline">
              support@glitchstudio.com
            </a>
          </p>
        </section>

        <hr className="border-border my-8" />
        <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </main>
  )
}
