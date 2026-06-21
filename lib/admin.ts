import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'gs_admin'

// The secret password that unlocks /admin. Falls back to a default so the
// dashboard is demoable out of the box; set ADMIN_PASSWORD to override.
export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'letmein'
}

export async function isAdminAuthed() {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === getAdminPassword()
}
