"use client"

import { code } from "@streamdown/code"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"

type MarkdownProps = {
  children: string
  className?: string
  isAnimating?: boolean
}

export function Markdown({
  children,
  className,
  isAnimating = false,
}: MarkdownProps) {
  return (
    <Streamdown
      caret={isAnimating ? "block" : undefined}
      className={cn("ai-response", className)}
      isAnimating={isAnimating}
      lineNumbers={false}
      plugins={{ code }}
      shikiTheme={["github-light", "github-dark"]}
    >
      {children}
    </Streamdown>
  )
}
