import { PACKAGES } from './packages'

/**
 * SECURITY FIX #1: Server-side price verification
 * Never trust the frontend price - always fetch from database/config
 */
export function verifyPackagePrice(packageId: string, clientProvidedPrice: number): boolean {
  const pkg = PACKAGES.find((p) => p.id === packageId)
  if (!pkg) return false

  // Price in cents must match exactly
  return pkg.price === clientProvidedPrice
}

/**
 * SECURITY FIX #2: Get verified package price
 * Always use this to get prices for server-side operations
 */
export function getVerifiedPackagePrice(packageId: string): number | null {
  const pkg = PACKAGES.find((p) => p.id === packageId)
  return pkg?.price ?? null
}

/**
 * SECURITY FIX #3: Rate limiting for payment attempts
 * Prevents abuse and fraud attempts
 */
const paymentAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkPaymentRateLimit(
  identifier: string, // IP address or user ID
  maxAttempts = 10,
  windowMs = 60000, // 1 minute
): boolean {
  const now = Date.now()
  const record = paymentAttempts.get(identifier)

  if (!record || now > record.resetTime) {
    // Reset the window
    paymentAttempts.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxAttempts) {
    console.warn(`[v0] Payment rate limit exceeded for: ${identifier}`)
    return false
  }

  record.count++
  return true
}

/**
 * SECURITY FIX #4: Email validation before payment
 * Prevents typos and fake emails
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false

  // Check for common typos
  const commonDomainTypos = [
    { typo: 'gmial.com', correct: 'gmail.com' },
    { typo: 'gmai.com', correct: 'gmail.com' },
    { typo: 'yahooo.com', correct: 'yahoo.com' },
    { typo: 'hotmial.com', correct: 'hotmail.com' },
  ]

  const domain = email.split('@')[1].toLowerCase()
  const hasTypo = commonDomainTypos.some((t) => domain === t.typo)

  if (hasTypo) {
    console.warn(`[v0] Detected email typo: ${email}`)
    return false // We could also suggest the correct domain
  }

  return true
}

/**
 * SECURITY FIX #5: CSRF token validation
 * Prevents cross-site request forgery
 */
const csrfTokens = new Map<string, { token: string; expiresAt: number }>()

export function generateCSRFToken(): string {
  const token = crypto.getRandomValues(new Uint8Array(32)).toString()
  const expiresAt = Date.now() + 3600000 // 1 hour
  csrfTokens.set(token, { token, expiresAt })

  // Cleanup expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expiresAt < Date.now()) {
      csrfTokens.delete(key)
    }
  }

  return token
}

export function verifyCSRFToken(token: string): boolean {
  const record = csrfTokens.get(token)
  if (!record) return false
  if (record.expiresAt < Date.now()) {
    csrfTokens.delete(token)
    return false
  }
  csrfTokens.delete(token) // CSRF tokens are one-time use
  return true
}

/**
 * SECURITY FIX #6: Input sanitization
 * Prevents injection attacks
 */
export function sanitizeInput(input: string, maxLength = 255): string {
  return input
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[&]/g, '&amp;') // Escape ampersand
    .trim()
}

/**
 * SECURITY FIX #7: Audit logging
 * Track all payment attempts for security monitoring
 */
export interface PaymentAuditLog {
  timestamp: Date
  event: 'payment_initiated' | 'payment_captured' | 'payment_failed' | 'refund_requested'
  userId?: string
  email: string
  packageId: string
  amount: number
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failed'
  details?: string
}

const auditLogs: PaymentAuditLog[] = []

export function logPaymentEvent(event: PaymentAuditLog): void {
  auditLogs.push(event)

  // In production, send to error tracking service (e.g., Sentry)
  if (event.status === 'failed') {
    console.error('[v0] Payment audit log:', event)
  } else {
    console.log('[v0] Payment event:', event.event)
  }

  // Keep last 1000 events in memory for debugging
  if (auditLogs.length > 1000) {
    auditLogs.shift()
  }
}

export function getAuditLogs(limit = 100): PaymentAuditLog[] {
  return auditLogs.slice(-limit)
}

/**
 * SECURITY FIX #8: Download token validation
 * Ensures only valid, non-expired tokens grant access
 */
export function isDownloadTokenValid(
  token: string,
  expiresAt: Date,
  maxLength = 50,
): boolean {
  if (!token || token.length > maxLength) return false
  if (new Date() > expiresAt) return false
  return /^[a-zA-Z0-9_-]+$/.test(token) // Alphanumeric + hyphen/underscore only
}
