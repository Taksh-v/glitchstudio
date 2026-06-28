/**
 * Simple in-memory rate limiting (suitable for serverless).
 * For production at scale, use Upstash Redis instead.
 */

const requestCounts = new Map<string, { count: number; reset: number }>()

export function rateLimit(
  key: string,
  maxRequests: number = 20,
  windowMs: number = 60 * 1000, // 1 minute
): boolean {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now > record.reset) {
    requestCounts.set(key, { count: 1, reset: now + windowMs })
    return true
  }

  if (record.count < maxRequests) {
    record.count++
    return true
  }

  return false
}

export function getRateLimitInfo(key: string) {
  const record = requestCounts.get(key)
  if (!record) return null
  return {
    count: record.count,
    remaining: Math.max(0, 20 - record.count),
    resetAt: record.reset,
  }
}
