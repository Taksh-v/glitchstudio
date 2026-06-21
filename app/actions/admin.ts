'use server'

import { ADMIN_COOKIE, getAdminPassword } from '@/lib/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLogin(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get('password') ?? '')
  if (password !== getAdminPassword()) {
    return { error: 'ACCESS DENIED // wrong key' }
  }
  const store = await cookies()
  store.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect('/admin')
}

export async function adminLogout() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  redirect('/admin')
}
