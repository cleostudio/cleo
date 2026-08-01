import type { Metadata } from 'next'

import { SignInForm } from '~/components/auth/sign-in-form'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  const githubEnabled = Boolean(
    process.env.GITHUB_CLIENT_ID?.trim() &&
      process.env.GITHUB_CLIENT_SECRET?.trim(),
  )

  return (
    <main className="mx-auto w-full max-w-content-narrow px-6 pb-24 pt-16">
      <header className="mb-10">
        <p className="text-sm text-muted-foreground">Cleo</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
          Passkeys are the primary path. GitHub is available as a second method
          and for recovery. Signing in does not change how Cleo works yet —
          conversation history stays on this device until a later stage.
        </p>
      </header>
      <SignInForm githubEnabled={githubEnabled} />
    </main>
  )
}
