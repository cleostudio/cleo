/** @vitest-environment jsdom */

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { CatalogSearchShortcut } from './catalog-search-shortcut'

afterEach(() => {
  cleanup()
})

describe('CatalogSearchShortcut', () => {
  it('focuses the catalog search when / is pressed outside typing contexts', () => {
    render(
      <>
        <CatalogSearchShortcut />
        <input data-catalog-search aria-label="Search" />
      </>,
    )

    const input = document.querySelector<HTMLInputElement>('[data-catalog-search]')
    expect(input).toBeTruthy()

    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }),
    )

    expect(document.activeElement).toBe(input)
  })

  it('ignores / while typing in another field', () => {
    render(
      <>
        <CatalogSearchShortcut />
        <input data-catalog-search aria-label="Search" />
        <input aria-label="Other" />
      </>,
    )

    const other = document.querySelector<HTMLInputElement>('[aria-label="Other"]')!
    other.focus()
    other.dispatchEvent(
      new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }),
    )

    expect(document.activeElement).toBe(other)
  })
})
