'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'

import { PixelCluster } from '~/components/pixel-cluster'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { authClient } from '~/lib/auth-client'
import { T } from '~/lib/i18n'

type AuthMode = 'sign-in' | 'sign-up'

/** Shared stamp for the account register (sign-in / sign-up / account). */
const AUTH_CLUSTER_VARIANT = 8

const enterDelay = (ms: number) =>
  ({ '--enter-delay': `${ms}ms` }) as CSSProperties

function AuthShell({
  titleId,
  eyebrow,
  description,
  children,
  footer,
}: {
  titleId: string
  eyebrow: ReactNode
  description: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 id={titleId} className="page-eyebrow enter">
            {eyebrow}
          </h1>
          <p
            className="enter mt-4 max-w-content-narrow text-sm leading-relaxed text-muted-foreground"
            style={enterDelay(40)}
          >
            {description}
          </p>
        </header>
        <PixelCluster
          variant={AUTH_CLUSTER_VARIANT}
          className="enter shrink-0"
        />
      </div>

      <div className="enter mt-8 max-w-sm" style={enterDelay(80)}>
        {children}
      </div>

      {footer ? (
        <div className="enter mt-6" style={enterDelay(100)}>
          {footer}
        </div>
      ) : null}
    </div>
  )
}

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
    <form
      // Prefer POST if the browser submits before hydration (default GET
      // would put the password in the query string / history).
      method="post"
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
    >
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
        destructive={Boolean(error)}
      />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={pending}
          expandHitArea
        >
          {mode === 'sign-up' ? (
            <T zh="创建账户" en="Create account" />
          ) : (
            <T zh="登录" en="Sign in" />
          )}
        </Button>
      </div>
    </form>
  )
}

function AuthFooterLink({
  prompt,
  href,
  label,
}: {
  prompt: ReactNode
  href: string
  label: ReactNode
}) {
  return (
    <p className="text-sm text-muted-foreground">
      {prompt}{' '}
      <Link
        href={href}
        className="underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground motion-reduce:transition-none"
      >
        {label}
      </Link>
    </p>
  )
}

export function SignInPageView() {
  return (
    <AuthShell
      titleId="sign-in-title"
      eyebrow={<T zh="登录" en="Sign in" />}
      description={
        <T
          zh="使用邮箱和密码登录 Cleo。"
          en="Sign in to Cleo with email and password."
        />
      }
      footer={
        <AuthFooterLink
          prompt={<T zh="还没有账户？" en="No account yet?" />}
          href="/sign-up"
          label={<T zh="创建账户" en="Create one" />}
        />
      }
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  )
}

export function SignUpPageView() {
  return (
    <AuthShell
      titleId="sign-up-title"
      eyebrow={<T zh="创建账户" en="Create account" />}
      description={
        <T
          zh="用邮箱注册。密码至少 8 位。"
          en="Register with email. Password must be at least 8 characters."
        />
      }
      footer={
        <AuthFooterLink
          prompt={<T zh="已有账户？" en="Already have an account?" />}
          href="/sign-in"
          label={<T zh="登录" en="Sign in" />}
        />
      }
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
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
      <AuthShell
        titleId="account-title"
        eyebrow={<T zh="账户" en="Account" />}
        description={
          <T
            zh="登录后可查看账户信息。"
            en="Sign in to view your account."
          />
        }
      >
        <nav
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
          aria-label="Account options"
        >
          <Link
            href="/sign-in"
            className="underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground motion-reduce:transition-none"
          >
            <T zh="登录" en="Sign in" />
          </Link>
          <Link
            href="/sign-up"
            className="underline decoration-border underline-offset-4 transition-colors duration-150 hover:decoration-foreground motion-reduce:transition-none"
          >
            <T zh="创建账户" en="Create account" />
          </Link>
        </nav>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      titleId="account-title"
      eyebrow={<T zh="账户" en="Account" />}
      description={
        <T
          zh="当前会话的账户信息。"
          en="Details for your current session."
        />
      }
    >
      <dl className="spec-nameplate">
        <div>
          <dt>
            <T zh="名称" en="Name" />
          </dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>
            <T zh="邮箱" en="Email" />
          </dt>
          <dd>{user.email}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <Button
          type="button"
          variant="tertiary"
          size="lg"
          loading={pending}
          expandHitArea
          onClick={() => void signOut()}
        >
          <T zh="退出登录" en="Sign out" />
        </Button>
      </div>
    </AuthShell>
  )
}
