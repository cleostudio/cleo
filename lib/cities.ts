/** Cities topic — evergreen field-guide records for capitals and route cities. */

import citiesPhotos from '~/content/cities-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface CityFeature {
  name: string
  description: string
}

export interface CitySource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface CityFacts {
  /** Broad type: Imperial capital, Port capital, Crossroads city, etc. */
  kind: string
  /** Modern Explore country (exact catalog name). */
  country: string
  /** Geographic setting in plain language. */
  region: string
  /** Durable founding / continuity note. */
  founded: string
  /** Current / former / dual capital role. */
  capitalRole: string
  /** Rivers, straits, roads, or other corridors. */
  corridors: string
  /** Modern Explore countries for fact-plate deep links. */
  exploreLinks: string[]
}

export interface CityPhoto extends StaticPhoto {
  commonsTitle: string
}

export interface CitySubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. IST, CAI). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title. */
  subtitle: string
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: CityFacts
  /** Exactly three notable sites / features. */
  features: [CityFeature, CityFeature, CityFeature]
  sources: CitySource[]
  /** Three distinct, locally hosted photographs: one hero plus two gallery views. */
  photos: [CityPhoto, CityPhoto, CityPhoto]
}

type CitySubjectDraft = Omit<CitySubject, 'photos'>

const photoManifest = citiesPhotos as Record<string, CityPhoto[]>

function withPhotos(draft: CitySubjectDraft): CitySubject {
  const photos = photoManifest[draft.slug]
  if (!Array.isArray(photos) || photos.length !== 3) {
    throw new Error(`Missing three city photos for ${draft.slug}`)
  }
  return {
    ...draft,
    photos: photos as [CityPhoto, CityPhoto, CityPhoto],
  }
}

/**
 * Curated catalog — capitals and route cities.
 * Expand here as new Cities guides ship.
 */
const citySubjectDrafts: CitySubjectDraft[] = [
  {
    slug: 'istanbul',
    code: 'IST',
    name: 'Istanbul',
    category: 'Capitals & routes',
    subtitle: 'Strait capital · Bosphorus',
    about:
      'Istanbul is a city built on a strait — a capital that has repeatedly turned the Bosphorus into political geography. As Byzantium, Constantinople, and then Istanbul, it sat where Europe and Asia face each other across a working waterway of ferries, fortresses, and bridges. Orientation is maritime and imperial: Golden Horn harbors, peninsula walls, and a skyline of domes that mark successive claims on the same ground. Trade and pilgrimage routes met here long before railways; the city remains a corridor as much as a destination. Neighborhoods stack Greek, Roman, Byzantine, Ottoman, and republican layers without erasing the strait’s daily traffic. This primer stays with water crossing, capital continuity, and urban threshold rather than a museum checklist alone.',
    facts: {
      kind: 'Strait capital',
      country: 'Türkiye',
      region: 'Bosphorus · Marmara & Black Sea threshold',
      founded: 'Byzantium antiquity; continuous urban life through Constantinople to Istanbul',
      capitalRole: 'Former imperial capital; Türkiye’s largest city (Ankara is the political capital)',
      corridors: 'Bosphorus Strait, Golden Horn, historic Via Egnatia / Silk Road links',
      exploreLinks: ['Türkiye'],
    },
    features: [
      {
        name: 'Hagia Sophia',
        description:
          'The great dome on the historic peninsula — church, mosque, and museum by turns, still the architectural emblem of the city’s imperial threshold.',
      },
      {
        name: 'Galata Tower',
        description:
          'A Genoese landmark above the Golden Horn — a vertical marker of the commercial shore facing the old imperial peninsula.',
      },
      {
        name: 'Bosphorus Bridge',
        description:
          'A modern suspension span across the strait — engineering that made the Europe–Asia crossing a daily metropolitan commute.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Istanbul',
        url: 'https://www.britannica.com/place/Istanbul',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Byzantium',
        url: 'https://www.metmuseum.org/toah/hd/byza/hd_byza.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Areas of Istanbul',
        url: 'https://whc.unesco.org/en/list/356',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'cairo',
    code: 'CAI',
    name: 'Cairo',
    category: 'Capitals & routes',
    subtitle: 'River capital · Nile corridor',
    about:
      'Cairo is the dense capital of the Nile’s lower valley — a city that grew where river, desert edge, and long-distance routes concentrate people and power. Fatimid foundations, Mamluk streets, Ottoman overlays, and modern expansion stack into one of Africa’s great megacities. Orientation is riparian and monumental: the Citadel watches the urban plain; markets like Khan el-Khalili keep the historic core as a commercial artery; the Nile remains the city’s structural spine even when traffic and concrete try to ignore it. Nearby pyramids remind visitors that the capital sits inside a much older corridor of state formation. This primer stays with river capital, citadel, and historic bazaar rather than every dynasty’s reign.',
    facts: {
      kind: 'River capital',
      country: 'Egypt',
      region: 'Nile Valley · Lower Egypt',
      founded: 'Fatimid foundation 969 CE on older Nile settlement patterns',
      capitalRole: 'Capital of Egypt',
      corridors: 'Nile River, desert caravan approaches, Red Sea / Mediterranean trade links',
      exploreLinks: ['Egypt'],
    },
    features: [
      {
        name: 'Mosque of Muhammad Ali',
        description:
          'The Ottoman-style mosque crowning the Citadel — a nineteenth-century skyline statement over medieval Cairo.',
      },
      {
        name: 'Cairo Citadel',
        description:
          'Salah al-Din’s hill fortress and later palace zone — the elevated seat from which rulers watched the river city.',
      },
      {
        name: 'Khan el-Khalili',
        description:
          'The historic market quarter — alleys of trade that still stage Cairo’s old-city commercial rhythm.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Cairo',
        url: 'https://www.britannica.com/place/Cairo',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Egypt in the Middle Ages',
        url: 'https://www.metmuseum.org/toah/hd/egma/hd_egma.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Cairo',
        url: 'https://whc.unesco.org/en/list/89',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'kyoto',
    code: 'KYO',
    name: 'Kyoto',
    category: 'Capitals & routes',
    subtitle: 'Former imperial capital · Yamashiro basin',
    about:
      'Kyoto was Japan’s imperial capital for more than a millennium — a planned basin city whose grid, temples, and craft quarters outlasted the court’s political primacy. Orientation is topographic and ceremonial: mountains frame a rectangular city idea borrowed and remade from continental models; temple-shrine precincts mark neighborhoods; rivers and roads tied the capital to the Tōkaidō and inland routes. Even after the seat of government moved, Kyoto kept cultural capital: pilgrimage paths, seasonal festivals, and workshops that still define national images of tradition. Modern traffic and tourism press the same corridors. This primer stays with basin capital, sacred paths, and route geography rather than a temple-by-temple guidebook.',
    facts: {
      kind: 'Former imperial capital',
      country: 'Japan',
      region: 'Yamashiro basin · Kansai',
      founded: 'Heian-kyō established 794 CE',
      capitalRole: 'Imperial capital until 1868; cultural capital thereafter',
      corridors: 'Kamo & Katsura rivers; Tōkaidō / inland approaches through mountain passes',
      exploreLinks: ['Japan'],
    },
    features: [
      {
        name: 'Kiyomizu-dera',
        description:
          'A hillside temple with a timber stage overlooking the city basin — Kyoto’s classic elevated view of urban and sacred space together.',
      },
      {
        name: 'Fushimi Inari',
        description:
          'The shrine of thousand vermilion torii paths climbing Inariyama — a sacred route that turns mountain slope into procession.',
      },
      {
        name: 'Arashiyama Bamboo Grove',
        description:
          'A famous bamboo path on Kyoto’s western edge — corridor walking as landscape experience at the city’s mountain margin.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Kyoto',
        url: 'https://www.britannica.com/place/Kyoto-Japan',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Heian Period',
        url: 'https://www.metmuseum.org/toah/hd/heia/hd_heia.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Monuments of Ancient Kyoto',
        url: 'https://whc.unesco.org/en/list/688',
        kind: 'catalog',
      },
    ],
  },
]

export const citySubjects: CitySubject[] = citySubjectDrafts.map(withPhotos)

export function citySubjectSlugs(): string[] {
  return citySubjects.map((subject) => subject.slug)
}

export function getCitySubject(slug: string): CitySubject | undefined {
  return citySubjects.find((subject) => subject.slug === slug)
}

export function citySubjectsByCategory(): [string, CitySubject[]][] {
  const order: string[] = []
  const groups = new Map<string, CitySubject[]>()
  for (const subject of citySubjects) {
    if (!groups.has(subject.category)) {
      order.push(subject.category)
      groups.set(subject.category, [])
    }
    groups.get(subject.category)!.push(subject)
  }
  return order.map((category) => [category, groups.get(category)!])
}

export function cityDescription(subject: CitySubject): string {
  return subject.about
}

export function cityFeaturedPhoto(subject: CitySubject): CityPhoto {
  return subject.photos[0]
}
