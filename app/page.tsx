import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="w-full max-w-md min-w-0">
        <form className="flex items-center gap-2">
          <Input
            aria-label="Message"
            name="message"
            placeholder="Type a message..."
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}
