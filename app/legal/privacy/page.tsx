export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 font-mono text-sm">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter text-primary">
        PRIVACY POLICY
      </h1>

      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">COMMITMENT TO PRIVACY</h2>
          <p>
            GlitchStudio respects your privacy and is committed to protecting personal data.
            This policy explains how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">INFORMATION WE COLLECT</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>
              <strong>Email Address</strong>: Collected during order placement for receipts and
              order updates.
            </li>
            <li>
              <strong>Photos Uploaded</strong>: Stored temporarily for processing and permanently
              archived for order history.
            </li>
            <li>
              <strong>Order Data</strong>: Package selected, vibe choice, notes, and payment
              transaction ID.
            </li>
            <li>
              <strong>IP Address & Device Info</strong>: Collected for security and analytics
              via Vercel logs.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">HOW WE USE YOUR DATA</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Process your order and deliver glitch files</li>
            <li>Send order confirmations, updates, and receipts</li>
            <li>Handle refund and support requests</li>
            <li>Prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">DATA STORAGE & SECURITY</h2>
          <p>
            Your data is stored on Neon (PostgreSQL) and Vercel Blob (file storage), both
            encrypted in transit and at rest. We implement industry-standard security practices
            but cannot guarantee 100% security against unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">PAYMENT DATA</h2>
          <p>
            Payment processing is handled by PayPal. We do not store credit card or bank
            account data. See PayPal's Privacy Policy for their data handling practices.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">COOKIES & TRACKING</h2>
          <p>
            We use functional cookies for:
          </p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Session management (admin dashboard)</li>
            <li>Order tracking and download tokens</li>
            <li>Analytics via Vercel Analytics (anonymized)</li>
          </ul>
          <p className="mt-2">
            You can disable cookies in browser settings, but core functionality may be affected.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">DATA RETENTION</h2>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Order data: Retained indefinitely for business and legal records</li>
            <li>Photos: Deleted after 90 days unless you request retention</li>
            <li>Download tokens: Expire after 30 days</li>
            <li>Cookies: Session cookies cleared on browser close; persistent cookies expire in 7 days</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">YOUR RIGHTS</h2>
          <p>You have the right to:</p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>Request a copy of your personal data</li>
            <li>Request deletion of your photos and personal data</li>
            <li>Opt out of non-essential communications</li>
            <li>File a complaint with your local data protection authority (e.g., ICO for UK)</li>
          </ul>
          <p className="mt-2">
            Submit requests to:{' '}
            <a href="mailto:privacy@glitchstudio.com" className="text-primary hover:underline">
              privacy@glitchstudio.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">THIRD PARTIES</h2>
          <p>We may share data with:</p>
          <ul className="ml-4 space-y-2 list-disc">
            <li>PayPal (payment processing)</li>
            <li>Resend (email delivery)</li>
            <li>Vercel (hosting and analytics)</li>
            <li>Law enforcement (if required by law)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">GDPR & CCPA COMPLIANCE</h2>
          <p>
            For EU residents (GDPR): We process data based on contractual necessity (service
            delivery) and legitimate interests (fraud prevention). You have rights to access,
            rectification, deletion, and portability.
          </p>
          <p className="mt-2">
            For California residents (CCPA): You have rights to know, delete, and opt-out of
            data sales. We do not sell personal information.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">CHANGES TO PRIVACY POLICY</h2>
          <p>
            We may update this policy. Major changes will be announced via email. Continued use
            constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-glitch-magenta">CONTACT US</h2>
          <p>
            Questions about privacy? Email:{' '}
            <a href="mailto:privacy@glitchstudio.com" className="text-primary hover:underline">
              privacy@glitchstudio.com
            </a>
          </p>
        </section>

        <hr className="border-border my-8" />
        <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </main>
  )
}
