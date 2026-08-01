'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AskForm,
  type AskFormMessage,
} from '~/components/cleo/ask-form'
import { AdoptLocalThreadsDialog } from '~/components/cleo/adopt-local-threads'
import { ThreadToolbar } from '~/components/cleo/thread-list'
import { takeCleoPromptFromLocation } from '~/lib/cleo/ask-link'
import { newThreadId } from '~/lib/cleo/thread-id'
import {
  loadThread,
  saveThread,
  type StoredThreadMeta,
} from '~/lib/cleo/thread-store'
import {
  maxAgeSecondsUntil,
  setSessionHintCookie,
} from '~/lib/auth-session-hint'
import { loadServerThreadAction } from '~/lib/cleo/thread-actions'

function hasPersistableContent(messages: AskFormMessage[]) {
  return messages.some(
    (message) =>
      !message.hidden &&
      (Boolean(message.content.trim()) || Boolean(message.images?.length)),
  )
}

function replaceCleoUrl(threadId: string) {
  if (typeof window === 'undefined') return
  const next = `/cleo/${threadId}`
  if (window.location.pathname === next) return
  window.history.replaceState(window.history.state, '', next)
}

/**
 * Owns thread identity + hydration around AskForm.
 * Signed-out: Stage 1 IndexedDB. Signed-in: Postgres via server actions / API.
 * Location coordinates never enter the persistence path.
 */
export function ThreadSession({
  routeThreadId,
  signedIn = false,
  initialServerThreads,
  initialServerMessages,
}: {
  routeThreadId?: string
  signedIn?: boolean
  initialServerThreads?: StoredThreadMeta[]
  initialServerMessages?: AskFormMessage[]
}) {
  const router = useRouter()
  const persistence = signedIn ? 'server' : 'local'
  const threadIdRef = useRef<string | null>(routeThreadId ?? null)
  const [threadId, setThreadId] = useState<string | null>(routeThreadId ?? null)
  const [ready, setReady] = useState(false)
  const [initialMessages, setInitialMessages] = useState<
    AskFormMessage[] | undefined
  >(undefined)
  const [arrivalPrompt, setArrivalPrompt] = useState<string | undefined>()
  const [formKey, setFormKey] = useState(
    () => routeThreadId ?? 'cleo-new',
  )
  const [listVersion, setListVersion] = useState(0)

  useEffect(() => {
    if (!signedIn) return
    // Repair a missing hint when RSC already knows we are signed in (§6.2).
    setSessionHintCookie({
      maxAgeSeconds: maxAgeSecondsUntil(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.sessionHint = '1'
    }
  }, [signedIn])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      if (routeThreadId) {
        threadIdRef.current = routeThreadId
        setThreadId(routeThreadId)

        if (signedIn) {
          if (initialServerMessages) {
            if (!cancelled) {
              setInitialMessages(initialServerMessages)
              setArrivalPrompt(undefined)
              setFormKey(routeThreadId)
              setReady(true)
            }
            return
          }
          const loaded = await loadServerThreadAction(routeThreadId)
          if (cancelled) return
          if (!loaded.ok) {
            threadIdRef.current = null
            setThreadId(null)
            router.replace('/cleo')
            return
          }
          setInitialMessages(loaded.messages as AskFormMessage[])
          setArrivalPrompt(undefined)
          setFormKey(routeThreadId)
          setReady(true)
          return
        }

        const loaded = await loadThread(routeThreadId)
        if (cancelled) return
        setInitialMessages(loaded?.messages)
        setArrivalPrompt(undefined)
        setFormKey(routeThreadId)
        setReady(true)
        return
      }

      const prompt = takeCleoPromptFromLocation()
      if (prompt) {
        const id = newThreadId()
        threadIdRef.current = id
        setThreadId(id)
        replaceCleoUrl(id)
        if (!cancelled) {
          setArrivalPrompt(prompt)
          setInitialMessages(undefined)
          setFormKey(id)
          setReady(true)
        }
        return
      }

      threadIdRef.current = null
      setThreadId(null)
      if (!cancelled) {
        setArrivalPrompt(undefined)
        setInitialMessages(undefined)
        setFormKey('cleo-new')
        setReady(true)
      }
    }

    setReady(false)
    void boot()
    return () => {
      cancelled = true
    }
  }, [routeThreadId, signedIn, initialServerMessages, router])

  const handleThreadId = useCallback((id: string) => {
    threadIdRef.current = id
    setThreadId(id)
    replaceCleoUrl(id)
    setFormKey(id)
  }, [])

  const handleConversationChange = useCallback(
    (messages: AskFormMessage[]) => {
      if (!hasPersistableContent(messages)) return

      // Signed-in turns persist on the server inside /api/responses.
      if (signedIn) {
        setListVersion((value) => value + 1)
        return
      }

      let id = threadIdRef.current
      if (!id) {
        id = newThreadId()
        threadIdRef.current = id
        setThreadId(id)
        replaceCleoUrl(id)
        setFormKey(id)
      }

      void saveThread(id, messages).then((ok) => {
        if (ok) setListVersion((value) => value + 1)
      })
    },
    [signedIn],
  )

  const handleNewThread = useCallback(() => {
    threadIdRef.current = null
    setThreadId(null)
    router.push('/cleo')
  }, [router])

  const handleOpenThread = useCallback(
    (id: string) => {
      router.push(`/cleo/${id}`)
    },
    [router],
  )

  const handleThreadsChanged = useCallback(() => {
    setListVersion((value) => value + 1)
    if (
      threadIdRef.current &&
      typeof window !== 'undefined' &&
      window.location.pathname === `/cleo/${threadIdRef.current}`
    ) {
      if (signedIn) {
        void loadServerThreadAction(threadIdRef.current).then((loaded) => {
          if (!loaded.ok) {
            threadIdRef.current = null
            setThreadId(null)
            router.replace('/cleo')
          }
        })
        return
      }
      void loadThread(threadIdRef.current).then((loaded) => {
        if (!loaded) {
          threadIdRef.current = null
          setThreadId(null)
          router.replace('/cleo')
        }
      })
    }
  }, [router, signedIn])

  if (!ready) {
    return (
      <div className="app-column min-w-0">
        <ThreadToolbar
          currentThreadId={threadIdRef.current}
          listVersion={listVersion}
          onNewThread={handleNewThread}
          onOpenThread={handleOpenThread}
          onThreadsChanged={handleThreadsChanged}
          persistence={persistence}
          initialServerThreads={initialServerThreads}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      {signedIn ? (
        <AdoptLocalThreadsDialog onAdopted={handleThreadsChanged} />
      ) : null}
      <ThreadToolbar
        currentThreadId={threadIdRef.current}
        listVersion={listVersion}
        onNewThread={handleNewThread}
        onOpenThread={handleOpenThread}
        onThreadsChanged={handleThreadsChanged}
        persistence={persistence}
        initialServerThreads={initialServerThreads}
      />
      <AskForm
        initialMessages={initialMessages}
        initialPrompt={arrivalPrompt}
        key={formKey}
        onConversationChange={handleConversationChange}
        persistence={persistence}
        threadId={threadId}
        onThreadId={handleThreadId}
      />
    </div>
  )
}
