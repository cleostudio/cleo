"use client"

import { type FormEvent, useState } from "react"
import { CornerRightUp, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
  output?: string
}

export function AskForm() {
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const question = input.trim()

    if (!question || isSubmitting) {
      return
    }

    setAnswer(null)
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: question }),
      })
      const payload = (await response
        .json()
        .catch(() => ({}))) as ResponsePayload

      if (!response.ok) {
        throw new Error(payload.error ?? "The request could not be completed.")
      }

      if (!payload.output) {
        throw new Error("The AI service returned an empty response.")
      }

      setAnswer(payload.output)
      setInput("")
    } catch (requestError) {
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
    <div className="flex w-full max-w-3xl min-w-0 flex-col gap-4">
      {answer ? (
        <section
          aria-label="AI response"
          aria-live="polite"
          className="max-h-[50svh] overflow-y-auto rounded-3xl border bg-card p-5 shadow-sm"
        >
          <p className="text-sm leading-7 whitespace-pre-wrap">{answer}</p>
        </section>
      ) : null}

      {error ? (
        <p className="px-4 text-sm text-destructive" role="alert">
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
          className="h-12 rounded-full pr-12 pl-4 text-base md:text-base"
          disabled={isSubmitting}
          maxLength={MAX_INPUT_LENGTH}
          name="message"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask anything"
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
  )
}
