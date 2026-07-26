import { describe, expect, it } from 'vitest'

import {
  HOME_MASTHEAD_VARIANT,
  pixelClusterCells,
} from '~/components/pixel-cluster'

describe('pixelClusterCells', () => {
  it('keeps exactly one lit signal cell in every variant', () => {
    for (let variant = 0; variant < 11; variant += 1) {
      const cells = pixelClusterCells(variant)
      expect(cells.filter((cell) => cell === 's')).toHaveLength(1)
      expect(cells).toHaveLength(4)
    }
  })

  it('exposes the homepage masthead arrangement as the brand stamp', () => {
    expect(pixelClusterCells(HOME_MASTHEAD_VARIANT)).toEqual(['s', 'a', 'b', ''])
  })
})
