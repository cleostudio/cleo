/** Twenty-second curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch22: PlaceGuideDraftBatch[] = [
  {
    slug: 'sheffield',
    code: 'SHF',
    name: 'Sheffield',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Sheffield'],
    about:
      'Sheffield occupies the Don and Sheaf valleys on the eastern edge of the Peak District as a South Yorkshire city of steel heritage, university quarters, and green corridors climbing into gritstone moors. Victorian industrial fabric and postwar rebuild share the basin; parks push into the hills. Cool wet weather keeps the valleys under frequent Atlantic cloud. Walk from the station quarter through the park ribbons toward the Peak fringe. Sheffield’s primer is Peak-edge steel city — valley industry and moor approaches in South Yorkshire.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Don–Sheaf valleys · South Yorkshire',
      role: 'South Yorkshire industrial and university city',
      knownFor: 'Steel heritage, Peak District approaches, and valley parks',
    },
    features: [
      {
        name: 'Don valley',
        description:
          'Industrial and river corridor of the basin.',
      },
      {
        name: 'Peak fringe',
        description:
          'Gritstone moor approaches west of the city.',
      },
      {
        name: 'University quarters',
        description:
          'Campus neighborhoods in the urban core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Sheffield',
        url: 'https://www.britannica.com/place/Sheffield-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bristol',
    code: 'BRI2',
    name: 'Bristol',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Bristol'],
    about:
      'Bristol sits on the Avon near the Severn estuary as a western English city of floating harbor warehouses, steep Georgian terraces, and a regenerating waterfront. Mild Atlantic weather and tidal range shape the docks. Orient from the harbourside through Clifton’s gorge edge to the old merchant streets. Bristol’s primer is Avon harbor city — floating docks and hillside terraces above the Severn approaches.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Avon · Severn estuary approaches',
      role: 'West of England harbor and creative metro',
      knownFor: 'Floating harbour, Clifton gorge edge, and merchant streets',
    },
    features: [
      {
        name: 'Floating harbour',
        description:
          'Locked dock basin of the city core.',
      },
      {
        name: 'Clifton edge',
        description:
          'Hill terraces above the Avon Gorge.',
      },
      {
        name: 'Merchant streets',
        description:
          'Historic trading fabric near the docks.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Bristol',
        url: 'https://www.britannica.com/place/Bristol-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'newcastle',
    code: 'NCL2',
    name: 'Newcastle',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Newcastle', 'Newcastle upon Tyne'],
    about:
      'Newcastle upon Tyne occupies the north bank of the Tyne in northeast England as a city of arched bridges, sandstone streets, and a quayside remade from coal-port industry. Cool North Sea weather keeps the river under frequent grey light. Cross from the Quayside through Grainger Town’s classical streets to the castle knoll. Newcastle’s primer is Tyne bridge city — arched crossings and sandstone streets of northeast England.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Tyne · northeast England',
      role: 'Tyne metro and northeast English hub',
      knownFor: 'Tyne bridges, Quayside, and Grainger Town streets',
    },
    features: [
      {
        name: 'Tyne bridges',
        description:
          'Arched crossings that define the skyline.',
      },
      {
        name: 'Quayside',
        description:
          'Riverfront once tied to coal trade.',
      },
      {
        name: 'Grainger Town',
        description:
          'Classical sandstone street grid.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Newcastle upon Tyne',
        url: 'https://www.britannica.com/place/Newcastle-upon-Tyne',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nottingham',
    code: 'NGM',
    name: 'Nottingham',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Nottingham'],
    about:
      'Nottingham sits on the Trent in the English Midlands as a city of sandstone caves, a castle rock, and lace-and-bicycle industrial layers under a compact center. Mild inland weather prevails. Climb from the Market Square to the castle terrace, then follow lanes into the lace-market quarter. Nottingham’s primer is Trent Midland city — castle rock, caves, and lace-market streets above the river.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Trent · English Midlands',
      role: 'Midlands city and historic market center',
      knownFor: 'Castle rock, sandstone caves, and lace-market streets',
    },
    features: [
      {
        name: 'Castle rock',
        description:
          'Elevated sandstone outcrop of the center.',
      },
      {
        name: 'Cave network',
        description:
          'Worked sandstone chambers beneath streets.',
      },
      {
        name: 'Lace Market',
        description:
          'Historic textile quarter of narrow streets.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Nottingham',
        url: 'https://www.britannica.com/place/Nottingham-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nantes',
    code: 'NAN',
    name: 'Nantes',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Nantes'],
    about:
      'Nantes occupies the Loire near the Atlantic as a western French city of island quays, ducal castle stone, and a former shipyard zone remade as cultural ground. Mild oceanic weather keeps the river under soft light. Walk from the château through the Bouffay lanes to the Île de Nantes machine park. Nantes’s primer is Loire estuary city — ducal castle and island quays where the river meets Atlantic approaches.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Loire · Atlantic approaches',
      role: 'Loire-Atlantique metro and former ducal capital',
      knownFor: 'Ducal castle, island quays, and Loire waterfront',
    },
    features: [
      {
        name: 'Ducal castle',
        description:
          'Stone fortress of the historic core.',
      },
      {
        name: 'Île de Nantes',
        description:
          'Former shipyard island remade for culture.',
      },
      {
        name: 'Bouffay lanes',
        description:
          'Medieval street grain near the castle.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Nantes',
        url: 'https://www.britannica.com/place/Nantes',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lille',
    code: 'LIL',
    name: 'Lille',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Lille'],
    about:
      'Lille sits on the Deûle in French Flanders as a northern city of Flemish gables, a star citadel, and a dense brick old town under cool North Sea weather. Orient from the Grand Place through Vieux-Lille lanes to Vauban’s citadel park. Brick and stone share the street walls; markets fill the squares. Lille’s primer is Flemish brick city — gabled squares and citadel park on France’s northern plain.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Deûle · French Flanders',
      role: 'Northern French metro and Flemish gateway',
      knownFor: 'Flemish gables, Grand Place, and Vauban citadel',
    },
    features: [
      {
        name: 'Grand Place',
        description:
          'Central square of the civic core.',
      },
      {
        name: 'Vieux-Lille',
        description:
          'Brick and gabled old-town lanes.',
      },
      {
        name: 'Citadel park',
        description:
          'Star fort and green belt by Vauban.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lille',
        url: 'https://www.britannica.com/place/Lille-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'catania',
    code: 'CTA',
    name: 'Catania',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Catania'],
    about:
      'Catania spreads on Sicily’s eastern shore at the foot of Mount Etna as a Baroque lava-stone city rebuilt after earthquakes and eruptions. Black basalt and pale limestone stripe churches and palazzi; the seafront faces the Ionian. Hot dry summers and an active volcano define the setting. Walk from Piazza del Duomo through Via Etnea toward the lava slopes. Catania’s primer is Etna-foot Baroque city — lava stone and Ionian light under Sicily’s great volcano.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Ionian coast · foot of Mount Etna',
      role: 'Eastern Sicilian metro beneath Etna',
      knownFor: 'Lava-stone Baroque, Etna backdrop, and Ionian waterfront',
    },
    features: [
      {
        name: 'Piazza del Duomo',
        description:
          'Baroque civic heart in lava stone.',
      },
      {
        name: 'Via Etnea',
        description:
          'Axis aimed at the volcano.',
      },
      {
        name: 'Ionian seafront',
        description:
          'Eastern shore of the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Catania',
        url: 'https://www.britannica.com/place/Catania-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'trieste',
    code: 'TRS',
    name: 'Trieste',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Trieste'],
    about:
      'Trieste occupies a narrow Adriatic shelf between the Karst plateau and the sea as a Habsburg port city of grand cafés, a canal-cut grid, and a castle hill above the gulf. Bora winds and clear winter light are local signatures. Orient from Piazza Unità on the waterfront through the Borgo Teresiano canal to San Giusto. Trieste’s primer is Adriatic Habsburg port — canal streets and gulf frontage under the Karst rim.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Adriatic gulf · Karst edge',
      role: 'Northeastern Italian port and border city',
      knownFor: 'Piazza Unità, canal grid, and Karst-backed gulf',
    },
    features: [
      {
        name: 'Piazza Unità',
        description:
          'Seafront civic square of the port.',
      },
      {
        name: 'Canal Grande',
        description:
          'Inland canal of the Habsburg grid.',
      },
      {
        name: 'San Giusto hill',
        description:
          'Castle and cathedral overlook.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Trieste',
        url: 'https://www.britannica.com/place/Trieste-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cali',
    code: 'CLO',
    name: 'Cali',
    kind: 'City',
    countrySlug: 'colombia',
    subtitle: 'City · Colombia',
    matchNames: ['Cali'],
    about:
      'Cali occupies the Cauca Valley floor of western Colombia as a tropical city of salsa culture, river parks, and Andean foothills rising east and west. Warm lowland heat and afternoon storms shape daily rhythm. Orient from the river corridor through downtown toward the Cristo Rey hillside. Cali’s primer is Cauca Valley salsa city — river parks and Andean foothill rim in western Colombia.',
    facts: {
      kind: 'City',
      country: 'Colombia',
      region: 'Americas',
      setting: 'Cauca Valley · western Colombia',
      role: 'Valle del Cauca metro and cultural hub',
      knownFor: 'Salsa culture, Cauca river parks, and Andean foothills',
    },
    features: [
      {
        name: 'Cauca corridor',
        description:
          'River parks through the valley floor.',
      },
      {
        name: 'Foothill rim',
        description:
          'Andean slopes framing the metro.',
      },
      {
        name: 'Downtown grid',
        description:
          'Core streets of the valley city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Cali',
        url: 'https://www.britannica.com/place/Cali-Colombia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'uppsala',
    code: 'UPP',
    name: 'Uppsala',
    kind: 'City',
    countrySlug: 'sweden',
    subtitle: 'City · Sweden',
    matchNames: ['Uppsala'],
    about:
      'Uppsala sits on the Fyris River north of Stockholm as a Swedish university city of cathedral spires, Linnaean gardens, and low brick streets under long winter light. The castle ridge overlooks the plain; student quarters fill the center. Walk from the Domkyrka through the river parks to the botanical garden. Uppsala’s primer is Fyris university city — cathedral ridge and scholarly gardens on Sweden’s historic plain.',
    facts: {
      kind: 'City',
      country: 'Sweden',
      region: 'Europe',
      setting: 'Fyris River · Uppland plain',
      role: 'University city and historic ecclesiastical center',
      knownFor: 'Cathedral, university campus, and Linnaean gardens',
    },
    features: [
      {
        name: 'Uppsala Cathedral',
        description:
          'Brick Gothic landmark of the ridge.',
      },
      {
        name: 'Fyris parks',
        description:
          'River green corridor through the center.',
      },
      {
        name: 'Botanical garden',
        description:
          'Linnaean and university plant collections.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Uppsala',
        url: 'https://www.britannica.com/place/Uppsala-Sweden',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'trondheim',
    code: 'TRD',
    name: 'Trondheim',
    kind: 'City',
    countrySlug: 'norway',
    subtitle: 'City · Norway',
    matchNames: ['Trondheim'],
    about:
      'Trondheim occupies the south shore of the Trondheimsfjord as a Norwegian city of colored warehouses, a great Nidaros cathedral, and a wooden old town on the Nid River. Cool maritime weather and long summer light define the north. Orient from the wharf row through the cathedral square to Bakklandet’s bridge lanes. Trondheim’s primer is fjord cathedral city — Nidaros stone and warehouse waterfront on Norway’s mid-coast.',
    facts: {
      kind: 'City',
      country: 'Norway',
      region: 'Europe',
      setting: 'Trondheimsfjord · Nid River',
      role: 'Central Norwegian city and historic coronation seat',
      knownFor: 'Nidaros Cathedral, wharf warehouses, and Bakklandet lanes',
    },
    features: [
      {
        name: 'Nidaros Cathedral',
        description:
          'Gothic pilgrimage church of the city.',
      },
      {
        name: 'Wharf warehouses',
        description:
          'Colored riverfront storehouses.',
      },
      {
        name: 'Bakklandet',
        description:
          'Wooden neighborhood across the Nid.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Trondheim',
        url: 'https://www.britannica.com/place/Trondheim',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'utrecht',
    code: 'UTR',
    name: 'Utrecht',
    kind: 'City',
    countrySlug: 'netherlands',
    subtitle: 'City · Netherlands',
    matchNames: ['Utrecht'],
    about:
      'Utrecht sits on the Oudegracht in the Dutch lowlands as a canal city of wharf cellars, a Dom Tower stump, and a dense brick core at the nation’s rail hub. Mild maritime weather keeps the canals under soft light. Walk the double-level canal quays from the Domplein through the museum quarter. Utrecht’s primer is Oudegracht canal city — wharf cellars and Dom Tower at the heart of the Netherlands.',
    facts: {
      kind: 'City',
      country: 'Netherlands',
      region: 'Europe',
      setting: 'Oudegracht · Dutch lowlands',
      role: 'Central Dutch city and national rail hub',
      knownFor: 'Oudegracht cellars, Dom Tower, and brick canal core',
    },
    features: [
      {
        name: 'Oudegracht',
        description:
          'Two-level canal with wharf cellars.',
      },
      {
        name: 'Dom Tower',
        description:
          'Cathedral tower stump of the skyline.',
      },
      {
        name: 'Brick core',
        description:
          'Dense historic streets around Domplein.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Utrecht',
        url: 'https://www.britannica.com/place/Utrecht-Netherlands',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'utah',
    code: 'UT',
    name: 'Utah',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Utah'],
    about:
      'Utah rises from Great Basin salt flats and Bonneville shores through Wasatch front cities to high plateaus and redrock canyon country on the Colorado Plateau. Arid light, mountain snowpack, and desert canyons structure travel. Read the state as basin, Wasatch wall, then plateau parks rather than one climate. Utah’s primer is Wasatch-to-redrock state — salt flats, mountain front, and canyon plateaus of the Intermountain West.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Great Basin · Wasatch · Colorado Plateau',
      role: 'Intermountain West state of basins and plateaus',
      knownFor: 'Salt flats, Wasatch front, and redrock canyon parks',
    },
    features: [
      {
        name: 'Wasatch Front',
        description:
          'Mountain wall and metro corridor.',
      },
      {
        name: 'Great Salt Lake basin',
        description:
          'Salt flats and inland sea remnant.',
      },
      {
        name: 'Redrock plateaus',
        description:
          'Canyon country of southern Utah.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Utah',
        url: 'https://www.britannica.com/place/Utah-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'vermont',
    code: 'VT',
    name: 'Vermont',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Vermont'],
    about:
      'Vermont folds the Green Mountains between Lake Champlain and the Connecticut River as a New England state of dairy valleys, maple ridges, and small mill towns. Snowy winters and leafy autumns mark the hills; lakes and rivers cut the valleys. Orient north–south along the mountain spine rather than by a single city. Vermont’s primer is Green Mountain state — Champlain shore, ridge farms, and river valleys of northern New England.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Green Mountains · Lake Champlain · Connecticut Valley',
      role: 'Northern New England mountain and farm state',
      knownFor: 'Green Mountains, Champlain shore, and maple valleys',
    },
    features: [
      {
        name: 'Green Mountains',
        description:
          'North–south ridge spine of the state.',
      },
      {
        name: 'Lake Champlain',
        description:
          'Western shore and lowland farms.',
      },
      {
        name: 'River valleys',
        description:
          'Mill towns along mountain streams.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Vermont',
        url: 'https://www.britannica.com/place/Vermont-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'delaware',
    code: 'DE',
    name: 'Delaware',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Delaware'],
    about:
      'Delaware occupies a short Atlantic coastal plain between the Delaware Bay and Maryland line as a Mid-Atlantic state of tidal marshes, beach barrier strips, and a compact Wilmington–Dover corridor. Mild coastal weather and bay tides shape the shore. Read bay, canal, and ocean beach as three water edges rather than one shoreline. Delaware’s primer is bay-and-beach state — tidal marshes and Atlantic barrier strip on a compact Mid-Atlantic plain.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Delaware Bay · Atlantic coastal plain',
      role: 'Compact Mid-Atlantic coastal state',
      knownFor: 'Bay marshes, Atlantic beaches, and canal corridor',
    },
    features: [
      {
        name: 'Delaware Bay',
        description:
          'Tidal estuary and marsh edge.',
      },
      {
        name: 'Atlantic beaches',
        description:
          'Barrier strip of the ocean shore.',
      },
      {
        name: 'Canal corridor',
        description:
          'Cross-peninsula water link.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Delaware',
        url: 'https://www.britannica.com/place/Delaware-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'praslin',
    code: 'PRA',
    name: 'Praslin',
    kind: 'Island',
    countrySlug: 'seychelles',
    subtitle: 'Island · Seychelles',
    matchNames: ['Praslin'],
    about:
      'Praslin is a granitic Seychelles island east of Mahé, known for Vallée de Mai coco-de-mer palms, pale beaches, and reef-fringed bays under equatorial heat. Hills of ancient granite rise from turquoise water; jungle valleys hold the endemic palms. Orient from the east-coast beaches inland to the palm reserve. Praslin’s primer is coco-de-mer island — granite hills and palm valleys in the Seychelles granitic group.',
    facts: {
      kind: 'Island',
      country: 'Seychelles',
      region: 'Africa',
      setting: 'Granitic Seychelles · east of Mahé',
      role: 'Second island of the Seychelles granitic group',
      knownFor: 'Vallée de Mai palms, granite hills, and reef beaches',
    },
    features: [
      {
        name: 'Vallée de Mai',
        description:
          'Coco-de-mer palm valley reserve.',
      },
      {
        name: 'Granite hills',
        description:
          'Ancient rock spines of the island.',
      },
      {
        name: 'Reef beaches',
        description:
          'Pale sand and lagoon edges.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Praslin',
        url: 'https://www.britannica.com/place/Praslin-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'isle-of-man',
    code: 'IOM',
    name: 'Isle of Man',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Man', 'Mann'],
    about:
      'The Isle of Man sits in the Irish Sea between Britain and Ireland as a Crown Dependency of hills, coastal cliffs, and a TT road circuit around a compact island. Mild maritime weather and strong tides wrap the shores. Orient from Douglas Bay over Snaefell’s summit to the western cliffs. The Isle of Man’s primer is Irish Sea hill island — cliff coasts and mountain roads between Britain and Ireland.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Irish Sea · between Britain and Ireland',
      role: 'Self-governing Crown Dependency in the Irish Sea',
      knownFor: 'Snaefell, cliff coasts, and island road circuit',
    },
    features: [
      {
        name: 'Snaefell',
        description:
          'Central summit with four-nation views.',
      },
      {
        name: 'Douglas Bay',
        description:
          'Principal harbor and seafront.',
      },
      {
        name: 'Cliff coasts',
        description:
          'Western and southern shore precipices.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Isle of Man',
        url: 'https://www.britannica.com/place/Isle-of-Man',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bornholm',
    code: 'BHN',
    name: 'Bornholm',
    kind: 'Island',
    countrySlug: 'denmark',
    subtitle: 'Island · Denmark',
    matchNames: ['Bornholm'],
    about:
      'Bornholm lies in the southern Baltic as a Danish granite island of round churches, fishing harbors, and rocky coasts distinct from Denmark’s glacial mainland. Cool Baltic weather and clear summer light define the shore. Orient from Rønne through the round-church villages to the Hammeren cliffs. Bornholm’s primer is Baltic granite island — round churches and rocky harbors east of the Danish main islands.',
    facts: {
      kind: 'Island',
      country: 'Denmark',
      region: 'Europe',
      setting: 'Southern Baltic · east of Zealand',
      role: 'Danish Baltic island of granite and fishing ports',
      knownFor: 'Round churches, granite coasts, and fishing harbors',
    },
    features: [
      {
        name: 'Round churches',
        description:
          'Medieval circular parish churches.',
      },
      {
        name: 'Granite coasts',
        description:
          'Rocky Baltic shoreline.',
      },
      {
        name: 'Fishing harbors',
        description:
          'Small ports of the island rim.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Bornholm',
        url: 'https://www.britannica.com/place/Bornholm',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saaremaa',
    code: 'SAA',
    name: 'Saaremaa',
    kind: 'Island',
    countrySlug: 'estonia',
    subtitle: 'Island · Estonia',
    matchNames: ['Saaremaa'],
    about:
      'Saaremaa is Estonia’s largest island in the west Estonian archipelago, a low limestone and forest land of windmills, coastal meadows, and the Kuressaare episcopal castle. Baltic ice and mild summers shape the year. Orient from Kuressaare through juniper pastures to the western cliffs and meteor crater. Saaremaa’s primer is west Estonian limestone island — castle town, windmills, and coastal meadows in the Baltic archipelago.',
    facts: {
      kind: 'Island',
      country: 'Estonia',
      region: 'Europe',
      setting: 'West Estonian archipelago · Baltic Sea',
      role: 'Largest Estonian island and archipelago hub',
      knownFor: 'Kuressaare castle, windmills, and limestone coasts',
    },
    features: [
      {
        name: 'Kuressaare castle',
        description:
          'Episcopal fortress of the main town.',
      },
      {
        name: 'Coastal meadows',
        description:
          'Juniper pastures and shore flats.',
      },
      {
        name: 'Limestone cliffs',
        description:
          'Western shore escarpments.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Saaremaa',
        url: 'https://www.britannica.com/place/Saaremaa',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'brac',
    code: 'BRC2',
    name: 'Brač',
    kind: 'Island',
    countrySlug: 'croatia',
    subtitle: 'Island · Croatia',
    matchNames: ['Brač', 'Brac'],
    about:
      'Brač is a large Dalmatian island in the Adriatic off Split, known for white limestone quarries, pine hills, and the Zlatni Rat spit at Bol. Hot dry summers and clear sea light define the coast. Orient from Supetar’s ferry port over the island ridge to Bol’s pebble spit. Brač’s primer is Dalmatian limestone island — quarry stone, pine ridges, and Zlatni Rat spit opposite Split.',
    facts: {
      kind: 'Island',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Adriatic · Dalmatian coast off Split',
      role: 'Large Dalmatian island of stone and beaches',
      knownFor: 'Zlatni Rat, limestone quarries, and pine hills',
    },
    features: [
      {
        name: 'Zlatni Rat',
        description:
          'Wind-shaped pebble spit at Bol.',
      },
      {
        name: 'Limestone quarries',
        description:
          'White stone sources of the island.',
      },
      {
        name: 'Pine ridges',
        description:
          'Interior hills above Adriatic bays.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Brač',
        url: 'https://www.britannica.com/place/Brac',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lombok',
    code: 'LMB',
    name: 'Lombok',
    kind: 'Island',
    countrySlug: 'indonesia',
    subtitle: 'Island · Indonesia',
    matchNames: ['Lombok'],
    about:
      'Lombok lies east of Bali across the Lombok Strait as an Indonesian island of Mount Rinjani’s volcanic cone, dry southern beaches, and Sasak village landscapes. The Wallace Line marks a biogeographic shift here. Orient from the western shore toward Rinjani’s caldera and the southern surf coast. Lombok’s primer is Rinjani strait island — volcanic cone and dry beaches east of Bali on the Wallace Line.',
    facts: {
      kind: 'Island',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'Lesser Sunda Islands · east of Bali',
      role: 'Volcanic island east of the Lombok Strait',
      knownFor: 'Mount Rinjani, southern beaches, and Sasak landscapes',
    },
    features: [
      {
        name: 'Mount Rinjani',
        description:
          'Active stratovolcano and caldera.',
      },
      {
        name: 'Southern beaches',
        description:
          'Dry-coast surf and sand arcs.',
      },
      {
        name: 'Sasak villages',
        description:
          'Cultural landscape of the interior.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lombok',
        url: 'https://www.britannica.com/place/Lombok',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lorraine',
    code: 'LOR',
    name: 'Lorraine',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Lorraine'],
    about:
      'Lorraine occupies northeastern France between Champagne and Alsace as a historic region of Moselle valleys, fortress towns, and industrial basins under a continental edge climate. Forests and plateaus frame river corridors; Nancy and Metz anchor the urban belt. Read the region as river valleys and border forts rather than a single city. Lorraine’s primer is Moselle border region — fortress towns and industrial valleys of northeastern France.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Moselle basin · northeastern France',
      role: 'Historic northeastern French region',
      knownFor: 'Moselle valleys, fortress towns, and border plateaus',
    },
    features: [
      {
        name: 'Moselle valley',
        description:
          'River corridor of the regional core.',
      },
      {
        name: 'Fortress towns',
        description:
          'Border strongholds and citadels.',
      },
      {
        name: 'Plateau forests',
        description:
          'Wooded uplands between river basins.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lorraine',
        url: 'https://www.britannica.com/place/Lorraine-region-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'auvergne',
    code: 'AUV',
    name: 'Auvergne',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Auvergne'],
    about:
      'Auvergne rises in the Massif Central of France as a volcanic region of Chaîne des Puys cones, plateau pastures, and spa towns around Clermont-Ferrand. Cooler upland weather contrasts with the Loire approaches. Orient from the Limagne plain up to the puys and the Cantal massif. Auvergne’s primer is Massif Central volcanic region — puy cones, plateau pastures, and spa towns of inland France.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Massif Central · Chaîne des Puys',
      role: 'Volcanic upland region of central France',
      knownFor: 'Puy volcanoes, plateau pastures, and spa towns',
    },
    features: [
      {
        name: 'Chaîne des Puys',
        description:
          'Aligned volcanic cones of the west.',
      },
      {
        name: 'Plateau pastures',
        description:
          'Upland grazing of the massif.',
      },
      {
        name: 'Spa towns',
        description:
          'Thermal settlements of the volcanic belt.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Auvergne',
        url: 'https://www.britannica.com/place/Auvergne',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saarland',
    code: 'SRL',
    name: 'Saarland',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Saarland'],
    about:
      'Saarland occupies Germany’s southwestern edge along the Saar River as a compact Land of forested hills, industrial river towns, and Franco-German border layers. Mild western weather and dense woodland frame the valleys. Orient from Saarbrücken along the Saar loop into the wooded Hunsrück approaches. Saarland’s primer is Saar border Land — river industry and forest hills on Germany’s French frontier.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Saar River · Franco-German border',
      role: 'Compact southwestern German federal state',
      knownFor: 'Saar loops, border forests, and industrial river towns',
    },
    features: [
      {
        name: 'Saar loops',
        description:
          'Meandering river corridor of the Land.',
      },
      {
        name: 'Border forests',
        description:
          'Wooded hills toward France.',
      },
      {
        name: 'River towns',
        description:
          'Industrial settlements along the Saar.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Saarland',
        url: 'https://www.britannica.com/place/Saarland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'schleswig-holstein',
    code: 'SHL',
    name: 'Schleswig-Holstein',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Schleswig-Holstein', 'Schleswig Holstein'],
    about:
      'Schleswig-Holstein forms Germany’s northern isthmus between the North Sea and Baltic as a Land of Wadden mudflats, lake districts, and brick harbor towns under maritime winds. Dykes and marsh farms face the west; fjord-like Förden cut the east. Read two seas and a lake belt rather than an inland core. Schleswig-Holstein’s primer is two-sea isthmus Land — Wadden flats, Baltic Förden, and lake country of northern Germany.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'North Sea · Baltic · northern German isthmus',
      role: 'Northernmost German federal state between two seas',
      knownFor: 'Wadden coast, Baltic Förden, and lake districts',
    },
    features: [
      {
        name: 'Wadden coast',
        description:
          'Tidal mudflats of the North Sea.',
      },
      {
        name: 'Baltic Förden',
        description:
          'Inlet harbors of the eastern shore.',
      },
      {
        name: 'Lake district',
        description:
          'Holsteinische Schweiz inland waters.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Schleswig-Holstein',
        url: 'https://www.britannica.com/place/Schleswig-Holstein',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'valais',
    code: 'VAL',
    name: 'Valais',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Valais', 'Wallis'],
    about:
      'Valais follows the upper Rhône through the Swiss Alps as a bilingual canton of high peaks, glacier tongues, and dry valley vineyards under a rain-shadow climate. The Matterhorn and Mischabel massifs wall the south; terraced vines climb the valley sides. Orient up-valley from Lake Geneva approaches toward Zermatt and the high passes. Valais’s primer is upper Rhône alpine canton — glacier peaks and rain-shadow vineyards of southern Switzerland.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Upper Rhône · Pennine Alps',
      role: 'Alpine Swiss canton of peaks and valley vineyards',
      knownFor: 'Matterhorn approaches, glaciers, and Rhône valley vines',
    },
    features: [
      {
        name: 'Rhône valley',
        description:
          'Dry alpine trough of vines and towns.',
      },
      {
        name: 'High peaks',
        description:
          'Pennine Alps including Matterhorn approaches.',
      },
      {
        name: 'Glacier tongues',
        description:
          'Ice rivers feeding the upper valley.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Valais',
        url: 'https://www.britannica.com/place/Valais-canton-Switzerland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'herculaneum',
    code: 'HER',
    name: 'Herculaneum',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Herculaneum', 'Ercolano'],
    about:
      'Herculaneum is a Roman seaside town buried by Vesuvius in 79 CE, preserved under volcanic material on the Bay of Naples with multi-story houses, wooden details, and a shoreline that once met the sea. Dense excavation blocks reveal streets and atria at close quarters. Walk the cardo so houses, baths, and the ancient shore align. Herculaneum’s primer is Vesuvius-buried Roman town — intact houses and shoreline under the Bay of Naples ash.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · foot of Vesuvius',
      role: 'Roman town preserved by the 79 CE eruption',
      knownFor: 'Multi-story Roman houses, wooden remains, and buried shoreline',
    },
    features: [
      {
        name: 'Roman houses',
        description:
          'Multi-story dwellings with atria.',
      },
      {
        name: 'Bath complexes',
        description:
          'Public bathing rooms of the town.',
      },
      {
        name: 'Ancient shoreline',
        description:
          'Waterfront sealed under volcanic fill.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Herculaneum',
        url: 'https://www.britannica.com/place/Herculaneum',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'karnak',
    code: 'KAR',
    name: 'Karnak',
    kind: 'Landmark',
    countrySlug: 'egypt',
    subtitle: 'Landmark · Egypt',
    matchNames: ['Karnak', 'Karnak Temple', 'Temple of Karnak'],
    about:
      'Karnak is the vast temple complex at Thebes on the Nile’s east bank, a New Kingdom precinct of hypostyle halls, obelisks, and processional axes centered on Amun-Ra. Desert light and river floodplain frame the stone. Walk the main axis so pylons, columns, and sacred lake sequence. Karnak’s primer is Theban temple megacomplex — hypostyle forest and processional courts on the Nile east bank.',
    facts: {
      kind: 'Landmark',
      country: 'Egypt',
      region: 'Africa',
      setting: 'East bank of Thebes · Luxor',
      role: 'Principal temple complex of ancient Thebes',
      knownFor: 'Great Hypostyle Hall, pylons, and sacred lake',
    },
    features: [
      {
        name: 'Great Hypostyle Hall',
        description:
          'Forest of papyrus columns.',
      },
      {
        name: 'Pylon sequence',
        description:
          'Monumental gateways along the axis.',
      },
      {
        name: 'Sacred lake',
        description:
          'Ritual water basin of the precinct.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Karnak',
        url: 'https://www.britannica.com/topic/Karnak',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'abu-simbel',
    code: 'ABU',
    name: 'Abu Simbel',
    kind: 'Landmark',
    countrySlug: 'egypt',
    subtitle: 'Landmark · Egypt',
    matchNames: ['Abu Simbel'],
    about:
      'Abu Simbel is the rock-cut temple pair of Ramesses II on Lake Nasser’s shore in Nubia, relocated above the rising reservoir with colossal seated facades facing the water. Desert cliffs and reservoir light define the approach. Stand on the esplanade so the four colossi, doorway, and lake align. Abu Simbel’s primer is Nubian rock temple — colossal Ramesses facade relocated above Lake Nasser.',
    facts: {
      kind: 'Landmark',
      country: 'Egypt',
      region: 'Africa',
      setting: 'Lake Nasser · Nubia',
      role: 'Rock-cut New Kingdom temple complex in Nubia',
      knownFor: 'Colossal Ramesses statues and relocated lakeside temples',
    },
    features: [
      {
        name: 'Great Temple facade',
        description:
          'Four seated colossi of Ramesses II.',
      },
      {
        name: 'Interior halls',
        description:
          'Rock-cut chambers aligned to solar events.',
      },
      {
        name: 'Lake Nasser shore',
        description:
          'Reservoir setting of the relocated site.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Abu Simbel',
        url: 'https://www.britannica.com/place/Abu-Simbel',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'valley-of-the-kings',
    code: 'VOK',
    name: 'Valley of the Kings',
    kind: 'Landmark',
    countrySlug: 'egypt',
    subtitle: 'Landmark · Egypt',
    matchNames: ['Valley of the Kings', 'Kings Valley'],
    about:
      'The Valley of the Kings is the New Kingdom royal necropolis in the Theban hills on the Nile’s west bank, a desert wadi of rock-cut tombs behind the peak of el-Qurn. Hot bare rock and narrow side valleys organize the cemetery. Orient from the wadi mouth so tomb corridors and the pyramid-shaped peak align. The Valley of the Kings’ primer is Theban royal necropolis — rock-cut tombs in a desert wadi behind Luxor’s west bank.',
    facts: {
      kind: 'Landmark',
      country: 'Egypt',
      region: 'Africa',
      setting: 'Theban hills · west bank of Luxor',
      role: 'New Kingdom royal burial valley',
      knownFor: 'Rock-cut royal tombs and desert wadi setting',
    },
    features: [
      {
        name: 'Royal tombs',
        description:
          'Rock-cut burial corridors of pharaohs.',
      },
      {
        name: 'Desert wadi',
        description:
          'Enclosed valley floor of the necropolis.',
      },
      {
        name: 'El-Qurn peak',
        description:
          'Pyramid-shaped mountain above the tombs.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Valley of the Kings',
        url: 'https://www.britannica.com/place/Valley-of-the-Kings',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'delphi',
    code: 'DLP',
    name: 'Delphi',
    kind: 'Landmark',
    countrySlug: 'greece',
    subtitle: 'Landmark · Greece',
    matchNames: ['Delphi'],
    about:
      'Delphi occupies a terrace on Mount Parnassus above the Pleistos gorge as the panhellenic sanctuary of Apollo, with a theater, temple terrace, and stadium stepped into the cliff face. Olive slopes and limestone cliffs frame the site. Climb the Sacred Way so treasuries, temple, and theater stack against the mountain. Delphi’s primer is Parnassus oracle sanctuary — Apollo’s terrace above the olive gorge of central Greece.',
    facts: {
      kind: 'Landmark',
      country: 'Greece',
      region: 'Europe',
      setting: 'Mount Parnassus · Phocis',
      role: 'Panhellenic sanctuary of Apollo',
      knownFor: 'Temple terrace, theater, and Parnassus cliff setting',
    },
    features: [
      {
        name: 'Temple of Apollo',
        description:
          'Main terrace of the sanctuary.',
      },
      {
        name: 'Theater',
        description:
          'Stone seating against the cliff.',
      },
      {
        name: 'Sacred Way',
        description:
          'Processional path of treasuries.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Delphi',
        url: 'https://www.britannica.com/place/Delphi-ancient-city-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'knossos',
    code: 'KNO',
    name: 'Knossos',
    kind: 'Landmark',
    countrySlug: 'greece',
    subtitle: 'Landmark · Greece',
    matchNames: ['Knossos', 'Palace of Knossos'],
    about:
      'Knossos is the great Minoan palace complex near Heraklion on Crete, a multi-level labyrinth of courts, storage magazines, and reconstructed colonnades on a low hill inland from the north coast. Hot dry light and olive hills surround the ruin. Walk the central court so magazines, throne rooms, and stairwells read as one palace organism. Knossos’s primer is Minoan palace complex — multi-level courts and magazines on Crete’s north-central hill.',
    facts: {
      kind: 'Landmark',
      country: 'Greece',
      region: 'Europe',
      setting: 'North-central Crete · near Heraklion',
      role: 'Principal Minoan palace of Bronze Age Crete',
      knownFor: 'Central court, magazines, and reconstructed colonnades',
    },
    features: [
      {
        name: 'Central court',
        description:
          'Open core of the palace plan.',
      },
      {
        name: 'Storage magazines',
        description:
          'Long magazine rooms of the complex.',
      },
      {
        name: 'Colonnaded halls',
        description:
          'Reconstructed pillars and stairwells.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Knossos',
        url: 'https://www.britannica.com/place/Knossos',
        kind: 'reference',
      },
    ],
  },
]

