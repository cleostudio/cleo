'use client'

import { useEffect, useState } from 'react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

import {
  CLEO_FEEDBACK_COMMENT_MAX,
  type CleoFeedbackRating,
} from '~/lib/cleo/feedback-shared'
import { cn } from '~/lib/utils'

type MessageFeedbackProps = {
  assistant: string
  className?: string
  prompt: string
  turnId: string
}

type SubmitState = 'idle' | 'saving' | 'saved' | 'error'

async function postFeedback(body: {
  turnId: string
  rating: CleoFeedbackRating
  comment?: string
  prompt: string
  assistant: string
}) {
  const response = await fetch('/api/cleo/feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error('feedback_failed')
  }
}

export function MessageFeedback({
  assistant,
  className,
  prompt,
  turnId,
}: MessageFeedbackProps) {
  const [rating, setRating] = useState<CleoFeedbackRating | null>(null)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(false)
  const [status, setStatus] = useState<SubmitState>('idle')

  useEffect(() => {
    setRating(null)
    setComment('')
    setShowComment(false)
    setStatus('idle')
  }, [turnId])

  async function submit(nextRating: CleoFeedbackRating, nextComment?: string) {
    setStatus('saving')
    try {
      await postFeedback({
        turnId,
        rating: nextRating,
        comment: nextComment,
        prompt,
        assistant,
      })
      setRating(nextRating)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={cn('cleo-answer-actions cleo-message-feedback', className)}>
      <div className="cleo-answer-action-row">
        <button
          aria-label="Good response"
          aria-pressed={rating === 'up'}
          className={cn(
            'cleo-answer-action',
            rating === 'up' && 'cleo-answer-action-active',
          )}
          disabled={status === 'saving'}
          onClick={() => {
            setShowComment(true)
            void submit('up', comment.trim() || undefined)
          }}
          type="button"
        >
          <ThumbsUp aria-hidden className="size-3.5" strokeWidth={1.75} />
          Helpful
        </button>
        <button
          aria-label="Bad response"
          aria-pressed={rating === 'down'}
          className={cn(
            'cleo-answer-action',
            rating === 'down' && 'cleo-answer-action-active',
          )}
          disabled={status === 'saving'}
          onClick={() => {
            setShowComment(true)
            void submit('down', comment.trim() || undefined)
          }}
          type="button"
        >
          <ThumbsDown aria-hidden className="size-3.5" strokeWidth={1.75} />
          Needs work
        </button>
        {status === 'saved' ? (
          <span className="cleo-feedback-status" role="status">
            Thanks
          </span>
        ) : null}
        {status === 'error' ? (
          <span className="cleo-feedback-status cleo-feedback-status-error" role="status">
            Couldn’t save
          </span>
        ) : null}
      </div>

      {showComment ? (
        <form
          className="cleo-feedback-comment"
          onSubmit={(event) => {
            event.preventDefault()
            if (!rating) return
            void submit(rating, comment.trim() || undefined)
          }}
        >
          <label className="sr-only" htmlFor={`cleo-feedback-comment-${turnId}`}>
            Optional feedback note
          </label>
          <input
            autoComplete="off"
            className="cleo-feedback-comment-input"
            id={`cleo-feedback-comment-${turnId}`}
            maxLength={CLEO_FEEDBACK_COMMENT_MAX}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Optional note (what should change?)"
            type="text"
            value={comment}
          />
          <button
            className="cleo-answer-action"
            disabled={!rating || status === 'saving'}
            type="submit"
          >
            Save note
          </button>
        </form>
      ) : null}
    </div>
  )
}
