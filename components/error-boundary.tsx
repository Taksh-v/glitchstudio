'use client'

import { useEffect, useState } from 'react'

export function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div className="mx-auto max-w-2xl rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="font-mono text-sm text-destructive">
            Something went wrong. Please refresh the page.
          </p>
        </div>
      )
    )
  }

  return children
}
