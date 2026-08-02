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
  /** Modern Explore countries that hold major remains (exact catalog names). */
  exploreLinks: string[]
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
  return {
    ...draft,
    photos: photos as [CivilizationPhoto, CivilizationPhoto, CivilizationPhoto],
  }
}

/**
 * Curated catalog — Africa & Near East, Mediterranean, Asia, Americas, and
 * Oceania. Expand here as new Civilizations guides ship.
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
      exploreLinks: ["Egypt", "Sudan"],
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
    slug: 'kush',
    code: 'KSH',
    name: 'Kingdom of Kush',
    category: 'Africa & Near East',
    subtitle: 'Nile kingdom · Nubia',
    about:
      'The Kingdom of Kush was Egypt’s powerful southern neighbor and, for a time, its ruler. Along the Middle Nile in what is now Sudan, Kushite states centered first at Kerma, then Napata, then Meroë — each capital marking a different balance of trade, iron, and royal ideology. Orientation is Nilotic and funerary: steep pyramids denser than Egypt’s, temples under the sacred mountain of Jebel Barkal, and a court that borrowed Egyptian forms while speaking its own political language. Kushite kings of the Twenty-Fifth Dynasty ruled Egypt as pharaohs before Assyrian pressure pushed power back south. Later Meroitic culture developed its own script and kept Mediterranean and African exchange alive long after New Kingdom Egypt had faded. This primer stays with Nubian kingship, pyramid fields, and Nile corridor politics rather than treating Kush as Egypt’s footnote.',
    facts: {
      kind: 'Nile kingdom',
      heartland: 'Middle Nile · Nubia (Sudan)',
      era: 'c. 2500 BCE – 350 CE (Kerma to late Meroë)',
      peak: 'Napatan Twenty-Fifth Dynasty & Meroitic florescence',
      writing: 'Egyptian scripts; later Meroitic',
      exploreLinks: ['Sudan', 'Egypt'],
    },
    features: [
      {
        name: 'Pyramids of Meroë',
        description:
          'A dense field of steep royal pyramids on the Butana plain — Kushite funerary architecture at its most distinctive scale.',
      },
      {
        name: 'Jebel Barkal',
        description:
          'A sandstone butte treated as a holy mountain of Amun, with temples and pyramids at its foot — Napata’s sacred landmark.',
      },
      {
        name: 'Pyramids of Nuri',
        description:
          'A Napatan royal cemetery including Taharqa’s pyramid — Kushite kingship written as a skyline of stone points.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Kush',
        url: 'https://www.britannica.com/place/Kush',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Kushite Kingdoms',
        url: 'https://www.metmuseum.org/toah/hd/kush/hd_kush.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Archaeological Sites of the Island of Meroe',
        url: 'https://whc.unesco.org/en/list/1336',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mesopotamia',
    code: 'MES',
    name: 'Mesopotamia',
    category: 'Africa & Near East',
    subtitle: 'River civilization · Tigris–Euphrates',
    about:
      'Mesopotamia is less a single kingdom than a long experiment in living between two rivers. The Tigris and Euphrates braided irrigation, surplus grain, and city rivalry into the first dense urban societies of the Near East — Uruk, Ur, Lagash, Babylon, Nineveh — each rewriting what a capital could mean. Mudbrick was the everyday material; ideology was written into ziggurats, law collections, and temple households that owned land and labor. Cuneiform began as accounting and became literature, omen science, and royal boast. Empires rose by mastering canals and caravans as much as by chariots: Akkad’s early reach, Babylon’s legal fame, Assyria’s military machine, later Neo-Babylonian restoration. The durable lesson is infrastructural: without levees and ledgers, the plain returns to marsh and dust. This primer stays with rivers, cities, script, and temple economy rather than a king-by-king chronicle.',
    facts: {
      kind: 'River civilization',
      heartland: 'Tigris–Euphrates plain · Iraq & Syria',
      era: 'c. 3500 BCE – 539 BCE (as independent Mesopotamian states)',
      peak: 'Old Babylonian & Neo-Assyrian high points, 2nd–1st millennia BCE',
      writing: 'Cuneiform (Sumerian, Akkadian)',
      exploreLinks: ["Iraq", "Syria", "Iran", "Türkiye"],
    },
    features: [
      {
        name: 'Great Ziggurat of Ur',
        description:
          'A stepped temple platform of the Neo-Sumerian city of Ur — mudbrick monumentality rebuilt across centuries as a vertical argument for divine presence.',
      },
      {
        name: 'Ishtar Gate',
        description:
          'Nebuchadnezzar II’s glazed-brick processional gate of Babylon, reconstructed in Berlin — dragons and bulls as imperial threshold design.',
      },
      {
        name: 'Lamassu of Khorsabad',
        description:
          'Human-headed winged bulls from Sargon II’s Assyrian capital — guardian sculptures that fused myth, masonry, and palace intimidation.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mesopotamia',
        url: 'https://www.britannica.com/place/Mesopotamia-historical-region-Asia',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Mesopotamia',
        url: 'https://www.metmuseum.org/toah/hd/mega/hd_mega.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Samarra Archaeological City',
        url: 'https://whc.unesco.org/en/list/276',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'achaemenid-persia',
    code: 'ACH',
    name: 'Achaemenid Persia',
    category: 'Africa & Near East',
    subtitle: 'Imperial continuum · Iranian plateau',
    about:
      'The Achaemenid Empire was the first state to treat the Near East, Egypt, and parts of Central Asia as one administrative problem. From an Iranian highland core, Cyrus, Darius, and Xerxes built satrapies, royal roads, and a multilingual bureaucracy that collected tribute without erasing every local cult. Orientation is infrastructural and ceremonial: Persepolis staged the empire’s New Year theatre; Pasargadae kept Cyrus’s tomb as founder myth in stone; cliff inscriptions at Behistun broadcast legitimacy in three scripts. Aramaic traveled as a chancery language beside Old Persian; Greek cities on the Aegean fringe became both partners and flashpoints. The empire fell to Alexander in the late fourth century BCE, but its habits of road, archive, and provincial rule outlived the dynasty. This primer stays with plateau heartland, satrapy, and ceremonial capitals rather than every campaign.',
    facts: {
      kind: 'Imperial continuum',
      heartland: 'Iranian plateau · Fars & Media',
      era: 'c. 550 – 330 BCE',
      peak: 'Darius I and Xerxes I, late 6th–early 5th centuries BCE',
      writing: 'Old Persian cuneiform; Imperial Aramaic',
      exploreLinks: ["Iran", "Iraq", "Türkiye", "Egypt", "Afghanistan", "Uzbekistan"],
    },
    features: [
      {
        name: 'Persepolis',
        description:
          'The ceremonial terrace of the Achaemenid kings — Apadana stairways and ruined columns where subject peoples were staged in stone relief.',
      },
      {
        name: 'Gate of All Nations',
        description:
          'Xerxes’ colossal entrance at Persepolis, flanked by lamassu-like guardians — an imperial threshold designed for processions from every satrapy.',
      },
      {
        name: 'Tomb of Cyrus',
        description:
          'The gabled stone tomb at Pasargadae — a spare founder’s monument in the first Achaemenid capital’s plain.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Achaemenian Dynasty',
        url: 'https://www.britannica.com/topic/Achaemenian-Dynasty',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — The Achaemenid Persian Empire',
        url: 'https://www.metmuseum.org/toah/hd/acha/hd_acha.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Persepolis',
        url: 'https://whc.unesco.org/en/list/114',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mali-empire',
    code: 'MAL',
    name: 'Mali Empire',
    category: 'Africa & Near East',
    subtitle: 'Sahelian empire · West Africa',
    about:
      'The Mali Empire turned the West African Sahel into a hinge between desert caravans and savanna farms. Gold from forest margins, salt from Saharan pans, and scholarship in river cities made an inland power that European and Maghrebi writers could not ignore — especially when Mansa Musa’s pilgrimage advertised wealth on a continental stage. Orientation here is commercial and Islamic at once: rulers patronized mosques and madrasas while taxing trade that moved by camel, canoe, and foot. Timbuktu and Djenné became names for learning and mudbrick ambition; Gao and Niani mark shifting political gravity. Oral epics preserved founding stories even as Arabic literacy kept accounts and law. The empire’s later fractures do not erase the durable pattern: a Sahelian statecraft built on routes, reputation, and religious cosmopolitanism. This primer favors trade corridors, cities of learning, and earthen architecture over a list of every succession dispute.',
    facts: {
      kind: 'Sahelian empire',
      heartland: 'Upper Niger · West African Sahel',
      era: 'c. 1230 – 1600 CE',
      peak: '14th century under Mansa Musa and successors',
      writing: 'Arabic (with rich Mandé oral traditions)',
      exploreLinks: ["Mali", "Guinea", "Senegal", "Mauritania", "Niger"],
    },
    features: [
      {
        name: 'Great Mosque of Djenné',
        description:
          'The world’s largest mudbrick mosque — a living Sudano-Sahelian monument renewed by annual plastering as much as by original design.',
      },
      {
        name: 'Sankoré Madrasah',
        description:
          'A Timbuktu center of Islamic learning whose libraries and courtyards made the city a Sahelian node in wider scholarly networks.',
      },
      {
        name: 'Tomb of Askia',
        description:
          'A pyramidal earthen tomb at Gao associated with the Songhai ruler Askia Mohammad — later imperial architecture on Mali’s eastern horizon.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mali empire',
        url: 'https://www.britannica.com/place/Mali-historical-empire-Africa',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Mali Empire',
        url: 'https://www.metmuseum.org/toah/hd/mali/hd_mali.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Old Towns of Djenné',
        url: 'https://whc.unesco.org/en/list/116',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'aksum',
    code: 'AKS',
    name: 'Aksum',
    category: 'Africa & Near East',
    subtitle: 'Highland trading kingdom · Horn of Africa',
    about:
      'Aksum rose on the Ethiopian highlands as a state that could see both the Red Sea and the African interior. Ivory, gold, incense, and enslaved people moved through its ports; coins stamped in Greek, Geʿez, and other scripts advertised a kingdom fluent in more than one commercial language. Giant stelae — stone needles carved to resemble multi-story buildings — turned royal funerary ambition into a skyline. In the fourth century, royal conversion made Aksum an early Christian power in Africa, tying highland churches to wider Mediterranean and Near Eastern networks without erasing older local forms. Orientation is vertical and maritime at once: terrace agriculture on plateaus, caravan paths to the coast, and monuments that still dominate Axum’s fields. Decline shifted centers southward, but the stelae and liturgical inheritance remain. This primer stays with trade, stelae, and early African Christianity rather than later Solomonic legend alone.',
    facts: {
      kind: 'Highland trading kingdom',
      heartland: 'Tigray highlands · Eritrean–Ethiopian corridor',
      era: 'c. 100 – 940 CE',
      peak: '3rd–6th centuries CE',
      writing: 'Geʿez (with Greek on coinage and inscriptions)',
      exploreLinks: ["Ethiopia", "Eritrea"],
    },
    features: [
      {
        name: 'King Ezana’s Stele',
        description:
          'One of Aksum’s great standing monoliths — a carved granite marker of royal funerary status still commanding the stelae field.',
      },
      {
        name: 'Northern Stelae Park',
        description:
          'The principal field of Aksumite funerary monuments, where fallen and standing stones map elite memory onto open ground.',
      },
      {
        name: 'Church of Our Lady Mary of Zion',
        description:
          'A sacred complex at Axum long associated with Ethiopian Christianity’s royal and liturgical center — continuity layered over Aksumite ground.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Aksum',
        url: 'https://www.britannica.com/place/Aksum-ancient-kingdom-Africa',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Aksum',
        url: 'https://www.metmuseum.org/toah/hd/aksu_1/hd_aksu_1.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Aksum',
        url: 'https://whc.unesco.org/en/list/15',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'great-zimbabwe',
    code: 'GZW',
    name: 'Great Zimbabwe',
    category: 'Africa & Near East',
    subtitle: 'Stone city · southern Africa',
    about:
      'Great Zimbabwe was the stone capital of a medieval trading state on the Zimbabwe Plateau. Dry-stone walls without mortar — the Hill Complex, the Great Enclosure, the mysterious conical tower — organized elite space above a landscape of cattle wealth and long-distance exchange. Orientation is architectural and commercial: gold and ivory moved toward the Indian Ocean; glass beads and ceramics moved inland; local politics concentrated labor into walls that still refuse easy colonial myths of foreign builders. The site gives its modern country a name; the state around it was part of a wider Shona-speaking world of zimbabwes (stone houses) before power shifted north. This primer stays with masonry, plateau ecology, and Indian Ocean connection rather than treasure legends alone.',
    facts: {
      kind: 'Stone city state',
      heartland: 'Zimbabwe Plateau · southeastern Africa',
      era: 'c. 11th – 15th centuries CE',
      peak: 'Great Enclosure florescence, 13th–14th centuries',
      writing: 'Oral and archaeological record (no local script corpus)',
      exploreLinks: ['Zimbabwe'],
    },
    features: [
      {
        name: 'Great Zimbabwe',
        description:
          'The wider ruin field — granite walls and enclosures that made a capital readable as stone topography.',
      },
      {
        name: 'Hill Complex',
        description:
          'Elite and ritual structures on the granite hill — the oldest major cluster, looking down on the valley enclosures.',
      },
      {
        name: 'Conical Tower',
        description:
          'A solid stone tower inside the Great Enclosure — an emblem of Great Zimbabwe’s dry-stone ambition and still-debated meaning.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Great Zimbabwe',
        url: 'https://www.britannica.com/place/Great-Zimbabwe',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Great Zimbabwe',
        url: 'https://www.metmuseum.org/toah/hd/zimb/hd_zimb.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Great Zimbabwe National Monument',
        url: 'https://whc.unesco.org/en/list/364',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'early-caliphates',
    code: 'CLP',
    name: 'Early Caliphates',
    category: 'Africa & Near East',
    subtitle: 'Umayyad to Abbasid · Islamic Near East',
    about:
      'The early caliphates turned the late antique Near East into a new imperial grammar of faith, law, and Arabic administration. From the Umayyad capital at Damascus to the Abbasid courts of Baghdad and Samarra, rulers claimed succession to the Prophet while governing populations that remained religiously diverse. Orientation is architectural and administrative: congregational mosques that reused and reinvented Roman and Sasanian urban space, coinage and chancery Arabic, and a trade world stretching from Al-Andalus to the Indian Ocean. The Dome of the Rock staged sacred geography in Jerusalem; Córdoba’s great mosque showed how western Umayyad heirs built a parallel center of learning and power. This primer stays with the Umayyad–Abbasid arc — capital, mosque, and empire — rather than every dynastic schism.',
    facts: {
      kind: 'Imperial caliphate',
      heartland: 'Syria & Iraq · with western Umayyad Spain',
      era: '661 – c. 1258 CE (Umayyad to high Abbasid; Córdoba Umayyads parallel)',
      peak: 'Umayyad Damascus 7th–8th c.; Abbasid Baghdad 8th–9th c.',
      writing: 'Classical Arabic',
      exploreLinks: [
        'Syria',
        'Iraq',
        'Israel',
        'Spain',
        'Egypt',
        'Saudi Arabia',
        'Jordan',
      ],
    },
    features: [
      {
        name: 'Umayyad Mosque',
        description:
          'The Great Mosque of Damascus — a congregational complex that remade a late antique sacred site into an Umayyad imperial emblem.',
      },
      {
        name: 'Dome of the Rock',
        description:
          'An early Islamic shrine on the Temple Mount — an octagonal monument of mosaic and dome that marks sacred claim in Jerusalem.',
      },
      {
        name: 'Great Mosque of Córdoba',
        description:
          'The hypostyle mosque of Umayyad Córdoba — red-and-white arches as the architectural signature of Islamic Spain’s capital.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — caliphate',
        url: 'https://www.britannica.com/place/Caliphate',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — The Umayyads',
        url: 'https://www.metmuseum.org/toah/hd/umay/hd_umay.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Ancient City of Damascus',
        url: 'https://whc.unesco.org/en/list/20',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'classical-greece',
    code: 'GRK',
    name: 'Classical Greece',
    category: 'Mediterranean',
    subtitle: 'City-state civilization · Aegean world',
    about:
      'Classical Greece was a conversation among cities more than a single state. Athens, Sparta, Corinth, Thebes, and dozens of others shared language, gods, and competitive habits while refusing political unity until Macedon imposed it from outside. Orientation favors the polis: citizen assemblies and exclusionary citizenship, temples that doubled as treasuries, and panhellenic sanctuaries where rivals met under truce. Philosophy, drama, and history writing flourished beside slavery and endemic warfare; marble perfection and brutal politics occupied the same century. Colonies and trade laced the Black Sea and western Mediterranean with Greek towns, exporting styles of temple and alphabet. The Persian Wars and the Peloponnesian War remain structural events, not just stories — moments when the city-state system revealed its strengths and its suicidal fractures. This primer stays with the polis, sanctuary, and shared culture rather than a tourist checklist of every statue.',
    facts: {
      kind: 'City-state civilization',
      heartland: 'Aegean basin · southern Balkans',
      era: 'Archaic to Hellenistic; Classical core c. 480–323 BCE',
      peak: '5th century BCE (Athens’ high classical moment)',
      writing: 'Greek alphabet',
      exploreLinks: ["Greece", "Türkiye", "Italy", "Cyprus"],
    },
    features: [
      {
        name: 'Parthenon',
        description:
          'Athena’s temple on the Athenian Acropolis — Doric order, sculptural program, and imperial treasury in one marble argument.',
      },
      {
        name: 'Temple of Apollo, Delphi',
        description:
          'The oracular sanctuary’s temple core, where panhellenic pilgrimage and political consultation shared sacred ground.',
      },
      {
        name: 'Stadium at Olympia',
        description:
          'The racecourse of the Olympic Games — athletic competition as a Greek language of truce, fame, and civic pride.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ancient Greek civilization',
        url: 'https://www.britannica.com/place/ancient-Greece',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Ancient Greece',
        url: 'https://www.metmuseum.org/toah/hd/grck/hd_grck.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Acropolis, Athens',
        url: 'https://whc.unesco.org/en/list/404',
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
      exploreLinks: ["Italy", "Greece", "Spain", "France", "Türkiye", "Egypt"],
    },
    features: [
      {
        name: 'Colosseum',
        description:
          'The Flavian Amphitheatre in Rome — an engineered bowl for public spectacle whose arches and vomitoria still teach Roman crowd logistics in stone.',
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
    slug: 'byzantine-empire',
    code: 'BYZ',
    name: 'Byzantine Empire',
    category: 'Mediterranean',
    subtitle: 'Eastern Roman empire · Constantinople',
    about:
      'Byzantium is what happens when the Roman Empire keeps its eastern half and slowly becomes something new without admitting the rename. Constantinople sat on a peninsula between seas and continents, guarded by walls that held for centuries while western provinces slipped away. Greek replaced Latin in administration; Christianity — especially Orthodox liturgy and theology — became the empire’s shared grammar; Roman law was codified and taught as inheritance. Orientation is urban and ceremonial: hippodrome factions, mosaic-clad churches, and a court that treated diplomacy as theater. Trade and war with Persians, Arabs, Slavs, Latins, and Turks shaped a state that survived by adaptation as much as by nostalgia. 1453 ends the imperial capital; it does not erase the artistic and legal afterlife. This primer stays with capital, faith, and continuity rather than every palace intrigue.',
    facts: {
      kind: 'Eastern Roman empire',
      heartland: 'Constantinople · Balkans & Anatolia',
      era: '330 – 1453 CE (conventional imperial span)',
      peak: 'Justinianic 6th century; Macedonian revival 10th–11th',
      writing: 'Medieval Greek',
      exploreLinks: ["Türkiye", "Greece", "Italy", "Bulgaria", "Egypt"],
    },
    features: [
      {
        name: 'Hagia Sophia',
        description:
          'Justinian’s great church in Constantinople — a dome over a basilica plan that reset sacred architecture for the medieval Mediterranean.',
      },
      {
        name: 'Basilica of San Vitale',
        description:
          'An octagonal church in Ravenna whose mosaics of Justinian and Theodora freeze Byzantine court theology in glass and gold.',
      },
      {
        name: 'Theodosian Walls',
        description:
          'The land walls of Constantinople — layered fortifications that made the capital nearly impregnable for a millennium.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Byzantine Empire',
        url: 'https://www.britannica.com/place/Byzantine-Empire',
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
    slug: 'ottoman-empire',
    code: 'OTT',
    name: 'Ottoman Empire',
    category: 'Mediterranean',
    subtitle: 'Imperial continuum · Anatolia & Balkans',
    about:
      'The Ottoman Empire grew from a northwestern Anatolian principality into a multi-continental state that outlasted medieval neighbors by centuries. Constantinople’s fall in 1453 made the city — Istanbul — an imperial capital that fused Byzantine geography with Islamic dynasty, law, and patronage. Orientation is administrative and architectural: a millet system that managed difference, a Janissary corps that became both strength and liability, and mosque complexes that organized charity, learning, and urban skyline together. Süleyman’s sixteenth-century high tide reached deep into Europe, the Maghreb, and the Arab lands; later centuries were reform, rivalry, and slow territorial loss rather than a single collapse date. Turkish, Arabic, and Persian literatures shared court space; Greek, Armenian, Jewish, and Slavic communities remained part of the imperial fabric. This primer stays with capital, mosque-complex statecraft, and long continuity from the late medieval to the early modern world.',
    facts: {
      kind: 'Imperial continuum',
      heartland: 'Anatolia · Balkans · eastern Mediterranean',
      era: 'c. 1299 – 1922 CE',
      peak: 'Süleymanic 16th century',
      writing: 'Ottoman Turkish (Arabic script); Arabic & Persian literary registers',
      exploreLinks: ["Türkiye", "Greece", "Egypt", "Syria", "Iraq", "Bulgaria", "Serbia", "Hungary"],
    },
    features: [
      {
        name: 'Süleymaniye Mosque',
        description:
          'Mimar Sinan’s hilltop complex for Süleyman — mosque, madrasas, and charitable institutions as Ottoman urban statecraft in stone.',
      },
      {
        name: 'Topkapı Palace',
        description:
          'The walled imperial residence above the Golden Horn — courtyards and kiosks where sultanic household, council, and treasury shared one precinct.',
      },
      {
        name: 'Sultan Ahmed Mosque',
        description:
          'The early-seventeenth-century Blue Mosque facing Hagia Sophia — six minarets and a cascading dome profile that reset Istanbul’s sacred skyline.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ottoman Empire',
        url: 'https://www.britannica.com/place/Ottoman-Empire',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — The Art of the Ottomans',
        url: 'https://www.metmuseum.org/toah/hd/otto1/hd_otto1.htm',
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
    slug: 'carthage',
    code: 'CAR',
    name: 'Carthage',
    category: 'Mediterranean',
    subtitle: 'Punic maritime power · North Africa',
    about:
      'Carthage was a Phoenician foundation that became the western Mediterranean’s great mercantile rival to Rome. From a Tunisian peninsula it ran a network of ports, farms, and alliances that prized ships over legions — until the Punic Wars forced a different kind of history. Orientation is maritime and agricultural together: harbors cut for warships and traders, hinterland estates feeding the city, and a Punic culture that kept Levantine roots while adapting to North Africa and Iberia. Hannibal’s Alpine crossing is the famous chapter; the quieter structure is a commercial empire that Rome could not leave standing. Destruction in 146 BCE was meant to be final; Roman Carthage later rose on the same ground, layering baths and forums over Punic memory. This primer stays with ports, rivalry, and North African position rather than only battlefield romance.',
    facts: {
      kind: 'Punic maritime power',
      heartland: 'Gulf of Tunis · western Mediterranean network',
      era: 'c. 814 BCE – 146 BCE (Punic city)',
      peak: '3rd century BCE before and during the Punic Wars',
      writing: 'Punic (Phoenician-derived script)',
      exploreLinks: ["Tunisia", "Spain", "Italy", "Algeria"],
    },
    features: [
      {
        name: 'Antonine Baths',
        description:
          'Vast Roman imperial baths on the Carthage shore — later monumentality on the site of the destroyed Punic capital.',
      },
      {
        name: 'Byrsa Hill',
        description:
          'The acropolis of ancient Carthage, where Punic and Roman layers stack on the city’s commanding height.',
      },
      {
        name: 'Punic Ports',
        description:
          'The circular naval harbor and commercial basins that made Carthage a machine for Mediterranean sea power.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Carthage',
        url: 'https://www.britannica.com/place/Carthage-ancient-city-Tunisia',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Carthage',
        url: 'https://www.metmuseum.org/toah/hd/cart/hd_cart.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Archaeological Site of Carthage',
        url: 'https://whc.unesco.org/en/list/37',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'indus-valley',
    code: 'IND',
    name: 'Indus Valley',
    category: 'Asia',
    subtitle: 'River civilization · Indus basin',
    about:
      'The Indus Valley civilization built cities with a planner’s patience: baked-brick blocks, covered drains, standardized weights, and citadels rising above lower towns. Harappa and Mohenjo-daro are the famous names; dozens of other sites stretch from Balochistan to Gujarat, tied by river and monsoon. Orientation is civic and quiet — fewer royal boasts carved in stone than in Egypt or Mesopotamia, more evidence of urban order in wells, baths, and warehouse platforms. The script remains undeciphered, which keeps politics partly opaque and makes craft and trade the clearer story: beads, metals, seals, and links to Mesopotamian markets. Decline around the early second millennium BCE was regional and staggered, not a single cinematic collapse. This primer stays with urban fabric, water management, and undeciphered signs rather than invented kings.',
    facts: {
      kind: 'River civilization',
      heartland: 'Indus and Ghaggar-Hakra basins · South Asia',
      era: 'Mature Harappan c. 2600 – 1900 BCE',
      peak: 'Mature urban phase, mid–late 3rd millennium BCE',
      writing: 'Indus script (undeciphered)',
      exploreLinks: ["Pakistan", "India"],
    },
    features: [
      {
        name: 'Mohenjo-daro',
        description:
          'A major Indus city on the lower Indus — grid streets, brick platforms, and a citadel that still define the civilization’s urban image.',
      },
      {
        name: 'Great Bath, Mohenjo-daro',
        description:
          'A watertight ceremonial pool at the citadel — public ritual architecture without a matching royal inscription to explain it.',
      },
      {
        name: 'Dholavira',
        description:
          'A western Indus city in the Rann of Kutch with reservoirs and monumental signage — arid-edge urbanism at civilization’s margin.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Indus civilization',
        url: 'https://www.britannica.com/topic/Indus-civilization',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Indus Valley',
        url: 'https://www.metmuseum.org/toah/hd/indus/hd_indus.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Archaeological Ruins at Moenjodaro',
        url: 'https://whc.unesco.org/en/list/138',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'han-china',
    code: 'HAN',
    name: 'Han China',
    category: 'Asia',
    subtitle: 'Imperial dynasty · East Asia',
    about:
      'The Han dynasty set many of the defaults later ages would call simply “Chinese”: a Confucian-trained bureaucracy, an imperial examination embryo, expanded frontiers, and a cultural self-image durable enough that ethnic identity still borrows the name. Orientation is administrative and continental — censuses and granaries, Silk Road corridors opening west, and tomb cultures that filled the afterlife with clay retinues and lacquer luxury. Paper, iron tools, and long-distance trade changed daily life while court politics swung between strong emperors and consort clans. The dynasty split into Western and Eastern periods around a disruptive interregnum, yet the institutional habit of unified empire returned. This primer stays with bureaucracy, frontier roads, and funerary material culture rather than every usurper’s year count.',
    facts: {
      kind: 'Imperial dynasty',
      heartland: 'North China Plain · Yellow River basin',
      era: '206 BCE – 220 CE',
      peak: 'Western Han high empire, 1st century BCE – 1st century CE',
      writing: 'Classical Chinese (seal, clerical scripts)',
      exploreLinks: ["China", "Mongolia", "Vietnam", "Korea, North"],
    },
    features: [
      {
        name: 'Great Wall at Jinshanling',
        description:
          'A mountainous wall stretch whose later masonry sits on a longer frontier story the Han helped define against steppe powers.',
      },
      {
        name: 'Yangling Mausoleum figurines',
        description:
          'Painted earthenware attendants from Emperor Jing’s tomb complex — Han funerary world-building in miniature armies and servants.',
      },
      {
        name: 'Mogao Caves',
        description:
          'The Dunhuang cave temples on the Silk Road corridor — later painted glory on an oasis route the Han empire helped open.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Han dynasty',
        url: 'https://www.britannica.com/topic/Han-dynasty',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Han Dynasty',
        url: 'https://www.metmuseum.org/toah/hd/hand/hd_hand.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Silk Roads: Chang’an–Tianshan Corridor',
        url: 'https://whc.unesco.org/en/list/1442',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'tang-china',
    code: 'TNG',
    name: 'Tang China',
    category: 'Asia',
    subtitle: 'Cosmopolitan dynasty · Chang’an',
    about:
      'The Tang dynasty made Chang’an a world city: a planned capital where Silk Road goods, Buddhist pilgrims, poets, and foreign enclaves met under an imperial canopy. Orientation is cosmopolitan and institutional — civil-service exams matured, equal-field ideas tried to stabilize peasantry, and frontier protectorates pushed influence deep into Central Asia before contraction. Buddhism left monumental traces in cliff grottoes and river-carved Buddhas even as court taste swung between patronage and purge. Poetry and painting set canons later ages treated as classical; Japan and Korea borrowed Tang models of law, capital layout, and court culture. The An Lushan rebellion cracked the high Tang; the dynasty limped to 907, but the memory of openness and literary brilliance stayed. This primer stays with capital, Buddhism in stone, and cross-border exchange rather than every eunuch faction.',
    facts: {
      kind: 'Cosmopolitan dynasty',
      heartland: 'Guanzhong basin · Yellow River China',
      era: '618 – 907 CE',
      peak: 'High Tang, 7th–mid-8th centuries',
      writing: 'Classical Chinese',
      exploreLinks: ["China", "Mongolia", "Vietnam", "Korea, North", "Korea, South"],
    },
    features: [
      {
        name: 'Giant Wild Goose Pagoda',
        description:
          'A brick pagoda in Xi’an associated with Xuanzang’s scripture translations — Tang Buddhist cosmopolitanism rising over the old Chang’an plain.',
      },
      {
        name: 'Longmen Grottoes',
        description:
          'Cliff-carved Buddha assemblies near Luoyang — imperial and popular patronage cut into limestone along the Yi River.',
      },
      {
        name: 'Leshan Giant Buddha',
        description:
          'A colossal riverside Buddha begun in the Tang era — engineering and devotion scaled to calm a dangerous confluence.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Tang dynasty',
        url: 'https://www.britannica.com/topic/Tang-dynasty',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Tang Dynasty',
        url: 'https://www.metmuseum.org/toah/hd/tang/hd_tang.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Longmen Grottoes',
        url: 'https://whc.unesco.org/en/list/1003',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'khmer',
    code: 'KHM',
    name: 'Khmer Empire',
    category: 'Asia',
    subtitle: 'Temple empire · mainland Southeast Asia',
    about:
      'The Khmer Empire organized the lower Mekong and Tonlé Sap into a hydraulic and temple landscape without peer in mainland Southeast Asia. Angkor was not one building but a metropolitan region of reservoirs, canals, rice fields, and state temples that mapped cosmic order onto monsoon earth. Kings claimed divine kingship; sandstone and laterite recorded both devotion and labor mobilization on a staggering scale. Orientation is hydrological: control of water made surplus, surplus made monuments, monuments made legitimacy. Indian-derived scripts and Hindu-Buddhist cults arrived through trade and court fashion, then became thoroughly Khmer. The empire’s thirteenth–fifteenth century transformations shifted capitals and cults; the forest reclaiming Ta Prohm is poetic, not the whole story. This primer stays with water, temple-mountains, and Angkorian statecraft.',
    facts: {
      kind: 'Temple empire',
      heartland: 'Tonlé Sap & Mekong lowlands · Cambodia',
      era: 'c. 802 – 1431 CE',
      peak: 'Angkor Wat era, 12th century CE',
      writing: 'Old Khmer / Sanskrit inscriptions',
      exploreLinks: ["Cambodia", "Thailand", "Laos", "Vietnam"],
    },
    features: [
      {
        name: 'Angkor Wat',
        description:
          'Suryavarman II’s temple-mountain — a vast west-facing complex whose galleries and moat stage Hindu cosmology at imperial scale.',
      },
      {
        name: 'Bayon',
        description:
          'Jayavarman VII’s state temple at Angkor Thom, famous for serene stone faces and a Buddhist turn in royal ideology.',
      },
      {
        name: 'Ta Prohm',
        description:
          'A monastic temple left partly to the forest — roots and galleries showing how Angkor’s stone and living landscape intertwine.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Khmer empire',
        url: 'https://www.britannica.com/place/Khmer-empire',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Angkor',
        url: 'https://www.metmuseum.org/toah/hd/angk/hd_angk.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Angkor',
        url: 'https://whc.unesco.org/en/list/668',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'maurya',
    code: 'MRY',
    name: 'Maurya Empire',
    category: 'Asia',
    subtitle: 'Early Indian empire · Gangetic plain',
    about:
      'The Maurya Empire was the first state to pull most of the Indian subcontinent under one administrative canopy. From Magadha’s Gangetic core, Chandragupta and his successors built roads, spy networks, and tax systems that treated distance as a solvable problem. Ashoka’s reign after Kalinga turned imperial communication into ethics: rock and pillar edicts in Prakrit urged restraint and public welfare while still projecting power. Orientation is inscriptional and infrastructural — polished sandstone pillars, cave retreats for Ajivikas, and stupas that marked a Buddhist landscape under royal patronage. Greek ambassadors noticed the capital; later Indian memory treated the Mauryas as a template for unity. The empire fragmented within generations of Ashoka, but the habit of writing rule onto stone endured. This primer stays with edicts, roads, and early imperial scale rather than legend alone.',
    facts: {
      kind: 'Early Indian empire',
      heartland: 'Magadha · Gangetic plain',
      era: 'c. 322 – 185 BCE',
      peak: 'Ashoka’s reign, mid–3rd century BCE',
      writing: 'Brahmi / Prakrit edicts (and related scripts)',
      exploreLinks: ["India", "Pakistan", "Nepal", "Bangladesh", "Afghanistan"],
    },
    features: [
      {
        name: 'Great Stupa at Sanchi',
        description:
          'A major Buddhist stupa complex enlarged under and after Mauryan patronage — hemispherical relic mound as imperial-era sacred architecture.',
      },
      {
        name: 'Ashoka Pillar, Sarnath',
        description:
          'A polished Mauryan pillar at the deer park of the Buddha’s first sermon — edict and emblem (later India’s lion capital) in one shaft.',
      },
      {
        name: 'Barabar Caves',
        description:
          'Rock-cut caves in Bihar with mirror-polished interiors — Mauryan engineering offered to Ajivika ascetics.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mauryan empire',
        url: 'https://www.britannica.com/place/Mauryan-Empire',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Maurya Period',
        url: 'https://www.metmuseum.org/toah/hd/maur/hd_maur.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Buddhist Monuments at Sanchi',
        url: 'https://whc.unesco.org/en/list/524',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'gupta-empire',
    code: 'GUP',
    name: 'Gupta Empire',
    category: 'Asia',
    subtitle: 'Classical Indian empire · Gangetic plain',
    about:
      'The Gupta Empire is often treated as a classical high point of northern Indian culture — a period when Sanskrit poetry, mathematical astronomy, and Buddhist and Hindu art set canons later ages remembered as golden. From a Magadhan and Gangetic core, Gupta rulers built a looser imperial umbrella than the Mauryas: feudatory kings, land grants, and prestige more than total administration. Orientation is cultural and religious as much as military — cave temples and freestanding shrines, Buddha images of serene proportion, and courts that patronized dramatists and scholars. Contemporary Vakataka patronage helped produce Ajanta’s painted caves; Gupta-period sites from Udayagiri to Deogarh show how temple form hardened into durable types. The empire fragmented under Hunnic pressure and internal division, but its aesthetic afterlife was long. This primer stays with classical forms, temple experiment, and Gangetic kingship rather than a year-by-year king list.',
    facts: {
      kind: 'Classical Indian empire',
      heartland: 'Gangetic plain · northern India',
      era: 'c. 320 – 550 CE',
      peak: 'Chandragupta II and early 5th century',
      writing: 'Sanskrit (Brahmi-derived scripts)',
      exploreLinks: ['India', 'Bangladesh', 'Nepal', 'Pakistan'],
    },
    features: [
      {
        name: 'Dashavatara Temple',
        description:
          'An early stone temple at Deogarh — Gupta-period architecture experimenting with a square sanctum and narrative reliefs.',
      },
      {
        name: 'Udayagiri Caves',
        description:
          'A hillside cave complex near Vidisha with Gupta-era Vaishnava sculpture — royal devotion cut into living rock.',
      },
      {
        name: 'Ajanta Caves',
        description:
          'Rock-cut Buddhist viharas and chaityas whose painted and carved florescence overlaps the Gupta cultural horizon under Vakataka patrons.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Gupta dynasty',
        url: 'https://www.britannica.com/topic/Gupta-dynasty',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Gupta Period',
        url: 'https://www.metmuseum.org/toah/hd/gupt/hd_gupt.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Ajanta Caves',
        url: 'https://whc.unesco.org/en/list/242',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'chola-empire',
    code: 'CHO',
    name: 'Chola Empire',
    category: 'Asia',
    subtitle: 'Temple empire · Tamil South India',
    about:
      'The Chola Empire made the Tamil country a temple-centered maritime power. From the Kaveri delta, Chola kings built towering stone vimanas, irrigated rice landscapes, and sent fleets that touched Sri Lanka and Southeast Asia. Orientation is sacral and naval together: Brihadisvara and its sibling “Great Living Chola Temples” staged royal devotion as urban anchors, while bronze sculpture and Tamil literature flourished under court and temple patronage. Administration rested on village assemblies and temple economies as much as on conquest. The imperial high point under Rajaraja I and Rajendra I left monuments that still structure South Indian sacred geography. This primer stays with temple architecture, delta ecology, and Bay of Bengal reach rather than a king-by-king chronicle.',
    facts: {
      kind: 'Temple empire',
      heartland: 'Kaveri delta · Tamil Nadu',
      era: 'c. 850 – 1279 CE (imperial Cholas)',
      peak: 'Rajaraja I and Rajendra I, late 10th–early 11th centuries',
      writing: 'Tamil & Sanskrit (Grantha / Tamil scripts)',
      exploreLinks: ['India', 'Sri Lanka', 'Malaysia', 'Indonesia'],
    },
    features: [
      {
        name: 'Brihadisvara Temple',
        description:
          'Rajaraja I’s great temple at Thanjavur — a soaring granite vimana that reset the scale of South Indian temple architecture.',
      },
      {
        name: 'Gangaikonda Cholapuram',
        description:
          'Rajendra I’s capital temple — a companion Great Living Chola Temple built to mark northern conquest and a new royal city.',
      },
      {
        name: 'Airavatesvara Temple',
        description:
          'The ornate Chola temple at Darasuram — dense sculpture and a chariot-form mandapa from the later imperial phase.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Chola dynasty',
        url: 'https://www.britannica.com/topic/Chola-dynasty',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Chola Period',
        url: 'https://www.metmuseum.org/toah/hd/chola/hd_chola.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Great Living Chola Temples',
        url: 'https://whc.unesco.org/en/list/250',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mongol-empire',
    code: 'MNG',
    name: 'Mongol Empire',
    category: 'Asia',
    subtitle: 'Steppe empire · Eurasian corridors',
    about:
      'The Mongol Empire was the largest contiguous land empire in history — a steppe political machine that turned mobility into administration. From the Orkhon heartland, Chinggis Khan and his successors linked China, Central Asia, Iran, and Eastern Europe through conquest, relay posts, and a legal order that prized submission and census. Orientation is pastoral and logistical: horse herds, seasonal camps, and a Yam courier network that made distance negotiable. Karakorum served as an early capital; later the realm fractured into khanates (Yuan, Ilkhanate, Chagatai, Golden Horde) that still shared kinship idioms and trade incentives. Religious pluralism was often pragmatic; merchants and craftsmen moved under imperial safe-conduct when the system worked. The empire’s thirteenth-century shock rewrote maps; its afterlives reshaped states from Beijing to Moscow. This primer stays with steppe logistics, Orkhon geography, and imperial scale rather than only battlefield terror.',
    facts: {
      kind: 'Steppe empire',
      heartland: 'Mongolian plateau · Orkhon Valley',
      era: '1206 – late 14th century (unified to successor khanates)',
      peak: 'Mid–13th century under Möngke and the early successor states',
      writing: 'Mongolian script (Uyghur-derived); multilingual chanceries',
      exploreLinks: ["Mongolia", "China", "Russia", "Kazakhstan", "Uzbekistan", "Iran", "Ukraine"],
    },
    features: [
      {
        name: 'Orkhon Valley',
        description:
          'The riverine steppe heartland of successive Inner Asian powers — pasture, memorial culture, and the geographic stage for Mongol state formation.',
      },
      {
        name: 'Erdene Zuu Monastery',
        description:
          'A walled monastery complex at Karakorum’s site — later Buddhist architecture marking the old imperial capital’s plain.',
      },
      {
        name: 'Karakorum',
        description:
          'The early Mongol capital in the Orkhon — a crossroads town of tents, workshops, and envoys before power shifted to regional khanate seats.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mongol empire',
        url: 'https://www.britannica.com/place/Mongol-empire',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — The Mongol Empire',
        url: 'https://www.metmuseum.org/toah/hd/mgol/hd_mgol.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Orkhon Valley Cultural Landscape',
        url: 'https://whc.unesco.org/en/list/1081',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'classical-japan',
    code: 'JPN',
    name: 'Classical Japan',
    category: 'Asia',
    subtitle: 'Island courts · Heian to Edo',
    about:
      'Classical Japan’s Heian-to-Edo arc is an island story of imported forms remade locally. From the Heian court’s poetry and Pure Land aesthetics, through warrior governments that still needed Kyoto’s cultural capital, to the Tokugawa peace that froze status and urbanized consumption, the archipelago built dense traditions without becoming a continental empire. Orientation is courtly and spatial: shrine and temple precincts, castle towns, and a writing culture that braided Chinese classics with kana vernacular. Byōdō-in’s Phoenix Hall freezes Heian Pure Land longing in architecture; Muromachi Zen and Ashikaga patronage shaped gardens and ink taste; Edo-period castles and cities organized a closed-country order that still traded selectively. Shinto and Buddhism intertwined more often than they competed cleanly. This primer stays with Heian–Edo continuity — courts, temples, and castle authority — rather than Meiji industrialization or a single clan chronicle.',
    facts: {
      kind: 'Island court civilization',
      heartland: 'Kinai basin · Japanese archipelago',
      era: 'Heian to Edo, c. 794 – 1868 CE (primer span)',
      peak: 'Heian court culture; Edo urban peace, 17th–18th centuries',
      writing: 'Classical Chinese & Japanese (kanji/kana)',
      exploreLinks: ["Japan"],
    },
    features: [
      {
        name: 'Byōdō-in Phoenix Hall',
        description:
          'A Heian Pure Land pavilion at Uji — symmetrical wings and reflecting pond as aristocratic Buddhism made architecture.',
      },
      {
        name: 'Kinkaku-ji',
        description:
          'The Golden Pavilion in Kyoto — a Muromachi villa-temple whose mirrored gold became an emblem of Ashikaga cultural power.',
      },
      {
        name: 'Himeji Castle',
        description:
          'A white multi-keep fortress perfected in the early Edo order — castle-town authority expressed as elegant military architecture.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Japan',
        url: 'https://www.britannica.com/place/Japan',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Heian Period',
        url: 'https://www.metmuseum.org/toah/hd/heia/hd_heia.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Himeji-jo',
        url: 'https://whc.unesco.org/en/list/661',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'olmec',
    code: 'OLM',
    name: 'Olmec',
    category: 'Americas',
    subtitle: 'Formative civilization · Gulf lowlands',
    about:
      'The Olmec are often called Mesoamerica’s “mother culture” — an early complex society of the Gulf lowlands whose colossal heads, jade, and ceremonial centers shaped later regional styles. Orientation is formative and sculptural: San Lorenzo and La Venta organized earthen platforms, drains, and offerings long before Teotihuacan’s avenues; basalt portraits of rulers still define the public image of the culture. Trade in obsidian, serpentine, and prestige goods linked the coast to the highlands. Writing and calendar ideas that bloom later in Mesoamerica have debated Olmec roots; what is clear is monumental labor and a shared visual language of power. This primer stays with Gulf centers, colossal sculpture, and formative statecraft rather than forcing every later civilization into an Olmec origin myth.',
    facts: {
      kind: 'Formative civilization',
      heartland: 'Gulf lowlands · Veracruz & Tabasco',
      era: 'c. 1500 – 400 BCE',
      peak: 'San Lorenzo then La Venta florescences, 1200–400 BCE',
      writing: 'Debated early glyphic signs; mainly archaeological & iconographic',
      exploreLinks: ['Mexico'],
    },
    features: [
      {
        name: 'Olmec Colossal Head',
        description:
          'Monumental basalt portrait heads — the signature Olmec image of rulership, now often seen in museums and outdoor parks.',
      },
      {
        name: 'La Venta',
        description:
          'A major middle Formative center in Tabasco — earthen mounds, offerings, and sculpture that mark Olmec ceremonial planning.',
      },
      {
        name: 'San Lorenzo Head',
        description:
          'A colossal head associated with San Lorenzo, Veracruz — early Olmec political portraiture at massive scale.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Olmec',
        url: 'https://www.britannica.com/topic/Olmec',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Olmec',
        url: 'https://www.metmuseum.org/toah/hd/olmc/hd_olmc.htm',
        kind: 'reference',
      },
      {
        label: 'Encyclopaedia Britannica — La Venta',
        url: 'https://www.britannica.com/place/La-Venta-ancient-city-Mexico',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'teotihuacan',
    code: 'TEO',
    name: 'Teotihuacan',
    category: 'Americas',
    subtitle: 'Metropolis · Basin of Mexico',
    about:
      'Teotihuacan was Mesoamerica’s great early metropolis — a planned city of avenues, apartment compounds, and pyramids whose influence reached far beyond the Basin of Mexico. Orientation is urban and anonymous: we still debate who ruled it, yet the Avenue of the Dead, Pyramid of the Sun, and Pyramid of the Moon organize space with unmistakable intent. Multiethnic neighborhoods, obsidian workshops, and a wide trade web made the city a magnet; murals and temple sculpture broadcast a religious visual language later peoples still recognized. Collapse in the mid-first millennium CE emptied the core; later Aztec pilgrims treated the ruins as a place of origin myths. This primer stays with street grid, monumental axis, and metropolitan scale rather than forcing a single ethnic label onto a cosmopolitan capital.',
    facts: {
      kind: 'Metropolitan city',
      heartland: 'Basin of Mexico · central highlands',
      era: 'c. 100 BCE – 550 CE',
      peak: 'Classic metropolis, 2nd–5th centuries CE',
      writing: 'Limited glyphic evidence (debated); strong visual programs',
      exploreLinks: ['Mexico'],
    },
    features: [
      {
        name: 'Pyramid of the Sun',
        description:
          'One of the largest pyramids in the Americas — a massive platform on the city’s central axis that still dominates the valley view.',
      },
      {
        name: 'Avenue of the Dead',
        description:
          'The city’s ritual boulevard — a long north–south axis lining compounds, plazas, and temple platforms toward the Moon pyramid.',
      },
      {
        name: 'Pyramid of the Moon',
        description:
          'The northern terminus of the avenue, framed by surrounding peaks — a stage for processions and offerings at the city’s head.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Teotihuacán',
        url: 'https://www.britannica.com/place/Teotihuacan',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Teotihuacan',
        url: 'https://www.metmuseum.org/toah/hd/teot/hd_teot.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pre-Hispanic City of Teotihuacan',
        url: 'https://whc.unesco.org/en/list/414',
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
      exploreLinks: ["Mexico", "Guatemala", "Belize", "Honduras", "El Salvador"],
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
  {
    slug: 'aztec',
    code: 'AZT',
    name: 'Aztec',
    category: 'Americas',
    subtitle: 'Triple-alliance empire · Basin of Mexico',
    about:
      'The Aztec — more precisely the Mexica and their Triple Alliance partners — built an empire of tribute from an island capital in the Basin of Mexico. Tenochtitlan’s causeways, chinampa farms, and twin-temple precinct turned a lake into a metropolis that astonished the first Spaniards to see it. Orientation is aquatic and ritual: market exchange at Tlatelolco, flower wars and captive-taking as politics, and a calendar cosmology carved into basalt. Nahuatl poetry and pictorial books preserved memory beside tribute lists. The empire was young — rising in the fourteenth and fifteenth centuries — and brittle where subject cities waited for an opening. 1521 ends Tenochtitlan as a Mexica capital; it does not erase the cultural depth still readable in language, cuisine, and stone. This primer stays with lake city, tribute, and temple precinct rather than conquest melodrama alone.',
    facts: {
      kind: 'Triple-alliance empire',
      heartland: 'Basin of Mexico · central highlands',
      era: 'c. 1325 – 1521 CE',
      peak: 'Late Postclassic, mid–late 15th century',
      writing: 'Nahuatl (pictorial books and colonial alphabetic texts)',
      exploreLinks: ["Mexico"],
    },
    features: [
      {
        name: 'Templo Mayor',
        description:
          'The twin-stair main temple of Tenochtitlan — layered rebuilds dedicated to Tlaloc and Huitzilopochtli at the city’s sacred center.',
      },
      {
        name: 'Sun Stone',
        description:
          'The great Mexica calendar stone — a carved cosmology of eras and solar force, now an emblem of central Mexican antiquity.',
      },
      {
        name: 'Coyolxauhqui Stone',
        description:
          'A monumental relief of the dismembered moon goddess, found at the Templo Mayor — mythic narrative as temple pavement.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Aztec',
        url: 'https://www.britannica.com/topic/Aztec',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Aztec',
        url: 'https://www.metmuseum.org/toah/hd/azte/hd_azte.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Mexico City',
        url: 'https://whc.unesco.org/en/list/412',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'inca',
    code: 'INC',
    name: 'Inca',
    category: 'Americas',
    subtitle: 'Andean empire · Tawantinsuyu',
    about:
      'The Inca Empire — Tawantinsuyu, the fourfold realm — stitched the Andes together with roads, storehouses, and a resettlement policy that treated mountains as an administrative problem. From Cusco, rulers extended control from highland valleys to Pacific coast and Amazonian edges, demanding labor service (mit’a) more than coined tax. Orientation is vertical ecology: terrace farming, freeze-dried potatoes, llama caravans, and stonework so precise that mortar became optional. Quipu cords kept accounts without a full phonetic script; Quechua spread as a language of rule. Machu Picchu is the famous ridge estate; Sacsayhuamán and Qorikancha show the capital’s military and solar sacredness. Spanish conquest shattered the imperial spine quickly; Andean communities and technologies did not vanish with it. This primer stays with roads, stone, and vertical archipelago farming rather than treasure legends.',
    facts: {
      kind: 'Andean empire',
      heartland: 'Cusco basin · Andean spine of western South America',
      era: 'c. 1438 – 1533 CE (imperial expansion to conquest)',
      peak: 'Late Horizon under Pachacuti and successors, 15th century',
      writing: 'Quipu record-keeping (Quechua language)',
      exploreLinks: ["Peru", "Bolivia", "Ecuador", "Chile", "Argentina", "Colombia"],
    },
    features: [
      {
        name: 'Machu Picchu',
        description:
          'A royal estate and ritual complex on a forested ridge — terraces and temples that became the global image of Inca stone mastery.',
      },
      {
        name: 'Sacsayhuamán',
        description:
          'Zigzag megalithic walls above Cusco — fortress, ceremonial complex, and showcase of tightly fitted Andean masonry.',
      },
      {
        name: 'Qorikancha',
        description:
          'The Temple of the Sun in Cusco, later wrapped by a Spanish church — Inca ashlar precision still visible in the lower courses.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Inca',
        url: 'https://www.britannica.com/topic/Inca',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Inca',
        url: 'https://www.metmuseum.org/toah/hd/inca/hd_inca.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Sanctuary of Machu Picchu',
        url: 'https://whc.unesco.org/en/list/274',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'polynesia',
    code: 'POL',
    name: 'Polynesia',
    category: 'Oceania',
    subtitle: 'Oceanic network · Pacific triangle',
    about:
      'Polynesia is a civilization of open ocean — a triangle of related peoples, languages, and voyaging technologies stretching from Hawaiʻi to Aotearoa (New Zealand) to Rapa Nui (Easter Island), with Tonga and Samoa among the western anchors. Orientation is maritime and genealogical: double-hulled canoes, star paths, and oral histories that treat islands as nodes in a kinship sea rather than isolated ends of the earth. Monumental stonework appears in different local idioms — Rapa Nui’s moai on ceremonial ahu, Tongan trilithons and burial mounds, Hawaiian heiau platforms — while shared linguistic roots keep the network legible. European contact rearranged politics and demography violently; Polynesian cultures did not vanish with first landfall stories. This primer stays with voyaging, island ritual architecture, and the Pacific triangle rather than a single island’s tourist myth.',
    facts: {
      kind: 'Oceanic network',
      heartland: 'Central & eastern Pacific · Polynesian triangle',
      era: 'Settlement expansion c. 1000 BCE – 1300 CE; enduring cultures',
      peak: 'Regional florescences vary by archipelago (e.g. classic Rapa Nui, Tongan maritime chiefdoms)',
      writing: 'Oral tradition; later Latin scripts; Rongorongo on Rapa Nui (undeciphered)',
      exploreLinks: ['Chile', 'Tonga', 'United States', 'New Zealand', 'Samoa', 'France'],
    },
    features: [
      {
        name: 'Ahu Tongariki',
        description:
          'Rapa Nui’s largest ceremonial platform — fifteen restored moai facing inland along the island’s southeastern shore.',
      },
      {
        name: 'Haʻamonga ʻa Maui',
        description:
          'A coral-limestone trilithon on Tongatapu — a monumental gateway attributed to early Tongan chiefly power.',
      },
      {
        name: 'Puʻukoholā Heiau',
        description:
          'A massive Hawaiian temple platform at Kawaihae — dry-stacked stone sacral architecture tied to late pre-contact state formation.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Polynesian culture',
        url: 'https://www.britannica.com/topic/Polynesian-culture',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Oceania',
        url: 'https://www.metmuseum.org/toah/hd/ocean/hd_ocean.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Rapa Nui National Park',
        url: 'https://whc.unesco.org/en/list/715',
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

export function civilizationSubjectsByCategory(): [
  string,
  CivilizationSubject[],
][] {
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
