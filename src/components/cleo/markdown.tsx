"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import { code } from "@streamdown/code"
import { Streamdown } from "streamdown"

import {
  isCuratedTopicImageSrc,
  presentPortalGuideMarkdown,
} from "~/lib/cleo/portal-links"
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
  ...props
}: MarkdownImageProps) {
  if (typeof src !== "string" || !isCuratedTopicImageSrc(src)) {
    return null
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- curated static atlas/space JPEGs
    <img
      {...props}
      alt={alt ?? ""}
      className={cn("cleo-topic-photo", className)}
      data-streamdown="image"
      loading="lazy"
      src={src}
    />
  )
}

export function Markdown({
  children,
  className,
  isAnimating = false,
}: MarkdownProps) {
  const content = presentPortalGuideMarkdown(children)

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
