"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { CornerRightUp, Square } from "lucide-react"
import { ThinkingOrb } from "thinking-orbs"

import { ActivityPanel } from "@/components/activity-panel"
import { LiquidGlass } from "@/components/liquid-glass"
import { Markdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ActivityItem, parseStreamLine } from "@/lib/stream"
import { cn } from "@/lib/utils"

const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
}

type Message = {
  activities?: ActivityItem[]
  content: string
  id: number
  role: "assistant" | "user"
}

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  )
}

function upsertActivity(
  activities: ActivityItem[] | undefined,
  activity: ActivityItem
) {
  const current = activities ?? []
  const index = current.findIndex((item) => item.id === activity.id)

  if (index === -1) {
    return [...current, activity]
  }

  const previous = current[index]
  const next = [...current]
  next[index] = {
    ...previous,
    ...activity,
    action: activity.action ?? previous.action,
  }
  return next
}

export function AskForm() {
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  useEffect(() => {
    if (!isSubmitting && hasMessages) {
      inputRef.current?.focus()
    }
  }, [hasMessages, isSubmitting])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  function handleStop() {
    abortControllerRef.current?.abort()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const question = input.trim()

    if (!question || isSubmitting) {
      return
    }

    const userMessage: Message = {
      content: question,
      id: messageIdRef.current++,
      role: "user",
    }
    const assistantMessage: Message = {
      activities: [],
      content: "",
      id: messageIdRef.current++,
      role: "assistant",
    }

    const conversation = [
      ...messages
        .filter((message) => message.content.trim())
        .map(({ role, content }) => ({ role, content })),
      { role: "user" as const, content: question },
    ]

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ])
    setInput("")
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const payload = (await response
          .json()
          .catch(() => ({}))) as ResponsePayload

        throw new Error(payload.error ?? "The request could not be completed.")
      }

      if (!response.body) {
        throw new Error("The AI service returned an unreadable response.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let output = ""
      let streamError: string | null = null

      const applyTextDelta = (delta: string) => {
        output += delta
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + delta }
              : message
          )
        )
      }

      const applyActivity = (activity: ActivityItem) => {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  activities: upsertActivity(message.activities, activity),
                }
              : message
          )
        )
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          const event = parseStreamLine(line)

          if (!event) {
            continue
          }

          if (event.type === "text") {
            applyTextDelta(event.delta)
            continue
          }

          if (event.type === "activity") {
            applyActivity(event.activity)
            continue
          }

          if (event.type === "error") {
            streamError = event.error
          }
        }
      }

      const finalChunk = decoder.decode()

      if (finalChunk) {
        buffer += finalChunk
      }

      if (buffer.trim()) {
        const event = parseStreamLine(buffer)

        if (event?.type === "text") {
          applyTextDelta(event.delta)
        } else if (event?.type === "activity") {
          applyActivity(event.activity)
        } else if (event?.type === "error") {
          streamError = event.error
        }
      }

      if (streamError && !abortController.signal.aborted) {
        throw new Error(streamError)
      }

      if (!output.trim() && !abortController.signal.aborted) {
        throw new Error("The AI service returned an empty response.")
      }
    } catch (requestError) {
      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== assistantMessage.id ||
            Boolean(message.content) ||
            Boolean(message.activities?.length)
        )
      )

      if (!isAbortError(requestError) && !abortController.signal.aborted) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The request could not be completed."
        )
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-3xl min-w-0 flex-col sm:min-h-[calc(100svh-3rem)]">
      {hasMessages ? (
        <div className="flex-1 px-1 pt-6 pb-28 sm:px-3 sm:pb-32">
          <div className="flex flex-col gap-7">
            {messages.map((message) =>
              message.role === "user" ? (
                <div
                  className="glass-surface user-message"
                  key={message.id}
                >
                  <LiquidGlass />
                  <span className="user-message-text">{message.content}</span>
                </div>
              ) : (
                <section
                  aria-label="AI response"
                  aria-live="polite"
                  className="min-w-0 px-1"
                  key={message.id}
                >
                  {message.activities && message.activities.length > 0 ? (
                    <ActivityPanel
                      activities={message.activities}
                      isLive={
                        isSubmitting && message.id === messages.at(-1)?.id
                      }
                    />
                  ) : null}

                  {message.content ? (
                    <Markdown
                      isAnimating={
                        isSubmitting && message.id === messages.at(-1)?.id
                      }
                    >
                      {message.content}
                    </Markdown>
                  ) : isSubmitting &&
                    message.id === messages.at(-1)?.id &&
                    !(message.activities && message.activities.length > 0) ? (
                    <ThinkingOrb
                      aria-label="Listening"
                      className="block"
                      size={20}
                      state="listening"
                    />
                  ) : null}
                </section>
              )
            )}
          </div>
          <div
            aria-hidden="true"
            className="scroll-mb-28"
            ref={messagesEndRef}
          />
        </div>
      ) : null}

      <div
        className={cn(
          hasMessages ? null : "flex flex-1 items-center justify-center"
        )}
      >
        <div
          className="prompt-dock-shell"
          data-docked={hasMessages || undefined}
        >
          {error ? (
            <p
              className="mb-3 px-4 text-center text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <form
            aria-busy={isSubmitting}
            className="glass-surface prompt-dock"
            onSubmit={handleSubmit}
          >
            <LiquidGlass />
            <Input
              aria-label="Message"
              autoComplete="off"
              className="prompt-dock-input md:text-base"
              disabled={isSubmitting}
              maxLength={MAX_INPUT_LENGTH}
              name="message"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything"
              ref={inputRef}
              required={!isSubmitting}
              value={input}
            />
            <Button
              aria-label={isSubmitting ? "Stop generating" : "Send message"}
              className="prompt-dock-send size-11 shrink-0 rounded-full active:!translate-y-0"
              disabled={!isSubmitting && !input.trim()}
              onClick={isSubmitting ? handleStop : undefined}
              size="icon"
              type={isSubmitting ? "button" : "submit"}
            >
              {isSubmitting ? (
                <Square
                  aria-hidden="true"
                  className="size-3.5 fill-current"
                />
              ) : (
                <CornerRightUp aria-hidden="true" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
