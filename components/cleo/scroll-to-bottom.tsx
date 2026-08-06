"use client"

import { ArrowDown } from "lucide-react"
import { useCallback, useRef } from "react"
import { useStickToBottomContext } from "use-stick-to-bottom"

import { Button } from "~/components/cleo/ui/button"
import { cn } from "~/lib/utils"

export function ScrollToBottom() {
  const stickToBottom = useStickToBottomContext()
  const manualScrollInFlightRef = useRef(false)
  const { isAtBottom } = stickToBottom

  // use-stick-to-bottom exposes targetScrollTop as a mutable override point.
  // eslint-disable-next-line react-hooks/immutability
  const handleScrollToBottom = useCallback(async () => {
    if (manualScrollInFlightRef.current) {
      return
    }

    manualScrollInFlightRef.current = true
    const previousTargetScrollTop = stickToBottom.targetScrollTop
    // eslint-disable-next-line react-hooks/immutability
    stickToBottom.targetScrollTop = (targetScrollTop) => targetScrollTop

    try {
      await stickToBottom.scrollToBottom()
    } finally {
      stickToBottom.targetScrollTop = previousTargetScrollTop
      manualScrollInFlightRef.current = false
    }
  }, [stickToBottom])

  return (
    <Button
      aria-label="Scroll to bottom"
      className={cn(
        "cleo-scroll-to-bottom",
        isAtBottom
          ? "pointer-events-none translate-y-2 opacity-0"
          : "translate-y-0 opacity-100",
      )}
      disabled={isAtBottom}
      onClick={() => {
        void handleScrollToBottom()
      }}
      size="icon-sm"
      type="button"
      variant="secondary"
    >
      <ArrowDown aria-hidden="true" />
    </Button>
  )
}
