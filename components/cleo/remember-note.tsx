'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'

import { authClient } from '~/lib/auth-client'
import { CLEO_MEMORY_NOTE_MAX } from '~/lib/cleo/memory'
import { cn } from '~/lib/utils'

type RememberNoteProps = {
  className?: string
  /** Prefill from the user turn when opening the form. */
  suggestedNote?: string
  /** Unique suffix so multiple completed turns do not share input ids. */
  turnId?: string
}

type SubmitState = 'idle' | 'saving' | 'saved' | 'error'

async function postMemoryNote(note: string) {
  const response = await fetch('/api/cleo/memory', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ note }),
  })
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new Error(payload?.error || 'remember_failed')
  }
}

/**
 * Signed-in opt-in control to save a durable preference note for Cleo.
 * Guests see nothing — memory is account-scoped only.
 */
export function RememberNote({
  className,
  suggestedNote,
  turnId = 'default',
}: RememberNoteProps) {
  const { data: session, isPending } = authClient.useSession()
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<SubmitState>('idle')
  const inputId = `cleo-remember-note-${turnId}`

  if (isPending || !session?.user) return null

  async function submit() {
    const next = note.trim()
    if (!next) return
    setStatus('saving')
    try {
      await postMemoryNote(next)
      setStatus('saved')
      setNote('')
      setOpen(false)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={cn('cleo-answer-actions cleo-remember-note', className)}>
      <div className="cleo-answer-action-row">
        <button
          aria-expanded={open}
          aria-label="Remember a preference for Cleo"
          className={cn(
            'cleo-answer-action',
            open && 'cleo-answer-action-active',
          )}
          disabled={status === 'saving'}
          onClick={() => {
            setOpen((current) => {
              const next = !current
              if (next && !note.trim() && suggestedNote?.trim()) {
                setNote(suggestedNote.trim().slice(0, CLEO_MEMORY_NOTE_MAX))
              }
              return next
            })
            setStatus('idle')
          }}
          type="button"
        >
          <Bookmark aria-hidden className="size-3.5" strokeWidth={1.75} />
          Remember
        </button>
        {status === 'saved' ? (
          <span className="cleo-feedback-status" role="status">
            Saved
          </span>
        ) : null}
        {status === 'error' ? (
          <span
            className="cleo-feedback-status cleo-feedback-status-error"
            role="status"
          >
            Couldn’t save
          </span>
        ) : null}
      </div>

      {open ? (
        <form
          className="cleo-feedback-comment"
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
        >
          <label className="sr-only" htmlFor={inputId}>
            Preference to remember
          </label>
          <input
            autoComplete="off"
            className="cleo-feedback-comment-input"
            id={inputId}
            maxLength={CLEO_MEMORY_NOTE_MAX}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Preference to remember (e.g. prefer metric)"
            type="text"
            value={note}
          />
          <button
            className="cleo-answer-action"
            disabled={!note.trim() || status === 'saving'}
            type="submit"
          >
            Save
          </button>
        </form>
      ) : null}
    </div>
  )
}
