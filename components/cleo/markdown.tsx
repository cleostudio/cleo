"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import { code } from "@streamdown/code"
import { Streamdown } from "streamdown"

import {
  InteractiveBlock,
  PendingInteractive,
  UnavailableInteractive,
} from "~/components/cleo/interactive"
import { PhotoZoomDetails } from "~/components/photo-zoom-details"
import { ZoomImage } from "~/components/zoom-image"
import { segmentCleoMarkdown } from "~/lib/cleo/interactive"
import {
  isCuratedTopicImageSrc,
  presentPortalGuideMarkdown,
} from "~/lib/cleo/portal-links"
import { topicPhotoZoomForSrc } from "~/lib/cleo/topic-photo-zoom"
import { cn } from "~/lib/utils"

type MarkdownProps = {
  children: string
  className?: string
  isAnimating?: boolean
}

type MarkdownAnchorProps = ComponentProps<"a"> & {
  node?: unknown
}

type MarkdownImageProps = ComponentProps<"img"> & {
  node?: unknown
}

function isInternalPath(href: string | undefined): href is string {
  return Boolean(href?.startsWith("/") && !href.startsWith("//"))
}

function MarkdownLink({
  href,
  children,
  className,
  node: _node,
  ...props
}: MarkdownAnchorProps) {
  const linkClassName = cn("wrap-anywhere", className)

  if (isInternalPath(href)) {
    return (
      <Link className={linkClassName} data-streamdown="link" href={href}>
        {children}
      </Link>
    )
  }

  return (
    <a
      {...props}
      className={linkClassName}
      data-streamdown="link"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}

function MarkdownImage({
  src,
  alt,
  className,
  node: _node,
}: MarkdownImageProps) {
  if (typeof src !== "string" || !isCuratedTopicImageSrc(src)) {
    return null
  }

  const zoom = topicPhotoZoomForSrc(src)
  if (!zoom) {
    return null
  }

  return (
    <span className="cleo-topic-photo-frame" data-streamdown="image">
      <ZoomImage
        src={src}
        alt={alt?.trim() || zoom.alt}
        width={zoom.width}
        height={zoom.height}
        className={cn("cleo-topic-photo", className)}
        sizes="(max-width: 40rem) 100vw, 36rem"
        renditions={zoom.renditions}
        expandedContent={
          <PhotoZoomDetails
            collection={zoom.collection}
            title={zoom.title}
            subtitle={zoom.subtitle}
            photographer={zoom.photographer}
            license={zoom.license}
          />
        }
      />
    </span>
  )
}

function MarkdownProse({
  children,
  isAnimating = false,
}: {
  children: string
  isAnimating?: boolean
}) {
  const content = presentPortalGuideMarkdown(children)

  return (
    <Streamdown
      caret={isAnimating ? "block" : undefined}
      className="cleo-markdown-prose space-y-0"
      components={{ a: MarkdownLink, img: MarkdownImage }}
      isAnimating={isAnimating}
      // Same-site Explore/Space paths should navigate in-tab; keep external
      // citations as ordinary new-tab anchors instead of Streamdown's modal.
      linkSafety={{ enabled: false }}
      lineNumbers={false}
      plugins={{ code }}
      shikiTheme={["github-light", "github-dark"]}
    >
      {content}
    </Streamdown>
  )
}

export function Markdown({
  children,
  className,
  isAnimating = false,
}: MarkdownProps) {
  const segments = segmentCleoMarkdown(children)

  return (
    <div className={cn("ai-response space-y-0", className)}>
      {segments.map((segment, index) => {
        if (segment.type === "markdown") {
          return (
            <MarkdownProse
              // Index is stable for a given streamed prefix; content identity
              // changes as deltas arrive, so keying by index avoids remount thrash.
              isAnimating={isAnimating && index === segments.length - 1}
              key={`md-${index}`}
            >
              {segment.content}
            </MarkdownProse>
          )
        }

        if (segment.type === "pending") {
          return (
            <PendingInteractive
              key={`pending-${index}`}
              widgetType={segment.widgetType}
            />
          )
        }

        if (segment.type === "unavailable") {
          return (
            <UnavailableInteractive
              key={`unavailable-${index}`}
              widgetType={segment.widgetType}
            />
          )
        }

        return (
          <InteractiveBlock
            block={segment.block}
            key={`ui-${segment.block.type}-${index}`}
          />
        )
      })}
    </div>
  )
}
