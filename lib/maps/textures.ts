/** Local equirectangular Earth maps served from `/images/maps/`. */

export const MAPS_TEXTURES = {
  day: '/images/maps/day.jpg',
  night: '/images/maps/night.jpg',
  clouds: '/images/maps/clouds.png',
  normal: '/images/maps/normal.jpg',
  specular: '/images/maps/specular.jpg',
} as const

/**
 * Texture provenance for the Maps globe. Day map is NASA Blue Marble: Next
 * Generation (Dec 2004, topo + bathymetry). Night lights / clouds / normal /
 * specular plates follow the three.js planet examples (NASA/NOAA public-domain
 * U.S. government work). Keep the on-page credit short.
 */
export const MAPS_TEXTURE_CREDIT =
  'Earth maps · NASA Blue Marble Next Generation · city lights'
