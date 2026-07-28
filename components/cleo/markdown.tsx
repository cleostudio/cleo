"use client"

import { memo, type ComponentProps } from "react"
import Link from "next/link"
import { code } from "@streamdown/code"
import { Streamdown } from "streamdown"

import { PhotoZoomDetails } from "~/components/photo-zoom-details"
import { ZoomImage } from "~/components/zoom-image"
import {
  isCuratedTopicImageSrc,
  presentPortalGuideMarkdown,
  presentTopicPhotoMarkdown,
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

function MarkdownComponent({
  children,
  className,
  isAnimating = false,
}: MarkdownProps) {
  // While tokens are still arriving, only strip unsafe images. Guide-link
  // dedupe / footer cleanup runs once the turn settles so historical messages
  // are not re-processed on every live chunk.
  const content = isAnimating
    ? presentTopicPhotoMarkdown(children)
    : presentPortalGuideMarkdown(children)

  return (
    <Streamdown
      caret={isAnimating ? "block" : undefined}
      className={cn("ai-response space-y-0", className)}
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

export const Markdown = memo(MarkdownComponent)
