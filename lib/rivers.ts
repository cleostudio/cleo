/** Rivers topic — factual about records for world rivers. */

import riversPhotos from '~/content/rivers-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface RiverFeature {
  name: string
  description: string
}

export interface RiverSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface RiverFacts {
  /** Broad type: Continental river, Inland river system, etc. */
  kind: string
  /** Source → mouth / length in plain language. */
  course: string
  /** Geographic setting in plain language. */
  region: string
  /** Drainage basin, major tributaries, catchment note. */
  basin: string
  /** Regime, flood pulse, discharge character. */
  hydrology: string
  /** Climate, sediment, or ecology role. */
  climateRole: string
  /** Modern Explore countries on the course (exact catalog names). */
  exploreLinks: string[]
}

export interface RiverPhoto extends StaticPhoto {
  commonsTitle: string
}

export interface RiverSubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. NIL, AMZ). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title. */
  subtitle: string
  /** Neutral factual overview, ~150–250 words. */
  about: string
  facts: RiverFacts
  /** Exactly three notable sites / features. */
  features: [RiverFeature, RiverFeature, RiverFeature]
  sources: RiverSource[]
  /** Three distinct, locally hosted photographs: one hero plus two gallery views. */
  photos: [RiverPhoto, RiverPhoto, RiverPhoto]
}

type RiverSubjectDraft = Omit<RiverSubject, 'photos'>

const photoManifest = riversPhotos as Record<string, RiverPhoto[]>

function withPhotos(draft: RiverSubjectDraft): RiverSubject {
  const photos = photoManifest[draft.slug]
  if (!Array.isArray(photos) || photos.length !== 3) {
    throw new Error(`Missing three river photos for ${draft.slug}`)
  }
  return {
    ...draft,
    photos: photos as [RiverPhoto, RiverPhoto, RiverPhoto],
  }
}

/**
 * Curated catalog — major rivers across Africa, Asia, and Europe, Americas & Oceania
 * (twenty-six rivers). Expand here as new Rivers pages ship.
 */
const riverSubjectDrafts: RiverSubjectDraft[] = [
  {
    slug: 'nile',
    code: 'NIL',
    name: 'Nile',
    category: 'Africa',
    subtitle: 'Desert corridor · White & Blue Nile',
    about:
      'The Nile is a long river along the edge of the Sahara. Its White Nile and Blue Nile branches meet at Khartoum, Sudan, and the combined river flows north through Egypt to a delta on the Mediterranean Sea. Cataracts, floodplains, and seasonal flows historically shaped agriculture and settlement along its course.\nRunoff from the Ethiopian Highlands continues to drive the seasonal flow of the Blue Nile, while the lower Nile Valley supports dense cities and irrigated farmland in a narrow green corridor through arid terrain. Dams and barrages have altered the river’s former flood regime, but the Nile remains a central geographic and settlement corridor of northeast Africa.',
    facts: {
      kind: 'Continental river',
      course: 'East African sources → Sudan confluence → Egyptian valley → Mediterranean delta',
      region: 'Northeast Africa · Nile Valley',
      basin: 'White Nile and Blue Nile systems; vast catchment across multiple highland and wetland sources',
      hydrology: 'Seasonal Blue Nile flood pulse historically; now regulated by major dams and reservoirs',
      climateRole: 'Desert-edge water artery; sediment and floodplain fertility engine',
      exploreLinks: ['Egypt', 'Sudan', 'South Sudan', 'Ethiopia', 'Uganda'],
    },
    features: [
      {
        name: 'Nile at Luxor',
        description:
          'The river corridor through Upper Egypt — a working floodplain and navigation spine beside temple cities.',
      },
      {
        name: 'Blue Nile Falls',
        description:
          'A highland cascade near Lake Tana — a visible pulse point on the Ethiopian Blue Nile branch.',
      },
      {
        name: 'Nile from orbit',
        description:
          'The green valley and Sinai approaches from space — desert geometry that makes the river’s corridor unmistakable.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Nile River',
        url: 'https://www.britannica.com/place/Nile-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Nile',
        url: 'https://earthobservatory.nasa.gov/world-of-change/Nile',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Nubian Monuments from Abu Simbel to Philae',
        url: 'https://whc.unesco.org/en/list/88',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'congo',
    code: 'CNG',
    name: 'Congo River',
    category: 'Africa',
    subtitle: 'Rainforest discharge · Atlantic outlet',
    about:
      'The Congo River drains a vast equatorial basin in Central Africa, carrying high volumes of water from rainforest, wetlands, and tributary systems toward the Atlantic Ocean. Its lower course passes through rapids, narrows, and cataracts that interrupt navigation. Pool Malebo forms a broad reach between Kinshasa in the Democratic Republic of the Congo and Brazzaville in the Republic of the Congo, linking the two capital cities across the river.\nBelow Pool Malebo, Livingstone Falls and related cataracts prevent continuous navigation from the interior to the sea. The lower river also includes major hydropower sites, notably Inga, where its flow is used for large-scale electricity generation. Across the basin, forests and wetlands hold major stores of carbon and support extensive biodiversity.',
    facts: {
      kind: 'Continental river',
      course: 'East-central African sources → Congo Basin → Pool Malebo → lower cataracts → Atlantic',
      region: 'Central Africa · Congo Basin',
      basin: 'Second-largest tropical drainage by discharge; dense tributary network under equatorial forest',
      hydrology: 'Relatively steady equatorial regime with huge mean discharge; cataracts interrupt the lower stem',
      climateRole: 'Rainforest moisture and carbon reservoir; Atlantic freshwater and sediment pulse',
      exploreLinks: [
        'Congo, Democratic Republic of the',
        'Congo',
        'Angola',
        'Zambia',
        'Central African Republic',
      ],
    },
    features: [
      {
        name: 'Congo at Kinshasa',
        description:
          'The working urban riverfront on Pool Malebo’s south bank — where the basin’s commerce concentrates.',
      },
      {
        name: 'Inga Dam',
        description:
          'Hydropower on the lower Congo — a modern hinge where cataracts become continental electricity.',
      },
      {
        name: 'Pool Malebo reach',
        description:
          'The broad pool that stages Kinshasa and Brazzaville facing each other across the international channel.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Congo River',
        url: 'https://www.britannica.com/place/Congo-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Congo Basin',
        url: 'https://earthobservatory.nasa.gov/images/146738/mapping-the-congo-basin',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Salonga National Park',
        url: 'https://whc.unesco.org/en/list/280',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'niger',
    code: 'NGR',
    name: 'Niger River',
    category: 'Africa',
    subtitle: 'Sahel arc · Inner Delta',
    about:
      'The Niger River rises in the highlands of Guinea near the Atlantic coast, flows northeast through the Sahel, and then turns south toward the Gulf of Guinea, where it forms a large delta in Nigeria. Its broad arc crosses several West African regions and has long linked inland settlements with trade routes.\nIn Mali, the Inner Niger Delta consists of seasonal floodplains shaped by monsoon-driven river floods. The river passes Bamako and follows the historic Niger bend near Timbuktu before continuing into its lower course. In Nigeria, the Niger Delta contains dense settlement, fisheries, and major oil-producing areas. Dams and irrigation projects have altered parts of the basin, while seasonal flooding remains a central feature of its middle reaches.',
    facts: {
      kind: 'Continental river',
      course: 'Guinea highlands → Sahel bend → Inner Niger Delta → Nigerian lower course → Gulf of Guinea',
      region: 'West Africa · Niger Basin',
      basin: 'Large West African drainage spanning Sahel and Guinean zones; Inner Delta as seasonal storage',
      hydrology: 'Monsoon flood pulse; inland delta that expands and contracts with the rains',
      climateRole: 'Sahel freshwater corridor; floodplain agriculture and fishery engine',
      exploreLinks: ['Nigeria', 'Mali', 'Niger', 'Guinea', 'Benin'],
    },
    features: [
      {
        name: 'Niger at Bamako',
        description:
          'The river as a Malian capital waterfront — bridges and shores where the upper–middle course meets a growing city.',
      },
      {
        name: 'Niger near Timbuktu',
        description:
          'The northern bend’s working water — fishing and seasonal navigation on the desert-edge reach.',
      },
      {
        name: 'Niger Delta',
        description:
          'The Gulf of Guinea outlet’s channel maze — one of Africa’s largest wetland and coastal deltas.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Niger River',
        url: 'https://www.britannica.com/place/Niger-River',
        kind: 'reference',
      },
      {
        label: 'ESA — The Niger delta',
        url: 'https://www.esa.int/ESA_Multimedia/Images/2012/05/The_Niger_delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Cliff of Bandiagara',
        url: 'https://whc.unesco.org/en/list/516',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'zambezi',
    code: 'ZAM',
    name: 'Zambezi',
    category: 'Africa',
    subtitle: 'Victoria Falls · Kariba to delta',
    about:
      'The Zambezi is a major east-flowing river of southern Africa. It rises in the uplands of northwestern Zambia and Angola, passes through or along several national borders, plunges over Victoria Falls, and continues through Lake Kariba and Cahora Bassa before spreading across a delta on Mozambique’s coast at the Indian Ocean.\nVictoria Falls, also known as Mosi-oa-Tunya, is a major landmark on the river. The large hydropower reservoirs of Lake Kariba and Cahora Bassa have substantially altered the middle course, while the lower river forms a coastal floodplain and delta in Mozambique. Shared borders, wildlife corridors, river discharge, reservoirs, falls, and delta wetlands all shape the basin’s physical and human geography.',
    facts: {
      kind: 'Continental river',
      course: 'Central African uplands → Victoria Falls → Kariba / Cahora Bassa → Mozambique delta → Indian Ocean',
      region: 'Southern Africa · Zambezi Basin',
      basin: 'Large southern African drainage shared by multiple riparian states; major reservoir cascade on the middle stem',
      hydrology: 'Seasonal flood pulse moderated by large dams; Victoria Falls as a free-falling gorge hinge',
      climateRole: 'Southern African freshwater corridor; wetland and delta moisture engine',
      exploreLinks: [
        'Zambia',
        'Zimbabwe',
        'Mozambique',
        'Angola',
        'Namibia',
        'Botswana',
        'Malawi',
        'Tanzania',
      ],
    },
    features: [
      {
        name: 'Victoria Falls',
        description:
          'Mosi-oa-Tunya on the Zambia–Zimbabwe border — where the Zambezi drops into a basalt gorge in a curtain of spray.',
      },
      {
        name: 'Lake Kariba',
        description:
          'A vast mid-course reservoir on the Zambia–Zimbabwe reach — hydropower and shoreline remade from the flooded valley.',
      },
      {
        name: 'Zambezi Delta',
        description:
          'The Mozambique Channel outlet’s channel maze — where the trunk spreads into coastal wetland before the Indian Ocean.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Zambezi River',
        url: 'https://www.britannica.com/place/Zambezi-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Victoria Falls',
        url: 'https://earthobservatory.nasa.gov/images/92078/victoria-falls',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Mosi-oa-Tunya / Victoria Falls',
        url: 'https://whc.unesco.org/en/list/509',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'orange-river',
    code: 'ORG',
    name: 'Orange River',
    category: 'Africa',
    subtitle: 'Lesotho highlands · Atlantic outlet',
    about:
      'The Orange River, also known as the Gariep, is southern Africa’s longest west-flowing river. It rises in the highlands of Lesotho, crosses the South African interior, and forms much of the border between South Africa and Namibia before entering the Atlantic Ocean.\nIts upper course begins in highland terrain, while the middle river is regulated by major storage works including Gariep Dam. Near Augrabies Falls, the river passes through a granite gorge in an arid landscape. The lower Orange follows the desert edge toward the west coast, where its flow supplies scarce freshwater to dry surrounding regions.',
    facts: {
      kind: 'Continental river',
      course: 'Lesotho Drakensberg sources → South African interior → Augrabies gorge → Namibia border → Atlantic',
      region: 'Southern Africa · Orange–Senqu Basin',
      basin: 'Largest river system in South Africa; highland Senqu headwaters and arid western catchment',
      hydrology: 'Seasonal highland runoff regulated by large dams; canyon and desert-edge lower reaches',
      climateRole: 'Interior water transfer and irrigation spine; arid-west freshwater corridor',
      exploreLinks: ['South Africa', 'Lesotho', 'Namibia'],
    },
    features: [
      {
        name: 'Orange River Canyon',
        description:
          'Arid canyon walls along the western course — where the river cuts a green line through desert rock.',
      },
      {
        name: 'Augrabies Falls',
        description:
          'A granite gorge cascade on the lower–middle Orange — a thunderous hinge where the river drops through the plateau.',
      },
      {
        name: 'Gariep Dam',
        description:
          'A major storage reservoir on the South African stem — the hydraulic hinge of Orange–Senqu regulation.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Orange River',
        url: 'https://www.britannica.com/place/Orange-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Orange River',
        url: 'https://earthobservatory.nasa.gov/images/147511/orange-river',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Maloti-Drakensberg Park',
        url: 'https://whc.unesco.org/en/list/985',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'senegal',
    code: 'SEN',
    name: 'Senegal River',
    category: 'Africa',
    subtitle: 'Sahel border river · Atlantic outlet',
    about:
      'The Senegal River rises in the Guinean highlands and flows northwest through West Africa to the Atlantic Ocean near Saint-Louis, Senegal. Along much of its lower course, it forms the border between Senegal and Mauritania. The river valley supports floodplain farming and irrigated agriculture, with crossings including the ferry and bridge at Rosso.\nSeasonal floods continue to shape the valley, although dams and irrigation systems have altered parts of the river’s banks and floodplain. The Senegal is a desert-edge Sahelian waterway rather than a rainforest river, and its basin is shared by several West African countries.',
    facts: {
      kind: 'Continental river',
      course: 'Guinean highlands → Mali–Senegal–Mauritania valley → Saint-Louis approaches → Atlantic',
      region: 'West Africa · Senegal Basin',
      basin: 'Shared Sahel drainage; valley floodplains as seasonal storage and farmland',
      hydrology: 'Monsoon flood pulse; regulated reaches with dams and irrigation offtakes',
      climateRole: 'Sahel freshwater corridor; floodplain agriculture engine on the desert edge',
      exploreLinks: ['Senegal', 'Mauritania', 'Mali', 'Guinea'],
    },
    features: [
      {
        name: 'Senegal at Dagana',
        description:
          'A working lower-valley reach — where Sahel settlement and floodplain farming meet the border river.',
      },
      {
        name: 'Rosso crossing',
        description:
          'The Senegal–Mauritania ferry hinge — a daily border crossing that makes the shared river visible as infrastructure.',
      },
      {
        name: 'Senegal from orbit',
        description:
          'Basin-scale views of the Sahel valley — a green corridor written across arid West Africa.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Senegal River',
        url: 'https://www.britannica.com/place/Senegal-River',
        kind: 'reference',
      },
      {
        label: 'NASA Visible Earth — Senegal Valley',
        url: 'https://visibleearth.nasa.gov/images/147334',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Island of Saint-Louis',
        url: 'https://whc.unesco.org/en/list/956',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'limpopo',
    code: 'LIM',
    name: 'Limpopo',
    category: 'Africa',
    subtitle: 'Southern Africa arc · Indian Ocean',
    about:
      'The Limpopo is a major southern African river that gathers water from South Africa, Botswana, and Zimbabwe before curving east through Mozambique to the Indian Ocean. Its wide, often seasonal channel may appear nearly dry during drought and expand greatly in flood years. The river forms or follows parts of national boundaries and supports settlements, agriculture, and wildlife corridors near Kruger National Park and neighboring protected areas. In lower Mozambique, communities along the river are exposed to flooding and cyclone-related risk. The Limpopo is more significant as a boundary and regional water source than as a navigable transport route.',
    facts: {
      kind: 'Continental river',
      course: 'Southern African interior sources → South Africa–Botswana–Zimbabwe borders → Mozambique → Indian Ocean',
      region: 'Southern Africa · Limpopo Basin',
      basin: 'Shared drainage of the southern African plateau; seasonal tributaries and sand-filled channels',
      hydrology: 'Strongly seasonal; drought sandbanks and major flood years on the same course',
      climateRole: 'Semi-arid freshwater corridor; floodplain and wildlife-water hinge',
      exploreLinks: ['South Africa', 'Botswana', 'Zimbabwe', 'Mozambique'],
    },
    features: [
      {
        name: 'Limpopo channel',
        description:
          'A broad sand-filled course under southern African skies — the river as a seasonal corridor rather than a permanent flood.',
      },
      {
        name: 'Limpopo floodplain',
        description:
          'Wide inundation flats in wet years — where the arc river remakes its banks and villages at once.',
      },
      {
        name: 'Limpopo sandbanks',
        description:
          'Exposed bars and wildlife edges along the park reaches — dry-season geography written in sand and waterholes.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Limpopo River',
        url: 'https://www.britannica.com/place/Limpopo-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Mozambique floods',
        url: 'https://earthobservatory.nasa.gov/images/14592/flooding-in-mozambique',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Mapungubwe Cultural Landscape',
        url: 'https://whc.unesco.org/en/list/1099',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'okavango',
    code: 'OKA',
    name: 'Okavango',
    category: 'Africa',
    subtitle: 'Endorheic inland delta · Kalahari',
    about:
      'The Okavango is an endorheic river in southern Africa. It rises in the Angolan highlands, crosses the Caprivi approaches of Namibia, and spreads into an inland delta in Botswana’s Kalahari rather than reaching the sea. Seasonal floodwaters expand across a broad fan of channels, lagoons, and islands, forming the Okavango Delta. Wildlife is concentrated along the boundary between desert and wetland. The river’s inland terminus, flood pulse, delta geometry, and endorheic hydrology make it a notable system for climate and ecology research.',
    facts: {
      kind: 'Endorheic river',
      course: 'Angolan highlands → Namibia Caprivi approaches → Okavango Delta (Botswana) — no ocean outlet',
      region: 'Southern Africa · Okavango Basin',
      basin: 'Endorheic drainage ending in a Kalahari inland delta; shared Angola–Namibia–Botswana waters',
      hydrology: 'Strong seasonal flood pulse that expands and contracts the inland delta',
      climateRole: 'Desert-edge wetland moisture and biodiversity engine; inland evaporative terminus',
      exploreLinks: ['Angola', 'Namibia', 'Botswana'],
    },
    features: [
      {
        name: 'Okavango Delta',
        description:
          'The inland fan of channels and islands — where the river spreads into the Kalahari instead of the sea.',
      },
      {
        name: 'Okavango channels',
        description:
          'Aerial mazes of water and papyrus — the working geometry of an endorheic flood pulse.',
      },
      {
        name: 'Okavango from orbit',
        description:
          'Basin-scale views of the inland delta — a green handprint of water written on arid southern Africa.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Okavango River',
        url: 'https://www.britannica.com/place/Okavango-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Okavango Delta',
        url: 'https://earthobservatory.nasa.gov/world-of-change/Okavango',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Okavango Delta',
        url: 'https://whc.unesco.org/en/list/1432',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'yangtze',
    code: 'YTZ',
    name: 'Yangtze',
    category: 'Asia',
    subtitle: 'China’s main stem · gorge to delta',
    about:
      'The Yangtze, or Chang Jiang, is China’s longest river, flowing west to east from headwaters on the Tibetan Plateau through deep gorges, industrial cities, and a delta on the East China Sea. Its middle course includes Qutang Gorge and neighboring gorges, where the river is confined by steep terrain. The Three Gorges Dam forms a major modern element of hydraulic control on the river.\nIn the lower basin, cities depend on the Yangtze for transport and water supply while also managing its flood risk. The river’s course and flow have been shaped by both its mountain gorges and large-scale engineering works.',
    facts: {
      kind: 'Continental river',
      course: 'Qinghai–Tibet headwaters → Three Gorges → middle–lower plains → East China Sea',
      region: 'Central China · Chang Jiang basin',
      basin: 'China’s largest river basin; major tributaries feed a densely settled floodplain corridor',
      hydrology: 'Monsoon-influenced floods; large reservoirs now regulate much of the middle course',
      climateRole: 'Primary freshwater and sediment artery for eastern China’s agricultural and urban core',
      exploreLinks: ['China'],
    },
    features: [
      {
        name: 'Qutang Gorge',
        description:
          'The shortest and steepest of the Three Gorges — a classic narrows where cliffs force the Yangtze into a single dramatic channel.',
      },
      {
        name: 'Three Gorges Dam',
        description:
          'A modern concrete hinge on the middle Yangtze — power, navigation, and flood control at continental scale.',
      },
      {
        name: 'Yangtze at Chongqing',
        description:
          'The mountain city where the Jialing meets the Yangtze — a hinge between upper gorges and the regulated middle basin.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Yangtze River',
        url: 'https://www.britannica.com/place/Yangtze-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Three Gorges',
        url: 'https://earthobservatory.nasa.gov/images/147371/three-gorges-dam',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Three Gorges Dam, China',
        url: 'https://earthobservatory.nasa.gov/images/77572/three-gorges-dam-china',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'ganges',
    code: 'GNG',
    name: 'Ganges',
    category: 'Asia',
    subtitle: 'Sacred plain · Bay of Bengal delta',
    about:
      'The Ganges rises in the Himalaya and flows southeast across the densely farmed northern Indian plain. It is regarded as sacred in Hindu tradition, with ghats and temples lining parts of its course. Seasonal monsoon flooding reshapes floodplains, embankments, and sandbars along the river.\nIn its lower reaches, the Ganges joins the Brahmaputra system in a vast delta shared by India and Bangladesh on the Bay of Bengal. Its braided channels, wetlands, and tidal waterways form one of the world’s largest wetland mosaics.',
    facts: {
      kind: 'Continental river',
      course: 'Himalayan sources → Indo-Gangetic Plain → Bengal delta → Bay of Bengal',
      region: 'South Asia · Ganges–Brahmaputra system',
      basin: 'Major Himalayan-fed drainage shared across India and Bangladesh with dense tributary networks',
      hydrology: 'Strong monsoon flood pulse; snow and glacier melt contribute to the upper regime',
      climateRole: 'Agricultural water spine of the northern plain; delta sediment and cyclone-exposed wetlands',
      exploreLinks: ['India', 'Bangladesh', 'Nepal'],
    },
    features: [
      {
        name: 'Ganges at Varanasi',
        description:
          'The classic ghat waterfront — steps, boats, and temples that stage the river as sacred urban geography.',
      },
      {
        name: 'Varanasi boats',
        description:
          'Working and pilgrimage craft on the evening river — daily traffic that keeps the waterfront alive.',
      },
      {
        name: 'Ganges Delta',
        description:
          'The Bay of Bengal outlet’s channel maze — sediment, mangroves, and shared India–Bangladesh hydrology.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ganges River',
        url: 'https://www.britannica.com/place/Ganges-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Ganges River Delta',
        url: 'https://earthobservatory.nasa.gov/images/147255/ganges-river-delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — The Sundarbans',
        url: 'https://whc.unesco.org/en/list/798',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mekong',
    code: 'MEK',
    name: 'Mekong',
    category: 'Asia',
    subtitle: 'Mainland Southeast Asia · monsoon pulse',
    about:
      'The Mekong is a major north–south river of Mainland Southeast Asia. It rises on the Tibetan Plateau and flows through China, Myanmar, Laos, Thailand, Cambodia, and Vietnam before dividing across a fertile delta in southern Vietnam. Its upper and middle reaches include gorges, rapids, and sandbars, while lower reaches spread across broad floodplains.\nSeasonal monsoon flows shape livelihoods along the river. In Cambodia, the Mekong’s flood pulse reverses the flow of the Tonlé Sap River and expands Tonlé Sap, the country’s large freshwater lake. The Vietnamese delta is a network of canals, orchards, and rice-growing land. Dams and irrigation projects along the basin are changing river flows and sediment movement.',
    facts: {
      kind: 'Continental river',
      course: 'Tibetan Plateau sources → mainland Southeast Asian corridor → Mekong Delta → South China Sea',
      region: 'Mainland Southeast Asia',
      basin: 'Multinational basin; Tonlé Sap as a major seasonal storage and fishery hinge',
      hydrology: 'Monsoon flood pulse; Tonlé Sap flow reversal; increasing reservoir regulation upstream',
      climateRole: 'Rice-bowl freshwater and sediment engine; wetland and fishery backbone of the lower basin',
      exploreLinks: ['China', 'Myanmar', 'Laos', 'Thailand', 'Cambodia', 'Vietnam'],
    },
    features: [
      {
        name: 'Mekong at Luang Prabang',
        description:
          'The middle-course waterfront under limestone hills — boats and banks that stage the Lao corridor.',
      },
      {
        name: 'Tonlé Sap',
        description:
          'Cambodia’s great lake and flood pulse — a seasonal reservoir that expands and contracts with the Mekong.',
      },
      {
        name: 'Mekong Delta',
        description:
          'Vietnam’s canal-and-orchard outlet — where the river fragments into distributaries toward the sea.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mekong River',
        url: 'https://www.britannica.com/place/Mekong-River',
        kind: 'reference',
      },
      {
        label: 'MRC — Mekong River Commission',
        url: 'https://www.mrcmekong.org/',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Town of Luang Prabang',
        url: 'https://whc.unesco.org/en/list/479',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'yellow-river',
    code: 'YLW',
    name: 'Yellow River',
    category: 'Asia',
    subtitle: 'Loess sediment · North China plain',
    about:
      'The Yellow River, or Huang He, rises on the Tibetan Plateau and flows across the Loess Plateau before crossing the North China Plain to a delta on the Bohai Sea. Its water is colored by large amounts of yellow loess sediment carried from the plateau, giving the river its name.\nAt Hukou, the river is compressed into a narrow reach that forms a major waterfall. Across the North China Plain, long-built levees have in places raised the river channel above surrounding farmland, reflecting the river’s heavy sediment load and history of flooding. At its mouth, sediment and coastal processes continually build and reshape the Bohai Sea delta.',
    facts: {
      kind: 'Continental river',
      course: 'Qinghai–Tibet headwaters → Loess Plateau → North China Plain → Bohai Sea delta',
      region: 'Northern China · Huang He basin',
      basin: 'Major northern Chinese drainage; extreme sediment load from loess landscapes',
      hydrology: 'Seasonal floods and droughts; heavy engineering for levees, reservoirs, and diversion',
      climateRole: 'Sediment conveyor that built and threatens the North China Plain; delta land-building engine',
      exploreLinks: ['China'],
    },
    features: [
      {
        name: 'Hukou Waterfall',
        description:
          'Where the Yellow River compresses through a stone gate — a loud, sediment-yellow cascade on the middle course.',
      },
      {
        name: 'Yellow River at Lanzhou',
        description:
          'An upper–middle urban reach — bridges and embankments where the loess-colored river meets a major city.',
      },
      {
        name: 'Yellow River Delta',
        description:
          'The Bohai outlet’s growing and shifting wetland — sediment geometry visible from above.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Yellow River',
        url: 'https://www.britannica.com/place/Yellow-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Yellow River Delta',
        url: 'https://earthobservatory.nasa.gov/images/147372/building-up-the-yellow-river-delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — The Grand Canal',
        url: 'https://whc.unesco.org/en/list/1443',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'indus',
    code: 'IND',
    name: 'Indus',
    category: 'Asia',
    subtitle: 'Himalayan source · Arabian Sea delta',
    about:
      'The Indus is South Asia’s western great river. It rises in the Tibetan and Himalayan highlands, flows through the mountains of northern Pakistan, and then crosses the Indus plain to a delta on the Arabian Sea. Its northern course includes deep gorges and major confluences, while its lower course runs through an alluvial plain shaped by irrigation canals and intensive agriculture.\nThe river’s waters and sediments have supported civilizations and later modern states across the plain. At its mouth, the Indus forms a sediment-rich delta influenced by monsoon rainfall, river discharge, tides, and coastal processes.',
    facts: {
      kind: 'Continental river',
      course: 'Himalayan/Tibetan sources → northern mountain corridor → Indus plain → Arabian Sea delta',
      region: 'South Asia · Indus Basin',
      basin: 'Major western South Asian drainage shared across highland and plain states',
      hydrology: 'Snow and glacier melt plus monsoon rains; extensive modern canal diversion',
      climateRole: 'Irrigation spine of the Indus plain; delta sediment and coastal wetland engine',
      exploreLinks: ['Pakistan', 'India', 'China'],
    },
    features: [
      {
        name: 'Indus near Leh',
        description:
          'The high upper valley under mountain light — where the young Indus still reads as a highland river.',
      },
      {
        name: 'Indus in Pakistan',
        description:
          'Colored sediment and working reaches of the middle–lower corridor — the plain’s structural waterway.',
      },
      {
        name: 'Indus Delta',
        description:
          'The Arabian Sea outlet’s channel fan — sediment geometry where the river meets the northwest Indian Ocean.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Indus River',
        url: 'https://www.britannica.com/place/Indus-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Indus River and Delta',
        url: 'https://earthobservatory.nasa.gov/images/92867/indus-river-and-delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Archaeological Ruins at Moenjodaro',
        url: 'https://whc.unesco.org/en/list/138',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'lena',
    code: 'LEN',
    name: 'Lena',
    category: 'Asia',
    subtitle: 'Siberian trunk · Arctic delta',
    about:
      'The Lena is a major north-flowing river of Siberia. It rises near the approaches to Lake Baikal and runs north through taiga and permafrost landscapes before reaching a vast branching delta on the Laptev Sea in the Arctic Ocean. Its course includes the limestone cliffs of the Lena Pillars and passes the city of Yakutsk.\nThe river freezes and thaws in step with the polar year, especially across its Arctic delta. Compared with the temperate continental rivers farther south, the Lena is defined by its cold-climate setting, long Siberian course, rock-cut reaches, and Arctic outlet.',
    facts: {
      kind: 'Continental river',
      course: 'Central Siberian sources → Yakutian trunk → Laptev Sea delta',
      region: 'Eastern Siberia · Lena Basin',
      basin: 'One of Russia’s largest Arctic-draining basins; permafrost-dominated catchment',
      hydrology: 'Strong spring ice breakup floods; long winter ice cover; limited human regulation',
      climateRole: 'Arctic freshwater and sediment conveyor; permafrost and delta wetland indicator',
      exploreLinks: ['Russia'],
    },
    features: [
      {
        name: 'Lena Pillars',
        description:
          'Towering limestone cliffs along the middle Lena — a rock gallery that frames the Siberian trunk.',
      },
      {
        name: 'Lena near Yakutsk',
        description:
          'The broad working reach beside Sakha’s capital — a cold-climate river city on the great northbound stem.',
      },
      {
        name: 'Lena Delta',
        description:
          'The Laptev Sea outlet’s branching wetland — one of the Arctic’s largest river deltas.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Lena River',
        url: 'https://www.britannica.com/place/Lena-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Lena Pillars Nature Park',
        url: 'https://whc.unesco.org/en/list/1299',
        kind: 'catalog',
      },
      {
        label: 'NASA Earth Observatory — Lena River Delta',
        url: 'https://earthobservatory.nasa.gov/images/14768/lena-river-delta',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'amur',
    code: 'AMU',
    name: 'Amur',
    category: 'Asia',
    subtitle: 'Russia–China border · Pacific outlet',
    about:
      'The Amur, also known as the Heilong Jiang, is a major East Asian river that rises in Mongolia and northeastern China, forms much of the border between Russia and China, and reaches the Pacific near Nikolaevsk-on-Amur. Heihe in China faces Blagoveshchensk in Russia across its waters. Its lower and middle reaches pass timber and fishing towns in the Russian Far East, while its broad basin includes extensive forests and floodplains that freeze deeply in winter. The Amur is among the world’s longest major rivers with relatively few dams, and its course reflects the hydrology of Siberia and Manchuria as well as the geography of the Russia–China frontier.',
    facts: {
      kind: 'Continental river',
      course: 'Mongolian/Chinese headwaters → Russia–China border corridor → Russian Far East → Sea of Okhotsk approaches',
      region: 'Northeast Asia · Amur Basin',
      basin: 'Shared Russian–Chinese drainage; Ussuri and Songhua as major tributary systems',
      hydrology: 'Snowmelt-dominated spring floods; long winter ice cover; limited main-stem damming',
      climateRole: 'Taiga freshwater corridor; Pacific salmon and wetland habitats at the outlet',
      exploreLinks: ['Russia', 'China'],
    },
    features: [
      {
        name: 'Amur at Heihe',
        description:
          'The China–Russia border reach — twin riverfront cities facing each other across the main stem.',
      },
      {
        name: 'Amur near Amursk',
        description:
          'A working Russian Far East town reach — timber, fishing, and floodplain life on the middle course.',
      },
      {
        name: 'Khabarovsk riverfront',
        description:
          'The regional capital’s embankment — where the Amur becomes a civic waterfront in the Russian east.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Amur River',
        url: 'https://www.britannica.com/place/Amur-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Autumn Along the Amur',
        url: 'https://earthobservatory.nasa.gov/images/145707/autumn-along-the-amur',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Central Sikhote-Alin',
        url: 'https://whc.unesco.org/en/list/766',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'brahmaputra',
    code: 'BRH',
    name: 'Brahmaputra',
    category: 'Asia',
    subtitle: 'Himalayan gorge · Bengal delta',
    about:
      'The Brahmaputra is a major eastern Himalayan river in South Asia. It rises on the Tibetan Plateau as the Yarlung Tsangpo, descends through Himalayan gorges, crosses the Assam plain past Guwahati, and enters Bangladesh, where its lower braided channels join the Ganges in the Bengal delta. Its flow and sediment load are strongly shaped by the monsoon, producing large seasonal floods across Assam and the lower basin. Dams and embankments along the river system are altering water flow and sediment movement.',
    facts: {
      kind: 'Continental river',
      course: 'Tibetan Plateau (Yarlung Tsangpo) → Assam gorge → Indo-Bangladesh plain → Bay of Bengal delta',
      region: 'South Asia · Brahmaputra–Ganges system',
      basin: 'Major Himalayan-fed drainage shared across China, India, and Bangladesh',
      hydrology: 'Strong monsoon flood pulse; snow and glacier melt on the upper course',
      climateRole: 'Eastern plain freshwater and sediment engine; delta wetland and cyclone-exposed coast',
      exploreLinks: ['India', 'Bangladesh', 'China'],
    },
    features: [
      {
        name: 'Brahmaputra boat view',
        description:
          'Working river traffic on the broad Assam channel — boats that stage the Brahmaputra as daily transport.',
      },
      {
        name: 'Brahmaputra at Guwahati',
        description:
          'The Assam capital’s riverfront — bridges and ghats where the gorge country opens onto the plain.',
      },
      {
        name: 'Yarlung Tsangpo',
        description:
          'The high Tibetan source reach — where the Brahmaputra still reads as a plateau river under mountain light.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Brahmaputra River',
        url: 'https://www.britannica.com/place/Brahmaputra-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Ganges River Delta',
        url: 'https://earthobservatory.nasa.gov/images/147255/ganges-river-delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — The Sundarbans',
        url: 'https://whc.unesco.org/en/list/798',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'irrawaddy',
    code: 'IRR',
    name: 'Irrawaddy',
    category: 'Asia',
    subtitle: 'Myanmar main stem · Andaman delta',
    about:
      'The Irrawaddy, also called the Ayeyarwady, is Myanmar’s principal north–south river. It rises in the Himalayan approaches, flows through the dry central basin, and reaches the Andaman Sea through a broad delta. Its course has long formed a main axis of settlement and transport in Myanmar.\nAlong the central river, Bagan’s temple plains stand near the water, while Sagaing’s monastery-covered hills rise on the west bank. Seasonal floods reshape sandbars and inundate rice plains, especially toward the delta.',
    facts: {
      kind: 'Continental river',
      course: 'Himalayan approaches → central Myanmar basin → Andaman Sea delta',
      region: 'Southeast Asia · Irrawaddy Basin',
      basin: 'Myanmar’s principal drainage; Chindwin as a major western tributary',
      hydrology: 'Monsoon flood pulse; seasonal sandbars and shifting channels on the lower course',
      climateRole: 'Central plain freshwater and sediment corridor; delta rice and wetland engine',
      exploreLinks: ['Myanmar'],
    },
    features: [
      {
        name: 'Irrawaddy at Bagan',
        description:
          'The classic temple-plain reach — pagodas and river light that stage Myanmar’s historic heartland.',
      },
      {
        name: 'Sagaing shore',
        description:
          'Monastery hills above the west bank — a sacred waterfront on the middle Irrawaddy.',
      },
      {
        name: 'Bagan riverside temple',
        description:
          'A stupa at the water’s edge — where the Irrawaddy and temple geography meet in one frame.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Irrawaddy River',
        url: 'https://www.britannica.com/place/Irrawaddy-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Monsoon Transforms the Irrawaddy River',
        url: 'https://earthobservatory.nasa.gov/images/51633/monsoon-transforms-the-irrawaddy-river',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Pyu Ancient Cities',
        url: 'https://whc.unesco.org/en/list/1444',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'euphrates',
    code: 'EUP',
    name: 'Euphrates',
    category: 'Asia',
    subtitle: 'Mesopotamian west stem · Shatt al-Arab',
    about:
      'The Euphrates is the western of Mesopotamia’s two great rivers. It rises in eastern Anatolia in Türkiye, flows through Syria and Iraq, and joins the Tigris to form the Shatt al-Arab, which reaches the Persian Gulf. Its upper course includes the deep gorge near Kemaliye, while its Syrian course is regulated by reservoirs including Lake Assad. Farther downstream, the river crosses irrigated plains where ancient and modern societies have drawn water from the same channel. Dams, reservoirs, and diversion works have substantially altered its historic flood regime.',
    facts: {
      kind: 'Continental river',
      course: 'Anatolian highlands → Syrian plateau → Iraqi plain → Shatt al-Arab → Persian Gulf',
      region: 'Western Asia · Mesopotamia',
      basin: 'Shared Türkiye–Syria–Iraq drainage; major tributaries feed the Syrian and Iraqi plain',
      hydrology: 'Snowmelt and winter rainfall in the headwaters; heavily regulated by large dams and reservoirs',
      climateRole: 'Desert-edge irrigation spine; cradle-of-civilization freshwater corridor',
      exploreLinks: ['Türkiye', 'Syria', 'Iraq'],
    },
    features: [
      {
        name: 'Euphrates canyon road',
        description:
          'Kemaliye’s dramatic gorge reach — where the Euphrates cuts a canyon through eastern Anatolia.',
      },
      {
        name: 'Euphrates in Turkey',
        description:
          'The upper–middle stem in Türkiye — working water between gorge country and the regulated plain.',
      },
      {
        name: 'Lake Assad',
        description:
          'Syria’s great Euphrates reservoir — a modern hydraulic hinge on the middle course.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Euphrates River',
        url: 'https://www.britannica.com/place/Euphrates-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Mesopotamian Marshes',
        url: 'https://earthobservatory.nasa.gov/images/2240/mesopotamian-marshes',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Ahwar of Southern Iraq',
        url: 'https://whc.unesco.org/en/list/1481',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'tigris',
    code: 'TIG',
    name: 'Tigris',
    category: 'Asia',
    subtitle: 'Mesopotamian east stem · Baghdad corridor',
    about:
      'The Tigris is Mesopotamia’s eastern major river. It rises in the gorge country of eastern Anatolia, flows southeast through Iraq, and joins the Euphrates at the head of the Persian Gulf. Along its course are Mosul, with its historic crossings on the upper river, and Baghdad, which extends along both banks.\nThe river waters the irrigated Mesopotamian plain, a region associated with the rise of early urban civilization. Dams and upstream water use have reduced the Tigris’s historic flood pulse.',
    facts: {
      kind: 'Continental river',
      course: 'Anatolian highlands → Syrian–Iraqi border approaches → Iraqi plain → Shatt al-Arab',
      region: 'Western Asia · Mesopotamia',
      basin: 'Shared Türkiye–Syria–Iraq drainage; shorter and steeper than the parallel Euphrates',
      hydrology: 'Snowmelt headwaters; seasonal floods moderated by dams and irrigation offtakes',
      climateRole: 'Mesopotamian irrigation and urban water spine; delta wetland at the Gulf outlet',
      exploreLinks: ['Iraq', 'Türkiye', 'Syria'],
    },
    features: [
      {
        name: 'Tigris from Al Shohada Bridge',
        description:
          'A capital crossing on the Baghdad reach — bridges that stage the Tigris as civic geography.',
      },
      {
        name: 'Tigris at Mosul',
        description:
          'The upper Iraqi waterfront — historic bridges and embankments on the northern plain.',
      },
      {
        name: 'Tigris through Baghdad',
        description:
          'The river as an urban spine — embankments and districts stretched along both banks of the capital.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Tigris-Euphrates river system',
        url: 'https://www.britannica.com/place/Tigris-Euphrates-river-system',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Mesopotamian Marshes',
        url: 'https://earthobservatory.nasa.gov/images/2240/mesopotamian-marshes',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Ahwar of Southern Iraq',
        url: 'https://whc.unesco.org/en/list/1481',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'danube',
    code: 'DAN',
    name: 'Danube',
    category: 'Europe, Americas & Oceania',
    subtitle: 'European corridor · Black Sea delta',
    about:
      'The Danube is a major west-to-east river of Central and Southeastern Europe. It rises in Germany, crosses or forms borders between numerous states, and reaches the Black Sea through a broad delta of wetlands and channels. Its course connects the Alpine region, the Pannonian Basin, and the Balkans, passing capital cities that face or straddle its banks.\nA notable constriction along the river is the Iron Gates gorge on the Serbia–Romania border. For centuries, the Danube has served as a route for barge traffic, trade, diplomacy, and political boundaries, linking regions with distinct historical and cultural landscapes.',
    facts: {
      kind: 'Continental river',
      course: 'Black Forest sources → Central European corridor → Iron Gates → Black Sea delta',
      region: 'Central & Southeastern Europe',
      basin: 'Second-largest European river basin; multinational main stem and tributaries',
      hydrology: 'Alpine and lowland flood regimes; heavily engineered locks and hydropower reaches',
      climateRole: 'Transcontinental freshwater corridor; delta wetlands of continental conservation importance',
      exploreLinks: ['Germany', 'Austria', 'Slovakia', 'Hungary', 'Romania'],
    },
    features: [
      {
        name: 'Danube at Budapest',
        description:
          'The river as urban spine — bridges and embankments that stage one of Europe’s classic capital waterfronts.',
      },
      {
        name: 'Iron Gates',
        description:
          'The gorge where the Danube cuts the Carpathians — a historic navigation choke point now paired with hydropower.',
      },
      {
        name: 'Danube Delta',
        description:
          'The Black Sea outlet’s wetland labyrinth — channels, lakes, and reed beds at the end of the European corridor.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Danube River',
        url: 'https://www.britannica.com/place/Danube-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Danube Delta',
        url: 'https://whc.unesco.org/en/list/588',
        kind: 'catalog',
      },
      {
        label: 'ICPDR — Danube River Basin',
        url: 'https://www.icpdr.org/danube-basin',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'rhine',
    code: 'RHN',
    name: 'Rhine',
    category: 'Europe, Americas & Oceania',
    subtitle: 'Alpine source · industrial corridor',
    about:
      'The Rhine is a major north-flowing river of Western Europe. It rises in the Alps, passes over the Rhine Falls, flows through the Middle Rhine gorge, and continues through industrial and port landscapes toward the North Sea. Its course includes the Loreley cliffs, where the river narrows and barge traffic passes through a confined section of the gorge.\nCities including Cologne face the Rhine as a central civic and commercial waterfront. Farther downstream, the river enters a Dutch delta shaped by flood-control works and shipping infrastructure before reaching the North Sea. The Rhine has long served as a major corridor for trade, industry, and inland navigation.',
    facts: {
      kind: 'Continental river',
      course: 'Alpine sources → Rhine Falls → Upper/Middle Rhine → Lower Rhine → North Sea delta',
      region: 'Western Europe · Rhine corridor',
      basin: 'Major Central European drainage shared across Alpine and lowland states',
      hydrology: 'Alpine melt and rainfall regime; dense locks, canals, and flood defenses on the lower course',
      climateRole: 'Industrial and agricultural freshwater artery; North Sea sediment and flood-risk hinge',
      exploreLinks: [
        'Switzerland',
        'Liechtenstein',
        'Austria',
        'Germany',
        'France',
        'Netherlands',
      ],
    },
    features: [
      {
        name: 'Loreley',
        description:
          'The Middle Rhine slate cliff — a navigation narrows that became Europe’s emblematic river gorge.',
      },
      {
        name: 'Rhine Falls',
        description:
          'Europe’s powerful lowland waterfall near Schaffhausen — where the upper Rhine drops in a broad curtain.',
      },
      {
        name: 'Rhine at Cologne',
        description:
          'Cathedral, bridges, and embankments on the lower corridor — the river as a German civic waterfront.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Rhine River',
        url: 'https://www.britannica.com/place/Rhine-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Upper Middle Rhine Valley',
        url: 'https://whc.unesco.org/en/list/1066',
        kind: 'catalog',
      },
      {
        label: 'ICPR — International Commission for the Protection of the Rhine',
        url: 'https://www.iksr.org/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'volga',
    code: 'VLG',
    name: 'Volga',
    category: 'Europe, Americas & Oceania',
    subtitle: 'European Russia · Caspian delta',
    about:
      'The Volga is Europe’s longest river, flowing north to south across European Russia and ending in a branching delta in the northern shallows of the Caspian Sea. Much of its middle course has been altered by a cascade of dams and reservoirs, creating linked stretches of broad water. Historic cities, including Nizhny Novgorod, developed along the river and at major confluences. For centuries, the Volga connected the forest regions of northern Russia, the steppe, and the trading networks of the Caspian basin. Its lower delta forms an extensive wetland before the river reaches the Caspian Sea.',
    facts: {
      kind: 'Continental river',
      course: 'Valdai Hills sources → reservoir cascade → lower steppe reach → Caspian delta',
      region: 'European Russia · Volga basin',
      basin: 'Europe’s largest river basin by length of main stem; dense tributary network across the plain',
      hydrology: 'Snowmelt floods historically; now heavily regulated by large reservoirs and locks',
      climateRole: 'Interior freshwater corridor; Caspian sediment and wetland ecology at the outlet',
      exploreLinks: ['Russia'],
    },
    features: [
      {
        name: 'Volga at Nizhny Novgorod',
        description:
          'The Oka–Volga confluence city — a historic hinge where forest-zone trade met the great southbound stem.',
      },
      {
        name: 'Volga mainstream',
        description:
          'Broad reservoir-era reaches of the middle river — working water that reads as inland sea as much as channel.',
      },
      {
        name: 'Volga Delta',
        description:
          'The Caspian outlet’s branching wetland — channels and islands at the end of Europe’s longest river.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Volga River',
        url: 'https://www.britannica.com/place/Volga-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Volga Delta',
        url: 'https://earthobservatory.nasa.gov/images/9203/volga-delta-russia',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Bolgar Historical and Archaeological Complex',
        url: 'https://whc.unesco.org/en/list/981',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'amazon',
    code: 'AMZ',
    name: 'Amazon',
    category: 'Europe, Americas & Oceania',
    subtitle: 'Rainforest basin · Atlantic discharge',
    about:
      'The Amazon is a continental rainforest river system whose main stem and tributaries drain a vast South American lowland into the Atlantic Ocean. Its waters include blackwater and whitewater rivers that meet at major confluences, while seasonal floodplains known as várzea expand and contract with annual flooding. At its mouth, the river is so wide that its freshwater influence extends far offshore.\nThe Amazon basin stores carbon and supports biodiversity on a planetary scale. Navigation routes and cities including Manaus lie within a river landscape shaped by active channels, floodplains, forests, and seasonal hydrology.',
    facts: {
      kind: 'Continental river',
      course: 'Andean and shield sources → Amazonian lowland → Atlantic mouth',
      region: 'Amazon Basin · northern South America',
      basin: 'World’s largest drainage by discharge; dense tributary network across multiple countries',
      hydrology: 'Seasonal flood pulse across várzea and igapó; enormous mean discharge into the Atlantic',
      climateRole: 'Rainforest moisture recycling; global carbon and biodiversity reservoir',
      exploreLinks: ['Brazil', 'Peru', 'Colombia', 'Bolivia', 'Ecuador'],
    },
    features: [
      {
        name: 'Amazon mainstream',
        description:
          'The broad lowland channel under continuous forest — the working artery of the basin’s interior.',
      },
      {
        name: 'Amazon mouth',
        description:
          'The Atlantic outlet and sediment plume — where continental freshwater meets the open ocean.',
      },
      {
        name: 'Amazon from orbit',
        description:
          'Satellite-scale meanders and floodplain mosaics — the basin’s geometry visible as one system.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Amazon River',
        url: 'https://www.britannica.com/place/Amazon-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Amazon',
        url: 'https://earthobservatory.nasa.gov/world-of-change/Amazon',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Central Amazon Conservation Complex',
        url: 'https://whc.unesco.org/en/list/998',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mississippi',
    code: 'MIS',
    name: 'Mississippi',
    category: 'Europe, Americas & Oceania',
    subtitle: 'Interior artery · Gulf delta',
    about:
      'The Mississippi River is the central arterial river of the contiguous United States, collecting the Missouri and Ohio river systems before flowing south to a delta on the Gulf of Mexico. Its locks, dams, levees, and navigation channels support barge commerce and flood control across much of the interior, linking major agricultural, industrial, and port regions.\nThe upper river passes through bluff country and broad bottomlands, while the lower river carries sediment toward the Gulf. At its delta, land is continually built, reshaped, and lost as river sediment, coastal erosion, subsidence, storms, and sea-level rise interact.',
    facts: {
      kind: 'Continental river',
      course: 'Northern interior sources → midcontinent confluence zone → Gulf of Mexico delta',
      region: 'Central United States · Mississippi Basin',
      basin: 'One of North America’s largest basins; Missouri and Ohio as principal tributary systems',
      hydrology: 'Snowmelt and rainfall floods; extensive locks, dams, and levees reshape the modern regime',
      climateRole: 'Interior sediment and nutrient conveyor; Gulf hypoxia and delta land-building dynamics',
      exploreLinks: ['United States'],
    },
    features: [
      {
        name: 'Mississippi barges',
        description:
          'Towboats and barge trains on the working trunk — commerce that treats the river as a continental highway.',
      },
      {
        name: 'Upper Mississippi',
        description:
          'Bluff-lined reaches and floodplain refuges of the upper river — a slower, scenic contrast to the engineered lower stem.',
      },
      {
        name: 'Mississippi Delta',
        description:
          'The Gulf outlet’s bird’s-foot and wetland mosaic — where the river’s sediment meets coastal processes.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mississippi River',
        url: 'https://www.britannica.com/place/Mississippi-River',
        kind: 'reference',
      },
      {
        label: 'USGS — Mississippi River',
        url: 'https://www.usgs.gov/mission-areas/water-resources/science/mississippi-river',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Mississippi River Delta',
        url: 'https://earthobservatory.nasa.gov/images/144255/the-mississippi-river-delta',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'parana',
    code: 'PRN',
    name: 'Paraná',
    category: 'Europe, Americas & Oceania',
    subtitle: 'La Plata system · Iguaçu hinge',
    about:
      'The Paraná is South America’s second-largest river system after the Amazon. It rises on the Brazilian Plateau, receives the Iguaçu River, and flows south through Brazil, Paraguay, and Argentina toward the Río de la Plata estuary, which it shares with the Uruguay River.\nIts basin includes Iguaçu Falls on a major tributary, broad subtropical floodplains, and sediment-rich lowland channels. The river supports major hydropower installations and barge traffic, particularly along reaches shared by Brazil, Paraguay, and Argentina, and is a principal component of the La Plata drainage system.',
    facts: {
      kind: 'Continental river',
      course: 'Brazilian plateau sources → Iguaçu confluence zone → Paraguay–Argentina corridor → Río de la Plata',
      region: 'South America · Paraná–La Plata basin',
      basin: 'Major subtropical drainage; Paraguay River as a key tributary system',
      hydrology: 'Seasonal floods on a wide floodplain; large hydropower reservoirs on the main stem and tributaries',
      climateRole: 'Subtropical sediment and freshwater conveyor into the Río de la Plata',
      exploreLinks: ['Brazil', 'Argentina', 'Paraguay', 'Uruguay'],
    },
    features: [
      {
        name: 'Paraná mainstream',
        description:
          'Broad lowland water under evening light — the working subtropical trunk of the La Plata system.',
      },
      {
        name: 'Iguaçu Falls',
        description:
          'The great cataract on the Iguaçu tributary — a thunderous hinge near the Paraná confluence.',
      },
      {
        name: 'Iguazú–Paraná confluence',
        description:
          'Where the Iguazú meets the Paraná — a three-country corner of channels, forest, and border geography.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Paraná River',
        url: 'https://www.britannica.com/place/Parana-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Iguaçu National Park',
        url: 'https://whc.unesco.org/en/list/303',
        kind: 'catalog',
      },
      {
        label: 'NASA Earth Observatory — Fires along the Paraná',
        url: 'https://earthobservatory.nasa.gov/images/147068/fires-along-the-parana-river',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'murray-darling',
    code: 'MUR',
    name: 'Murray–Darling',
    category: 'Europe, Americas & Oceania',
    subtitle: 'Australian inland basin · dryland rivers',
    about:
      'The Murray–Darling is Australia’s largest river system, a network of inland rivers draining much of southeastern Australia toward the Southern Ocean through the Murray mouth. The Murray forms the main stem, while the Darling is a long, intermittent tributary from the west. Its basin is shaped by a dryland hydrological regime in which irrigation demand, drought, and flood pulses draw on a limited water supply. Towns including Yarrawonga on the Murray and Wilcannia on the Darling lie along working river reaches that may be high in flood periods or close to empty during drought.',
    facts: {
      kind: 'Dryland river system',
      course: 'Southeastern Australian highlands and plains → Murray main stem → Southern Ocean mouth',
      region: 'Southeastern Australia · Murray–Darling Basin',
      basin: 'Australia’s largest drainage basin; Darling and many tributaries with highly variable flow',
      hydrology: 'Extreme wet–dry variability; heavy irrigation diversion; intermittent western tributaries',
      climateRole: 'Dryland agriculture water spine; drought and flood indicator for southeastern Australia',
      exploreLinks: ['Australia'],
    },
    features: [
      {
        name: 'Murray at Yarrawonga',
        description:
          'A tree-lined Murray reach on the Victoria–New South Wales border — the working main stem of the basin.',
      },
      {
        name: 'Darling River',
        description:
          'The long western tributary under open sky — a classic dryland channel that can shrink to pools between floods.',
      },
      {
        name: 'Darling at Wilcannia',
        description:
          'A historic Darling town reach — where outback settlement still depends on an intermittent river.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Murray River',
        url: 'https://www.britannica.com/place/Murray-River',
        kind: 'reference',
      },
      {
        label: 'Murray–Darling Basin Authority',
        url: 'https://www.mdba.gov.au/',
        kind: 'agency',
      },
      {
        label: 'Geoscience Australia — Murray–Darling Basin',
        url: 'https://www.ga.gov.au/scientific-topics/national-location-information/landforms/murray-darling-basin',
        kind: 'agency',
      },
    ],
  },
]

export const riverSubjects: RiverSubject[] = riverSubjectDrafts.map(withPhotos)

export function riverSubjectSlugs(): string[] {
  return riverSubjects.map((subject) => subject.slug)
}

export function getRiverSubject(slug: string): RiverSubject | undefined {
  return riverSubjects.find((subject) => subject.slug === slug)
}

export function riverSubjectsByCategory(): [string, RiverSubject[]][] {
  const order: string[] = []
  const groups = new Map<string, RiverSubject[]>()
  for (const subject of riverSubjects) {
    if (!groups.has(subject.category)) {
      order.push(subject.category)
      groups.set(subject.category, [])
    }
    groups.get(subject.category)!.push(subject)
  }
  return order.map((category) => [category, groups.get(category)!])
}

export function riverDescription(subject: RiverSubject): string {
  return subject.about
}

export function riverFeaturedPhoto(subject: RiverSubject): RiverPhoto {
  return subject.photos[0]
}
