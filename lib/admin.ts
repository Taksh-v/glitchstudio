import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'gs_admin'
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

// The secret password that unlocks /admin. Falls back to a default so the
// dashboard is demoable out of the box; set ADMIN_PASSWORD to override.
export function getAdminPassword() {
  const pwd = process.env.ADMIN_PASSWORD || 'letmein'
  if (!pwd) throw new Error('ADMIN_PASSWORD must be set')
  return pwd
}

export async function isAdminAuthed() {
  const store = await cookies()
  const cookie = store.get(ADMIN_COOKIE)

  if (!cookie?.value) return false

  // Verify password hasn't changed
  if (cookie.value !== getAdminPassword()) return false

  return true
}
