/** Twentieth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch20: PlaceGuideDraftBatch[] = [
  {
    slug: 'orlando',
    code: 'MCO',
    name: 'Orlando',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Orlando'],
    about:
      'Orlando sits on central Florida’s lake plain as a metro of theme-park corridors, suburban grids, and a downtown core among wetlands and citrus country. Hot humid summers and mild winters define the subtropical year. Orient from downtown lakes through tourist corridors to surrounding scrub and wetlands. Orlando’s primer is central Florida lake metro — theme-park corridors and suburban grids on a humid subtropical plain.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Central Florida lake plain',
      role: 'Central Florida metro and tourism hub',
      knownFor: 'Theme-park corridors, downtown lakes, and subtropical plain',
    },
    features: [
      {
        name: 'Downtown lakes',
        description:
          'Urban water bodies in the core.',
      },
      {
        name: 'Theme-park corridors',
        description:
          'Tourism strips south of downtown.',
      },
      {
        name: 'Lake plain',
        description:
          'Wetland and scrub landscape of central Florida.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Orlando',
        url: 'https://www.britannica.com/place/Orlando-Florida',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'jacksonville',
    code: 'JAX',
    name: 'Jacksonville',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Jacksonville'],
    about:
      'Jacksonville sprawls across the St. Johns River in northeastern Florida as a large coastal plain city of bridges, naval and port industry, and Atlantic beaches east of the urban core. Subtropical heat builds through summer while winters stay comparatively soft. Read river bridges, downtown, and barrier-island beaches as linked belts. Jacksonville’s primer is St. Johns River coastal city — bridges and Atlantic beaches on Florida’s northeastern plain.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'St. Johns River · northeastern Florida',
      role: 'Northeast Florida metro and river port',
      knownFor: 'St. Johns bridges, port industry, and Atlantic beaches',
    },
    features: [
      {
        name: 'St. Johns River',
        description:
          'Broad river and bridge skyline.',
      },
      {
        name: 'Downtown core',
        description:
          'Business district on the river bend.',
      },
      {
        name: 'Atlantic beaches',
        description:
          'Barrier-island shores east of the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Jacksonville',
        url: 'https://www.britannica.com/place/Jacksonville-Florida',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'perth',
    code: 'PER',
    name: 'Perth',
    kind: 'City',
    countrySlug: 'australia',
    subtitle: 'City · Australia',
    matchNames: ['Perth'],
    about:
      'Perth occupies the Swan River estuary on Australia’s Indian Ocean coast as an isolated western capital of river parks, a compact CBD, and beaches under Mediterranean light. Hot dry summers and mild wet winters shape the year. Orient from Kings Park and the river toward Fremantle and the coastal plain. Perth’s primer is Indian Ocean capital — Swan River parks and beaches on Australia’s far western shore.',
    facts: {
      kind: 'City',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Swan River · Indian Ocean coast',
      role: 'Western Australian capital city',
      knownFor: 'Swan River, Kings Park, and Indian Ocean beaches',
    },
    features: [
      {
        name: 'Swan River estuary',
        description:
          'River parks through the metro.',
      },
      {
        name: 'Kings Park',
        description:
          'Hill green space above the CBD.',
      },
      {
        name: 'Indian Ocean beaches',
        description:
          'Western shoreline of the plain.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Perth',
        url: 'https://www.britannica.com/place/Perth-Western-Australia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hobart',
    code: 'HBA',
    name: 'Hobart',
    kind: 'City',
    countrySlug: 'australia',
    subtitle: 'City · Australia',
    matchNames: ['Hobart'],
    about:
      'Hobart sits on the Derwent estuary beneath Mount Wellington in Tasmania as a compact harbor capital of sandstone warehouses, waterfront markets, and cool southern light. Cool winters and mild summers define the island climate. Stand on the waterfront so mountain, harbor, and historic docks align. Hobart’s primer is Tasmanian harbor capital — Derwent docks under Wellington’s mountain wall.',
    facts: {
      kind: 'City',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Derwent estuary · Tasmania',
      role: 'Tasmanian capital and harbor city',
      knownFor: 'Derwent waterfront, Mount Wellington, and sandstone docks',
    },
    features: [
      {
        name: 'Derwent waterfront',
        description:
          'Harbor and historic dock precinct.',
      },
      {
        name: 'Mount Wellington',
        description:
          'Mountain wall above the city.',
      },
      {
        name: 'Sandstone warehouses',
        description:
          'Colonial fabric of the waterfront.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Hobart',
        url: 'https://www.britannica.com/place/Hobart',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'christchurch',
    code: 'CHC',
    name: 'Christchurch',
    kind: 'City',
    countrySlug: 'new-zealand',
    subtitle: 'City · New Zealand',
    matchNames: ['Christchurch'],
    about:
      'Christchurch spreads across the Canterbury Plains toward the Southern Alps as New Zealand’s South Island garden city of Avon River parks, rebuilt civic core, and Port Hills rim. Cool winters and mild summers share the plains climate. Orient from the Avon and cathedral square approaches to the hills and Alps horizon. Christchurch’s primer is Canterbury plains city — Avon parks and Port Hills under an Alps skyline.',
    facts: {
      kind: 'City',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'Canterbury Plains · South Island',
      role: 'South Island metro and garden city',
      knownFor: 'Avon River parks, Port Hills, and Alps horizon',
    },
    features: [
      {
        name: 'Avon River parks',
        description:
          'Garden waterways through the city.',
      },
      {
        name: 'Port Hills',
        description:
          'Volcanic rim south of the plains.',
      },
      {
        name: 'Alps horizon',
        description:
          'Southern Alps wall to the west.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Christchurch',
        url: 'https://www.britannica.com/place/Christchurch-New-Zealand',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tampere',
    code: 'TMP',
    name: 'Tampere',
    kind: 'City',
    countrySlug: 'finland',
    subtitle: 'City · Finland',
    matchNames: ['Tampere'],
    about:
      'Tampere occupies the isthmus between Lakes Näsijärvi and Pyhäjärvi in southern Finland as an industrial heritage city of red-brick mills, rapids, and lakeside parks. Long snowy winters and bright summers define the Nordic year. Walk from the Tammerkoski rapids through mill districts to the twin lake shores. Tampere’s primer is Finnish lake-isthmus city — red-brick mills between two large lakes.',
    facts: {
      kind: 'City',
      country: 'Finland',
      region: 'Europe',
      setting: 'Lakes Näsijärvi and Pyhäjärvi · southern Finland',
      role: 'Major inland Finnish industrial city',
      knownFor: 'Tammerkoski rapids, red-brick mills, and twin lakes',
    },
    features: [
      {
        name: 'Tammerkoski',
        description:
          'Rapids corridor through the center.',
      },
      {
        name: 'Red-brick mills',
        description:
          'Industrial heritage of the isthmus.',
      },
      {
        name: 'Twin lake shores',
        description:
          'Näsijärvi and Pyhäjärvi waterfronts.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Tampere',
        url: 'https://www.britannica.com/place/Tampere',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'wroclaw',
    code: 'WRO',
    name: 'Wrocław',
    kind: 'City',
    countrySlug: 'poland',
    subtitle: 'City · Poland',
    matchNames: ['Wrocław', 'Wroclaw', 'Breslau'],
    about:
      'Wrocław sits on the Odra River in Lower Silesia as a Polish city of island bridges, a colorful Market Square, and a rebuilt historic core after wartime destruction. Inland winters bite hard while summers turn warm across the river islands. Cross the river islands so cathedral island, market square, and bridges read together. Wrocław’s primer is Odra island city — Market Square and cathedral island in Lower Silesia.',
    facts: {
      kind: 'City',
      country: 'Poland',
      region: 'Europe',
      setting: 'Odra River · Lower Silesia',
      role: 'Lower Silesian capital and river city',
      knownFor: 'Market Square, Odra islands, and cathedral island',
    },
    features: [
      {
        name: 'Market Square',
        description:
          'Colorful central plaza of the old town.',
      },
      {
        name: 'Odra islands',
        description:
          'Bridged river islands of the core.',
      },
      {
        name: 'Cathedral Island',
        description:
          'Historic Ostrów Tumski quarter.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Wrocław',
        url: 'https://www.britannica.com/place/Wroclaw',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'belfast',
    code: 'BFS',
    name: 'Belfast',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Belfast'],
    about:
      'Belfast occupies the Lagan valley at the head of Belfast Lough in Northern Ireland as a shipyard and civic city of Victorian halls, waterfront regeneration, and surrounding hills. Mild wet weather is common year-round. Orient from City Hall and the Lagan toward the lough and Cave Hill. Belfast’s primer is Northern Irish capital — Lagan waterfront and civic halls at the head of Belfast Lough.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Lagan · Belfast Lough',
      role: 'Northern Ireland capital and port city',
      knownFor: 'Lagan waterfront, City Hall, and shipyard heritage',
    },
    features: [
      {
        name: 'Lagan waterfront',
        description:
          'Regenerated river and dock edge.',
      },
      {
        name: 'City Hall',
        description:
          'Victorian civic landmark of the center.',
      },
      {
        name: 'Belfast Lough',
        description:
          'Sea inlet approaching the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Belfast',
        url: 'https://www.britannica.com/place/Belfast',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cardiff',
    code: 'CWL',
    name: 'Cardiff',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Cardiff'],
    about:
      'Cardiff sits on the Taff estuary in South Wales as a capital of Victorian civic parks, a castle mound, and a regenerated bay waterfront. Mild wet Atlantic weather prevails. Move from castle and civic center to Cardiff Bay and surrounding valleys. Cardiff’s primer is Welsh capital — castle, civic parks, and bay waterfront on the Taff estuary.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Taff · South Wales',
      role: 'Capital of Wales and estuary city',
      knownFor: 'Cardiff Castle, civic center, and Cardiff Bay',
    },
    features: [
      {
        name: 'Cardiff Castle',
        description:
          'Historic mound and castle in the core.',
      },
      {
        name: 'Civic center',
        description:
          'Parkland government and museum district.',
      },
      {
        name: 'Cardiff Bay',
        description:
          'Regenerated estuary waterfront.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Cardiff',
        url: 'https://www.britannica.com/place/Cardiff-Wales',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nice',
    code: 'NCE',
    name: 'Nice',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Nice'],
    about:
      'Nice curves along the Baie des Anges on France’s Côte d’Azur as a Mediterranean city of the Promenade des Anglais, Italianate old town, and limestone hills behind the shore. Mild winters and hot dry summers define the Riviera climate. Walk the promenade so bay, pebbled beach, and hill backdrop align. Nice’s primer is Riviera bay city — Promenade des Anglais and old town on the Baie des Anges.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Baie des Anges · Côte d’Azur',
      role: 'Major French Riviera city',
      knownFor: 'Promenade des Anglais, old town, and Baie des Anges',
    },
    features: [
      {
        name: 'Promenade des Anglais',
        description:
          'Seafront walk along the bay.',
      },
      {
        name: 'Vieux Nice',
        description:
          'Italianate old-town lanes.',
      },
      {
        name: 'Bay shoreline',
        description:
          'Pebbled beach under limestone hills.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Nice',
        url: 'https://www.britannica.com/place/Nice-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'verona',
    code: 'VRN',
    name: 'Verona',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Verona'],
    about:
      'Verona occupies a bend of the Adige in Veneto as a Roman and medieval city of an arena amphitheatre, pink-brick piazzas, and bridges under Lessini hill approaches. Hot summers and cool winters share the plain climate. Walk from the Arena through Piazza delle Erbe to the river bend. Verona’s primer is Adige arena city — Roman amphitheatre and pink-brick squares on a Veneto river bend.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Adige River · Veneto',
      role: 'Historic Veneto city of Roman and medieval fabric',
      knownFor: 'Arena amphitheatre, Adige bridges, and historic piazzas',
    },
    features: [
      {
        name: 'Arena',
        description:
          'Roman amphitheatre of the city center.',
      },
      {
        name: 'Adige bend',
        description:
          'River curve and historic bridges.',
      },
      {
        name: 'Pink-brick piazzas',
        description:
          'Medieval squares of the core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Verona',
        url: 'https://www.britannica.com/place/Verona-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'monterrey',
    code: 'MTY',
    name: 'Monterrey',
    kind: 'City',
    countrySlug: 'mexico',
    subtitle: 'City · Mexico',
    matchNames: ['Monterrey'],
    about:
      'Monterrey fills a valley at the foot of the Sierra Madre Oriental in northeastern Mexico as an industrial metro of Cerro de la Silla’s saddle silhouette, river parks, and a dense business core. Hot summers and mild winters mark the semi-arid climate. Read mountain walls, valley floor, and Cerro de la Silla together. Monterrey’s primer is Sierra Madre industrial city — valley metro under a saddle-shaped mountain landmark.',
    facts: {
      kind: 'City',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Sierra Madre Oriental · northeastern Mexico',
      role: 'Major northeastern Mexican industrial metro',
      knownFor: 'Cerro de la Silla, mountain valley, and industrial core',
    },
    features: [
      {
        name: 'Cerro de la Silla',
        description:
          'Saddle mountain landmark of the city.',
      },
      {
        name: 'Mountain valley',
        description:
          'Sierra walls enclosing the metro.',
      },
      {
        name: 'Industrial core',
        description:
          'Business and factory districts of the valley.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Monterrey',
        url: 'https://www.britannica.com/place/Monterrey-Mexico',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'oklahoma',
    code: 'OK',
    name: 'Oklahoma',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Oklahoma'],
    about:
      'Oklahoma occupies the southern Great Plains as a state of prairie and cross-timbers, red-dirt river valleys, and a transition from humid east to drier high plains west. Oklahoma City and Tulsa organize metro poles; severe storms mark spring. Read eastern forests, central prairie, and western plains as linked belts. Oklahoma’s primer is southern plains state — red rivers, prairie, and a sharp east–west moisture gradient.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Southern Great Plains · United States',
      role: 'Southern plains state',
      knownFor: 'Prairie and cross-timbers, red rivers, and storm climate',
    },
    features: [
      {
        name: 'Central prairie',
        description:
          'Grassland heart of the state.',
      },
      {
        name: 'Red river valleys',
        description:
          'Iron-stained waterways of the south.',
      },
      {
        name: 'High plains west',
        description:
          'Drier western Oklahoma grasslands.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Oklahoma',
        url: 'https://www.britannica.com/place/Oklahoma-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'louisiana',
    code: 'LA',
    name: 'Louisiana',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Louisiana'],
    about:
      'Louisiana occupies the lower Mississippi Delta and Gulf coast as a state of bayous, wetlands, and a cultural corridor from New Orleans through Cajun country. Hot humid summers and mild winters define the subtropical climate. Move from Mississippi River levees through swamp and prairie to the Gulf fringe. Louisiana’s primer is Delta and Gulf state — bayous, levees, and wetland coasts of the lower Mississippi.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi Delta · Gulf of Mexico',
      role: 'Lower Mississippi and Gulf state',
      knownFor: 'Bayous, Mississippi levees, and Gulf wetlands',
    },
    features: [
      {
        name: 'Mississippi levees',
        description:
          'River corridor of the eastern state.',
      },
      {
        name: 'Bayou wetlands',
        description:
          'Swamp and marsh landscapes.',
      },
      {
        name: 'Gulf fringe',
        description:
          'Coastal edge of southern Louisiana.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Louisiana',
        url: 'https://www.britannica.com/place/Louisiana-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kentucky',
    code: 'KY',
    name: 'Kentucky',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Kentucky'],
    about:
      'Kentucky stretches from Appalachian mountains east through bluegrass limestone country to the Ohio and Mississippi rivers west. Horse farms, bourbon country, and forested hills organize regional identity; humid summers and cool winters prevail. Read mountains, bluegrass, and western rivers as stacked belts. Kentucky’s primer is bluegrass and Appalachian state — limestone horse country between mountains and the Ohio River.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Appalachians to Ohio River · United States',
      role: 'Upper South state of bluegrass and mountains',
      knownFor: 'Bluegrass farms, Appalachian east, and Ohio River border',
    },
    features: [
      {
        name: 'Bluegrass country',
        description:
          'Limestone horse-farm heartland.',
      },
      {
        name: 'Appalachian east',
        description:
          'Mountain counties of the east.',
      },
      {
        name: 'Ohio River border',
        description:
          'Northern river edge of the state.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Kentucky',
        url: 'https://www.britannica.com/place/Kentucky-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aegina',
    code: 'AEG',
    name: 'Aegina',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Aegina', 'Aigina'],
    about:
      'Aegina is a Saronic Gulf island near Athens of pistachio groves, a hilltop Temple of Aphaia, and a harbor town facing the mainland. Ferries make it a day-trip island; beaches and inland villages fill quieter corners. Summer heat and rainless weeks shape the island calendar. Land at the harbor and climb toward Aphaia’s temple ridge. Aegina’s primer is near-Athens Saronic island — pistachio slopes and a classical temple above a busy harbor.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Saronic Gulf · near Athens',
      role: 'Saronic island near the capital',
      knownFor: 'Temple of Aphaia, pistachio groves, and harbor town',
    },
    features: [
      {
        name: 'Temple of Aphaia',
        description:
          'Hilltop classical temple.',
      },
      {
        name: 'Harbor town',
        description:
          'Ferry port facing the mainland.',
      },
      {
        name: 'Pistachio groves',
        description:
          'Island agriculture of the interior.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Aegina',
        url: 'https://www.britannica.com/place/Aegina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'poros',
    code: 'POR',
    name: 'Poros',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Poros'],
    about:
      'Poros is a small Saronic island pair of a pine-covered hill town facing a narrow channel to the Peloponnese, with clock-tower waterfront and boat traffic in the strait. Mild Mediterranean seasons prevail. Stand on the waterfront so channel, town, and mainland hills align. Poros’s primer is Saronic channel island — pine hill town across a narrow strait from the Peloponnese.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Saronic Gulf · opposite Peloponnese',
      role: 'Small Saronic channel island',
      knownFor: 'Channel waterfront, clock tower, and pine hills',
    },
    features: [
      {
        name: 'Channel waterfront',
        description:
          'Harbor facing the mainland strait.',
      },
      {
        name: 'Pine hill town',
        description:
          'Sloped streets above the port.',
      },
      {
        name: 'Peloponnese views',
        description:
          'Mainland hills across the water.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Poros',
        url: 'https://www.britannica.com/place/Poros-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'favignana',
    code: 'FAV',
    name: 'Favignana',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Favignana'],
    about:
      'Favignana is the largest Egadi island west of Sicily of clear turquoise coves, tuff quarries, and a butterfly-shaped outline in the Strait of Sicily. Tuna-fishing heritage marks the main town; bikes circle coastal roads. Intense summer sun and scarce rain suit the quarry coasts. Circle from the harbor to cala beaches and quarry cuts. Favignana’s primer is Egadi butterfly island — turquoise coves and tuff quarries west of Sicily.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Egadi Islands · west of Sicily',
      role: 'Largest Egadi island',
      knownFor: 'Turquoise coves, tuff quarries, and tuna heritage',
    },
    features: [
      {
        name: 'Turquoise coves',
        description:
          'Clear swimming bays of the coast.',
      },
      {
        name: 'Tuff quarries',
        description:
          'Historic stone cuts in the island rock.',
      },
      {
        name: 'Harbor town',
        description:
          'Main settlement of fishing heritage.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Favignana',
        url: 'https://www.britannica.com/place/Favignana',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'procida',
    code: 'PRC',
    name: 'Procida',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Procida'],
    about:
      'Procida is a colorful Bay of Naples island of stacked pastel houses at Corricella harbor, narrow lanes, and a compact volcanic outline near Ischia. Fishing boats fill the bay; viewpoints overlook the pastel amphitheatre of houses. Mild Mediterranean seasons prevail. Land at Marina Grande and walk to Corricella’s colorful cove. Procida’s primer is pastel Bay of Naples island — Corricella’s stacked harbor houses on a tiny volcanic isle.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · near Ischia',
      role: 'Colorful fishing island in the bay',
      knownFor: 'Corricella harbor, pastel houses, and compact lanes',
    },
    features: [
      {
        name: 'Corricella',
        description:
          'Pastel fishing harbor amphitheatre.',
      },
      {
        name: 'Marina Grande',
        description:
          'Main ferry landing.',
      },
      {
        name: 'Narrow lanes',
        description:
          'Compact streets of the volcanic isle.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Procida',
        url: 'https://www.britannica.com/place/Procida',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'djerba',
    code: 'DJE',
    name: 'Djerba',
    kind: 'Island',
    countrySlug: 'tunisia',
    subtitle: 'Island · Tunisia',
    matchNames: ['Djerba', 'Jerba'],
    about:
      'Djerba is a large Tunisian island in the Gulf of Gabès of flat palm and olive landscapes, whitewashed villages, and long sandy shores. Houmt Souk organizes markets and harbor life; Jewish and Amazigh heritage layers mark the culture. Hot dry summers and mild winters define the climate. Move from Houmt Souk through palm countryside to beach coasts. Djerba’s primer is Tunisian Gulf island — palm plains and white villages on a flat Mediterranean isle.',
    facts: {
      kind: 'Island',
      country: 'Tunisia',
      region: 'Africa',
      setting: 'Gulf of Gabès · Tunisia',
      role: 'Large Tunisian Mediterranean island',
      knownFor: 'Palm landscapes, Houmt Souk, and sandy shores',
    },
    features: [
      {
        name: 'Houmt Souk',
        description:
          'Market and harbor town of the island.',
      },
      {
        name: 'Palm and olive plain',
        description:
          'Flat agricultural interior.',
      },
      {
        name: 'Sandy shores',
        description:
          'Long beach coasts of the Gulf.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Djerba',
        url: 'https://www.britannica.com/place/Jarbah',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'orkney',
    code: 'KOI',
    name: 'Orkney',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Orkney', 'Orkney Islands'],
    about:
      'Orkney is an archipelago north of mainland Scotland of green treeless islands, Neolithic monuments, and Atlantic cliffs around Scapa Flow. Skara Brae and the Ring of Brodgar organize prehistoric fame; Kirkwall anchors the main island. Persistent Atlantic wind and bright midsummer nights set the pace. Move from Kirkwall to Neolithic heartland and coastal cliffs. Orkney’s primer is Neolithic northern archipelago — green islands, stone circles, and Atlantic cliffs above Scapa Flow.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'North of mainland Scotland · Atlantic',
      role: 'Scottish archipelago of Neolithic sites',
      knownFor: 'Skara Brae, Ring of Brodgar, and Scapa Flow',
    },
    features: [
      {
        name: 'Neolithic heartland',
        description:
          'Skara Brae and Brodgar monuments.',
      },
      {
        name: 'Kirkwall',
        description:
          'Main town of Mainland Orkney.',
      },
      {
        name: 'Atlantic cliffs',
        description:
          'Sea edges around Scapa Flow.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Orkney',
        url: 'https://www.britannica.com/place/Orkney-Islands',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'trentino',
    code: 'TAA',
    name: 'Trentino',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Trentino', 'Trentino-Alto Adige', 'Trentino–Alto Adige'],
    about:
      'Trentino occupies the Italian Alps north of Lake Garda as a region of Dolomite peaks, valley orchards, and bilingual Alpine towns around Trento. Lakes and ski valleys organize tourism; cool mountain winters and warm valley summers share the climate. Read Dolomites, Adige valley, and lake approaches as linked belts. Trentino’s primer is Alpine Italian region — Dolomite valleys and orchard floors north of Lake Garda.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Italian Alps · north of Lake Garda',
      role: 'Alpine autonomous region of northern Italy',
      knownFor: 'Dolomites, Adige valley, and Alpine lakes',
    },
    features: [
      {
        name: 'Dolomite peaks',
        description:
          'Mountain walls of the east.',
      },
      {
        name: 'Adige valley',
        description:
          'Orchard and town corridor.',
      },
      {
        name: 'Alpine lakes',
        description:
          'Valley water bodies of the region.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Trentino',
        url: 'https://www.britannica.com/place/Trentino-Alto-Adige',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aquitaine',
    code: 'AQU',
    name: 'Aquitaine',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Aquitaine'],
    about:
      'Aquitaine covers southwestern France from the Atlantic dunes and pine Landes to Bordeaux vineyards and Pyrenean approaches. Long surf beaches and wine estates organize identity; mild oceanic weather prevails. Move from Atlantic shore through vineyard country to inland rivers and foothills. Aquitaine’s primer is Atlantic southwest France — Landes pines, Bordeaux vines, and dune coasts in one historic outline.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Atlantic southwest · France',
      role: 'Historic southwestern French region',
      knownFor: 'Bordeaux vineyards, Landes pines, and Atlantic dunes',
    },
    features: [
      {
        name: 'Atlantic dunes',
        description:
          'Surf coast and pine hinterland.',
      },
      {
        name: 'Bordeaux vineyards',
        description:
          'Wine estates of the Garonne country.',
      },
      {
        name: 'Pyrenean approaches',
        description:
          'Southern foothill edge of the region.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Aquitaine',
        url: 'https://www.britannica.com/place/Aquitaine',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'thuringia',
    code: 'THU',
    name: 'Thuringia',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Thuringia', 'Thüringen'],
    about:
      'Thuringia occupies central Germany as a Free State of forested uplands, classical Weimar, and Wartburg country around Erfurt. The Thuringian Forest organizes hiking ridges; cultural towns fill the basins. Cold winters and mild summers share the inland climate. Read forest ridges, classical towns, and basin cities as linked belts. Thuringia’s primer is central German forest state — Weimar culture and upland ridges around Erfurt.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Central Germany · Thuringian Forest',
      role: 'German Free State in the center',
      knownFor: 'Thuringian Forest, Weimar, and Erfurt',
    },
    features: [
      {
        name: 'Thuringian Forest',
        description:
          'Upland ridges of the south.',
      },
      {
        name: 'Classical towns',
        description:
          'Weimar and peer cultural centers.',
      },
      {
        name: 'Basin cities',
        description:
          'Erfurt and valley settlements.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Thuringia',
        url: 'https://www.britannica.com/place/Thuringia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'brandenburg',
    code: 'BB',
    name: 'Brandenburg',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Brandenburg'],
    about:
      'Brandenburg surrounds Berlin as a German Free State of lakes, pine forests, sandy plains, and Spreewald waterways. Potsdam’s palaces mark royal heritage; sparse settlement fills much of the countryside. Cold winters and mild summers define the continental climate. Move from Berlin’s edge through lake districts to Spreewald and Oder approaches. Brandenburg’s primer is Berlin hinterland state — lakes, pines, and palace parks on the north German plain.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'North German plain · around Berlin',
      role: 'German Free State surrounding Berlin',
      knownFor: 'Lakes and pines, Potsdam palaces, and Spreewald',
    },
    features: [
      {
        name: 'Lake districts',
        description:
          'Water-rich plains around Berlin.',
      },
      {
        name: 'Potsdam palaces',
        description:
          'Royal park heritage of the state.',
      },
      {
        name: 'Spreewald',
        description:
          'Canal and wetland landscape southeast.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Brandenburg',
        url: 'https://www.britannica.com/place/Brandenburg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'languedoc',
    code: 'LGD',
    name: 'Languedoc',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Languedoc', 'Languedoc-Roussillon'],
    about:
      'Languedoc occupies southern France between the Massif Central and the Mediterranean as a historic region of vineyards, Roman towns, and lagoon coasts around Montpellier and Narbonne. Hot dry summers and mild winters shape the wine plain; the Canal du Midi threads the lowlands. Move from Mediterranean lagoons through vineyard floors to inland hills. Languedoc’s primer is Mediterranean wine plain — Roman towns and lagoon coasts of southern France.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Mediterranean · southern France',
      role: 'Historic southern French wine and coastal region',
      knownFor: 'Vineyards, Roman towns, and lagoon coasts',
    },
    features: [
      {
        name: 'Wine plain',
        description:
          'Vineyard floors of the Mediterranean lowlands.',
      },
      {
        name: 'Lagoon coasts',
        description:
          'Étang shores along the southern edge.',
      },
      {
        name: 'Roman towns',
        description:
          'Historic settlements of the coastal plain.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Languedoc',
        url: 'https://www.britannica.com/place/Languedoc',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tokyo-skytree',
    code: 'TST',
    name: 'Tokyo Skytree',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Tokyo Skytree', 'Skytree'],
    about:
      'Tokyo Skytree rises above Sumida as a lattice broadcasting and observation tower that is among the world’s tallest structures, with glass decks overlooking Greater Tokyo. The base complex holds shops and an aquarium edge; the shaft tapers into the sky. Stand near the base or on decks so tower, Sumida, and city grid align. Tokyo Skytree’s primer is Sumida observation tower — a blue-white lattice spire above eastern Tokyo.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Sumida · Tokyo',
      role: 'Broadcasting and observation tower',
      knownFor: 'Lattice shaft, observation decks, and Tokyo panorama',
    },
    features: [
      {
        name: 'Lattice shaft',
        description:
          'Tall blue-white tower structure.',
      },
      {
        name: 'Observation decks',
        description:
          'Glass viewpoints over Greater Tokyo.',
      },
      {
        name: 'Base complex',
        description:
          'Commercial plaza at the tower foot.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Tokyo Skytree',
        url: 'https://www.britannica.com/topic/Tokyo-Sky-Tree',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'duomo-florence',
    code: 'DFL',
    name: 'Florence Cathedral',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Florence Cathedral', 'Duomo di Firenze', 'Santa Maria del Fiore', 'Brunelleschi Dome'],
    about:
      'Florence Cathedral crowns the city’s historic core as Santa Maria del Fiore, a vast Gothic cathedral finished by Brunelleschi’s great brick dome above marble façades and a separate campanile. The dome organizes Florence’s skyline; the baptistery stands opposite. Stand in the piazza so dome, façade, and campanile read together. Florence Cathedral’s primer is Brunelleschi dome — marble cathedral and brick cupola at the heart of Florence.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Historic center · Florence',
      role: 'Cathedral of Florence with Brunelleschi dome',
      knownFor: 'Brunelleschi’s dome, marble façade, and campanile',
    },
    features: [
      {
        name: 'Brunelleschi\'s dome',
        description:
          'Great brick cupola of the skyline.',
      },
      {
        name: 'Marble façade',
        description:
          'Polychrome front of the cathedral.',
      },
      {
        name: 'Campanile',
        description:
          'Freestanding bell tower of the complex.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Florence Cathedral',
        url: 'https://www.britannica.com/topic/cathedral-of-Florence',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'charles-bridge',
    code: 'CHL',
    name: 'Charles Bridge',
    kind: 'Landmark',
    countrySlug: 'czechia',
    subtitle: 'Landmark · Czechia',
    matchNames: ['Charles Bridge', 'Karlův most', 'Karluv most'],
    about:
      'Charles Bridge spans the Vltava in Prague as a historic stone bridge of Baroque statues, towers at either end, and a pedestrian crossing between Old Town and Malá Strana. Thirty statues line the parapets; the bridge has carried traffic since the Middle Ages. Stand mid-span so towers, river, and castle hill align. Charles Bridge’s primer is Prague river bridge — statue-lined stone spans between Old Town towers and castle approaches.',
    facts: {
      kind: 'Landmark',
      country: 'Czechia',
      region: 'Europe',
      setting: 'Vltava River · Prague',
      role: 'Historic pedestrian bridge with towers and statues',
      knownFor: 'Baroque statues, bridge towers, and Vltava views',
    },
    features: [
      {
        name: 'Statue-lined parapets',
        description:
          'Baroque figures along the crossing.',
      },
      {
        name: 'Bridge towers',
        description:
          'Gothic towers at Old Town and Malá Strana ends.',
      },
      {
        name: 'Vltava views',
        description:
          'River and castle-hill outlooks from mid-span.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Charles Bridge',
        url: 'https://www.britannica.com/topic/Charles-Bridge',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'space-needle',
    code: 'NEE',
    name: 'Space Needle',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Space Needle'],
    about:
      'The Space Needle rises above Seattle Center as a 1962 World’s Fair observation tower of a slender stem and saucer top with views over Elliott Bay and the Cascades. The futurist silhouette anchors Seattle’s skyline identity; grounds hold the fair campus. Stand at the base or decks so stem, saucer, and bay-mountain backdrop align. The Space Needle’s primer is Seattle fair tower — saucer observation deck above Elliott Bay and Cascades views.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Seattle Center · Washington',
      role: 'World’s Fair observation tower',
      knownFor: 'Saucer top, slender stem, and bay views',
    },
    features: [
      {
        name: 'Saucer top',
        description:
          'Observation deck of the tower.',
      },
      {
        name: 'Slender stem',
        description:
          'Futurist shaft of the 1962 fair.',
      },
      {
        name: 'Bay and Cascades views',
        description:
          'Elliott Bay and mountain backdrop.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Space Needle',
        url: 'https://www.britannica.com/topic/Space-Needle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mount-vernon',
    code: 'MVN',
    name: 'Mount Vernon',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Mount Vernon'],
    about:
      'Mount Vernon occupies a Potomac River bluff in Virginia as George Washington’s estate of a columned mansion, formal gardens, and river views preserved as a historic plantation landscape. Outbuildings and paths organize the grounds; the mansion faces the water. Walk from river lawn to mansion portico and garden rooms. Mount Vernon’s primer is Potomac presidential estate — columned mansion and gardens on a Virginia river bluff.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Potomac River · Virginia',
      role: 'Historic presidential estate',
      knownFor: 'Mansion portico, Potomac views, and formal gardens',
    },
    features: [
      {
        name: 'Mansion portico',
        description:
          'Columned river-facing house.',
      },
      {
        name: 'Potomac bluff',
        description:
          'River views from the lawn.',
      },
      {
        name: 'Formal gardens',
        description:
          'Period garden rooms of the estate.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mount Vernon',
        url: 'https://www.britannica.com/topic/Mount-Vernon',
        kind: 'reference',
      },
      {
        label: 'Mount Vernon Official Site',
        url: 'https://www.mountvernon.org/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'chateau-chenonceau',
    code: 'CHN',
    name: 'Château de Chenonceau',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Château de Chenonceau', 'Chenonceau', 'Chateau de Chenonceau'],
    about:
      'Château de Chenonceau spans the Cher River in the Loire Valley as a Renaissance château of a gallery bridge over water, formal gardens, and pale stone façades among trees. The arched spans organize the famous river crossing; gardens flank either bank. Stand on the bank so arches, gallery, and river align. Chenonceau’s primer is Loire river château — a Renaissance gallery bridge spanning the Cher.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Cher River · Loire Valley',
      role: 'Renaissance château on a river bridge',
      knownFor: 'Gallery bridge, Cher arches, and formal gardens',
    },
    features: [
      {
        name: 'Gallery bridge',
        description:
          'Renaissance span over the Cher.',
      },
      {
        name: 'River arches',
        description:
          'Arched supports in the water.',
      },
      {
        name: 'Formal gardens',
        description:
          'Garden parterres on either bank.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Château de Chenonceau',
        url: 'https://www.britannica.com/topic/Chenonceaux',
        kind: 'reference',
      },
    ],
  },
]
