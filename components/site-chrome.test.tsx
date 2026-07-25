// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SiteChrome } from './site-chrome'

afterEach(cleanup)

describe('SiteChrome', () => {
  it('renders a stable public shell that Cleo can override with CSS', () => {
    const { container } = render(
      <SiteChrome footer={<span data-footer="" />}>
        <p>page</p>
      </SiteChrome>,
    )

    const shell = container.firstElementChild
    expect(shell?.className).toContain('site-chrome')
    expect(shell?.className).toContain('min-h-screen')
    expect(shell?.querySelector('main')?.className).toContain('site-chrome-main')
    expect(shell?.querySelector('main')?.className).toContain('pt-14')
    expect(container.querySelector('[data-footer]')).not.toBeNull()
  })
})
