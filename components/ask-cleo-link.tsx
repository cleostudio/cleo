import Link from 'next/link'

import {
  type CleoAskCollection,
  compareAskHref,
  essayAskHref,
  featureAskHref,
  galleryItemAskHref,
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

type AskCleoFeatureLinkProps = {
  featureName: string
  subjectName: string
  className?: string
  autoSubmit?: boolean
}

type AskCleoCompareLinkProps = {
  collection: 'explore' | 'space'
  leftName: string
  rightName: string
  className?: string
  autoSubmit?: boolean
}

type AskCleoEssayLinkProps = {
  title: string
  slug: string
  className?: string
  autoSubmit?: boolean
}

type AskCleoGalleryItemLinkProps = {
  title: string
  subjectName: string
  collection: 'places' | 'space'
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

/** Quiet link for one notable feature inside a Space field guide. */
export function AskCleoFeatureLink({
  featureName,
  subjectName,
  className,
  autoSubmit = true,
}: AskCleoFeatureLinkProps) {
  const feature = featureName.trim() || 'this feature'

  return (
    <Link
      href={featureAskHref(featureName, subjectName, { autoSubmit })}
      className={cn(linkClass, className)}
    >
      Ask Cleo about {feature} →
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
}: AskCleoCompareLinkProps) {
  return (
    <Link
      href={compareAskHref(collection, leftName, rightName, { autoSubmit })}
      className={cn(linkClass, className)}
    >
      Ask Cleo to compare {leftName.trim()} and {rightName.trim()} →
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

/** Quiet Gallery tile → Cleo deep link. */
export function AskCleoGalleryItemLink({
  title,
  subjectName,
  collection,
  className,
  autoSubmit = true,
}: AskCleoGalleryItemLinkProps) {
  return (
    <Link
      href={galleryItemAskHref(title, subjectName, collection, { autoSubmit })}
      className={cn('text-xs text-muted-foreground hover:text-foreground', className)}
    >
      Ask Cleo →
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
