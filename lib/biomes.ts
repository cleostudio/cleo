/** Biomes topic — evergreen field-guide records for major Earth biomes. */

import biomePhotos from '~/content/biome-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface BiomeFeature {
  name: string
  description: string
}

export interface BiomeSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface BiomeFacts {
  /** Biome class: Terrestrial, Freshwater, Marine. */
  kind: string
  /** Köppen-family or climate summary (evergreen). */
  climate: string
  /** Canonical geographic range. */
  range: string
  /** Dominant cover / structure. */
  cover: string
  /** Exemplar places or waters (evergreen names). */
  exemplars: string
}

export interface BiomePhoto extends StaticPhoto {
  nasaId: string
}

export interface BiomeSubject {
  slug: string
  code: string
  name: string
  category: string
  subtitle: string
  about: string
  facts: BiomeFacts
  features: [BiomeFeature, BiomeFeature, BiomeFeature]
  sources: BiomeSource[]
  photo: BiomePhoto
}

type BiomeSubjectDraft = Omit<BiomeSubject, 'photo'>

const photoManifest = biomePhotos as Record<string, BiomePhoto>

function withPhoto(draft: BiomeSubjectDraft): BiomeSubject {
  const photo = photoManifest[draft.slug]
  if (!photo) {
    throw new Error(`Missing biome photo for ${draft.slug}`)
  }
  return { ...draft, photo }
}

const biomeSubjectDrafts: BiomeSubjectDraft[] = [
  {
    slug: 'tundra',
    code: 'TUN',
    name: 'Tundra',
    category: 'Polar & montane',
    subtitle: 'Treeless cold plain · Polar / alpine',
    about:
      'Tundra is a treeless cold landscape where a short growing season and frozen ground keep woody canopies from closing. Arctic coastal plains and high alpine benches share low shrubs, sedges, mosses, and lichens over soils that thaw only shallowly in summer. Permafrost, where present, stores ancient carbon and shapes drainage into polygons and thaw lakes. Orientation here stresses structure — frost, thin active layers, and low biomass — rather than a single year’s snow cover map.',
    facts: {
      kind: 'Terrestrial',
      climate: 'ET / cold short summer (Köppen family)',
      range: 'Arctic coasts; alpine zones worldwide',
      cover: 'Low shrubs, sedges, mosses, lichens',
      exemplars: 'Alaska North Slope, Greenland fringe, Alpine meadows',
    },
    features: [
      {
        name: 'Active layer',
        description:
          'Only a shallow summer thaw zone is available to roots; deeper ground may stay frozen for millennia.',
      },
      {
        name: 'Low woody stature',
        description:
          'Wind, frost, and short seasons favor prostrate shrubs over upright forest.',
      },
      {
        name: 'Thaw lakes and polygons',
        description:
          'Ice-rich ground patterns the surface into polygons, ponds, and drained basins.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Tundra',
        url: 'https://earthobservatory.nasa.gov/biome/biotundra.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Tundra',
        url: 'https://www.britannica.com/science/tundra',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'boreal-forest',
    code: 'BOR',
    name: 'Boreal forest',
    category: 'Forests',
    subtitle: 'Needleleaf forest · Cold continental',
    about:
      'Boreal forest — taiga — forms a vast northern belt of spruce, fir, pine, and larch across Canada, Alaska, Scandinavia, and Siberia. Winters are long and cold; summers are brief but enough for closed needleleaf canopies on acidic soils. Fire and insect outbreaks reset stands on multi-decadal cycles. Peatlands and lakes interrupt the timber. This primer keeps to belt geometry, evergreen dominance, and disturbance rhythm rather than a fire-season headline.',
    facts: {
      kind: 'Terrestrial',
      climate: 'Dfc / Dfd cold continental (Köppen family)',
      range: 'Circumboreal belt of the Northern Hemisphere',
      cover: 'Closed needleleaf forest; peatlands and lakes',
      exemplars: 'Canada’s Shield forests, Scandinavian taiga, Siberian larch',
    },
    features: [
      {
        name: 'Needleleaf canopy',
        description:
          'Conifers retain foliage through winter and dominate the closed forest matrix.',
      },
      {
        name: 'Fire and stand reset',
        description:
          'Periodic burns and insect pulses open patches that regenerate over decades.',
      },
      {
        name: 'Peat and lake mosaic',
        description:
          'Waterlogged basins interrupt timber with bogs, fens, and countless lakes.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Boreal Forest',
        url: 'https://earthobservatory.nasa.gov/biome/bioboreal.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Taiga',
        url: 'https://www.britannica.com/science/taiga',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'temperate-forest',
    code: 'TEM',
    name: 'Temperate forest',
    category: 'Forests',
    subtitle: 'Broadleaf & mixed forest · Humid mid-latitudes',
    about:
      'Temperate forests occupy humid mid-latitudes where winters are cool to cold and summers support deciduous or mixed canopies. Eastern North America, western Europe, East Asia, and parts of the Southern Hemisphere host oak, maple, beech, and mixed conifer stands. Seasonal leaf drop is a structural signature in many of these forests; soils are often deeper and richer than boreal podzols. Orientation emphasizes seasonal canopy change and mid-latitude humidity rather than timber markets.',
    facts: {
      kind: 'Terrestrial',
      climate: 'Cfa / Cfb / Dfa humid temperate (Köppen family)',
      range: 'Humid mid-latitudes on several continents',
      cover: 'Deciduous or mixed broadleaf–conifer canopy',
      exemplars: 'Appalachians, central Europe, Japan’s deciduous belts',
    },
    features: [
      {
        name: 'Seasonal canopy',
        description:
          'Many stands drop leaves in winter and rebuild a full green layer each spring.',
      },
      {
        name: 'Layered understory',
        description:
          'Shrubs, herbs, and spring ephemerals exploit light before and after full leaf-out.',
      },
      {
        name: 'Mixed stands',
        description:
          'Conifers and hardwoods often share the canopy along moisture and elevation gradients.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Temperate Deciduous Forest',
        url: 'https://earthobservatory.nasa.gov/biome/biotemperate.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Temperate forest',
        url: 'https://www.britannica.com/science/temperate-forest',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'grassland',
    code: 'GRA',
    name: 'Grassland',
    category: 'Open lands',
    subtitle: 'Herbaceous plains · Semi-arid to subhumid',
    about:
      'Grasslands are herb-dominated plains where rainfall is enough for grasses but often too dry, seasonal, or fire-prone for closed forest. Prairies, steppes, and pampas store large fractions of biomass below ground in roots. Grazing and fire maintain open structure; conversion to cropland has reshaped many mid-latitude belts. This guide stays with root-heavy cover, openness, and climate envelopes rather than crop yields for a given year.',
    facts: {
      kind: 'Terrestrial',
      climate: 'BS / semi-arid to subhumid continental',
      range: 'Interior mid-latitudes and rain-shadow plains',
      cover: 'Perennial grasses and forbs; sparse woody plants',
      exemplars: 'North American Great Plains, Eurasian steppe, Argentine pampas',
    },
    features: [
      {
        name: 'Below-ground biomass',
        description:
          'Deep root systems store much of the living carbon and stabilize soils.',
      },
      {
        name: 'Fire and grazing',
        description:
          'Recurrent fire and herbivory keep woody encroachment in check across many plains.',
      },
      {
        name: 'Open horizon',
        description:
          'Low stature creates long sightlines and strong wind exposure at the surface.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Grassland',
        url: 'https://earthobservatory.nasa.gov/biome/biograssland.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Grassland',
        url: 'https://www.britannica.com/science/grassland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'desert',
    code: 'DES',
    name: 'Desert',
    category: 'Open lands',
    subtitle: 'Arid sparse cover · Subtropical & rain-shadow',
    about:
      'Deserts are arid biomes where evaporation exceeds precipitation for long stretches of the year. Subtropical highs, rain shadows, and continental interiors create hot and cold deserts alike. Vegetation is sparse and often spaced — shrubs, succulents, or ephemeral herbs after rare rains. Sand seas, stone pavements, and salt flats are landform signatures, not the whole story. Orientation stresses water deficit and sparse cover rather than dune tourism.',
    facts: {
      kind: 'Terrestrial',
      climate: 'BW arid (Köppen family)',
      range: 'Subtropical belts, rain shadows, polar-adjacent cold deserts',
      cover: 'Sparse shrubs, succulents, or barren ground',
      exemplars: 'Namib, Sahara, Atacama, Gobi',
    },
    features: [
      {
        name: 'Water deficit',
        description:
          'Potential evaporation far exceeds rainfall for most months of the year.',
      },
      {
        name: 'Spaced vegetation',
        description:
          'Plants compete for scarce moisture and often stand widely separated.',
      },
      {
        name: 'Aeolian landforms',
        description:
          'Wind shapes dunes, yardangs, and desert pavements where sand and stone are free to move.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Desert',
        url: 'https://earthobservatory.nasa.gov/biome/biodesert.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Desert',
        url: 'https://www.britannica.com/science/desert',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'savanna',
    code: 'SAV',
    name: 'Savanna',
    category: 'Open lands',
    subtitle: 'Grassland with trees · Seasonal tropics',
    about:
      'Savannas mix a continuous grass layer with scattered trees or shrubs under strongly seasonal tropical rainfall. Wet seasons green the herb layer; dry seasons favor fire that keeps canopies open. African, South American, Australian, and Asian savannas differ in tree species but share the grass–tree tension. Large herbivores and fire are structural partners. This primer treats seasonality and openness as the durable facts.',
    facts: {
      kind: 'Terrestrial',
      climate: 'Aw / As tropical wet–dry (Köppen family)',
      range: 'Seasonal tropics on several continents',
      cover: 'Continuous grass with scattered trees',
      exemplars: 'East African plains, Brazilian cerrado, Australian tropical savanna',
    },
    features: [
      {
        name: 'Wet–dry pulse',
        description:
          'A sharp dry season concentrates growth into a rainy window each year.',
      },
      {
        name: 'Tree–grass coexistence',
        description:
          'Scattered woody plants persist without closing into forest under fire and drought.',
      },
      {
        name: 'Fire as architect',
        description:
          'Dry-season burns remove litter and limit woody thickening across wide landscapes.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Savanna',
        url: 'https://earthobservatory.nasa.gov/biome/biosavanna.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Savanna',
        url: 'https://www.britannica.com/science/savanna',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tropical-rainforest',
    code: 'TRF',
    name: 'Tropical rainforest',
    category: 'Forests',
    subtitle: 'Evergreen broadleaf forest · Humid tropics',
    about:
      'Tropical rainforests are tall, evergreen broadleaf forests under nearly year-round warmth and high rainfall. Multi-layered canopies, dense epiphytes, and rapid nutrient cycling on often weathered soils define the structure. The Amazon, Congo Basin, and Southeast Asian rainforests are the great continuous blocks; cloud forests and wet coastal strips add variants. Orientation stays with humidity, canopy complexity, and equatorial climate rather than a single deforestation statistic.',
    facts: {
      kind: 'Terrestrial',
      climate: 'Af / Am humid tropical (Köppen family)',
      range: 'Equatorial lowlands and wet tropical coasts',
      cover: 'Multi-layered evergreen broadleaf canopy',
      exemplars: 'Amazon Basin, Congo Basin, Borneo and New Guinea wet forests',
    },
    features: [
      {
        name: 'Canopy layers',
        description:
          'Emergents, main canopy, understory, and forest floor partition light and life.',
      },
      {
        name: 'Evergreen humidity',
        description:
          'Little seasonal drought keeps leaves on trees through most of the year.',
      },
      {
        name: 'Rapid nutrient cycling',
        description:
          'Litter decomposes quickly; much of the nutrient capital rides in living biomass.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Rainforest',
        url: 'https://earthobservatory.nasa.gov/biome/biorainforest.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Tropical rainforest',
        url: 'https://www.britannica.com/science/tropical-rainforest',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mediterranean-shrubland',
    code: 'MED',
    name: 'Mediterranean shrubland',
    category: 'Open lands',
    subtitle: 'Sclerophyll shrubland · Summer-dry coasts',
    about:
      'Mediterranean shrublands — chaparral, maquis, fynbos, mallee — grow under mild, wet winters and hot, dry summers. Hard-leaved shrubs dominate; fire is a recurring architect. Five widely separated coastal regions share this climate rhythm: the Mediterranean Basin, California, central Chile, the Cape, and southwestern Australia. Orientation emphasizes the summer drought and sclerophyll cover rather than wine-country scenery.',
    facts: {
      kind: 'Terrestrial',
      climate: 'Cs summer-dry subtropical (Köppen family)',
      range: 'Five disjunct summer-dry coastal regions',
      cover: 'Sclerophyll shrubs; scattered trees',
      exemplars: 'California chaparral, Mediterranean maquis, South African fynbos',
    },
    features: [
      {
        name: 'Summer drought',
        description:
          'Rain falls mainly in the cool season; summers are long, hot, and dry.',
      },
      {
        name: 'Hard leaves',
        description:
          'Sclerophyll foliage resists drought and often recovers or resprouts after fire.',
      },
      {
        name: 'Disjunct regions',
        description:
          'The same climate envelope appears on five widely separated western coasts.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Chaparral',
        url: 'https://earthobservatory.nasa.gov/biome/biochaparral.php',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Chaparral',
        url: 'https://www.britannica.com/science/chaparral',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'wetland',
    code: 'WET',
    name: 'Wetland',
    category: 'Waters',
    subtitle: 'Saturated soils · Fresh to brackish',
    about:
      'Wetlands are lands saturated long enough that water shapes soils and vegetation — marshes, swamps, bogs, fens, and deltas. Standing or slow-moving water favors hydrophytes and anaerobic soils; productivity can be high even when tree cover is absent. Inland deltas such as the Okavango and coastal marshes alike sit at the land–water hinge. This guide treats saturation and hydrophyte cover as the durable definition, not a single flood map.',
    facts: {
      kind: 'Freshwater',
      climate: 'Azonal — climate follows the surrounding region',
      range: 'River floodplains, coasts, kettle holes, peat basins worldwide',
      cover: 'Hydrophytes; marsh grasses, reeds, swamp forest, or peat moss',
      exemplars: 'Okavango Delta, Everglades, Siberian peatlands',
    },
    features: [
      {
        name: 'Saturated soils',
        description:
          'Waterlogging creates anaerobic conditions that select specialized plants and soils.',
      },
      {
        name: 'Hydrophyte cover',
        description:
          'Reeds, sedges, swamp trees, or mosses dominate instead of upland dry-land flora.',
      },
      {
        name: 'Land–water hinge',
        description:
          'Wetlands buffer floods, trap sediment, and exchange nutrients between rivers and coasts.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Wetlands',
        url: 'https://earthobservatory.nasa.gov/',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Wetland',
        url: 'https://www.britannica.com/science/wetland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'montane',
    code: 'MON',
    name: 'Montane',
    category: 'Polar & montane',
    subtitle: 'Elevation belts · Mountains worldwide',
    about:
      'Montane biomes are elevation-organized belts on mountains — foothill woodland, montane forest, subalpine parkland, and alpine tundra stacked in a few vertical kilometers. Temperature and exposure change faster with height than with latitude, so a single range can compress several biomes. Aspect, snowpack, and treeline are structural controls. Orientation stresses vertical zonation rather than one named peak.',
    facts: {
      kind: 'Terrestrial',
      climate: 'Elevation-driven; cools with height',
      range: 'Major mountain systems on every continent',
      cover: 'Stacked belts from forest to alpine open ground',
      exemplars: 'Rockies, Andes, Alps, Himalaya, East African highlands',
    },
    features: [
      {
        name: 'Vertical zonation',
        description:
          'Life zones stack with elevation much as biomes stack with latitude.',
      },
      {
        name: 'Treeline',
        description:
          'A climatic timberline marks where upright trees give way to krummholz and alpine turf.',
      },
      {
        name: 'Aspect and snow',
        description:
          'North vs south slopes and lingering snowpack rearrange local moisture and heat.',
      },
    ],
    sources: [
      {
        label: 'NASA Earth Observatory — Mountains',
        url: 'https://earthobservatory.nasa.gov/',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Montane forest',
        url: 'https://www.britannica.com/science/mountain-ecosystem',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'coral-reef',
    code: 'CRL',
    name: 'Coral reef',
    category: 'Waters',
    subtitle: 'Shallow carbonate reef · Clear tropical seas',
    about:
      'Coral reefs are biogenic carbonate structures built mainly by colonial cnidarians in clear, warm, shallow seas. Living veneers of coral and algae overlie frameworks that may be thousands of years old. Barrier reefs, fringing reefs, and atolls differ in geometry but share light-limited zooxanthellate corals as the engineering guild. Orientation emphasizes warm clear water, light, and reef architecture — not a single bleaching event.',
    facts: {
      kind: 'Marine',
      climate: 'Warm clear tropical / subtropical seas',
      range: 'Shallow photic shelves in the tropics and subtropics',
      cover: 'Living coral and algal veneer on carbonate framework',
      exemplars: 'Great Barrier Reef, Mesoamerican Reef, Red Sea fringing reefs',
    },
    features: [
      {
        name: 'Photic builders',
        description:
          'Reef-building corals host algae that need clear, sunlit water.',
      },
      {
        name: 'Carbonate framework',
        description:
          'Generations of skeletons accumulate into barriers, fringes, and atolls.',
      },
      {
        name: 'Wave and shelf geometry',
        description:
          'Reef crests, lagoons, and slopes organize habitats along the shelf edge.',
      },
    ],
    sources: [
      {
        label: 'NOAA Coral Reef Conservation',
        url: 'https://coralreef.noaa.gov/',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Coral reef',
        url: 'https://www.britannica.com/science/coral-reef',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ice-sheet',
    code: 'ICE',
    name: 'Ice sheet',
    category: 'Polar & montane',
    subtitle: 'Continental ice · Polar plateaus',
    about:
      'Ice sheets are continent-scale glaciers that bury bedrock under kilometers of ice — today Greenland and Antarctica. Flow toward the coasts feeds ice shelves and outlet glaciers; accumulation of snow inland balances loss at the margins over long timescales. The surface is a cold desert of firn and blue ice; beneath lie deforming ice and, in places, subglacial lakes. This primer treats mass geometry and flow rather than a single melt-season chart.',
    facts: {
      kind: 'Terrestrial',
      climate: 'EF ice climate (Köppen family)',
      range: 'Greenland and Antarctica (present day)',
      cover: 'Permanent glacial ice and firn',
      exemplars: 'East Antarctic Plateau, Greenland interior, Ross & Filchner–Ronne shelves',
    },
    features: [
      {
        name: 'Kilometer-scale ice',
        description:
          'Ice thickness reaches kilometers over continental interiors.',
      },
      {
        name: 'Outlet flow',
        description:
          'Ice streams and outlet glaciers deliver mass toward marine margins and shelves.',
      },
      {
        name: 'Accumulation–ablation balance',
        description:
          'Snowfall inland and loss at edges set the long-term mass budget of the sheet.',
      },
    ],
    sources: [
      {
        label: 'NASA Ice sheets',
        url: 'https://www.nasa.gov/mission_pages/icebridge/',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Ice sheet',
        url: 'https://www.britannica.com/science/ice-sheet',
        kind: 'reference',
      },
    ],
  },
]

export const biomeSubjects: BiomeSubject[] =
  biomeSubjectDrafts.map(withPhoto)

export function biomeSubjectSlugs(): string[] {
  return biomeSubjects.map((subject) => subject.slug)
}

export function getBiomeSubject(slug: string): BiomeSubject | undefined {
  return biomeSubjects.find((subject) => subject.slug === slug)
}

export function biomeSubjectsByCategory(): [string, BiomeSubject[]][] {
  const groups = new Map<string, BiomeSubject[]>()
  for (const subject of biomeSubjects) {
    const list = groups.get(subject.category) ?? []
    list.push(subject)
    groups.set(subject.category, list)
  }
  return [...groups.entries()]
}

export function biomeDescription(subject: BiomeSubject): string {
  return subject.about.replace(/\s+/g, ' ').trim()
}
