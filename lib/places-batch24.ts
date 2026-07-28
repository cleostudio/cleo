/** Twenty-fourth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch24: PlaceGuideDraftBatch[] = [
  {
    slug: 'plymouth',
    code: 'PLY',
    name: 'Plymouth',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Plymouth'],
    about:
      'Plymouth sits on Plymouth Sound in Devon as a southern English naval city of Hoe headland, harbor walls, and a postwar center rebuilt after wartime bombing. Mild maritime weather and Atlantic swells shape the waterfront. Orient from the Hoe across the Sound to the naval dockyards and Barbican quays. Plymouth’s primer is Sound naval city — Hoe headland and harbor walls on England’s southwest coast.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Plymouth Sound · Devon',
      role: 'Naval and harbor city of southwest England',
      knownFor: 'Hoe headland, naval docks, and Sound waterfront',
    },
    features: [
      {
        name: 'The Hoe',
        description:
          'Headland park above the Sound.',
      },
      {
        name: 'Barbican',
        description:
          'Historic harbor quay quarter.',
      },
      {
        name: 'Naval docks',
        description:
          'Dockyard edge of the estuary.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Plymouth',
        url: 'https://www.britannica.com/place/Plymouth-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'york',
    code: 'YRK',
    name: 'York',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['York'],
    about:
      'York occupies the Ouse and Foss confluence in North Yorkshire as a walled English city of a great Gothic minster, medieval gates, and a snickelway old town. Cool northern weather and river floods mark the basin. Walk the walls from Bootham Bar to the Minster towers and Shambles lanes. York’s primer is Ouse walled city — Minster towers and medieval gates in North Yorkshire.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Ouse · North Yorkshire',
      role: 'Historic cathedral city of northern England',
      knownFor: 'York Minster, city walls, and medieval lanes',
    },
    features: [
      {
        name: 'York Minster',
        description:
          'Gothic cathedral of the skyline.',
      },
      {
        name: 'City walls',
        description:
          'Walkable medieval defensive circuit.',
      },
      {
        name: 'Shambles',
        description:
          'Narrow timber-framed shopping street.',
      }
    ],
    sources: [
      {
        label: 'Britannica — York',
        url: 'https://www.britannica.com/place/York-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'dijon',
    code: 'DIJ',
    name: 'Dijon',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Dijon'],
    about:
      'Dijon sits on the Burgundy plain as a French city of polychrome tile roofs, ducal palace courts, and a dense stone old town at the gateway to wine slopes. Mild continental weather prevails. Orient from Place de la Libération through the palace museums to the cathedral quarter. Dijon’s primer is Burgundy ducal city — tile roofs and palace courts at the edge of the Côte d’Or.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Burgundy plain · Côte d’Or approaches',
      role: 'Historic capital of the Dukes of Burgundy',
      knownFor: 'Ducal palace, polychrome roofs, and old-town streets',
    },
    features: [
      {
        name: 'Ducal palace',
        description:
          'Court and museum core of the center.',
      },
      {
        name: 'Polychrome roofs',
        description:
          'Glazed tile landmarks of Burgundy.',
      },
      {
        name: 'Old-town lanes',
        description:
          'Stone streets of the historic core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Dijon',
        url: 'https://www.britannica.com/place/Dijon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'reims',
    code: 'RHE',
    name: 'Reims',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Reims', 'Rheims'],
    about:
      'Reims occupies the Champagne plain as a French city of a great Gothic coronation cathedral, champagne house cellars, and a rebuilt center after World War I damage. Cool northern weather and chalk soils define the setting. Walk from the cathedral facade through the Place Royale to the boulevard cellars. Reims’s primer is Champagne coronation city — Gothic cathedral and cellar streets on France’s northern plain.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Champagne plain · Marne',
      role: 'Champagne metro and historic coronation city',
      knownFor: 'Notre-Dame de Reims, champagne cellars, and Place Royale',
    },
    features: [
      {
        name: 'Cathedral facade',
        description:
          'Gothic coronation church of French kings.',
      },
      {
        name: 'Champagne cellars',
        description:
          'House caves beneath the boulevards.',
      },
      {
        name: 'Place Royale',
        description:
          'Classical square of the rebuilt center.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Reims',
        url: 'https://www.britannica.com/place/Reims',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'parma',
    code: 'PMF',
    name: 'Parma',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Parma'],
    about:
      'Parma sits on the Via Emilia in Emilia-Romagna as an Italian city of a pink marble baptistery, ducal gardens, and a food culture rooted in cheese and cured ham. Warm Emilian summers and winter fog settle over the low plain. Orient from Piazza Duomo through the Pilotta palace to the Parco Ducale. Parma’s primer is Emilian baptistery city — pink marble Duomo square and ducal gardens on the Via Emilia.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Via Emilia · Emilia-Romagna',
      role: 'Emilian city of art and food traditions',
      knownFor: 'Baptistery, Piazza Duomo, and ducal park',
    },
    features: [
      {
        name: 'Baptistery',
        description:
          'Pink marble octagon of the Duomo square.',
      },
      {
        name: 'Pilotta',
        description:
          'Ducal palace complex of courts and museums.',
      },
      {
        name: 'Parco Ducale',
        description:
          'Historic green of the city edge.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Parma',
        url: 'https://www.britannica.com/place/Parma-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'brescia',
    code: 'BRS',
    name: 'Brescia',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Brescia'],
    about:
      'Brescia occupies the Alpine foothills of Lombardy as an Italian city of a Roman forum layer, Lombard monastery stone, and a Renaissance square under a castle ridge. Hot summers and lake-cooled breezes from nearby Garda shape the climate. Walk from Piazza della Loggia through the Capitolium ruins to the castle. Brescia’s primer is Lombard foothill city — Roman forum and castle ridge east of Milan.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Alpine foothills · Lombardy',
      role: 'Lombard city between Milan and Lake Garda',
      knownFor: 'Roman Capitolium, Piazza della Loggia, and castle ridge',
    },
    features: [
      {
        name: 'Capitolium',
        description:
          'Roman temple ruins of the forum.',
      },
      {
        name: 'Piazza della Loggia',
        description:
          'Renaissance civic square.',
      },
      {
        name: 'Castle ridge',
        description:
          'Hill fortress above the center.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Brescia',
        url: 'https://www.britannica.com/place/Brescia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'stavanger',
    code: 'SVG',
    name: 'Stavanger',
    kind: 'City',
    countrySlug: 'norway',
    subtitle: 'City · Norway',
    matchNames: ['Stavanger'],
    about:
      'Stavanger sits on a peninsula in Rogaland as a Norwegian North Sea city of white wooden warehouses, an oil-era waterfront, and fjord approaches toward Lysefjord. Mild maritime weather for Norway prevails. Orient from the old town wharf through the harbor to the petroleum museum shore. Stavanger’s primer is North Sea wooden city — white wharf houses and fjord approaches of southwest Norway.',
    facts: {
      kind: 'City',
      country: 'Norway',
      region: 'Europe',
      setting: 'Rogaland · North Sea coast',
      role: 'Southwest Norwegian port and energy hub',
      knownFor: 'White wooden old town, harbor, and Lysefjord approaches',
    },
    features: [
      {
        name: 'Gamle Stavanger',
        description:
          'White wooden warehouse streets.',
      },
      {
        name: 'Harbor front',
        description:
          'North Sea port edge of the city.',
      },
      {
        name: 'Fjord approaches',
        description:
          'Routes toward Lysefjord cliffs.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Stavanger',
        url: 'https://www.britannica.com/place/Stavanger',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'eindhoven',
    code: 'EIN',
    name: 'Eindhoven',
    kind: 'City',
    countrySlug: 'netherlands',
    subtitle: 'City · Netherlands',
    matchNames: ['Eindhoven'],
    about:
      'Eindhoven occupies North Brabant as a Dutch design and technology city remade from Philips industrial roots into campus districts, a regenerating station axis, and a compact center. Mild maritime weather prevails. Orient from the station square through Strijp-S to the Dommel park corridor. Eindhoven’s primer is Brabant design city — industrial reuse and tech campuses in the southern Netherlands.',
    facts: {
      kind: 'City',
      country: 'Netherlands',
      region: 'Europe',
      setting: 'North Brabant · Dommel basin',
      role: 'Dutch technology and design metro',
      knownFor: 'Strijp-S reuse, design campuses, and Dommel parks',
    },
    features: [
      {
        name: 'Strijp-S',
        description:
          'Former Philips industrial campus remade.',
      },
      {
        name: 'Station axis',
        description:
          'Rail-centered civic corridor.',
      },
      {
        name: 'Dommel parks',
        description:
          'River green through the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Eindhoven',
        url: 'https://www.britannica.com/place/Eindhoven',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ostrava',
    code: 'OSR',
    name: 'Ostrava',
    kind: 'City',
    countrySlug: 'czechia',
    subtitle: 'City · Czechia',
    matchNames: ['Ostrava'],
    about:
      'Ostrava sits at the Oder and Ostravice confluence in Moravian Silesia as a Czech industrial city of brick blast-furnace relics, a regenerating lower Vitkovice quarter, and surrounding coal-basin towns. Continental seasons mark the basin. Walk from Masaryk Square into the Vitkovice ironworks park. Ostrava’s primer is Silesian industrial city — blast-furnace relics and river confluence in eastern Czechia.',
    facts: {
      kind: 'City',
      country: 'Czechia',
      region: 'Europe',
      setting: 'Oder–Ostravice · Moravian Silesia',
      role: 'Industrial metro of eastern Czechia',
      knownFor: 'Vitkovice ironworks, brick industry fabric, and river confluence',
    },
    features: [
      {
        name: 'Vitkovice',
        description:
          'Preserved blast-furnace industrial park.',
      },
      {
        name: 'Masaryk Square',
        description:
          'Civic heart of the center.',
      },
      {
        name: 'River confluence',
        description:
          'Oder and Ostravice meeting point.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Ostrava',
        url: 'https://www.britannica.com/place/Ostrava',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'patras',
    code: 'GPA',
    name: 'Patras',
    kind: 'City',
    countrySlug: 'greece',
    subtitle: 'City · Greece',
    matchNames: ['Patras', 'Patra'],
    about:
      'Patras climbs from the Gulf of Patras in the northwest Peloponnese as a Greek port city of a hillside old town, a long ferry waterfront, and a Roman odeon under hot dry summers. Orient from the harbor up through Georgiou Square to the fortress ridge. Patras’s primer is Peloponnese gulf port — hillside streets and ferry waterfront of northwestern Greece.',
    facts: {
      kind: 'City',
      country: 'Greece',
      region: 'Europe',
      setting: 'Gulf of Patras · northwest Peloponnese',
      role: 'Major western Greek port city',
      knownFor: 'Harbor front, hillside old town, and Roman odeon',
    },
    features: [
      {
        name: 'Harbor front',
        description:
          'Ferry and port edge of the gulf.',
      },
      {
        name: 'Hillside old town',
        description:
          'Steep streets below the fortress.',
      },
      {
        name: 'Roman odeon',
        description:
          'Ancient theater remains of the lower city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Pátrai',
        url: 'https://www.britannica.com/place/Patrai',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'antalya',
    code: 'AYT',
    name: 'Antalya',
    kind: 'City',
    countrySlug: 'turkiye',
    subtitle: 'City · Türkiye',
    matchNames: ['Antalya'],
    about:
      'Antalya curves around a cliff-backed gulf on Türkiye’s Mediterranean coast as a city of a walled Kaleiçi old harbor, waterfall parks, and Taurus mountain backdrops. Hot dry summers and mild winters define the shore. Walk from the old harbor up through Kaleiçi lanes to the cliff viewpoints. Antalya’s primer is Mediterranean cliff harbor — Kaleiçi walls and Taurus backdrop on Türkiye’s southern coast.',
    facts: {
      kind: 'City',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Gulf of Antalya · Mediterranean coast',
      role: 'Major Mediterranean Turkish metro and resort gateway',
      knownFor: 'Kaleiçi old harbor, cliff views, and Taurus backdrop',
    },
    features: [
      {
        name: 'Kaleiçi',
        description:
          'Walled old town around the historic harbor.',
      },
      {
        name: 'Cliff harbor',
        description:
          'Mediterranean cove beneath the city.',
      },
      {
        name: 'Taurus backdrop',
        description:
          'Mountain wall inland from the gulf.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Antalya',
        url: 'https://www.britannica.com/place/Antalya',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'coimbra',
    code: 'CBI',
    name: 'Coimbra',
    kind: 'City',
    countrySlug: 'portugal',
    subtitle: 'City · Portugal',
    matchNames: ['Coimbra'],
    about:
      'Coimbra climbs above the Mondego in central Portugal as a university city of a hilltop Joanina library, riverside parks, and a dense Baixa below the academic ridge. Hot summers and Atlantic-influenced winters prevail. Orient from the university terrace down through the old cathedral lanes to the river. Coimbra’s primer is Mondego university city — hilltop colleges and riverside Baixa of central Portugal.',
    facts: {
      kind: 'City',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Mondego River · central Portugal',
      role: 'Historic university city of Portugal',
      knownFor: 'University hill, Joanina Library, and Mondego waterfront',
    },
    features: [
      {
        name: 'University hill',
        description:
          'Academic ridge above the river.',
      },
      {
        name: 'Joanina Library',
        description:
          'Baroque library of the old university.',
      },
      {
        name: 'Mondego quays',
        description:
          'River parks and Baixa edge.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Coimbra',
        url: 'https://www.britannica.com/place/Coimbra-Portugal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'wyoming',
    code: 'WY',
    name: 'Wyoming',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Wyoming'],
    about:
      'Wyoming spans high plains and the Rocky Mountains as a sparsely settled western state of Yellowstone and Grand Teton parks, basin ranchland, and continental divide ridges. Harsh winters and dry summers dominate. Read plains, basins, and park ranges as separate belts rather than one climate. Wyoming’s primer is high-plains Rocky Mountain state — Yellowstone country and basin ranchland under wide western sky.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'High plains · Rocky Mountains',
      role: 'Sparsely populated Rocky Mountain state',
      knownFor: 'Yellowstone, Grand Teton, and high basin plains',
    },
    features: [
      {
        name: 'Yellowstone country',
        description:
          'Geothermal and forest park of the northwest.',
      },
      {
        name: 'Grand Teton',
        description:
          'Jagged range above Jackson Hole.',
      },
      {
        name: 'High plains basins',
        description:
          'Ranch and sage country east of the divide.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Wyoming',
        url: 'https://www.britannica.com/place/Wyoming-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'new-hampshire',
    code: 'NH',
    name: 'New Hampshire',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['New Hampshire'],
    about:
      'New Hampshire folds the White Mountains between the Connecticut River and a short Atlantic shore as a New England state of granite peaks, lake country, and mill-town valleys. Snowy winters and leafy autumns mark the hills. Orient north along the mountain spine and south toward the brief Seacoast. New Hampshire’s primer is granite White Mountain state — peaks, lakes, and mill valleys of northern New England.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'White Mountains · Connecticut Valley · Seacoast',
      role: 'Northern New England mountain and mill state',
      knownFor: 'White Mountains, lakes, and short Atlantic seacoast',
    },
    features: [
      {
        name: 'White Mountains',
        description:
          'Granite peaks and notches of the north.',
      },
      {
        name: 'Lakes Region',
        description:
          'Central lake country of the state.',
      },
      {
        name: 'Seacoast',
        description:
          'Short Atlantic shore and harbor towns.',
      }
    ],
    sources: [
      {
        label: 'Britannica — New Hampshire',
        url: 'https://www.britannica.com/place/New-Hampshire-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rhode-island',
    code: 'RI',
    name: 'Rhode Island',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Rhode Island'],
    about:
      'Rhode Island occupies Narragansett Bay and a compact Atlantic shore as the smallest U.S. state, a dense coastal commonwealth of Providence, Newport mansions, and island and peninsula towns. Mild maritime weather and bay tides shape daily life. Read bay, islands, and ocean shore as the map’s grammar. Rhode Island’s primer is Narragansett Bay state — compact coasts, islands, and Providence at New England’s smallest outline.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Narragansett Bay · Atlantic shore',
      role: 'Smallest U.S. state; dense coastal commonwealth',
      knownFor: 'Narragansett Bay, Newport shore, and Providence',
    },
    features: [
      {
        name: 'Narragansett Bay',
        description:
          'Central estuary organizing the state.',
      },
      {
        name: 'Newport shore',
        description:
          'Mansion and harbor coast of Aquidneck.',
      },
      {
        name: 'Providence',
        description:
          'Capital metro at the bay’s head.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Rhode Island',
        url: 'https://www.britannica.com/place/Rhode-Island-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'iona',
    code: 'ION',
    name: 'Iona',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Iona'],
    about:
      'Iona is a small Hebridean island west of Mull, known for its early Christian abbey, white sand bays, and pilgrimage paths under Atlantic weather. Low green machair and rocky shores ring the abbey precinct. Orient from the ferry jetty to the abbey and western beaches. Iona’s primer is Hebridean abbey island — pilgrimage stone and white bays west of Mull.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · west of Mull',
      role: 'Early Christian pilgrimage island of Scotland',
      knownFor: 'Iona Abbey, white sand bays, and pilgrimage paths',
    },
    features: [
      {
        name: 'Iona Abbey',
        description:
          'Restored monastic church of the island.',
      },
      {
        name: 'White bays',
        description:
          'Pale sand shores of the west.',
      },
      {
        name: 'Pilgrimage paths',
        description:
          'Tracks between jetty, abbey, and beaches.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Iona',
        url: 'https://www.britannica.com/place/Iona-island-Scotland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mljet',
    code: 'MLJ',
    name: 'Mljet',
    kind: 'Island',
    countrySlug: 'croatia',
    subtitle: 'Island · Croatia',
    matchNames: ['Mljet'],
    about:
      'Mljet is a long, forested Dalmatian island in the southern Adriatic, known for saltwater lakes in a national park, dense pine cover, and quiet coves under hot dry summers. Ferry links run from Dubrovnik approaches. Orient from Pomena or Sobra into the lake park and Odysseus cave coast. Mljet’s primer is Dalmatian forest island — salt lakes and pine cover in Croatia’s southern Adriatic.',
    facts: {
      kind: 'Island',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Southern Adriatic · Dalmatian islands',
      role: 'Forested Dalmatian island with a national park of lakes',
      knownFor: 'Saltwater lakes, pine forests, and quiet Adriatic coves',
    },
    features: [
      {
        name: 'Salt lakes',
        description:
          'Seawater lakes of the western park.',
      },
      {
        name: 'Pine forests',
        description:
          'Dense woodland covering much of the island.',
      },
      {
        name: 'Quiet coves',
        description:
          'Sheltered Adriatic swimming bays.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mljet',
        url: 'https://www.britannica.com/place/Mljet-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lipari',
    code: 'LIP',
    name: 'Lipari',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Lipari'],
    about:
      'Lipari is the largest of the Aeolian Islands off Sicily, a volcanic island of pumice slopes, a castle-topped acropolis town, and ferry links among active neighbors under Mediterranean heat. Obsidian and pumice shaped its ancient trade. Orient from the Marina Corta up to the castle museums and coastal pumice cliffs. Lipari’s primer is Aeolian volcanic island — castle acropolis and pumice shores north of Sicily.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Aeolian Islands · Tyrrhenian Sea',
      role: 'Largest and administrative hub of the Aeolian Islands',
      knownFor: 'Castle acropolis, pumice slopes, and Aeolian ferry hub',
    },
    features: [
      {
        name: 'Castle acropolis',
        description:
          'Fortified hill town above the harbors.',
      },
      {
        name: 'Pumice slopes',
        description:
          'Pale volcanic rock of the island.',
      },
      {
        name: 'Marina harbors',
        description:
          'Ferry and fishing coves of Lipari town.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lipari Island',
        url: 'https://www.britannica.com/place/Lipari-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'waiheke',
    code: 'WAI',
    name: 'Waiheke Island',
    kind: 'Island',
    countrySlug: 'new-zealand',
    subtitle: 'Island · New Zealand',
    matchNames: ['Waiheke', 'Waiheke Island'],
    about:
      'Waiheke lies in Auckland’s Hauraki Gulf as a New Zealand island of vineyards, white-sand bays, and ferry-linked hill villages under mild maritime weather. Bush reserves and olive groves share the ridges. Orient from Matiatia ferry through Oneroa to the eastern beaches. Waiheke’s primer is Hauraki Gulf vineyard island — sand bays and wine hills a short ferry from Auckland.',
    facts: {
      kind: 'Island',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'Hauraki Gulf · Auckland',
      role: 'Gulf island of vineyards and beaches near Auckland',
      knownFor: 'Vineyards, white-sand bays, and ferry access from Auckland',
    },
    features: [
      {
        name: 'Vineyard hills',
        description:
          'Wine slopes of the island interior.',
      },
      {
        name: 'White-sand bays',
        description:
          'North-coast swimming beaches.',
      },
      {
        name: 'Ferry villages',
        description:
          'Harbor settlements linked to Auckland.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Waiheke Island',
        url: 'https://www.britannica.com/place/Waiheke-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'fraser-island',
    code: 'FRS',
    name: 'Fraser Island',
    kind: 'Island',
    countrySlug: 'australia',
    subtitle: 'Island · Australia',
    matchNames: ['Fraser Island', 'K\'gari', 'Kgari'],
    about:
      'Fraser Island (K’gari) is a giant sand island off Queensland, a UNESCO landscape of rainforest growing on dunes, colored sand cliffs, and perched freshwater lakes under subtropical weather. 4WD tracks replace paved roads on much of the island. Orient along Seventy-Five Mile Beach toward lake and forest hinterlands. Fraser Island’s primer is Queensland sand island — dune rainforest and perched lakes of K’gari.',
    facts: {
      kind: 'Island',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Queensland coast · Great Sandy Strait',
      role: 'World’s largest sand island; UNESCO natural site',
      knownFor: 'Sand dunes, perched lakes, and beach highway',
    },
    features: [
      {
        name: 'Seventy-Five Mile Beach',
        description:
          'Ocean beach used as a coastal track.',
      },
      {
        name: 'Perched lakes',
        description:
          'Freshwater lakes in dune hollows.',
      },
      {
        name: 'Dune rainforest',
        description:
          'Forest growing on deep sand.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Fraser Island',
        url: 'https://www.britannica.com/place/Fraser-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'penang',
    code: 'PEN',
    name: 'Penang',
    kind: 'Island',
    countrySlug: 'malaysia',
    subtitle: 'Island · Malaysia',
    matchNames: ['Penang', 'Pulau Pinang'],
    about:
      'Penang is a Malaysian island in the Strait of Malacca, known for George Town’s shophouse streets, a hill funicular, and a busy channel shore under equatorial heat. Bridges and ferries link it to the mainland. Orient from the colonial waterfront through clan jetties to Penang Hill. Penang’s primer is Malacca Strait island — George Town shophouses and hill views of northwest Malaysia.',
    facts: {
      kind: 'Island',
      country: 'Malaysia',
      region: 'Asia',
      setting: 'Strait of Malacca · northwest Malaysia',
      role: 'Historic trading island and Malaysian state hub',
      knownFor: 'George Town shophouses, Penang Hill, and channel waterfront',
    },
    features: [
      {
        name: 'George Town',
        description:
          'UNESCO shophouse and clan-jetty core.',
      },
      {
        name: 'Penang Hill',
        description:
          'Funicular ridge above the island.',
      },
      {
        name: 'Channel shore',
        description:
          'Busy strait waterfront toward the mainland.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Pinang',
        url: 'https://www.britannica.com/place/Pinang-island-Malaysia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'thurgau',
    code: 'TG',
    name: 'Thurgau',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Thurgau'],
    about:
      'Thurgau occupies northeastern Switzerland along Lake Constance as a lowland canton of orchards, gentle hills, and Rhine approaches under a mild lake climate. Apple country and small towns organize the plain. Orient from the lake shore inland through orchard ridges toward the Thur valley. Thurgau’s primer is Lake Constance orchard canton — fruit hills and shore towns of northeastern Switzerland.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Lake Constance · Thur valley',
      role: 'Northeastern Swiss lowland canton',
      knownFor: 'Orchards, Lake Constance shore, and gentle hills',
    },
    features: [
      {
        name: 'Lake Constance shore',
        description:
          'Northern water edge of the canton.',
      },
      {
        name: 'Orchard hills',
        description:
          'Apple and fruit slopes of the interior.',
      },
      {
        name: 'Thur valley',
        description:
          'River corridor through the lowland.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Thurgau',
        url: 'https://www.britannica.com/place/Thurgau',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'vaud',
    code: 'VUD',
    name: 'Vaud',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Vaud'],
    about:
      'Vaud stretches along Lake Geneva’s north shore into the Jura and Alpine foothills as a French-speaking Swiss canton of vineyard terraces, Lausanne’s urban shore, and alpine resorts. Mild lake weather contrasts with mountain snow. Orient from the Lavaux vines through Lausanne toward the Alps. Vaud’s primer is Lake Geneva canton — Lavaux terraces and Jura-to-Alps span of western Switzerland.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Lake Geneva · Jura · Alpine foothills',
      role: 'French-speaking Swiss canton on Lake Geneva',
      knownFor: 'Lavaux vineyards, Lausanne shore, and alpine approaches',
    },
    features: [
      {
        name: 'Lavaux terraces',
        description:
          'UNESCO vineyard slopes above the lake.',
      },
      {
        name: 'Lausanne shore',
        description:
          'Urban waterfront of the canton.',
      },
      {
        name: 'Alpine foothills',
        description:
          'Eastern mountain approaches of Vaud.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Vaud',
        url: 'https://www.britannica.com/place/Vaud',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'north-rhine-westphalia',
    code: 'NRW',
    name: 'North Rhine-Westphalia',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['North Rhine-Westphalia', 'Nordrhein-Westfalen', 'NRW'],
    about:
      'North Rhine-Westphalia fills western Germany as a populous Land of Rhine cities, Ruhr industrial valleys remade as culture, and forested uplands toward the Sauerland. Mild western weather prevails. Read Rhine axis, Ruhr basin, and upland rim as nested belts. North Rhine-Westphalia’s primer is Rhine–Ruhr Land — dense river cities and post-industrial valleys of western Germany.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Rhine · Ruhr · Sauerland',
      role: 'Most populous German federal state',
      knownFor: 'Rhine cities, Ruhr valley, and western uplands',
    },
    features: [
      {
        name: 'Rhine axis',
        description:
          'River corridor of major western cities.',
      },
      {
        name: 'Ruhr basin',
        description:
          'Industrial valley remade for culture.',
      },
      {
        name: 'Sauerland',
        description:
          'Forested upland rim of the southeast.',
      }
    ],
    sources: [
      {
        label: 'Britannica — North Rhine–Westphalia',
        url: 'https://www.britannica.com/place/North-Rhine-Westphalia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saxony-anhalt',
    code: 'ST2',
    name: 'Saxony-Anhalt',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Saxony-Anhalt', 'Sachsen-Anhalt'],
    about:
      'Saxony-Anhalt occupies central eastern Germany as a Land of Harz mountain edges, Elbe river plains, and Bauhaus and Romanesque town cores under a continental climate. Magdeburg and Halle anchor the lowlands. Orient from the Elbe toward the Harz foothills and wine slopes of the Saale. Saxony-Anhalt’s primer is Elbe–Harz Land — river plains and Romanesque towns of east-central Germany.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Elbe · Harz foothills · Saale',
      role: 'East-central German federal state',
      knownFor: 'Harz edge, Elbe plains, and Romanesque town cores',
    },
    features: [
      {
        name: 'Elbe plains',
        description:
          'River lowlands of the state core.',
      },
      {
        name: 'Harz foothills',
        description:
          'Western mountain edge.',
      },
      {
        name: 'Saale towns',
        description:
          'Historic urban cores and wine slopes.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Saxony-Anhalt',
        url: 'https://www.britannica.com/place/Saxony-Anhalt',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'champagne-ardenne',
    code: 'CHA',
    name: 'Champagne-Ardenne',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Champagne-Ardenne', 'Champagne Ardenne'],
    about:
      'Champagne-Ardenne covers northeastern France’s chalk plains and Ardennes forests as a former administrative region of champagne vineyards, cathedral cities, and wooded plateaus under cool northern weather. Reims and Troyes organize the chalk country; the Meuse cuts the forest north. Read vineyard plain and Ardennes ridge as two belts. Champagne-Ardenne’s primer is chalk-and-forest region — champagne slopes and Ardennes woods of northeastern France.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Champagne chalk · Ardennes',
      role: 'Former northeastern French region of wine and forest',
      knownFor: 'Champagne vineyards, cathedral cities, and Ardennes forests',
    },
    features: [
      {
        name: 'Champagne slopes',
        description:
          'Chalk vineyard country of the south.',
      },
      {
        name: 'Cathedral cities',
        description:
          'Historic urban poles of the plain.',
      },
      {
        name: 'Ardennes forests',
        description:
          'Wooded plateau of the north.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Champagne-Ardenne',
        url: 'https://www.britannica.com/place/Champagne-Ardenne',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'epidaurus',
    code: 'EPI',
    name: 'Epidaurus',
    kind: 'Landmark',
    countrySlug: 'greece',
    subtitle: 'Landmark · Greece',
    matchNames: ['Epidaurus', 'Epidauros'],
    about:
      'Epidaurus occupies a wooded valley in the Argolid as the ancient sanctuary of Asclepius, famous for a remarkably preserved theater of limestone tiers and healing sanctuary courts. Hot dry summers and pine shade wrap the site. Sit in the theater so the orchestra, stage, and hillside acoustics align. Epidaurus’s primer is Asclepius sanctuary theater — limestone tiers in a Peloponnesian healing valley.',
    facts: {
      kind: 'Landmark',
      country: 'Greece',
      region: 'Europe',
      setting: 'Argolid · Peloponnese',
      role: 'Ancient healing sanctuary with a famous theater',
      knownFor: 'Classical theater, Asclepius sanctuary, and valley setting',
    },
    features: [
      {
        name: 'Theater',
        description:
          'Preserved limestone seating and orchestra.',
      },
      {
        name: 'Sanctuary courts',
        description:
          'Healing precinct of Asclepius.',
      },
      {
        name: 'Pine valley',
        description:
          'Wooded hollow holding the ruins.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Epidaurus',
        url: 'https://www.britannica.com/place/Epidaurus',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'uxmal',
    code: 'UXM',
    name: 'Uxmal',
    kind: 'Landmark',
    countrySlug: 'mexico',
    subtitle: 'Landmark · Mexico',
    matchNames: ['Uxmal'],
    about:
      'Uxmal rises from the Puuc hills of Yucatán as a Classic Maya city of the Pyramid of the Magician, Governor’s Palace frets, and carefully composed courtyards under dry forest. Hot seasonal rains and limestone karst define the setting. Walk the Nunnery Quadrangle so pyramids and lattice facades align. Uxmal’s primer is Puuc Maya city — Magician pyramid and fretted palaces of Yucatán’s hills.',
    facts: {
      kind: 'Landmark',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Puuc hills · Yucatán',
      role: 'Major Classic Maya city of the Puuc region',
      knownFor: 'Pyramid of the Magician, Governor’s Palace, and Puuc facades',
    },
    features: [
      {
        name: 'Pyramid of the Magician',
        description:
          'Oval temple pyramid of the site.',
      },
      {
        name: 'Governor’s Palace',
        description:
          'Long fretted facade on a platform.',
      },
      {
        name: 'Nunnery Quadrangle',
        description:
          'Courtyard complex of Puuc buildings.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Uxmal',
        url: 'https://www.britannica.com/place/Uxmal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hampi',
    code: 'HMP',
    name: 'Hampi',
    kind: 'Landmark',
    countrySlug: 'india',
    subtitle: 'Landmark · India',
    matchNames: ['Hampi'],
    about:
      'Hampi spreads across boulder hills and the Tungabhadra River in Karnataka as the ruined capital of Vijayanagara, a landscape of temple gopurams, bazaar streets, and granite outcrops under hot Deccan sun. Orient among Virupaksha Temple, the stone chariot, and riverside ruins. Hampi’s primer is Vijayanagara ruin city — boulder hills and temple bazaars on the Tungabhadra.',
    facts: {
      kind: 'Landmark',
      country: 'India',
      region: 'Asia',
      setting: 'Tungabhadra · Karnataka Deccan',
      role: 'Ruined capital of the Vijayanagara Empire',
      knownFor: 'Temple gopurams, boulder landscape, and stone chariot',
    },
    features: [
      {
        name: 'Virupaksha Temple',
        description:
          'Active temple core of the site.',
      },
      {
        name: 'Boulder hills',
        description:
          'Granite outcrops framing the ruins.',
      },
      {
        name: 'Bazaar streets',
        description:
          'Processional avenues of the old capital.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Hampi',
        url: 'https://www.britannica.com/place/Hampi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hatshepsut',
    code: 'HAT',
    name: 'Hatshepsut’s Temple',
    kind: 'Landmark',
    countrySlug: 'egypt',
    subtitle: 'Landmark · Egypt',
    matchNames: ['Hatshepsut’s Temple', 'Hatshepsut Temple', 'Deir el-Bahri'],
    about:
      'Hatshepsut’s mortuary temple at Deir el-Bahri rises in terraced colonnades against the Theban cliffs on Luxor’s west bank, a New Kingdom masterpiece of axial ramps and porticoes in pale limestone. Desert cliffs and intense light define the approach. Stand on the lower court so terraces, colonnades, and cliff wall stack. Hatshepsut’s temple primer is Deir el-Bahri terraces — colonnaded mortuary temple against the Theban cliffs.',
    facts: {
      kind: 'Landmark',
      country: 'Egypt',
      region: 'Africa',
      setting: 'Deir el-Bahri · west bank of Luxor',
      role: 'Mortuary temple of Pharaoh Hatshepsut',
      knownFor: 'Terraced colonnades, cliff backdrop, and axial ramps',
    },
    features: [
      {
        name: 'Terraced courts',
        description:
          'Stepped levels of the temple plan.',
      },
      {
        name: 'Colonnades',
        description:
          'Porticoes across each terrace.',
      },
      {
        name: 'Theban cliffs',
        description:
          'Limestone escarpment behind the temple.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Temple of Hatshepsut',
        url: 'https://www.britannica.com/topic/Temple-of-Hatshepsut',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'carnac',
    code: 'CRN',
    name: 'Carnac',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Carnac', 'Carnac stones'],
    about:
      'Carnac’s stone alignments on the Morbihan coast of Brittany are among Europe’s densest Neolithic megalithic fields, rows of standing stones stretching across heath and farmland under Atlantic weather. Orient along the Ménec and Kermario lines so rows and horizon align. Carnac’s primer is Breton megalith field — Neolithic stone rows on the Morbihan coastal plain.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Morbihan coast · Brittany',
      role: 'Major Neolithic megalithic alignment complex',
      knownFor: 'Standing-stone alignments, tumuli, and coastal heath',
    },
    features: [
      {
        name: 'Ménec alignments',
        description:
          'Longest visible stone rows of the site.',
      },
      {
        name: 'Kermario lines',
        description:
          'Parallel megalith rows nearby.',
      },
      {
        name: 'Coastal heath',
        description:
          'Atlantic plain setting of the stones.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Carnac',
        url: 'https://www.britannica.com/place/Carnac',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'castel-sant-angelo',
    code: 'CSA',
    name: 'Castel Sant’Angelo',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Castel Sant’Angelo', 'Castel Sant Angelo', 'Hadrian’s Mausoleum'],
    about:
      'Castel Sant’Angelo rises on the Tiber in Rome as Hadrian’s mausoleum remade into a papal fortress, a cylindrical keep linked to the Vatican by the Passetto wall. River light and bridge approaches define the view. Walk the bridge of angels so cylinder, statue, and Tiber align. Castel Sant’Angelo’s primer is Tiber fortress mausoleum — Hadrian’s tomb remade as a papal keep in Rome.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Tiber · Rome',
      role: 'Hadrianic mausoleum and later papal fortress',
      knownFor: 'Cylindrical keep, angel statue, and Tiber bridge approach',
    },
    features: [
      {
        name: 'Cylindrical keep',
        description:
          'Massive drum of the mausoleum-fortress.',
      },
      {
        name: 'Ponte Sant’Angelo',
        description:
          'Angel-lined bridge to the castle.',
      },
      {
        name: 'Passetto link',
        description:
          'Elevated corridor toward the Vatican.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Castel Sant’Angelo',
        url: 'https://www.britannica.com/topic/Castel-SantAngelo',
        kind: 'reference',
      },
    ],
  },
]

