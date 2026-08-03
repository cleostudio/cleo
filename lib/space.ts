/** Space topic — factual about records for solar-system and deep-space subjects. */

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
  /** Neutral factual overview, ~150–250 words. */
  about: string
  facts: SpaceFacts
  /** Exactly three notable features. */
  features: [SpaceFeature, SpaceFeature, SpaceFeature]
  sources: SpaceSource[]
  /** Three distinct, locally hosted photographs: one hero plus two gallery views. */
  photos: [SpacePhoto, SpacePhoto, SpacePhoto]
}

type SpaceSubjectDraft = Omit<SpaceSubject, 'photos'>

const photoManifest = spacePhotos as Record<string, SpacePhoto[]>

function withPhotos(draft: SpaceSubjectDraft): SpaceSubject {
  const photos = photoManifest[draft.slug]
  if (!Array.isArray(photos) || photos.length !== 3) {
    throw new Error(`Missing three space photos for ${draft.slug}`)
  }
  return { ...draft, photos: photos as [SpacePhoto, SpacePhoto, SpacePhoto] }
}

/**
 * Curated catalog — Solar System bodies, major moons, the ISS, nearby galaxies,
 * and signature nebulae. Expand here as new Space pages ship.
 */
const spaceSubjectDrafts: SpaceSubjectDraft[] = [
  {
    slug: 'sun',
    code: 'SOL',
    name: 'Sun',
    category: 'Solar System',
    subtitle: 'G-type main-sequence star · Solar System',
    about:
      'The Sun is a G2V star at the center of the Solar System, whose gravity holds the planets, moons, dust, and other bodies in a shared dynamical system. It contains nearly all of the Solar System’s mass. Sunlight reaching Earth left the Sun’s visible surface, or photosphere, about eight minutes earlier.\nIts interior consists of a dense core, where nuclear fusion converts hydrogen into helium, a radiative zone that carries energy outward over long timescales, and a convective envelope in which hot plasma rises and cooler material descends. Above the photosphere lie the chromosphere and the corona, which extend outward into the solar wind. This flow of charged particles affects planetary magnetospheres throughout the Solar System.\nThe Sun is an ordinary star by galactic standards, but its proximity allows detailed study of sunspots, flares, and other changes in its atmosphere. Its mass, energy output, and structure provide the conditions under which the Solar System formed and continues to exist.',
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
      'Mercury is the innermost planet, a compact, airless world with cratered highlands and long scarps formed as the planet cooled and contracted. Its surface experiences extreme conditions: long periods of sunlight are followed by intense cold, while permanently shadowed craters near the poles can preserve water ice.\nMercury has a large metallic core and a relatively thin silicate shell, making it unusually dense for its size and suggesting a violent early history. It has no substantial atmosphere to moderate temperatures or scatter light, so the horizon remains sharp and the Sun appears several times larger than it does from Earth. Mercury rotates in a 3:2 spin-orbit resonance and completes a year quickly; its surface preserves impact features more clearly than planets shaped by weather.',
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
      'Venus is similar to Earth in size but has a very different climate. Its dense carbon-dioxide atmosphere, opaque sulfuric-acid clouds, and strong greenhouse effect keep the surface hotter than Mercury’s dayside despite Venus being farther from the Sun. Surface pressure is extreme, and visible light barely reaches the ground.\nThe landscape is volcanic and tectonic, with broad highlands, lava plains, and circular structures known as coronae. Much of the surface has been mapped by radar because the cloud cover prevents direct optical observation. Venus rotates slowly in a retrograde direction: its rotation period is longer than its orbital period when measured against the stars. Meanwhile, winds in the upper atmosphere carry clouds around the planet in only a few Earth days.',
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
      'Earth is a rocky planet orbiting the Sun in the habitable zone, with liquid water covering much of its surface. Its oceans, continents, atmosphere, magnetic field, and Moon shape conditions at the surface. From space, Earth appears blue and white because of its oceans, clouds, and swirling weather systems.\nEarth’s atmosphere is breathable in part because biological and geological processes exchange carbon, oxygen, and other materials over long periods. Plate tectonics and the hydrologic cycle continually reshape the surface and move matter between land, ocean, and air. The biosphere has substantially altered the composition of the atmosphere over geologic time.\nThe Moon helps stabilize Earth’s axial tilt and produces tides, while the Sun supplies the energy that drives weather, climate, and much of the planet’s living systems. Earth’s climate depends on sunlight, atmospheric composition, ocean circulation, and the close interaction of water, air, rock, and life.',
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
      'The Moon is Earth’s natural satellite and the only other world visited on foot by humans. Its near side contains dark maria, broad plains of ancient basalt, among bright, heavily cratered highlands. The far side is dominated by highlands and has far fewer maria. Tidally locked to Earth, the Moon keeps the same hemisphere facing the planet while individual locations experience about two weeks of daylight followed by two weeks of darkness.\nThe Moon has no substantial atmosphere, leaving shadows sharply defined and the sky black even in daylight. Its gravity raises tides on Earth and helps stabilize Earth’s axial tilt over long timescales. Basins, highlands, and craters preserve an impact record that weather, erosion, and tectonic activity have largely erased from Earth. Its crust formed after a giant impact early in Solar System history, making the Moon a nearby record of the Solar System’s early violent period.',
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
      'Mars is the outermost rocky planet, a cold desert world with polar ice, a thin atmosphere dominated by carbon dioxide, and landscapes shaped by ancient flowing water. Dust colors its sky, while volcanoes and canyons occur on scales unmatched on Earth within a single tectonic plate. A Martian day is close to an Earth day, but its year is nearly twice as long. Its tilted axis and eccentric orbit produce pronounced seasons.\nMajor features include the Tharsis bulge, the low-lying northern plains, and the older southern highlands. Ice deposits and layered sediments preserve records of past climate. Mars is smaller and drier than Earth, but its rocks retain evidence of an earlier, wetter period.',
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
      'Jupiter is the Solar System’s largest planet, a hydrogen–helium giant whose mass strongly influences the orbits of nearby bodies. Its atmosphere is marked by alternating cloud bands, the centuries-old Great Red Spot, and powerful storms. A strong magnetic field creates intense radiation belts around the planet.\nJupiter has dozens of moons, including Io, Europa, Ganymede, and Callisto, the Galilean moons first observed through a telescope in the early 17th century. The planet has no solid surface; pressure and temperature increase with depth until hydrogen enters a metallic state. Jupiter rotates rapidly, producing a short day, and follows a wide orbit around the Sun. Its gravity affects asteroids and comets and remains a major influence on the dynamics of the outer Solar System.',
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
      'Saturn is a giant planet composed mainly of hydrogen and is less dense than water. Its bright ring system, made largely of ice particles with rock and dust, forms a thin disk around the planet and is its most recognizable feature. Saturn’s atmosphere has subdued cloud bands and persistent storms, while its interior is thought to contain layers of hydrogen under increasing pressure, broadly similar to those of Jupiter.\nIts moons are also notable parts of the Saturnian system. Titan has a dense atmosphere and a methane-based weather cycle, including clouds, rain, rivers, and lakes. Enceladus contains a subsurface ocean that supplies water-rich plumes through fractures near its south pole. Saturn’s rings are structured by density waves and by the gravitational effects of nearby shepherd moons. The planet’s rapid rotation contributes to its noticeably flattened shape at the poles.',
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
      'Uranus is an ice giant with an axis tilted nearly into its orbital plane. Its poles take turns facing the Sun, producing seasons that last for decades. At an average distance of about 19 AU from the Sun, it receives weak sunlight and has a cold atmosphere. Methane absorbs red light in the atmosphere, giving the planet its pale cyan appearance.\nA narrow ring system and a group of dark moons orbit Uranus in the same unusual geometry. Its interior is thought to contain water, ammonia, and methane ices surrounding a rocky core, unlike the hydrogen-dominated interiors of Jupiter and Saturn. Weather patterns on Uranus are generally subtle at the resolution available from Earth and spacecraft observations.',
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
      'Neptune is the outermost planet in the Solar System, a deep-blue ice giant beyond Uranus. Its atmosphere contains the strongest measured winds in the Solar System, sweeping across cold cloud decks and driving dark storms that can appear and disappear within decades. Although sunlight at Neptune is faint, its atmosphere remains active through heat rising from the planet’s interior as well as energy from the Sun.\nNeptune was predicted through mathematical analysis of Uranus’s orbit before it was observed in 1846. Its largest moon, Triton, travels in a retrograde orbit, suggesting that it was captured from the Kuiper Belt. Triton has geyser-like plumes, while Neptune itself is surrounded by faint rings. Beyond Neptune lies the region of distant small bodies that includes the Kuiper Belt.',
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
      'Pluto is a dwarf planet in the Kuiper Belt, with ice mountains, nitrogen-ice plains, and a thin seasonal atmosphere. It is a differentiated icy body with an active surface shaped by volatile ices and other geological processes. Once classified as the Solar System’s ninth planet, Pluto was reclassified as a dwarf planet in 2006.\nPluto and its largest moon, Charon, orbit a shared center of mass outside Pluto, giving the pair characteristics of a binary system. Four smaller moons—Styx, Nix, Kerberos, and Hydra—orbit farther out. Close-range observations have identified the heart-shaped Sputnik Planitia basin, rugged water-ice highlands, and layers of atmospheric haze illuminated by weak sunlight.',
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
      'The asteroid belt is a broad annular region between Mars and Jupiter containing planetesimals that did not combine to form a planet. It is mostly empty space, with a total mass only a fraction of the Moon’s distributed across a vast area. Ceres, a dwarf planet, contains much of that mass. Vesta and other large asteroids retain basaltic crusts and iron cores formed during an early period of differentiation.\nJupiter’s gravitational resonances create the Kirkwood gaps and continually alter asteroid orbits. Rather than forming a dense wall of debris, the belt is a sparsely populated dynamical region whose rocks preserve evidence of the Solar System’s early formation.',
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
      'The International Space Station is a continuously inhabited laboratory in low Earth orbit, circling the planet about every ninety minutes. Built module by module by an international partnership, it contains pressurized living and working areas, solar arrays, docking ports, and visiting spacecraft. Crews conduct microgravity experiments, observe Earth systems, and maintain the equipment needed for long-duration human spaceflight.\nThe station operates between Earth’s atmosphere and the stronger radiation environment of deeper space. Its orbit produces a day-night cycle roughly every ninety minutes, while Earth’s blue curve provides the constant reference for down. The ISS supports research, international cooperation, and the development of systems for living and working beyond the atmosphere.',
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
      'Io is the innermost of Jupiter’s four large Galilean moons and the most volcanically active world known. Tidal flexing caused by Jupiter and neighboring moons heats and deforms its interior, driving hundreds of volcanoes that color the surface in sulfur yellows, reds, and blacks. Its crust has almost no impact craters because lava flows and volcanic plume deposits continuously resurface it.\nIo has a thin atmosphere dominated by sulfur dioxide, and some eruptions produce plumes rising high above the surface. Its orbital resonance with Europa and Ganymede helps maintain the tidal forces that power its volcanism. A rocky satellite rather than an icy moon, Io is continually reshaped by gravity-driven tidal heating.',
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
      'Europa is an ice-shelled moon of Jupiter, with a bright, fractured crust thought to be a few to tens of kilometers thick. Beneath the ice, evidence and models indicate a global saltwater ocean kept liquid by heat generated through Jupiter’s tidal pull. If those ocean models are correct, Europa may contain more water than Earth’s seas.\nIts surface is young by planetary standards and is marked by ridges, disrupted areas known as chaos terrain, and reddish stains where ice may have broken, shifted, and refrozen. Intense radiation from Jupiter makes the surface hostile, while any potentially significant chemistry would likely occur beneath the ice. Europa’s structure is defined by the interaction of its ice shell, subsurface ocean, and tidal heating.',
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
      'Ganymede is the largest moon in the Solar System, larger than Mercury, and the only moon known to generate its own magnetic field. Its surface includes dark, ancient cratered terrain and brighter regions of grooved ice shaped by tectonic stretching. Aurorae occur around its magnetic poles, and it has a very thin oxygen atmosphere.\nModels indicate that Ganymede has a differentiated interior, with layers that may include a deep saltwater ocean beneath its icy crust. It is locked in the Laplace resonance with Jupiter’s moons Io and Europa. Its magnetic field, ice-rich surface, and layered interior give it many physical characteristics associated with larger planetary bodies.',
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
      'Titan is Saturn’s largest moon and the only known satellite with a thick nitrogen atmosphere. Its orange haze obscures a surface at about 94 kelvin, where methane and ethane form clouds, rain, rivers, and lakes, especially near the poles. Hydrocarbon sand dunes and bright highlands shape parts of the landscape, while an organic-rich crust may overlie a water-ammonia ocean.\nObservations from the Huygens probe and Cassini spacecraft revealed Titan as a geologically varied world rather than a featureless icy body. Cassini radar mapped lakes, channels, dunes, and other surface features through the haze, while atmospheric measurements showed an active methane-based weather cycle with broad similarities to Earth’s water cycle.',
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
      'Enceladus is a small, bright icy moon of Saturn. Its south polar region vents water vapor and ice particles into space, forming plumes that feed Saturn’s diffuse E ring. The plumes also provide material from a subsurface ocean that is in contact with rock, where chemical reactions may occur.\nTiger-stripe fractures cross the active south polar terrain, while much of the rest of the moon is cold and heavily cratered. NASA’s Cassini spacecraft flew through the plumes and detected salts and organic compounds. The evidence indicates a heated, porous interior beneath Enceladus’s cracked ice shell and an ocean beneath the surface.',
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
    slug: 'callisto',
    code: 'CAL',
    name: 'Callisto',
    category: 'Moons',
    subtitle: 'Galilean moon · Jupiter',
    about:
      'Callisto is the outermost of Jupiter’s four Galilean moons and the most heavily cratered large body in the Solar System. Its icy surface preserves billions of years of impacts, with little evidence of later resurfacing. Valhalla and other multi-ring basins were formed by enormous ancient collisions, while dark, dusty terrain and bright ice scars cover much of the moon.\nMagnetic and gravity measurements suggest that a salty subsurface ocean may lie beneath Callisto’s battered ice crust. Farther from Jupiter than Io, Europa, and Ganymede, Callisto is colder and lies outside the planet’s strongest radiation belts. Images from the Galileo spacecraft documented a geologic record dominated by ancient impacts and long-term preservation.',
    facts: {
      kind: 'Moon',
      system: 'Jupiter',
      meanDistance: '1,882,700 km from Jupiter',
      radiusKm: 2410.3,
      orbitalPeriod: '16.69 Earth days',
      rotationPeriod: '16.69 Earth days (tidally locked)',
      companions: 'Jupiter; outermost Galilean moon',
    },
    features: [
      {
        name: 'Valhalla basin',
        description:
          'A vast multi-ring impact structure — one of the largest and oldest scars on any icy moon.',
      },
      {
        name: 'Cratered icy crust',
        description:
          'A densely cratered surface with little resurfacing, preserving a long impact record.',
      },
      {
        name: 'Subsurface ocean',
        description:
          'Evidence for a salty liquid layer within the ice shell, inferred from magnetic and gravity data.',
      },
    ],
    sources: [
      {
        label: 'NASA — Callisto',
        url: 'https://science.nasa.gov/jupiter/moons/callisto/',
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
    slug: 'triton',
    code: 'TRI',
    name: 'Triton',
    category: 'Moons',
    subtitle: 'Natural satellite · Neptune',
    about:
      'Triton is Neptune’s largest moon and one of the Solar System’s most unusual large satellites. It orbits in the direction opposite Neptune’s rotation, a retrograde path that suggests it was captured from the Kuiper Belt rather than formed around Neptune. Comparable in size to Pluto, Triton may be a former dwarf-planet-sized body altered by its capture into orbit.\nVoyager 2 observed a young, cold surface dominated by nitrogen ice, with dark streaks associated with polar geysers and regions of interlocking cellular landforms known as cantaloupe terrain. These features indicate internal heat and past cryovolcanic activity. Triton has a thin atmosphere and strong seasonal changes caused by its extreme axial tilt relative to the Sun. Its orbit is gradually decaying, while its surface shows evidence of continuing geological renewal in the outer Solar System.',
    facts: {
      kind: 'Moon',
      system: 'Neptune',
      meanDistance: '354,759 km from Neptune',
      radiusKm: 1353.4,
      orbitalPeriod: '5.88 Earth days (retrograde)',
      rotationPeriod: '5.88 Earth days (tidally locked)',
      companions: 'Neptune; likely captured Kuiper Belt object',
    },
    features: [
      {
        name: 'Retrograde orbit',
        description:
          'Triton circles Neptune opposite the planet’s rotation — strong evidence of capture.',
      },
      {
        name: 'Nitrogen geysers',
        description:
          'Dark polar plumes and streaks where subsurface nitrogen vents into the thin atmosphere.',
      },
      {
        name: 'Cantaloupe terrain',
        description:
          'A unique cellular landscape of ridges and pits unlike anything seen on other icy moons.',
      },
    ],
    sources: [
      {
        label: 'NASA — Triton',
        url: 'https://science.nasa.gov/neptune/moons/triton/',
        kind: 'agency',
      },
      {
        label: 'NASA Voyager mission',
        url: 'https://science.nasa.gov/mission/voyager/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'charon',
    code: 'CHA',
    name: 'Charon',
    category: 'Moons',
    subtitle: 'Natural satellite · Pluto',
    about:
      'Charon is Pluto’s largest companion and is about half Pluto’s diameter. The two bodies orbit a shared barycenter outside Pluto, making them a binary dwarf-planet system. They are tidally locked, with the same hemispheres facing each other, and complete an orbit every 6.4 days.\nImages from NASA’s New Horizons mission showed a varied icy surface, including older cratered highlands, smoother plains, and extensive canyon systems. Charon’s north polar region has a reddish cap, likely formed from gases escaping Pluto and becoming chemically altered after settling on Charon’s surface. Its shared history with Pluto may reflect capture or, more likely, formation after a giant impact that affected the geology and atmospheres of both bodies.',
    facts: {
      kind: 'Moon',
      system: 'Pluto',
      meanDistance: '19,591 km from Pluto',
      radiusKm: 606,
      orbitalPeriod: '6.39 Earth days',
      rotationPeriod: '6.39 Earth days (tidally locked)',
      companions: 'Pluto; barycenter outside Pluto',
    },
    features: [
      {
        name: 'Binary orbit',
        description:
          'Pluto and Charon orbit a shared barycenter outside Pluto — a double dwarf-planet system.',
      },
      {
        name: 'Red north polar cap',
        description:
          'A tholin-stained polar region fed by material that escaped Pluto’s atmosphere.',
      },
      {
        name: 'Canyon and plains terrain',
        description:
          'Deep fractures and smoother icy plains amid older cratered highlands.',
      },
    ],
    sources: [
      {
        label: 'NASA — Charon',
        url: 'https://science.nasa.gov/dwarf-planets/pluto/moons/charon/',
        kind: 'agency',
      },
      {
        label: 'NASA New Horizons mission',
        url: 'https://science.nasa.gov/mission/new-horizons/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'miranda',
    code: 'MIR',
    name: 'Miranda',
    category: 'Moons',
    subtitle: 'Natural satellite · Uranus',
    about:
      'Miranda is a small icy moon of Uranus, a few hundred kilometers across. Its surface contains sharply contrasting geologic provinces, including bright coronae with chevron-patterned terrain, ancient cratered plains, and large cliffs. Verona Rupes, observed by Voyager 2, is among the Solar System’s tallest known scarps and would dwarf Earth’s tallest walls.\nVoyager 2’s 1986 flyby remains the only close observation of Miranda and did not produce a complete global map. The moon’s fractured, varied terrain may reflect catastrophic disruption, incomplete internal differentiation, or periods of intense tidal heating.',
    facts: {
      kind: 'Moon',
      system: 'Uranus',
      meanDistance: '129,900 km from Uranus',
      radiusKm: 235.8,
      orbitalPeriod: '1.41 Earth days',
      rotationPeriod: '1.41 Earth days (tidally locked)',
      companions: 'Uranus; innermost of the five major Uranian moons',
    },
    features: [
      {
        name: 'Verona Rupes',
        description:
          'A towering fault scarp — among the tallest known cliffs in the Solar System.',
      },
      {
        name: 'Coronae',
        description:
          'Odd, ovoid provinces of ridges and bright ice that interrupt older cratered terrain.',
      },
      {
        name: 'Patchwork geology',
        description:
          'Sharply contrasting surface units that suggest extreme past upheaval or incomplete mixing.',
      },
    ],
    sources: [
      {
        label: 'NASA — Miranda',
        url: 'https://science.nasa.gov/uranus/moons/miranda/',
        kind: 'agency',
      },
      {
        label: 'NASA Voyager mission',
        url: 'https://science.nasa.gov/mission/voyager/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'iapetus',
    code: 'IAP',
    name: 'Iapetus',
    category: 'Moons',
    subtitle: 'Natural satellite · Saturn',
    about:
      'Iapetus is a moon of Saturn with a striking two-toned surface: one hemisphere is coated in dark, reddish material, while the other is covered in bright water ice. It also has a towering ridge along much of its equator, giving the moon a walnut-like silhouette. Cassini mapped both the sharp color contrast and the ridge’s peaks.\nThe dark material is associated with dust from Saturn’s outer retrograde moons and with thermal effects that limit the spread of bright ice onto the darker hemisphere. Iapetus’s most persistent features are its yin-yang appearance and its equatorial mountain belt. The precise process that formed the ridge remains uncertain.',
    facts: {
      kind: 'Moon',
      system: 'Saturn',
      meanDistance: '3,560,820 km from Saturn',
      radiusKm: 734.5,
      orbitalPeriod: '79.32 Earth days',
      rotationPeriod: '79.32 Earth days (tidally locked)',
      companions: 'Saturn; distant regular satellite',
    },
    features: [
      {
        name: 'Two-tone dichotomy',
        description:
          'A dark leading hemisphere and a bright trailing one — the starkest color contrast among large moons.',
      },
      {
        name: 'Equatorial ridge',
        description:
          'A mountain belt running much of the equator, giving Iapetus a distinctive walnut profile.',
      },
      {
        name: 'Distant Saturn orbit',
        description:
          'A long, slow path well outside Titan — cold, cratered, and shaped by outer-system dust.',
      },
    ],
    sources: [
      {
        label: 'NASA — Iapetus',
        url: 'https://science.nasa.gov/saturn/moons/iapetus/',
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
      'The Milky Way is a barred spiral galaxy of stars, gas, dust, and dark matter, spanning roughly 100,000 light-years. The Sun lies in a relatively quiet region of its spiral-arm structure and orbits the galactic center about once every few hundred million years. From Earth’s night side, the galaxy’s disk appears as a pale band across the sky.\nInfrared and radio observations show a central bar, molecular clouds, and a supermassive black hole at the nucleus. The Milky Way includes a stellar halo, disk, and central bulge, along with satellite galaxies gravitationally bound to it. The Solar System is one small part of this larger galactic structure.',
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
      'Andromeda, also known as M31, is the nearest major spiral galaxy to the Milky Way, about 2.5 million light-years away. Its light began traveling toward Earth when Australopithecus walked the planet. On dark autumn nights, it can appear to the unaided eye as a faint oval of light; telescopes reveal dust lanes, star clouds, and a bright central nucleus.\nBy many estimates, Andromeda is larger and more massive than the Milky Way and is accompanied by numerous dwarf satellite galaxies. Both galaxies belong to the Local Group, a collection of galaxies bound by gravity. Their mutual gravitational attraction is expected to bring them together in a merger billions of years from now.',
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
      'The Orion Nebula, also known as M42, is the nearest large star-forming region bright enough to be seen with the unaided eye as a fuzzy patch in Orion’s sword. It lies about 1,300–1,400 light-years from Earth. Hot young stars in its core carve cavities through gas and dust, illuminating the cloud from within and driving outflows that disperse surrounding natal material.\nOptical observations show glowing walls of ionized hydrogen, while infrared observations penetrate the haze to reveal embedded clusters and protoplanetary disks around young stars. The nebula’s layered gas, dust, cavities, and newly formed stars provide a nearby example of the processes by which stars and planetary systems assemble.',
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
      'The Crab Nebula, also known as M1, is the expanding debris of a star that exploded as a supernova in 1054 CE. The event was recorded by skywatchers across Eurasia. About 6,500 light-years away in the constellation Taurus, the remnant contains filaments of gas surrounding a central neutron star.\nThe neutron star is a pulsar that spins dozens of times per second. It injects energy into the surrounding material, producing synchrotron radiation and making the nebula visible across much of the electromagnetic spectrum. The Crab Nebula is a young core-collapse supernova remnant on cosmic timescales and is widely used as a calibration source in high-energy astronomy.',
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
      'The Carina Nebula, also cataloged as NGC 3372, is a vast star-forming complex in the southern sky. Massive stars within it carve pillars, cavities, and shock fronts into dense molecular clouds through intense ultraviolet radiation and powerful stellar winds. The region contains η Carinae, one of the Milky Way’s most massive and luminous stellar systems, along with rich clusters of young stars.\nLocated thousands of light-years away and spanning several degrees on the sky, the Carina Nebula is a more energetic stellar nursery than the Orion Nebula, with higher-mass stars, stronger winds, and extensive cold dust illuminated by ultraviolet light. Its ridges, dust pillars, and ionized gas have been imaged by Hubble and other observatories. These structures show stellar feedback in action as radiation, winds, and explosions from massive stars reshape the molecular cloud and influence later generations of star formation.',
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
  {
    slug: 'eagle-nebula',
    code: 'EGL',
    name: 'Eagle Nebula',
    category: 'Deep Space',
    subtitle: 'Star-forming nebula · Serpens',
    about:
      'The Eagle Nebula, also catalogued as M16, is a bright star-forming complex in the constellation Serpens about 5,700 to 7,000 light-years from Earth. It contains the open cluster NGC 6611, whose hot young stars illuminate surrounding hydrogen gas and carve cavities in the cloud. Dense, colder columns of gas and dust stand in silhouette against the glowing nebula.\nThe best-known structures are the Pillars of Creation, towering dusty columns in which embedded protostars are still forming. Infrared observations can penetrate much of the obscuring dust and reveal young stars within the cloud. The nebula shows how radiation and stellar winds from massive stars reshape the material from which they formed, dispersing some regions while compressing others. Its distance allows telescopes including Hubble to resolve individual ridges and pillars, while the observed light began its journey before recorded history.',
    facts: {
      kind: 'Nebula',
      system: 'Milky Way · Serpens',
      meanDistance: '~5,700–7,000 light-years',
      radiusKm: null,
      orbitalPeriod: 'Co-rotating with the local Galactic disk',
      rotationPeriod: 'Turbulent; not a solid body',
      companions: 'Open cluster NGC 6611',
    },
    features: [
      {
        name: 'Pillars of Creation',
        description:
          'Dense columns of gas and dust silhouetted against ionizing radiation from nearby massive stars.',
      },
      {
        name: 'NGC 6611',
        description:
          'A young open cluster whose hottest members light and sculpt the surrounding nebula.',
      },
      {
        name: 'Embedded star formation',
        description:
          'Protostars still forming inside the pillars — revealed most clearly at infrared wavelengths.',
      },
    ],
    sources: [
      {
        label: 'NASA — Eagle Nebula / Pillars of Creation',
        url: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-16/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Pillars of Creation',
        url: 'https://esahubble.org/images/heic1501a/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'whirlpool-galaxy',
    code: 'WHP',
    name: 'Whirlpool Galaxy',
    category: 'Deep Space',
    subtitle: 'Spiral galaxy · Canes Venatici',
    about:
      'The Whirlpool Galaxy, also known as M51, is a face-on grand-design spiral galaxy interacting closely with the smaller companion galaxy NGC 5195. Sharp spiral arms, marked by dark dust lanes and bright knots of star formation, wind outward from a luminous nucleus. Observations of M51 helped establish that the objects once called “spiral nebulae” are galaxies beyond the Milky Way.\nTidal forces between M51 and NGC 5195 have produced bridges of material and triggered star formation across tens of thousands of light-years. Located about 23–31 million light-years from Earth in the constellation Canes Venatici, the system is observed at many wavelengths, which reveal different components of its disk, including stars, warm dust, and high-energy emission.',
    facts: {
      kind: 'Galaxy',
      system: 'Canes Venatici · M51 group',
      meanDistance: '~23–31 million light-years',
      radiusKm: null,
      orbitalPeriod: 'Interacting with NGC 5195',
      rotationPeriod: 'Differential disk rotation',
      companions: 'NGC 5195',
    },
    features: [
      {
        name: 'Grand-design spiral arms',
        description:
          'Two prominent arms rich in dust lanes and star-forming knots — a classic face-on spiral silhouette.',
      },
      {
        name: 'NGC 5195 encounter',
        description:
          'A smaller companion whose gravity tugs bridges of gas and helps organize M51’s spiral pattern.',
      },
      {
        name: 'Multiwavelength disk',
        description:
          'Optical, infrared, and X-ray views that separate old stars, warm dust, and energetic processes in the same galaxy.',
      },
    ],
    sources: [
      {
        label: 'NASA — Whirlpool Galaxy (M51)',
        url: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-51/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Whirlpool Galaxy',
        url: 'https://esahubble.org/images/heic0506a/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'large-magellanic-cloud',
    code: 'LMC',
    name: 'Large Magellanic Cloud',
    category: 'Deep Space',
    subtitle: 'Satellite galaxy · Local Group',
    about:
      'The Large Magellanic Cloud (LMC) is the Milky Way’s brightest satellite galaxy. An irregular barred system of stars, gas, and dust, it is visible to the unaided eye from the Southern Hemisphere. It lies about 160,000 light-years away, close enough for astronomers to resolve individual gas clouds, star clusters, and stellar populations while remaining outside the Milky Way’s main disk.\nThe LMC contains the Tarantula Nebula, one of the most active nearby regions of star formation, along with numerous clusters, supernova remnants, and young massive stars. These features provide detailed evidence of stellar formation and evolution. The LMC and the Small Magellanic Cloud have undergone tidal interactions with each other and with the Milky Way, making the LMC part of the interacting galaxy system of the Local Group.',
    facts: {
      kind: 'Galaxy',
      system: 'Local Group · Magellanic Clouds',
      meanDistance: '~160,000 light-years',
      radiusKm: null,
      orbitalPeriod: 'Orbiting the Milky Way (Gyr-scale)',
      rotationPeriod: 'Irregular / barred disk kinematics',
      companions: 'Small Magellanic Cloud; Magellanic Stream',
    },
    features: [
      {
        name: 'Tarantula Nebula',
        description:
          '30 Doradus — a vast star-forming complex and one of the most active nearby stellar nurseries.',
      },
      {
        name: 'Barred irregular structure',
        description:
          'A bar and asymmetric arms of stars and gas shaped by internal dynamics and tidal forces.',
      },
      {
        name: 'Local Group satellite',
        description:
          'A bound companion of the Milky Way, linked to the Small Magellanic Cloud and the Magellanic Stream.',
      },
    ],
    sources: [
      {
        label: 'NASA — Large Magellanic Cloud',
        url: 'https://science.nasa.gov/resource/the-large-magellanic-cloud/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Large Magellanic Cloud',
        url: 'https://esahubble.org/images/heic1301a/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'helix-nebula',
    code: 'HLX',
    name: 'Helix Nebula',
    category: 'Deep Space',
    subtitle: 'Planetary nebula · Aquarius',
    about:
      'The Helix Nebula, cataloged as NGC 7293, is a bright planetary nebula in the constellation Aquarius, about 650–700 light-years from Earth. It is the expanding shell of gas expelled by a Sun-like star after its red-giant phase, leaving a hot white dwarf at its center. The nebula spans nearly half a degree in Earth’s sky and has a round, layered appearance that has led to nicknames including the “Eye of God.”\nInfrared observations show dust-rich knots and comet-shaped globules directed away from the central star, while ultraviolet maps trace the hot ionized cavity within the shell. The Helix Nebula illustrates a late stage in the evolution of stars similar to the Sun, whose outer layers will also be shed over billion-year timescales.',
    facts: {
      kind: 'Nebula',
      system: 'Milky Way · Aquarius',
      meanDistance: '~650–700 light-years',
      radiusKm: null,
      orbitalPeriod: 'Co-rotating with the local Galactic disk',
      rotationPeriod: 'Expanding shell; not a solid body',
      companions: 'Central white dwarf',
    },
    features: [
      {
        name: 'Central white dwarf',
        description:
          'The hot remnant core whose ultraviolet light ionizes the surrounding ejected envelope.',
      },
      {
        name: 'Cometary knots',
        description:
          'Dense dusty globules with tails pointing away from the center — sculpted by radiation and wind.',
      },
      {
        name: 'Layered planetary shell',
        description:
          'Nested rings and disks of gas that give the Helix its eye-like appearance across wavelengths.',
      },
    ],
    sources: [
      {
        label: 'NASA — Helix Nebula',
        url: 'https://www.nasa.gov/image-article/helix-nebula/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Helix Nebula',
        url: 'https://esahubble.org/images/heic0307a/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'horsehead-nebula',
    code: 'HRS',
    name: 'Horsehead Nebula',
    category: 'Deep Space',
    subtitle: 'Dark nebula · Orion',
    about:
      'The Horsehead Nebula, also cataloged as Barnard 33, is a dark cloud of cold dust silhouetted against the bright emission nebula IC 434 in Orion. Its well-known outline resembles a seahorse-shaped notch in glowing hydrogen south of Alnitak, the easternmost star in Orion’s Belt. The nearby Flame Nebula and a wider molecular cloud complex surround the region, where star formation is still taking place.\nThe nebula lies roughly 1,375 to 1,500 light-years from Earth, within the Orion molecular cloud region that also includes the Orion Nebula. In visible light, dense dust produces the familiar dark silhouette against ionized gas. Infrared observations reveal warmer dust within and around the cloud, changing the apparent horse-head shape into a brighter, more textured structure.',
    facts: {
      kind: 'Nebula',
      system: 'Milky Way · Orion Molecular Cloud',
      meanDistance: '~1,375–1,500 light-years',
      radiusKm: null,
      orbitalPeriod: 'Co-rotating with the local Galactic disk',
      rotationPeriod: 'Turbulent; not a solid body',
      companions: 'IC 434 emission nebula; Flame Nebula nearby',
    },
    features: [
      {
        name: 'Dark silhouette',
        description:
          'A dense dust cloud that blocks background light and carves the iconic horse-head shape against IC 434.',
      },
      {
        name: 'IC 434 glow',
        description:
          'The bright hydrogen emission backdrop that makes the Horsehead visible in optical light.',
      },
      {
        name: 'Infrared landscape',
        description:
          'Warm dust and embedded structure revealed when the nebula is viewed beyond visible wavelengths.',
      },
    ],
    sources: [
      {
        label: 'NASA — Horsehead Nebula',
        url: 'https://science.nasa.gov/asset/hubble/horsehead-nebula/',
        kind: 'agency',
      },
      {
        label: 'ESA Hubble — Horsehead Nebula',
        url: 'https://esahubble.org/images/heic1307a/',
        kind: 'agency',
      },
    ],
  },
]

export const spaceSubjects: SpaceSubject[] = spaceSubjectDrafts.map(withPhotos)

/** The first gallery image remains the Space guide hero. */
export function spaceFeaturedPhoto(subject: SpaceSubject): SpacePhoto {
  return subject.photos[0]
}

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
