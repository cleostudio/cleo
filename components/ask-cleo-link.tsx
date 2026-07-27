import Link from 'next/link'

import {
  type CleoAskCollection,
  guideAskHref,
  surfaceAskHref,
} from '~/lib/cleo/ask-links'
import { cn } from '~/lib/utils'

type AskCleoGuideLinkProps = {
  collection: 'explore' | 'space'
  name: string
  className?: string
  /** Defaults to auto-submit so the guide context starts the turn. */
  autoSubmit?: boolean
}

type AskCleoSurfaceLinkProps = {
  surface: CleoAskCollection
  label?: string
  className?: string
  autoSubmit?: boolean
}

/**
 * Quiet field-guide footer link into Cleo with a subject-aware prompt.
 * Not a card — plain text, matching Explore/Space footer chrome.
 */
export function AskCleoGuideLink({
  collection,
  name,
  className,
  autoSubmit = true,
}: AskCleoGuideLinkProps) {
  const subject = name.trim() || (collection === 'explore' ? 'this country' : 'this subject')

  return (
    <Link
      href={guideAskHref(collection, name, { autoSubmit })}
      className={cn(
        'text-sm text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      Ask Cleo about {subject} →
    </Link>
  )
}

/** Index / Topics / Gallery entry into Cleo without a specific guide subject. */
export function AskCleoSurfaceLink({
  surface,
  label,
  className,
  autoSubmit = true,
}: AskCleoSurfaceLinkProps) {
  const defaultLabel =
    surface === 'topics'
      ? 'Ask Cleo for a Topics tour →'
      : surface === 'gallery'
        ? 'Ask Cleo about the Gallery →'
        : surface === 'explore'
          ? 'Ask Cleo to pick a country →'
          : 'Ask Cleo to pick a Space guide →'

  return (
    <Link
      href={surfaceAskHref(surface, { autoSubmit })}
      className={cn(
        'text-sm text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {label ?? defaultLabel}
    </Link>
  )
}
