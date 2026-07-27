/** Sixteenth curated wave of Explore place guides. */

type PlaceKind = 'City' | 'State' | 'Island' | 'Region' | 'Landmark'

export type PlaceGuideDraftBatch = {
  slug: string
  code: string
  name: string
  kind: PlaceKind
  countrySlug: string
  subtitle: string
  matchNames: string[]
  about: string
  facts: {
    kind: PlaceKind
    country: string
    region: string
    setting: string
    role: string
    knownFor: string
  }
  features: [
    { name: string; description: string },
    { name: string; description: string },
    { name: string; description: string },
  ]
  sources: Array<{
    label: string
    url: string
    kind: 'place' | 'reference' | 'authority'
  }>
}

export const placeGuideDraftsBatch16: PlaceGuideDraftBatch[] = [
  {
    slug: 'buffalo',
    code: 'BUF',
    name: 'Buffalo',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Buffalo'],
    about:
      'Buffalo sits at the eastern end of Lake Erie where the Niagara River begins its short run toward the falls, a Great Lakes city of grain-elevator silhouettes, brick warehouses, and a revitalized waterfront. Lake-effect snow shapes winters; humid summers open park and harbor life. Start with the lake and river mouth, then the downtown grid inland. Buffalo’s primer is Erie outlet city — a lakeport of industrial heritage facing the Niagara corridor.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Erie · Niagara River outlet',
      role: 'Western New York lakeport and metro hub',
      knownFor: 'Lake Erie waterfront, grain elevators, and Niagara corridor',
    },
    features: [
      {
        name: 'Lake Erie shore',
        description:
          'Harbor and waterfront of the eastern lake end.',
      },
      {
        name: 'Grain elevators',
        description:
          'Industrial silhouettes of the historic port.',
      },
      {
        name: 'Niagara outlet',
        description:
          'The river beginning its short run north.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Buffalo',
        url: 'https://www.britannica.com/place/Buffalo-New-York',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'anchorage',
    code: 'ANC',
    name: 'Anchorage',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Anchorage'],
    about:
      'Anchorage occupies a broad coastal plain between Cook Inlet and the Chugach Mountains as Alaska’s largest city, a rail and aviation hub under snow peaks and long summer daylight. Downtown faces the inlet; trails climb quickly into alpine terrain. Extreme seasonal light and cold winters define the year. Read inlet mudflats, urban grid, and mountain wall as one composition. Anchorage’s primer is inlet-and-range city — an Alaskan metro pressed between tidal flats and Chugach summits.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Cook Inlet · Chugach Mountains',
      role: 'Alaska’s largest city and transport hub',
      knownFor: 'Cook Inlet setting, Chugach backdrop, and long summer light',
    },
    features: [
      {
        name: 'Cook Inlet',
        description:
          'Tidal flats and waterfront facing the inlet.',
      },
      {
        name: 'Chugach wall',
        description:
          'Mountain ridges rising east of the city.',
      },
      {
        name: 'Trail access',
        description:
          'Quick approaches from town into alpine country.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Anchorage',
        url: 'https://www.britannica.com/place/Anchorage-Alaska',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'albuquerque',
    code: 'ABQ',
    name: 'Albuquerque',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Albuquerque'],
    about:
      'Albuquerque spreads along the Rio Grande beneath the Sandia Mountains in New Mexico as a high-desert city of adobe textures, balloon-filled autumn skies, and a long north–south valley axis. Old Town and downtown organize the historic core; the mountains catch evening light in pink stone. Dry air and strong sun dominate most months. Orient by river, valley floor, and Sandia crest. Albuquerque’s primer is Rio Grande desert city — adobe and mesa light under a sudden mountain wall.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Rio Grande · Sandia Mountains',
      role: 'New Mexico’s largest city and high-desert metro',
      knownFor: 'Sandia backdrop, Rio Grande valley, and adobe Old Town',
    },
    features: [
      {
        name: 'Sandia Mountains',
        description:
          'The eastern wall catching sunset color.',
      },
      {
        name: 'Rio Grande valley',
        description:
          'The river corridor through the metro.',
      },
      {
        name: 'Old Town',
        description:
          'Adobe plaza fabric of the historic core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Albuquerque',
        url: 'https://www.britannica.com/place/Albuquerque',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saskatoon',
    code: 'YXE',
    name: 'Saskatoon',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Saskatoon'],
    about:
      'Saskatoon straddles the South Saskatchewan River on the Canadian prairies as a bridges-and-bluffs city of university life, river parks, and wide winter skies. Downtown and Nutana face each other across the channel; cold seasons dominate the calendar. Begin with the river bridges and bluff parks, then the prairie grid beyond. Saskatoon’s primer is prairie river city — a bridged South Saskatchewan hub under continental light.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'South Saskatchewan River · prairies',
      role: 'Saskatchewan’s largest city and prairie hub',
      knownFor: 'River bridges, bluff parks, and prairie setting',
    },
    features: [
      {
        name: 'River bridges',
        description:
          'Spans linking both banks of the city.',
      },
      {
        name: 'Bluff parks',
        description:
          'Green corridors along the river edges.',
      },
      {
        name: 'Prairie grid',
        description:
          'Open farmland surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Saskatoon',
        url: 'https://www.britannica.com/place/Saskatoon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ushuaia',
    code: 'USH',
    name: 'Ushuaia',
    kind: 'City',
    countrySlug: 'argentina',
    subtitle: 'City · Argentina',
    matchNames: ['Ushuaia'],
    about:
      'Ushuaia faces the Beagle Channel at the southern tip of Argentine Tierra del Fuego as a port of mountains-to-sea streets, Antarctic expedition staging, and windy subpolar light. The Martial range rises behind the town; ferries and ships fill the channel approaches. Cool summers and long winters shape the year. Read channel, town shelf, and mountain wall together. Ushuaia’s primer is Beagle Channel gateway — a Fuegian port where Andes slopes meet the far southern sea.',
    facts: {
      kind: 'City',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Beagle Channel · Tierra del Fuego',
      role: 'Southern port and Antarctic gateway city',
      knownFor: 'Beagle Channel, Martial mountains, and Fuegian setting',
    },
    features: [
      {
        name: 'Beagle Channel',
        description:
          'The waterway facing the town waterfront.',
      },
      {
        name: 'Martial mountains',
        description:
          'Peaks rising immediately behind the streets.',
      },
      {
        name: 'Port shelf',
        description:
          'The narrow urban terrace between mountain and sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ushuaia',
        url: 'https://www.britannica.com/place/Ushuaia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'la-serena',
    code: 'LSC',
    name: 'La Serena',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['La Serena'],
    about:
      'La Serena occupies Chile’s Norte Chico coast as a colonial-plan city of churches, long Pacific beaches, and clear desert-edge skies that favor observatories inland. The historic center keeps a grid of low stone and plaster; dunes and shore stretch south toward Coquimbo’s bay system. Mild coastal fog and dry inland air share the year. Orient from plaza and beach avenue toward the arid hinterland. La Serena’s primer is Norte Chico beach city — colonial streets under clear Pacific and desert-edge light.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'Pacific coast · Norte Chico',
      role: 'Regional capital and coastal colonial city',
      knownFor: 'Colonial grid, Pacific beaches, and clear skies',
    },
    features: [
      {
        name: 'Colonial grid',
        description:
          'Plaza and church streets of the historic center.',
      },
      {
        name: 'Pacific beaches',
        description:
          'Long sandy shores of the city coast.',
      },
      {
        name: 'Desert-edge light',
        description:
          'Clear skies toward inland observatory country.',
      },
    ],
    sources: [
      {
        label: 'Britannica — La Serena',
        url: 'https://www.britannica.com/place/La-Serena',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'belem',
    code: 'BEL',
    name: 'Belém',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Belém', 'Belem'],
    about:
      'Belém stands near the Amazon River’s Atlantic mouth in Pará as a humid equatorial port of verandas, markets, and river islands at the forest’s edge. The Ver-o-Peso market and colonial waterfront organize daily commerce; tropical rain and heat dominate the calendar. Begin with the river mouth approaches and historic docks, then the inland neighborhoods. Belém’s primer is Amazon estuary city — a Pará port where market life meets the great river’s Atlantic gate.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Amazon estuary · Pará',
      role: 'Amazon gateway port and Pará capital',
      knownFor: 'River mouth setting, Ver-o-Peso market, and equatorial climate',
    },
    features: [
      {
        name: 'Estuary waterfront',
        description:
          'Docks and shores near the Amazon mouth.',
      },
      {
        name: 'Ver-o-Peso',
        description:
          'The historic river market complex.',
      },
      {
        name: 'Equatorial humidity',
        description:
          'Heat and rain of the forest-edge climate.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Belém',
        url: 'https://www.britannica.com/place/Belem-Brazil',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rijeka',
    code: 'RJK',
    name: 'Rijeka',
    kind: 'City',
    countrySlug: 'croatia',
    subtitle: 'City · Croatia',
    matchNames: ['Rijeka'],
    about:
      'Rijeka occupies a deep Adriatic bay beneath inland highlands as Croatia’s principal northern port, a working harbor city of cranes, Korzo promenade life, and a steep hinterland. The Rječina valley pinches the urban shelf; island and Istrian routes fan from the bay. Mild winters and warm summers favor outdoor streets. Orient from harbor and Korzo up the hillside quarters. Rijeka’s primer is Kvarner port city — a busy Adriatic bay under highland walls.',
    facts: {
      kind: 'City',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Kvarner Bay · northern Adriatic',
      role: 'Major Croatian port and Kvarner hub',
      knownFor: 'Deep harbor, Korzo promenade, and highland backdrop',
    },
    features: [
      {
        name: 'Deep harbor',
        description:
          'The working bay and port infrastructure.',
      },
      {
        name: 'Korzo',
        description:
          'The main pedestrian promenade of the center.',
      },
      {
        name: 'Highland backdrop',
        description:
          'Steep ground rising inland from the bay.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rijeka',
        url: 'https://www.britannica.com/place/Rijeka',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'podgorica',
    code: 'TGD',
    name: 'Podgorica',
    kind: 'City',
    countrySlug: 'montenegro',
    subtitle: 'City · Montenegro',
    matchNames: ['Podgorica'],
    about:
      'Podgorica occupies a broad plain at river junctions in central Montenegro as the national capital, a low-rise city of Moraca bridges, surrounding hills, and hot summers typical of the Zeta valley. The old quarter and later civic blocks share the basin; mountains rim distant views. Continental heat and mild winters mark the year. Use the river junctions and hill rim as the first map. Podgorica’s primer is Zeta plain capital — a Montenegrin seat of bridges and basin heat under highland horizons.',
    facts: {
      kind: 'City',
      country: 'Montenegro',
      region: 'Europe',
      setting: 'Zeta plain · central Montenegro',
      role: 'National capital and inland river-junction city',
      knownFor: 'River junctions, basin setting, and surrounding hills',
    },
    features: [
      {
        name: 'River junctions',
        description:
          'Channels and bridges of the urban plain.',
      },
      {
        name: 'Basin plain',
        description:
          'The low Zeta floor holding the capital.',
      },
      {
        name: 'Hill rim',
        description:
          'Surrounding heights framing distant views.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Podgorica',
        url: 'https://www.britannica.com/place/Podgorica',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'indore',
    code: 'IDR',
    name: 'Indore',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Indore'],
    about:
      'Indore sits on the Malwa Plateau in Madhya Pradesh as a commercial and educational hub of Holkar-era landmarks, busy bazaars, and a growing modern skyline. Rajwada and related monuments organize the historic core; plateau dryness contrasts with monsoon rains. Orient from the old palace district outward to newer civic axes. Indore’s primer is Malwa plateau city — a Holkar commercial seat of bazaars and plateau light in central India.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Malwa Plateau · Madhya Pradesh',
      role: 'Major commercial city of central India',
      knownFor: 'Rajwada core, bazaars, and plateau setting',
    },
    features: [
      {
        name: 'Rajwada core',
        description:
          'Holkar-era palace and historic streets.',
      },
      {
        name: 'Bazaar districts',
        description:
          'Dense commercial lanes of the old city.',
      },
      {
        name: 'Plateau setting',
        description:
          'Malwa highland ground around the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Indore',
        url: 'https://www.britannica.com/place/Indore',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nara',
    code: 'NRA',
    name: 'Nara',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Nara'],
    about:
      'Nara occupies a basin east of Osaka as Japan’s eighth-century capital site, a temple city of parkland deer, great wooden halls, and shrine approaches under forested hills. Tōdai-ji and Kasuga routes organize classic walks; the modern town sits beside the park. Mild seasons favor outdoor temple circuits. Begin in Nara Park and the great Buddha hall, then the surrounding shrine paths. Nara’s primer is ancient-capital temple city — deer park and monumental halls in a Kansai basin.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Nara Basin · Kansai',
      role: 'Historic capital site and temple city',
      knownFor: 'Nara Park, Tōdai-ji, and ancient capital heritage',
    },
    features: [
      {
        name: 'Nara Park',
        description:
          'Open parkland with free-roaming deer.',
      },
      {
        name: 'Great Buddha hall',
        description:
          'Tōdai-ji’s monumental wooden temple.',
      },
      {
        name: 'Shrine approaches',
        description:
          'Forest paths toward Kasuga and peers.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nara',
        url: 'https://www.britannica.com/place/Nara-Japan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Monuments of Ancient Nara',
        url: 'https://whc.unesco.org/en/list/870/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mons',
    code: 'MNS',
    name: 'Mons',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Mons'],
    about:
      'Mons crowns a modest hill in Hainaut as a Walloon city of a Baroque belfry, cobbled Grand-Place, and surrounding coal-basin heritage now turned toward culture and campuses. The historic core packs steep lanes; milder maritime weather keeps plazas active. Climb from lower approaches to the Grand-Place and belfry for the essential view. Mons’s primer is Hainaut hill town — a Baroque civic square above former coal country in southern Belgium.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Hainaut · Wallonia',
      role: 'Provincial capital and historic hill town',
      knownFor: 'Grand-Place, belfry, and hilltop historic core',
    },
    features: [
      {
        name: 'Grand-Place',
        description:
          'The cobbled civic square of the center.',
      },
      {
        name: 'Belfry',
        description:
          'The Baroque tower above the hill town.',
      },
      {
        name: 'Hilltop core',
        description:
          'Steep lanes of the historic fabric.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mons',
        url: 'https://www.britannica.com/place/Mons-Belgium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'missouri',
    code: 'MO',
    name: 'Missouri',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Missouri'],
    about:
      'Missouri bridges the Midwest from the Mississippi and Missouri river confluence country through Ozark hills to prairie and plains edges. St. Louis and Kansas City anchor opposite ends; caves, forests, and farmland stripe the interior. Humid continental seasons bring hot summers and cold winters. Read big rivers, Ozarks, and twin metros as the state’s map. Missouri’s primer is confluence Midwestern state — great rivers, Ozark hills, and metro bookends.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi–Missouri rivers · Ozarks',
      role: 'Midwestern state of rivers and twin metros',
      knownFor: 'Great rivers, Ozark hills, and metro bookends',
    },
    features: [
      {
        name: 'Great rivers',
        description:
          'Mississippi and Missouri corridors.',
      },
      {
        name: 'Ozark hills',
        description:
          'Forested uplands of the southern interior.',
      },
      {
        name: 'Metro bookends',
        description:
          'St. Louis east and Kansas City west.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Missouri',
        url: 'https://www.britannica.com/place/Missouri-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'yukon',
    code: 'YT',
    name: 'Yukon',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'Territory · Canada',
    matchNames: ['Yukon', 'Yukon Territory'],
    about:
      'Yukon occupies Canada’s northwestern interior as a vast territory of mountain ranges, boreal rivers, and subarctic light centered on Whitehorse. The Klondike gold-rush legacy still colors place names; wilderness dominates beyond sparse roads. Long winters and bright summers define the high latitudes. Treat mountains, river valleys, and sparse settlements as the territory’s geography. Yukon’s primer is subarctic mountain territory — boreal valleys and ranges under extreme seasonal light.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Northwestern Canada · subarctic mountains',
      role: 'Canadian territory of mountains and boreal rivers',
      knownFor: 'Mountain ranges, Klondike legacy, and subarctic light',
    },
    features: [
      {
        name: 'Mountain ranges',
        description:
          'High country dominating the territory.',
      },
      {
        name: 'Boreal rivers',
        description:
          'Valley corridors through forest and tundra edge.',
      },
      {
        name: 'Subarctic light',
        description:
          'Extreme seasonal day length and winters.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Yukon',
        url: 'https://www.britannica.com/place/Yukon-territory',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'odisha',
    code: 'ODS',
    name: 'Odisha',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Odisha', 'Orissa'],
    about:
      'Odisha occupies India’s eastern coast as a state of Bay of Bengal shores, temple towns such as Puri and Konark, and forested Eastern Ghats inland. Monsoon rains shape rivers and agriculture; the Chilika lagoon marks a major coastal wetland. Move from temple coast to ghats and lagoon rather than a single landscape type. Odisha’s primer is eastern temple-coast state — Bay shores, sacred architecture, and lagoon wetlands in one outline.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Bay of Bengal · Eastern Ghats',
      role: 'Eastern Indian coastal and temple state',
      knownFor: 'Temple coast, Chilika lagoon, and Eastern Ghats',
    },
    features: [
      {
        name: 'Temple coast',
        description:
          'Puri, Konark, and peer sacred shores.',
      },
      {
        name: 'Chilika lagoon',
        description:
          'The great coastal wetland of the state.',
      },
      {
        name: 'Eastern Ghats',
        description:
          'Forested hills inland from the Bay.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Odisha',
        url: 'https://www.britannica.com/place/Odisha',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'syros',
    code: 'JSY',
    name: 'Syros',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Syros'],
    about:
      'Syros is a central Cycladic island whose capital Ermoupoli rises in neoclassical tiers above a working harbor, historically a shipping and administrative hub of the Aegean. Ano Syros crowns the Catholic hill opposite; beaches and villages ring quieter coasts. Dry summers define the season. Read harbor, neoclassical town, and twin hill settlements together. Syros’s primer is neoclassical Cyclades capital — a formal harbor city on a compact Aegean island.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Central Cyclades · Aegean Sea',
      role: 'Cycladic administrative and harbor island',
      knownFor: 'Ermoupoli harbor, neoclassical tiers, and Ano Syros',
    },
    features: [
      {
        name: 'Ermoupoli harbor',
        description:
          'The working port and waterfront capital.',
      },
      {
        name: 'Neoclassical tiers',
        description:
          'Formal streets rising from the docks.',
      },
      {
        name: 'Ano Syros',
        description:
          'The hill settlement opposite the harbor town.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Syros',
        url: 'https://www.britannica.com/place/Syros',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lesbos',
    code: 'LBS',
    name: 'Lesbos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Lesbos', 'Lesvos'],
    about:
      'Lesbos (Lesvos) is a large eastern Aegean island of olive slopes, volcanic gulfs, and Mytilene as its harbor capital facing Asia Minor. Petrified forest landscapes and thermal springs add geologic character; fishing villages ring quieter bays. Mild winters and hot summers shape the year. Move from Mytilene around gulf coasts into olive interior. Lesbos’s primer is olive Aegean island — gulfs, harbor capital, and Asia Minor–facing shores on a broad eastern island.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Eastern Aegean · near Anatolia',
      role: 'Large Aegean island of olives and gulfs',
      knownFor: 'Mytilene harbor, olive slopes, and volcanic gulfs',
    },
    features: [
      {
        name: 'Mytilene harbor',
        description:
          'The capital port facing the eastern strait.',
      },
      {
        name: 'Olive slopes',
        description:
          'Terraced groves of the island interior.',
      },
      {
        name: 'Volcanic gulfs',
        description:
          'Deep embayments of the western coasts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lesbos',
        url: 'https://www.britannica.com/place/Lesbos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'formentera',
    code: 'FOM',
    name: 'Formentera',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Formentera'],
    about:
      'Formentera is the smallest inhabited Balearic island, a low limestone flat of turquoise shallows, pale beaches, and pine scrub south of Ibiza. Ferries land at La Savina; roads lead to salt flats and cliff ends. Dry Mediterranean summers define the season. Circle beach coasts and salt lagoons rather than climbing high peaks. Formentera’s primer is Balearic sandbar island — pale shallows and pine scrub on a low Spanish Mediterranean outlier.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Balearic Islands · Mediterranean',
      role: 'Small Balearic island of beaches and shallows',
      knownFor: 'Turquoise shallows, pale beaches, and pine scrub',
    },
    features: [
      {
        name: 'Turquoise shallows',
        description:
          'Clear nearshore water over light sand.',
      },
      {
        name: 'Pale beaches',
        description:
          'Sandy shores of the low island.',
      },
      {
        name: 'Salt flats',
        description:
          'Lagoon and salina landscapes inland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Formentera',
        url: 'https://www.britannica.com/place/Formentera',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lewis',
    code: 'LEW',
    name: 'Isle of Lewis',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Lewis', 'Lewis'],
    about:
      'The Isle of Lewis forms the northern part of the Lewis and Harris landmass in Scotland’s Outer Hebrides, a peat moor and machair island of Callanish stones, Atlantic weather, and Stornoway as its harbor town. Crofting landscapes and blackhouse heritage mark the interior; beaches face the west. Wind and rain are constants. Contrast moor, standing stones, and west-coast sands. Lewis’s primer is Hebridean moor island — peat, Callanish, and Atlantic light on the northern Outer Hebrides.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Outer Hebrides · Scotland',
      role: 'Northern Hebridean island of moor and machair',
      knownFor: 'Callanish stones, peat moor, and Stornoway harbor',
    },
    features: [
      {
        name: 'Callanish stones',
        description:
          'The prehistoric standing-stone circle.',
      },
      {
        name: 'Peat moor',
        description:
          'Open upland covering much of the interior.',
      },
      {
        name: 'West machair',
        description:
          'Sandy coastal grasslands of the Atlantic edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lewis',
        url: 'https://www.britannica.com/place/Lewis',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'les-saintes',
    code: 'LST',
    name: 'Les Saintes',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Les Saintes', 'Îles des Saintes', 'Terre-de-Haut'],
    about:
      'Les Saintes is a small French Caribbean archipelago south of Guadeloupe, centered on Terre-de-Haut’s colorful harbor village, fort hill, and clear surrounding water. Ferries arrive in a sheltered bay; trails climb to viewpoints over multiple islets. Steady trade winds keep the air warm year-round. Land at the harbor, then climb the fort and coastal paths. Les Saintes’ primer is Guadeloupe outlier archipelago — a compact harbor island of fort views and turquoise channels.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'South of Guadeloupe · Caribbean',
      role: 'French Caribbean islet archipelago',
      knownFor: 'Terre-de-Haut harbor, fort hill, and clear channels',
    },
    features: [
      {
        name: 'Harbor village',
        description:
          'Colorful waterfront of Terre-de-Haut.',
      },
      {
        name: 'Fort hill',
        description:
          'Elevated viewpoints over the islets.',
      },
      {
        name: 'Clear channels',
        description:
          'Turquoise water between the small islands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Guadeloupe',
        url: 'https://www.britannica.com/place/Guadeloupe',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'curacao',
    code: 'CUR',
    name: 'Curaçao',
    kind: 'Island',
    countrySlug: 'netherlands',
    subtitle: 'Island · Netherlands',
    matchNames: ['Curaçao', 'Curacao'],
    about:
      'Curaçao is a Dutch Caribbean island of pastel Willemstad waterfront, coral coasts, and a dry cactus landscape outside the main hurricane belt. Sint Anna Bay splits the colorful Punda and Otrobanda districts; diving reefs ring much of the shore. The climate stays dry and warm through most months. Begin with Willemstad’s harbor, then the arid interior and west-coast beaches. Curaçao’s primer is pastel Dutch Antillean island — a harbor capital of bright facades on a dry southern Caribbean ridge.',
    facts: {
      kind: 'Island',
      country: 'Netherlands',
      region: 'Americas',
      setting: 'Southern Caribbean · Dutch Antilles',
      role: 'Dutch Caribbean island of harbor and reefs',
      knownFor: 'Willemstad waterfront, coral coasts, and dry scrub',
    },
    features: [
      {
        name: 'Willemstad waterfront',
        description:
          'Pastel facades along Sint Anna Bay.',
      },
      {
        name: 'Coral coasts',
        description:
          'Reef-lined shores around the island.',
      },
      {
        name: 'Dry scrub',
        description:
          'Cactus landscape of the arid interior.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Curaçao',
        url: 'https://www.britannica.com/place/Curacao',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Area of Willemstad',
        url: 'https://whc.unesco.org/en/list/819/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lombardy',
    code: 'LOM',
    name: 'Lombardy',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Lombardy', 'Lombardia'],
    about:
      'Lombardy occupies northern Italy from Alpine lakes and peaks to the Po Plain around Milan, a region of industrial power, historic cities, and villa-lined water. Como and Garda fringe the north; the plain holds agriculture and logistics. Alpine winters and hot plain summers share the climate. Read lakes, mountains, and plain metropolis as linked belts. Lombardy’s primer is Alpine-lake-to-Po region — Milan’s plain energy under northern Italian lake and mountain country.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Alps and lakes · Po Plain',
      role: 'Northern Italian region of lakes and plain metropolis',
      knownFor: 'Alpine lakes, Milan plain, and historic cities',
    },
    features: [
      {
        name: 'Alpine lakes',
        description:
          'Como, Garda approaches, and peer shores.',
      },
      {
        name: 'Po Plain',
        description:
          'Agricultural and industrial lowlands.',
      },
      {
        name: 'Milan hub',
        description:
          'The metropolitan core of the region.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lombardy',
        url: 'https://www.britannica.com/place/Lombardy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'burgenland',
    code: 'BGL',
    name: 'Burgenland',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Burgenland'],
    about:
      'Burgenland is Austria’s easternmost state, a lowland border region of reed-fringed Neusiedler See, vineyards, and Pannonian light toward Hungary. Flat horizons and stork villages organize rural character; Eisenstadt anchors civic life. Warm summers suit wine and lake tourism. Orient from the lake and vineyards rather than high Alps. Burgenland’s primer is Pannonian lake-and-wine state — reeds, vines, and open skies on Austria’s eastern edge.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Neusiedler See · eastern Austria',
      role: 'Eastern Austrian lake-and-wine borderland',
      knownFor: 'Neusiedler See, vineyards, and Pannonian plains',
    },
    features: [
      {
        name: 'Neusiedler See',
        description:
          'The shallow reed-fringed steppe lake.',
      },
      {
        name: 'Vineyard country',
        description:
          'Wine slopes of the eastern lowlands.',
      },
      {
        name: 'Pannonian light',
        description:
          'Open skies toward the Hungarian border.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Burgenland',
        url: 'https://www.britannica.com/place/Burgenland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'clare-valley',
    code: 'CLV',
    name: 'Clare Valley',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Clare Valley'],
    about:
      'Clare Valley is a South Australian wine region north of Adelaide, of Riesling slopes, stone villages, and rolling vineyard country under clear highland-edge skies. Cellar doors line valley roads; cooler nights favor white varieties. Mediterranean-leaning summers define the growing season. Drive vineyard corridors between small towns rather than a single urban hub. Clare Valley’s primer is highland-edge wine valley — Riesling slopes and stone cellar towns in South Australia.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'South Australia · north of Adelaide',
      role: 'Wine valley known for Riesling and cellar doors',
      knownFor: 'Riesling vineyards, stone villages, and valley roads',
    },
    features: [
      {
        name: 'Riesling slopes',
        description:
          'Vineyard plantings favored by cool nights.',
      },
      {
        name: 'Stone villages',
        description:
          'Small towns of cellar doors and heritage fabric.',
      },
      {
        name: 'Valley roads',
        description:
          'Driving corridors through the wine country.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Clare',
        url: 'https://www.britannica.com/place/Clare-South-Australia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'navarre',
    code: 'NAV',
    name: 'Navarre',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Navarre', 'Navarra'],
    about:
      'Navarre occupies northern Spain from green Atlantic-facing valleys and Pyrenean approaches to drier Ebro basin country around Pamplona. The Camino de Santiago crosses historic towns; mountains and plain share one political outline. Atlantic rain greens the north; the south turns more continental. Read Pyrenees, Pamplona basin, and southern drylands as linked belts. Navarre’s primer is Pyrenean-to-Ebro region — green valleys, pilgrimage towns, and a historic capital in northern Spain.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Pyrenees to Ebro basin · northern Spain',
      role: 'Northern Spanish region of mountains and basin',
      knownFor: 'Pamplona, Pyrenean valleys, and Camino towns',
    },
    features: [
      {
        name: 'Pyrenean valleys',
        description:
          'Green mountain approaches of the north.',
      },
      {
        name: 'Pamplona basin',
        description:
          'The historic capital and surrounding plain.',
      },
      {
        name: 'Camino towns',
        description:
          'Pilgrimage stops across the region.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Navarra',
        url: 'https://www.britannica.com/place/Navarra-autonomous-area-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'oltenia',
    code: 'OLT',
    name: 'Oltenia',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Oltenia'],
    about:
      'Oltenia occupies southwestern Romania between the Southern Carpathians and the Danube, a region of Craiova as its urban hub, monastery hills, and river plains. Sub-Carpathian foothills and open farmland organize the interior; continental seasons bring hot summers. Move from Danube edge inland to foothill monasteries and the Craiova plain. Oltenia’s primer is southwestern Romanian plain — Carpathian foothills, monasteries, and Danube approaches around Craiova.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Southern Carpathians to Danube',
      role: 'Southwestern Romanian foothill and plain region',
      knownFor: 'Craiova hub, monastery hills, and Danube edge',
    },
    features: [
      {
        name: 'Carpathian foothills',
        description:
          'Southern mountain approaches of the region.',
      },
      {
        name: 'Craiova hub',
        description:
          'The principal city of the Oltenian plain.',
      },
      {
        name: 'Danube edge',
        description:
          'Southern river approaches of the southwest.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Oltenia',
        url: 'https://www.britannica.com/place/Oltenia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'westminster-palace',
    code: 'WPL',
    name: 'Palace of Westminster',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Palace of Westminster', 'Houses of Parliament', 'Westminster Palace'],
    about:
      'The Palace of Westminster houses the UK Parliament on the Thames in London as a vast Gothic Revival complex of towers, riverfront terraces, and ceremonial halls. Elizabeth Tower and Victoria Tower bookend the silhouette; Westminster Abbey stands adjacent. The ensemble is both workplace and national symbol. Read river terrace, towers, and Abbey neighbor together. Westminster Palace’s primer is parliamentary Gothic — towers and terraces of Britain’s legislature on the Thames.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Thames · Westminster',
      role: 'Seat of the UK Parliament',
      knownFor: 'Gothic Revival towers, river terrace, and parliamentary halls',
    },
    features: [
      {
        name: 'River terrace',
        description:
          'The Thames frontage of the palace.',
      },
      {
        name: 'Gothic towers',
        description:
          'Elizabeth and Victoria towers of the skyline.',
      },
      {
        name: 'Parliamentary halls',
        description:
          'The legislative chambers within the complex.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Palace of Westminster',
        url: 'https://www.britannica.com/topic/Houses-of-Parliament-buildings-London',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Palace of Westminster and Westminster Abbey',
        url: 'https://whc.unesco.org/en/list/426/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'louvre',
    code: 'LOU',
    name: 'Louvre',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Louvre', 'Louvre Museum', 'Musée du Louvre'],
    about:
      'The Louvre occupies the former royal palace on Paris’s Right Bank as one of the world’s great museums, a vast courtyard complex now entered through I. M. Pei’s glass pyramid. Wings frame the Cour Napoléon; the Tuileries gardens continue the axial west. Stone palace fabric and modern glass share one composition. Approach through the pyramid courtyard so palace wings and axis read together. The Louvre’s primer is palace-museum courtyard — royal wings and glass pyramid at the heart of historic Paris.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Right Bank · Paris',
      role: 'Former royal palace and major art museum',
      knownFor: 'Glass pyramid, palace wings, and Cour Napoléon',
    },
    features: [
      {
        name: 'Glass pyramid',
        description:
          'The modern entrance in the main courtyard.',
      },
      {
        name: 'Palace wings',
        description:
          'Royal ranges framing the Cour Napoléon.',
      },
      {
        name: 'Tuileries axis',
        description:
          'The garden continuation west of the Louvre.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Louvre Museum',
        url: 'https://www.britannica.com/topic/Louvre-Museum',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'everglades',
    code: 'EVG',
    name: 'Everglades',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Everglades', 'Everglades National Park'],
    about:
      'The Everglades are a vast subtropical wetland of sawgrass marsh, mangrove coasts, and slow sheet flow across southern Florida, protected in large part as a national park. Horizons stay low; water and sky dominate. Wet and dry seasons reshape accessible routes. Read sawgrass prairie, mangrove edge, and shallow water as one ecosystem. Everglades’ primer is Florida sheet-flow wetland — sawgrass, mangroves, and open water under subtropical skies.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Southern Florida · subtropical wetland',
      role: 'National park of sheet-flow marsh and mangroves',
      knownFor: 'Sawgrass marsh, mangroves, and low wetland horizons',
    },
    features: [
      {
        name: 'Sawgrass marsh',
        description:
          'The open wetland prairie of the interior.',
      },
      {
        name: 'Mangrove coasts',
        description:
          'Tidal forest edges toward the Gulf and bay.',
      },
      {
        name: 'Sheet flow',
        description:
          'Shallow water moving slowly across the land.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Everglades',
        url: 'https://www.britannica.com/place/Everglades',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Everglades',
        url: 'https://www.nps.gov/ever/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sequoia',
    code: 'SEQ',
    name: 'Sequoia',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Sequoia', 'Sequoia National Park'],
    about:
      'Sequoia National Park protects giant sequoia groves on the western slope of California’s Sierra Nevada, where enormous trunks rise through montane forest beneath high granite country. The Giant Forest organizes classic walks among the largest trees; elevation brings cool summers and snowy winters. Stand among the trunks so scale of bark, canopy, and mountain forest read together. Sequoia’s primer is Sierra giant-tree park — colossal trunks in montane forest on California’s high western slope.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Sierra Nevada · California',
      role: 'National park of giant sequoia groves',
      knownFor: 'Giant Forest, colossal trunks, and Sierra montane forest',
    },
    features: [
      {
        name: 'Giant sequoias',
        description:
          'The enormous trunks of the protected groves.',
      },
      {
        name: 'Giant Forest',
        description:
          'The classic grove area of visitor approaches.',
      },
      {
        name: 'Sierra slope',
        description:
          'Montane forest beneath high granite country.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sequoia National Park',
        url: 'https://www.britannica.com/place/Sequoia-National-Park',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Sequoia & Kings Canyon',
        url: 'https://www.nps.gov/seki/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'cologne-cathedral',
    code: 'KOC',
    name: 'Cologne Cathedral',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Cologne Cathedral', 'Kölner Dom', 'Cologne Dom'],
    about:
      'Cologne Cathedral (Kölner Dom) rises on the Rhine in Cologne as a vast Gothic twin-spired church whose blackened stone dominates the city’s river skyline. Building spanned centuries; the completed spires organize approaches from station and embankment. The interior soars in tall nave and stained glass. Stand on the Rhine so twin spires, river, and square read as one. The Dom’s primer is Rhine Gothic — twin spires of blackened stone commanding Cologne’s riverbank.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Rhine riverbank · Cologne',
      role: 'Gothic cathedral and city skyline icon',
      knownFor: 'Twin spires, Rhine setting, and soaring nave',
    },
    features: [
      {
        name: 'Twin spires',
        description:
          'The completed Gothic towers of the west front.',
      },
      {
        name: 'Rhine setting',
        description:
          'The riverbank and embankment approaches.',
      },
      {
        name: 'Gothic nave',
        description:
          'The tall interior and stained glass.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cologne Cathedral',
        url: 'https://www.britannica.com/topic/Cologne-Cathedral',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cologne Cathedral',
        url: 'https://whc.unesco.org/en/list/292/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'independence-hall',
    code: 'IDH',
    name: 'Independence Hall',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Independence Hall'],
    about:
      'Independence Hall stands on Independence Mall in Philadelphia as the Georgian brick assembly building where the Declaration of Independence and U.S. Constitution were debated and adopted. The clock tower and symmetrical wings organize the civic square; related historic buildings fill the mall. The landmark is both architecture and political origin site. Approach from the mall so tower, facade, and square read together. Independence Hall’s primer is American founding house — Georgian brick and clock tower on Philadelphia’s civic mall.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Independence Mall · Philadelphia',
      role: 'Historic assembly hall of founding documents',
      knownFor: 'Georgian facade, clock tower, and Independence Mall',
    },
    features: [
      {
        name: 'Georgian facade',
        description:
          'The brick front of the assembly building.',
      },
      {
        name: 'Clock tower',
        description:
          'The steeple organizing the civic silhouette.',
      },
      {
        name: 'Independence Mall',
        description:
          'The landscaped approach and companion buildings.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Independence Hall',
        url: 'https://www.britannica.com/topic/Independence-Hall',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Independence Hall',
        url: 'https://www.nps.gov/inde/index.htm',
        kind: 'authority',
      },
    ],
  },
]
