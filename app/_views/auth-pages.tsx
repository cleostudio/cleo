'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { authClient } from '~/lib/auth-client'
import { T } from '~/lib/i18n'

type AuthMode = 'sign-in' | 'sign-up'

function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Could not create account.')
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Could not sign in.')
          return
        }
      }

      router.replace('/account')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="mt-6 flex max-w-sm flex-col gap-4" onSubmit={onSubmit}>
      {mode === 'sign-up' ? (
        <Input
          label={<T zh="名称" en="Name" />}
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      ) : null}
      <Input
        label={<T zh="邮箱" en="Email" />}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label={<T zh="密码" en="Password" />}
        name="password"
        type="password"
        autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={error}
      />
      <div className="pt-1">
        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {mode === 'sign-up' ? (
            <T zh="创建账户" en={pending ? 'Creating…' : 'Create account'} />
          ) : (
            <T zh="登录" en={pending ? 'Signing in…' : 'Sign in'} />
          )}
        </Button>
      </div>
    </form>
  )
}

export function SignInPageView() {
  return (
    <div className="mx-auto box-border w-full max-w-content px-6">
      <section className="hairline-y py-8" aria-labelledby="sign-in-title">
        <p className="font-mono text-sm tracking-[-0.011em] text-muted-foreground">
          ACCOUNT
        </p>
        <h1
          id="sign-in-title"
          className="mt-4 text-sm font-semibold tracking-[-0.011em]"
        >
          <T zh="登录" en="Sign in" />
        </h1>
        <p className="mt-3 max-w-[32rem] text-sm leading-relaxed text-muted-foreground">
          <T
            zh="使用邮箱和密码登录 Cleo。"
            en="Sign in to Cleo with email and password."
          />
        </p>
        <AuthForm mode="sign-in" />
        <p className="mt-6 text-sm text-muted-foreground">
          <T zh="还没有账户？" en="No account yet?" />{' '}
          <Link
            href="/sign-up"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            <T zh="创建账户" en="Create one" />
          </Link>
        </p>
      </section>
    </div>
  )
}

export function SignUpPageView() {
  return (
    <div className="mx-auto box-border w-full max-w-content px-6">
      <section className="hairline-y py-8" aria-labelledby="sign-up-title">
        <p className="font-mono text-sm tracking-[-0.011em] text-muted-foreground">
          ACCOUNT
        </p>
        <h1
          id="sign-up-title"
          className="mt-4 text-sm font-semibold tracking-[-0.011em]"
        >
          <T zh="创建账户" en="Create account" />
        </h1>
        <p className="mt-3 max-w-[32rem] text-sm leading-relaxed text-muted-foreground">
          <T
            zh="用邮箱注册。密码至少 8 位。"
            en="Register with email. Password must be at least 8 characters."
          />
        </p>
        <AuthForm mode="sign-up" />
        <p className="mt-6 text-sm text-muted-foreground">
          <T zh="已有账户？" en="Already have an account?" />{' '}
          <Link
            href="/sign-in"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            <T zh="登录" en="Sign in" />
          </Link>
        </p>
      </section>
    </div>
  )
}

export function AccountPageView({
  user,
}: {
  user: { name: string; email: string } | null
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    try {
      await authClient.signOut()
      router.replace('/sign-in')
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  if (!user) {
    return (
      <div className="mx-auto box-border w-full max-w-content px-6">
        <section className="hairline-y py-8" aria-labelledby="account-title">
          <p className="font-mono text-sm tracking-[-0.011em] text-muted-foreground">
            ACCOUNT
          </p>
          <h1
            id="account-title"
            className="mt-4 text-sm font-semibold tracking-[-0.011em]"
          >
            <T zh="未登录" en="Not signed in" />
          </h1>
          <p className="mt-3 max-w-[32rem] text-sm leading-relaxed text-muted-foreground">
            <T
              zh="登录后可查看账户信息。"
              en="Sign in to view your account."
            />
          </p>
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              href="/sign-in"
              className="underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              <T zh="登录" en="Sign in" />
            </Link>
            <Link
              href="/sign-up"
              className="underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              <T zh="创建账户" en="Create account" />
            </Link>
          </nav>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto box-border w-full max-w-content px-6">
      <section className="hairline-y py-8" aria-labelledby="account-title">
        <p className="font-mono text-sm tracking-[-0.011em] text-muted-foreground">
          ACCOUNT
        </p>
        <h1
          id="account-title"
          className="mt-4 text-sm font-semibold tracking-[-0.011em]"
        >
          <T zh="账户" en="Account" />
        </h1>
        <dl className="mt-6 max-w-sm space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">
              <T zh="名称" en="Name" />
            </dt>
            <dd className="mt-1">{user.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">
              <T zh="邮箱" en="Email" />
            </dt>
            <dd className="mt-1">{user.email}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            disabled={pending}
            onClick={() => void signOut()}
          >
            <T zh="退出登录" en={pending ? 'Signing out…' : 'Sign out'} />
          </Button>
        </div>
      </section>
    </div>
  )
}
