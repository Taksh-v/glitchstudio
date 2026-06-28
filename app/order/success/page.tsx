'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { capturePayPalOrder } from '@/app/actions/payments'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const params = useSearchParams()
  const paypalOrderId = params.get('token')
  const orderCode = params.get('orderCode')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [downloadToken, setDownloadToken] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!paypalOrderId || !orderCode) {
      setStatus('error')
      setError('Missing payment details. Please contact support.')
      return
    }

    async function completePayment() {
      const result = await capturePayPalOrder({
        paypalOrderId,
        orderCode,
      })

      if (result.ok) {
        setStatus('success')
        setDownloadToken(result.downloadToken)
      } else {
        setStatus('error')
        setError(result.error)
      }
    }

    completePayment()
  }, [paypalOrderId, orderCode])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-4xl animate-pulse">⚡</div>
          <h1 className="font-mono text-xl font-bold tracking-widest text-primary">
            PROCESSING PAYMENT...
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            Hold tight, your glitch is being prepared
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-md border border-glitch-magenta bg-card p-6">
          <h1 className="font-mono text-xl font-bold tracking-widest text-glitch-magenta">
            ✗ PAYMENT FAILED
          </h1>
          <p className="mt-3 font-mono text-sm text-foreground">{error}</p>
          <div className="mt-6 flex gap-3">
            <Button render={<Link href="/">← RETURN HOME</Link>} nativeButton={false} variant="outline" className="flex-1" />
            <Button render={<a href="mailto:support@glitchstudio.com">CONTACT SUPPORT</a>} nativeButton={false} className="flex-1" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {/* Celebration animation */}
        <div className="mb-6 text-6xl animate-bounce">🎉</div>

        <h1 className="mb-2 font-mono text-3xl font-bold tracking-tighter text-primary">
          ORDER <span className="text-glitch-magenta">CORRUPTED</span>
        </h1>

        <p className="mb-4 font-mono text-sm tracking-widest text-muted-foreground">
          {orderCode}
        </p>

        <div className="mb-8 rounded-md border border-primary bg-secondary/50 p-4">
          <p className="font-mono text-sm leading-relaxed text-foreground">
            Your payment was successful! Your glitched files are ready to download.
            {downloadToken && (
              <>
                <br />
                <span className="text-xs text-muted-foreground">
                  Download link available for 30 days
                </span>
              </>
            )}
          </p>
        </div>

        {downloadToken && (
          <Button
            render={
              <a href={`/api/download?token=${encodeURIComponent(downloadToken)}`}>
                DOWNLOAD_FILES.zip →
              </a>
            }
            nativeButton={false}
            className="mb-4 w-full font-mono text-sm font-bold tracking-widest"
          />
        )}

        <Button
          render={<Link href="/">← NEW_GLITCH</Link>}
          nativeButton={false}
          variant="outline"
          className="w-full font-mono text-sm tracking-widest"
        />

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Confirmation email sent to your inbox. Check spam if missing.
        </p>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary">Loading...</div></div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
