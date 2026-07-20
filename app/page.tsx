import { CornerRightUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-2xl min-w-0">
        <form className="relative">
          <Input
            aria-label="Message"
            className="h-12 rounded-full pr-12 pl-4 text-base md:text-base"
            name="message"
            placeholder="Ask anything"
          />
          <Button
            aria-label="Send message"
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
            size="icon"
            type="submit"
          >
            <CornerRightUp aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  )
}
