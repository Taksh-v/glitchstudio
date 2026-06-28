import { randomBytes } from 'crypto'

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'sb-test-client'
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'sb-test-secret'
export const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox' // 'sandbox' or 'live'

export function validatePayPalEnv() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error(
      'PayPal configuration missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in env vars.',
    )
  }
}

/**
 * Generate a secure download token for accessing order files
 * Token format: GLX-<base64-random>
 */
export function generateDownloadToken(): string {
  const random = randomBytes(24).toString('base64').replace(/[^a-zA-Z0-9]/g, '')
  return `DL-${random}`
}

/**
 * Download tokens expire after 30 days
 */
export function getDownloadTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)
  return expiry
}

export const PAYPAL_API_BASE = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com',
}

export type PayPalOrderIntent = 'CAPTURE' | 'AUTHORIZE'
export type PayPalOrderStatus = 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED'

export interface PayPalOrderData {
  id: string
  status: PayPalOrderStatus
  payer?: {
    email_address: string
    name?: {
      given_name: string
      surname: string
    }
  }
  purchase_units?: Array<{
    reference_id: string
    amount: {
      currency_code: string
      value: string
    }
  }>
}

export interface PayPalCaptureResult {
  id: string
  status: 'COMPLETED' | 'DECLINED' | 'PENDING'
  payer: {
    email_address: string
  }
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string
        status: string
      }>
    }
  }>
}
