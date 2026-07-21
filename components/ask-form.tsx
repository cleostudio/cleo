"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { CornerRightUp, LoaderCircle } from "lucide-react"

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

export function AskForm() {
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
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
        body: JSON.stringify({ input: question }),
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

      if (!output.trim()) {
        throw new Error("The AI service returned an empty response.")
      }
    } catch (requestError) {
      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== assistantMessage.id || Boolean(message.content)
        )
      )
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The request could not be completed."
      )
    } finally {
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
                  className="px-1 text-sm leading-7 whitespace-pre-wrap"
                  key={message.id}
                >
                  {message.content ? (
                    <>
                      {message.content}
                      {isSubmitting && message.id === messages.at(-1)?.id ? (
                        <span
                          aria-hidden="true"
                          className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-foreground align-text-bottom"
                        />
                      ) : null}
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                      />
                      Thinking
                    </span>
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
            ? "fixed inset-x-0 bottom-0 z-10 overflow-visible bg-background px-4 pt-3 pb-4 sm:px-6 sm:pb-6"
            : "flex flex-1 items-center"
        }
        style={
          hasMessages
            ? { boxShadow: "0 100dvh 0 100dvh var(--background)" }
            : undefined
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
              required
              value={input}
            />
            <Button
              aria-label={isSubmitting ? "Sending message" : "Send message"}
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
              disabled={isSubmitting || !input.trim()}
              size="icon"
              type="submit"
            >
              {isSubmitting ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
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
