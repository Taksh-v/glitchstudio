/**
 * Error Tracking & Monitoring
 * Capture, log, and notify about errors in production
 *
 * Integrates with:
 * - Console (dev)
 * - Sentry (optional prod monitoring)
 * - Database (for audit trail)
 */

export interface ErrorEvent {
  code: string // e.g., "PAYMENT_FAILED"
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
  timestamp: Date
  userEmail?: string
  orderCode?: string
}

// In-memory error buffer for tracking
const errorBuffer: ErrorEvent[] = []
const MAX_BUFFER_SIZE = 100

/**
 * Log an error event
 * @param error - Error details
 */
export function logError(error: ErrorEvent): void {
  // Add timestamp if not provided
  error.timestamp = error.timestamp || new Date()

  // Add to buffer
  errorBuffer.push(error)
  if (errorBuffer.length > MAX_BUFFER_SIZE) {
    errorBuffer.shift()
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${error.severity.toUpperCase()}] ${error.code}`, {
      message: error.message,
      context: error.context,
      email: error.userEmail,
      order: error.orderCode,
    })
  }

  // Send to Sentry if configured (future integration)
  if (process.env.SENTRY_DSN && error.severity !== 'low') {
    // TODO: Integrate with Sentry
    void reportToSentry(error)
  }

  // Alert admin if critical
  if (error.severity === 'critical') {
    void sendCriticalAlert(error)
  }
}

/**
 * Get all errors from buffer (for debugging)
 */
export function getErrorBuffer(): ErrorEvent[] {
  return [...errorBuffer].reverse() // Most recent first
}

/**
 * Common error codes and user-friendly messages
 */
export const ERROR_MESSAGES = {
  PAYMENT_FAILED: {
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Check your PayPal account and try again.',
    suggestion: 'If the problem persists, contact support.',
  },
  UPLOAD_FAILED: {
    title: 'Upload Failed',
    message: 'We couldn't upload your photo. Check that it's a valid image file under 10MB.',
    suggestion: 'Try refreshing the page and uploading again.',
  },
  INVALID_PACKAGE: {
    title: 'Invalid Selection',
    message: 'The package you selected is not available. Please choose again.',
    suggestion: 'Refresh the page and select a valid package.',
  },
  EMAIL_FAILED: {
    title: 'Email Not Sent',
    message: 'We saved your order but couldn't send the confirmation email.',
    suggestion:
      "Don't worry — your files are safe. Check your spam folder or contact support.",
  },
  DATABASE_ERROR: {
    title: 'System Error',
    message: 'We encountered a temporary problem. Your order may not have been saved.',
    suggestion: 'Please try again in a few moments.',
  },
  DOWNLOAD_EXPIRED: {
    title: 'Link Expired',
    message: 'Your download link has expired after 30 days.',
    suggestion:
      'Reply to your email to request a new download link.',
  },
  RATE_LIMIT: {
    title: 'Too Many Requests',
    message: 'You're uploading too quickly. Please wait a moment and try again.',
    suggestion: 'Slow down and try again in 1 minute.',
  },
}

/**
 * Build user-friendly error response
 */
export function getUserFriendlyError(
  code: keyof typeof ERROR_MESSAGES,
): { title: string; message: string; suggestion: string } {
  return (
    ERROR_MESSAGES[code] || {
      title: 'Something Went Wrong',
      message: 'We encountered an unexpected error. Please try again.',
      suggestion: 'If the problem persists, contact support.',
    }
  )
}

/**
 * Send critical alert to admin
 */
async function sendCriticalAlert(error: ErrorEvent): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_EMAIL

  if (!apiKey || !to) {
    console.error('[v0] Cannot send alert — missing email config')
    return
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'GlitchStudio <onboarding@resend.dev>',
      to,
      subject: `🚨 CRITICAL ERROR: ${error.code}`,
      text: [
        `CRITICAL ERROR IN PRODUCTION`,
        ``,
        `Code:       ${error.code}`,
        `Severity:   CRITICAL`,
        `Message:    ${error.message}`,
        `Timestamp:  ${error.timestamp.toISOString()}`,
        error.userEmail ? `Customer:   ${error.userEmail}` : '',
        error.orderCode ? `Order:      ${error.orderCode}` : '',
        ``,
        `Context: ${JSON.stringify(error.context, null, 2)}`,
        ``,
        `ACTION REQUIRED: Check the admin dashboard and production logs immediately.`,
      ]
        .filter((x) => x)
        .join('\n'),
    })
  } catch (err) {
    console.error('[v0] Failed to send critical alert:', err)
  }
}

/**
 * Send to Sentry (placeholder for future integration)
 */
async function reportToSentry(error: ErrorEvent): Promise<void> {
  // TODO: Implement Sentry integration
  // const Sentry = require("@sentry/node");
  // Sentry.captureException(error);
}

/**
 * Error recovery suggestions based on error code
 */
export function getRecoverySuggestions(
  code: string,
): string[] {
  const suggestions: Record<string, string[]> = {
    PAYMENT_FAILED: [
      'Check your PayPal account balance',
      'Verify your payment method is valid',
      'Try a different payment method',
      'Wait 5 minutes and try again',
      'Contact PayPal support',
    ],
    UPLOAD_FAILED: [
      'Refresh the page',
      'Try a different photo',
      'Check file size (max 10MB)',
      'Use a supported image format (JPG, PNG, WebP)',
      'Try uploading from a different device',
    ],
    EMAIL_FAILED: [
      'Check your spam folder',
      'Reply to this message',
      'Contact support with your order code',
      'Re-enter your email and we'll resend',
    ],
    DOWNLOAD_EXPIRED: [
      'Reply to your confirmation email',
      'Contact support with your order code',
      'Use your order code to request a new link',
    ],
  }

  return suggestions[code] || [
    'Try again',
    'Refresh the page',
    'Contact support',
  ]
}
