/** Twenty-first curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch21: PlaceGuideDraftBatch[] = [
  {
    slug: 'glasgow',
    code: 'GLS',
    name: 'Glasgow',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Glasgow'],
    about:
      'Glasgow sits on the Clyde in western Scotland as a Victorian industrial city of sandstone tenements, museum parks, and a regenerating waterfront. Soft Atlantic rain keeps the sandstone streets under frequent cloud. Orient from George Square through the Merchant City to the riverside. Glasgow’s primer is Clyde industrial city — sandstone streets and museum parks of western Scotland’s largest metro.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Clyde · western Scotland',
      role: 'Largest city in Scotland',
      knownFor: 'Victorian sandstone, Clyde waterfront, and museum parks',
    },
    features: [
      {
        name: 'Clyde waterfront',
        description:
          'Regenerated river edge of the city.',
      },
      {
        name: 'Sandstone tenements',
        description:
          'Victorian residential fabric.',
      },
      {
        name: 'Museum parks',
        description:
          'Civic green spaces and collections.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Glasgow',
        url: 'https://www.britannica.com/place/Glasgow-Scotland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'leeds',
    code: 'LBA',
    name: 'Leeds',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Leeds'],
    about:
      'Leeds occupies the Aire Valley in West Yorkshire as a northern English city of Victorian arcades, university quarters, and a canal-and-river core remade as a retail and service hub. Mild wet weather prevails. Walk from the arcades through the waterfront to surrounding mill neighborhoods. Leeds’s primer is Yorkshire Aire city — Victorian arcades and canal quarters in West Yorkshire.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Aire · West Yorkshire',
      role: 'West Yorkshire metro and service city',
      knownFor: 'Victorian arcades, Aire waterfront, and university districts',
    },
    features: [
      {
        name: 'Victorian arcades',
        description:
          'Covered shopping streets of the center.',
      },
      {
        name: 'Aire waterfront',
        description:
          'River and canal corridors.',
      },
      {
        name: 'University districts',
        description:
          'Campus neighborhoods of the metro.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Leeds',
        url: 'https://www.britannica.com/place/Leeds-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'toulouse',
    code: 'TLS',
    name: 'Toulouse',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Toulouse'],
    about:
      'Toulouse sits on the Garonne in southwestern France as a pink-brick city of aerospace industry, a brick Capitole square, and canal approaches. Hot summers and mild winters share the climate. Orient from the Capitole through brick streets to the river and Canal du Midi. Toulouse’s primer is pink-brick Garonne city — Capitole square and aerospace capital of southwestern France.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Garonne River · southwestern France',
      role: 'Major southwestern French city',
      knownFor: 'Pink brick, Capitole, and aerospace industry',
    },
    features: [
      {
        name: 'Capitole square',
        description:
          'Civic plaza of the pink city.',
      },
      {
        name: 'Garonne quays',
        description:
          'Riverfront of the historic core.',
      },
      {
        name: 'Canal approaches',
        description:
          'Canal du Midi links near the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Toulouse',
        url: 'https://www.britannica.com/place/Toulouse-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'strasbourg',
    code: 'SXB',
    name: 'Strasbourg',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Strasbourg'],
    about:
      'Strasbourg occupies the Ill River near the Rhine in Alsace as a Franco-German border city of a sandstone cathedral, timbered Petite France, and European institutions. Cool winters and mild summers mark the climate. Walk from the cathedral through Petite France to the river islands. Strasbourg’s primer is Alsatian Rhine city — cathedral spire and timbered canals at the French–German edge.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Ill River · Alsace',
      role: 'Alsatian capital and European institutional city',
      knownFor: 'Cathedral, Petite France, and Rhine border setting',
    },
    features: [
      {
        name: 'Cathedral spire',
        description:
          'Sandstone Gothic landmark of the center.',
      },
      {
        name: 'Petite France',
        description:
          'Timbered canal quarter.',
      },
      {
        name: 'River islands',
        description:
          'Ill channels through the historic core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Strasbourg',
        url: 'https://www.britannica.com/place/Strasbourg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bari',
    code: 'BRI',
    name: 'Bari',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Bari'],
    about:
      'Bari faces the Adriatic in Apulia as a ferry port of a dense Bari Vecchia, a seafront lungomare, and a Norman-Swabian castle. Summer heat builds along the lungomare while winters stay comparatively soft. Move from the old town alleys to the lungomare and castle walls. Bari’s primer is Adriatic Apulian port — Bari Vecchia alleys and seafront of southeastern Italy.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Adriatic coast · Apulia',
      role: 'Apulian capital and ferry port',
      knownFor: 'Bari Vecchia, lungomare, and seaside castle',
    },
    features: [
      {
        name: 'Bari Vecchia',
        description:
          'Dense old-town alley core.',
      },
      {
        name: 'Lungomare',
        description:
          'Seafront promenade of the city.',
      },
      {
        name: 'Seaside castle',
        description:
          'Norman-Swabian fortress on the shore.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Bari',
        url: 'https://www.britannica.com/place/Bari-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'palermo',
    code: 'PMO',
    name: 'Palermo',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Palermo'],
    about:
      'Palermo spreads along a Conca d’Oro plain beneath mountains on Sicily’s north coast as a layered city of Arab-Norman monuments, street markets, and a working harbor. Hot dry summers and mild winters prevail. Orient from the historic markets through Norman landmarks to the waterfront. Palermo’s primer is Sicilian Conca d’Oro capital — Arab-Norman fabric and markets under mountain walls.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Conca d’Oro · northern Sicily',
      role: 'Sicilian capital and historic port',
      knownFor: 'Arab-Norman monuments, street markets, and harbor',
    },
    features: [
      {
        name: 'Street markets',
        description:
          'Open-air food markets of the core.',
      },
      {
        name: 'Arab-Norman monuments',
        description:
          'Layered medieval sacred architecture.',
      },
      {
        name: 'Harbor plain',
        description:
          'Coastal bowl under mountain rim.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Palermo',
        url: 'https://www.britannica.com/place/Palermo',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'guayaquil',
    code: 'GYE',
    name: 'Guayaquil',
    kind: 'City',
    countrySlug: 'ecuador',
    subtitle: 'City · Ecuador',
    matchNames: ['Guayaquil'],
    about:
      'Guayaquil occupies the Guayas River estuary on Ecuador’s Pacific lowlands as the country’s largest port city of malecón waterfront, humid tropical heat, and hills above the river bend. Warm weather holds year-round. Walk the malecón so river, downtown, and Santa Ana hill align. Guayaquil’s primer is Guayas estuary port — malecón waterfront and hill neighborhoods of Ecuador’s Pacific gateway.',
    facts: {
      kind: 'City',
      country: 'Ecuador',
      region: 'Americas',
      setting: 'Guayas River estuary · Pacific Ecuador',
      role: 'Ecuador’s principal port city',
      knownFor: 'Malecón waterfront, estuary port, and Santa Ana hill',
    },
    features: [
      {
        name: 'Malecón',
        description:
          'Riverfront promenade of the city.',
      },
      {
        name: 'Estuary port',
        description:
          'Pacific trade gateway on the Guayas.',
      },
      {
        name: 'Santa Ana hill',
        description:
          'Historic hill neighborhood above downtown.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Guayaquil',
        url: 'https://www.britannica.com/place/Guayaquil',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'surat',
    code: 'STV',
    name: 'Surat',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Surat'],
    about:
      'Surat sits on the Tapi River near the Gulf of Khambhat in Gujarat as a textile and diamond-trade city of riverside ghats, colonial-era fort traces, and dense commercial streets. Pre-monsoon heat and wet-season downpours organize the calendar. Orient from the Tapi embankments through the old commercial core. Surat’s primer is Gujarat Tapi city — textile trade and river ghats near the Gulf of Khambhat.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Tapi River · Gujarat',
      role: 'Major Gujarati commercial and port-adjacent city',
      knownFor: 'Textile trade, diamond industry, and Tapi riverfront',
    },
    features: [
      {
        name: 'Tapi riverfront',
        description:
          'Ghats and embankments of the city.',
      },
      {
        name: 'Textile districts',
        description:
          'Commercial fabric of the trade city.',
      },
      {
        name: 'Gulf approaches',
        description:
          'Lowland routes toward Khambhat.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Surat',
        url: 'https://www.britannica.com/place/Surat',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'malmo',
    code: 'MMA',
    name: 'Malmö',
    kind: 'City',
    countrySlug: 'sweden',
    subtitle: 'City · Sweden',
    matchNames: ['Malmö', 'Malmo'],
    about:
      'Malmö faces the Öresund in southern Sweden as a coastal city of Turning Torso skyline, harbor redevelopment, and a bridge-tunnel link to Copenhagen. Mild winters for Sweden and mild summers share the Öresund climate. Orient from the old town through the Western Harbor to the bridge approaches. Malmö’s primer is Öresund coastal city — harbor renewal and bridge link at Sweden’s southwestern tip.',
    facts: {
      kind: 'City',
      country: 'Sweden',
      region: 'Europe',
      setting: 'Öresund strait · southern Sweden',
      role: 'Southern Swedish coastal metro',
      knownFor: 'Turning Torso, Western Harbor, and Öresund Bridge link',
    },
    features: [
      {
        name: 'Western Harbor',
        description:
          'Redeveloped waterfront district.',
      },
      {
        name: 'Turning Torso',
        description:
          'Twisting residential tower landmark.',
      },
      {
        name: 'Öresund approaches',
        description:
          'Bridge-tunnel corridor to Denmark.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Malmö',
        url: 'https://www.britannica.com/place/Malmo',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aarhus',
    code: 'AAR',
    name: 'Aarhus',
    kind: 'City',
    countrySlug: 'denmark',
    subtitle: 'City · Denmark',
    matchNames: ['Aarhus', 'Århus'],
    about:
      'Aarhus sits on a bay of the Kattegat in eastern Jutland as Denmark’s second city of a cathedral core, university life, and a regenerating harbor. Mild maritime weather prevails. Walk from the cathedral and Latin Quarter to the bay waterfront. Aarhus’s primer is Jutland bay city — cathedral streets and harbor renewal on Denmark’s eastern coast.',
    facts: {
      kind: 'City',
      country: 'Denmark',
      region: 'Europe',
      setting: 'Aarhus Bay · eastern Jutland',
      role: 'Denmark’s second city',
      knownFor: 'Cathedral core, university districts, and bay harbor',
    },
    features: [
      {
        name: 'Cathedral core',
        description:
          'Historic church and Latin Quarter.',
      },
      {
        name: 'Bay harbor',
        description:
          'Regenerating waterfront on the Kattegat.',
      },
      {
        name: 'University districts',
        description:
          'Campus neighborhoods of the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Aarhus',
        url: 'https://www.britannica.com/place/Arhus',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'innsbruck',
    code: 'INN',
    name: 'Innsbruck',
    kind: 'City',
    countrySlug: 'austria',
    subtitle: 'City · Austria',
    matchNames: ['Innsbruck'],
    about:
      'Innsbruck fills the Inn Valley beneath the Nordkette in Tyrol as an Alpine capital of a Golden Roof old town, ski-jump mountains, and a river through the center. Cold snowy winters and mild summers define the Alpine year. Stand in the old town so Inn River, Golden Roof, and mountain walls align. Innsbruck’s primer is Tyrolean Alpine capital — Inn Valley old town under Nordkette peaks.',
    facts: {
      kind: 'City',
      country: 'Austria',
      region: 'Europe',
      setting: 'Inn Valley · Tyrol',
      role: 'Tyrolean capital and Alpine city',
      knownFor: 'Golden Roof, Inn River, and Nordkette mountains',
    },
    features: [
      {
        name: 'Golden Roof old town',
        description:
          'Historic core of the valley city.',
      },
      {
        name: 'Inn River',
        description:
          'Alpine river through the center.',
      },
      {
        name: 'Nordkette wall',
        description:
          'Mountain range rising above the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Innsbruck',
        url: 'https://www.britannica.com/place/Innsbruck',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'graz',
    code: 'GRZ',
    name: 'Graz',
    kind: 'City',
    countrySlug: 'austria',
    subtitle: 'City · Austria',
    matchNames: ['Graz'],
    about:
      'Graz sits on the Mur River in Styria as an Austrian city of a clock-tower hill, Renaissance courtyards, and a UNESCO old town below Schlossberg. Cold winters and warm summers share the inland climate. Climb from the river old town to the Schlossberg clock tower. Graz’s primer is Styrian Mur city — clock-tower hill and Renaissance courtyards of Austria’s second city.',
    facts: {
      kind: 'City',
      country: 'Austria',
      region: 'Europe',
      setting: 'Mur River · Styria',
      role: 'Styrian capital and Austria’s second city',
      knownFor: 'Schlossberg clock tower, Mur old town, and courtyards',
    },
    features: [
      {
        name: 'Schlossberg',
        description:
          'Hill and clock tower above the city.',
      },
      {
        name: 'Mur old town',
        description:
          'Historic streets along the river.',
      },
      {
        name: 'Renaissance courtyards',
        description:
          'Arcaded courts of the core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Graz',
        url: 'https://www.britannica.com/place/Graz',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'connecticut',
    code: 'CT',
    name: 'Connecticut',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Connecticut'],
    about:
      'Connecticut occupies southern New England between New York and Rhode Island as a state of Long Island Sound shore, forested hills, and river valleys around Hartford and New Haven. Cold winters and warm humid summers mark the climate. Read Sound coast, central river towns, and western hills as linked belts. Connecticut’s primer is southern New England state — Sound shore and river valleys between New York and Rhode Island.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Long Island Sound · southern New England',
      role: 'New England state on the Sound',
      knownFor: 'Long Island Sound, river valleys, and forested hills',
    },
    features: [
      {
        name: 'Sound shore',
        description:
          'Coastal towns on Long Island Sound.',
      },
      {
        name: 'River valleys',
        description:
          'Settlement corridors of the interior.',
      },
      {
        name: 'Forested hills',
        description:
          'Wooded uplands of the west and north.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Connecticut',
        url: 'https://www.britannica.com/place/Connecticut-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'maine',
    code: 'ME',
    name: 'Maine',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Maine'],
    about:
      'Maine forms the northeastern corner of the United States as a state of rocky Atlantic coast, spruce forests, and lake-filled interior toward Canada. Cold snowy winters and mild summers define the northern New England year. Move from lobster harbors through pine woods to the North Woods. Maine’s primer is rocky Atlantic state — spruce coast and lake woods at the nation’s northeastern tip.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Atlantic coast · northeastern United States',
      role: 'Northeasternmost U.S. state',
      knownFor: 'Rocky coast, spruce forests, and North Woods lakes',
    },
    features: [
      {
        name: 'Rocky Atlantic coast',
        description:
          'Harbor and headland shoreline.',
      },
      {
        name: 'Spruce forests',
        description:
          'Evergreen woods of the interior.',
      },
      {
        name: 'North Woods lakes',
        description:
          'Remote lake country toward Canada.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Maine',
        url: 'https://www.britannica.com/place/Maine-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'goa',
    code: 'GOA',
    name: 'Goa',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Goa'],
    about:
      'Goa occupies India’s western Konkan coast as a small state of palm beaches, Portuguese-era churches, and spice-green hinterland behind the Arabian Sea. Hot humid weather and monsoon rains shape the year. Move from beach belts through old Goa churches to laterite hills inland. Goa’s primer is Konkan coastal state — palm beaches and Portuguese church towns on India’s Arabian Sea edge.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Konkan coast · western India',
      role: 'Small coastal Indian state',
      knownFor: 'Palm beaches, Portuguese churches, and spice hinterland',
    },
    features: [
      {
        name: 'Palm beaches',
        description:
          'Arabian Sea shore of the state.',
      },
      {
        name: 'Church towns',
        description:
          'Portuguese-era sacred architecture.',
      },
      {
        name: 'Laterite hinterland',
        description:
          'Green hills behind the coast.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Goa',
        url: 'https://www.britannica.com/place/Goa',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'guernsey',
    code: 'GCI',
    name: 'Guernsey',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Guernsey'],
    about:
      'Guernsey is a Channel Island of cliff paths, tidal harbors, and a mix of British and Norman heritage facing the French coast. Mild maritime weather and long summer daylight shape the season. Land at St Peter Port and walk coastal paths around the island. Guernsey’s primer is Channel Island — cliff paths and tidal harbors between Britain and Normandy.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Channel Islands · English Channel',
      role: 'British Crown Dependency island',
      knownFor: 'St Peter Port, cliff paths, and tidal harbors',
    },
    features: [
      {
        name: 'St Peter Port',
        description:
          'Main harbor town of the island.',
      },
      {
        name: 'Cliff paths',
        description:
          'Coastal walks above the Channel.',
      },
      {
        name: 'Tidal harbors',
        description:
          'Rocky inlets of the shore.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Guernsey',
        url: 'https://www.britannica.com/place/Guernsey-island-Channel-Islands-English-Channel',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'shetland',
    code: 'LSI',
    name: 'Shetland',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Shetland', 'Shetland Islands'],
    about:
      'Shetland is a subarctic archipelago northeast of mainland Scotland of treeless hills, seabird cliffs, and Norse-influenced culture around Lerwick. Wind and long summer daylight define the season; winters are stormy. Move from Lerwick to cliff headlands and peaty interiors. Shetland’s primer is northernmost Scottish archipelago — seabird cliffs and Norse heritage above the North Sea.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'North of mainland Scotland · North Sea',
      role: 'Northern Scottish archipelago',
      knownFor: 'Seabird cliffs, Lerwick, and Norse heritage',
    },
    features: [
      {
        name: 'Seabird cliffs',
        description:
          'Atlantic and North Sea nesting coasts.',
      },
      {
        name: 'Lerwick',
        description:
          'Main town of Mainland Shetland.',
      },
      {
        name: 'Peaty hills',
        description:
          'Treeless interior of the isles.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Shetland',
        url: 'https://www.britannica.com/place/Shetland-Islands',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mahe',
    code: 'SEY',
    name: 'Mahé',
    kind: 'Island',
    countrySlug: 'seychelles',
    subtitle: 'Island · Seychelles',
    matchNames: ['Mahé', 'Mahe'],
    about:
      'Mahé is the largest Seychelles island of granite peaks, palm beaches, and the capital Victoria on a tropical Indian Ocean ridge. Warm humid weather holds year-round. Move from Victoria’s harbor through beach coves to Morne Seychellois slopes. Mahé’s primer is Seychelles main island — granite peaks and palm beaches around the capital Victoria.',
    facts: {
      kind: 'Island',
      country: 'Seychelles',
      region: 'Africa',
      setting: 'Inner Seychelles · Indian Ocean',
      role: 'Largest Seychelles island and capital island',
      knownFor: 'Victoria, granite peaks, and palm beaches',
    },
    features: [
      {
        name: 'Victoria harbor',
        description:
          'Capital waterfront of the archipelago.',
      },
      {
        name: 'Granite peaks',
        description:
          'Interior mountains of the island.',
      },
      {
        name: 'Palm beaches',
        description:
          'Tropical coves of the shore.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mahé',
        url: 'https://www.britannica.com/place/Mahe-island-Seychelles',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'faroe',
    code: 'FAE',
    name: 'Faroe Islands',
    kind: 'Island',
    countrySlug: 'denmark',
    subtitle: 'Island · Denmark',
    matchNames: ['Faroe Islands', 'Faroes', 'Føroyar'],
    about:
      'The Faroe Islands rise from the North Atlantic between Scotland and Iceland as a Danish self-governing archipelago of steep green cliffs, turf-roof villages, and fjord-like sounds. Wind and cloud dominate the year. Ferry and tunnel links stitch the islands; sheep graze near-vertical pastures. Read cliff coasts, village harbors, and misty ridges together. The Faroes’ primer is North Atlantic cliff archipelago — green walls and turf villages in Danish self-rule seas.',
    facts: {
      kind: 'Island',
      country: 'Denmark',
      region: 'Europe',
      setting: 'North Atlantic · between Scotland and Iceland',
      role: 'Self-governing Danish archipelago',
      knownFor: 'Sea cliffs, turf-roof villages, and misty sounds',
    },
    features: [
      {
        name: 'Sea cliffs',
        description:
          'Steep green walls above the Atlantic.',
      },
      {
        name: 'Turf-roof villages',
        description:
          'Traditional harbor settlements.',
      },
      {
        name: 'Sounds and fjords',
        description:
          'Narrow waterways between islands.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Faroe Islands',
        url: 'https://www.britannica.com/place/Faroe-Islands',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'korcula',
    code: 'KOR',
    name: 'Korčula',
    kind: 'Island',
    countrySlug: 'croatia',
    subtitle: 'Island · Croatia',
    matchNames: ['Korčula', 'Korcula'],
    about:
      'Korčula is a Dalmatian island of a walled old town on a peninsula, dense pine and vine slopes, and clear Adriatic channels near the Pelješac coast. Hot dry summers and mild winters define the season. Land at the old town so walls, harbor, and channel views align. Korčula’s primer is Dalmatian walled-island town — peninsula streets and pine slopes in the Adriatic.',
    facts: {
      kind: 'Island',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Dalmatian coast · Adriatic',
      role: 'Dalmatian island with historic town',
      knownFor: 'Walled old town, pine slopes, and Adriatic channels',
    },
    features: [
      {
        name: 'Walled old town',
        description:
          'Peninsula historic core.',
      },
      {
        name: 'Pine and vine slopes',
        description:
          'Green interior of the island.',
      },
      {
        name: 'Adriatic channels',
        description:
          'Clear waterways to the mainland.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Korčula',
        url: 'https://www.britannica.com/place/Korcula-island-Croatia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'vis',
    code: 'VIS',
    name: 'Vis',
    kind: 'Island',
    countrySlug: 'croatia',
    subtitle: 'Island · Croatia',
    matchNames: ['Vis'],
    about:
      'Vis is a remote Dalmatian island of sheltered harbors, vine terraces, and clear waters farther offshore than many peers. Long closed to foreign tourism in the Yugoslav era, it retains a quieter character. Intense Adriatic sun and scarce summer rain suit the vine terraces. Land at Vis town or Komiža and explore coastal roads. Vis’s primer is offshore Dalmatian island — quiet harbors and vine terraces west of the main ferry chain.',
    facts: {
      kind: 'Island',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Outer Dalmatian islands · Adriatic',
      role: 'Remote Dalmatian island',
      knownFor: 'Sheltered harbors, vine terraces, and clear offshore water',
    },
    features: [
      {
        name: 'Vis town harbor',
        description:
          'Main landing on the north.',
      },
      {
        name: 'Komiža',
        description:
          'Fishing town on the west.',
      },
      {
        name: 'Vine terraces',
        description:
          'Island agriculture of the slopes.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Vis',
        url: 'https://www.britannica.com/place/Vis-island-Croatia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'picardy',
    code: 'PIC',
    name: 'Picardy',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Picardy', 'Picardie'],
    about:
      'Picardy occupies northern France as a historic region of chalk plains, Somme battlefields, and Gothic cathedral towns toward the Channel. Cool maritime weather and open farmland shape the landscape. Move from Amiens cathedral country through river valleys to the coast. Picardy’s primer is northern French chalk plain — Gothic towns and Somme fields toward the Channel.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Northern France · chalk plains',
      role: 'Historic northern French region',
      knownFor: 'Gothic cathedrals, Somme fields, and chalk plains',
    },
    features: [
      {
        name: 'Chalk plains',
        description:
          'Open farmland of the north.',
      },
      {
        name: 'Cathedral towns',
        description:
          'Gothic centers such as Amiens.',
      },
      {
        name: 'Somme country',
        description:
          'River valleys of historic memory.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Picardy',
        url: 'https://www.britannica.com/place/Picardy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mecklenburg',
    code: 'MV',
    name: 'Mecklenburg',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Mecklenburg', 'Mecklenburg-Vorpommern'],
    about:
      'Mecklenburg forms much of Germany’s northeastern lake and Baltic coast country, a region of glacial lakes, brick Hanseatic towns, and sandy shores in Mecklenburg–Western Pomerania. Cold winters and mild summers share the climate. Move from lake plateaus to Baltic beach towns and brick cities. Mecklenburg’s primer is northeastern German lake-and-coast region — glacial waters and Hanseatic brick toward the Baltic.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Northeastern Germany · lakes and Baltic',
      role: 'Lake and Baltic coastal region',
      knownFor: 'Glacial lakes, Baltic shores, and brick Hanseatic towns',
    },
    features: [
      {
        name: 'Glacial lakes',
        description:
          'Water-rich interior plateau.',
      },
      {
        name: 'Baltic shores',
        description:
          'Sandy coasts of the north.',
      },
      {
        name: 'Brick Hanseatic towns',
        description:
          'Historic ports and market cities.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mecklenburg',
        url: 'https://www.britannica.com/place/Mecklenburg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ticino',
    code: 'TIC',
    name: 'Ticino',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Ticino'],
    about:
      'Ticino is Switzerland’s Italian-speaking southern canton of palm lakeshores, Alpine valleys, and towns such as Lugano and Locarno. Mild winters for Switzerland and warm summers mark the lakes. Move from lake promenades into mountain valleys and passes. Ticino’s primer is Swiss-Italian lake canton — palm shores and Alpine valleys south of the Gotthard.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Southern Switzerland · Italian-speaking Alps',
      role: 'Italian-speaking Swiss canton',
      knownFor: 'Lugano and Locarno lakes, palm shores, and Alpine valleys',
    },
    features: [
      {
        name: 'Lake promenades',
        description:
          'Lugano and Locarno waterfronts.',
      },
      {
        name: 'Palm shores',
        description:
          'Mild lakeside vegetation.',
      },
      {
        name: 'Alpine valleys',
        description:
          'Mountain corridors inland of the lakes.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Ticino',
        url: 'https://www.britannica.com/place/Ticino',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hesse',
    code: 'HE',
    name: 'Hesse',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Hesse', 'Hessen'],
    about:
      'Hesse occupies central Germany as a federal state of Rhine-Main finance around Frankfurt, forested uplands, and spa and castle towns. Winter frost settles inland while summers stay temperate across the forests. Read Frankfurt metro, Taunus and Spessart forests, and river corridors as linked belts. Hesse’s primer is central German state — Rhine-Main hub and forested uplands around Frankfurt.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Central Germany · Rhine-Main',
      role: 'German federal state',
      knownFor: 'Frankfurt Rhine-Main, forested uplands, and spa towns',
    },
    features: [
      {
        name: 'Rhine-Main hub',
        description:
          'Frankfurt metro of the state.',
      },
      {
        name: 'Forested uplands',
        description:
          'Taunus and Spessart ranges.',
      },
      {
        name: 'Spa and castle towns',
        description:
          'Historic settlements of the interior.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Hesse',
        url: 'https://www.britannica.com/place/Hessen',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'basilicata',
    code: 'BAS',
    name: 'Basilicata',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Basilicata', 'Lucania'],
    about:
      'Basilicata occupies southern Italy’s instep as a rugged region of Sassi cave towns, Lucanian hills, and short coasts on both Ionian and Tyrrhenian seas. Hot dry summers and cooler hill winters shape the year. Move from Matera’s ravines through hill villages to coastal strips. Basilicata’s primer is southern Italian hill region — Sassi towns and Lucanian ridges between two seas.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Southern Italy · between Ionian and Tyrrhenian',
      role: 'Southern Italian region of hills and Sassi',
      knownFor: 'Matera Sassi, Lucanian hills, and dual coasts',
    },
    features: [
      {
        name: 'Sassi towns',
        description:
          'Cave dwellings of Matera’s ravines.',
      },
      {
        name: 'Lucanian hills',
        description:
          'Interior ridges of the region.',
      },
      {
        name: 'Dual coasts',
        description:
          'Short Ionian and Tyrrhenian shores.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Basilicata',
        url: 'https://www.britannica.com/place/Basilicata',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'chateau-chambord',
    code: 'CHB',
    name: 'Château de Chambord',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Château de Chambord', 'Chambord', 'Chateau de Chambord'],
    about:
      'Château de Chambord rises in the Loire marsh forest as a vast Renaissance hunting château of a double-helix staircase, forest of chimneys, and moated keep in a walled park. The silhouette organizes one of France’s most elaborate château roofs. Stand on the approach so keep, terraces, and park align. Chambord’s primer is Loire Renaissance château — double-helix stair and chimney forest in a hunting park.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Loire Valley · France',
      role: 'Renaissance royal hunting château',
      knownFor: 'Double-helix staircase, chimney skyline, and park',
    },
    features: [
      {
        name: 'Double-helix stair',
        description:
          'Interlocking Renaissance staircase.',
      },
      {
        name: 'Chimney forest',
        description:
          'Elaborate roofscape of the keep.',
      },
      {
        name: 'Walled park',
        description:
          'Forest hunting grounds around the château.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Château de Chambord',
        url: 'https://www.britannica.com/topic/Chambord-chateau-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'prague-castle',
    code: 'PRC2',
    name: 'Prague Castle',
    kind: 'Landmark',
    countrySlug: 'czechia',
    subtitle: 'Landmark · Czechia',
    matchNames: ['Prague Castle', 'Pražský hrad'],
    about:
      'Prague Castle crowns the Hradčany ridge above the Vltava as a vast castle complex of St Vitus Cathedral, royal palaces, and courtyards overlooking the city. The complex has grown for centuries as a seat of Bohemian and Czech power. Stand on the ramparts so cathedral spires, courtyards, and river city align. Prague Castle’s primer is Hradčany fortress complex — cathedral and palaces above the Vltava.',
    facts: {
      kind: 'Landmark',
      country: 'Czechia',
      region: 'Europe',
      setting: 'Hradčany · Prague',
      role: 'Historic castle complex and seat of state',
      knownFor: 'St Vitus Cathedral, palace courtyards, and river views',
    },
    features: [
      {
        name: 'St Vitus Cathedral',
        description:
          'Gothic church within the castle.',
      },
      {
        name: 'Palace courtyards',
        description:
          'Ceremonial courts of the complex.',
      },
      {
        name: 'Rampart views',
        description:
          'Overlooks of the Vltava and old town.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Prague Castle',
        url: 'https://www.britannica.com/topic/Prague-Castle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'borobudur',
    code: 'BOR',
    name: 'Borobudur',
    kind: 'Landmark',
    countrySlug: 'indonesia',
    subtitle: 'Landmark · Indonesia',
    matchNames: ['Borobudur'],
    about:
      'Borobudur rises from the Kedu Plain of Central Java as a massive Buddhist stupa-temple of terraced stone galleries, relief narratives, and a crowning bell-shaped stupa. Mist and volcanic plains frame the monument; sunrise visits are classic. Climb the terraces so reliefs, stupas, and plain align. Borobudur’s primer is Javanese Buddhist monument — terraced galleries and stupas on the Kedu Plain.',
    facts: {
      kind: 'Landmark',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'Kedu Plain · Central Java',
      role: 'Monumental Buddhist temple',
      knownFor: 'Terraced galleries, reliefs, and crowning stupas',
    },
    features: [
      {
        name: 'Terraced galleries',
        description:
          'Stone levels of narrative relief.',
      },
      {
        name: 'Bell stupas',
        description:
          'Perforated stupas of the upper levels.',
      },
      {
        name: 'Plain setting',
        description:
          'Volcanic farmland around the monument.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Borobudur',
        url: 'https://www.britannica.com/topic/Borobudur',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'red-fort',
    code: 'RDF',
    name: 'Red Fort',
    kind: 'Landmark',
    countrySlug: 'india',
    subtitle: 'Landmark · India',
    matchNames: ['Red Fort', 'Lal Qila'],
    about:
      'The Red Fort (Lal Qila) stands in Old Delhi as a Mughal sandstone fortress of red walls, ceremonial gates, and palace pavilions along a former Yamuna edge. The Lahori Gate organizes imperial arrival; courtyards hold marble halls. Enter so walls, gates, and pavilion courts read together. The Red Fort’s primer is Mughal Delhi fortress — red sandstone walls and palace courts of the imperial city.',
    facts: {
      kind: 'Landmark',
      country: 'India',
      region: 'Asia',
      setting: 'Old Delhi · India',
      role: 'Mughal fortress and palace complex',
      knownFor: 'Red sandstone walls, Lahori Gate, and palace pavilions',
    },
    features: [
      {
        name: 'Red walls',
        description:
          'Sandstone curtain of the fort.',
      },
      {
        name: 'Lahori Gate',
        description:
          'Ceremonial entrance of the complex.',
      },
      {
        name: 'Palace pavilions',
        description:
          'Marble halls within the courts.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Red Fort',
        url: 'https://www.britannica.com/topic/Red-Fort',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'topkapi',
    code: 'TOP',
    name: 'Topkapı Palace',
    kind: 'Landmark',
    countrySlug: 'turkiye',
    subtitle: 'Landmark · Türkiye',
    matchNames: ['Topkapı Palace', 'Topkapi Palace', 'Topkapı'],
    about:
      'Topkapı Palace occupies the tip of Istanbul’s historic peninsula as an Ottoman imperial complex of courts, pavilions, and treasury chambers overlooking the Golden Horn and Bosporus. Successive courtyards organize approach from the city; tiled rooms and gardens fill the inner palace. Walk the courts so gates, pavilions, and water views align. Topkapı’s primer is Ottoman imperial palace — courtyard sequence at the tip of old Istanbul.',
    facts: {
      kind: 'Landmark',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Historic peninsula · Istanbul',
      role: 'Ottoman imperial palace complex',
      knownFor: 'Courtyard sequence, pavilions, and Bosporus views',
    },
    features: [
      {
        name: 'Imperial courts',
        description:
          'Successive courtyards of the palace.',
      },
      {
        name: 'Pavilions',
        description:
          'Tiled rooms and audience chambers.',
      },
      {
        name: 'Water views',
        description:
          'Golden Horn and Bosporus overlooks.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Topkapı Palace',
        url: 'https://www.britannica.com/topic/Topkapi-Palace-Museum',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'giza',
    code: 'GIZ',
    name: 'Giza',
    kind: 'Landmark',
    countrySlug: 'egypt',
    subtitle: 'Landmark · Egypt',
    matchNames: ['Giza', 'Pyramids of Giza', 'Great Pyramid'],
    about:
      'Giza’s pyramid plateau on the desert edge of Cairo holds the Great Pyramid, companion pyramids, and the Great Sphinx as the defining Old Kingdom necropolis of ancient Egypt. Desert light and city sprawl meet at the plateau edge. Stand on the sands so pyramids, Sphinx, and desert escarpment align. Giza’s primer is pyramid plateau — Great Pyramid and Sphinx on Cairo’s desert rim.',
    facts: {
      kind: 'Landmark',
      country: 'Egypt',
      region: 'Africa',
      setting: 'Giza Plateau · edge of Cairo',
      role: 'Old Kingdom pyramid necropolis',
      knownFor: 'Great Pyramid, companion pyramids, and Great Sphinx',
    },
    features: [
      {
        name: 'Great Pyramid',
        description:
          'Largest pyramid of the plateau.',
      },
      {
        name: 'Great Sphinx',
        description:
          'Limestone guardian figure of the complex.',
      },
      {
        name: 'Desert plateau',
        description:
          'Necropolis sands at the city edge.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Giza',
        url: 'https://www.britannica.com/topic/Pyramids-of-Giza',
        kind: 'reference',
      },
    ],
  },
]
