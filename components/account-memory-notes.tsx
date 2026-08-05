'use client'

import { useState, type FormEvent } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  CLEO_MEMORY_NOTE_MAX,
  CLEO_MEMORY_NOTES_MAX,
  type CleoMemoryNote,
} from '~/lib/cleo/memory'
import { T } from '~/lib/i18n'

type AccountMemoryNotesProps = {
  initialNotes: CleoMemoryNote[]
  /** False when Neon is unset — UI stays visible but writes are disabled. */
  stored: boolean
}

type Status = 'idle' | 'saving' | 'error'

async function memoryFetch(method: string, init?: RequestInit) {
  const response = await fetch('/api/cleo/memory', {
    method,
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const payload = (await response.json().catch(() => null)) as {
    error?: string
    note?: CleoMemoryNote
    notes?: CleoMemoryNote[]
    cleared?: number
  } | null
  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed')
  }
  return payload
}

export function AccountMemoryNotes({
  initialNotes,
  stored,
}: AccountMemoryNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const atCap = notes.length >= CLEO_MEMORY_NOTES_MAX
  const canWrite = stored && status !== 'saving'

  async function onAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const note = draft.trim()
    if (!note || !canWrite || atCap) return

    setStatus('saving')
    setError(null)
    try {
      const payload = await memoryFetch('POST', {
        body: JSON.stringify({ note }),
      })
      if (payload?.note) {
        setNotes((current) => [payload.note!, ...current])
        setDraft('')
      }
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not save note.')
    }
  }

  async function onDelete(id: string) {
    if (!canWrite) return
    setBusyId(id)
    setError(null)
    try {
      const response = await fetch(
        `/api/cleo/memory?id=${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(payload?.error || 'Could not delete note.')
      }
      setNotes((current) => current.filter((entry) => entry.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete note.')
    } finally {
      setBusyId(null)
    }
  }

  async function onClear() {
    if (!canWrite || notes.length === 0) return
    setStatus('saving')
    setError(null)
    try {
      await memoryFetch('DELETE', { body: JSON.stringify({ all: true }) })
      setNotes([])
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not clear notes.')
    }
  }

  return (
    <section className="page-cluster" aria-labelledby="cleo-memory-heading">
      <div>
        <h2
          id="cleo-memory-heading"
          className="text-sm font-medium text-foreground"
        >
          <T zh="Cleo 记忆" en="Cleo memory" />
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          <T
            zh="可选偏好笔记，供 Cleo 在登录会话中参考。访客无跨设备记忆。"
            en="Optional preference notes Cleo can use when you’re signed in. Guests have no cross-device memory."
          />
        </p>
      </div>

      {!stored ? (
        <p className="text-sm text-muted-foreground" role="status">
          <T
            zh="记忆存储当前不可用。"
            en="Memory storage is unavailable right now."
          />
        </p>
      ) : null}

      <form className="flex flex-col gap-3" onSubmit={(event) => void onAdd(event)}>
        <label className="sr-only" htmlFor="cleo-memory-note">
          <T zh="新记忆笔记" en="New memory note" />
        </label>
        <Input
          id="cleo-memory-note"
          autoComplete="off"
          disabled={!canWrite || atCap}
          maxLength={CLEO_MEMORY_NOTE_MAX}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="e.g. Prefer short answers in metric units"
          value={draft}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={status === 'saving'}
            disabled={!canWrite || atCap || !draft.trim()}
            expandHitArea
          >
            <T zh="添加" en="Add note" />
          </Button>
          {notes.length > 0 ? (
            <Button
              type="button"
              variant="tertiary"
              size="lg"
              disabled={!canWrite}
              onClick={() => void onClear()}
            >
              <T zh="全部清除" en="Clear all" />
            </Button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {notes.length}/{CLEO_MEMORY_NOTES_MAX}
        </p>
      </form>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {notes.length > 0 ? (
        <ul className="flex flex-col gap-3 text-sm">
          {notes.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <span className="min-w-0 flex-1 break-words text-foreground">
                {entry.note}
              </span>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                disabled={!canWrite || busyId === entry.id}
                onClick={() => void onDelete(entry.id)}
              >
                <T zh="删除" en="Delete" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          <T zh="暂无记忆笔记。" en="No memory notes yet." />
        </p>
      )}
    </section>
  )
}
