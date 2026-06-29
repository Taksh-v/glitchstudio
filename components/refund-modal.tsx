'use client'

import { useState } from 'react'
import { X, AlertCircle, CheckCircle } from 'lucide-react'

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  orderCode: string
  amount: number
  onSubmit: (reason: string) => Promise<{ ok: boolean; error?: string }>
}

export function RefundModal({
  isOpen,
  onClose,
  orderCode,
  amount,
  onSubmit,
}: RefundModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a reason for the refund')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await onSubmit(reason)
      if (result.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setReason('')
        }, 2000)
      } else {
        setError(result.error || 'Failed to process refund request')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Request Refund</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-2">Refund Requested</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;ve received your refund request for order {orderCode}. We&apos;ll review it within 24 hours.
            </p>
            <p className="text-xs text-muted-foreground">
              If approved, the funds will return to your account within 3-5 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Info */}
            <div className="bg-card border border-border rounded p-3">
              <div className="text-xs text-muted-foreground mb-1">Order Details</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-foreground">{orderCode}</span>
                <span className="font-bold text-foreground">${(amount / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Why are you requesting a refund? *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  setError(null)
                }}
                placeholder="Please let us know why you'd like a refund..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Money-back Guarantee */}
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-xs">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-green-700">
                  <strong>30-Day Money-Back Guarantee</strong>
                  <p className="mt-1">
                    If you&apos;re not satisfied for any reason, we&apos;ll refund you in full, no questions asked.
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !reason.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Request Refund'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
