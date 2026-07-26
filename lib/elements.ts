/** Elements topic — evergreen field-guide records for high-signal chemical elements. */

import elementPhotos from '~/content/element-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface ElementFeature {
  name: string
  description: string
}

export interface ElementSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface ElementFacts {
  /** Atomic number (Z). */
  atomicNumber: number
  /** Chemical symbol. */
  symbol: string
  /** Period (row) on the periodic table. */
  period: number
  /** Group label (IUPAC family or block note). */
  group: string
  /** Standard state at STP (evergreen textbook convention). */
  standardState: string
}

export interface ElementPhoto extends StaticPhoto {
  commonsFile: string
}

export interface ElementSubject {
  slug: string
  code: string
  name: string
  category: string
  subtitle: string
  about: string
  facts: ElementFacts
  features: [ElementFeature, ElementFeature, ElementFeature]
  sources: ElementSource[]
  photo: ElementPhoto
}

type ElementSubjectDraft = Omit<ElementSubject, 'photo'>

const photoManifest = elementPhotos as Record<string, ElementPhoto>

function withPhoto(draft: ElementSubjectDraft): ElementSubject {
  const photo = photoManifest[draft.slug]
  if (!photo) {
    throw new Error(`Missing element photo for ${draft.slug}`)
  }
  return { ...draft, photo }
}

const elementSubjectDrafts: ElementSubjectDraft[] = [
  {
    slug: 'hydrogen',
    code: 'H',
    name: 'Hydrogen',
    category: 'Nonmetals',
    subtitle: 'Z = 1 · H · gas',
    about:
      'Hydrogen is the lightest element and the most abundant baryonic matter in the universe. On Earth it is bound in water, hydrocarbons, and living tissue more often than it appears as free H₂. A discharge tube shows the Balmer lines that helped map its spectrum; stars fuse hydrogen into helium in their cores. Orientation here stays with abundance, bonding, and spectrum — not fuel-market headlines.',
    facts: {
      atomicNumber: 1,
      symbol: 'H',
      period: 1,
      group: '1 (hydrogen)',
      standardState: 'Gas',
    },
    features: [
      {
        name: 'Lightest nucleus',
        description:
          'A single proton (and usually one electron) makes H the smallest atom and a ubiquitous building block.',
      },
      {
        name: 'Water and organics',
        description:
          'Most terrestrial hydrogen is locked in H₂O and C–H frameworks rather than free gas.',
      },
      {
        name: 'Stellar fuel',
        description:
          'Main-sequence stars fuse hydrogen; the element’s cosmic abundance dwarfs its crustal share.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'NIST Chemistry WebBook',
        url: 'https://webbook.nist.gov/chemistry/',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'carbon',
    code: 'C',
    name: 'Carbon',
    category: 'Nonmetals',
    subtitle: 'Z = 6 · C · solid',
    about:
      'Carbon sits at the center of organic chemistry because it forms stable chains and rings with itself and with H, O, N, and others. Diamond, graphite, and glassy carbon show how the same element can be transparent insulator or soft conductor depending on bonding. Life’s biomass, fossil fuels, and atmospheric CO₂ are all carbon reservoirs; this guide emphasizes structure and allotropes, not annual emissions tallies.',
    facts: {
      atomicNumber: 6,
      symbol: 'C',
      period: 2,
      group: '14',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Catenation',
        description:
          'Carbon–carbon bonds knit long chains and rings that underlie polymers and biomolecules.',
      },
      {
        name: 'Allotropes',
        description:
          'Diamond, graphite, fullerenes, and related forms differ in bonding network and properties.',
      },
      {
        name: 'Biosphere backbone',
        description:
          'Living cells build scaffolds from carbon; geology cycles the element through rock and air.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Carbon',
        url: 'https://www.rsc.org/periodic-table/element/6/carbon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nitrogen',
    code: 'N',
    name: 'Nitrogen',
    category: 'Nonmetals',
    subtitle: 'Z = 7 · N · gas',
    about:
      'Nitrogen makes up most of dry air as N₂, a triple-bonded molecule that is chemically quiet until fixed into ammonia, nitrates, or organics. Proteins and nucleic acids depend on that fixed nitrogen. Lightning, microbes, and industry all open the triple bond by different routes. The specimen liquid reminds that the same element can be cryogenic coolant as well as atmospheric bulk.',
    facts: {
      atomicNumber: 7,
      symbol: 'N',
      period: 2,
      group: '15',
      standardState: 'Gas',
    },
    features: [
      {
        name: 'Air’s majority',
        description:
          'Roughly four-fifths of the atmosphere is N₂ — inert enough to dilute oxygen for breathing.',
      },
      {
        name: 'Triple bond',
        description:
          'The N≡N bond is strong; fixation into usable forms is energetically costly.',
      },
      {
        name: 'Life’s amines',
        description:
          'Amino acids, bases, and many metabolites carry nitrogen once it is reduced or oxidized from N₂.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Nitrogen',
        url: 'https://www.rsc.org/periodic-table/element/7/nitrogen',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'oxygen',
    code: 'O',
    name: 'Oxygen',
    category: 'Nonmetals',
    subtitle: 'Z = 8 · O · gas',
    about:
      'Oxygen is the most abundant element in Earth’s crust by mass when oxides are counted, and the second most abundant in the dry atmosphere as O₂. Water, silicates, and oxides lock most of it into solids and liquids; free O₂ is a product of photosynthesis that animals and fires consume. Liquid oxygen is pale blue; ozone (O₃) is a distinct allotrope in the upper air.',
    facts: {
      atomicNumber: 8,
      symbol: 'O',
      period: 2,
      group: '16',
      standardState: 'Gas',
    },
    features: [
      {
        name: 'Crustal oxide',
        description:
          'Silicates and other oxides make oxygen the mass leader in the solid Earth near the surface.',
      },
      {
        name: 'Respiration partner',
        description:
          'Aerobic metabolism uses O₂ as the terminal electron acceptor; combustion does the same faster.',
      },
      {
        name: 'Allotropes O₂ / O₃',
        description:
          'Dioxygen and ozone differ in bonding and role — breathable air versus stratospheric shield.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Oxygen',
        url: 'https://www.rsc.org/periodic-table/element/8/oxygen',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sodium',
    code: 'Na',
    name: 'Sodium',
    category: 'Alkali & alkaline earth',
    subtitle: 'Z = 11 · Na · solid',
    about:
      'Sodium is a soft alkali metal that reacts vigorously with water and never occurs free in nature. Seawater and evaporite salts store huge inventories as Na⁺; table salt (NaCl) is the everyday compound. In biology, sodium gradients drive nerve signals and fluid balance. Metal specimens are kept under oil because moist air attacks the surface at once.',
    facts: {
      atomicNumber: 11,
      symbol: 'Na',
      period: 3,
      group: '1',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Alkali reactivity',
        description:
          'One valence electron makes metallic sodium a strong reductant toward water and air.',
      },
      {
        name: 'Ocean cation',
        description:
          'Na⁺ is a major dissolved ion in seawater and a staple of evaporite geology.',
      },
      {
        name: 'Nerve gradients',
        description:
          'Cells pump sodium to maintain membrane potential used in signaling.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Sodium',
        url: 'https://www.rsc.org/periodic-table/element/11/sodium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'magnesium',
    code: 'Mg',
    name: 'Magnesium',
    category: 'Alkali & alkaline earth',
    subtitle: 'Z = 12 · Mg · solid',
    about:
      'Magnesium is a light alkaline-earth metal abundant in the mantle and in seawater. Chlorophyll places Mg at the heart of the porphyrin ring that harvests light; bones and many enzymes also depend on Mg²⁺. The metal burns with a bright white flame and is alloyed where low density matters. Orientation stays with geology and biology, not commodity-price swings.',
    facts: {
      atomicNumber: 12,
      symbol: 'Mg',
      period: 3,
      group: '2',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Light structural metal',
        description:
          'Low density and decent strength make Mg alloys useful where mass budgets are tight.',
      },
      {
        name: 'Chlorophyll core',
        description:
          'Photosynthetic pigments coordinate a magnesium ion in their light-absorbing ring.',
      },
      {
        name: 'Mantle & brine',
        description:
          'Olivine-rich rocks and seawater both carry large magnesium inventories.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Magnesium',
        url: 'https://www.rsc.org/periodic-table/element/12/magnesium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aluminum',
    code: 'Al',
    name: 'Aluminum',
    category: 'Other metals & metalloids',
    subtitle: 'Z = 13 · Al · solid',
    about:
      'Aluminum is the most abundant metal in Earth’s crust, yet metallic Al is modern because extracting it from oxide ores needs large electrical energy. Once refined, a tough oxide skin protects the metal from further corrosion. Feldspars and clays hold crustal aluminum; cans, aircraft skins, and foils show the worked metal. This guide uses the spelling aluminum (IUPAC also accepts aluminium).',
    facts: {
      atomicNumber: 13,
      symbol: 'Al',
      period: 3,
      group: '13',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Crustal abundance',
        description:
          'Aluminosilicates dominate many rocks even though native metal is rare at the surface.',
      },
      {
        name: 'Passive oxide',
        description:
          'A thin Al₂O₃ film seals the metal and enables everyday corrosion resistance.',
      },
      {
        name: 'Light conductor',
        description:
          'Low density plus electrical conductivity keep aluminum in power lines and transport.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Aluminium',
        url: 'https://www.rsc.org/periodic-table/element/13/aluminium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'silicon',
    code: 'Si',
    name: 'Silicon',
    category: 'Other metals & metalloids',
    subtitle: 'Z = 14 · Si · solid',
    about:
      'Silicon is the second most abundant element in the crust after oxygen, locked in quartz, feldspars, and clays. Pure crystalline silicon is the workhorse wafer of modern electronics; silica glass and silicones are everyday compounds. Metalloid behavior sits between metals and nonmetals. Orientation here is mineral and materials structure — not chip-market cycles.',
    facts: {
      atomicNumber: 14,
      symbol: 'Si',
      period: 3,
      group: '14',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Silicate planet',
        description:
          'Si–O tetrahedra knit the rock-forming minerals of the continental crust.',
      },
      {
        name: 'Semiconductor host',
        description:
          'Controlled purity and doping turn elemental silicon into transistor substrates.',
      },
      {
        name: 'Glass former',
        description:
          'Silica melts and cools into amorphous networks used as glass and optics.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Silicon',
        url: 'https://www.rsc.org/periodic-table/element/14/silicon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'phosphorus',
    code: 'P',
    name: 'Phosphorus',
    category: 'Nonmetals',
    subtitle: 'Z = 15 · P · solid',
    about:
      'Phosphorus is essential to ATP, DNA, and bone mineral, yet elemental white phosphorus is reactive and stored under water. Red and black allotropes are stabler. Phosphate rock feeds agriculture; living cells cycle phosphate through metabolism. This guide stresses biology and allotropes, not fertilizer-trade volatility.',
    facts: {
      atomicNumber: 15,
      symbol: 'P',
      period: 3,
      group: '15',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Allotropes',
        description:
          'White, red, and black phosphorus differ sharply in structure and reactivity.',
      },
      {
        name: 'Life’s phosphate',
        description:
          'ATP, nucleic acids, and apatite bone all depend on phosphorus in oxidized form.',
      },
      {
        name: 'Rock cycle link',
        description:
          'Phosphate minerals weather into soils that ecosystems and farms draw upon.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Phosphorus',
        url: 'https://www.rsc.org/periodic-table/element/15/phosphorus',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sulfur',
    code: 'S',
    name: 'Sulfur',
    category: 'Nonmetals',
    subtitle: 'Z = 16 · S · solid',
    about:
      'Sulfur is a bright yellow nonmetal found native near volcanoes and in sulfide ores. Proteins use cysteine and methionine; industry uses sulfur for sulfuric acid and vulcanization. The crown-shaped S₈ rings of the elemental solid set a classic textbook picture. Orientation stays with geology and biochemistry, not short-term commodity quotes.',
    facts: {
      atomicNumber: 16,
      symbol: 'S',
      period: 3,
      group: '16',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Volcanic native',
        description:
          'Fumaroles and volcanic vents deposit elemental sulfur around vents and lakes.',
      },
      {
        name: 'S₈ rings',
        description:
          'The common solid is built from crown-shaped eight-membered rings.',
      },
      {
        name: 'Protein sulfur',
        description:
          'Disulfide bridges and thioethers shape protein structure and catalysis.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Sulfur',
        url: 'https://www.rsc.org/periodic-table/element/16/sulfur',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'chlorine',
    code: 'Cl',
    name: 'Chlorine',
    category: 'Nonmetals',
    subtitle: 'Z = 17 · Cl · gas',
    about:
      'Chlorine is a green-yellow halogen gas that is rarely free in nature; chloride ion dominates seawater and table salt. Disinfection and many organochlorine compounds use elemental or oxidized chlorine. The halogen family gains a full outer shell by taking one electron. Handle the pure gas as a historical laboratory reagent, not a household staple.',
    facts: {
      atomicNumber: 17,
      symbol: 'Cl',
      period: 3,
      group: '17',
      standardState: 'Gas',
    },
    features: [
      {
        name: 'Halogen oxidizer',
        description:
          'Cl₂ seeks electrons strongly; chloride (Cl⁻) is the common stable form in brines.',
      },
      {
        name: 'Seawater anion',
        description:
          'Chloride is the leading dissolved anion in the world ocean.',
      },
      {
        name: 'Disinfection chemistry',
        description:
          'Aqueous chlorine species have long been used to control microbes in water systems.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Chlorine',
        url: 'https://www.rsc.org/periodic-table/element/17/chlorine',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'potassium',
    code: 'K',
    name: 'Potassium',
    category: 'Alkali & alkaline earth',
    subtitle: 'Z = 19 · K · solid',
    about:
      'Potassium is a soft alkali metal even more reactive than sodium with water. In soils and cells, K⁺ is the major intracellular cation that balances sodium outside. Potash minerals feed agriculture; metal specimens stay under oil. The name traces to pot ash; the symbol K comes from kalium.',
    facts: {
      atomicNumber: 19,
      symbol: 'K',
      period: 4,
      group: '1',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Intracellular cation',
        description:
          'Cells keep high K⁺ inside; gradients with sodium power many membrane processes.',
      },
      {
        name: 'Fertile potash',
        description:
          'Evaporite and igneous potash minerals supply potassium to soils and crops.',
      },
      {
        name: 'Alkali flame',
        description:
          'Potassium salts color flames lilac — a classic qualitative test.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Potassium',
        url: 'https://www.rsc.org/periodic-table/element/19/potassium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'calcium',
    code: 'Ca',
    name: 'Calcium',
    category: 'Alkali & alkaline earth',
    subtitle: 'Z = 20 · Ca · solid',
    about:
      'Calcium is an alkaline-earth metal abundant in limestone, gypsum, and bones. Ca²⁺ stiffens skeletons and shells as carbonate or phosphate and signals inside cells. Hard water carries calcium; cement and plaster are calcium chemistry at building scale. Metal pieces tarnish quickly in air.',
    facts: {
      atomicNumber: 20,
      symbol: 'Ca',
      period: 4,
      group: '2',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Carbonate rock',
        description:
          'Limestone and related rocks store vast crustal calcium as CaCO₃.',
      },
      {
        name: 'Bone mineral',
        description:
          'Hydroxyapatite and related phosphates give vertebrate skeletons rigidity.',
      },
      {
        name: 'Cellular signal',
        description:
          'Transient Ca²⁺ rises trigger muscle contraction, secretion, and other responses.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Calcium',
        url: 'https://www.rsc.org/periodic-table/element/20/calcium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'iron',
    code: 'Fe',
    name: 'Iron',
    category: 'Transition & heavy',
    subtitle: 'Z = 26 · Fe · solid',
    about:
      'Iron is Earth’s most abundant element by planetary mass when the core is counted, and the workhorse metal of tools and blood. Hematite and magnetite are common ores; rust is hydrated iron oxide. Hemoglobin binds oxygen on an iron center. This guide stays with geology and biology — not scrap-price tickers.',
    facts: {
      atomicNumber: 26,
      symbol: 'Fe',
      period: 4,
      group: '8',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Planetary core',
        description:
          'Metallic iron–nickel dominates Earth’s core and sets much of planetary density.',
      },
      {
        name: 'Oxide ores',
        description:
          'Hematite, magnetite, and related minerals feed steelmaking after reduction.',
      },
      {
        name: 'Heme iron',
        description:
          'Blood pigments use iron to carry oxygen between lungs and tissues.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Iron',
        url: 'https://www.rsc.org/periodic-table/element/26/iron',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'copper',
    code: 'Cu',
    name: 'Copper',
    category: 'Transition & heavy',
    subtitle: 'Z = 29 · Cu · solid',
    about:
      'Copper is a reddish transition metal that conducts heat and electricity well and was among the first metals worked by humans. Native copper, chalcopyrite, and malachite mark different ore styles. Alloys with tin (bronze) and zinc (brass) shaped early technology. Orientation is materials and geology, not exchange quotes.',
    facts: {
      atomicNumber: 29,
      symbol: 'Cu',
      period: 4,
      group: '11',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Native metal',
        description:
          'Copper can occur metallic in the crust — rare among structural metals.',
      },
      {
        name: 'Electrical workhorse',
        description:
          'High conductivity keeps copper in wiring, motors, and heat exchangers.',
      },
      {
        name: 'Alloy ancestor',
        description:
          'Bronze and brass extended copper’s hardness and color for tools and art.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Copper',
        url: 'https://www.rsc.org/periodic-table/element/29/copper',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'silver',
    code: 'Ag',
    name: 'Silver',
    category: 'Transition & heavy',
    subtitle: 'Z = 47 · Ag · solid',
    about:
      'Silver is a soft white transition metal with the highest electrical and thermal conductivity of any element. Native silver and sulfide ores supply jewelry, photography history, and electrical contacts. Chemically it sits with copper and gold in group 11. This guide omits bullion-market chatter.',
    facts: {
      atomicNumber: 47,
      symbol: 'Ag',
      period: 5,
      group: '11',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Best conductor',
        description:
          'Among pure metals, silver leads in electrical and thermal conductivity.',
      },
      {
        name: 'Group 11 sibling',
        description:
          'With copper and gold, silver shares a filled d-shell and coinage-metal history.',
      },
      {
        name: 'Photographic past',
        description:
          'Silver halides underpinned classical photography before digital sensors.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Silver',
        url: 'https://www.rsc.org/periodic-table/element/47/silver',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'gold',
    code: 'Au',
    name: 'Gold',
    category: 'Transition & heavy',
    subtitle: 'Z = 79 · Au · solid',
    about:
      'Gold is a dense, malleable transition metal that resists corrosion and stays bright in air. Native gold in veins and placers made it a store of value and ornament for millennia; electronics use thin gold for reliable contacts. Chemically soft and noble, it dissolves in aqua regia. Orientation is properties and occurrence — not price charts.',
    facts: {
      atomicNumber: 79,
      symbol: 'Au',
      period: 6,
      group: '11',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Noble metal',
        description:
          'Gold resists oxidation and acids that attack lesser metals — hence lasting artifacts.',
      },
      {
        name: 'Extreme malleability',
        description:
          'Gold can be beaten into leaf only atoms thick for gilding and some electronics.',
      },
      {
        name: 'Native occurrence',
        description:
          'Vein and placer gold appear metallic in the crust more often than most metals.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Gold',
        url: 'https://www.rsc.org/periodic-table/element/79/gold',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mercury',
    code: 'Hg',
    name: 'Mercury',
    category: 'Transition & heavy',
    subtitle: 'Z = 80 · Hg · liquid',
    about:
      'Mercury is the only metal that is liquid at standard temperature and pressure. Dense and silvery, it alloys with other metals as amalgams and was once common in instruments. Vapor and many compounds are toxic; modern use is tightly controlled. Cinnabar (HgS) is the classic ore. This guide is properties and caution, not trade gossip.',
    facts: {
      atomicNumber: 80,
      symbol: 'Hg',
      period: 6,
      group: '12',
      standardState: 'Liquid',
    },
    features: [
      {
        name: 'Liquid metal',
        description:
          'At STP mercury stays liquid — unique among metals in ordinary conditions.',
      },
      {
        name: 'Amalgams',
        description:
          'Mercury dissolves many metals, a property once used in extraction and dentistry.',
      },
      {
        name: 'Toxic vapor',
        description:
          'Inhaled mercury vapor and some organomercury compounds are hazardous to health.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Mercury',
        url: 'https://www.rsc.org/periodic-table/element/80/mercury',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lead',
    code: 'Pb',
    name: 'Lead',
    category: 'Transition & heavy',
    subtitle: 'Z = 82 · Pb · solid',
    about:
      'Lead is a soft, dense post-transition metal known from antiquity for pipes, solder, and pigments — uses now restricted because of toxicity. Galena (PbS) is the chief ore. Softness, low melting point, and radiation shielding still matter in controlled settings. Orientation is chemistry and history of use, not scrap markets.',
    facts: {
      atomicNumber: 82,
      symbol: 'Pb',
      period: 6,
      group: '14',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Dense soft metal',
        description:
          'High density and low hardness made lead easy to cast and roll in early technology.',
      },
      {
        name: 'Galena ore',
        description:
          'Lead sulfide crystals are the classic primary ore mineral.',
      },
      {
        name: 'Toxicity lesson',
        description:
          'Chronic lead exposure harms nervous systems; many historical uses are now banned or limited.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Lead',
        url: 'https://www.rsc.org/periodic-table/element/82/lead',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'uranium',
    code: 'U',
    name: 'Uranium',
    category: 'Transition & heavy',
    subtitle: 'Z = 92 · U · solid',
    about:
      'Uranium is a dense actinide metal whose isotopes include naturally fissile and fertile nuclides used in nuclear power and, historically, weapons. Pitchblende and other uranium minerals color some collections yellow-green. All isotopes are radioactive; handling is regulated. This guide covers occurrence and nuclear character without operational detail or market chatter.',
    facts: {
      atomicNumber: 92,
      symbol: 'U',
      period: 7,
      group: 'Actinide',
      standardState: 'Solid',
    },
    features: [
      {
        name: 'Actinide metal',
        description:
          'Uranium sits in the actinide series with a dense, silvery appearance when clean.',
      },
      {
        name: 'Natural radioactivity',
        description:
          'All uranium isotopes decay; crustal uranium contributes to Earth’s internal heat.',
      },
      {
        name: 'Nuclear fuel cycle',
        description:
          'Isotopic composition (notably ²³⁵U vs ²³⁸U) determines reactor and enrichment context.',
      },
    ],
    sources: [
      {
        label: 'IUPAC Periodic Table',
        url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
        kind: 'agency',
      },
      {
        label: 'RSC Periodic Table — Uranium',
        url: 'https://www.rsc.org/periodic-table/element/92/uranium',
        kind: 'reference',
      },
    ],
  },
]

export const elementSubjects: ElementSubject[] =
  elementSubjectDrafts.map(withPhoto)

export function elementSubjectSlugs(): string[] {
  return elementSubjects.map((subject) => subject.slug)
}

export function getElementSubject(slug: string): ElementSubject | undefined {
  return elementSubjects.find((subject) => subject.slug === slug)
}

export function elementSubjectsByCategory(): [string, ElementSubject[]][] {
  const groups = new Map<string, ElementSubject[]>()
  for (const subject of elementSubjects) {
    const list = groups.get(subject.category) ?? []
    list.push(subject)
    groups.set(subject.category, list)
  }
  return [...groups.entries()]
}

export function elementDescription(subject: ElementSubject): string {
  return subject.about.replace(/\s+/g, ' ').trim()
}
