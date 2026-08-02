/** Civilizations topic — evergreen field-guide records for historical civilizations. */

import civilizationsPhotos from '~/content/civilizations-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface CivilizationFeature {
  name: string
  description: string
}

export interface CivilizationSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface CivilizationFacts {
  /** Broad type: River civilization, Classical empire, Forest city network, etc. */
  kind: string
  /** Geographic heartland in plain language. */
  heartland: string
  /** Durable era span (not a newsy “now”). */
  era: string
  /** Peak centuries or named high period. */
  peak: string
  /** Primary writing system or record-keeping tradition. */
  writing: string
  /** Modern Explore countries that hold major remains (comma-separated names). */
  exploreLinks: string
}

export interface CivilizationPhoto extends StaticPhoto {
  commonsTitle: string
}

export interface CivilizationSubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. EGY, ROM). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title. */
  subtitle: string
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: CivilizationFacts
  /** Exactly three notable sites / features. */
  features: [CivilizationFeature, CivilizationFeature, CivilizationFeature]
  sources: CivilizationSource[]
  /** Three distinct, locally hosted photographs: one hero plus two gallery views. */
  photos: [CivilizationPhoto, CivilizationPhoto, CivilizationPhoto]
}

type CivilizationSubjectDraft = Omit<CivilizationSubject, 'photos'>

const photoManifest = civilizationsPhotos as Record<string, CivilizationPhoto[]>

function withPhotos(draft: CivilizationSubjectDraft): CivilizationSubject {
  const photos = photoManifest[draft.slug]
  if (!Array.isArray(photos) || photos.length !== 3) {
    throw new Error(`Missing three civilization photos for ${draft.slug}`)
  }
  return { ...draft, photos: photos as [CivilizationPhoto, CivilizationPhoto, CivilizationPhoto] }
}

/**
 * Curated starter catalog — Africa & Near East, Mediterranean, and Americas.
 * Expand here as new Civilizations guides ship.
 */
const civilizationSubjectDrafts: CivilizationSubjectDraft[] = [
  {
    slug: 'ancient-egypt',
    code: 'EGY',
    name: 'Ancient Egypt',
    category: 'Africa & Near East',
    subtitle: 'River civilization · Nile Valley',
    about:
      'Ancient Egypt grew along a river that flooded on a schedule people could learn. The Nile’s annual inundation deposited silt, fed grain, and turned a desert corridor into a long green workshop of farms, temples, and towns. Orientation here is hydraulic and funerary at once: a state that measured the year by water, wrote its memory in stone and papyrus, and built for the dead with a confidence that still crowds the skyline at Giza. Power clustered in nomes and capitals that shifted with dynasties — Memphis, Thebes, later cities under foreign rule — yet the underlying pattern stayed recognizable for three millennia: a kingship framed as cosmic order, a priesthood managing temples as economic engines, and a scribal class keeping accounts as carefully as myths. Monumental tombs and processional architecture were not decoration on top of ordinary life; they were how a river society argued that order could outlast a flood season. This primer stays with durable structure — valley, script, cult, and craft — rather than a parade of reigns.',
    facts: {
      kind: 'River civilization',
      heartland: 'Nile Valley · Northeast Africa',
      era: 'c. 3100 BCE – 30 BCE',
      peak: 'New Kingdom, c. 1550–1070 BCE',
      writing: 'Egyptian hieroglyphs (and hieratic)',
      exploreLinks: 'Egypt, Sudan',
    },
    features: [
      {
        name: 'Great Pyramid of Giza',
        description:
          'The largest of the Giza pyramid complex — a Fourth Dynasty royal tomb whose geometry, quarrying, and workforce logistics still define Egypt’s monumental reputation.',
      },
      {
        name: 'Karnak Temple',
        description:
          'A vast Theban sacred precinct of pylons, courts, and hypostyle halls accumulated over centuries as a working religious and political center.',
      },
      {
        name: 'Temple of Hatshepsut',
        description:
          'A terraced mortuary temple at Deir el-Bahari that stages procession and cliff face together — architecture as controlled approach into the western hills.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ancient Egypt',
        url: 'https://www.britannica.com/place/ancient-Egypt',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Egyptian Art',
        url: 'https://www.metmuseum.org/toah/hd/egyp/hd_egyp.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Memphis and its Necropolis',
        url: 'https://whc.unesco.org/en/list/86',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'roman-empire',
    code: 'ROM',
    name: 'Roman Empire',
    category: 'Mediterranean',
    subtitle: 'Classical empire · Mediterranean basin',
    about:
      'Rome began as a city on the Tiber and became a system for moving law, grain, soldiers, and ideas around an inland sea. The empire’s durable signature is infrastructure as politics: roads that outlived the rulers who ordered them, aqueducts that made dense cities possible, and a civic architecture — forum, basilica, amphitheatre, bath — repeated from Britain to North Africa with local accents. Latin and Greek carried administration and literature; citizenship expanded in stages until legal belonging was wider than any single ethnicity. Violence and extraction were real; so was a long experiment in governing plurality with surveyors, tax rolls, and concrete. Peak imperial confidence still reads in monuments that were never meant to be ruins. This primer favors the operating system — city, army, law, and Mediterranean logistics — over a chronicle of every emperor.',
    facts: {
      kind: 'Classical empire',
      heartland: 'Italian peninsula · Mediterranean basin',
      era: '27 BCE – 476 CE (West); East continues as Byzantium',
      peak: 'Principate high empire, 1st–2nd centuries CE',
      writing: 'Latin (Greek in the East)',
      exploreLinks: 'Italy, Greece, Spain, France, Turkey, Egypt',
    },
    features: [
      {
        name: 'Colosseum',
        description:
          'The Flavian Amphitheatre in Rome — a engineered bowl for public spectacle whose arches and vomitoria still teach Roman crowd logistics in stone.',
      },
      {
        name: 'Roman Forum',
        description:
          'The civic heart of the capital: temples, basilicas, and processional space where law, religion, and politics shared the same packed ground.',
      },
      {
        name: 'Pantheon',
        description:
          'A Hadrianic temple whose unreinforced concrete dome and oculus remain a masterclass in Roman structural ambition and light.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Roman Empire',
        url: 'https://www.britannica.com/place/Roman-Empire',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — The Roman Empire',
        url: 'https://www.metmuseum.org/toah/hd/roem/hd_roem.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Rome',
        url: 'https://whc.unesco.org/en/list/91',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'maya',
    code: 'MAY',
    name: 'Maya',
    category: 'Americas',
    subtitle: 'Forest city network · Mesoamerica',
    about:
      'Maya civilization was never a single capital wearing one crown. It was a constellation of city-states across the lowland forests and highland valleys of Mesoamerica — Tikal, Calakmul, Palenque, Copán, later Chichén Itzá — competing, trading, and reading the same sky. Their classical florescence left stone calendars, dynastic inscriptions, and pyramids that are also mountains of ceremony. Maize agriculture, intensive wetland and terrace strategies, and long-distance exchange in jade, obsidian, and salt underwrote courts that staged ritual as statecraft. The script is one of the great Native American writing systems: logosyllabic, historical, and still being read more fully each decade. Collapse narratives for the southern lowlands are real and complicated; Maya peoples and languages did not vanish with any one city’s abandonment. This primer stays with the network — cities, script, agriculture, and cosmos — rather than a single lost-world myth.',
    facts: {
      kind: 'Forest city network',
      heartland: 'Yucatán & Petén lowlands · highland Guatemala',
      era: 'Preclassic to Postclassic; Classic peak c. 250–900 CE',
      peak: 'Southern lowland Classic, c. 600–800 CE',
      writing: 'Maya logosyllabic script',
      exploreLinks: 'Mexico, Guatemala, Belize, Honduras, El Salvador',
    },
    features: [
      {
        name: 'Tikal Temple I',
        description:
          'A steep funerary pyramid in the Petén forest — Classic Maya vertical drama rising above a plaza that once held a dynastic capital.',
      },
      {
        name: 'El Castillo, Chichén Itzá',
        description:
          'The stepped Castillo pyramid whose equinox light-and-shadow serpent and radial stairways fuse astronomy with political theatre.',
      },
      {
        name: 'Temple of the Inscriptions',
        description:
          'Palenque’s inscribed pyramid-tomb for K’inich Janaab Pakal — architecture, biography, and afterlife theology stacked in one mass.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Maya',
        url: 'https://www.britannica.com/topic/Maya-people',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Maya',
        url: 'https://www.metmuseum.org/toah/hd/mayag/hd_mayag.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Tikal National Park',
        url: 'https://whc.unesco.org/en/list/64',
        kind: 'catalog',
      },
    ],
  },
]

export const civilizationSubjects: CivilizationSubject[] =
  civilizationSubjectDrafts.map(withPhotos)

export function civilizationSubjectSlugs(): string[] {
  return civilizationSubjects.map((subject) => subject.slug)
}

export function getCivilizationSubject(
  slug: string,
): CivilizationSubject | undefined {
  return civilizationSubjects.find((subject) => subject.slug === slug)
}

export function civilizationSubjectsByCategory(): [string, CivilizationSubject[]][] {
  const order: string[] = []
  const groups = new Map<string, CivilizationSubject[]>()
  for (const subject of civilizationSubjects) {
    if (!groups.has(subject.category)) {
      order.push(subject.category)
      groups.set(subject.category, [])
    }
    groups.get(subject.category)!.push(subject)
  }
  return order.map((category) => [category, groups.get(category)!])
}

export function civilizationDescription(subject: CivilizationSubject): string {
  return subject.about
}

export function civilizationFeaturedPhoto(
  subject: CivilizationSubject,
): CivilizationPhoto {
  return subject.photos[0]
}
