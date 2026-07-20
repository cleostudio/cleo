import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added button and input components for you.</p>
          <form className="mt-2 flex items-center gap-2">
            <Input
              aria-label="Message"
              name="message"
              placeholder="Type a message..."
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
