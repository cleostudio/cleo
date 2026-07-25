/** Space topic — evergreen field-guide records for solar-system and deep-space subjects. */

import spacePhotos from '~/content/space-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface SpaceFeature {
  name: string
  description: string
}

export interface SpaceSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface SpaceFacts {
  /** Body class: Star, Planet, Moon, Dwarf planet, Region, Galaxy. */
  kind: string
  /** Broader neighborhood: Solar System, Local Group, etc. */
  system: string
  /** Human-readable distance (AU, km, or light-years). */
  meanDistance: string
  /** Equatorial radius in kilometers when meaningful; omit for regions/galaxies. */
  radiusKm: number | null
  /** Orbital period around the primary, or galactic rotation note. */
  orbitalPeriod: string
  /** Sidereal rotation / day length, or structural timescale. */
  rotationPeriod: string
  /** Moons, rings, companion notes. */
  companions: string
}

export interface SpacePhoto extends StaticPhoto {
  nasaId: string
}

export interface SpaceSubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. SOL, MAR). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title (e.g. "Terrestrial planet · Solar System"). */
  subtitle: string
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: SpaceFacts
  /** Exactly three notable features. */
  features: [SpaceFeature, SpaceFeature, SpaceFeature]
  sources: SpaceSource[]
  photo: SpacePhoto
}

type SpaceSubjectDraft = Omit<SpaceSubject, 'photo'>

const photoManifest = spacePhotos as Record<string, SpacePhoto>

function withPhoto(draft: SpaceSubjectDraft): SpaceSubject {
  const photo = photoManifest[draft.slug]
  if (!photo) {
    throw new Error(`Missing space photo for ${draft.slug}`)
  }
  return { ...draft, photo }
}

/** Curated first catalog — solar system bodies plus two nearby galaxies. */
const spaceSubjectDrafts: SpaceSubjectDraft[] = [
  {
    slug: 'sun',
    code: 'SOL',
    name: 'Sun',
    category: 'Solar System',
    subtitle: 'G-type main-sequence star · Solar System',
    about:
      'The Sun is the gravitational heart of the Solar System — a G2V star holding planets, moons, and dust in a shared dynamical family. Nearly all of the system’s mass sits in this one sphere of plasma, and the light that reaches Earth left its photosphere about eight minutes earlier. Orientation here is structural rather than seasonal: a dense core where fusion converts hydrogen to helium, a radiative zone that carries energy outward over long timescales, and a convective envelope that boils into the visible surface. Above that surface, the chromosphere and corona extend into the solar wind that shapes planetary magnetospheres. The Sun is ordinary among stars and singular for us: close enough that its spots, flares, and quiet glow can be studied as weather and as physics at once. This primer stays with durable facts — mass, scale, and the architecture that makes a planetary system possible — rather than forecast cycles or mission headlines.',
    facts: {
      kind: 'Star',
      system: 'Solar System',
      meanDistance: '0 AU (system barycenter)',
      radiusKm: 695700,
      orbitalPeriod: 'Milky Way orbit ~225–250 Myr',
      rotationPeriod: '~25 days (equator) to ~35 days (poles)',
      companions: 'Eight planets, dwarf planets, small bodies',
    },
    features: [
      {
        name: 'Photosphere',
        description:
          'The visible “surface” where optical depth drops and sunlight escapes — granulated by convection and marked by sunspots.',
      },
      {
        name: 'Corona',
        description:
          'A tenuous million-degree outer atmosphere that becomes the solar wind and is revealed dramatically during total eclipses.',
      },
      {
        name: 'Solar wind',
        description:
          'A continuous outflow of charged particles that fills the heliosphere and carves magnetospheric boundaries at every planet.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Sun',
        url: 'https://solarsystem.nasa.gov/solar-system/sun/overview/',
        kind: 'agency',
      },
      {
        label: 'ESA — The Sun',
        url: 'https://www.esa.int/Science_Exploration/Space_Science/The_Sun',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'mercury',
    code: 'MER',
    name: 'Mercury',
    category: 'Solar System',
    subtitle: 'Terrestrial planet · Solar System',
    about:
      'Mercury is the innermost planet — a compact, airless world of cratered highlands and long scarps left by ancient cooling. Days on Mercury are extreme: the surface faces the Sun for long stretches, then turns into a night cold enough to hold water ice in permanently shadowed polar craters. The planet’s large metallic core and thin silicate shell make it denser than its size suggests, a clue to a violent early history. There is no substantial atmosphere to soften temperature swings or paint a sky; the horizon stays sharp and the Sun appears several times larger than it does from Earth. Orientation stays with geology and orbit: a 3:2 spin–orbit resonance, a short year, and a landscape that records impacts more clearly than weather. Mercury is less a destination than a boundary condition — how close a rocky planet can orbit a star and still keep a solid surface.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '0.39 AU',
      radiusKm: 2439.7,
      orbitalPeriod: '88.0 Earth days',
      rotationPeriod: '58.6 Earth days',
      companions: 'None',
    },
    features: [
      {
        name: 'Caloris Basin',
        description:
          'One of the largest impact basins in the Solar System, ringed by mountains and floored by later volcanic plains.',
      },
      {
        name: 'Lobate scarps',
        description:
          'Cliff-like thrust faults that wrinkle across the globe, evidence that Mercury’s interior cooled and contracted.',
      },
      {
        name: 'Polar ice',
        description:
          'Radar-bright deposits in permanently shadowed craters near the poles — cold traps on an otherwise scorched world.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Mercury',
        url: 'https://solarsystem.nasa.gov/planets/mercury/overview/',
        kind: 'agency',
      },
      {
        label: 'USGS Astrogeology — Mercury',
        url: 'https://astrogeology.usgs.gov/maps/mercury',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'venus',
    code: 'VEN',
    name: 'Venus',
    category: 'Solar System',
    subtitle: 'Terrestrial planet · Solar System',
    about:
      'Venus is Earth’s near twin in size and a lesson in divergent climate. A crushing carbon-dioxide atmosphere, opaque sulfuric clouds, and a runaway greenhouse keep the surface hotter than Mercury’s dayside despite a greater distance from the Sun. The landscape is volcanic and tectonic — broad highlands, lava plains, and circular coronae — mapped mostly by radar because visible light barely reaches the ground. Rotation is slow and retrograde, so a Venusian day outlasts its year when measured against the stars, while the upper clouds race around the planet in a few Earth days. This primer treats Venus as an orientation in planetary atmospheres: what happens when a thick greenhouse seals a rocky world. It is not a travel brochure; the durable story is pressure, heat, and a geology written under clouds.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '0.72 AU',
      radiusKm: 6051.8,
      orbitalPeriod: '224.7 Earth days',
      rotationPeriod: '243 Earth days (retrograde)',
      companions: 'None',
    },
    features: [
      {
        name: 'Ishtar Terra',
        description:
          'A continent-scale highland in the north, crowned by Maxwell Montes, the tallest mountain massif on Venus.',
      },
      {
        name: 'Cloud deck',
        description:
          'Sulfuric acid clouds that hide the surface and drive superrotating winds in the upper atmosphere.',
      },
      {
        name: 'Coronae',
        description:
          'Oval tectonic–volcanic features thought to mark mantle upwellings reshaping the lithosphere from below.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Venus',
        url: 'https://solarsystem.nasa.gov/planets/venus/overview/',
        kind: 'agency',
      },
      {
        label: 'ESA — Venus',
        url: 'https://www.esa.int/Science_Exploration/Space_Science/Venus_Express',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'earth',
    code: 'EAR',
    name: 'Earth',
    category: 'Solar System',
    subtitle: 'Terrestrial planet · Solar System',
    about:
      'Earth is the reference planet — oceans, continents, a protective magnetic field, and an atmosphere that stays breathable because biology and geology keep exchanging carbon and oxygen. From space it is a blue marble with swirling weather; up close it is plate tectonics, a hydrologic cycle, and a biosphere that has rewritten the air over geologic time. The Moon stabilizes obliquity and raises tides; the Sun sets the energy budget. Orientation in this guide is planetary rather than national: Earth as one rocky world in a habitable-zone orbit, with liquid water at the surface and a climate system sensitive to composition and sunlight. The durable facts are mass, distance, and the unusual coupling of ocean, atmosphere, and life. Everything else on Cleo’s country guides sits on this one sphere.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '1 AU',
      radiusKm: 6371,
      orbitalPeriod: '365.25 days',
      rotationPeriod: '23 h 56 min (sidereal)',
      companions: 'One moon (the Moon)',
    },
    features: [
      {
        name: 'Hydrosphere',
        description:
          'Global oceans and the water cycle that redistribute heat, carve landscapes, and buffer climate.',
      },
      {
        name: 'Plate tectonics',
        description:
          'A mobile lithosphere that recycles crust, builds mountains, and helps regulate long-term carbon.',
      },
      {
        name: 'Magnetosphere',
        description:
          'A magnetic shield generated in the outer core that deflects much of the solar wind around the planet.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Earth',
        url: 'https://solarsystem.nasa.gov/planets/earth/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory',
        url: 'https://earthobservatory.nasa.gov/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'moon',
    code: 'LUN',
    name: 'Moon',
    category: 'Solar System',
    subtitle: 'Natural satellite · Earth',
    about:
      'The Moon is Earth’s companion and the only other world humans have walked. Its near side shows dark maria of ancient basalt and bright highlands saturated with craters; the far side is almost all highlands. Tidally locked, it keeps one face toward Earth while sunlight crawls across two weeks of day and two weeks of night. There is no substantial air, so shadows stay knife-edged and the sky is always black. The Moon raises tides, steadies Earth’s tilt over long timescales, and preserves an impact record mostly erased on our planet by weather and tectonics. Orientation here is selenography: basins, highlands, and a crust born from a giant impact early in Solar System history. It remains the nearest archive of that violent youth.',
    facts: {
      kind: 'Moon',
      system: 'Earth–Moon',
      meanDistance: '384,400 km from Earth',
      radiusKm: 1737.4,
      orbitalPeriod: '27.3 Earth days',
      rotationPeriod: '27.3 Earth days (tidally locked)',
      companions: 'Earth (primary)',
    },
    features: [
      {
        name: 'Maria',
        description:
          'Dark basaltic plains flooded by ancient volcanism, concentrated on the near side and visible to the unaided eye.',
      },
      {
        name: 'South Pole–Aitken Basin',
        description:
          'A vast far-side impact basin, among the largest and deepest in the Solar System.',
      },
      {
        name: 'Regolith',
        description:
          'A powdery impact-generated soil that blankets bedrock and records the solar wind in its grains.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Earth’s Moon',
        url: 'https://solarsystem.nasa.gov/moons/earths-moon/overview/',
        kind: 'agency',
      },
      {
        label: 'USGS — Moon',
        url: 'https://astrogeology.usgs.gov/maps/moon',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mars',
    code: 'MAR',
    name: 'Mars',
    category: 'Solar System',
    subtitle: 'Terrestrial planet · Solar System',
    about:
      'Mars is the outermost rocky planet — a cold desert world with polar ice, a thin carbon-dioxide air, and landscapes that once ran with water. Dust colors the sky; volcanoes and canyons reach scales Earth cannot match in a single plate. The planet’s day is nearly Earth-like, its year nearly twice as long, and its seasons are sharpened by a tilted axis and an eccentric orbit. Orientation stays with durable geography: the Tharsis bulge, the northern lowlands versus southern highlands, and climate archives locked in ice and layered sediments. Mars is often imagined as a second Earth; the field-guide view is more modest — a smaller, drier sibling that still preserves an early wet chapter in rock.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '1.52 AU',
      radiusKm: 3389.5,
      orbitalPeriod: '687 Earth days',
      rotationPeriod: '24 h 37 min',
      companions: 'Phobos and Deimos',
    },
    features: [
      {
        name: 'Olympus Mons',
        description:
          'A shield volcano roughly the width of France and the tallest known mountain in the Solar System.',
      },
      {
        name: 'Valles Marineris',
        description:
          'A canyon system thousands of kilometers long — a tectonic scar beside the Tharsis rise.',
      },
      {
        name: 'Polar layered deposits',
        description:
          'Stacked ice and dust at the poles that record climate oscillations over millions of years.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Mars',
        url: 'https://solarsystem.nasa.gov/planets/mars/overview/',
        kind: 'agency',
      },
      {
        label: 'USGS Astrogeology — Mars',
        url: 'https://astrogeology.usgs.gov/maps/mars',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'jupiter',
    code: 'JUP',
    name: 'Jupiter',
    category: 'Solar System',
    subtitle: 'Gas giant · Solar System',
    about:
      'Jupiter is the Solar System’s largest planet — a hydrogen–helium giant whose mass shapes the architecture around it. Banded clouds, a centuries-old Great Red Spot, and a powerful magnetic field make it a weather engine and a radiation hazard at once. Dozens of moons form a miniature system, including the Galilean worlds that rewrote astronomy when first seen through a telescope. There is no solid surface to stand on; “depth” means pressure and temperature rising until hydrogen turns metallic. Orientation emphasizes scale and influence: a short day, a wide orbit, and a gravitational presence that shepherds asteroids and flings comets. Jupiter is less a place than a primary — a star that never ignited, still dominating the outer system’s dynamics.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '5.20 AU',
      radiusKm: 69911,
      orbitalPeriod: '11.9 Earth years',
      rotationPeriod: '9 h 56 min',
      companions: '95+ moons; faint rings',
    },
    features: [
      {
        name: 'Great Red Spot',
        description:
          'A persistent anticyclonic storm larger than Earth, tracked for well over a century.',
      },
      {
        name: 'Galilean moons',
        description:
          'Io, Europa, Ganymede, and Callisto — a volcanic world, an ice shell over ocean, a giant moon, and a cratered archive.',
      },
      {
        name: 'Magnetosphere',
        description:
          'The largest planetary magnetic domain in the Solar System, filled with intense radiation belts.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Jupiter',
        url: 'https://solarsystem.nasa.gov/planets/jupiter/overview/',
        kind: 'agency',
      },
      {
        label: 'ESA — Jupiter',
        url: 'https://www.esa.int/Science_Exploration/Space_Science/Jupiter',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'saturn',
    code: 'SAT',
    name: 'Saturn',
    category: 'Solar System',
    subtitle: 'Gas giant · Solar System',
    about:
      'Saturn is the ringed giant — a hydrogen world less dense than water, wrapped in a disk of ice and rock so thin and bright it became the planet’s emblem. The atmosphere shows muted bands and long-lived storms; the interior likely mirrors Jupiter’s layered hydrogen physics at a smaller scale. Titan, with its thick air and methane cycle, and Enceladus, with its plume-fed subsurface ocean, make the satellite system a second subject almost as rich as the planet. Orientation here is architecture: rings sorted by density waves, shepherd moons, and a rapid spin that flattens the globe. Saturn teaches how a giant planet and its debris can coevolve into a single dynamical sculpture.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '9.58 AU',
      radiusKm: 58232,
      orbitalPeriod: '29.4 Earth years',
      rotationPeriod: '10 h 33 min',
      companions: '140+ moons; prominent rings',
    },
    features: [
      {
        name: 'Main rings',
        description:
          'A broad disk of ice-rich particles structured by resonances with moons into gaps and waves.',
      },
      {
        name: 'Titan',
        description:
          'A haze-wrapped moon with lakes and rivers of liquid hydrocarbons — the only satellite with a dense atmosphere.',
      },
      {
        name: 'Hexagonal jet',
        description:
          'A six-sided cloud pattern around the north pole, a durable curiosity of Saturn’s atmospheric dynamics.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Saturn',
        url: 'https://solarsystem.nasa.gov/planets/saturn/overview/',
        kind: 'agency',
      },
      {
        label: 'ESA — Cassini-Huygens',
        url: 'https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'uranus',
    code: 'URA',
    name: 'Uranus',
    category: 'Solar System',
    subtitle: 'Ice giant · Solar System',
    about:
      'Uranus is an ice giant rolled on its side — an axis tilted nearly into its orbital plane, so seasons last for decades and poles take turns facing the Sun. Methane in the atmosphere absorbs red light and leaves the planet a pale cyan. A narrow ring system and a family of dark moons orbit in that unusual geometry. The interior is thought to mix water, ammonia, and methane ices around a rocky core, distinct from the hydrogen-dominated gas giants. Orientation stresses the tilt and the cold: sunlight is weak at ~19 AU, and the weather we resolve is subtle compared with Jupiter’s banners. Uranus is the Solar System’s quiet oddity — still a planet, still layered, but spun into a different seasonal clock.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '19.2 AU',
      radiusKm: 25362,
      orbitalPeriod: '84.0 Earth years',
      rotationPeriod: '17 h 14 min (retrograde)',
      companions: '28 moons; narrow rings',
    },
    features: [
      {
        name: 'Extreme tilt',
        description:
          'An obliquity near 98°, likely from an ancient giant impact, that invents decades-long polar summers.',
      },
      {
        name: 'Methane haze',
        description:
          'Atmospheric methane that tints the planet cyan and veils deeper cloud decks.',
      },
      {
        name: 'Dark ring system',
        description:
          'Narrow, dusty rings far fainter than Saturn’s, discovered in 1977 during a stellar occultation.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Uranus',
        url: 'https://solarsystem.nasa.gov/planets/uranus/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Voyager — Uranus',
        url: 'https://science.nasa.gov/mission/voyager/uranus/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'neptune',
    code: 'NEP',
    name: 'Neptune',
    category: 'Solar System',
    subtitle: 'Ice giant · Solar System',
    about:
      'Neptune is the outermost planet — a deep blue ice giant where the strongest winds measured in the Solar System tear across cold cloud decks. Discovered by mathematics before it was seen, it anchors the classical planetary sequence beyond Uranus. Triton’s retrograde orbit and geyser-like plumes hint at capture from the Kuiper Belt. Faint rings and dark storms come and go on timescales shorter than a human career. Orientation is remoteness and dynamics: sunlight is a dim coin, yet the atmosphere is restless, powered by internal heat as much as by the Sun. Neptune closes the set of major planets and opens the door to the small-body frontier beyond.',
    facts: {
      kind: 'Planet',
      system: 'Solar System',
      meanDistance: '30.1 AU',
      radiusKm: 24622,
      orbitalPeriod: '164.8 Earth years',
      rotationPeriod: '16 h 6 min',
      companions: '16 moons; faint rings',
    },
    features: [
      {
        name: 'Supersonic winds',
        description:
          'Zonal winds among the fastest known, sculpting bands and transient dark ovals in the cloud tops.',
      },
      {
        name: 'Triton',
        description:
          'A large retrograde moon with nitrogen frost and plume activity — likely a captured Kuiper Belt object.',
      },
      {
        name: 'Great Dark Spot lineage',
        description:
          'Earth-sized anticyclones first seen by Voyager 2 and later replaced by new storms in Hubble imagery.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Neptune',
        url: 'https://solarsystem.nasa.gov/planets/neptune/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Voyager — Neptune',
        url: 'https://science.nasa.gov/mission/voyager/neptune/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'pluto',
    code: 'PLU',
    name: 'Pluto',
    category: 'Solar System',
    subtitle: 'Dwarf planet · Kuiper Belt',
    about:
      'Pluto is a Kuiper Belt world of ice mountains, nitrogen plains, and a thin seasonal atmosphere — reclassified as a dwarf planet yet undiminished as a geological story. Charon’s lockstep orbit makes the pair a true binary; smaller moons stitch a compact system. Close-range imaging revealed a heart-shaped basin of soft ices, rugged water-ice highlands, and haze layers catching the weak sunlight. Orientation rejects the old “ninth planet” argument and keeps the physical one: a differentiated icy body that still stirs its surface. Pluto shows that the outer Solar System is not a junk drawer of leftovers but a province of active, complex worlds.',
    facts: {
      kind: 'Dwarf planet',
      system: 'Kuiper Belt',
      meanDistance: '39.5 AU',
      radiusKm: 1188.3,
      orbitalPeriod: '248 Earth years',
      rotationPeriod: '6.4 Earth days',
      companions: 'Charon and four smaller moons',
    },
    features: [
      {
        name: 'Sputnik Planitia',
        description:
          'A vast nitrogen-ice plain — the western lobe of Pluto’s bright “heart” — convecting like a slow glacier.',
      },
      {
        name: 'Water-ice mountains',
        description:
          'Blocky ranges such as Tenzing Montes that rise kilometers above the plains, rigid in the cold.',
      },
      {
        name: 'Charon',
        description:
          'A moon so large the barycenter lies outside Pluto, painting red polar stains from captured Pluto air.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Pluto',
        url: 'https://solarsystem.nasa.gov/planets/dwarf-planets/pluto/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA New Horizons — Pluto',
        url: 'https://science.nasa.gov/mission/new-horizons/pluto/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'asteroid-belt',
    code: 'AST',
    name: 'Asteroid Belt',
    category: 'Solar System',
    subtitle: 'Small-body region · Solar System',
    about:
      'The asteroid belt is a broad annular zone between Mars and Jupiter where leftover planetesimals never finished building a planet. It is mostly empty space: the total mass is a fraction of the Moon’s, spread across countless kilometers. Ceres, a dwarf planet, dominates that mass; Vesta and other large asteroids preserve basaltic crusts and iron cores from an early differentiated generation. Resonances with Jupiter carve gaps (the Kirkwood gaps) and continually stir orbits. Orientation treats the belt as a region and a museum — not a rubble wall to dodge in every story, but a dynamical province where Solar System beginnings remain readable in rock.',
    facts: {
      kind: 'Region',
      system: 'Solar System',
      meanDistance: '~2.2–3.2 AU',
      radiusKm: null,
      orbitalPeriod: 'Varied (~3–6 Earth years typical)',
      rotationPeriod: 'Body-dependent',
      companions: 'Ceres, Vesta, Pallas, and ~10⁶+ bodies >1 km',
    },
    features: [
      {
        name: 'Ceres',
        description:
          'The belt’s only dwarf planet — a watery world with bright salt deposits in Occator Crater.',
      },
      {
        name: 'Vesta',
        description:
          'A differentiated protoplanet whose basaltic crust links to the HED meteorites that fall on Earth.',
      },
      {
        name: 'Kirkwood gaps',
        description:
          'Orbital niches cleared by mean-motion resonances with Jupiter, sorting the belt’s census.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Asteroids',
        url: 'https://solarsystem.nasa.gov/asteroids-comets-and-meteors/asteroids/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Dawn mission',
        url: 'https://science.nasa.gov/mission/dawn/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'milky-way',
    code: 'MWY',
    name: 'Milky Way',
    category: 'Deep Space',
    subtitle: 'Barred spiral galaxy · Local Group',
    about:
      'The Milky Way is our galaxy — a barred spiral of stars, gas, dust, and dark matter spanning on the order of a hundred thousand light-years. The Sun sits in a quiet stretch of a spiral-arm environment, orbiting the center once every couple of hundred million years. From Earth’s night side the disk appears as a pale band; infrared and radio maps reveal a central bar, molecular clouds, and a supermassive black hole in the nucleus. Orientation zooms out from planets to the structure that contains them: halo, disk, bulge, and the satellite galaxies bound alongside. This primer stays with architecture and membership, not with transient astronomical alerts. Every Solar System guide on Cleo is a footnote inside this one galaxy.',
    facts: {
      kind: 'Galaxy',
      system: 'Local Group',
      meanDistance: '0 (we are inside)',
      radiusKm: null,
      orbitalPeriod: 'Sun’s galactic orbit ~225–250 Myr',
      rotationPeriod: 'Differential — faster inward',
      companions: 'Magellanic Clouds and dozens of dwarf satellites',
    },
    features: [
      {
        name: 'Galactic center',
        description:
          'A dense nucleus hosting Sagittarius A*, a roughly four-million-solar-mass black hole.',
      },
      {
        name: 'Spiral disk',
        description:
          'Stars and gas arranged in arms and a bar — the bright plane that draws the Milky Way across dark skies.',
      },
      {
        name: 'Stellar halo',
        description:
          'An extended, sparse population of old stars and globular clusters surrounding the disk.',
      },
    ],
    sources: [
      {
        label: 'NASA — Milky Way',
        url: 'https://science.nasa.gov/resource/the-milky-way-galaxy/',
        kind: 'agency',
      },
      {
        label: 'ESA Gaia mission',
        url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'andromeda',
    code: 'AND',
    name: 'Andromeda',
    category: 'Deep Space',
    subtitle: 'Spiral galaxy · Local Group',
    about:
      'Andromeda (M31) is the nearest major spiral galaxy and the Milky Way’s future partner in a slow gravitational waltz. On a dark autumn night it appears as a soft oval to the unaided eye; telescopes resolve dust lanes, star clouds, and a bright nucleus. It is larger and more massive than the Milky Way by many estimates, with its own retinue of dwarf satellites. Orientation is neighborliness at cosmic scale: about 2.5 million light-years away, still close enough that its light left when Australopithecus walked Earth. The durable story is structure and destiny — two large spirals in the Local Group that will eventually merge — without treating the merger as imminent drama. Andromeda is simply the next island over in our galactic archipelago.',
    facts: {
      kind: 'Galaxy',
      system: 'Local Group',
      meanDistance: '~2.5 million light-years',
      radiusKm: null,
      orbitalPeriod: 'Approaching the Milky Way (~110 km/s)',
      rotationPeriod: 'Differential disk rotation',
      companions: 'M32, M110, and other dwarf satellites',
    },
    features: [
      {
        name: 'Disk and dust lanes',
        description:
          'A tilted spiral disk crossed by dark lanes — the familiar textbook silhouette of a nearby galaxy.',
      },
      {
        name: 'Satellite system',
        description:
          'Dwarf companions that trace Andromeda’s halo and past accretion events.',
      },
      {
        name: 'Local Group context',
        description:
          'Together with the Milky Way, Andromeda anchors the Local Group’s mass and future merger.',
      },
    ],
    sources: [
      {
        label: 'NASA — Andromeda Galaxy',
        url: 'https://science.nasa.gov/resource/andromeda-galaxy/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Andromeda',
        url: 'https://esahubble.org/images/heic1502a/',
        kind: 'agency',
      },
    ],
  },
]

export const spaceSubjects: SpaceSubject[] = spaceSubjectDrafts.map(withPhoto)

export function spaceSubjectSlugs(): string[] {
  return spaceSubjects.map((subject) => subject.slug)
}

export function getSpaceSubject(slug: string): SpaceSubject | undefined {
  return spaceSubjects.find((subject) => subject.slug === slug)
}

export function spaceSubjectsByCategory(): [string, SpaceSubject[]][] {
  const order: string[] = []
  const groups = new Map<string, SpaceSubject[]>()

  for (const subject of spaceSubjects) {
    const list = groups.get(subject.category)
    if (list) {
      list.push(subject)
    } else {
      order.push(subject.category)
      groups.set(subject.category, [subject])
    }
  }

  return order.map((category) => [category, groups.get(category)!])
}

export function spaceDescription(subject: SpaceSubject): string {
  return subject.about
}
