/** Twenty-third curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch23: PlaceGuideDraftBatch[] = [
  {
    slug: 'leicester',
    code: 'LCE',
    name: 'Leicester',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Leicester'],
    about:
      'Leicester sits on the Soar in the English Midlands as a city of Roman and medieval layers, a market-square core, and a dense multiethnic center under inland mild weather. Parks and canal edges open the basin; Victorian and postwar fabric share the streets. Walk from the Clock Tower through the castle gardens to the river. Leicester’s primer is Soar Midland city — market core and castle gardens on England’s inland plain.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Soar · English Midlands',
      role: 'Midlands city and historic market center',
      knownFor: 'Market square, castle gardens, and Soar corridor',
    },
    features: [
      {
        name: 'Market core',
        description:
          'Civic and trading heart of the center.',
      },
      {
        name: 'Castle gardens',
        description:
          'Historic green around the castle mound.',
      },
      {
        name: 'Soar corridor',
        description:
          'River and canal edges of the basin.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Leicester',
        url: 'https://www.britannica.com/place/Leicester-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'coventry',
    code: 'CVT',
    name: 'Coventry',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Coventry'],
    about:
      'Coventry occupies the Warwickshire plain as an English Midlands city rebuilt around a modern cathedral beside medieval ruins after wartime destruction. Industry and university quarters ring a compact center. Mild inland weather prevails. Orient from the cathedral ruins through Broadgate to the canal basin. Coventry’s primer is Phoenix cathedral city — modern nave beside medieval ruins on the Warwickshire plain.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Warwickshire plain · English Midlands',
      role: 'Midlands industrial and university city',
      knownFor: 'Cathedral ruins, modern nave, and postwar center',
    },
    features: [
      {
        name: 'Cathedral ruins',
        description:
          'Bombed medieval shell kept as memorial.',
      },
      {
        name: 'Modern cathedral',
        description:
          'Postwar nave beside the ruins.',
      },
      {
        name: 'Canal basin',
        description:
          'Waterway edge of the rebuilt core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Coventry',
        url: 'https://www.britannica.com/place/Coventry-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'southampton',
    code: 'SOU',
    name: 'Southampton',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Southampton'],
    about:
      'Southampton sits on a double tidal inlet of the Solent as a southern English port city of medieval walls, ocean-liner docks, and a regenerating waterfront. Mild maritime weather and strong tides shape the harbors. Walk the old town walls to the Town Quay and cruise terminals. Southampton’s primer is Solent port city — medieval walls and liner docks on England’s south coast.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Solent · Hampshire coast',
      role: 'Major English Channel passenger and cargo port',
      knownFor: 'Medieval walls, ocean docks, and Solent waterfront',
    },
    features: [
      {
        name: 'Town walls',
        description:
          'Medieval defensive circuit of the old town.',
      },
      {
        name: 'Ocean docks',
        description:
          'Liner and ferry terminals of the port.',
      },
      {
        name: 'Solent waterfront',
        description:
          'Double tidal inlet of the harbor.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Southampton',
        url: 'https://www.britannica.com/place/Southampton-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rennes',
    code: 'RNS',
    name: 'Rennes',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Rennes'],
    about:
      'Rennes occupies the Vilaine and Ille confluence in Brittany as a timber-frame and stone city of a grand parlement square, university quarters, and a regenerating riverfront. Mild oceanic weather keeps the valleys green. Orient from the Parlement building through medieval lanes to the Vilaine quays. Rennes’s primer is Breton capital city — timber lanes and parlement square at Brittany’s inland hub.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Vilaine–Ille confluence · Brittany',
      role: 'Capital of Brittany and university hub',
      knownFor: 'Parlement square, timber-frame streets, and river quays',
    },
    features: [
      {
        name: 'Parlement square',
        description:
          'Classical civic heart of the city.',
      },
      {
        name: 'Timber lanes',
        description:
          'Medieval half-timber streets of the center.',
      },
      {
        name: 'Vilaine quays',
        description:
          'Riverfront of the confluence.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Rennes',
        url: 'https://www.britannica.com/place/Rennes-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'montpellier',
    code: 'MPL',
    name: 'Montpellier',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Montpellier'],
    about:
      'Montpellier rises inland from the Mediterranean in Languedoc as a sunlit university city of a Peyrou promenade, medieval medical school roots, and a dense stone old town. Bright Languedoc summers and soft winters suit outdoor squares and rooftop views. Walk from Place de la Comédie through the Écusson lanes to the aqueduct viewpoint. Montpellier’s primer is Languedoc university city — Comédie square and stone lanes near France’s Mediterranean plain.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Hérault · Mediterranean Languedoc',
      role: 'Languedoc metro and historic university city',
      knownFor: 'Place de la Comédie, Écusson old town, and Peyrou promenade',
    },
    features: [
      {
        name: 'Place de la Comédie',
        description:
          'Central square and tram hub.',
      },
      {
        name: 'Écusson',
        description:
          'Stone medieval old-town core.',
      },
      {
        name: 'Peyrou',
        description:
          'Promenade and aqueduct viewpoint.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Montpellier',
        url: 'https://www.britannica.com/place/Montpellier-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'grenoble',
    code: 'GNB',
    name: 'Grenoble',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Grenoble'],
    about:
      'Grenoble sits at the confluence of the Isère and Drac under alpine peaks as a French Alpine city of cable-car bastille views, science campuses, and a dense river-basin core. Mountain weather swings from hot valley summers to snowy surrounds. Orient from the tram streets up to the Bastille terrace above the Isère. Grenoble’s primer is Alpine basin city — Isère confluence and Bastille ridge under the French Alps.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Isère–Drac confluence · French Alps',
      role: 'Alpine metro and research hub',
      knownFor: 'Bastille cable car, alpine rim, and river basin core',
    },
    features: [
      {
        name: 'Bastille ridge',
        description:
          'Fortified hill above the city.',
      },
      {
        name: 'Isère quays',
        description:
          'River corridor through the basin.',
      },
      {
        name: 'Alpine rim',
        description:
          'Peak walls surrounding the metro.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Grenoble',
        url: 'https://www.britannica.com/place/Grenoble',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'padua',
    code: 'PDP',
    name: 'Padua',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Padua', 'Padova'],
    about:
      'Padua occupies the Venetian plain west of Venice as an Italian university city of frescoed chapels, arcaded squares, and a botanical garden rooted in Renaissance science. Hot summers and foggy winters mark the plain. Walk from Prato della Valle through the Scrovegni chapel quarter to the university courts. Padua’s primer is Venetian-plain university city — arcaded squares and fresco chapels west of Venice.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Venetian plain · Veneto',
      role: 'Historic university city of northern Italy',
      knownFor: 'Scrovegni Chapel, Prato della Valle, and university courts',
    },
    features: [
      {
        name: 'Prato della Valle',
        description:
          'Elliptical square with island green.',
      },
      {
        name: 'Scrovegni Chapel',
        description:
          'Fresco cycle of the early Renaissance.',
      },
      {
        name: 'University courts',
        description:
          'Historic academic courtyards.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Padua',
        url: 'https://www.britannica.com/place/Padua-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'salzburg',
    code: 'SZG',
    name: 'Salzburg',
    kind: 'City',
    countrySlug: 'austria',
    subtitle: 'City · Austria',
    matchNames: ['Salzburg'],
    about:
      'Salzburg sits on the Salzach beneath the Hohensalzburg fortress as an Austrian baroque city of domes, Mozart streets, and alpine approaches. Cool alpine weather and clear winter light define the basin. Orient from the Getreidegasse through the Domplatz up to the fortress ridge. Salzburg’s primer is Salzach baroque city — fortress ridge and dome skyline at the edge of the Alps.',
    facts: {
      kind: 'City',
      country: 'Austria',
      region: 'Europe',
      setting: 'Salzach · northern Alps edge',
      role: 'Baroque city and alpine gateway',
      knownFor: 'Hohensalzburg fortress, Domplatz, and Salzach quays',
    },
    features: [
      {
        name: 'Hohensalzburg',
        description:
          'Fortress ridge above the old town.',
      },
      {
        name: 'Domplatz',
        description:
          'Baroque cathedral square.',
      },
      {
        name: 'Salzach quays',
        description:
          'River corridor through the basin.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Salzburg',
        url: 'https://www.britannica.com/place/Salzburg-Austria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'brno',
    code: 'BRQ',
    name: 'Brno',
    kind: 'City',
    countrySlug: 'czechia',
    subtitle: 'City · Czechia',
    matchNames: ['Brno'],
    about:
      'Brno occupies Moravia’s hub as a Czech city of functionalist villas, a hilltop cathedral and castle, and a dense center between the Svratka and Svitava. Continental seasons mark the basin. Walk from Liberty Square through the cathedral hill to the Villa Tugendhat ridge. Brno’s primer is Moravian hub city — cathedral hill and functionalist villas in Czechia’s second metro.',
    facts: {
      kind: 'City',
      country: 'Czechia',
      region: 'Europe',
      setting: 'Moravia · Svratka–Svitava basin',
      role: 'Moravian capital and second Czech metro',
      knownFor: 'Cathedral hill, Špilberk castle, and Villa Tugendhat',
    },
    features: [
      {
        name: 'Cathedral hill',
        description:
          'Petrov ridge above the center.',
      },
      {
        name: 'Špilberk',
        description:
          'Castle fortress overlooking the city.',
      },
      {
        name: 'Villa Tugendhat',
        description:
          'Modernist villa of the interwar years.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Brno',
        url: 'https://www.britannica.com/place/Brno',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'thessaloniki',
    code: 'SKG',
    name: 'Thessaloniki',
    kind: 'City',
    countrySlug: 'greece',
    subtitle: 'City · Greece',
    matchNames: ['Thessaloniki', 'Salonika'],
    about:
      'Thessaloniki curves along the Thermaic Gulf as Greece’s northern metro of Byzantine churches, a White Tower waterfront, and an Ano Poli hillside of walls and Ottoman houses. Hot summers and a busy port define the shore. Orient from the waterfront promenade up through the Rotunda quarter to the upper town. Thessaloniki’s primer is Thermaic Gulf city — White Tower shore and Byzantine churches of northern Greece.',
    facts: {
      kind: 'City',
      country: 'Greece',
      region: 'Europe',
      setting: 'Thermaic Gulf · Macedonia',
      role: 'Northern Greek metro and historic port',
      knownFor: 'White Tower, Byzantine churches, and Ano Poli hillside',
    },
    features: [
      {
        name: 'White Tower',
        description:
          'Ottoman tower on the waterfront.',
      },
      {
        name: 'Ano Poli',
        description:
          'Upper town of walls and steep lanes.',
      },
      {
        name: 'Waterfront promenade',
        description:
          'Gulf-facing civic shore.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Thessaloniki',
        url: 'https://www.britannica.com/place/Thessaloniki-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'izmir',
    code: 'IZM',
    name: 'İzmir',
    kind: 'City',
    countrySlug: 'turkiye',
    subtitle: 'City · Türkiye',
    matchNames: ['İzmir', 'Izmir', 'Smyrna'],
    about:
      'İzmir opens on a broad Aegean gulf as a Turkish port city of a long Kordon promenade, an Agora archaeological park, and hillside neighborhoods above the bay. Hot dry summers and sea breezes shape the shore. Walk the Kordon from Konak toward Alsancak, then climb to Kadifekale’s ridge. İzmir’s primer is Aegean gulf city — Kordon promenade and agora ruins on Türkiye’s western shore.',
    facts: {
      kind: 'City',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Gulf of İzmir · Aegean coast',
      role: 'Major Aegean port and western Turkish metro',
      knownFor: 'Kordon promenade, Agora, and gulf waterfront',
    },
    features: [
      {
        name: 'Kordon',
        description:
          'Seafront promenade of the bay.',
      },
      {
        name: 'Agora',
        description:
          'Roman marketplace archaeological park.',
      },
      {
        name: 'Kadifekale',
        description:
          'Hilltop castle ridge above the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — İzmir',
        url: 'https://www.britannica.com/place/Izmir',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'linz',
    code: 'LNZ',
    name: 'Linz',
    kind: 'City',
    countrySlug: 'austria',
    subtitle: 'City · Austria',
    matchNames: ['Linz'],
    about:
      'Linz sits on the Danube in Upper Austria as a river city of a baroque Hauptplatz, steel-and-culture riverside districts, and a Pöstlingberg hill tram above the valley. Continental river weather prevails. Orient from the Hauptplatz across the Danube bridges to the Ars Electronica quarter. Linz’s primer is Danube Upper Austrian city — baroque square and cultural riverfront on the great inland waterway.',
    facts: {
      kind: 'City',
      country: 'Austria',
      region: 'Europe',
      setting: 'Danube · Upper Austria',
      role: 'Upper Austrian capital and Danube industrial-cultural city',
      knownFor: 'Hauptplatz, Danube waterfront, and Pöstlingberg hill',
    },
    features: [
      {
        name: 'Hauptplatz',
        description:
          'Baroque main square of the center.',
      },
      {
        name: 'Danube waterfront',
        description:
          'Riverfront cultural and industrial edge.',
      },
      {
        name: 'Pöstlingberg',
        description:
          'Hill tram viewpoint above the valley.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Linz',
        url: 'https://www.britannica.com/place/Linz',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'idaho',
    code: 'ID',
    name: 'Idaho',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Idaho'],
    about:
      'Idaho stretches from northern lake country and the Panhandle forests through Snake River lava plains to the Sawtooth and Rocky Mountain high country. Cold winters and dry summers dominate much of the state. Read north woods, river plain, and alpine basins as separate belts. Idaho’s primer is Rocky Mountain interior state — Snake River plains and sawtooth ranges of the northern Intermountain West.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Snake River Plain · Northern Rockies',
      role: 'Intermountain West state of plains and high ranges',
      knownFor: 'Snake River plain, Sawtooth peaks, and northern lakes',
    },
    features: [
      {
        name: 'Snake River Plain',
        description:
          'Lava and farm belt of southern Idaho.',
      },
      {
        name: 'Sawtooth ranges',
        description:
          'Alpine peaks of the central mountains.',
      },
      {
        name: 'Panhandle lakes',
        description:
          'Northern forest and lake country.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Idaho',
        url: 'https://www.britannica.com/place/Idaho-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'montana',
    code: 'MT',
    name: 'Montana',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Montana'],
    about:
      'Montana spans the northern Great Plains and the Rocky Mountain Front as a vast state of high prairies, glacier-cut parks, and wide river valleys under big sky weather. Chinooks and hard winters shape the plains; snow holds the ranges. Orient west from prairie towns into the Front and Glacier country. Montana’s primer is Big Sky frontier state — plains, Rocky Mountain Front, and glacier parks of the northern Rockies.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Northern Great Plains · Rocky Mountain Front',
      role: 'Northern Rockies and plains state',
      knownFor: 'Big Sky plains, Glacier country, and Rocky Mountain Front',
    },
    features: [
      {
        name: 'Great Plains east',
        description:
          'High prairie and river breaks.',
      },
      {
        name: 'Rocky Mountain Front',
        description:
          'Eastern wall of the Rockies.',
      },
      {
        name: 'Glacier parks',
        description:
          'Northern alpine and ice-carved ranges.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Montana',
        url: 'https://www.britannica.com/place/Montana-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nevada',
    code: 'NV',
    name: 'Nevada',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Nevada'],
    about:
      'Nevada fills much of the Great Basin with north–south basin-and-range mountains, desert valleys, and the Sierra Nevada rain shadow, plus the Las Vegas corridor in the south. Arid light and extreme diurnal swings dominate. Read basin floors, fault-block ranges, and Lake Tahoe’s rim as the map’s grammar. Nevada’s primer is Great Basin desert state — basin-and-range valleys under the Sierra rain shadow.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Great Basin · Sierra Nevada rain shadow',
      role: 'Arid basin-and-range state of the Intermountain West',
      knownFor: 'Basin-and-range desert, Reno–Tahoe rim, and Las Vegas corridor',
    },
    features: [
      {
        name: 'Basin and range',
        description:
          'Parallel valleys and fault-block mountains.',
      },
      {
        name: 'Sierra rain shadow',
        description:
          'Dry lee of the Sierra Nevada.',
      },
      {
        name: 'Southern corridor',
        description:
          'Mojave edge and Las Vegas valley.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Nevada',
        url: 'https://www.britannica.com/place/Nevada-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'anglesey',
    code: 'AGY',
    name: 'Anglesey',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Anglesey', 'Ynys Môn'],
    about:
      'Anglesey lies off northwest Wales across the Menai Strait as a low island of sea cliffs, lighthouse headlands, and farming interiors under Atlantic weather. Bridges link it to the mainland; coasts hold castles and nesting cliffs. Orient from the Menai bridges around the coastal path to South Stack. Anglesey’s primer is Menai Strait island — cliff coasts and lighthouse headlands of northwest Wales.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Menai Strait · northwest Wales',
      role: 'Welsh island across the Menai Strait',
      knownFor: 'Menai bridges, sea cliffs, and lighthouse headlands',
    },
    features: [
      {
        name: 'Menai Strait',
        description:
          'Tidal channel to mainland Wales.',
      },
      {
        name: 'Sea cliffs',
        description:
          'Nesting and lighthouse coasts.',
      },
      {
        name: 'Farming interior',
        description:
          'Low agricultural heart of the island.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Anglesey',
        url: 'https://www.britannica.com/place/Anglesey-island-Wales',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hiiumaa',
    code: 'HII',
    name: 'Hiiumaa',
    kind: 'Island',
    countrySlug: 'estonia',
    subtitle: 'Island · Estonia',
    matchNames: ['Hiiumaa'],
    about:
      'Hiiumaa is Estonia’s second-largest island in the west Estonian archipelago, a quiet Baltic land of lighthouses, pine forests, and low coastal meadows. Ice winters and mild summers shape the year. Orient from Kärdla through forest roads to the western lighthouses and shoals. Hiiumaa’s primer is west Estonian sister island — lighthouse coasts and pine interiors of the Baltic archipelago.',
    facts: {
      kind: 'Island',
      country: 'Estonia',
      region: 'Europe',
      setting: 'West Estonian archipelago · Baltic Sea',
      role: 'Second-largest Estonian island',
      knownFor: 'Lighthouses, pine forests, and quiet Baltic coasts',
    },
    features: [
      {
        name: 'Lighthouse coasts',
        description:
          'Western and northern light stations.',
      },
      {
        name: 'Pine forests',
        description:
          'Interior woodland of the island.',
      },
      {
        name: 'Coastal meadows',
        description:
          'Low shore pastures and flats.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Hiiumaa',
        url: 'https://www.britannica.com/place/Hiiumaa',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pag',
    code: 'PAG',
    name: 'Pag',
    kind: 'Island',
    countrySlug: 'croatia',
    subtitle: 'Island · Croatia',
    matchNames: ['Pag'],
    about:
      'Pag is a long, arid Dalmatian island in the Adriatic known for wind-sculpted limestone, sea-salt pans, and lace traditions under fierce bora winds. Sparse vegetation and white rock define the interior. Orient from Pag Town along the ridge to the salt flats and northern beaches. Pag’s primer is Dalmatian limestone island — salt pans and bora-scoured rock opposite the Velebit shore.',
    facts: {
      kind: 'Island',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Adriatic · Dalmatian coast',
      role: 'Long arid Dalmatian island of salt and stone',
      knownFor: 'Salt pans, limestone karst, and lace traditions',
    },
    features: [
      {
        name: 'Salt pans',
        description:
          'Coastal evaporating basins.',
      },
      {
        name: 'Limestone ridge',
        description:
          'Wind-scoured white rock spine.',
      },
      {
        name: 'Pag Town',
        description:
          'Historic island center and bridge link.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Pag',
        url: 'https://www.britannica.com/place/Pag-island-Croatia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kangaroo-island',
    code: 'KGI',
    name: 'Kangaroo Island',
    kind: 'Island',
    countrySlug: 'australia',
    subtitle: 'Island · Australia',
    matchNames: ['Kangaroo Island'],
    about:
      'Kangaroo Island lies off South Australia across the Backstairs Passage as a large island of eucalyptus scrub, seal colonies, and rugged southern cliffs under Mediterranean seasons. Wildlife reserves and farm clearings share the interior. Orient from Kingscote toward Flinders Chase and the Remarkable Rocks. Kangaroo Island’s primer is South Australian wildlife island — seal coasts and granite headlands across the Backstairs Passage.',
    facts: {
      kind: 'Island',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Backstairs Passage · South Australia',
      role: 'Large wildlife and farm island off Adelaide',
      knownFor: 'Seal colonies, Remarkable Rocks, and eucalyptus scrub',
    },
    features: [
      {
        name: 'Flinders Chase',
        description:
          'Western park of wildlife and cliffs.',
      },
      {
        name: 'Remarkable Rocks',
        description:
          'Weathered granite on the south coast.',
      },
      {
        name: 'Seal coasts',
        description:
          'Breeding shores of the island rim.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Kangaroo Island',
        url: 'https://www.britannica.com/place/Kangaroo-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'yakushima',
    code: 'YAK',
    name: 'Yakushima',
    kind: 'Island',
    countrySlug: 'japan',
    subtitle: 'Island · Japan',
    matchNames: ['Yakushima'],
    about:
      'Yakushima rises south of Kyushu as a rainy Japanese island of ancient cedar forests, granite peaks, and mossy valleys under extreme rainfall. Cloud forest and coastal villages ring the mountain core. Orient from the coast roads up into the Jomon cedar trails. Yakushima’s primer is cedar cloud-forest island — ancient sugi and moss valleys under Japan’s wettest mountain rains.',
    facts: {
      kind: 'Island',
      country: 'Japan',
      region: 'Asia',
      setting: 'Ōsumi Islands · south of Kyushu',
      role: 'UNESCO forest island of ancient cedars',
      knownFor: 'Jomon cedars, moss forests, and granite peaks',
    },
    features: [
      {
        name: 'Ancient cedars',
        description:
          'Millennial sugi of the mountain forests.',
      },
      {
        name: 'Moss valleys',
        description:
          'Cloud-forest floors of deep green.',
      },
      {
        name: 'Granite peaks',
        description:
          'High wet mountains of the island core.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Yakushima',
        url: 'https://www.britannica.com/place/Yakushima',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'la-digue',
    code: 'LDG',
    name: 'La Digue',
    kind: 'Island',
    countrySlug: 'seychelles',
    subtitle: 'Island · Seychelles',
    matchNames: ['La Digue'],
    about:
      'La Digue is a small granitic Seychelles island east of Praslin, famous for Anse Source d’Argent’s granite boulders, bike-pace lanes, and reef shallows under equatorial heat. Hills of ancient rock rise from pale sand. Orient from La Passe through the boulder beaches to the southern coves. La Digue’s primer is granite boulder island — Anse Source d’Argent sands in the Seychelles granitic group.',
    facts: {
      kind: 'Island',
      country: 'Seychelles',
      region: 'Africa',
      setting: 'Granitic Seychelles · east of Praslin',
      role: 'Small Seychelles island of iconic boulder beaches',
      knownFor: 'Anse Source d’Argent, granite boulders, and reef shallows',
    },
    features: [
      {
        name: 'Anse Source d’Argent',
        description:
          'Boulder-framed beach of pale sand.',
      },
      {
        name: 'Granite hills',
        description:
          'Ancient rock spines of the island.',
      },
      {
        name: 'Reef shallows',
        description:
          'Calm lagoon edges for swimming.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Seychelles',
        url: 'https://www.britannica.com/place/Seychelles',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'graubunden',
    code: 'GRB',
    name: 'Graubünden',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Graubünden', 'Graubunden', 'Grisons'],
    about:
      'Graubünden fills southeastern Switzerland as a trilingual alpine canton of deep Rhine and Inn valleys, high passes, and resort basins under continental mountain weather. Engadin light and Rhine gorge contrast. Orient along the valleys toward Davos, St. Moritz, and the Swiss National Park. Graubünden’s primer is southeastern alpine canton — Rhine and Inn valleys under Switzerland’s highest pass country.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Rhine · Inn · southeastern Swiss Alps',
      role: 'Largest Swiss canton by area; alpine pass region',
      knownFor: 'Engadin valleys, alpine passes, and Rhine gorge',
    },
    features: [
      {
        name: 'Engadin',
        description:
          'High Inn valley of clear alpine light.',
      },
      {
        name: 'Rhine valleys',
        description:
          'Deep corridors of the Anterior Rhine.',
      },
      {
        name: 'High passes',
        description:
          'Historic alpine crossings of the canton.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Graubünden',
        url: 'https://www.britannica.com/place/Graubunden',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'baden-wurttemberg',
    code: 'BWB',
    name: 'Baden-Württemberg',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Baden-Württemberg', 'Baden-Wurttemberg', 'Baden Württemberg'],
    about:
      'Baden-Württemberg occupies southwestern Germany between the Rhine, Black Forest, and Swabian Jura as a Land of forested uplands, industrial valleys, and lake and river edges. Mild western weather and snowy uplands share the year. Read Rhine plain, Black Forest ridge, and Neckar basin as the map’s belts. Baden-Württemberg’s primer is Rhine–Black Forest Land — forest ridges and industrial valleys of southwestern Germany.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Rhine · Black Forest · Swabian Jura',
      role: 'Southwestern German federal state',
      knownFor: 'Black Forest, Rhine plain, and Swabian uplands',
    },
    features: [
      {
        name: 'Black Forest',
        description:
          'Forested ridge of the southwest.',
      },
      {
        name: 'Rhine plain',
        description:
          'Western lowland corridor.',
      },
      {
        name: 'Swabian Jura',
        description:
          'Limestone plateau of the east.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Baden-Württemberg',
        url: 'https://www.britannica.com/place/Baden-Wurttemberg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lower-saxony',
    code: 'LSX',
    name: 'Lower Saxony',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Lower Saxony', 'Niedersachsen'],
    about:
      'Lower Saxony spreads across northwestern Germany from the North Sea Wadden coast through heath and Geest to the Harz foothills as a broad Land of ports, farmland, and forest edges. Maritime winds mark the north; inland plains hold agriculture. Orient from the coast and Bremen approaches south to the Harz. Lower Saxony’s primer is North Sea–Harz Land — Wadden coast, heath, and plains of northwestern Germany.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'North Sea · Geest · Harz foothills',
      role: 'Large northwestern German federal state',
      knownFor: 'Wadden coast, Lüneburg Heath, and North German plain',
    },
    features: [
      {
        name: 'Wadden coast',
        description:
          'Tidal North Sea shore and islands.',
      },
      {
        name: 'Lüneburg Heath',
        description:
          'Inland heath and Geest landscape.',
      },
      {
        name: 'Harz foothills',
        description:
          'Southern upland edge of the Land.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lower Saxony',
        url: 'https://www.britannica.com/place/Lower-Saxony',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rhineland-palatinate',
    code: 'RLP',
    name: 'Rhineland-Palatinate',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Rhineland-Palatinate', 'Rheinland-Pfalz'],
    about:
      'Rhineland-Palatinate follows the Rhine and Moselle through western Germany as a Land of vineyard slopes, volcanic Eifel hills, and fortress towns under a mild wine-climate edge. River terraces and forest plateaus structure travel. Orient along the Rhine gorge and Moselle loops through the wine villages. Rhineland-Palatinate’s primer is Rhine–Moselle wine Land — vineyard slopes and river fortresses of western Germany.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Rhine · Moselle · Eifel',
      role: 'Western German federal state of river wine country',
      knownFor: 'Rhine gorge, Moselle vineyards, and Eifel hills',
    },
    features: [
      {
        name: 'Rhine gorge',
        description:
          'Fortress and vineyard river corridor.',
      },
      {
        name: 'Moselle loops',
        description:
          'Wine terraces of the tributary valley.',
      },
      {
        name: 'Eifel hills',
        description:
          'Volcanic upland of the northwest.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Rhineland-Palatinate',
        url: 'https://www.britannica.com/place/Rhineland-Palatinate',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'castile-la-mancha',
    code: 'CLM',
    name: 'Castile-La Mancha',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Castile-La Mancha', 'Castilla-La Mancha', 'La Mancha'],
    about:
      'Castile-La Mancha occupies the southern Meseta of Spain as a high plain region of windmill ridges, dry farmland, and Toledo’s Tagus gorge under a hot continental climate. Wide horizons and sparse shade define summer travel. Orient from Toledo across the Mancha plains toward Cuenca’s gorge towns. Castile-La Mancha’s primer is southern Meseta plain — windmill horizons and Tagus-side Toledo under Castilian sky.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Southern Meseta · La Mancha',
      role: 'Autonomous community of Spain’s southern tableland',
      knownFor: 'La Mancha plains, windmill ridges, and Toledo gorge',
    },
    features: [
      {
        name: 'La Mancha plains',
        description:
          'Wide dry farmland of the southern Meseta.',
      },
      {
        name: 'Windmill ridges',
        description:
          'Hilltop mills of the Mancha skyline.',
      },
      {
        name: 'Toledo gorge',
        description:
          'Tagus-bound historic city of the west.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Castile–La Mancha',
        url: 'https://www.britannica.com/place/Castile-La-Mancha',
        kind: 'reference',
      },
    ],
  },

  {
    slug: 'parthenon',
    code: 'PRT',
    name: 'Parthenon',
    kind: 'Landmark',
    countrySlug: 'greece',
    subtitle: 'Landmark · Greece',
    matchNames: ['Parthenon'],
    about:
      'The Parthenon crowns the Acropolis of Athens as the Periclean Doric temple of Athena, a marble peristyle ruin whose columns still organize the skyline of the rock. Attic light and city sprawl frame the plateau. Stand on the Acropolis so the temple, Erechtheion, and city plain align. The Parthenon’s primer is Acropolis Doric temple — Periclean marble colonnade above classical Athens.',
    facts: {
      kind: 'Landmark',
      country: 'Greece',
      region: 'Europe',
      setting: 'Acropolis · Athens',
      role: 'Principal temple of Athena on the Acropolis',
      knownFor: 'Doric colonnade, sculptural legacy, and Acropolis skyline',
    },
    features: [
      {
        name: 'Doric peristyle',
        description:
          'Outer colonnade of the temple.',
      },
      {
        name: 'Cella ruins',
        description:
          'Inner chamber footprint of Athena’s shrine.',
      },
      {
        name: 'Acropolis plateau',
        description:
          'Sacred rock holding the temple.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Parthenon',
        url: 'https://www.britannica.com/topic/Parthenon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mycenae',
    code: 'MYC',
    name: 'Mycenae',
    kind: 'Landmark',
    countrySlug: 'greece',
    subtitle: 'Landmark · Greece',
    matchNames: ['Mycenae'],
    about:
      'Mycenae occupies a fortified hill in the Argolid as the Bronze Age citadel of Lion Gate walls, shaft graves, and palace ruins overlooking the plain of Argos. Dry hill light and olive slopes surround the site. Climb from the Lion Gate through the grave circles to the palace terrace. Mycenae’s primer is Argolid citadel — Lion Gate and Cyclopean walls of Bronze Age Greece.',
    facts: {
      kind: 'Landmark',
      country: 'Greece',
      region: 'Europe',
      setting: 'Argolid · Peloponnese',
      role: 'Major Mycenaean citadel of the Late Bronze Age',
      knownFor: 'Lion Gate, Cyclopean walls, and shaft graves',
    },
    features: [
      {
        name: 'Lion Gate',
        description:
          'Monumental relief gate of the citadel.',
      },
      {
        name: 'Cyclopean walls',
        description:
          'Massive Bronze Age fortifications.',
      },
      {
        name: 'Grave circles',
        description:
          'Royal burial precincts inside the walls.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mycenae',
        url: 'https://www.britannica.com/place/Mycenae',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tikal',
    code: 'TIK',
    name: 'Tikal',
    kind: 'Landmark',
    countrySlug: 'guatemala',
    subtitle: 'Landmark · Guatemala',
    matchNames: ['Tikal'],
    about:
      'Tikal rises from the Petén rainforest as a Classic Maya city of steep temple pyramids, plazas, and causeways emerging above the canopy. Humid forest and howler calls wrap the ruins. Climb the plaza so Temples I and II face across the Great Plaza. Tikal’s primer is Petén Maya city — rainforest temple pyramids above Guatemala’s northern lowlands.',
    facts: {
      kind: 'Landmark',
      country: 'Guatemala',
      region: 'Americas',
      setting: 'Petén rainforest · northern Guatemala',
      role: 'Major Classic Maya urban center',
      knownFor: 'Temple pyramids, Great Plaza, and rainforest canopy setting',
    },
    features: [
      {
        name: 'Great Plaza',
        description:
          'Core court between Temples I and II.',
      },
      {
        name: 'Temple pyramids',
        description:
          'Steep roof-comb towers above the forest.',
      },
      {
        name: 'Causeways',
        description:
          'Raised Maya roads through the site.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Tikal',
        url: 'https://www.britannica.com/place/Tikal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'palenque',
    code: 'PLQ',
    name: 'Palenque',
    kind: 'Landmark',
    countrySlug: 'mexico',
    subtitle: 'Landmark · Mexico',
    matchNames: ['Palenque'],
    about:
      'Palenque occupies a rainforest terrace in Chiapas as a Classic Maya city of the Temple of the Inscriptions, palace aqueducts, and fine stucco relief under humid foothill weather. Jungle and mist wrap the white stone. Walk from the palace court to Pakal’s temple pyramid so water channels and roof combs align. Palenque’s primer is Chiapas Maya city — Inscriptions temple and palace courts in Mexico’s southern rainforest.',
    facts: {
      kind: 'Landmark',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Chiapas foothills · southern Mexico',
      role: 'Classic Maya city of the Usumacinta region',
      knownFor: 'Temple of the Inscriptions, palace, and stucco relief',
    },
    features: [
      {
        name: 'Temple of the Inscriptions',
        description:
          'Pyramid tomb of Pakal.',
      },
      {
        name: 'Palace complex',
        description:
          'Courts and aqueduct of the royal compound.',
      },
      {
        name: 'Forest terrace',
        description:
          'Rainforest setting of the ruins.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Palenque',
        url: 'https://www.britannica.com/place/Palenque',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'prambanan',
    code: 'PRB',
    name: 'Prambanan',
    kind: 'Landmark',
    countrySlug: 'indonesia',
    subtitle: 'Landmark · Indonesia',
    matchNames: ['Prambanan'],
    about:
      'Prambanan is the 9th-century Hindu temple compound on the Java plain near Yogyakarta, a tall Shiva temple and companion shrines rising from a rectangular court under tropical light. Rice fields and Merapi’s volcanic silhouette frame the site. Walk the central court so the three main towers and concentric shrines read as one mandala. Prambanan’s primer is Javanese Hindu temple compound — soaring Shiva tower on the Yogyakarta plain.',
    facts: {
      kind: 'Landmark',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'Central Java plain · near Yogyakarta',
      role: 'Major Hindu temple complex of ancient Java',
      knownFor: 'Shiva temple tower, mandala plan, and Merapi backdrop',
    },
    features: [
      {
        name: 'Shiva temple',
        description:
          'Tallest central tower of the compound.',
      },
      {
        name: 'Companion shrines',
        description:
          'Vishnu and Brahma temples of the court.',
      },
      {
        name: 'Mandala plan',
        description:
          'Concentric shrine geometry of the site.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Prambanan',
        url: 'https://www.britannica.com/place/Prambanan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ayutthaya',
    code: 'AYU',
    name: 'Ayutthaya',
    kind: 'Landmark',
    countrySlug: 'thailand',
    subtitle: 'Landmark · Thailand',
    matchNames: ['Ayutthaya', 'Ayudhya'],
    about:
      'Ayutthaya is the ruined island capital of the former Siamese kingdom north of Bangkok, a riverside city of prang towers, monastery courtyards, and brick stupas among the Chao Phraya channels. Hot tropical weather and river floods shaped the site. Orient among Wat Phra Si Sanphet and Wat Mahathat so towers and river bends align. Ayutthaya’s primer is Siamese island capital — prang towers and monastery ruins on the Chao Phraya.',
    facts: {
      kind: 'Landmark',
      country: 'Thailand',
      region: 'Asia',
      setting: 'Chao Phraya confluence · central Thailand',
      role: 'Former Siamese capital and UNESCO historic city',
      knownFor: 'Prang towers, riverside monasteries, and island plan',
    },
    features: [
      {
        name: 'Prang towers',
        description:
          'Khmer-influenced temple spires.',
      },
      {
        name: 'Wat courtyards',
        description:
          'Monastery compounds of the old capital.',
      },
      {
        name: 'River island',
        description:
          'Water-defined plan of the historic city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Ayutthaya',
        url: 'https://www.britannica.com/place/Ayutthaya-Thailand',
        kind: 'reference',
      },
    ],
  },
]

