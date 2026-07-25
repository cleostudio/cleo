import { cacheLife } from 'next/cache'
import { ImageResponse } from 'next/og'

import type { Post } from './content'
import { formatDateEn } from './date'
import type { Locale } from './locale-route'
import type { ArchivedNewsletter } from './newsletters'
import {
  coverDataUri,
  ogColors,
  ogRuntimeFonts,
  OgPolaroid,
  OgSheet,
} from './og'
import { tiltFromSlug } from './polaroid'
import {
  publicPageMetadata,
  type PublicSection,
} from './public-page-metadata'

const NAME = 'Cleo'
const HOME_INTRODUCTION = publicPageMetadata.home.ogDescription

const IMAGE_SIZE = { width: 1200, height: 630 } as const

function OgHomeMark() {
  const stroke = ogColors.paperInk
  const faint = ogColors.border

  return (
    <svg
      width="232"
      height="232"
      viewBox="0 0 232 232"
      fill="none"
      aria-hidden="true"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="116" cy="116" r="72" stroke={faint} strokeWidth="1.4" />
        <circle cx="116" cy="116" r="72" stroke={stroke} strokeWidth="1.7" />
        <path
          d="M142 86c-10-12-26-18-42-14-22 5-36 26-34 48 2 24 22 42 46 40 16-1 30-10 38-22"
          stroke={stroke}
          strokeWidth="1.75"
        />
      </g>
    </svg>
  )
}

async function renderHomeOgImage(_locale: Locale = 'en') {
  'use cache'
  cacheLife('max')

  return new ImageResponse(
    (
      <OgSheet>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 64,
            padding: '0 104px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              width: 720,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 70,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: ogColors.foreground,
              }}
            >
              {NAME}
            </div>
            {HOME_INTRODUCTION ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: 29,
                  lineHeight: 1.48,
                  color: ogColors.mutedForeground,
                }}
              >
                {HOME_INTRODUCTION}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexShrink: 0 }}>
            <OgHomeMark />
          </div>
        </div>
      </OgSheet>
    ),
    { ...IMAGE_SIZE, fonts: await ogRuntimeFonts() },
  ).arrayBuffer()
}

export async function createHomeOgImage(locale: Locale = 'en') {
  return new Response(await renderHomeOgImage(locale), {
    headers: { 'content-type': 'image/png' },
  })
}

function OgSectionMark({ section }: { section: PublicSection }) {
  const stroke = ogColors.paperInk
  const faint = ogColors.border

  if (section === 'blog') {
    return (
      <svg
        width="232"
        height="232"
        viewBox="0 0 232 232"
        fill="none"
        aria-hidden="true"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M61 36C91 31 137 30 177 33C179 78 181 146 177 194C140 198 92 199 53 196C55 148 53 80 61 36Z"
            stroke={faint}
            strokeWidth="1.4"
          />
          <path
            d="M48 44C84 38 132 38 166 42C169 91 169 151 164 202C126 203 82 205 43 199C47 149 43 92 48 44Z"
            stroke={faint}
            strokeWidth="1.4"
          />
          <path
            d="M55 33C89 29 136 30 178 35C181 82 180 148 176 197C137 201 93 200 51 196C54 147 50 82 55 33Z"
            stroke={stroke}
            strokeWidth="1.7"
          />
          <path
            d="M77 71C100 69 128 70 152 71M76 93C101 91 128 93 151 92M77 115C97 113 119 115 138 114M77 157C91 155 106 157 119 156"
            stroke={stroke}
            strokeWidth="1.7"
          />
        </g>
      </svg>
    )
  }

  if (section === 'explore') {
    // A sketched globe with a meridian and equator.
    return (
      <svg
        width="232"
        height="232"
        viewBox="0 0 232 232"
        fill="none"
        aria-hidden="true"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="116" cy="116" r="72" stroke={faint} strokeWidth="1.4" />
          <circle cx="116" cy="116" r="72" stroke={stroke} strokeWidth="1.7" />
          <ellipse
            cx="116"
            cy="116"
            rx="32"
            ry="72"
            stroke={stroke}
            strokeWidth="1.55"
          />
          <path
            d="M44 116h144M60 78c18 8 54 12 112 0M60 154c18-8 54-12 112 0"
            stroke={stroke}
            strokeWidth="1.55"
          />
        </g>
      </svg>
    )
  }

  if (section === 'space') {
    // A ringed planet with a few field-guide stars.
    return (
      <svg
        width="232"
        height="232"
        viewBox="0 0 232 232"
        fill="none"
        aria-hidden="true"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="116" cy="118" r="48" stroke={faint} strokeWidth="1.4" />
          <circle cx="116" cy="118" r="48" stroke={stroke} strokeWidth="1.7" />
          <ellipse
            cx="116"
            cy="118"
            rx="86"
            ry="22"
            stroke={stroke}
            strokeWidth="1.55"
            transform="rotate(-18 116 118)"
          />
          <path
            d="M52 58l3.2 8.4 8.8 1.2-6.8 5.8 2.2 8.6L52 77.2 44.6 82l2.2-8.6-6.8-5.8 8.8-1.2zM178 46l2.4 6.2 6.6.9-5.1 4.4 1.6 6.4L178 60.2l-5.5 3.7 1.6-6.4-5.1-4.4 6.6-.9zM186 168l2 5.2 5.4.8-4.2 3.6 1.4 5.2L186 180l-4.6 3.1 1.4-5.2-4.2-3.6 5.4-.8z"
            stroke={stroke}
            strokeWidth="1.45"
          />
        </g>
      </svg>
    )
  }

  if (section === 'gallery') {
    return (
      <svg
        width="232"
        height="232"
        viewBox="0 0 232 232"
        fill="none"
        aria-hidden="true"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M47 42C88 35 139 38 187 47C181 98 177 152 168 198C125 196 83 188 38 178C42 131 45 86 47 42Z"
            stroke={faint}
            strokeWidth="1.4"
          />
          <path
            d="M58 31C101 34 145 39 187 47C183 96 177 149 171 197C128 196 81 189 39 181C44 131 51 78 58 31Z"
            stroke={stroke}
            strokeWidth="1.7"
          />
          <path
            d="M67 43C101 44 143 49 175 55C172 84 168 116 164 147C129 144 94 139 55 132C59 101 63 71 67 43Z"
            stroke={stroke}
            strokeWidth="1.55"
          />
          <path
            d="M59 132C78 115 87 106 102 96C114 112 124 123 135 134C144 124 151 116 160 108C165 120 168 133 171 147"
            stroke={stroke}
            strokeWidth="1.65"
          />
          <path
            d="M145 69C150 66 157 67 160 72C163 78 160 84 154 86C148 87 142 83 142 77C142 74 143 71 145 69Z"
            stroke={faint}
            strokeWidth="1.55"
          />
        </g>
      </svg>
    )
  }

  return (
    <svg
      width="232"
      height="232"
      viewBox="0 0 232 232"
      fill="none"
      aria-hidden="true"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M116 38C159 37 194 72 193 116C192 160 159 193 115 194C72 193 38 158 39 115C40 72 73 39 116 38Z"
          stroke={faint}
          strokeWidth="1.4"
          strokeDasharray="5 7"
        />
        <path
          d="M116 20C115 69 117 162 116 212M20 116C70 115 164 117 212 116M49 48C82 83 151 151 184 184M184 48C151 80 82 151 48 184"
          stroke={faint}
          strokeWidth="1.35"
        />
        <path
          d="M116 66C145 65 167 88 167 116C166 145 145 167 116 167C88 166 65 144 66 116C66 88 88 67 116 66Z"
          stroke={stroke}
          strokeWidth="1.7"
        />
        <path
          d="M89 140C94 126 98 112 103 99C115 95 128 91 141 87C136 101 132 114 127 127C114 131 102 136 89 140Z"
          stroke={stroke}
          strokeWidth="1.75"
        />
        <path
          d="M111 113C112 109 118 107 121 110C124 114 122 119 118 121C113 122 109 118 111 113Z"
          stroke={stroke}
          strokeWidth="1.55"
        />
      </g>
    </svg>
  )
}

async function renderSectionOgImage(section: PublicSection, _locale: Locale = 'en') {
  'use cache'
  cacheLife('max')

  const copy = publicPageMetadata[section]
  const signature = 'Cleo'

  return new ImageResponse(
    (
      <OgSheet>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 64,
            padding: '0 104px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 720,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                color: ogColors.paperInk,
              }}
            >
              {signature}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 28,
                fontSize: 70,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: ogColors.foreground,
              }}
            >
              {copy.title}
            </div>
            {copy.description ? (
              <div
                style={{
                  display: 'flex',
                  marginTop: 24,
                  fontSize: 29,
                  lineHeight: 1.48,
                  color: ogColors.mutedForeground,
                }}
              >
                {copy.description}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexShrink: 0 }}>
            <OgSectionMark section={section} />
          </div>
        </div>
      </OgSheet>
    ),
    {
      ...IMAGE_SIZE,
      fonts: await ogRuntimeFonts(),
    },
  ).arrayBuffer()
}

export async function createSectionOgImage(section: PublicSection, locale: Locale = 'en') {
  return new Response(await renderSectionOgImage(section, locale), {
    headers: { 'content-type': 'image/png' },
  })
}

type NewsletterOgInput = Pick<
  ArchivedNewsletter,
  'id' | 'title' | 'titleEn' | 'description' | 'descriptionEn'
>

async function renderNewsletterOgImage(newsletter: NewsletterOgInput, _locale: Locale = 'en') {
  'use cache'
  cacheLife('max')

  const title = newsletter.titleEn
  const description = newsletter.descriptionEn
  const archiveLabel = `Cleo · Archive ${newsletter.id.padStart(3, '0')}`
  const cover = await coverDataUri(
    `/content/newsletters/${newsletter.id}/cover.png`,
  )

  return new ImageResponse(
    (
      <OgSheet>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 64,
            padding: '0 96px',
            width: '100%',
          }}
        >
          <OgPolaroid src={cover} tilt={-2} width={432} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              width: 512,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 21,
                color: ogColors.paperInk,
              }}
            >
              {archiveLabel}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 48,
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                color: ogColors.foreground,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 24,
                lineHeight: 1.5,
                color: ogColors.mutedForeground,
              }}
            >
              {description}
            </div>
          </div>
        </div>
      </OgSheet>
    ),
    {
      ...IMAGE_SIZE,
      fonts: await ogRuntimeFonts(),
    },
  ).arrayBuffer()
}

export async function createNewsletterOgImage(
  newsletter: ArchivedNewsletter,
  locale: Locale = 'en',
) {
  const input: NewsletterOgInput = {
    id: newsletter.id,
    title: newsletter.title,
    titleEn: newsletter.titleEn,
    description: newsletter.description,
    descriptionEn: newsletter.descriptionEn,
  }

  return new Response(await renderNewsletterOgImage(input, locale), {
    headers: { 'content-type': 'image/png' },
  })
}

type PostOgInput = Pick<Post, 'slug' | 'title' | 'titleEn' | 'publishedAt' | 'cover'>

async function renderPostOgImage(post: PostOgInput, _locale: Locale = 'en') {
  'use cache'
  cacheLife('max')

  const title = post.titleEn
  const date = formatDateEn(post.publishedAt)

  return new ImageResponse(
    (
      <OgSheet>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 64,
            padding: '0 96px',
            width: '100%',
          }}
        >
          {post.cover && (
            <OgPolaroid
              src={await coverDataUri(post.cover.src)}
              tilt={tiltFromSlug(post.slug)}
              width={432}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 0,
              flexShrink: 0,
              gap: 28,
              width: 512,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 54,
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                color: ogColors.foreground,
                textWrap: 'balance',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                fontSize: 24,
                gap: 8,
                color: ogColors.mutedForeground,
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', flexShrink: 0 }}>{NAME}</div>
              <div style={{ display: 'flex', flexShrink: 0 }}>·</div>
              <div style={{ display: 'flex', flexShrink: 0 }}>{date}</div>
            </div>
          </div>
        </div>
      </OgSheet>
    ),
    {
      ...IMAGE_SIZE,
      fonts: await ogRuntimeFonts(),
    },
  ).arrayBuffer()
}

export async function createPostOgImage(post: Post, locale: Locale = 'en') {
  const input: PostOgInput = {
    slug: post.slug,
    title: post.title,
    titleEn: post.titleEn,
    publishedAt: post.publishedAt,
    cover: post.cover,
  }

  return new Response(await renderPostOgImage(input, locale), {
    headers: { 'content-type': 'image/png' },
  })
}
