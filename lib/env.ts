/**
 * Environment validation and config.
 * Ensures all required vars are set at build/startup.
 */

interface EnvConfig {
  databaseUrl: string
  adminPassword: string
  isProduction: boolean
  resendApiKey?: string
  adminEmail?: string
}

export function validateEnv(): EnvConfig {
  const errors: string[] = []

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) errors.push('DATABASE_URL is required')

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) errors.push('ADMIN_PASSWORD is required')

  if (errors.length > 0) {
    const message = `Missing environment variables:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    throw new Error(message)
  }

  return {
    databaseUrl,
    adminPassword,
    isProduction: process.env.NODE_ENV === 'production',
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
