"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { CornerRightUp, Square } from "lucide-react"

import { Markdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
}

type Message = {
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
      let output = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const chunk = decoder.decode(value, { stream: true })

        if (!chunk) {
          continue
        }

        output += chunk
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + chunk }
              : message
          )
        )
      }

      const finalChunk = decoder.decode()

      if (finalChunk) {
        output += finalChunk
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + finalChunk }
              : message
          )
        )
      }

      if (!output.trim() && !abortController.signal.aborted) {
        throw new Error("The AI service returned an empty response.")
      }
    } catch (requestError) {
      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== assistantMessage.id || Boolean(message.content)
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
        <div className="flex-1 px-1 pt-6 pb-24 sm:px-3 sm:pb-28">
          <div className="flex flex-col gap-7">
            {messages.map((message) =>
              message.role === "user" ? (
                <div
                  className="ml-auto max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-2.5 text-sm leading-6 whitespace-pre-wrap text-primary-foreground shadow-sm sm:max-w-[70%]"
                  key={message.id}
                >
                  {message.content}
                </div>
              ) : (
                <section
                  aria-label="AI response"
                  aria-live="polite"
                  className="min-w-0 px-1"
                  key={message.id}
                >
                  {message.content ? (
                    <Markdown
                      isAnimating={
                        isSubmitting && message.id === messages.at(-1)?.id
                      }
                    >
                      {message.content}
                    </Markdown>
                  ) : (
                    <span
                      aria-label="Thinking"
                      className="inline-block size-2 animate-pulse rounded-full bg-foreground/70"
                      role="status"
                    />
                  )}
                </section>
              )
            )}
          </div>
          <div
            aria-hidden="true"
            className="scroll-mb-24"
            ref={messagesEndRef}
          />
        </div>
      ) : null}

      <div
        className={
          hasMessages
            ? "fixed inset-x-0 bottom-0 z-10 bg-background px-4 pt-3 pb-4 sm:px-6 sm:pb-6"
            : "flex flex-1 items-center"
        }
      >
        <div className={hasMessages ? "mx-auto w-full max-w-3xl" : "w-full"}>
          {error ? (
            <p className="mb-3 px-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <form
            aria-busy={isSubmitting}
            className="relative"
            onSubmit={handleSubmit}
          >
            <Input
              aria-label="Message"
              autoComplete="off"
              className="h-12 rounded-full bg-card pr-12 pl-4 text-base shadow-sm md:text-base"
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
              className="absolute top-1.5 right-1.5 active:!translate-y-0"
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
