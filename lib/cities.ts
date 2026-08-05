/** Cities topic — factual about records for capitals and route cities. */

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
  /** Neutral factual overview, ~150–250 words. */
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
 * Asia, and Africa & Americas (twenty-six cities). Expand here as new Cities
 * pages ship.
 */
const citySubjectDrafts: CitySubjectDraft[] = [
  {
    slug: 'istanbul',
    code: 'IST',
    name: 'Istanbul',
    category: 'Mediterranean & Europe',
    subtitle: 'Strait capital · Bosphorus',
    about:
      'Istanbul occupies both sides of the Bosphorus, the strait linking the Black Sea and the Sea of Marmara and separating Europe from Asia. Known successively as Byzantium, Constantinople, and Istanbul, it served as the capital of the Roman, Byzantine, and Ottoman empires. The Golden Horn forms a major natural harbor beside the historic peninsula, whose walls, ports, domes, and former imperial sites reflect these successive periods.\nTrade, migration, pilgrimage, and military routes converged at the Bosphorus long before the arrival of railways. Ferries, bridges, and waterfront fortifications continue to shape movement between the city’s European and Asian districts. Its neighborhoods contain Greek, Roman, Byzantine, Ottoman, and republican-era structures and institutions, while the strait remains central to the city’s daily life and geography.',
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
      'Rome is Italy’s capital, built around a historic Tiber crossing and the city’s seven hills. It grew from an early settlement into the administrative center of a Mediterranean empire, later became the seat of the papacy, and remains the national capital of modern Italy. Classical forums and amphitheaters stand alongside Renaissance and Baroque streets, many incorporating reused stone and earlier structures. The Tiber runs through the dense urban fabric, while the ancient road network once centered on the milliarium aureum has been supplemented by rail lines and ring roads serving the wider metropolitan area.',
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
      'Paris is a river capital shaped by the Seine, its islands, bridges, and embankments. From a medieval island nucleus, the city expanded across the surrounding basin through successive royal, revolutionary, and republican periods. Its structure reflects both the river and major urban axes, with contrasts between the right and left banks and later boulevards created as part of large-scale political and civic redesign.\nMuseums, markets, and government ministries remain concentrated along corridors that once carried grain, pilgrims, and other traffic. The Seine continues to organize the city’s physical layout and public spaces, while the islands, embankments, and boulevard network record Paris’s development as a national capital.',
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
      'Venice is a city in the Venetian Lagoon, built on islands supported by piles and shaped by waterways rather than a conventional street grid. The Grand Canal serves as its principal waterway, while campi function as neighborhood public spaces and Piazza San Marco forms the historic ceremonial center of the city.\nFrom the Middle Ages, Venice developed as a maritime republic whose merchants connected the eastern Mediterranean with Alpine and northern European markets. Trade, shipbuilding, and diplomacy were central urban activities, supported by the lagoon’s protected routes and access to the Adriatic. Its physical layout and public architecture reflect both the practical demands of waterborne life and the political display of the former republic.',
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
      'London grew where the River Thames could be bridged and where Atlantic and continental trade met an island state. Its historic core includes the City of London, a financial centre; Westminster, the parliamentary riverfront; and docklands that once helped make the Thames estuary a global warehouse. Roman Londinium, medieval markets, and imperial shipping shaped a dense concentration of political and economic activity.\nThe Thames remains London’s structural spine, although railways and the Underground carry much of the daily commute. Its banks and crossings connect civic landmarks, financial districts, former port areas, and the wider metropolitan region.',
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
      'Athens is the capital of Greece, built across the Attic plain beneath the Acropolis, whose rocky citadel remains a defining feature of the city skyline. In antiquity, the Acropolis held major temples, while the Agora below it served as a central civic and commercial space. Ancient theaters, stoas, sanctuaries, and other archaeological sites extend across the surrounding slopes and urban fabric.\nThe modern city developed over and around this earlier landscape. Marble monuments, Mediterranean light, and the remains of city-state institutions are closely associated with Athens’s classical past, while its role as the Greek capital connects that past to the contemporary state.',
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
      'Jerusalem is a highland city on a compact ridge between the Mediterranean and the Jordan Valley, where sites sacred to Judaism, Christianity, and Islam stand close together. Its Old City contains quarters, markets, and gates within historic walls. Major religious sites include the Western Wall and the Temple Mount/Haram al-Sharif platform, as well as the Church of the Holy Sepulchre in the Christian Quarter.\nPolitical capitals and successive empires have claimed Jerusalem for millennia, while the city has remained a major destination of worship. Its religious and urban geography is shaped by the Old City’s quarters and by the concentration of sacred sites on and around the ridge.',
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
      'Kyoto was Japan’s imperial capital for more than a millennium. Set in a basin and laid out on a grid adapted from continental urban models, it developed as a rectangular city framed by mountains, with temples, shrines, craft quarters, rivers, and roads forming much of its physical and social structure. Routes linked the capital with the Tōkaidō and inland regions, while temple and shrine precincts became important neighborhood landmarks.\nAfter the imperial court and national government moved elsewhere, Kyoto remained a major cultural center. Pilgrimage paths, seasonal festivals, religious sites, and long-established workshops continue to shape its association with Japanese traditions. Modern traffic and tourism now use many of the same corridors that long connected the basin city to surrounding regions.',
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
      'Beijing is an imperial capital on the North China Plain whose axes, walls, and palace compounds translated cosmological order into street geometry. Ming and Qing rulers centered authority in the Forbidden City, while temples, altars, and processional routes extended ritual order through the surrounding grid. North–south ceremonial alignments and courtyard compounds shaped the old city, later joined by rail lines and successive ring roads as the metropolis expanded around its historic core. Nearby imperial gardens and surviving wall corridors reflect the role of landscape in both capital defense and leisure.',
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
      'Delhi is a capital region on the Yamuna’s western plain, shaped by successive cities that occupied the same strategic ground. Sultanate and Mughal forts and Friday mosques stand alongside the planned avenues of New Delhi, reflecting repeated shifts in political power and urban form. The Yamuna and the Delhi Ridge frame the settlement, although modern highways often cut across these older geographic patterns. Trade routes, pilgrimage circuits, and imperial roads have long carried people through Delhi, a threshold between the Indus–Gangetic plain and the Indian peninsula.',
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
      'Samarkand is a Central Asian city in the Zeravshan valley, shaped by oasis agriculture and long-distance trade across the steppe approaches. Its position on major routes helped make it a recurring center for merchants, armies, and imperial capitals.\nUnder Timur and his successors, Samarkand was rebuilt as a Timurid capital marked by tiled madrasas, mosques, and mausoleums that remain prominent in the city’s skyline. The Registan forms a major urban ensemble of learning and ceremonial display, while necropolises and congregational mosques trace routes through the inhabited city. Its historic form reflects Silk Road geography, Timurid urbanism, and the functions of an oasis capital.',
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
      'Tokyo is a bay megacity that grew from the shogunal capital of Edo into Japan’s political and economic center. Its physical setting is defined by lowland, the Sumida River, and the edges of Tokyo Bay, with temple towns such as Asakusa, shrine forests such as Meiji, and a skyline of towers associated with postwar rebuilding. Dense neighborhoods retain shrines, markets, and railway stations as local anchors. Earthquakes, fires, and war repeatedly remade the urban fabric without entirely erasing underlying Edo street patterns.',
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
    slug: 'seoul',
    code: 'SEL',
    name: 'Seoul',
    category: 'Asia',
    subtitle: 'Han River capital · Joseon seat',
    about:
      'Seoul, South Korea’s capital, lies along the Han River and grew from a walled Joseon dynasty seat into one of East Asia’s densest metropolitan regions. Palaces and shrines occupy lower slopes beneath surrounding ridges, while hanok quarters climb narrow lanes and modern towers define a skyline rebuilt after the Korean War. The city retains the older capital’s north–south spatial logic despite rapid postwar expansion.\nDynastic history, Japanese occupation, and rapid industrial growth are layered across neighborhoods where palace walls, markets, and mountain parks remain prominent features. Buddhist temples, Confucian ritual sites, and contemporary design districts stand along corridors that once carried royal processions and now carry subway lines.',
    facts: {
      kind: 'Han River capital',
      country: 'South Korea',
      region: 'Han River basin · northwestern Korean Peninsula',
      founded: 'Joseon dynasty capital from 1394; modern Seoul grew across the river and surrounding basins',
      capitalRole: 'Capital of South Korea',
      corridors: 'Han River; historic Gyeongbu corridor; national rail and expressway networks',
      exploreLinks: ['Korea, South'],
    },
    features: [
      {
        name: 'Gyeongbokgung',
        description:
          'The main Joseon palace compound — throne halls, gates, and courtyards that still stage the capital’s royal geography.',
      },
      {
        name: 'N Seoul Tower',
        description:
          'The broadcast tower on Namsan — a modern vertical marker above the historic downtown and river plain.',
      },
      {
        name: 'Bukchon Hanok Village',
        description:
          'A preserved hanok quarter on palace-adjacent slopes — tiled lanes that keep Joseon residential scale in the modern city.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Seoul',
        url: 'https://www.britannica.com/place/Seoul',
        kind: 'reference',
      },
      {
        label: 'Cultural Heritage Administration — Gyeongbokgung Palace',
        url: 'https://www.heritage.go.kr/eng/heri/heritage/royalPalace.do',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Changdeokgung Palace Complex',
        url: 'https://whc.unesco.org/en/list/816',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'bangkok',
    code: 'BKK',
    name: 'Bangkok',
    category: 'Asia',
    subtitle: 'River capital · Chao Phraya plain',
    about:
      'Bangkok, Thailand’s capital, stands on the Chao Phraya River in the delta plain and is the country’s political and commercial center. Canal networks, royal compounds, and market streets developed around the river and its khlongs. Wats with glittering prangs line the riverbanks, while palace walls enclose sacred and administrative courts. Chinatown and older districts concentrate commerce beside canals, beneath and alongside elevated expressways.\nThe city includes nineteenth-century treaty-port architecture, twentieth-century modernization, and the scale of a contemporary megacity. The Chao Phraya remains its ceremonial spine, serving ferry piers, floating markets, temple fairs, and daily river traffic.',
    facts: {
      kind: 'River capital',
      country: 'Thailand',
      region: 'Chao Phraya River delta · central Thailand',
      founded: 'Capital moved to Bangkok after Ayutthaya’s fall; Rattanakosin foundation from 1782',
      capitalRole: 'Capital of Thailand',
      corridors: 'Chao Phraya River; Gulf of Thailand approaches; national rail and highway hub',
      exploreLinks: ['Thailand'],
    },
    features: [
      {
        name: 'Wat Arun',
        description:
          'The Temple of Dawn on the river’s Thonburi bank — a prang-studded landmark that catches morning light above the water.',
      },
      {
        name: 'Grand Palace',
        description:
          'The walled royal and temple precinct on Rattanakosin Island — throne halls and sacred courts at the heart of the capital.',
      },
      {
        name: 'Wat Pho',
        description:
          'The temple of the Reclining Buddha south of the palace — a major monastic complex and traditional learning center.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Bangkok',
        url: 'https://www.britannica.com/place/Bangkok',
        kind: 'reference',
      },
      {
        label: 'Tourism Authority of Thailand — Bangkok',
        url: 'https://www.tourismthailand.org/Destinations/Provinces/Bangkok',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Historic City of Ayutthaya',
        url: 'https://whc.unesco.org/en/list/576',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'singapore',
    code: 'SIN',
    name: 'Singapore',
    category: 'Asia',
    subtitle: 'Island city-state · Straits port',
    about:
      'Singapore is an island city-state at the Strait of Malacca, where a strategic harbor developed into a dense, multilingual capital. Its coastline combines colonial-era quays, container terminals, and extensive reclaimed land. Ethnic quarters reflect historic migration routes, while gardens and reservoirs occupy limited space among high-rise districts on the tropical island.\nIndependent since 1965, Singapore functions as both a nation and a metropolis. Public housing estates, commercial districts, and heritage shophouse rows stand along a compact shoreline. Heat, monsoon rainfall, and maritime trade have influenced its architecture and urban form, alongside long-term planning. The city’s landscape includes straits-facing port infrastructure, reclaimed waterfronts, and prominent garden-city landmarks.',
    facts: {
      kind: 'Island city-state',
      country: 'Singapore',
      region: 'Strait of Malacca · southern Malay Peninsula',
      founded: 'Modern port settlement from the nineteenth century; independent republic from 1965',
      capitalRole: 'Capital and nation-state of Singapore',
      corridors: 'Strait of Malacca shipping lanes; Johor Strait; regional air and sea hub',
      exploreLinks: ['Singapore'],
    },
    features: [
      {
        name: 'Marina Bay Sands',
        description:
          'The integrated resort on reclaimed Marina Bay — a skyline terrace and waterfront landmark of contemporary Singapore.',
      },
      {
        name: 'Merlion',
        description:
          'The lion-fish fountain at the downtown waterfront — a civic symbol of harbor city and nation.',
      },
      {
        name: 'Gardens by the Bay',
        description:
          'The bay-side garden park with cooled conservatories and supertrees — engineered nature on reclaimed shore.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Singapore',
        url: 'https://www.britannica.com/place/Singapore',
        kind: 'reference',
      },
      {
        label: 'Singapore Tourism Board — About Singapore',
        url: 'https://www.visitsingapore.com/',
        kind: 'agency',
      },
      {
        label: 'National Parks Board — Gardens by the Bay',
        url: 'https://www.nparks.gov.sg/gardensbythebay',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mumbai',
    code: 'BOM',
    name: 'Mumbai',
    category: 'Asia',
    subtitle: 'Bay port megacity · Arabian Sea coast',
    about:
      'Mumbai is a bay port megacity on India’s Arabian Sea coast. Its harbor absorbed fishing villages, colonial fort towns, and textile-mill suburbs into one of the world’s most populous urban regions. The city occupies a peninsula and a chain of former islands linked by causeways and bridges, with rail corridors connecting Victorian Gothic stations, seaside promenades, dense bazaar streets, former mill districts, and suburban neighborhoods.\nMonsoon rain, tidal flats, and limited land have encouraged dense vertical growth, while the port remains a major edge of global shipping. Former mill lands now contain finance, commercial development, and film production. Bollywood, banking, and neighborhood temples occupy corridors that once carried cotton and passengers between the harbor city and its hinterland. Colonial port architecture and seaside boulevards remain prominent parts of Mumbai’s physical landscape.',
    facts: {
      kind: 'Bay port megacity',
      country: 'India',
      region: 'Konkan coast · Mumbai harbour · Arabian Sea',
      founded: 'Colonial port and fort settlement from the seventeenth century; modern megacity growth through the twentieth century',
      capitalRole: 'Capital of Maharashtra; major national financial and media center',
      corridors: 'Arabian Sea harbor; Western Railway; historic trade links to Gujarat and the Deccan',
      exploreLinks: ['India'],
    },
    features: [
      {
        name: 'Gateway of India',
        description:
          'The ceremonial arch on Apollo Bunder — a harbor-facing monument that greeted arriving ships to the colonial port.',
      },
      {
        name: 'Chhatrapati Shivaji Terminus',
        description:
          'The Victorian Gothic rail terminus — a UNESCO-listed station that still anchors Mumbai’s suburban and long-distance trains.',
      },
      {
        name: 'Marine Drive',
        description:
          'The curved seaside boulevard along Back Bay — Art Deco apartments and evening promenade above the Arabian Sea.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mumbai',
        url: 'https://www.britannica.com/place/Mumbai',
        kind: 'reference',
      },
      {
        label: 'Mumbai Port Authority — Port overview',
        url: 'https://mumbaiport.gov.in/',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Chhatrapati Shivaji Terminus',
        url: 'https://whc.unesco.org/en/list/945',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'shanghai',
    code: 'SHA',
    name: 'Shanghai',
    category: 'Asia',
    subtitle: 'Yangtze river port · treaty-era hub',
    about:
      'Shanghai is a Yangtze River port and China’s largest metropolis, shaped by estuary geography and the Huangpu River waterfront. Treaty-era bank buildings on the Bund face Pudong’s high-rise skyline, while lilong lane housing, gardens, and temples occupy older districts behind the riverfront. Rail corridors and container ports connect the city with the Yangtze basin and international trade routes.\nRepublican-era commercial districts, industrial areas, and reform-era financial development remain visible in distinct parts of the city. The Bund, Pudong towers, classical garden areas, and former concession neighborhoods show how Shanghai’s port economy and successive periods of urban growth formed its present landscape.',
    facts: {
      kind: 'River port megacity',
      country: 'China',
      region: 'Yangtze River delta · Huangpu River estuary',
      founded: 'Historic trading town; treaty-port and industrial expansion from the nineteenth century onward',
      capitalRole: 'Municipality directly under the central government; major financial and port center',
      corridors: 'Yangtze River; Huangpu River; East China Sea approaches; national rail and metro networks',
      exploreLinks: ['China'],
    },
    features: [
      {
        name: 'Oriental Pearl Tower',
        description:
          'The Pudong broadcast tower — a 1990s skyline marker that faces the historic Bund across the Huangpu.',
      },
      {
        name: 'The Bund',
        description:
          'The riverside promenade of colonial banks and customs houses — Shanghai’s classic waterfront room facing Pudong.',
      },
      {
        name: 'Yu Garden',
        description:
          'The Ming-era classical garden in the old city — rockeries, pavilions, and market lanes beside the modern core.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Shanghai',
        url: 'https://www.britannica.com/place/Shanghai',
        kind: 'reference',
      },
      {
        label: 'Shanghai Municipal Government — About Shanghai',
        url: 'https://www.shanghai.gov.cn/english/',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Classical Gardens of Suzhou',
        url: 'https://whc.unesco.org/en/list/813',
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
      'Cairo is the capital of Egypt and a dense metropolis in the Nile’s lower valley, where the river, the desert edge, and long-distance routes have concentrated population and political power. Fatimid foundations, Mamluk streets, Ottoman-era districts, and modern expansion form a layered urban landscape and one of Africa’s largest cities. The Citadel overlooks the urban plain, while Khan el-Khalili remains a major commercial area in the historic core. The Nile is the city’s main geographical axis despite extensive roads and concrete development. The pyramids at Giza, nearby on the western edge of Greater Cairo, place the modern capital within a much older corridor of Egyptian state formation.',
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
      'Timbuktu is a city on the edge of the Sahara near the Niger Bend in Mali. It historically linked trans-Saharan salt and gold routes with riverine West Africa, gaining renown as a center of trade, Islamic learning, mosques, madrasas, and manuscript libraries. Its built landscape includes sandy streets, earthen buildings, and adobe minarets.\nThe city’s markets once traded books alongside other goods, reflecting its role in scholarship as well as commerce. Changes in empires, trade patterns, drought, and river conditions altered its fortunes over time. Timbuktu’s three principal mosques remain major examples of its medieval earthen architecture and scholarly history.',
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
      'Cusco was the political and ceremonial capital of the Inca world, a highland city whose stonework and sacred geography helped organize an empire of roads. Its urban core centered on plazas, temple precincts, and massive fitted-stone walls. After the Spanish conquest, churches, houses, and streets were built over and alongside Inca structures, leaving much of the earlier plan visible within the colonial city.\nThe city stands where highland valleys open toward the Amazon approaches and connect with the coastal world through the Qhapaq Ñan road system. Its historic form reflects its role as an Andean capital, with plaza ritual, sacred sites, and road connections shaping the city beyond its association with Machu Picchu.',
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
      'Mexico City occupies a highland basin on the former lake system where the Aztec island capital of Tenochtitlan was built. Its historic center includes the Zócalo and Metropolitan Cathedral above the former sacred precinct, while the ruins of the Templo Mayor stand beside colonial-era streets. Spanish conquest reshaped the city’s plan but did not entirely erase the ceremonial core of the island capital.\nThe modern metropolis extends far beyond this central area, with broad boulevards, museums, government ministries, and dense urban development built partly on soft former lakebed. Basin geography, high altitude, and seismic risk remain significant features of city life and urban infrastructure.',
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
  {
    slug: 'marrakech',
    code: 'MRK',
    name: 'Marrakech',
    category: 'Africa & Americas',
    subtitle: 'Atlas foothill · medina routes',
    about:
      'Marrakech is a red-walled city on Morocco’s Haouz plain, near the foothills of the Atlas Mountains and along historic Maghreb trade routes. Founded as an Almoravid capital, it developed a medina of souks, mosques, palaces, gardens, and riads centered on Jemaa el-Fnaa, a square associated with evening trade, food stalls, and performances.\nThe Koutoubia Mosque’s minaret marks the city skyline. Within the medina, narrow lanes contain workshops and markets for leather, metalwork, spices, and other goods, while gardens and inward-facing riads provide shade behind largely blank exterior walls. Marrakech was not the political capital of every Moroccan dynasty, but it has long remained an important commercial and cultural center in southern Morocco.',
    facts: {
      kind: 'Medina market city',
      country: 'Morocco',
      region: 'Haouz plain · High Atlas foothills',
      founded: 'Almoravid foundation c. 1070; continuous medina life thereafter',
      capitalRole: 'Historic dynastic capital; major Moroccan regional city (Rabat is the political capital)',
      corridors: 'Atlas passes; Atlantic approaches; trans-Saharan / Maghreb caravan links',
      exploreLinks: ['Morocco'],
    },
    features: [
      {
        name: 'Koutoubia Mosque',
        description:
          'The Almohad minaret that still orients Marrakech’s skyline — a brick landmark of the medina’s congregational core.',
      },
      {
        name: 'Jemaa el-Fnaa',
        description:
          'The great open square of storytellers, stalls, and evening crowds — the social stage of the old city.',
      },
      {
        name: 'Bahia Palace',
        description:
          'A nineteenth-century palace of courtyards and carved cedar — elite domestic architecture inside the medina fabric.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Marrakech',
        url: 'https://www.britannica.com/place/Marrakech',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Medina of Marrakesh',
        url: 'https://whc.unesco.org/en/list/331',
        kind: 'catalog',
      },
      {
        label: 'UNESCO — Cultural space of Jemaa el-Fna Square',
        url: 'https://ich.unesco.org/en/RL/cultural-space-of-jemaa-el-fna-square-00014',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'lagos',
    code: 'LAG',
    name: 'Lagos',
    category: 'Africa & Americas',
    subtitle: 'Lagoon megacity · Gulf of Guinea',
    about:
      'Lagos is a lagoon and Atlantic megacity in Nigeria, spread across islands, mainland districts, bridges, and dense waterfront areas. Yoruba settlements were later shaped by Portuguese and British port activity, and the city continues to receive migrants and trade from across West Africa. Lagoon creeks, major bridge corridors including the Third Mainland Bridge, older markets, and newer high-rise districts define much of its physical landscape.\nAlthough Nigeria’s political capital moved to Abuja, Lagos remains the country’s main port, commercial center, and a major center for media. Its economy and urban growth are closely tied to maritime trade, the lagoon system, and extensive connections between the mainland and island districts.',
    facts: {
      kind: 'Lagoon port megacity',
      country: 'Nigeria',
      region: 'Lagos Lagoon · Gulf of Guinea coast',
      founded: 'Island and mainland settlements with Portuguese contact from the 15th century; colonial port expansion',
      capitalRole: 'Former federal capital; Nigeria’s largest city and commercial capital (Abuja is the political capital)',
      corridors: 'Lagoon creeks; Third Mainland and other bridges; Gulf of Guinea shipping',
      exploreLinks: ['Nigeria'],
    },
    features: [
      {
        name: 'Lagos skyline',
        description:
          'Towers and waterfront districts along the lagoon — the vertical face of Nigeria’s commercial capital.',
      },
      {
        name: 'National Arts Theatre',
        description:
          'The futurist cultural landmark at Iganmu — a late-twentieth-century emblem of national performance and gathering.',
      },
      {
        name: 'Third Mainland Bridge',
        description:
          'The long lagoon crossing that stitches mainland districts to the island core — infrastructure as urban geography.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Lagos',
        url: 'https://www.britannica.com/place/Lagos-Nigeria',
        kind: 'reference',
      },
      {
        label: 'Encyclopaedia Britannica — Lagos Lagoon',
        url: 'https://www.britannica.com/place/Lagos-Lagoon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'buenos-aires',
    code: 'BUE',
    name: 'Buenos Aires',
    category: 'Africa & Americas',
    subtitle: 'River-plate capital · Pampas edge',
    about:
      'Buenos Aires is Argentina’s capital and principal port city, on the western shore of the Río de la Plata. Its grid of avenues, immigrant barrios, and dense cultural life developed where Pampas agriculture connected with Atlantic shipping. Plaza de Mayo and the Casa Rosada form the city’s main political setting, while the Obelisco marks a central modern axis. Theaters, cafés, and publishing helped establish Buenos Aires as a major Spanish-language cultural center. The estuary’s brown water and flat horizon influence the city’s light, landscape, and civic identity.',
    facts: {
      kind: 'River-plate capital',
      country: 'Argentina',
      region: 'Río de la Plata · Pampas edge',
      founded: 'Spanish foundations 1536 and 1580; continuous capital growth thereafter',
      capitalRole: 'Capital of Argentina',
      corridors: 'Río de la Plata estuary; Atlantic shipping; Pampas rail and road approaches',
      exploreLinks: ['Argentina'],
    },
    features: [
      {
        name: 'Casa Rosada',
        description:
          'The pink presidential palace on Plaza de Mayo — the civic face of Argentine public life.',
      },
      {
        name: 'Obelisco',
        description:
          'The white needle at Avenida 9 de Julio — a twentieth-century axis marker of the modern capital.',
      },
      {
        name: 'Teatro Colón',
        description:
          'The great opera house — an acoustic and architectural landmark of Buenos Aires as a cultural capital.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Buenos Aires',
        url: 'https://www.britannica.com/place/Buenos-Aires',
        kind: 'reference',
      },
      {
        label: 'Encyclopaedia Britannica — Casa Rosada',
        url: 'https://www.britannica.com/topic/Casa-Rosada',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rio-de-janeiro',
    code: 'RIO',
    name: 'Rio de Janeiro',
    category: 'Africa & Americas',
    subtitle: 'Bay capital · Atlantic Forest slopes',
    about:
      'Rio de Janeiro occupies a broken shoreline where granite peaks, Atlantic Forest remnants, and Guanabara Bay meet a dense coastal city. Formerly Brazil’s capital, it remains a major cultural and tourist symbol of the country’s Atlantic coast. Sugarloaf and Corcovado rise above beaches and neighborhoods built on narrow shelves of level land, while the Christ the Redeemer statue overlooks the meeting of mountain, city, and ocean. Colonial and imperial districts lie beneath layers of twentieth-century growth, alongside the bay’s working harbor, forested slopes, and prominent skyline landmarks.',
    facts: {
      kind: 'Bay coastal metropolis',
      country: 'Brazil',
      region: 'Guanabara Bay · southeastern Atlantic coast',
      founded: 'Portuguese foundation 1565; imperial and republican capital until 1960',
      capitalRole: 'Former national capital; major Brazilian metropolis (Brasília is the political capital)',
      corridors: 'Guanabara Bay harbor; coastal routes; Atlantic Forest mountain passes',
      exploreLinks: ['Brazil'],
    },
    features: [
      {
        name: 'Christ the Redeemer',
        description:
          'The Art Deco statue on Corcovado — Rio’s skyline emblem above bay, forest, and city.',
      },
      {
        name: 'Sugarloaf Mountain',
        description:
          'The granite dome at the bay mouth — a cable-car landmark of Rio’s coastal topography.',
      },
      {
        name: 'Guanabara Bay shoreline',
        description:
          'The working harbor and curved waterfront where mountains press close to the Atlantic city.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Rio de Janeiro',
        url: 'https://www.britannica.com/place/Rio-de-Janeiro-Brazil',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Rio de Janeiro: Carioca Landscapes',
        url: 'https://whc.unesco.org/en/list/1100',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'bogota',
    code: 'BOG',
    name: 'Bogotá',
    category: 'Africa & Americas',
    subtitle: 'Andean plateau capital · Eastern Hills',
    about:
      'Bogotá is Colombia’s highland capital, located on the Bogotá savanna, a cool plateau bordered by the Eastern Hills and overlooked by the sanctuary peak of Monserrate. The city combines Muisca settlement history, Spanish colonial foundations, and republican-era government institutions around Plaza de Bolívar. Its twentieth-century expansion spread across the flat basin surrounding the historic center.\nThe historic core includes the cathedral, the Capitol, and major museums, and remains the center of national political life. Bogotá’s altitude contributes to thin air and frequent cloud cover along the ridges. Gold-working traditions and Andean trade routes form part of the region’s longer history.',
    facts: {
      kind: 'Andean plateau capital',
      country: 'Colombia',
      region: 'Bogotá savanna · Eastern Cordillera',
      founded: 'Spanish foundation 1538 on Muisca settlement patterns',
      capitalRole: 'Capital of Colombia',
      corridors: 'Highland plateau routes; Magdalena valley approaches; Eastern Hills passes',
      exploreLinks: ['Colombia'],
    },
    features: [
      {
        name: 'Monserrate',
        description:
          'The sanctuary mountain above the city — a pilgrimage ridge and viewpoint over the plateau capital.',
      },
      {
        name: 'Plaza de Bolívar',
        description:
          'The main civic square with cathedral and national buildings — Bogotá’s political and ceremonial room.',
      },
      {
        name: 'Primatial Cathedral',
        description:
          'The neoclassical cathedral on Plaza de Bolívar — the sacred façade of the historic highland core.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Bogotá',
        url: 'https://www.britannica.com/place/Bogota',
        kind: 'reference',
      },
      {
        label: 'Banco de la República — Museo del Oro',
        url: 'https://www.banrepcultural.org/bogota/museo-del-oro',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'lisbon',
    code: 'LIS',
    name: 'Lisbon',
    category: 'Mediterranean & Europe',
    subtitle: 'Atlantic port capital · Tagus estuary',
    about:
      'Lisbon is Portugal’s capital, set on hills above the Tagus estuary where the river widens before meeting the Atlantic. The city’s historic core climbs from waterfront squares and riverside warehouses toward ridge neighborhoods, with the Belém district marking the outer harbor approach associated with early modern voyages. Roman, Moorish, and medieval layers underlie a skyline reshaped after the 1755 earthquake, when the Baixa was rebuilt on a planned grid facing the river.\nMaritime trade and administration long concentrated along the Tagus, linking inland routes to Atlantic shipping. Palaces, monasteries, and defensive towers along the estuary record Lisbon’s role as a royal and imperial port, while ferries, bridges, and the waterfront continue to organize daily movement between the city and the south bank.',
    facts: {
      kind: 'Atlantic port capital',
      country: 'Portugal',
      region: 'Tagus estuary · western Iberian Atlantic coast',
      founded: 'Roman Olisipo; continuous urban life through Moorish, medieval, and early modern capitals',
      capitalRole: 'Capital of Portugal',
      corridors: 'Tagus estuary; Atlantic approaches; historic overland routes into central Portugal',
      exploreLinks: ['Portugal'],
    },
    features: [
      {
        name: 'Belém Tower',
        description:
          'The Manueline riverside fortress at the Tagus mouth — a defensive and ceremonial marker of Lisbon’s Age of Discoveries harbor.',
      },
      {
        name: 'Jerónimos Monastery',
        description:
          'The great limestone monastery at Belém — royal patronage carved into cloisters that once prayed for outgoing fleets.',
      },
      {
        name: 'Praça do Comércio',
        description:
          'The arcaded waterfront square of the rebuilt Baixa — Lisbon’s ceremonial room opening directly onto the Tagus.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Lisbon',
        url: 'https://www.britannica.com/place/Lisbon',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Monastery of the Hieronymites and Tower of Belém',
        url: 'https://whc.unesco.org/en/list/263',
        kind: 'catalog',
      },
      {
        label: 'Encyclopaedia Britannica — Portugal',
        url: 'https://www.britannica.com/place/Portugal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'vienna',
    code: 'VIE',
    name: 'Vienna',
    category: 'Mediterranean & Europe',
    subtitle: 'Imperial capital · Danube basin',
    about:
      'Vienna is Austria’s capital, a historic Danube-basin city where a fortified medieval core expanded into an imperial metropolis. Successive Habsburg residences, churches, and administrative quarters concentrated political and cultural life around the Innere Stadt, while later ring boulevards replaced the old walls with museums, parliament buildings, and apartment blocks. The Danube and its canal branches frame the city’s northern edge and long-distance corridors.\nAs the seat of a multinational empire and later of the Austrian republic, Vienna gathered courts, ministries, universities, and performance houses into a dense central district. Palace complexes such as the Hofburg and Schönbrunn, together with St. Stephen’s Cathedral, remain the most visible anchors of that imperial urban geography.',
    facts: {
      kind: 'Imperial capital',
      country: 'Austria',
      region: 'Danube basin · northeastern Austria',
      founded: 'Roman Vindobona; continuous urban life through medieval dukedom and Habsburg capital',
      capitalRole: 'Capital of Austria; historic capital of the Habsburg monarchy',
      corridors: 'Danube River; Alpine and Pannonian land routes; historic roads toward Bohemia and Hungary',
      exploreLinks: ['Austria'],
    },
    features: [
      {
        name: 'Schönbrunn Palace',
        description:
          'The Baroque imperial summer residence and gardens — Habsburg court life staged as a complete palace landscape.',
      },
      {
        name: "St. Stephen's Cathedral",
        description:
          'The Gothic cathedral on Stephansplatz — Vienna’s medieval spire and sacred center of the Innere Stadt.',
      },
      {
        name: 'Hofburg',
        description:
          'The vast imperial palace complex in the city center — winter seat of Habsburg power across centuries of accretion.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Vienna',
        url: 'https://www.britannica.com/place/Vienna',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Palace and Gardens of Schönbrunn',
        url: 'https://whc.unesco.org/en/list/786',
        kind: 'catalog',
      },
      {
        label: 'UNESCO — Historic Centre of Vienna',
        url: 'https://whc.unesco.org/en/list/1033',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'prague',
    code: 'PRG',
    name: 'Prague',
    category: 'Mediterranean & Europe',
    subtitle: 'Castle capital · Vltava bend',
    about:
      'Prague is the capital of Czechia, built on both banks of the Vltava where the river bends beneath a castle ridge. Medieval districts — Hradčany, the Lesser Town, the Old Town, and the New Town — form a compact historic center linked by stone bridges and towers. Gothic, Renaissance, and Baroque layers accumulate around market squares, synagogues, and palace courtyards that survived large-scale nineteenth-century clearance.\nThe castle complex above the river long concentrated royal and later presidential authority, while Charles Bridge and the Old Town Square organized pilgrimage, trade, and civic ceremony below. Prague’s setting on the Vltava made it a Central European crossroads between Bohemia, Moravia, and routes toward Germany and Austria.',
    facts: {
      kind: 'Castle capital',
      country: 'Czechia',
      region: 'Vltava basin · Bohemia',
      founded: 'Early medieval settlement; major royal city from the Přemyslid and Luxembourg eras',
      capitalRole: 'Capital of Czechia; historic capital of Bohemia and of Czechoslovakia',
      corridors: 'Vltava River; Bohemian land routes toward Germany, Austria, and Moravia',
      exploreLinks: ['Czechia'],
    },
    features: [
      {
        name: 'Charles Bridge',
        description:
          'The stone bridge of towers and statues across the Vltava — Prague’s classic pedestrian hinge between castle and Old Town.',
      },
      {
        name: 'Prague Castle',
        description:
          'The hilltop palace and cathedral complex above the river — a continuous seat of Bohemian and Czech authority.',
      },
      {
        name: 'Old Town Square',
        description:
          'The medieval market square with church façades and the astronomical clock — Prague’s civic room in the historic core.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Prague',
        url: 'https://www.britannica.com/place/Prague',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Prague',
        url: 'https://whc.unesco.org/en/list/616',
        kind: 'catalog',
      },
      {
        label: 'Encyclopaedia Britannica — Czech Republic',
        url: 'https://www.britannica.com/place/Czech-Republic',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'barcelona',
    code: 'BCN',
    name: 'Barcelona',
    category: 'Mediterranean & Europe',
    subtitle: 'Mediterranean port · Catalan coast',
    about:
      'Barcelona is a Mediterranean port city on Spain’s Catalan coast, where a Roman and medieval core meets a nineteenth-century expansion grid and a working harbor. Montjuïc and the Collserola ridges frame the coastal plain, while the Ramblas and adjoining Gothic streets lead from the waterfront into denser historic quarters. From the late nineteenth century, new avenues and apartment blocks absorbed industrial growth and a distinctive architectural culture.\nThe city’s modern identity is closely tied to Antoni Gaudí and related Catalan modernisme, whose churches, parks, and townhouses punctuate the Eixample and hillside neighborhoods. Port traffic, rail lines, and coastal roads continue to link Barcelona to the wider Mediterranean and to inland Catalonia.',
    facts: {
      kind: 'Mediterranean port',
      country: 'Spain',
      region: 'Catalan coast · northwestern Mediterranean',
      founded: 'Roman Barcino; continuous urban life through medieval county capital and industrial metropolis',
      capitalRole: 'Capital of Catalonia; major Spanish port metropolis (Madrid is the national capital)',
      corridors: 'Mediterranean harbor; coastal routes toward France and Valencia; inland corridors into Catalonia',
      exploreLinks: ['Spain'],
    },
    features: [
      {
        name: 'Sagrada Família',
        description:
          'Gaudí’s unfinished basilica of towers and sculpted façades — Barcelona’s most visible emblem of Catalan modernisme.',
      },
      {
        name: 'Park Güell',
        description:
          'The hillpark of mosaic benches and viaducts — a garden-city fragment overlooking the Mediterranean city.',
      },
      {
        name: 'Casa Batlló',
        description:
          'The bone-and-scale façade on Passeig de Gràcia — a domestic Gaudí landmark in the Eixample’s parade of townhouses.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Barcelona',
        url: 'https://www.britannica.com/place/Barcelona',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Works of Antoni Gaudí',
        url: 'https://whc.unesco.org/en/list/320',
        kind: 'catalog',
      },
      {
        label: 'Encyclopaedia Britannica — Antoni Gaudí',
        url: 'https://www.britannica.com/biography/Antoni-Gaudi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'moscow',
    code: 'MOW',
    name: 'Moscow',
    category: 'Mediterranean & Europe',
    subtitle: 'Kremlin capital · Moskva River',
    about:
      'Moscow is Russia’s capital, centered on the Kremlin fortress above the Moskva River and the adjoining ceremonial space of Red Square. From a medieval princely seat it grew into the political core of a continental state, later sharing imperial prominence with St. Petersburg before reclaiming capital status in the twentieth century. Radial avenues and ring roads spread from the historic fortress across a vast metropolitan region.\nChurches, palaces, walls, and later Soviet monuments concentrate around the river bend that still anchors the city’s symbolic geography. The Kremlin’s cathedrals and palaces, St. Basil’s Cathedral on Red Square, and the surrounding administrative quarter remain the most compact expression of Moscow’s role as a national and imperial capital.',
    facts: {
      kind: 'Kremlin capital',
      country: 'Russia',
      region: 'Moskva River · East European Plain',
      founded: 'First chronicle mention 1147; continuous urban life through Muscovite, imperial, and Soviet capitals',
      capitalRole: 'Capital of Russia; historic capital of Muscovy and of the Soviet Union',
      corridors: 'Moskva River; historic roads toward Vladimir, Novgorod, and the Volga; rail hubs of the European plain',
      exploreLinks: ['Russia'],
    },
    features: [
      {
        name: 'Red Square',
        description:
          'The ceremonial plaza beside the Kremlin walls — Russia’s most famous open stage for parade, market, and memory.',
      },
      {
        name: 'Moscow Kremlin',
        description:
          'The fortified riverside citadel of cathedrals and palaces — the enduring political and sacred core of the capital.',
      },
      {
        name: "St. Basil's Cathedral",
        description:
          'The multicolored tented church on Red Square — Ivan IV’s commemorative cathedral and Moscow’s fairy-tale silhouette.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Moscow',
        url: 'https://www.britannica.com/place/Moscow',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Kremlin and Red Square, Moscow',
        url: 'https://whc.unesco.org/en/list/545',
        kind: 'catalog',
      },
      {
        label: 'Encyclopaedia Britannica — Kremlin',
        url: 'https://www.britannica.com/topic/Kremlin',
        kind: 'reference',
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
