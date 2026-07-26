'use client'

import { useState } from 'react'

export function CompareCopyLink({ href }: { href: string }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    const url = new URL(href, window.location.origin).href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="text-sm text-muted-foreground transition-colors duration-150 ease-[ease] hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
    >
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
