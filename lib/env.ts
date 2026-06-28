/**
 * Environment validation and config.
 * Ensures all required vars are set at build/startup.
 */

interface EnvConfig {
  databaseUrl: string
  adminPassword: string
  isProduction: boolean
  paypalClientId?: string
  paypalClientSecret?: string
  paypalMode?: string
  resendApiKey?: string
  adminEmail?: string
}

export function validateEnv(): EnvConfig {
  const errors: string[] = []
  const warnings: string[] = []

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) errors.push('DATABASE_URL is required')

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) errors.push('ADMIN_PASSWORD is required')

  // PayPal is required in production
  const isProduction = process.env.NODE_ENV === 'production'
  const paypalClientId = process.env.PAYPAL_CLIENT_ID
  const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (isProduction) {
    if (!paypalClientId) errors.push('PAYPAL_CLIENT_ID is required in production')
    if (!paypalClientSecret) errors.push('PAYPAL_CLIENT_SECRET is required in production')
  } else {
    // Development: warn if PayPal not configured
    if (!paypalClientId) warnings.push('PAYPAL_CLIENT_ID not set (payments will fail)')
    if (!paypalClientSecret) warnings.push('PAYPAL_CLIENT_SECRET not set (payments will fail)')
  }

  if (errors.length > 0) {
    const message = `Missing environment variables:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    throw new Error(message)
  }

  if (warnings.length > 0 && isProduction) {
    console.warn('[v0] Environment warnings:\n' + warnings.map((w) => `  - ${w}`).join('\n'))
  }

  return {
    databaseUrl,
    adminPassword,
    isProduction,
    paypalClientId,
    paypalClientSecret,
    paypalMode: process.env.PAYPAL_MODE || 'sandbox',
    resendApiKey: process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
  }
}

let cachedConfig: EnvConfig | null = null

export function getEnv(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = validateEnv()
  }
  return cachedConfig
}
