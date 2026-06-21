'use client'

import { useActionState } from 'react'
import { adminLogin } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(adminLogin, {})

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        action={formAction}
        className="scanlines w-full max-w-sm rounded-md border border-primary bg-card p-7 shadow-[0_0_40px_-12px_var(--primary)]"
      >
        <div className="mb-1 font-mono text-[11px] tracking-widest text-muted-foreground">
          /// RESTRICTED
        </div>
        <h1 className="glitch-text font-mono text-2xl font-bold tracking-tighter text-foreground">
          OPERATOR LOGIN
        </h1>
        <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
          Enter the studio key to view incoming orders.
        </p>

        <div className="mt-6">
          <Label
            htmlFor="password"
            className="font-mono text-[11px] tracking-widest text-muted-foreground"
          >
            STUDIO KEY
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoFocus
            className="mt-1.5 border-border bg-secondary font-mono text-sm"
            placeholder="••••••••"
          />
        </div>

        {state?.error && (
          <p className="mt-3 font-mono text-xs text-destructive">
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="mt-6 w-full font-mono text-xs font-bold tracking-widest"
        >
          {pending ? 'VERIFYING...' : 'UNLOCK →'}
        </Button>
      </form>
    </div>
  )
}
