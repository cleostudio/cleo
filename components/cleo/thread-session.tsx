'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AskForm,
  type AskFormMessage,
} from '~/components/cleo/ask-form'
import { ThreadToolbar } from '~/components/cleo/thread-list'
import { takeCleoPromptFromLocation } from '~/lib/cleo/ask-link'
import { newThreadId } from '~/lib/cleo/thread-id'
import { loadThread, saveThread } from '~/lib/cleo/thread-store'

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
 * Owns local thread identity + IndexedDB hydration around AskForm.
 * Location coordinates never enter the persistence path.
 */
export function ThreadSession({
  routeThreadId,
}: {
  routeThreadId?: string
}) {
  const router = useRouter()
  const threadIdRef = useRef<string | null>(routeThreadId ?? null)
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
    let cancelled = false

    async function boot() {
      if (routeThreadId) {
        threadIdRef.current = routeThreadId
        const loaded = await loadThread(routeThreadId)
        if (cancelled) return
        setInitialMessages(loaded?.messages)
        setArrivalPrompt(undefined)
        setFormKey(routeThreadId)
        setReady(true)
        return
      }

      // `/cleo?q=…` starts a new durable thread, then AskForm asks once.
      const prompt = takeCleoPromptFromLocation()
      if (prompt) {
        const id = newThreadId()
        threadIdRef.current = id
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
  }, [routeThreadId])

  const handleConversationChange = useCallback(
    (messages: AskFormMessage[]) => {
      if (!hasPersistableContent(messages)) return

      let threadId = threadIdRef.current
      if (!threadId) {
        threadId = newThreadId()
        threadIdRef.current = threadId
        replaceCleoUrl(threadId)
        setFormKey(threadId)
      }

      void saveThread(threadId, messages).then((ok) => {
        if (ok) setListVersion((value) => value + 1)
      })
    },
    [],
  )

  const handleNewThread = useCallback(() => {
    threadIdRef.current = null
    router.push('/cleo')
  }, [router])

  const handleOpenThread = useCallback(
    (threadId: string) => {
      router.push(`/cleo/${threadId}`)
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
      // Current thread may have been deleted.
      void loadThread(threadIdRef.current).then((loaded) => {
        if (!loaded) {
          threadIdRef.current = null
          router.replace('/cleo')
        }
      })
    }
  }, [router])

  if (!ready) {
    return (
      <div className="app-column min-w-0">
        <ThreadToolbar
          currentThreadId={threadIdRef.current}
          listVersion={listVersion}
          onNewThread={handleNewThread}
          onOpenThread={handleOpenThread}
          onThreadsChanged={handleThreadsChanged}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <ThreadToolbar
        currentThreadId={threadIdRef.current}
        listVersion={listVersion}
        onNewThread={handleNewThread}
        onOpenThread={handleOpenThread}
        onThreadsChanged={handleThreadsChanged}
      />
      <AskForm
        initialMessages={initialMessages}
        initialPrompt={arrivalPrompt}
        key={formKey}
        onConversationChange={handleConversationChange}
      />
    </div>
  )
}
