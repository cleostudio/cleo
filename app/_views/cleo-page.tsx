'use client'

import type { CSSProperties } from 'react'

import { AskForm } from '~/components/cleo/ask-form'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function CleoPageView() {
  return (
    <div className="w-full">
      <div className="app-column">
        <div className="flex items-start justify-between gap-4">
          <header className="max-w-[34rem]">
            <h1 className="page-eyebrow enter">
              <T zh="Cleo" en="Cleo" />
            </h1>
            <p
              className="page-introduction enter mt-4 text-balance"
              style={{ '--enter-delay': '70ms' } as CSSProperties}
            >
              <T
                zh={publicPageMetadata.cleo.zh.description}
                en={publicPageMetadata.cleo.en.description}
              />
            </p>
          </header>
          <PixelCluster variant={4} className="enter shrink-0" />
        </div>
      </div>

      <div
        className="enter mt-8"
        style={{ '--enter-delay': '120ms' } as CSSProperties}
      >
        <AskForm />
      </div>
    </div>
  )
}
