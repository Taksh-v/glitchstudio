export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 font-mono text-sm">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter text-primary">
        REFUND POLICY & SATISFACTION GUARANTEE
      </h1>

      <div className="space-y-6 text-foreground">
        <section className="rounded-md border border-glitch-magenta bg-glitch-magenta/10 p-4">
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">30-DAY MONEY-BACK GUARANTEE</h2>
          <p>
            We stand behind our work. If you're not satisfied with your glitch art, get a full
            refund within 30 days of purchase—no questions asked.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">1. REFUND ELIGIBILITY</h2>
          <p>You're eligible for a refund if:</p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>You request it within 30 days of purchase</li>
            <li>The files you received failed to download or were corrupted</li>
            <li>The glitch effect quality doesn't match your expectations</li>
            <li>You're unsatisfied with the service for any reason</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">2. HOW TO REQUEST A REFUND</h2>
          <ol className="ml-4 space-y-2 list-decimal">
            <li>
              Email{' '}
              <a href="mailto:support@glitchstudio.com" className="text-primary hover:underline">
                support@glitchstudio.com
              </a>{' '}
              with your order code (e.g., GLX-ABC123)
            </li>
            <li>Include a brief reason for the refund request</li>
            <li>We'll respond within 24 hours to process your refund</li>
            <li>Refund will appear in your account within 3-5 business days</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">3. REFUND PROCESS</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Refunds are processed to the original payment method (PayPal)</li>
            <li>Processing time: 3-5 business days via PayPal</li>
            <li>Your download link will be deactivated immediately</li>
            <li>You must delete downloaded files (we trust you on this)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">4. EXCEPTIONS & NON-REFUNDABLE CASES</h2>
          <p>Refunds may be denied if:</p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>You attempt refund after 30 days</li>
            <li>You distribute or share files publicly before requesting refund</li>
            <li>You violate our Terms of Service or upload prohibited content</li>
            <li>You request multiple refunds for the same service</li>
            <li>Chargeback is filed instead of requesting refund through us</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">5. PARTIAL REFUNDS</h2>
          <p>
            For orders with multiple photos (Triptych.Raw, Full Archive), we may offer a partial
            refund if only some outputs are unsatisfactory. Contact support to discuss.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">6. CHARGEBACKS</h2>
          <p>
            If you file a chargeback instead of requesting a refund, your account will be
            permanently suspended and you may forfeit refund eligibility. Always contact us first.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">7. QUALITY EXPECTATIONS</h2>
          <p>
            Please note: Glitch effects are algorithmic and partially random. Results vary based on:
          </p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Input photo resolution and color distribution</li>
            <li>Selected vibe (Datamosh, CRT Decay, etc.)</li>
            <li>Random corruption parameters (no two outputs are identical)</li>
          </ul>
          <p className="mt-2">
            We provide previews before purchase to help you decide. If you're unsure, start with
            Single Frame ($11) to test the service risk-free.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">8. CONTACT SUPPORT</h2>
          <p>
            Have questions about refunds or need help?{' '}
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
