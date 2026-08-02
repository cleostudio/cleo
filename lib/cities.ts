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
 * Curated catalog — capitals and route cities across Mediterranean & Europe,
 * Asia, and Africa & Americas (sixteen guides). Expand here as new Cities
 * guides ship.
 */
const citySubjectDrafts: CitySubjectDraft[] = [
  {
    slug: 'istanbul',
    code: 'IST',
    name: 'Istanbul',
    category: 'Mediterranean & Europe',
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
    slug: 'rome',
    code: 'ROM',
    name: 'Rome',
    category: 'Mediterranean & Europe',
    subtitle: 'Imperial capital · Tiber basin',
    about:
      'Rome is a capital that taught later cities how power could look permanent. From a Tiber ford and seven hills it grew into the administrative heart of a Mediterranean empire, then remade itself as papal capital and modern Italian seat. Orientation is layered and ceremonial: forums and amphitheaters of the classical city sit beside Renaissance and Baroque streets that reused the same stones; the river remains a soft spine through dense districts. Roads once radiated from the milliarium aureum; railways and ring roads now do similar work at metropolitan scale. This primer stays with capital continuity, monumental reuse, and river geography rather than a reign-by-reign chronicle.',
    facts: {
      kind: 'Imperial capital',
      country: 'Italy',
      region: 'Tiber basin · central Italy',
      founded: 'Traditional founding 753 BCE; continuous urban life through republic, empire, papacy, and republic',
      capitalRole: 'Capital of Italy; historic capital of the Roman Empire and of the Papal States',
      corridors: 'Tiber River; Via Appia and other Roman roads; Mediterranean approaches',
      exploreLinks: ['Italy'],
    },
    features: [
      {
        name: 'Colosseum',
        description:
          'The Flavian amphitheater — a concrete-and-stone machine for public spectacle that still anchors Rome’s classical skyline.',
      },
      {
        name: 'Pantheon',
        description:
          'Hadrian’s domed temple, later a church — an unbroken interior volume that remains one of antiquity’s most persuasive rooms.',
      },
      {
        name: 'Roman Forum',
        description:
          'The civic valley between the Palatine and Capitoline — ruins of temples, basilicas, and processional ways that once staged republican and imperial politics.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Rome',
        url: 'https://www.britannica.com/place/Rome',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Roman Empire',
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
    slug: 'paris',
    code: 'PAR',
    name: 'Paris',
    category: 'Mediterranean & Europe',
    subtitle: 'River capital · Seine basin',
    about:
      'Paris is a river capital whose islands, bridges, and embankments turned the Seine into an urban argument. From a medieval island nucleus it expanded into royal, revolutionary, and republican capitals stacked on the same basin. Orientation is riparian and axial: Île de la Seine, right- and left-bank contrasts, and later boulevards that made movement itself a political project. Museums, markets, and ministries still cluster along corridors that once carried grain and pilgrims. This primer stays with river geography, capital display, and route structure rather than café mythology alone.',
    facts: {
      kind: 'River capital',
      country: 'France',
      region: 'Seine basin · northern France',
      founded: 'Roman Lutetia; continuous capital role through medieval, royal, and republican eras',
      capitalRole: 'Capital of France',
      corridors: 'Seine River; historic roads to Normandy, Flanders, and the Loire; rail hubs',
      exploreLinks: ['France'],
    },
    features: [
      {
        name: 'Eiffel Tower',
        description:
          'The 1889 iron lattice tower on the Champ de Mars — an industrial landmark that became Paris’s vertical signature.',
      },
      {
        name: 'Notre-Dame',
        description:
          'The Gothic cathedral on the Île de la Cité — a river-island sacred center that long marked the city’s ceremonial heart.',
      },
      {
        name: 'Louvre',
        description:
          'Palace turned museum along the right bank — a former royal seat whose courtyards and pyramid now stage one of the world’s great collections.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Paris',
        url: 'https://www.britannica.com/place/Paris',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Paris, Banks of the Seine',
        url: 'https://whc.unesco.org/en/list/600',
        kind: 'catalog',
      },
      {
        label: 'Louvre — History of the palace',
        url: 'https://www.louvre.fr/en/explore/the-palace',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'venice',
    code: 'VCE',
    name: 'Venice',
    category: 'Mediterranean & Europe',
    subtitle: 'Lagoon republic · Adriatic routes',
    about:
      'Venice is a lagoon city that made water its street grid and the Adriatic its economic hinterland. Built on islands and piles, it became a maritime republic whose merchants linked the eastern Mediterranean to Alpine and northern European markets. Orientation is hydraulic and ceremonial: the Grand Canal as main avenue, campi as neighborhood rooms, and Piazza San Marco as the state’s outdoor hall. Trade, shipyards, and diplomacy were urban industries, not side effects. This primer stays with lagoon geography, maritime corridors, and republican display rather than a gondola postcard alone.',
    facts: {
      kind: 'Lagoon republic city',
      country: 'Italy',
      region: 'Venetian Lagoon · northern Adriatic',
      founded: 'Early medieval lagoon settlements; maritime republic rising in the High Middle Ages',
      capitalRole: 'Historic capital of the Republic of Venice; major Italian city thereafter',
      corridors: 'Grand Canal; Adriatic shipping lanes; Alpine passes toward northern Europe',
      exploreLinks: ['Italy'],
    },
    features: [
      {
        name: "St Mark's Basilica",
        description:
          'The state church of the republic beside the campanile and Doge’s Palace — mosaic-clad emblem of Venice’s eastern Mediterranean ties.',
      },
      {
        name: 'Grand Canal',
        description:
          'The S-shaped main waterway lined with merchant palaces — the city’s primary avenue for goods, ceremonies, and daily traffic.',
      },
      {
        name: 'Rialto Bridge',
        description:
          'The historic stone crossing at the market district — where commerce and canal geography meet in a single span.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Venice',
        url: 'https://www.britannica.com/place/Venice',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Venice and its Lagoon',
        url: 'https://whc.unesco.org/en/list/394',
        kind: 'catalog',
      },
      {
        label: 'Metropolitan Museum — Venice and the Islamic World',
        url: 'https://www.metmuseum.org/toah/hd/vnis/hd_vnis.htm',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'london',
    code: 'LON',
    name: 'London',
    category: 'Mediterranean & Europe',
    subtitle: 'Thames capital · imperial port',
    about:
      'London is a river capital that grew where the Thames could be bridged and where Atlantic and continental trade met an island state. Orientation is tidal and institutional: the City’s financial core, Westminster’s parliamentary riverfront, and docks that once made the estuary a global warehouse. Roman Londinium, medieval markets, and imperial shipping stacked into one of Europe’s densest political economies. The river remains the city’s structural spine even when railways and underground lines steal the daily commute. This primer stays with Thames geography, port capital form, and civic landmarks rather than every borough’s story.',
    facts: {
      kind: 'River capital',
      country: 'United Kingdom',
      region: 'Thames estuary · southeastern England',
      founded: 'Roman Londinium; continuous urban life through medieval and modern capitals',
      capitalRole: 'Capital of the United Kingdom',
      corridors: 'River Thames, North Sea approaches, historic Atlantic trade routes',
      exploreLinks: ['United Kingdom'],
    },
    features: [
      {
        name: 'Tower Bridge',
        description:
          'The bascule bridge below the Tower — Victorian engineering that still stages the Thames as London’s working waterfront.',
      },
      {
        name: 'Elizabeth Tower',
        description:
          'The Palace of Westminster’s clock tower — parliamentary silhouette on the north bank of the Thames.',
      },
      {
        name: "St Paul's Cathedral",
        description:
          'Wren’s dome above the City — a rebuilt sacred landmark that still anchors London’s skyline after fire and war.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — London',
        url: 'https://www.britannica.com/place/London',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Palace of Westminster and Westminster Abbey',
        url: 'https://whc.unesco.org/en/list/426',
        kind: 'catalog',
      },
      {
        label: 'Museum of London — City history',
        url: 'https://www.londonmuseum.org.uk/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'athens',
    code: 'ATH',
    name: 'Athens',
    category: 'Mediterranean & Europe',
    subtitle: 'Acropolis city · Attic plain',
    about:
      'Athens is the classical city of the Attic plain — a dense capital whose Acropolis still organizes the skyline and whose agora once organized civic life. Orientation is rock and democracy’s afterimage: temple architecture on the citadel, theaters and stoas on the slopes and plain, and a modern capital layered over archaeological ground. Mediterranean light, marble, and a long memory of city-state politics make Athens a hinge between antiquity and the contemporary Greek state. This primer stays with acropolis geography, civic spaces, and capital continuity rather than every classical author.',
    facts: {
      kind: 'Classical capital',
      country: 'Greece',
      region: 'Attica · eastern mainland Greece',
      founded: 'Bronze Age settlement; classical polis florescence in the 5th–4th centuries BCE',
      capitalRole: 'Capital of Greece',
      corridors: 'Saronic Gulf approaches; land routes across the Attic plain',
      exploreLinks: ['Greece'],
    },
    features: [
      {
        name: 'Acropolis',
        description:
          'The citadel of the Parthenon and companion temples — the city’s enduring geometric and civic emblem.',
      },
      {
        name: 'Odeon of Herodes Atticus',
        description:
          'The Roman-era theater on the Acropolis slope — a stone bowl still used for performance under the citadel.',
      },
      {
        name: 'Stoa of Attalos',
        description:
          'The reconstructed colonnade on the Ancient Agora — a commercial and civic frontage for the classical marketplace.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Athens',
        url: 'https://www.britannica.com/place/Athens',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Acropolis, Athens',
        url: 'https://whc.unesco.org/en/list/404',
        kind: 'catalog',
      },
      {
        label: 'American School of Classical Studies — Athenian Agora',
        url: 'https://www.ascsa.edu.gr/excavations/athenian-agora',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'jerusalem',
    code: 'JLM',
    name: 'Jerusalem',
    category: 'Mediterranean & Europe',
    subtitle: 'Highland sanctuary · shared sacred city',
    about:
      'Jerusalem is a highland city where sacred geographies of Judaism, Christianity, and Islam overlap on a compact ridge between the Mediterranean and the Jordan Valley. Orientation is wall, mount, and pilgrimage: the Western Wall and Temple Mount/Haram al-Sharif platform; the Church of the Holy Sepulchre in the Christian Quarter; and a dense Old City plan of quarters, markets, and gates. Political capitals and empires have claimed the ridge for millennia without erasing its role as a destination of worship. This primer stays with sacred topography and urban quarters rather than every contested chronology.',
    facts: {
      kind: 'Sacred highland city',
      country: 'Israel',
      region: 'Judean hills · eastern Mediterranean highland',
      founded: 'Ancient highland settlement with continuous sacred and urban use across millennia',
      capitalRole: 'Declared capital of Israel; also claimed as capital by Palestine — contested status',
      corridors: 'Highland ridge routes; pilgrimage roads from Mediterranean and Jordan Valley approaches',
      exploreLinks: ['Israel', 'Palestine'],
    },
    features: [
      {
        name: 'Western Wall',
        description:
          'The retaining wall of the ancient Temple platform — Judaism’s most visited outdoor prayer site in the Old City.',
      },
      {
        name: 'Dome of the Rock',
        description:
          'The golden-domed shrine on the Haram al-Sharif / Temple Mount — Islamic sacred architecture at the city’s visual center.',
      },
      {
        name: 'Church of the Holy Sepulchre',
        description:
          'The compound church of crucifixion and resurrection traditions — a shared Christian pilgrimage core in the Old City.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Jerusalem',
        url: 'https://www.britannica.com/place/Jerusalem',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Old City of Jerusalem and its Walls',
        url: 'https://whc.unesco.org/en/list/148',
        kind: 'catalog',
      },
      {
        label: 'Metropolitan Museum — Jerusalem',
        url: 'https://www.metmuseum.org/toah/hd/jeru/hd_jeru.htm',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kyoto',
    code: 'KYO',
    name: 'Kyoto',
    category: 'Asia',
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
  {
    slug: 'beijing',
    code: 'PEK',
    name: 'Beijing',
    category: 'Asia',
    subtitle: 'Imperial capital · North China plain',
    about:
      'Beijing is a planned imperial capital on the North China Plain — a city whose axes, walls, and palace compounds made cosmology into street geometry. Ming and Qing rulers centered authority in the Forbidden City; temples, altars, and processional ways extended ritual order into the surrounding grid. Orientation is axial and seasonal: north–south ceremony, courtyard compounds, and later rail and ring-road rings that absorbed a megacity around the old core. Nearby imperial gardens and wall corridors remind visitors that capital defense and leisure were also landscape projects. This primer stays with axis, palace, and ritual geography rather than a modern skyline tour alone.',
    facts: {
      kind: 'Imperial capital',
      country: 'China',
      region: 'North China Plain · Hai River basin',
      founded: 'Long settlement history; Ming capital designation consolidated the imperial plan still legible today',
      capitalRole: 'Capital of the People’s Republic of China; historic Ming–Qing imperial capital',
      corridors: 'Grand Canal links; northern frontier approaches; modern rail and ring roads',
      exploreLinks: ['China'],
    },
    features: [
      {
        name: 'Forbidden City',
        description:
          'The Ming–Qing palace compound on the city’s central axis — a walled city-within-a-city of courts, gates, and throne halls.',
      },
      {
        name: 'Temple of Heaven',
        description:
          'The imperial ritual park south of the palace axis — where emperors performed seasonal sacrifices for good harvests.',
      },
      {
        name: 'Summer Palace',
        description:
          'The lakeside imperial garden complex northwest of the old city — landscape as court retreat and political stage.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Beijing',
        url: 'https://www.britannica.com/place/Beijing',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Imperial Palaces of the Ming and Qing Dynasties',
        url: 'https://whc.unesco.org/en/list/439',
        kind: 'catalog',
      },
      {
        label: 'UNESCO — Temple of Heaven',
        url: 'https://whc.unesco.org/en/list/881',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'delhi',
    code: 'DEL',
    name: 'Delhi',
    category: 'Asia',
    subtitle: 'Imperial crossroads · Yamuna plain',
    about:
      'Delhi is a capital region of successive cities on the Yamuna’s western plain — a place where sultanate, Mughal, and modern Indian capitals reused the same strategic ground. Orientation is layered and corridor-driven: forts and Friday mosques of earlier cities sit beside the planned avenues of New Delhi; the river and ridge frame settlement even when highways try to ignore them. Trade routes, pilgrimage circuits, and imperial roads long funneled people through this threshold between the Indus–Gangetic world and the peninsula. This primer stays with capital succession, fort-mosque pairs, and plain geography rather than every dynasty’s full timeline.',
    facts: {
      kind: 'Imperial crossroads capital',
      country: 'India',
      region: 'Yamuna plain · northern India',
      founded: 'Multiple historic cities on the site; continuous capital importance from the medieval period onward',
      capitalRole: 'National Capital Territory of India (with New Delhi as the seat of government)',
      corridors: 'Yamuna River; historic Grand Trunk Road links; rail hub of northern India',
      exploreLinks: ['India'],
    },
    features: [
      {
        name: 'Red Fort',
        description:
          'Shah Jahan’s riverside palace-fort of red sandstone — the ceremonial heart of Mughal Shahjahanabad.',
      },
      {
        name: 'Qutb Minar',
        description:
          'The soaring minaret of the early Delhi Sultanate complex — a victory tower that still marks the southern historic cities.',
      },
      {
        name: 'Jama Masjid',
        description:
          'The great Friday mosque of Old Delhi — a congregational plaza and dome ensemble facing the Mughal urban core.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Delhi',
        url: 'https://www.britannica.com/place/Delhi',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Red Fort Complex',
        url: 'https://whc.unesco.org/en/list/231',
        kind: 'catalog',
      },
      {
        label: 'UNESCO — Qutb Minar and its Monuments',
        url: 'https://whc.unesco.org/en/list/233',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'samarkand',
    code: 'SMK',
    name: 'Samarkand',
    category: 'Asia',
    subtitle: 'Silk Road crossroads · Zeravshan valley',
    about:
      'Samarkand is a Central Asian crossroads city where oasis agriculture and long-distance trade made a capital of corridors. Under Timur and his successors it became a showcase of tiled madrasas, mosques, and mausoleums that still dominate the skyline. Orientation is caravan and courtyard: the Registan as an urban room of learning and display; necropolises and congregational mosques marking routes through the living city. The Zeravshan valley and steppe approaches explain why armies and merchants kept returning. This primer stays with Silk Road geography, Timurid urbanism, and oasis capital form rather than a conquest checklist alone.',
    facts: {
      kind: 'Silk Road crossroads',
      country: 'Uzbekistan',
      region: 'Zeravshan valley · Central Asia',
      founded: 'Ancient Sogdian center; Timurid capital florescence in the late 14th–15th centuries',
      capitalRole: 'Historic Timurid capital; major Uzbek cultural city',
      corridors: 'Silk Road caravan routes; Zeravshan River oasis; links toward Persia, China, and the steppe',
      exploreLinks: ['Uzbekistan'],
    },
    features: [
      {
        name: 'Registan',
        description:
          'The great public square framed by three madrasas — Samarkand’s classic room of tile, learning, and imperial display.',
      },
      {
        name: 'Bibi-Khanym Mosque',
        description:
          'Timur’s monumental congregational mosque — a vast iwan-and-dome complex meant to impress arriving caravans.',
      },
      {
        name: 'Shah-i-Zinda',
        description:
          'A processional avenue of mausoleums — a sacred necropolis corridor of Timurid tilework and pilgrimage.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Samarkand',
        url: 'https://www.britannica.com/place/Samarkand-Uzbekistan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Samarkand – Crossroad of Cultures',
        url: 'https://whc.unesco.org/en/list/603',
        kind: 'catalog',
      },
      {
        label: 'Metropolitan Museum — The Art of the Timurid Period',
        url: 'https://www.metmuseum.org/toah/hd/timu/hd_timu.htm',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tokyo',
    code: 'TYO',
    name: 'Tokyo',
    category: 'Asia',
    subtitle: 'Bay megacity · former Edo',
    about:
      'Tokyo is a bay megacity that grew from the shogunal capital of Edo into Japan’s political and economic center. Orientation is lowland and water: Sumida and bay edges, temple towns such as Asakusa, shrine forests like Meiji, and a skyline of towers that mark postwar rebuilding. The city’s density stacks neighborhoods that still keep shrine, market, and station as local anchors. Earthquake, fire, and war remade fabric without erasing the Edo street logic underneath. This primer stays with bay geography, sacred-commercial nodes, and capital scale rather than every ward’s specialty.',
    facts: {
      kind: 'Bay megacity',
      country: 'Japan',
      region: 'Kantō plain · Tokyo Bay',
      founded: 'Edo castle town expanding from the 17th century; renamed Tokyo as imperial capital in 1868',
      capitalRole: 'Capital of Japan',
      corridors: 'Tokyo Bay; Sumida River; historic Tōkaidō and national rail/metro networks',
      exploreLinks: ['Japan'],
    },
    features: [
      {
        name: 'Sensō-ji',
        description:
          'Asakusa’s ancient temple gate and hall — a still-working pilgrimage and market node in the old downtown.',
      },
      {
        name: 'Tokyo Skytree',
        description:
          'The modern broadcast tower above Sumida — a vertical marker of the bay city’s contemporary skyline.',
      },
      {
        name: 'Meiji Shrine',
        description:
          'The forest shrine dedicated to Emperor Meiji — a sacred green room carved into the dense capital.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Tokyo',
        url: 'https://www.britannica.com/place/Tokyo',
        kind: 'reference',
      },
      {
        label: 'Tokyo Metropolitan Government — About Tokyo',
        url: 'https://www.metro.tokyo.lg.jp/english/',
        kind: 'agency',
      },
      {
        label: 'Meiji Jingu — Shrine overview',
        url: 'https://www.meijijingu.or.jp/en/',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'cairo',
    code: 'CAI',
    name: 'Cairo',
    category: 'Africa & Americas',
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
    slug: 'timbuktu',
    code: 'TIM',
    name: 'Timbuktu',
    category: 'Africa & Americas',
    subtitle: 'Sahara edge · Niger Bend routes',
    about:
      'Timbuktu is a Sahara-edge city that turned caravan geography into scholarly reputation. Sitting near the Niger Bend, it linked desert salt and gold routes to riverine West Africa and became famous for mosques, madrasas, and manuscript libraries. Orientation is adobe and corridor: earthen minarets above sandy streets; markets that once priced books beside trade goods; seasonal rhythms of river and desert. Empires and droughts shifted its fortunes, yet the city’s three great mosques still sketch the medieval scholarly skyline. This primer stays with desert-edge routes, learning institutions, and earthen architecture rather than myth alone.',
    facts: {
      kind: 'Desert-edge scholarly city',
      country: 'Mali',
      region: 'Niger Bend · southern Sahara margin',
      founded: 'Medieval trading settlement rising with trans-Saharan routes (c. 12th–14th centuries)',
      capitalRole: 'Historic commercial and scholarly center; never Mali’s modern political capital',
      corridors: 'Trans-Saharan caravan routes; Niger River links; salt–gold–manuscript trade',
      exploreLinks: ['Mali'],
    },
    features: [
      {
        name: 'Djinguereber Mosque',
        description:
          'One of Timbuktu’s great Friday mosques — an earthen congregational landmark of the city’s medieval scholarly era.',
      },
      {
        name: 'Sankore Madrasah',
        description:
          'The learning complex associated with Timbuktu’s university tradition — adobe architecture tied to manuscript scholarship.',
      },
      {
        name: 'Sidi Yahya Mosque',
        description:
          'The third of the historic mosque triad — completing the sacred skyline that still orients the old city.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Timbuktu',
        url: 'https://www.britannica.com/place/Timbuktu-Mali',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Timbuktu',
        url: 'https://whc.unesco.org/en/list/119',
        kind: 'catalog',
      },
      {
        label: 'Library of Congress — Timbuktu manuscripts overview',
        url: 'https://www.loc.gov/collections/timbuktu/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'cusco',
    code: 'CUS',
    name: 'Cusco',
    category: 'Africa & Americas',
    subtitle: 'Andean capital · Urubamba approaches',
    about:
      'Cusco was the political and ceremonial capital of the Inca world — a highland city whose stonework and sacred geography organized an empire of roads. Orientation is Andean and axial: a plaza core, temple precincts, and cyclopean walls that later Spanish churches and streets reused. The city sits where highland valleys open toward the Amazon approaches and the coastal world via the Qhapaq Ñan road system. Colonial overlays did not erase the Inca plan so much as build on it. This primer stays with highland capital form, plaza ritual, and road empire rather than a trek checklist to Machu Picchu alone.',
    facts: {
      kind: 'Andean imperial capital',
      country: 'Peru',
      region: 'Andean highlands · southern Peru',
      founded: 'Inca capital florescence from the 13th–16th centuries on older settlement',
      capitalRole: 'Historic Inca capital; major Peruvian regional city',
      corridors: 'Qhapaq Ñan road system; Urubamba / Sacred Valley approaches',
      exploreLinks: ['Peru'],
    },
    features: [
      {
        name: 'Plaza de Armas',
        description:
          'The colonial main square over the Inca civic core — cathedral façades facing the highland capital’s central room.',
      },
      {
        name: 'Sacsayhuamán',
        description:
          'The cyclopean hill fortress and ceremonial complex above the city — megalithic walls that still define Cusco’s defensive silhouette.',
      },
      {
        name: 'Qorikancha',
        description:
          'The Inca Temple of the Sun, later wrapped by a Dominican convent — sacred stonework beneath colonial architecture.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Cuzco',
        url: 'https://www.britannica.com/place/Cuzco',
        kind: 'reference',
      },
      {
        label: 'UNESCO — City of Cuzco',
        url: 'https://whc.unesco.org/en/list/273',
        kind: 'catalog',
      },
      {
        label: 'UNESCO — Qhapaq Ñan, Andean Road System',
        url: 'https://whc.unesco.org/en/list/1459',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mexico-city',
    code: 'MEX',
    name: 'Mexico City',
    category: 'Africa & Americas',
    subtitle: 'Highland basin · former Tenochtitlan',
    about:
      'Mexico City occupies a highland basin where the Aztec island capital of Tenochtitlan once rose from lake waters. Orientation is lacustrine memory and imperial overlay: the Zócalo and cathedral over the sacred precinct; Templo Mayor ruins beside colonial streets; and boulevards of a modern megacity that still sits on soft lakebed ground. Spanish conquest remade the plan without fully erasing the island city’s ceremonial core. Seismic risk and altitude shape daily life as much as museums and ministries. This primer stays with basin geography, Mesoamerican capital form, and colonial-modern layering rather than every neighborhood’s mural.',
    facts: {
      kind: 'Highland basin capital',
      country: 'Mexico',
      region: 'Valley of Mexico · central highlands',
      founded: 'Aztec Tenochtitlan 1325; Spanish Mexico City from 1521 on the same island core',
      capitalRole: 'Capital of Mexico',
      corridors: 'Historic lake causeways; highland routes toward coasts and the Bajío',
      exploreLinks: ['Mexico'],
    },
    features: [
      {
        name: 'Zócalo',
        description:
          'The vast main square with the Metropolitan Cathedral — civic and sacred center over the former island capital.',
      },
      {
        name: 'Templo Mayor',
        description:
          'The excavated Aztec twin temple beside the cathedral — the sacred precinct of Tenochtitlan returned to view.',
      },
      {
        name: 'Palacio de Bellas Artes',
        description:
          'The marble palace of fine arts on the Alameda edge — a twentieth-century cultural landmark of the capital.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mexico City',
        url: 'https://www.britannica.com/place/Mexico-City',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Mexico City',
        url: 'https://whc.unesco.org/en/list/412',
        kind: 'catalog',
      },
      {
        label: 'INAH — Templo Mayor',
        url: 'https://www.templomayor.inah.gob.mx/',
        kind: 'agency',
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
