/** Civilizations topic — factual about records for historical civilizations. */

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
  /** Neutral factual overview, ~150–250 words. */
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
 * Oceania (forty-two subjects). Expand here as new Civilizations pages ship.
 */
const civilizationSubjectDrafts: CivilizationSubjectDraft[] = [
  {
    slug: 'ancient-egypt',
    code: 'EGY',
    name: 'Ancient Egypt',
    category: 'Africa & Near East',
    subtitle: 'River civilization · Nile Valley',
    about:
      'Ancient Egypt developed along the Nile, whose annual inundation deposited fertile silt, supported grain cultivation, and created a narrow green corridor through the surrounding desert. Farms, towns, temples, and administrative centers depended on the river’s seasonal cycle. Egyptians measured the year in relation to the flood, recorded accounts and religious texts on papyrus and stone, and built tombs and monuments intended to preserve the dead and sustain their cults.\nPolitical power was organized through regional nomes and capitals that changed with successive dynasties, including Memphis, Thebes, and later cities governed under foreign rule. Across roughly three millennia, Egyptian kingship was associated with cosmic order, while temple priesthoods managed substantial land, labor, storage, and trade. Scribes maintained records for taxation, estates, and administration as well as literary and religious works. Pyramids, tombs, temples, and processional routes expressed beliefs about royal authority, divine worship, death, and the continuity of order in a society shaped by the Nile.',
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
      'The Kingdom of Kush was an ancient Nile Valley civilization in what is now Sudan and Egypt’s principal southern neighbor. Its major political centers shifted over time from Kerma to Napata and then Meroë, reflecting changing patterns of trade, iron production, royal authority, and religious life. Kushite rulers adopted and adapted Egyptian political and artistic forms while maintaining distinct institutions and traditions.\nKush is associated with the Middle Nile, steep-sided pyramid fields, temples near the sacred mountain of Jebel Barkal, and royal burial practices. In the eighth and seventh centuries BCE, kings of Kush’s Twenty-Fifth Dynasty ruled Egypt as pharaohs until Assyrian campaigns forced their political center southward. The later kingdom at Meroë developed the Meroitic script and remained involved in exchanges linking the Mediterranean world, the Nile corridor, and regions farther into Africa after the end of Egypt’s New Kingdom.',
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
      'Mesopotamia was the ancient region between the Tigris and Euphrates rivers, where irrigation, grain surpluses, and competition among cities supported some of the Near East’s earliest dense urban societies. Major centers included Uruk, Ur, Lagash, Babylon, and Nineveh. Mudbrick was the common building material, while ziggurats, law collections, and temple institutions expressed political and religious authority. Temples often controlled land, labor, storage, and redistribution.\nCuneiform writing began largely as a system for recording accounts and later served literature, omen texts, administration, legal records, and royal inscriptions. States and empires depended on canals, levees, trade routes, and military force. Akkad extended early imperial rule across much of the region; Babylon became associated with law and kingship; Assyria built a powerful military empire; and the Neo-Babylonian kingdom restored Babylon as a major center. Maintaining waterworks and written records was central to life on the alluvial plain, where unmanaged land could become marsh or dry, dusty ground.',
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
      'The Achaemenid Empire brought the Near East, Egypt, and parts of Central Asia under a single imperial administration. From an Iranian highland core, Cyrus, Darius, and Xerxes organized satrapies, royal roads, and a multilingual bureaucracy that collected tribute while generally preserving local cults and institutions. Persepolis served as a ceremonial capital, associated with New Year observances; Pasargadae contained the tomb of Cyrus; and the Behistun inscriptions proclaimed royal legitimacy in Old Persian, Elamite, and Babylonian.\nAramaic functioned as a chancery language alongside Old Persian, while Greek cities on the Aegean fringe were both imperial partners and recurring sources of conflict. The empire fell to Alexander in the late fourth century BCE, but its systems of roads, archives, provincial administration, and ceremonial kingship continued to influence later states.',
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
      'The Mali Empire was a major West African state centered in the Sahel, linking Saharan caravan routes with the farming regions and gold-producing forest margins to the south. Its wealth rested on the movement and taxation of gold, salt, and other goods carried by camel, canoe, and foot. Under rulers such as Mansa Musa, whose pilgrimage to Mecca publicized Mali’s resources across North Africa and beyond, the empire became widely known to Maghrebi and European writers.\nIslamic institutions formed an important part of imperial life. Rulers supported mosques, madrasas, scholarship, trade, and legal record-keeping in Arabic. Timbuktu and Djenné developed as centers of learning and earthen, mudbrick architecture, while Gao and Niani reflect changing centers of political power. Oral epics preserved accounts of the empire’s origins alongside written Arabic sources. Although Mali later fragmented, its political traditions remained associated with control of trade routes, royal reputation, and religious and cultural connections across the Sahel and Islamic world.',
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
      'Aksum rose in the Ethiopian highlands as a state linked both to the Red Sea and to the African interior. Ivory, gold, incense, and enslaved people moved through its ports, while coins bearing Greek, Geʿez, and other scripts reflected its participation in multilingual commercial networks. Giant stelae, carved stone monuments resembling multi-story buildings, marked royal funerary sites and remain prominent in the fields around Axum.\nIn the fourth century, Aksum’s rulers adopted Christianity, making the kingdom one of Africa’s earliest Christian states. Highland churches became connected to Mediterranean and Near Eastern religious networks while retaining older local forms. Its economy depended on terrace agriculture on the plateaus, caravan routes to the coast, and Red Sea trade. As Aksum declined, political centers shifted southward, but its stelae and Christian liturgical inheritance endured beyond the kingdom.',
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
      'Great Zimbabwe was the stone capital of a medieval trading state on the Zimbabwe Plateau. Its dry-stone architecture, built without mortar, includes the Hill Complex, the Great Enclosure, and a conical tower. These walls organized elite areas within a landscape shaped by cattle wealth, agriculture, and long-distance exchange.\nGold and ivory from the region moved through trade networks toward the Indian Ocean, while glass beads and ceramics arrived from coastal and overseas markets. Political authority concentrated labor to construct the large stone enclosures. The site provides the modern country of Zimbabwe with its name and is associated with a wider Shona-speaking world in which zimbabwes meant stone houses. Great Zimbabwe declined as a political center after power shifted north, but its masonry remains evidence of local African state formation rather than foreign construction.',
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
      'The early caliphates reshaped the late antique Near East through new institutions of faith, law, and Arabic administration. From the Umayyad capital at Damascus to the Abbasid courts of Baghdad and Samarra, caliphs claimed succession to the Prophet while ruling populations of varied religious traditions. Congregational mosques reused and transformed Roman and Sasanian urban spaces, while Arabic coinage and chancery practices supported an empire linked by trade from Al-Andalus to the Indian Ocean.\nIn Jerusalem, the Dome of the Rock expressed a sacred geography under Umayyad rule. In Córdoba, the Great Mosque marked the western Umayyads’ development of a separate center of political authority and learning. The period is commonly framed through the Umayyad and Abbasid caliphates, with their capitals, mosques, and imperial institutions, rather than through every later dynastic division.',
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
      'Classical Greece consisted of independent city-states rather than a unified country. Athens, Sparta, Corinth, Thebes, and dozens of other poleis shared Greek language, religious traditions, and competitive political culture, but retained separate governments until Macedon established dominance in the fourth century BCE. Citizen assemblies operated in some cities, although citizenship was limited and excluded women, enslaved people, and resident foreigners.\nReligious sanctuaries and temples were central civic institutions, often serving as treasuries as well as places of worship. Panhellenic sites brought rival communities together for festivals, athletic contests, and religious observances under agreed truces. Philosophy, drama, and historical writing developed alongside widespread slavery and frequent warfare. Greek colonies and trading networks extended across the Black Sea and western Mediterranean, establishing Greek-speaking towns and spreading forms of temple architecture and alphabetic writing.\nThe Persian Wars and the Peloponnesian War shaped the political history of the period. They demonstrated both the capacity of city-states to cooperate against external powers and the destructive rivalries that divided them.',
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
      'The Roman Empire grew from the city of Rome on the Tiber River into a Mediterranean state that moved law, grain, soldiers, and ideas across Europe, North Africa, and western Asia. Its political system relied on infrastructure and administration: roads, ports, aqueducts, surveys, tax records, and military supply networks connected provinces to imperial centers. Roads often remained in use long after the rulers who commissioned them, while aqueducts supported dense urban populations.\nRoman civic buildings, including forums, basilicas, amphitheatres, and public baths, appeared from Britain to North Africa in forms adapted to local conditions. Latin and Greek were major languages of administration and literature. Roman citizenship expanded gradually, eventually extending legal membership beyond any single ethnic group. The empire depended on warfare, taxation, slavery, and the extraction of provincial resources, while also maintaining a large-scale system of cities, armies, laws, and Mediterranean logistics. Its surviving monuments reflect periods of imperial power and confidence, though many now stand as ruins.',
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
      'The Byzantine Empire was the eastern continuation of the Roman Empire, centered on Constantinople, which occupied a peninsula between Europe and Asia and was protected by formidable land and sea walls. As western Roman provinces were lost, the eastern state developed a distinct Greek-speaking Christian character while preserving Roman institutions, imperial titles, and legal traditions. Greek gradually replaced Latin in administration, and Roman law was codified and transmitted through texts such as Justinian’s Corpus Juris Civilis.\nChristianity, particularly Orthodox liturgy and theology, shaped public life, art, and political authority. Constantinople’s hippodrome factions, mosaic-covered churches, ceremonial court, and diplomatic practices reflected the empire’s urban and imperial culture. Trade, warfare, and diplomacy with Persians, Arabs, Slavs, Latin powers, and Turks continually reshaped its territory and institutions. The Ottoman capture of Constantinople in 1453 ended the Byzantine imperial state, but its artistic, religious, and legal influence continued across southeastern Europe, the eastern Mediterranean, and beyond.',
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
      'The Ottoman Empire grew from a northwestern Anatolian principality into a state spanning Europe, Asia, and Africa, surviving for centuries beyond many of its medieval rivals. After the Ottoman conquest of Constantinople in 1453, the city, later known as Istanbul, became the imperial capital, combining Byzantine urban geography with an Islamic dynasty, legal traditions, and systems of patronage.\nIts administration included the millet system, which organized religious communities, and the Janissary corps, a military institution that was at different times a major source of strength and political difficulty. Mosque complexes supported worship, charity, education, and urban life while shaping the skyline of Ottoman cities. Under Süleyman in the sixteenth century, Ottoman rule extended deeply into Europe, the Maghreb, and Arab lands. Later periods brought reform, rivalry, and gradual territorial losses rather than a single moment of collapse. Turkish, Arabic, and Persian literary traditions occupied courtly space alongside Greek, Armenian, Jewish, and Slavic communities that remained part of imperial society.',
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
      'Carthage was a Phoenician foundation on a peninsula near modern Tunis that became Rome’s principal mercantile rival in the western Mediterranean. Its power rested on a network of ports, agricultural estates, trading connections, and alliances extending across North Africa, Iberia, and Mediterranean islands. The city’s harbors served both merchant shipping and war fleets, while its hinterland supplied food and wealth. Carthaginian culture retained Levantine Phoenician roots while developing in North African settings.\nConflict with Rome in the Punic Wars transformed Carthage’s history. Hannibal’s crossing of the Alps during the Second Punic War became its most famous episode, but the broader struggle concerned control of trade routes, territory, and political influence. Rome destroyed Carthage in 146 BCE after the Third Punic War. A Roman city was later established on the same site, where baths, forums, and other Roman buildings stood over the remains of the Punic city.',
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
    slug: 'minoan-crete',
    code: 'MIN',
    name: 'Minoan Crete',
    category: 'Mediterranean',
    subtitle: 'Palace civilization · Crete',
    about:
      'Minoan Crete was a Bronze Age civilization centered on the island of Crete, where multi-storey palace complexes concentrated administration, storage, craft production, and ceremonial life. Knossos, Phaistos, Malia, and Zakros organized agricultural surplus, long-distance exchange, and ritual activity around central courts. Frescoes, fine pottery, and sealstones document a distinctive visual culture of processions, marine motifs, and athletic display. Crete’s position between the Aegean, Egypt, and the Near East supported maritime contacts that moved goods, materials, and artistic ideas across the eastern Mediterranean.\nMinoan writing includes Cretan hieroglyphs and Linear A, which remains undeciphered. After destructions and rebuilding in the mid-second millennium BCE, Mycenaean Greeks gained control of Knossos and introduced Linear B, an early form of Greek used for palace accounts. Palatial centers declined in the later Bronze Age, and political focus in the Aegean shifted toward the mainland. Surviving architecture, archives, and art remain the principal record of Europe’s earliest high civilization.',
    facts: {
      kind: 'Palace civilization',
      heartland: 'Crete · eastern Mediterranean',
      era: 'c. 3000 – 1100 BCE',
      peak: 'Neopalatial period, c. 1700–1450 BCE',
      writing: 'Cretan hieroglyphs; Linear A (undeciphered); later Linear B',
      exploreLinks: ['Greece'],
    },
    features: [
      {
        name: 'Palace of Knossos',
        description:
          'The largest Minoan palace complex near Heraklion — courts, storerooms, and painted rooms long associated with the Labyrinth tradition.',
      },
      {
        name: 'Phaistos Disc',
        description:
          'A fired clay disc impressed with unique spiral signs — an undeciphered Minoan text found at the palace of Phaistos.',
      },
      {
        name: 'Bull-leaping fresco',
        description:
          'A Knossos wall painting of athletes vaulting a bull — the emblematic image of Minoan ceremonial athleticism.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Minoan civilization',
        url: 'https://www.britannica.com/topic/Minoan-civilization',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Minoan Crete',
        url: 'https://www.metmuseum.org/toah/hd/mino/hd_mino.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Minoan Palatial Centres',
        url: 'https://whc.unesco.org/en/list/1733',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mycenaean-greece',
    code: 'MYC',
    name: 'Mycenaean Greece',
    category: 'Mediterranean',
    subtitle: 'Palace kingdoms · mainland Greece',
    about:
      'Mycenaean Greece was the Late Bronze Age civilization of mainland Greece, organized around fortified palace centers such as Mycenae, Tiryns, Pylos, and Thebes. Rulers controlled agricultural estates, craft workshops, and military forces from citadels built with massive cyclopean masonry. Shaft graves and tholos tombs preserved gold masks, weapons, and luxury imports that document an elite society engaged in Aegean and eastern Mediterranean exchange. Mycenaean material culture later became entangled with Homeric memory of the Trojan War and early Greek kingship.\nPalace scribes used Linear B, an early Greek syllabic script, to record rations, personnel, land, and offerings. Mycenaean power extended into the Aegean and, for a time, to Knossos on Crete. In the later thirteenth and twelfth centuries BCE, many palaces were destroyed or abandoned amid wider Mediterranean disruptions. The collapse of the palace system ended this phase of Greek history, though language, place names, and later epic tradition preserved traces of the Mycenaean world.',
    facts: {
      kind: 'Palace kingdoms',
      heartland: 'Peloponnese and mainland Greece · Aegean',
      era: 'c. 1600 – 1100 BCE',
      peak: 'Palatial period, 14th–13th centuries BCE',
      writing: 'Linear B (early Greek)',
      exploreLinks: ['Greece'],
    },
    features: [
      {
        name: 'Lion Gate',
        description:
          'The monumental entrance to Mycenae’s citadel — a relieving triangle with confronted lions above the cyclopean threshold.',
      },
      {
        name: 'Treasury of Atreus',
        description:
          'A vast corbelled tholos tomb near Mycenae — elite burial architecture at the scale of a built mountain chamber.',
      },
      {
        name: 'Grave Circle A',
        description:
          'A royal shaft-grave enclosure inside Mycenae’s walls — the findspot of gold masks and other early Mycenaean elite burials.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mycenaean civilization',
        url: 'https://www.britannica.com/topic/Mycenaean-civilization',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Mycenaean Civilization',
        url: 'https://www.metmuseum.org/toah/hd/myce/hd_myce.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Archaeological Sites of Mycenae and Tiryns',
        url: 'https://whc.unesco.org/en/list/941',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'etruscan',
    code: 'ETR',
    name: 'Etruscan civilization',
    category: 'Mediterranean',
    subtitle: 'Urban civilization · Etruria',
    about:
      'The Etruscan civilization developed in Etruria, the region of central Italy between the Tiber and Arno rivers, where independent city-states built towns, harbors, sanctuaries, and extensive cemeteries. Etruscan elites controlled metal resources, agriculture, and maritime trade linking Italy to Greece, Carthage, and the eastern Mediterranean. Much of what survives comes from tombs: chamber architecture, painted walls, sarcophagi, and rich grave goods that document banqueting, religion, dress, and family identity. Etruscan political influence once reached into Latium and Campania and shaped early Rome.\nEtruscan writing adapted a Greek alphabet and appears mainly in short funerary and dedicatory inscriptions; the language is non-Indo-European and only partly understood. From the fourth century BCE, Roman expansion absorbed Etruscan cities one by one. By the first century BCE, Latin language and Roman institutions dominated the former Etruscan heartland, but engineering, religious practices, and artistic forms borrowed from Etruria remained visible in Roman culture.',
    facts: {
      kind: 'Urban civilization',
      heartland: 'Etruria · central Italy between Tiber and Arno',
      era: 'c. 900 – 100 BCE',
      peak: 'Archaic florescence, 6th century BCE',
      writing: 'Etruscan alphabet (adapted from Greek)',
      exploreLinks: ['Italy'],
    },
    features: [
      {
        name: 'Banditaccia necropolis',
        description:
          'The vast Etruscan cemetery of Cerveteri — tumuli and rock-cut house tombs laid out like a city of the dead.',
      },
      {
        name: 'Sarcophagus of the Spouses',
        description:
          'A terracotta funerary couch from Cerveteri showing a reclining couple — Etruscan banqueting imagery cast as eternal companionship.',
      },
      {
        name: 'Tarquinia tomb frescoes',
        description:
          'Painted chamber tombs of the Monterozzi necropolis — dancers, musicians, and ritual scenes preserving Etruscan pictorial art.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Etruscan',
        url: 'https://www.britannica.com/topic/Etruscan',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Etruscan Art',
        url: 'https://www.metmuseum.org/toah/hd/etru/hd_etru.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Etruscan Necropolises of Cerveteri and Tarquinia',
        url: 'https://whc.unesco.org/en/list/1158',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'phoenicia',
    code: 'PHO',
    name: 'Phoenicia',
    category: 'Mediterranean',
    subtitle: 'Maritime city-states · Levantine coast',
    about:
      'Phoenicia was a network of coastal city-states along the Levantine shore, especially Byblos, Sidon, and Tyre, whose people the Greeks called Phoenicians. Positioned between inland empires and Mediterranean sea lanes, these cities specialized in shipbuilding, purple dye, timber, metals, glass, and long-distance trade. Phoenician merchants and settlers founded colonies and trading posts across the western Mediterranean, including Carthage in North Africa and sites on Cyprus, Sicily, Sardinia, and Iberia. Urban life combined harbors, temples, craft quarters, and royal or oligarchic authority that shifted under Egyptian, Assyrian, Babylonian, and Persian pressure.\nThe Phoenician alphabet, a consonant script adapted and transmitted through trade and colonization, became the ancestor of Greek and later alphabetic systems. Inscriptions on stone, metal, and ivory record kings, dedications, and funerary texts. After Alexander’s conquests and Hellenistic reorganization, distinct Phoenician political independence faded, but Levantine ports and diaspora communities continued within larger imperial frameworks. Archaeology at Byblos, Tyre, and western colonies preserves harbors, temples, tombs, and craft debris from this maritime world.',
    facts: {
      kind: 'Maritime city-states',
      heartland: 'Levantine coast · Lebanon and adjoining Syria',
      era: 'c. 1500 – 300 BCE (as Phoenician city-states)',
      peak: 'Early first-millennium BCE colonial expansion',
      writing: 'Phoenician alphabet',
      exploreLinks: ['Lebanon', 'Syria', 'Tunisia', 'Spain'],
    },
    features: [
      {
        name: 'Byblos ruins',
        description:
          'Layered temples, walls, and harbor remains of one of the oldest Phoenician cities — a long-lived Levantine port of timber and script.',
      },
      {
        name: 'Tyre harbor ruins',
        description:
          'Coastal and submerged remains of Tyre’s island port — the maritime base of a major Phoenician trading power.',
      },
      {
        name: 'Ahiram sarcophagus',
        description:
          'A royal limestone coffin from Byblos bearing an early Phoenician inscription — a landmark in the history of the alphabet.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Phoenicia',
        url: 'https://www.britannica.com/place/Phoenicia',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Phoenician',
        url: 'https://www.metmuseum.org/toah/hd/phoe/hd_phoe.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Byblos',
        url: 'https://whc.unesco.org/en/list/22',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'nuragic-sardinia',
    code: 'NUR',
    name: 'Nuragic Sardinia',
    category: 'Mediterranean',
    subtitle: 'Tower culture · Sardinia',
    about:
      'Nuragic Sardinia was a Bronze and Iron Age culture of the island of Sardinia, named for the nuraghe, dry-stone towers built as truncated cones with corbelled chambers. Thousands of nuraghi still mark the landscape, ranging from single towers to complex multi-tower fortresses with curtain walls and surrounding villages. Communities practiced agriculture, herding, bronze metallurgy, and exchange with Mycenaean, Cypriot, Iberian, and later Phoenician partners. Sacred wells, giant tombs, and bronze figurines document ritual life alongside defensive and residential architecture.\nNuragic society left no indigenous writing system; its record is archaeological. Construction of new nuraghi declined after the Final Bronze Age, but settlements and sanctuaries continued into the Iron Age as Phoenician and Carthaginian contacts intensified. Rome annexed Sardinia in 238 BCE after the First Punic War. Even under Punic and Roman pressure, Nuragic architectural forms and local traditions remained a defining prehistoric signature of the island.',
    facts: {
      kind: 'Tower culture',
      heartland: 'Sardinia · western Mediterranean',
      era: 'c. 1800 – 238 BCE (to Roman annexation)',
      peak: 'Late Bronze Age nuraghe complexes, mid–late 2nd millennium BCE',
      writing: 'No indigenous script; later Punic and Latin',
      exploreLinks: ['Italy'],
    },
    features: [
      {
        name: 'Su Nuraxi',
        description:
          'The complex nuraghe and village at Barumini — the clearest UNESCO-listed example of Nuragic defensive architecture.',
      },
      {
        name: 'Nuraghe Losa',
        description:
          'A well-preserved trilobate nuraghe near Abbasanta — dressed basalt towers and courtyards of a mid-island stronghold.',
      },
      {
        name: 'Santa Cristina well temple',
        description:
          'A precise subterranean sacred well in Paulilatino — Nuragic hydraulic ritual architecture cut in ashlar masonry.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Nuraghic culture',
        url: 'https://www.britannica.com/topic/Nuraghic-culture',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Su Nuraxi di Barumini',
        url: 'https://whc.unesco.org/en/list/833',
        kind: 'catalog',
      },
      {
        label: 'Encyclopaedia Britannica — Sardinia',
        url: 'https://www.britannica.com/place/Sardinia-island-Italy',
        kind: 'reference',
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
      'The Indus Valley civilization developed urban centers characterized by baked-brick construction, covered drains, standardized weights, and elevated citadels above lower towns. Harappa and Mohenjo-daro are its best-known sites, but dozens of settlements extended from Balochistan to Gujarat, connected by river systems and monsoon patterns.\nIts surviving record contains fewer royal inscriptions or monumental claims than those of ancient Egypt and Mesopotamia. Urban organization is instead visible in wells, baths, drainage systems, warehouse platforms, and regular street layouts. The Indus script remains undeciphered, leaving its political institutions uncertain. Archaeological evidence more clearly documents craft production and exchange, including beads, metals, seals, and trade links with Mesopotamian markets. The civilization’s urban decline in the early second millennium BCE varied by region and occurred over time rather than through a single collapse.',
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
      'The Han dynasty shaped institutions and cultural ideas that later periods often treated as distinctly Chinese. Its government relied on a Confucian-trained bureaucracy and developed early forms of imperial recruitment and examination. The dynasty expanded its frontiers, and the name Han remained associated with Chinese ethnic identity. Censuses, granaries, and administrative records supported rule across a large continental empire.\nHan contacts and trade routes extended west through corridors later associated with the Silk Road. Paper, iron tools, and long-distance exchange affected administration and daily life. Tombs preserve another important record of the period, including clay retinues for the afterlife and finely made lacquer goods. Court politics alternated between powerful emperors and the influence of consort families. The dynasty is divided into Western Han and Eastern Han, separated by a disruptive interregnum, but its model of centralized imperial rule remained influential after its fall.',
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
      'The Tang dynasty (618–907) made Chang’an, near present-day Xi’an, a planned imperial capital and a major meeting place for Silk Road trade, Buddhist pilgrims, poets, officials, and foreign communities. Its government developed the civil-service examination system, experimented with equal-field land policies intended to support peasant households, and established frontier protectorates that extended Tang influence into Central Asia.\nBuddhism received changing levels of court support, leaving major monuments including cliff grottoes and large river-carved Buddha images despite periods of suppression. Tang poetry and painting became enduring classical traditions, while Japan and Korea adopted Tang-influenced legal codes, capital plans, and court practices. The An Lushan rebellion of 755–763 weakened the dynasty severely; Tang rule continued until 907, but its political authority contracted amid regional military power, court conflict, and fiscal strain.',
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
      'The Khmer Empire organized the lower Mekong and Tonlé Sap region into a landscape of reservoirs, canals, rice fields, and state temples. Its capital at Angkor was a metropolitan region rather than a single monument, where water management supported agricultural surplus and large-scale construction. Temple-mountains and other religious structures expressed cosmic order while also demonstrating royal authority, labor mobilization, and access to resources.\nKhmer kings claimed divine forms of kingship, and their temples were built chiefly in sandstone and laterite. Indian-derived scripts, Hindu traditions, and later Buddhist cults reached the region through trade and court connections before taking distinct Khmer forms. During the thirteenth through fifteenth centuries, political and religious changes accompanied shifts in capitals and institutions. Sites such as Ta Prohm, where vegetation has grown around stone structures, form part of Angkor’s history but do not represent the full extent of the empire’s hydraulic systems, urban development, and statecraft.',
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
      'The Maurya Empire was the first state to bring most of the Indian subcontinent under a single administration. From Magadha in the Gangetic plain, Chandragupta Maurya and his successors developed roads, intelligence networks, and tax systems across a large and varied territory. Greek ambassadors described the imperial capital, while later Indian traditions remembered the Mauryas as a model of political unity.\nUnder Ashoka, especially after the Kalinga war, imperial communication took a moral and public form. His rock and pillar edicts, written largely in Prakrit, called for restraint, welfare, and religious tolerance while also asserting royal authority. Mauryan material remains include polished sandstone pillars, cave retreats made for Ajivikas, and stupas associated with Buddhist patronage. The empire broke apart within generations of Ashoka’s death, but its use of inscriptions to state and preserve royal policy continued to influence later Indian rulers.',
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
      'The Gupta Empire was a major power in northern India, centered on Magadha and the Gangetic plain. Its rulers governed through a looser imperial system than the earlier Mauryan Empire, relying on feudatory kings, land grants, and political prestige as well as direct administration. The period is closely associated with the development of Sanskrit poetry, mathematical astronomy, Buddhist and Hindu art, and courtly scholarship.\nGupta-era religious art included cave temples, freestanding shrines, and Buddha images marked by balanced, serene proportions. Courts supported dramatists and scholars, while the contemporary Vakataka dynasty patronized the painted caves of Ajanta. Sites such as Udayagiri and Deogarh preserve important examples of early temple architecture, showing the emergence of durable Hindu temple forms. The empire later fragmented amid Hunnic invasions and internal divisions, but its artistic and cultural influence continued long after its political decline.',
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
      'The Chola Empire made the Tamil country a temple-centered maritime power. From the Kaveri delta, Chola kings developed irrigated rice landscapes, built towering stone vimanas, and sent fleets to Sri Lanka and Southeast Asia. The Brihadisvara temple and the other Great Living Chola Temples expressed royal devotion and served as major urban anchors. Bronze sculpture and Tamil literature flourished under court and temple patronage.\nChola administration rested on village assemblies and temple economies as well as military conquest. The empire reached its high point under Rajaraja I and Rajendra I, whose rule extended Chola influence across South India and the Bay of Bengal. Their monuments continue to shape the sacred geography of South India, while the delta’s agricultural systems and the empire’s maritime connections reflect the material basis of Chola power.',
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
      'The Mongol Empire was the largest contiguous land empire in history. Originating in the Orkhon River heartland, Chinggis Khan and his successors extended power across China, Central Asia, Iran, and Eastern Europe through conquest, census administration, legal authority, and a relay-post system known as the Yam. Its political and military capacity rested on horse herds, seasonal pastoral camps, and highly mobile forces and couriers.\nKarakorum was an early imperial capital. As central authority weakened, the empire divided into major khanates: the Yuan dynasty in China, the Ilkhanate in Iran, the Chagatai Khanate in Central Asia, and the Golden Horde in the western Eurasian steppe and Eastern Europe. These states retained Mongol kinship traditions and benefited from trade across former imperial routes. Religious pluralism often reflected practical governance, while merchants and craftsmen could travel under imperial safe-conduct when the network functioned effectively. The thirteenth-century expansion transformed political boundaries and shaped later states from Beijing to Moscow.',
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
      'Classical Japan spans the Heian through Edo periods, when imported continental forms were adapted within an island society. Heian court culture developed poetry, kana writing, and Pure Land Buddhist aesthetics, while later warrior governments continued to depend on Kyoto’s cultural authority. The Tokugawa period established a long peace, formalized status distinctions, and supported the growth of castle towns and urban consumption without creating a continental empire.\nIts physical and cultural landscape included shrine and temple precincts, Kyoto court institutions, and castle-centered cities. Byōdō-in’s Phoenix Hall expresses Heian Pure Land ideals in architecture. Muromachi Zen institutions and Ashikaga patronage influenced gardens and ink painting, while Edo-period castles and cities structured Tokugawa political order. Shinto and Buddhism were commonly intertwined in institutions and practice. Chinese classical learning remained important alongside kana vernacular literature, and the Edo government restricted foreign contact while maintaining selective trade.',
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
      'The Olmec were an early complex society of Mesoamerica’s Gulf lowlands, active at ceremonial centers including San Lorenzo and La Venta. These sites contained earthen platforms, drainage systems, offerings, and other large-scale construction centuries before the avenues of Teotihuacan. The Olmec are widely associated with colossal basalt heads, generally understood as portraits of rulers, as well as jade objects and a distinctive ceremonial art style.\nTrade in obsidian, serpentine, and other prestige goods connected Gulf Coast communities with the Mexican highlands. Later Mesoamerican writing and calendar traditions have sometimes been linked to possible Olmec precedents, though the extent of that connection remains debated. Clear evidence includes substantial organized labor, long-distance exchange, and a shared visual language of rulership and ceremonial power.',
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
      'Teotihuacan was an early Mesoamerican metropolis in the Basin of Mexico, built as a planned city of broad avenues, apartment compounds, pyramids, and ceremonial precincts. Its influence extended far beyond the basin through trade, religious imagery, and urban models. Although its rulers and principal ethnic identity remain uncertain, the city’s layout reflects deliberate planning, centered on the Avenue of the Dead and the Pyramid of the Sun and Pyramid of the Moon.\nThe city contained multiethnic neighborhoods, obsidian workshops, and extensive trade connections. Murals and temple sculpture expressed a religious visual language recognized by later Mesoamerican peoples. Teotihuacan’s urban core declined and was largely abandoned in the mid-first millennium CE. Centuries later, Aztec pilgrims visited its ruins and associated them with myths of cosmic and ancestral origins.',
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
      'Maya civilization consisted of many city-states rather than a single unified empire. These centers lay across the lowland forests and highland valleys of Mesoamerica and included Tikal, Calakmul, Palenque, Copán, and, later, Chichén Itzá. They competed and traded with one another while sharing religious traditions, calendrical systems, and close attention to astronomical cycles.\nDuring the Classic period, Maya rulers commissioned pyramids, palaces, stone monuments, calendars, and dynastic inscriptions. Agriculture based on maize, including intensive wetland cultivation and terracing in some regions, supported dense populations and royal courts. Long-distance exchange moved materials such as jade, obsidian, and salt. Ritual ceremonies were central to political authority.\nMaya writing is a logosyllabic system that records personal names, historical events, dates, and religious ideas. Its decipherment has greatly expanded knowledge of Maya history. The decline and abandonment of many southern lowland cities involved several interacting political, environmental, and economic factors. Maya peoples, communities, and languages continued beyond those changes and remain present across Mesoamerica.',
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
      'The Aztec, more precisely the Mexica and their Triple Alliance partners, built a tribute empire from Tenochtitlan, an island capital in the Basin of Mexico. Causeways, chinampa farms, and a twin-temple precinct transformed the lake setting into a major metropolis. Tlatelolco was a center of market exchange, while warfare, including captive-taking and flower wars, formed part of imperial politics. Calendar cosmology was expressed in basalt monuments, and Nahuatl poetry and pictorial books preserved memory alongside tribute records.\nThe empire rose during the fourteenth and fifteenth centuries and depended on subject cities whose allegiance could be unstable. In 1521, Tenochtitlan ceased to be a Mexica capital, but Mexica cultural traditions remained visible in Nahuatl language, cuisine, architecture, and stone monuments.',
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
      'The Inca Empire, known as Tawantinsuyu or the fourfold realm, united much of the Andes through roads, storehouses, and state-directed resettlement. From Cusco, its rulers extended authority across highland valleys, the Pacific coast, and the edges of the Amazon. The state drew heavily on labor service, or mit’a, rather than coined taxation.\nIts economy relied on the management of varied elevations and climates. Terrace farming, freeze-dried potatoes, llama caravans, and finely fitted stone construction supported settlements across difficult terrain. Quipu cords recorded accounts without a fully phonetic script, while Quechua spread as a language of administration. Machu Picchu is a prominent ridge estate, and Sacsayhuamán and Qorikancha reflect Cusco’s military and solar religious importance. Spanish conquest rapidly broke imperial rule, but Andean communities, agricultural systems, and technologies continued.',
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
    slug: 'mississippian',
    code: 'MIS',
    name: 'Mississippian culture',
    category: 'Americas',
    subtitle: 'Mound-building culture · Mississippi valley',
    about:
      'Mississippian culture was a maize-farming tradition of the southeastern and mid-continental river valleys of North America, flourishing from about 700 CE into the era of early European contact. Communities built platform mounds, plazas, and planned towns supported by corn, beans, and squash agriculture on fertile bottomlands. Political life often centered on mound towns whose leaders coordinated ritual, redistribution, and warfare across satellite villages. Cahokia, near present-day St. Louis, was the largest of these centers and for a time among the most populous settlements north of Mexico.\nShell-tempered pottery, copper ornaments, and engraved marine shell belong to a shared ceremonial vocabulary sometimes called the Southeastern Ceremonial Complex. There was no phonetic writing system; social memory and ideology were carried through oral tradition and material symbols. Regional Mississippian societies persisted in varied forms after Cahokia’s decline, and Spanish and later colonial encounters recorded descendant mound-building and agricultural communities across the Southeast.',
    facts: {
      kind: 'Mound-building culture',
      heartland: 'Mississippi and southeastern river valleys · North America',
      era: 'c. 700 – 1600 CE',
      peak: 'Cahokia florescence, c. 1050–1200 CE',
      writing: 'Oral tradition; iconographic shell and copper art',
      exploreLinks: ['United States'],
    },
    features: [
      {
        name: 'Monks Mound',
        description:
          'The largest prehistoric earthen mound north of Mexico — a terraced platform that dominated Cahokia’s central precinct.',
      },
      {
        name: 'Cahokia Woodhenge',
        description:
          'A reconstructed circle of wooden posts near Monks Mound — an astronomical marker aligned to solstice sunrises.',
      },
      {
        name: 'Etowah Mounds',
        description:
          'A major Mississippian mound center in Georgia — platforms, plaza, and elite burials of a southeastern chiefdom.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mississippian culture',
        url: 'https://www.britannica.com/topic/Mississippian-culture',
        kind: 'reference',
      },
      {
        label: 'Encyclopaedia Britannica — Cahokia Mounds',
        url: 'https://www.britannica.com/place/Cahokia-Mounds',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cahokia Mounds State Historic Site',
        url: 'https://whc.unesco.org/en/list/198',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'ancestral-puebloan',
    code: 'PUE',
    name: 'Ancestral Puebloan',
    category: 'Americas',
    subtitle: 'Pueblo tradition · Four Corners',
    about:
      'Ancestral Puebloan peoples developed settled farming communities across the Four Corners region of the Colorado Plateau, where Arizona, New Mexico, Colorado, and Utah meet. They cultivated maize, beans, and squash, built pit houses and later masonry pueblos, and organized ceremonial life around kivas. Between the tenth and thirteenth centuries, great houses in Chaco Canyon and cliff dwellings at Mesa Verde concentrated population, storage, and ritual architecture in distinctive canyon and mesa settings. Roads, turquoise exchange, and shared architectural forms linked widely spaced communities.\nSevere drought, resource stress, and social reorganization contributed to large-scale migration from many cliff dwellings and canyon centers after about 1300 CE. Descendants continued Pueblo traditions in the Rio Grande valley and on western mesas, including Hopi, Zuni, Acoma, and other Pueblo peoples. Earlier scholarship used the Navajo-derived term Anasazi; Ancestral Puebloan is the preferred designation linking archaeological cultures to living communities. The material record remains architectural, ceramic, and agricultural rather than textual.',
    facts: {
      kind: 'Pueblo tradition',
      heartland: 'Four Corners · Colorado Plateau',
      era: 'c. 100 – 1600 CE',
      peak: 'Chacoan and Pueblo III florescences, 11th–13th centuries',
      writing: 'Oral tradition; later Spanish records of descendant Pueblos',
      exploreLinks: ['United States'],
    },
    features: [
      {
        name: 'Cliff Palace',
        description:
          'The largest cliff dwelling at Mesa Verde — a sandstone alcove village of rooms, towers, and kivas sheltered by the canyon wall.',
      },
      {
        name: 'Pueblo Bonito',
        description:
          'Chaco Canyon’s great house — a D-shaped masonry complex of hundreds of rooms at the heart of the Chacoan system.',
      },
      {
        name: 'White House Ruin',
        description:
          'A multi-storey cliff dwelling in Canyon de Chelly — Ancestral Puebloan masonry set against a sheer Navajo Nation canyon face.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ancestral Pueblo culture',
        url: 'https://www.britannica.com/topic/Ancestral-Pueblo-culture',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mesa Verde National Park',
        url: 'https://whc.unesco.org/en/list/27',
        kind: 'catalog',
      },
      {
        label: 'Encyclopaedia Britannica — Chaco Culture National Historical Park',
        url: 'https://www.britannica.com/place/Chaco-Culture-National-Historical-Park',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'chavin',
    code: 'CHA',
    name: 'Chavín',
    category: 'Americas',
    subtitle: 'Religious horizon · northern Andes',
    about:
      'Chavín was an early Horizon culture of the north-central Peruvian Andes, named for the ceremonial center of Chavín de Huántar in the Ancash highlands. Between about 900 and 200 BCE, related religious imagery and architectural forms spread across highland and coastal regions of northern and central Peru. The site functioned as a pilgrimage and oracle center, drawing visitors into stone temples with interior galleries, canals, and carved monuments. Its art fused human, feline, bird, and serpent traits into a dense sacred visual language.\nChavín influence appears on ceramics, textiles, metalwork, and stone far from the highland center, suggesting shared cult ideas rather than a single territorial empire. There was no phonetic writing system; ideology was communicated through architecture and iconography. As Chavín power waned, regional societies diversified along the coast and in the highlands. The site remains one of the clearest early expressions of pan-Andean ceremonial complexity before later states such as Moche, Wari, and Inca.',
    facts: {
      kind: 'Religious horizon',
      heartland: 'North-central Peruvian Andes · Ancash',
      era: 'c. 900 – 200 BCE',
      peak: 'Chavín de Huántar florescence, first millennium BCE',
      writing: 'Iconographic stone programs; no phonetic script',
      exploreLinks: ['Peru'],
    },
    features: [
      {
        name: 'Chavín de Huántar',
        description:
          'The highland ceremonial center of galleries, plazas, and stone temples — the namesake pilgrimage hub of the Chavín horizon.',
      },
      {
        name: 'Lanzón monolith',
        description:
          'A tall granite idol set deep within the Old Temple — a fanged staff-bearing deity at the axis of Chavín ritual space.',
      },
      {
        name: 'Circular plaza',
        description:
          'A sunken round court before the temple façades — a gathering stage lined with carved stone for processions and offerings.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Chavín',
        url: 'https://www.britannica.com/topic/Chavin',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Dualism in Andean Art',
        url: 'https://www.metmuseum.org/toah/hd/dual/hd_dual.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Chavin (Archaeological Site)',
        url: 'https://whc.unesco.org/en/list/330',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'moche',
    code: 'MOC',
    name: 'Moche',
    category: 'Americas',
    subtitle: 'Coastal kingdoms · northern Peru',
    about:
      'The Moche were an Andean civilization of Peru’s northern desert coast, flourishing from about the first to the eighth century CE along river valleys from Lambayeque to Nepeña. Irrigation canals drawn from Andean runoff supported maize, beans, and other crops in an otherwise arid landscape. Urban and ceremonial life clustered around adobe platform mounds, where murals, sacrifices, and elite rituals reinforced political and religious authority. Moche artisans produced highly modeled and fineline-painted ceramics, metal ornaments, and textile work that narrate warfare, ceremony, and daily scenes with unusual clarity.\nPolitical power appears to have been regional rather than fully unified, with valley centers sharing style and ideology. The royal tombs at Sipán revealed rulers buried with gold, silver, copper, shell, and attendant sacrifices. Environmental stress, including severe El Niño flooding, and internal change contributed to the transformation of Moche societies in later centuries. Successor north-coast cultures retained aspects of Moche technology and imagery within new political orders.',
    facts: {
      kind: 'Coastal kingdoms',
      heartland: 'Northern Peruvian coast · Moche and Lambayeque valleys',
      era: 'c. 100 – 800 CE',
      peak: 'Southern and northern Moche florescences, 1st–8th centuries CE',
      writing: 'Narrative ceramic and mural imagery; no phonetic script',
      exploreLinks: ['Peru'],
    },
    features: [
      {
        name: 'Huaca de la Luna',
        description:
          'An adobe ceremonial platform near Trujillo — polychrome reliefs and sacrifice contexts of a major Moche temple complex.',
      },
      {
        name: 'Lord of Sipán tomb',
        description:
          'A richly furnished royal burial in the Lambayeque Valley — gold, silver, and regalia that redefined Moche elite archaeology.',
      },
      {
        name: 'Huaca del Sol',
        description:
          'The enormous adobe platform opposite Huaca de la Luna — once among the largest mudbrick monuments of the Americas.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Moche',
        url: 'https://www.britannica.com/topic/Moche',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Ancient Andean Metalworking',
        url: 'https://www.metmuseum.org/toah/hd/ande_en/hd_ande_en.htm',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Dualism in Andean Art',
        url: 'https://www.metmuseum.org/toah/hd/dual/hd_dual.htm',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tiwanaku',
    code: 'TIW',
    name: 'Tiwanaku',
    category: 'Americas',
    subtitle: 'Highland state · Lake Titicaca',
    about:
      'Tiwanaku was a major pre-Columbian civilization centered near the southern shore of Lake Titicaca in what is now Bolivia, with influence extending into southern Peru and neighboring highland and valley zones. From a planned ceremonial and urban core, its leaders coordinated agriculture on the altiplano, including raised fields adapted to frost and poor drainage, and maintained long-distance exchange in obsidian, metals, and prestige goods. Monumental sandstone and andesite architecture, finely cut ashlar, and carved gateways expressed a state ideology visible far beyond the capital.\nAt its Middle Horizon height, Tiwanaku shared stylistic and religious connections with the Wari sphere farther north in Peru, though the two states remained distinct. There was no phonetic writing system; political and sacred messages were carried in stone sculpture, ceramics, and textiles. After about 1000 CE the capital declined amid climatic stress and political fragmentation. Later Andean societies, including the Inca, regarded the ruins as an ancestral and sacred landscape.',
    facts: {
      kind: 'Highland state',
      heartland: 'Southern Lake Titicaca basin · Bolivia and southern Peru',
      era: 'c. 200 BCE – 1000 CE',
      peak: 'Middle Horizon expansion, c. 500–1000 CE',
      writing: 'Iconographic stone programs; no phonetic script',
      exploreLinks: ['Bolivia', 'Peru'],
    },
    features: [
      {
        name: 'Gate of the Sun',
        description:
          'A monolithic andesite gateway carved with the Staff God and winged attendants — Tiwanaku’s most famous religious monument.',
      },
      {
        name: 'Kalasasaya',
        description:
          'A large rectangular ritual platform of upright stones and ashlar walls — the ceremonial court framing the Gate of the Sun.',
      },
      {
        name: 'Akapana',
        description:
          'A stepped pyramid-platform of earth and cut stone — the dominant artificial mountain of Tiwanaku’s sacred core.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Tiwanaku',
        url: 'https://www.britannica.com/place/Tiwanaku',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Tiwanaku: Spiritual and Political Centre',
        url: 'https://whc.unesco.org/en/list/567',
        kind: 'catalog',
      },
      {
        label: 'Metropolitan Museum — Dualism in Andean Art',
        url: 'https://www.metmuseum.org/toah/hd/dual/hd_dual.htm',
        kind: 'reference',
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
      'Polynesia is a region and cultural network of related peoples, languages, and voyaging traditions spread across the Pacific Ocean. Its broad triangular extent reaches from Hawaiʻi in the north to Aotearoa (New Zealand) in the southwest and Rapa Nui (Easter Island) in the southeast, with Tonga and Samoa among its western anchors. Maritime travel and genealogy have long connected islands through double-hulled canoes, star navigation, and oral histories that describe the sea as a network of kinship rather than a barrier between isolated lands.\nPolynesian societies developed distinct local forms of ritual and monumental architecture. These include the moai and ceremonial ahu of Rapa Nui, Tongan trilithons and burial mounds, and Hawaiian heiau platforms. Shared roots among Polynesian languages reflect long-standing connections across the region. European contact brought severe political and demographic disruption, including disease, colonial rule, and altered systems of authority, but Polynesian cultures continued and changed within these conditions.',
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
  {
    slug: 'maori',
    code: 'MAO',
    name: 'Māori',
    category: 'Oceania',
    subtitle: 'Aotearoa · Polynesian settlement',
    about:
      'Māori civilization is the Polynesian settlement and continuing culture of Aotearoa, New Zealand. Māori ancestors arrived by ocean voyaging and developed interconnected iwi and hapū communities across the North and South Islands. Genealogy and territory are central to social life, with mountains and rivers understood as ancestors and sources of identity.\nFortified pā were built on volcanic cones, ridges, and other defensible landforms. Marae, including carved meeting houses, remain important places for kinship, ceremony, discussion, and ritual. Oral literature, carving, weaving, and performing arts preserve law, history, and collective memory alongside written Māori and English traditions. The Treaty of Waitangi, signed in 1840, and its contested consequences reshaped political relations without ending Māori nationhood.',
    facts: {
      kind: 'Island Polynesian society',
      heartland: 'Aotearoa / New Zealand',
      era: 'Settlement from c. 1250–1300 CE; enduring culture',
      peak: 'Classic Māori florescence c. 1500–1800 CE; continuous present',
      writing: 'Oral tradition; later written Māori in Latin script',
      exploreLinks: ['New Zealand'],
    },
    features: [
      {
        name: 'Te Whare Rūnanga',
        description:
          'The carved meeting house at Waitangi — a modern marae landmark of Māori ceremonial architecture on the treaty grounds.',
      },
      {
        name: 'Waitangi Treaty Grounds',
        description:
          'The national reserve where the 1840 Treaty of Waitangi was first signed — political geography still central to Aotearoa.',
      },
      {
        name: 'Maungakiekie',
        description:
          'One Tree Hill in Tāmaki Makaurau — a volcanic cone pā landscape of terraces and ditches above Auckland.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Māori',
        url: 'https://www.britannica.com/topic/Maori',
        kind: 'reference',
      },
      {
        label: 'Te Ara — Story: Māori',
        url: 'https://teara.govt.nz/en/maori',
        kind: 'agency',
      },
      {
        label: 'Waitangi Treaty Grounds',
        url: 'https://www.waitangi.org.nz/',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aboriginal-australia',
    code: 'ABD',
    name: 'Aboriginal Australia',
    category: 'Oceania',
    subtitle: 'Continental cultures · deep time',
    about:
      'Aboriginal Australia encompasses the continent’s First Peoples: hundreds of nations with distinct languages, Law, and relationships to Country extending into deep time. Cultural knowledge is embedded in landscapes through songlines linking waterholes, ranges, and other places; rock art recording ceremony, ancestral narratives, and ecology; and sacred sites including Uluru and Kata Tjuta, where geology, kinship, and Law are closely connected.\nAboriginal societies have developed in coastal, desert, riverine, and tropical environments and differ greatly between regions. Many maintain long traditions of fire management, trade, and oral knowledge. British colonization from 1788 onward caused severe disruption to populations and land tenure, but Aboriginal cultures, communities, languages, and connections to Country continued.',
    facts: {
      kind: 'Continental Indigenous network',
      heartland: 'Australian continent and surrounding islands',
      era: 'Deep time settlement (tens of thousands of years); enduring cultures',
      peak: 'Regional florescences across deep time; continuous present',
      writing: 'Oral tradition, rock art, later Latin-script Aboriginal languages',
      exploreLinks: ['Australia'],
    },
    features: [
      {
        name: 'Uluru',
        description:
          'The great sandstone monolith of Anangu Country — a sacred and geographic centerpiece of central Australia.',
      },
      {
        name: 'Ubirr rock art',
        description:
          'Painted galleries in Kakadu — layered figures and x-ray styles recording ceremony, animals, and long occupation.',
      },
      {
        name: 'Kata Tjuta',
        description:
          'The clustered domes west of Uluru — another Anangu sacred massif in the same desert basin.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Australian Aboriginal peoples',
        url: 'https://www.britannica.com/topic/Australian-Aboriginal',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Uluru-Kata Tjuta National Park',
        url: 'https://whc.unesco.org/en/list/447',
        kind: 'catalog',
      },
      {
        label: 'UNESCO — Kakadu National Park',
        url: 'https://whc.unesco.org/en/list/147',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'melanesia',
    code: 'MEL',
    name: 'Melanesia',
    category: 'Oceania',
    subtitle: 'Island mosaic · Lapita to present',
    about:
      'Melanesia is a region of western Pacific islands including Papua New Guinea, the Solomon Islands, Vanuatu, New Caledonia, and Fiji. It contains exceptional linguistic diversity and agricultural traditions with deep histories. Its landscapes include New Guinea highland valleys, tropical forests, coasts, and coral islands, and its societies range from densely settled valley communities to island chiefdoms.\nCeremonial architecture, including haus tambaran and other ceremonial houses, has been central to many local social and religious traditions. Lapita pottery provides an archaeological record of early Oceanic expansion and ancestry across parts of the region. Trade networks linking highland and island communities existed long before colonial borders. Melanesia is not a single polity but a region of related and neighboring societies. European colonialism, missionary activity, and indenture-era labor systems reshaped work, settlement, and religious life without eliminating local cosmologies, village forms, or ceremonial practices.',
    facts: {
      kind: 'Island mosaic',
      heartland: 'Western Pacific · New Guinea to Fiji',
      era: 'Lapita expansion c. 1500–500 BCE; enduring cultures',
      peak: 'Regional florescences vary by island and valley; continuous present',
      writing: 'Oral tradition; later Latin scripts; archaeological Lapita ceramics',
      exploreLinks: [
        'Papua New Guinea',
        'Fiji',
        'Vanuatu',
        'Solomon Islands',
        'France',
      ],
    },
    features: [
      {
        name: 'Haus Tambaran',
        description:
          'Towering spirit houses of the Sepik–Maprik region — painted façades that stage initiation and ancestral presence.',
      },
      {
        name: 'Navala',
        description:
          'A highland Fijian village of thatched bure — living vernacular architecture in the Nausori Highlands.',
      },
      {
        name: 'Lapita pottery',
        description:
          'Dentate-stamped ceramics of the Lapita cultural complex — the archaeological trail of early Oceanic voyaging.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Melanesian culture',
        url: 'https://www.britannica.com/topic/Melanesian-culture',
        kind: 'reference',
      },
      {
        label: 'Metropolitan Museum — Melanesia',
        url: 'https://www.metmuseum.org/toah/hd/mela/hd_mela.htm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Chief Roi Mata’s Domain',
        url: 'https://whc.unesco.org/en/list/1280',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'micronesian-cultures',
    code: 'MIC',
    name: 'Micronesian cultures',
    category: 'Oceania',
    subtitle: 'Coral & basalt · western Pacific',
    about:
      'Micronesian cultures encompass small islands and wide ocean areas in the western Pacific, including the Caroline Islands, Mariana Islands, Marshall Islands, and Kiribati. Their built forms and ceremonial objects include the stone money of Yap, the latte house-posts of the Marianas, and Nan Madol, a basalt islet city off Pohnpei. Seafaring, reef fishing, and ranked exchange connected communities across long distances between coral atolls and volcanic high islands.\nSpanish, German, Japanese, and United States colonial rule divided the region under different administrations. Despite these changes, many communities retained canoe-building and navigation knowledge, chiefly systems, and distinct island arts. Megalithic platforms, stone currency, and latte architecture remain prominent material expressions of Micronesian history and culture.',
    facts: {
      kind: 'Oceanic island network',
      heartland: 'Western Pacific · Caroline, Mariana, Marshall, and Kiribati seas',
      era: 'Settlement across millennia BCE–CE; enduring cultures',
      peak: 'Regional florescences (e.g. Nan Madol period); continuous present',
      writing: 'Oral tradition; later Latin scripts',
      exploreLinks: [
        'Micronesia',
        'Palau',
        'Marshall Islands',
        'Kiribati',
        'United States',
        'Nauru',
      ],
    },
    features: [
      {
        name: 'Nan Madol',
        description:
          'A basalt-walled islet city off Pohnpei — canals and platforms of a former chiefly center in the Carolines.',
      },
      {
        name: 'Yap stone money',
        description:
          'Massive rai disks quarried in Palau and valued on Yap — monumental currency in an island exchange system.',
      },
      {
        name: 'Latte stones',
        description:
          'Pillar-and-cap house supports of the Marianas — stone architecture tied to ancestral Chamorro settlement.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Micronesian culture',
        url: 'https://www.britannica.com/topic/Micronesian-culture',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Nan Madol: Ceremonial Centre of Eastern Micronesia',
        url: 'https://whc.unesco.org/en/list/1503',
        kind: 'catalog',
      },
      {
        label: 'Metropolitan Museum — Micronesia',
        url: 'https://www.metmuseum.org/toah/hd/micr/hd_micr.htm',
        kind: 'reference',
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
