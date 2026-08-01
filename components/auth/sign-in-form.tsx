'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { authClient } from '~/lib/auth-client'
import {
  maxAgeSecondsUntil,
  setSessionHintCookie,
} from '~/lib/auth-session-hint'
import { cn } from '~/lib/utils'

type Busy = 'idle' | 'passkey-up' | 'passkey-in' | 'github'

export function SignInForm({
  githubEnabled,
  className,
}: {
  githubEnabled: boolean
  className?: string
}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState<Busy>('idle')
  const [error, setError] = useState<string | null>(null)
  const [showSecondPasskey, setShowSecondPasskey] = useState(false)

  async function markSignedInAndGoHome() {
    const session = await authClient.getSession()
    const expiresAt = session.data?.session?.expiresAt
    setSessionHintCookie({
      maxAgeSeconds: expiresAt
        ? maxAgeSecondsUntil(expiresAt)
        : undefined,
    })
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.sessionHint = '1'
    }
    router.replace('/')
    router.refresh()
  }

  async function markSignedInHintOnly() {
    const session = await authClient.getSession()
    const expiresAt = session.data?.session?.expiresAt
    setSessionHintCookie({
      maxAgeSeconds: expiresAt
        ? maxAgeSecondsUntil(expiresAt)
        : undefined,
    })
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.sessionHint = '1'
    }
  }

  async function signUpWithPasskey() {
    setError(null)
    setBusy('passkey-up')
    try {
      const displayName = name.trim() || 'Cleo visitor'
      const result = await authClient.passkey.addPasskey({
        name: displayName,
        context: JSON.stringify({ name: displayName }),
      })
      if (result.error) {
        setError(result.error.message || 'Passkey sign-up failed.')
        return
      }
      await markSignedInHintOnly()
      setShowSecondPasskey(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passkey sign-up failed.')
    } finally {
      setBusy('idle')
    }
  }

  async function signInWithPasskey() {
    setError(null)
    setBusy('passkey-in')
    try {
      const result = await authClient.signIn.passkey()
      if (result.error) {
        setError(result.error.message || 'Passkey sign-in failed.')
        return
      }
      await markSignedInAndGoHome()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passkey sign-in failed.')
    } finally {
      setBusy('idle')
    }
  }

  async function addSecondPasskey() {
    setError(null)
    setBusy('passkey-up')
    try {
      const result = await authClient.passkey.addPasskey({
        name: 'Recovery passkey',
      })
      if (result.error) {
        setError(result.error.message || 'Could not add a second passkey.')
        return
      }
      setShowSecondPasskey(false)
      await markSignedInAndGoHome()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not add a second passkey.',
      )
    } finally {
      setBusy('idle')
    }
  }

  async function signInWithGitHub() {
    setError(null)
    setBusy('github')
    try {
      // Hint is set server-side when the OAuth callback creates a session.
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub sign-in failed.')
      setBusy('idle')
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      <div className="flex flex-col gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="sign-in-name">
          Display name
          <span className="text-muted-foreground/80"> (passkey sign-up)</span>
        </label>
        <Input
          id="sign-in-name"
          name="name"
          autoComplete="username webauthn"
          placeholder="How should we greet you?"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={busy !== 'idle'}
        />
        <Button
          type="button"
          variant="primary"
          size="lg"
          expandHitArea
          disabled={busy !== 'idle'}
          onClick={() => void signUpWithPasskey()}
        >
          {busy === 'passkey-up' ? 'Waiting for passkey…' : 'Create passkey'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          expandHitArea
          disabled={busy !== 'idle'}
          onClick={() => void signInWithPasskey()}
        >
          {busy === 'passkey-in' ? 'Waiting for passkey…' : 'Sign in with passkey'}
        </Button>
      </div>

      {githubEnabled ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden />
            or
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            expandHitArea
            disabled={busy !== 'idle'}
            onClick={() => void signInWithGitHub()}
          >
            {busy === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
          </Button>
        </div>
      ) : null}

      <p className="text-sm leading-relaxed text-muted-foreground">
        There is no password reset email. Register a second passkey and link
        GitHub so you can recover the account if a device is lost. Passkey sync
        through iCloud Keychain or Google Password Manager is the primary safety
        net.
      </p>

      {showSecondPasskey ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-accent/40 p-4">
          <p className="text-sm text-foreground">
            Add a second passkey now? This is the recovery path when a device is
            lost.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={busy !== 'idle'}
              onClick={() => void addSecondPasskey()}
            >
              Add another passkey
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={busy !== 'idle'}
              onClick={() => {
                setShowSecondPasskey(false)
                void markSignedInAndGoHome()
              }}
            >
              Skip for now
            </Button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to Cleo
        </Link>
      </p>
    </div>
  )
}
