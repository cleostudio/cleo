import Link from 'next/link'

import {
  type CleoAskCollection,
  essayAskHref,
  guideAskHref,
  placeAskHref,
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

type AskCleoPlaceLinkProps = {
  placeName: string
  countryName: string
  className?: string
  autoSubmit?: boolean
}

type AskCleoEssayLinkProps = {
  title: string
  slug: string
  className?: string
  autoSubmit?: boolean
}

type AskCleoSurfaceLinkProps = {
  surface: CleoAskCollection
  label?: string
  className?: string
  autoSubmit?: boolean
}

const linkClass = 'text-sm text-muted-foreground hover:text-foreground'

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
  const subject =
    name.trim() || (collection === 'explore' ? 'this country' : 'this subject')

  return (
    <Link
      href={guideAskHref(collection, name, { autoSubmit })}
      className={cn(linkClass, className)}
    >
      Ask Cleo about {subject} →
    </Link>
  )
}

/** Quiet link for one notable place inside an Explore country guide. */
export function AskCleoPlaceLink({
  placeName,
  countryName,
  className,
  autoSubmit = true,
}: AskCleoPlaceLinkProps) {
  const place = placeName.trim() || 'this place'

  return (
    <Link
      href={placeAskHref(placeName, countryName, { autoSubmit })}
      className={cn(linkClass, className)}
    >
      Ask Cleo about {place} →
    </Link>
  )
}

/** Quiet Writing essay → Cleo deep link. */
export function AskCleoEssayLink({
  title,
  slug,
  className,
  autoSubmit = true,
}: AskCleoEssayLinkProps) {
  return (
    <Link
      href={essayAskHref(title, slug, { autoSubmit })}
      className={cn(linkClass, className)}
    >
      Ask Cleo about this essay →
    </Link>
  )
}

/** Index / Topics / Gallery / Writing entry into Cleo without a specific subject. */
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
        : surface === 'writing'
          ? 'Ask Cleo to pick an essay →'
          : surface === 'explore'
            ? 'Ask Cleo to pick a country →'
            : 'Ask Cleo to pick a Space guide →'

  return (
    <Link
      href={surfaceAskHref(surface, { autoSubmit })}
      className={cn(linkClass, className)}
    >
      {label ?? defaultLabel}
    </Link>
  )
}
