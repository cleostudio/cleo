/**
 * Local equirectangular Earth + sky maps.
 * Earth: Solar System Scope (CC BY 4.0). Sky: NASA SVS Deep Star Maps 2020.
 */

export const EARTH_TEXTURES = {
  /** 8K Blue Marble–style day map. */
  day: '/images/maps/day.jpg',
  /** 8K city-lights night map. */
  night: '/images/maps/night.jpg',
  /** 4K cloud cover. */
  clouds: '/images/maps/clouds.jpg',
  /** 4K ocean specular mask. */
  specular: '/images/maps/specular.jpg',
  /** 4K terrain normal map. */
  normal: '/images/maps/normal.png',
  /** 4K NASA Deep Star Maps 2020 sky. */
  sky: '/images/maps/sky.jpg',
} as const

export const EARTH_TEXTURE_CREDIT = {
  label: 'Solar System Scope',
  href: 'https://www.solarsystemscope.com/textures/',
  license: 'CC BY 4.0',
} as const

export const SKY_TEXTURE_CREDIT = {
  label: 'NASA SVS Deep Star Maps 2020',
  href: 'https://svs.gsfc.nasa.gov/4851/',
  license: 'Public domain',
} as const
