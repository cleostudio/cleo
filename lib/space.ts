/** Space topic — evergreen reference articles for solar-system and deep-space subjects. */

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
  /** Body class: Star, Planet, Moon, Dwarf planet, Region, Galaxy, Nebula, Space station. */
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

/**
 * Curated catalog — Solar System bodies, major moons, the ISS, nearby galaxies,
 * and signature nebulae. Expand here as new Space articles ship.
 */
const spaceSubjectDrafts: SpaceSubjectDraft[] = [
  {
    slug: 'sun',
    code: 'SOL',
    name: 'Sun',
    category: 'Solar System',
    subtitle: 'G-type main-sequence star · Solar System',
    about:
      'The Sun is the gravitational heart of the Solar System — a G2V star holding planets, moons, and dust in a shared dynamical family. Nearly all of the system’s mass sits in this one sphere of plasma, and the light that reaches Earth left its photosphere about eight minutes earlier. Its structure is a dense core where fusion converts hydrogen to helium, a radiative zone that carries energy outward over long timescales, and a convective envelope that boils into the visible surface. Above that surface, the chromosphere and corona extend into the solar wind that shapes planetary magnetospheres. The Sun is ordinary among stars and singular for us: close enough that its spots, flares, and quiet glow can be studied as weather and as physics at once. This article focuses on durable facts — mass, scale, and the architecture that makes a planetary system possible — rather than forecast cycles or mission headlines.',
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
      'Mercury is the innermost planet — a compact, airless world of cratered highlands and long scarps left by ancient cooling. Days on Mercury are extreme: the surface faces the Sun for long stretches, then turns into a night cold enough to hold water ice in permanently shadowed polar craters. The planet’s large metallic core and thin silicate shell make it denser than its size suggests, a clue to a violent early history. There is no substantial atmosphere to soften temperature swings or paint a sky; the horizon stays sharp and the Sun appears several times larger than it does from Earth. Its defining geology and orbit include a 3:2 spin–orbit resonance, a short year, and a landscape that records impacts more clearly than weather. Mercury is less a destination than a boundary condition — how close a rocky planet can orbit a star and still keep a solid surface.',
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
      'Venus is Earth’s near twin in size and a lesson in divergent climate. A crushing carbon-dioxide atmosphere, opaque sulfuric clouds, and a runaway greenhouse keep the surface hotter than Mercury’s dayside despite a greater distance from the Sun. The landscape is volcanic and tectonic — broad highlands, lava plains, and circular coronae — mapped mostly by radar because visible light barely reaches the ground. Rotation is slow and retrograde, so a Venusian day outlasts its year when measured against the stars, while the upper clouds race around the planet in a few Earth days. Venus illustrates a central question in planetary atmospheres: what happens when a thick greenhouse seals a rocky world. The durable story is pressure, heat, and a geology written under clouds.',
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
      'Earth is the reference planet — oceans, continents, a protective magnetic field, and an atmosphere that stays breathable because biology and geology keep exchanging carbon and oxygen. From space it is a blue marble with swirling weather; up close it is plate tectonics, a hydrologic cycle, and a biosphere that has rewritten the air over geologic time. The Moon stabilizes obliquity and raises tides; the Sun sets the energy budget. This article treats Earth as one rocky world in a habitable-zone orbit, with liquid water at the surface and a climate system sensitive to composition and sunlight. The durable facts are mass, distance, and the unusual coupling of ocean, atmosphere, and life. Every country article on Cleo concerns this one sphere.',
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
    category: 'Moons',
    subtitle: 'Natural satellite · Earth',
    about:
      'The Moon is Earth’s companion and the only other world humans have walked. Its near side shows dark maria of ancient basalt and bright highlands saturated with craters; the far side is almost all highlands. Tidally locked, it keeps one face toward Earth while sunlight crawls across two weeks of day and two weeks of night. There is no substantial air, so shadows stay knife-edged and the sky is always black. The Moon raises tides, steadies Earth’s tilt over long timescales, and preserves an impact record mostly erased on our planet by weather and tectonics. Its geography is selenography: basins, highlands, and a crust born from a giant impact early in Solar System history. It remains the nearest archive of that violent youth.',
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
      'Mars is the outermost rocky planet — a cold desert world with polar ice, a thin carbon-dioxide air, and landscapes that once ran with water. Dust colors the sky; volcanoes and canyons reach scales Earth cannot match in a single plate. The planet’s day is nearly Earth-like, its year nearly twice as long, and its seasons are sharpened by a tilted axis and an eccentric orbit. Its durable geography includes the Tharsis bulge, the northern lowlands versus southern highlands, and climate archives locked in ice and layered sediments. Mars is often imagined as a second Earth; the physical evidence instead describes a smaller, drier sibling that still preserves an early wet chapter in rock.',
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
      'Jupiter is the Solar System’s largest planet — a hydrogen–helium giant whose mass shapes the architecture around it. Banded clouds, a centuries-old Great Red Spot, and a powerful magnetic field make it a weather engine and a radiation hazard at once. Dozens of moons form a miniature system, including the Galilean worlds that rewrote astronomy when first seen through a telescope. There is no solid surface to stand on; “depth” means pressure and temperature rising until hydrogen turns metallic. Its scale and influence are evident in a short day, a wide orbit, and a gravitational presence that shepherds asteroids and flings comets. Jupiter is less a place than a primary — a star that never ignited, still dominating the outer system’s dynamics.',
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
      'Saturn is the ringed giant — a hydrogen world less dense than water, wrapped in a disk of ice and rock so thin and bright it became the planet’s emblem. The atmosphere shows muted bands and long-lived storms; the interior likely mirrors Jupiter’s layered hydrogen physics at a smaller scale. Titan, with its thick air and methane cycle, and Enceladus, with its plume-fed subsurface ocean, make the satellite system a second subject almost as rich as the planet. Its architecture appears in rings sorted by density waves, shepherd moons, and a rapid spin that flattens the globe. Saturn teaches how a giant planet and its debris can coevolve into a single dynamical sculpture.',
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
      'Uranus is an ice giant rolled on its side — an axis tilted nearly into its orbital plane, so seasons last for decades and poles take turns facing the Sun. Methane in the atmosphere absorbs red light and leaves the planet a pale cyan. A narrow ring system and a family of dark moons orbit in that unusual geometry. The interior is thought to mix water, ammonia, and methane ices around a rocky core, distinct from the hydrogen-dominated gas giants. Its tilt and cold define the planet: sunlight is weak at ~19 AU, and the weather we resolve is subtle compared with Jupiter’s banners. Uranus is the Solar System’s quiet oddity — still a planet, still layered, but spun into a different seasonal clock.',
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
      'Neptune is the outermost planet — a deep blue ice giant where the strongest winds measured in the Solar System tear across cold cloud decks. Discovered by mathematics before it was seen, it anchors the classical planetary sequence beyond Uranus. Triton’s retrograde orbit and geyser-like plumes hint at capture from the Kuiper Belt. Faint rings and dark storms come and go on timescales shorter than a human career. Neptune combines remoteness and dynamics: sunlight is a dim coin, yet the atmosphere is restless, powered by internal heat as much as by the Sun. Neptune closes the set of major planets and opens the door to the small-body frontier beyond.',
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
      'Pluto is a Kuiper Belt world of ice mountains, nitrogen plains, and a thin seasonal atmosphere — reclassified as a dwarf planet yet undiminished as a geological story. Charon’s lockstep orbit makes the pair a true binary; smaller moons stitch a compact system. Close-range imaging revealed a heart-shaped basin of soft ices, rugged water-ice highlands, and haze layers catching the weak sunlight. Its physical story matters more than the old “ninth planet” argument: a differentiated icy body that still stirs its surface. Pluto shows that the outer Solar System is not a junk drawer of leftovers but a province of active, complex worlds.',
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
      'The asteroid belt is a broad annular zone between Mars and Jupiter where leftover planetesimals never finished building a planet. It is mostly empty space: the total mass is a fraction of the Moon’s, spread across countless kilometers. Ceres, a dwarf planet, dominates that mass; Vesta and other large asteroids preserve basaltic crusts and iron cores from an early differentiated generation. Resonances with Jupiter carve gaps (the Kirkwood gaps) and continually stir orbits. The belt is best understood as a region and a museum — not a rubble wall to dodge in every story, but a dynamical province where Solar System beginnings remain readable in rock.',
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
    slug: 'iss',
    code: 'ISS',
    name: 'International Space Station',
    category: 'Solar System',
    subtitle: 'Orbital laboratory · Low Earth orbit',
    about:
      'The International Space Station is a continuously inhabited laboratory circling Earth about every ninety minutes. Assembled module by module in low orbit, it is a joint outpost where crews run experiments in microgravity, watch Earth systems from above, and practice the logistics of living beyond the atmosphere. Its architecture is pressurized nodes, solar arrays, visiting vehicles, and a path that threads between atmosphere and the radiation of deeper space. The station is not a destination world — it is scaffolding for human presence, a place where the sky is a ninety-minute day-night cycle and “down” is always toward the blue curve. This article focuses on what the ISS is for: research, partnership, and a durable foothold just above the air.',
    facts: {
      kind: 'Space station',
      system: 'Low Earth orbit',
      meanDistance: '~400 km above Earth',
      radiusKm: null,
      orbitalPeriod: '~92 minutes',
      rotationPeriod: 'Attitude-controlled (orbital day/night ~45 min each)',
      companions: 'Crew vehicles and cargo craft on rotating schedules',
    },
    features: [
      {
        name: 'Pressurized modules',
        description:
          'Linked laboratories and living quarters where air, power, and thermal control make long stays possible.',
      },
      {
        name: 'Solar array wings',
        description:
          'Large photovoltaic arrays that track the Sun and feed the station’s electrical bus.',
      },
      {
        name: 'Cupola',
        description:
          'A seven-window observatory module used for Earth viewing, robotics, and visiting-vehicle operations.',
      },
    ],
    sources: [
      {
        label: 'NASA — International Space Station',
        url: 'https://www.nasa.gov/international-space-station/',
        kind: 'agency',
      },
      {
        label: 'ESA — International Space Station',
        url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'io',
    code: 'IOJ',
    name: 'Io',
    category: 'Moons',
    subtitle: 'Galilean moon · Jupiter',
    about:
      'Io is the innermost of Jupiter’s four large Galilean moons and the most volcanically active world known. Tidal flexing from Jupiter and neighboring moons kneads its interior, driving hundreds of volcanoes that paint the surface in sulfur yellows, reds, and blacks. There are almost no impact craters — lava and plume fallout resurface the crust continuously. Io is geology under stress: a thin atmosphere of sulfur dioxide, towering plumes, and a moon locked in resonance with Europa and Ganymede. Io is a laboratory for tidal heating, not a cold ice ball. This article keeps the durable picture — a rocky satellite remade by gravity — rather than any single eruption campaign.',
    facts: {
      kind: 'Moon',
      system: 'Jupiter',
      meanDistance: '421,700 km from Jupiter',
      radiusKm: 1821.6,
      orbitalPeriod: '1.77 Earth days',
      rotationPeriod: '1.77 Earth days (tidally locked)',
      companions: 'Jupiter; resonant with Europa and Ganymede',
    },
    features: [
      {
        name: 'Active volcanoes',
        description:
          'Hundreds of vents and lava lakes, some of the hottest surfaces in the Solar System.',
      },
      {
        name: 'Sulfur plains',
        description:
          'Colorful deposits of sulfur and sulfur dioxide frost that resurface the moon on short timescales.',
      },
      {
        name: 'Tidal heating',
        description:
          'Orbital resonance flexes Io’s interior, powering the volcanism that erases older terrain.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Io',
        url: 'https://solarsystem.nasa.gov/moons/jupiter-moons/io/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Galileo mission',
        url: 'https://science.nasa.gov/mission/galileo/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'europa',
    code: 'EUR',
    name: 'Europa',
    category: 'Moons',
    subtitle: 'Galilean moon · Jupiter',
    about:
      'Europa is an ice-shelled moon of Jupiter and one of the Solar System’s prime ocean worlds. A bright, cracked crust a few to tens of kilometers thick is thought to overlie a global saltwater ocean kept liquid by tidal heat. The surface is young by planetary standards — ridges, chaos terrain, and reddish stains mark places where the ice has broken and refrozen. Europa poses habitability without romance: a moon small enough to hold in a mental model, yet hiding more water than Earth’s seas if the ocean models hold. Radiation from Jupiter makes the surface hostile; the interesting chemistry, if any, would be below. This article stays with structure and evidence — ice, ocean, and the physics that keep both in play.',
    facts: {
      kind: 'Moon',
      system: 'Jupiter',
      meanDistance: '670,900 km from Jupiter',
      radiusKm: 1560.8,
      orbitalPeriod: '3.55 Earth days',
      rotationPeriod: '3.55 Earth days (tidally locked)',
      companions: 'Jupiter; resonant with Io and Ganymede',
    },
    features: [
      {
        name: 'Icy crust',
        description:
          'A bright, fractured shell of water ice crossed by ridges and chaos regions.',
      },
      {
        name: 'Subsurface ocean',
        description:
          'A global saltwater layer inferred from magnetic induction and geology, kept liquid by tidal heat.',
      },
      {
        name: 'Lineae',
        description:
          'Long reddish cracks and bands that record stress and possible exchange with material below.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Europa',
        url: 'https://solarsystem.nasa.gov/moons/jupiter-moons/europa/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Europa Clipper',
        url: 'https://science.nasa.gov/mission/europa-clipper/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'ganymede',
    code: 'GAN',
    name: 'Ganymede',
    category: 'Moons',
    subtitle: 'Galilean moon · Jupiter',
    about:
      'Ganymede is the largest moon in the Solar System — bigger than Mercury — and the only one known to generate its own magnetic field. Its surface mixes dark, ancient cratered terrain with brighter, grooved ice that tells of tectonic stretching. Beneath the crust, models point to a layered interior that may include a deep saltwater ocean. Its scale and complexity are unusual: a differentiated world with aurorae, a thin oxygen atmosphere, and a place in the Laplace resonance with Io and Europa. Ganymede is less a “planet-like moon” slogan than a body that simply grew large enough to behave like one. This article stays with that architecture — field, ice, and interior — without mission-of-the-week framing.',
    facts: {
      kind: 'Moon',
      system: 'Jupiter',
      meanDistance: '1,070,400 km from Jupiter',
      radiusKm: 2634.1,
      orbitalPeriod: '7.15 Earth days',
      rotationPeriod: '7.15 Earth days (tidally locked)',
      companions: 'Jupiter; resonant with Io and Europa',
    },
    features: [
      {
        name: 'Intrinsic magnetic field',
        description:
          'A dynamo-generated field unique among known moons, interacting with Jupiter’s magnetosphere.',
      },
      {
        name: 'Grooved terrain',
        description:
          'Bright, tectonically deformed ice that contrasts with darker, heavily cratered regions.',
      },
      {
        name: 'Differentiated interior',
        description:
          'A layered structure — ice, rock, and metal — with evidence for a deep subsurface ocean.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Ganymede',
        url: 'https://solarsystem.nasa.gov/moons/jupiter-moons/ganymede/overview/',
        kind: 'agency',
      },
      {
        label: 'ESA Juice mission',
        url: 'https://www.esa.int/Science_Exploration/Space_Science/Juice',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'titan',
    code: 'TIT',
    name: 'Titan',
    category: 'Moons',
    subtitle: 'Natural satellite · Saturn',
    about:
      'Titan is Saturn’s largest moon and the only satellite with a thick nitrogen atmosphere. Orange haze hides a cold surface where methane and ethane play the role water plays on Earth — clouds, rain, rivers, and lakes near the poles. Under the organic-rich crust, evidence points to a water-ammonia ocean. Titan’s climate chemistry unfolds at 94 kelvin: dunes of hydrocarbon sand, bright highlands, and a weather cycle that would feel familiar if the liquids were not methane. Huygens’s descent and Cassini’s radar mapped enough to make Titan a second geologic world, not just a featureless blob. This article stays with atmosphere, hydrology, and interior — the durable Titan — rather than any single flyby highlight.',
    facts: {
      kind: 'Moon',
      system: 'Saturn',
      meanDistance: '1,221,870 km from Saturn',
      radiusKm: 2574.7,
      orbitalPeriod: '15.95 Earth days',
      rotationPeriod: '15.95 Earth days (tidally locked)',
      companions: 'Saturn; thick N₂ atmosphere',
    },
    features: [
      {
        name: 'Thick atmosphere',
        description:
          'A nitrogen-rich envelope with organic haze layers that hide the surface at visible wavelengths.',
      },
      {
        name: 'Methane lakes',
        description:
          'Polar seas and lakes of liquid methane and ethane — an active hydrological cycle of organics.',
      },
      {
        name: 'Equatorial dunes',
        description:
          'Vast linear dunes of organic sand shaped by Titan’s slow winds.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Titan',
        url: 'https://solarsystem.nasa.gov/moons/saturn-moons/titan/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Cassini mission',
        url: 'https://science.nasa.gov/mission/cassini/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'enceladus',
    code: 'ENC',
    name: 'Enceladus',
    category: 'Moons',
    subtitle: 'Natural satellite · Saturn',
    about:
      'Enceladus is a small, bright icy moon of Saturn whose south polar region vents water vapor and ice into space. Those plumes feed a diffuse ring and, more importantly, sample a subsurface ocean that contacts rock — a setting where chemistry can run. Tiger-stripe fractures mark the active pole; the rest of the moon is cratered and cold. Enceladus is a study in contrast: a world you could almost circle in an afternoon of imagination, yet one that punches above its size for ocean science. Cassini flew through the plumes and tasted salts and organics; the durable story is a heated, porous interior under a cracked shell. This article keeps that ocean-moon picture rather than any single plume-brightness headline.',
    facts: {
      kind: 'Moon',
      system: 'Saturn',
      meanDistance: '238,020 km from Saturn',
      radiusKm: 252.1,
      orbitalPeriod: '1.37 Earth days',
      rotationPeriod: '1.37 Earth days (tidally locked)',
      companions: 'Saturn; feeds the E ring via plumes',
    },
    features: [
      {
        name: 'South polar plumes',
        description:
          'Jets of water vapor and ice grains erupting from warm fractures at the south pole.',
      },
      {
        name: 'Tiger stripes',
        description:
          'Parallel tectonic troughs that mark the active, heated region of the crust.',
      },
      {
        name: 'Subsurface ocean',
        description:
          'A global or regional saltwater layer beneath the ice, sampled indirectly by plume chemistry.',
      },
    ],
    sources: [
      {
        label: 'NASA Solar System Exploration — Enceladus',
        url: 'https://solarsystem.nasa.gov/moons/saturn-moons/enceladus/overview/',
        kind: 'agency',
      },
      {
        label: 'NASA Cassini mission',
        url: 'https://science.nasa.gov/mission/cassini/',
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
      'The Milky Way is our galaxy — a barred spiral of stars, gas, dust, and dark matter spanning on the order of a hundred thousand light-years. The Sun sits in a quiet stretch of a spiral-arm environment, orbiting the center once every couple of hundred million years. From Earth’s night side the disk appears as a pale band; infrared and radio maps reveal a central bar, molecular clouds, and a supermassive black hole in the nucleus. It places planets within a larger structure: halo, disk, bulge, and the satellite galaxies bound alongside. This article stays with architecture and membership, not with transient astronomical alerts. Every Solar System article on Cleo is a footnote inside this one galaxy.',
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
      'Andromeda (M31) is the nearest major spiral galaxy and the Milky Way’s future partner in a slow gravitational waltz. On a dark autumn night it appears as a soft oval to the unaided eye; telescopes resolve dust lanes, star clouds, and a bright nucleus. It is larger and more massive than the Milky Way by many estimates, with its own retinue of dwarf satellites. Andromeda is neighborliness at cosmic scale: about 2.5 million light-years away, still close enough that its light left when Australopithecus walked Earth. The durable story is structure and destiny — two large spirals in the Local Group that will eventually merge — without treating the merger as imminent drama. Andromeda is simply the next island over in our galactic archipelago.',
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
  {
    slug: 'orion-nebula',
    code: 'ORI',
    name: 'Orion Nebula',
    category: 'Deep Space',
    subtitle: 'Star-forming nebula · Orion',
    about:
      'The Orion Nebula (M42) is the nearest large star-forming region bright enough to see with the unaided eye as a fuzzy patch in Orion’s sword. Hot young stars in its core carve cavities in gas and dust, lighting the cloud from within and driving outflows that shred natal material. Infrared views pierce the haze to reveal protoplanetary disks and embedded clusters; optical views show the glowing walls of ionized hydrogen. The nebula is a stellar nursery at a human scale of night-sky familiarity: about 1,300–1,400 light-years away, close enough that its structure is a textbook for how stars assemble. This article stays with the cloud’s architecture and role — a factory floor for stars — not with transient brightness alerts.',
    facts: {
      kind: 'Nebula',
      system: 'Milky Way · Orion Molecular Cloud',
      meanDistance: '~1,350 light-years',
      radiusKm: null,
      orbitalPeriod: 'Co-rotating with the local Galactic disk',
      rotationPeriod: 'Turbulent; not a solid body',
      companions: 'Trapezium cluster and embedded young stars',
    },
    features: [
      {
        name: 'Trapezium',
        description:
          'A tight group of hot young stars that ionize and sculpt the nebula’s bright core.',
      },
      {
        name: 'Ionization front',
        description:
          'Glowing walls where ultraviolet light from massive stars meets cold molecular gas.',
      },
      {
        name: 'Protoplanetary disks',
        description:
          'Circumstellar disks around young stars — raw material for future planetary systems.',
      },
    ],
    sources: [
      {
        label: 'NASA — Orion Nebula',
        url: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-42/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Orion Nebula',
        url: 'https://esahubble.org/images/heic0601a/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'crab-nebula',
    code: 'CRB',
    name: 'Crab Nebula',
    category: 'Deep Space',
    subtitle: 'Supernova remnant · Taurus',
    about:
      'The Crab Nebula (M1) is the expanding debris of a star that exploded in 1054 CE — a supernova recorded by skywatchers across Eurasia. At its center, a pulsar spins dozens of times per second, injecting energy that lights filaments of gas and a synchrotron nebula across the spectrum. The Crab is a study in aftermath: what a core-collapse leaves behind when the remnant is still young on cosmic clocks. Roughly 6,500 light-years away in Taurus, the Crab is a calibration source for high-energy astronomy and a vivid case study in how neutron stars power their surroundings. This article stays with the remnant’s structure and engine, not with day-to-day flux monitoring.',
    facts: {
      kind: 'Nebula',
      system: 'Milky Way · Taurus',
      meanDistance: '~6,500 light-years',
      radiusKm: null,
      orbitalPeriod: 'Expanding remnant (~1,500 km/s scale)',
      rotationPeriod: 'Central pulsar period ~33 ms',
      companions: 'Crab pulsar (neutron star)',
    },
    features: [
      {
        name: 'Crab pulsar',
        description:
          'A rapidly spinning neutron star that powers the nebula’s glow across the electromagnetic spectrum.',
      },
      {
        name: 'Filamentary ejecta',
        description:
          'Tangled strands of enriched gas from the exploded star, expanding into space.',
      },
      {
        name: 'Synchrotron nebula',
        description:
          'A continuum glow from relativistic electrons spiraling in magnetic fields.',
      },
    ],
    sources: [
      {
        label: 'NASA — Crab Nebula',
        url: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-1/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Crab Nebula',
        url: 'https://esahubble.org/images/heic0515a/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'carina-nebula',
    code: 'CAR',
    name: 'Carina Nebula',
    category: 'Deep Space',
    subtitle: 'Star-forming nebula · Carina',
    about:
      'The Carina Nebula (NGC 3372) is a vast southern star-forming complex where massive stars carve pillars, cavities, and shock fronts into dense clouds. Home to η Carinae and rich clusters of young stars, it is a more violent nursery than Orion — higher masses, stronger winds, and a landscape of cold dust lit by ultraviolet glare. Carina is southern-sky grandeur: thousands of light-years away, spanning degrees on the sky, a region where stellar feedback is rewriting the molecular cloud in real geologic time. Hubble and other observatories have turned its ridges into iconic “landscapes,” but the durable story is feedback physics — how the biggest stars shape the next generation. This article stays with that role and structure.',
    facts: {
      kind: 'Nebula',
      system: 'Milky Way · Carina–Sagittarius arm',
      meanDistance: '~7,500 light-years',
      radiusKm: null,
      orbitalPeriod: 'Co-rotating with the local Galactic disk',
      rotationPeriod: 'Turbulent; not a solid body',
      companions: 'η Carinae and young massive clusters',
    },
    features: [
      {
        name: 'Massive star feedback',
        description:
          'Winds and radiation from O-type stars that sculpt pillars and clear cavities in the cloud.',
      },
      {
        name: 'η Carinae',
        description:
          'A luminous, unstable stellar system whose outbursts and winds dominate the nebula’s energetics.',
      },
      {
        name: 'Dust pillars',
        description:
          'Cold, dense columns of gas and dust — lingering nurseries inside a harsh ultraviolet environment.',
      },
    ],
    sources: [
      {
        label: 'NASA — Carina Nebula',
        url: 'https://science.nasa.gov/asset/hubble/carina-nebula-detail/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Carina Nebula',
        url: 'https://esahubble.org/images/heic0707a/',
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
