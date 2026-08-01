'use client'

import { useEffect, useState } from 'react'

import { Button } from '~/components/cleo/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  adoptLocalThreadsAction,
  type AdoptableLocalThread,
} from '~/lib/cleo/thread-actions'
import {
  deleteThread,
  listThreads,
  loadThread,
} from '~/lib/cleo/thread-store'

/**
 * On first sign-in, offer to copy Stage 1 IndexedDB threads into Postgres
 * using the same UUID primary keys (plan §7.2). Clears local copies only
 * after a successful adopt — never silently.
 */
export function AdoptLocalThreadsDialog({
  onAdopted,
}: {
  onAdopted: () => void
}) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payload, setPayload] = useState<AdoptableLocalThread[]>([])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const metas = await listThreads()
        if (cancelled || metas.length === 0) return

        const threads: AdoptableLocalThread[] = []
        for (const meta of metas) {
          const loaded = await loadThread(meta.id)
          if (!loaded) continue
          threads.push({
            thread: {
              id: meta.id,
              title: meta.title,
              createdAt: meta.createdAt,
              updatedAt: meta.updatedAt,
              lastMessageAt: meta.lastMessageAt,
            },
            messages: loaded.messages.map((message, index) => ({
              id: message.stableId ?? crypto.randomUUID(),
              seq: index + 1,
              role: message.role,
              content: message.content,
              status: message.incomplete ? 'incomplete' : 'complete',
              createdAt: Date.now(),
              reasoningItems: message.reasoningItems,
            })),
          })
        }

        if (!cancelled && threads.length > 0) {
          setPayload(threads)
          setCount(threads.length)
          setOpen(true)
        }
      } catch {
        // IndexedDB unavailable — nothing to adopt.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleAdopt() {
    setBusy(true)
    setError(null)
    const result = await adoptLocalThreadsAction(payload)
    if (!result.ok) {
      setError(result.error)
      setBusy(false)
      return
    }
    for (const item of payload) {
      await deleteThread(item.thread.id)
    }
    setBusy(false)
    setOpen(false)
    onAdopted()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bring local conversations?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            This browser has {count} conversation
            {count === 1 ? '' : 's'} saved only on this device. Move{' '}
            {count === 1 ? 'it' : 'them'} into your account so they follow you
            across devices? Local copies are cleared only after a successful
            move.
          </p>
          {error ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => setOpen(false)}
          >
            Keep local only
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={busy}
            onClick={() => void handleAdopt()}
          >
            {busy ? 'Moving…' : 'Move to account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
