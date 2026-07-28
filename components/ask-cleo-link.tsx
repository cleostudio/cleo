import Link from 'next/link'

import {
  type CleoAskCollection,
  compareAskHref,
  essayAskHref,
  factsAskHref,
  featureAskHref,
  galleryItemAskHref,
  guideAskHref,
  placeAskHref,
  surfaceAskHref,
  topicAskHref,
} from '~/lib/cleo/ask-links'
import { cn } from '~/lib/utils'

type AskCleoGuideLinkProps = {
  collection: 'explore' | 'space'
  name: string
  /** When set, uses the compact `/cleo?topic=explore|space/{slug}` form. */
  slug?: string
  className?: string
  /** Defaults to auto-submit so the guide context starts the turn. */
  autoSubmit?: boolean
  /** Visible label; defaults to “Ask Cleo about {name} →”. */
  label?: string
}

type AskCleoPlaceLinkProps = {
  placeName: string
  countryName: string
  className?: string
  autoSubmit?: boolean
  /** Visible label; defaults to “Ask Cleo about {place} →”. */
  label?: string
}

type AskCleoFeatureLinkProps = {
  featureName: string
  subjectName: string
  className?: string
  autoSubmit?: boolean
  /** Visible label; defaults to “Ask Cleo about {feature} →”. */
  label?: string
}

type AskCleoCompareLinkProps = {
  collection: 'explore' | 'space'
  leftName: string
  rightName: string
  className?: string
  autoSubmit?: boolean
  /** Visible label; defaults to the full compare phrase. */
  label?: string
}

type AskCleoFactsLinkProps = {
  collection: 'explore' | 'space'
  name: string
  className?: string
  autoSubmit?: boolean
  /** Visible label; defaults to “Ask Cleo about the fact plate →”. */
  label?: string
}

type AskCleoEssayLinkProps = {
  title: string
  slug: string
  className?: string
  autoSubmit?: boolean
  /** Visible label; defaults to “Ask Cleo about this essay →”. */
  label?: string
}

type AskCleoGalleryItemLinkProps = {
  title: string
  subjectName: string
  collection: 'places' | 'space'
  className?: string
  autoSubmit?: boolean
  /** Visible label; defaults to “Ask Cleo →”. */
  label?: string
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
  slug,
  className,
  autoSubmit = true,
  label,
}: AskCleoGuideLinkProps) {
  const subject =
    name.trim() || (collection === 'explore' ? 'this country' : 'this subject')
  const href = slug?.trim()
    ? topicAskHref(collection, slug, { autoSubmit })
    : guideAskHref(collection, name, { autoSubmit })

  return (
    <Link
      href={href}
      className={cn(linkClass, className)}
      aria-label={`Ask Cleo about ${subject}`}
    >
      {label ?? `Ask Cleo about ${subject} →`}
    </Link>
  )
}

/** Quiet link for one notable place inside an Explore country guide. */
export function AskCleoPlaceLink({
  placeName,
  countryName,
  className,
  autoSubmit = true,
  label,
}: AskCleoPlaceLinkProps) {
  const place = placeName.trim() || 'this place'
  const country = countryName.trim() || 'this country'

  return (
    <Link
      href={placeAskHref(placeName, countryName, { autoSubmit })}
      className={cn(linkClass, className)}
      aria-label={`Ask Cleo about ${place} in ${country}`}
    >
      {label ?? `Ask Cleo about ${place} →`}
    </Link>
  )
}

/** Quiet link for one notable feature inside a Space field guide. */
export function AskCleoFeatureLink({
  featureName,
  subjectName,
  className,
  autoSubmit = true,
  label,
}: AskCleoFeatureLinkProps) {
  const feature = featureName.trim() || 'this feature'
  const subject = subjectName.trim() || 'this subject'

  return (
    <Link
      href={featureAskHref(featureName, subjectName, { autoSubmit })}
      className={cn(linkClass, className)}
      aria-label={`Ask Cleo about ${feature} on ${subject}`}
    >
      {label ?? `Ask Cleo about ${feature} →`}
    </Link>
  )
}

/** Quiet compare link for two catalog subjects. */
export function AskCleoCompareLink({
  collection,
  leftName,
  rightName,
  className,
  autoSubmit = true,
  label,
}: AskCleoCompareLinkProps) {
  const left = leftName.trim()
  const right = rightName.trim()

  return (
    <Link
      href={compareAskHref(collection, leftName, rightName, { autoSubmit })}
      className={cn(linkClass, className)}
      aria-label={`Ask Cleo to compare ${left} and ${right}`}
    >
      {label ?? `Ask Cleo to compare ${left} and ${right} →`}
    </Link>
  )
}

/** Quiet fact-plate link under an Explore/Space guide’s specs. */
export function AskCleoFactsLink({
  collection,
  name,
  className,
  autoSubmit = true,
  label = 'Ask Cleo about the fact plate →',
}: AskCleoFactsLinkProps) {
  const subject =
    name.trim() || (collection === 'explore' ? 'this country' : 'this subject')

  return (
    <Link
      href={factsAskHref(collection, name, { autoSubmit })}
      className={cn(linkClass, className)}
      aria-label={`Ask Cleo about the fact plate for ${subject}`}
    >
      {label}
    </Link>
  )
}

/** Quiet Writing essay → Cleo deep link. */
export function AskCleoEssayLink({
  title,
  slug,
  className,
  autoSubmit = true,
  label = 'Ask Cleo about this essay →',
}: AskCleoEssayLinkProps) {
  const essay = title.trim() || 'this essay'

  return (
    <Link
      href={essayAskHref(title, slug, { autoSubmit })}
      className={cn(linkClass, className)}
      aria-label={`Ask Cleo about “${essay}”`}
    >
      {label}
    </Link>
  )
}

/** Quiet Gallery tile → Cleo deep link. */
export function AskCleoGalleryItemLink({
  title,
  subjectName,
  collection,
  className,
  autoSubmit = true,
  label = 'Ask Cleo →',
}: AskCleoGalleryItemLinkProps) {
  const item = title.trim() || 'this photograph'
  const subject = subjectName.trim() || 'this subject'

  return (
    <Link
      href={galleryItemAskHref(title, subjectName, collection, { autoSubmit })}
      className={cn('text-xs text-muted-foreground hover:text-foreground', className)}
      aria-label={`Ask Cleo about ${item} (${subject})`}
    >
      {label}
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
  const text = label ?? defaultLabel

  return (
    <Link
      href={surfaceAskHref(surface, { autoSubmit })}
      className={cn(linkClass, className)}
      aria-label={text.replace(/\s*→\s*$/, '')}
    >
      {text}
    </Link>
  )
}
