/** Local equirectangular Earth maps served from `/images/world/`. */

export const WORLD_TEXTURES = {
  day: '/images/world/day.jpg',
  night: '/images/world/night.png',
  clouds: '/images/world/clouds.png',
  normal: '/images/world/normal.jpg',
  specular: '/images/world/specular.jpg',
} as const

/**
 * Texture provenance for the World globe. NASA / NOAA imagery is public-domain
 * U.S. government work; three.js redistributes the equirectangular plates used
 * in its planet examples. Keep the on-page credit short.
 */
export const WORLD_TEXTURE_CREDIT =
  'Earth maps · NASA Blue Marble / city lights · three.js planet plates'
