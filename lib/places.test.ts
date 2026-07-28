import { describe, expect, it } from 'vitest'

import { countrySlugs } from './countries'
import {
  assertPlaceCatalogIntegrity,
  getPlaceGuide,
  matchPlaceGuideForBlurb,
  placeGuideSlugs,
  placeGuides,
  placeGuidesByKind,
  placeHref,
  placesForCountry,
} from './places'

describe('place guides', () => {
  it('ships a curated catalog with unique slugs and codes', () => {
    expect(placeGuides.length).toBeGreaterThanOrEqual(736)

    const slugs = placeGuides.map((place) => place.slug)
    const codes = placeGuides.map((place) => place.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(placeGuideSlugs()).toEqual(slugs)
    expect(() => assertPlaceCatalogIntegrity()).not.toThrow()
  })

  it('keeps each guide structured like a field record with a local photograph', () => {
    for (const place of placeGuides) {
      expect(place.about.length).toBeGreaterThan(120)
      expect(place.features).toHaveLength(3)
      expect(place.sources.length).toBeGreaterThanOrEqual(1)
      expect(place.facts.kind).toBeTruthy()
      expect(place.facts.country).toBeTruthy()
      expect(countrySlugs()).toContain(place.countrySlug)
      expect(place.photo.renditions).toHaveLength(3)
      expect(
        place.photo.renditions.every((r) =>
          r.src.startsWith(`/images/places/${place.slug}/`),
        ),
      ).toBe(true)
      expect(getPlaceGuide(place.slug)).toEqual(place)
      expect(placeHref(place)).toBe(`/explore/${place.countrySlug}/${place.slug}`)
    }
  })

  it('groups places by kind and parents them to countries', () => {
    const kinds = placeGuidesByKind().map(([kind]) => kind)
    expect(kinds).toEqual(
      expect.arrayContaining(['City', 'State', 'Region', 'Island', 'Landmark']),
    )
    expect(placesForCountry('japan').some((place) => place.slug === 'tokyo')).toBe(
      true,
    )
    expect(matchPlaceGuideForBlurb('japan', 'Mount Fuji')?.slug).toBe('mount-fuji')
    expect(matchPlaceGuideForBlurb('greece', 'Santorini Caldera')?.slug).toBe(
      'santorini',
    )
    expect(matchPlaceGuideForBlurb('china', 'Great Wall of China')?.slug).toBe(
      'great-wall',
    )
    expect(matchPlaceGuideForBlurb('vietnam', 'Ha Long Bay')?.slug).toBe(
      'ha-long-bay',
    )
    expect(matchPlaceGuideForBlurb('france', 'Mont Saint-Michel')?.slug).toBe(
      'mont-saint-michel',
    )
    expect(matchPlaceGuideForBlurb('canada', 'Banff National Park')?.slug).toBe(
      'banff',
    )
    expect(matchPlaceGuideForBlurb('tanzania', 'Mount Kilimanjaro')?.slug).toBe(
      'kilimanjaro',
    )
    expect(matchPlaceGuideForBlurb('india', 'New Delhi')?.slug).toBe('delhi')
    expect(matchPlaceGuideForBlurb('mexico', 'Chichen Itza')?.slug).toBe(
      'chichen-itza',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Stonehenge')?.slug).toBe(
      'stonehenge',
    )
    expect(
      matchPlaceGuideForBlurb('brazil', 'Christ the Redeemer')?.slug,
    ).toBe('christ-the-redeemer')
    expect(matchPlaceGuideForBlurb('vietnam', 'Saigon')?.slug).toBe(
      'ho-chi-minh',
    )
    expect(
      matchPlaceGuideForBlurb('spain', 'Sagrada Familia')?.slug,
    ).toBe('sagrada-familia')
    expect(matchPlaceGuideForBlurb('japan', 'Fushimi Inari')?.slug).toBe(
      'fushimi-inari',
    )
    expect(matchPlaceGuideForBlurb('france', 'Eiffel Tower')?.slug).toBe(
      'eiffel-tower',
    )
    expect(matchPlaceGuideForBlurb('italy', 'Colosseum')?.slug).toBe(
      'colosseum',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Statue of Liberty')?.slug,
    ).toBe('statue-of-liberty')
    expect(
      matchPlaceGuideForBlurb('australia', 'Sydney Opera House')?.slug,
    ).toBe('sydney-opera-house')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Golden Gate Bridge')?.slug,
    ).toBe('golden-gate')
    expect(matchPlaceGuideForBlurb('greece', 'Acropolis of Athens')?.slug).toBe(
      'acropolis',
    )
    expect(
      matchPlaceGuideForBlurb('italy', 'Leaning Tower of Pisa')?.slug,
    ).toBe('leaning-tower')
    expect(matchPlaceGuideForBlurb('turkiye', 'Hagia Sophia')?.slug).toBe(
      'hagia-sophia',
    )
    expect(matchPlaceGuideForBlurb('turkiye', 'Blue Mosque')?.slug).toBe(
      'blue-mosque',
    )
    expect(
      matchPlaceGuideForBlurb('germany', 'Brandenburg Gate')?.slug,
    ).toBe('brandenburg-gate')
    expect(matchPlaceGuideForBlurb('italy', 'Trevi Fountain')?.slug).toBe(
      'trevi-fountain',
    )
    expect(matchPlaceGuideForBlurb('france', 'Arc de Triomphe')?.slug).toBe(
      'arc-de-triomphe',
    )
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Tower Bridge')?.slug,
    ).toBe('tower-bridge')
    expect(matchPlaceGuideForBlurb('italy', 'Duomo di Milano')?.slug).toBe(
      'duomo-milan',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Sacramento')?.slug).toBe(
      'sacramento',
    )
    expect(matchPlaceGuideForBlurb('canada', 'Winnipeg')?.slug).toBe('winnipeg')
    expect(matchPlaceGuideForBlurb('croatia', 'Zagreb')?.slug).toBe('zagreb')
    expect(
      matchPlaceGuideForBlurb('bosnia-and-herzegovina', 'Sarajevo')?.slug,
    ).toBe('sarajevo')
    expect(matchPlaceGuideForBlurb('india', 'Cochin')?.slug).toBe('kochi')
    expect(matchPlaceGuideForBlurb('united-states', 'Ohio')?.slug).toBe('ohio')
    expect(matchPlaceGuideForBlurb('greece', 'Amorgos')?.slug).toBe('amorgos')
    expect(matchPlaceGuideForBlurb('italy', 'Apulia')?.slug).toBe('puglia')
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Elizabeth Tower')?.slug,
    ).toBe('big-ben')
    expect(
      matchPlaceGuideForBlurb('france', 'Notre-Dame de Paris')?.slug,
    ).toBe('notre-dame')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Lincoln Memorial')?.slug,
    ).toBe('lincoln-memorial')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Mount Rainier')?.slug,
    ).toBe('mount-rainier')
    expect(matchPlaceGuideForBlurb('russia', 'Red Square')?.slug).toBe(
      'red-square',
    )
    expect(matchPlaceGuideForBlurb('canada', 'CN Tower')?.slug).toBe('cn-tower')
    expect(matchPlaceGuideForBlurb('united-states', 'Charlotte')?.slug).toBe(
      'charlotte',
    )
    expect(matchPlaceGuideForBlurb('croatia', 'Dubrovnik')?.slug).toBe(
      'dubrovnik',
    )
    expect(matchPlaceGuideForBlurb('albania', 'Tirana')?.slug).toBe('tirana')
    expect(matchPlaceGuideForBlurb('united-states', 'Illinois')?.slug).toBe(
      'illinois',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Sifnos')?.slug).toBe('sifnos')
    expect(matchPlaceGuideForBlurb('spain', 'Asturias')?.slug).toBe('asturias')
    expect(matchPlaceGuideForBlurb('united-kingdom', 'London Eye')?.slug).toBe(
      'london-eye',
    )
    expect(matchPlaceGuideForBlurb('france', 'Sacré-Cœur')?.slug).toBe(
      'sacre-coeur',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Devils Tower')?.slug,
    ).toBe('devils-tower')
    expect(matchPlaceGuideForBlurb('united-states', 'Crater Lake')?.slug).toBe(
      'crater-lake',
    )
    expect(
      matchPlaceGuideForBlurb('spain', 'Alcázar of Seville')?.slug,
    ).toBe('alcazar-seville')
    expect(
      matchPlaceGuideForBlurb('germany', 'Hohenzollern Castle')?.slug,
    ).toBe('hohenzollern')
    expect(matchPlaceGuideForBlurb('united-states', 'Richmond')?.slug).toBe(
      'richmond',
    )
    expect(matchPlaceGuideForBlurb('croatia', 'Split')?.slug).toBe('split')
    expect(matchPlaceGuideForBlurb('india', 'Banaras')?.slug).toBe('varanasi')
    expect(
      matchPlaceGuideForBlurb('north-macedonia', 'Skopje')?.slug,
    ).toBe('skopje')
    expect(matchPlaceGuideForBlurb('united-states', 'Pennsylvania')?.slug).toBe(
      'pennsylvania',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Milos')?.slug).toBe('milos')
    expect(matchPlaceGuideForBlurb('italy', 'Liguria')?.slug).toBe('liguria')
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Tower of London')?.slug,
    ).toBe('tower-of-london')
    expect(matchPlaceGuideForBlurb('france', 'Panthéon')?.slug).toBe(
      'pantheon-paris',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Badlands National Park')?.slug,
    ).toBe('badlands')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Acadia National Park')?.slug,
    ).toBe('acadia')
    expect(matchPlaceGuideForBlurb('germany', 'Wartburg Castle')?.slug).toBe(
      'wartburg',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Gateway Arch')?.slug).toBe(
      'gateway-arch',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Buffalo')?.slug).toBe(
      'buffalo',
    )
    expect(matchPlaceGuideForBlurb('argentina', 'Ushuaia')?.slug).toBe('ushuaia')
    expect(matchPlaceGuideForBlurb('brazil', 'Belém')?.slug).toBe('belem')
    expect(matchPlaceGuideForBlurb('japan', 'Nara')?.slug).toBe('nara')
    expect(matchPlaceGuideForBlurb('united-states', 'Missouri')?.slug).toBe(
      'missouri',
    )
    expect(matchPlaceGuideForBlurb('canada', 'Yukon')?.slug).toBe('yukon')
    expect(matchPlaceGuideForBlurb('greece', 'Lesvos')?.slug).toBe('lesbos')
    expect(matchPlaceGuideForBlurb('netherlands', 'Curaçao')?.slug).toBe(
      'curacao',
    )
    expect(matchPlaceGuideForBlurb('italy', 'Lombardia')?.slug).toBe('lombardy')
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Houses of Parliament')?.slug,
    ).toBe('westminster-palace')
    expect(matchPlaceGuideForBlurb('france', 'Louvre Museum')?.slug).toBe(
      'louvre',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Everglades National Park')
        ?.slug,
    ).toBe('everglades')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Sequoia National Park')?.slug,
    ).toBe('sequoia')
    expect(matchPlaceGuideForBlurb('germany', 'Kölner Dom')?.slug).toBe(
      'cologne-cathedral',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Independence Hall')?.slug,
    ).toBe('independence-hall')
    expect(matchPlaceGuideForBlurb('united-states', 'Rochester')?.slug).toBe(
      'rochester',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Spokane')?.slug).toBe(
      'spokane',
    )
    expect(matchPlaceGuideForBlurb('chile', 'Concepción')?.slug).toBe(
      'concepcion',
    )
    expect(matchPlaceGuideForBlurb('brazil', 'Florianópolis')?.slug).toBe(
      'florianopolis',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Iowa')?.slug).toBe('iowa')
    expect(
      matchPlaceGuideForBlurb('canada', 'Northwest Territories')?.slug,
    ).toBe('northwest-territories')
    expect(matchPlaceGuideForBlurb('greece', 'Icaria')?.slug).toBe('ikaria')
    expect(matchPlaceGuideForBlurb('france', 'Saint Martin')?.slug).toBe(
      'st-martin',
    )
    expect(matchPlaceGuideForBlurb('netherlands', 'Sint Maarten')?.slug).toBe(
      'sint-maarten',
    )
    expect(matchPlaceGuideForBlurb('romania', 'Wallachia')?.slug).toBe(
      'muntenia',
    )
    expect(
      matchPlaceGuideForBlurb('united-kingdom', "Nelson's Column")?.slug,
    ).toBe('trafalgar-square')
    expect(matchPlaceGuideForBlurb('france', 'Sainte Chapelle')?.slug).toBe(
      'sainte-chapelle',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Glacier National Park')?.slug,
    ).toBe('glacier')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Olympic National Park')?.slug,
    ).toBe('olympic')
    expect(matchPlaceGuideForBlurb('germany', 'Dresden Zwinger')?.slug).toBe(
      'zwinger',
    )
    expect(
      matchPlaceGuideForBlurb('germany', 'Schloss Heidelberg')?.slug,
    ).toBe('heidelberg-castle')
    expect(matchPlaceGuideForBlurb('united-states', 'Tulsa')?.slug).toBe(
      'tulsa',
    )
    expect(matchPlaceGuideForBlurb('canada', 'Hamilton')?.slug).toBe(
      'hamilton',
    )
    expect(matchPlaceGuideForBlurb('brazil', 'Maceio')?.slug).toBe('maceio')
    expect(matchPlaceGuideForBlurb('spain', 'Bilbao')?.slug).toBe('bilbao')
    expect(matchPlaceGuideForBlurb('united-states', 'Kansas')?.slug).toBe(
      'kansas',
    )
    expect(matchPlaceGuideForBlurb('india', 'Himachal')?.slug).toBe(
      'himachal-pradesh',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Rùm')?.slug).toBe('rum')
    expect(matchPlaceGuideForBlurb('greece', 'Tzia')?.slug).toBe('kea')
    expect(matchPlaceGuideForBlurb('italy', 'Emilia Romagna')?.slug).toBe(
      'emilia-romagna',
    )
    expect(matchPlaceGuideForBlurb('spain', 'Euskadi')?.slug).toBe(
      'basque-country',
    )
    expect(matchPlaceGuideForBlurb('france', 'Orsay Museum')?.slug).toBe(
      'orsay',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Canyon de Chelly')?.slug,
    ).toBe('canyon-de-chelly')
    expect(matchPlaceGuideForBlurb('japan', 'White Heron Castle')?.slug).toBe(
      'himeji-castle',
    )
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Edinburgh Castle')?.slug,
    ).toBe('edinburgh-castle')
    expect(matchPlaceGuideForBlurb('spain', 'Parc Güell')?.slug).toBe(
      'park-guell',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Des Moines')?.slug).toBe(
      'des-moines',
    )
    expect(matchPlaceGuideForBlurb('canada', 'London Ontario')?.slug).toBe(
      'london-ontario',
    )
    expect(matchPlaceGuideForBlurb('serbia', 'Novi Sad')?.slug).toBe(
      'novi-sad',
    )
    expect(matchPlaceGuideForBlurb('ukraine', 'Lemberg')?.slug).toBe('lviv')
    expect(matchPlaceGuideForBlurb('poland', 'Danzig')?.slug).toBe('gdansk')
    expect(matchPlaceGuideForBlurb('italy', 'Genova')?.slug).toBe('genoa')
    expect(matchPlaceGuideForBlurb('united-states', 'Arkansas')?.slug).toBe(
      'arkansas',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Thermia')?.slug).toBe('kythnos')
    expect(matchPlaceGuideForBlurb('italy', 'Le Marche')?.slug).toBe('marche')
    expect(
      matchPlaceGuideForBlurb('italy', 'Friuli-Venezia Giulia')?.slug,
    ).toBe('friuli')
    expect(matchPlaceGuideForBlurb('japan', 'Kinkaku-ji')?.slug).toBe(
      'golden-pavilion',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Empire State Building')?.slug,
    ).toBe('empire-state')
    expect(
      matchPlaceGuideForBlurb('spain', 'Mosque-Cathedral of Córdoba')?.slug,
    ).toBe('mezquita')
    expect(
      matchPlaceGuideForBlurb('spain', 'Alcázar of Segovia')?.slug,
    ).toBe('alcazar-segovia')
    expect(matchPlaceGuideForBlurb('united-states', 'Orlando')?.slug).toBe(
      'orlando',
    )
    expect(matchPlaceGuideForBlurb('australia', 'Perth')?.slug).toBe('perth')
    expect(
      matchPlaceGuideForBlurb('new-zealand', 'Christchurch')?.slug,
    ).toBe('christchurch')
    expect(matchPlaceGuideForBlurb('poland', 'Breslau')?.slug).toBe('wroclaw')
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Cardiff')?.slug).toBe(
      'cardiff',
    )
    expect(matchPlaceGuideForBlurb('mexico', 'Monterrey')?.slug).toBe(
      'monterrey',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Louisiana')?.slug).toBe(
      'louisiana',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Aigina')?.slug).toBe('aegina')
    expect(matchPlaceGuideForBlurb('tunisia', 'Jerba')?.slug).toBe('djerba')
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Orkney Islands')?.slug,
    ).toBe('orkney')
    expect(matchPlaceGuideForBlurb('germany', 'Thüringen')?.slug).toBe(
      'thuringia',
    )
    expect(
      matchPlaceGuideForBlurb('france', 'Languedoc-Roussillon')?.slug,
    ).toBe('languedoc')
    expect(matchPlaceGuideForBlurb('italy', 'Duomo di Firenze')?.slug).toBe(
      'duomo-florence',
    )
    expect(matchPlaceGuideForBlurb('czechia', 'Karlův most')?.slug).toBe(
      'charles-bridge',
    )
    expect(matchPlaceGuideForBlurb('france', 'Chenonceau')?.slug).toBe(
      'chateau-chenonceau',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Glasgow')?.slug).toBe(
      'glasgow',
    )
    expect(matchPlaceGuideForBlurb('denmark', 'Århus')?.slug).toBe('aarhus')
    expect(matchPlaceGuideForBlurb('india', 'Goa')?.slug).toBe('goa')
    expect(matchPlaceGuideForBlurb('denmark', 'Faroes')?.slug).toBe('faroe')
    expect(matchPlaceGuideForBlurb('croatia', 'Korcula')?.slug).toBe('korcula')
    expect(matchPlaceGuideForBlurb('germany', 'Hessen')?.slug).toBe('hesse')
    expect(matchPlaceGuideForBlurb('italy', 'Lucania')?.slug).toBe(
      'basilicata',
    )
    expect(matchPlaceGuideForBlurb('france', 'Chambord')?.slug).toBe(
      'chateau-chambord',
    )
    expect(matchPlaceGuideForBlurb('czechia', 'Pražský hrad')?.slug).toBe(
      'prague-castle',
    )
    expect(matchPlaceGuideForBlurb('india', 'Lal Qila')?.slug).toBe('red-fort')
    expect(matchPlaceGuideForBlurb('turkiye', 'Topkapi Palace')?.slug).toBe(
      'topkapi',
    )
    expect(matchPlaceGuideForBlurb('egypt', 'Great Pyramid')?.slug).toBe(
      'giza',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Sheffield')?.slug).toBe(
      'sheffield',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Newcastle upon Tyne')?.slug).toBe(
      'newcastle',
    )
    expect(matchPlaceGuideForBlurb('colombia', 'Cali')?.slug).toBe('cali')
    expect(matchPlaceGuideForBlurb('united-states', 'Utah')?.slug).toBe('utah')
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Mann')?.slug).toBe(
      'isle-of-man',
    )
    expect(matchPlaceGuideForBlurb('croatia', 'Brač')?.slug).toBe('brac')
    expect(matchPlaceGuideForBlurb('indonesia', 'Lombok')?.slug).toBe('lombok')
    expect(matchPlaceGuideForBlurb('switzerland', 'Wallis')?.slug).toBe('valais')
    expect(matchPlaceGuideForBlurb('italy', 'Ercolano')?.slug).toBe(
      'herculaneum',
    )
    expect(matchPlaceGuideForBlurb('egypt', 'Temple of Karnak')?.slug).toBe(
      'karnak',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Palace of Knossos')?.slug).toBe(
      'knossos',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Coventry')?.slug).toBe(
      'coventry',
    )
    expect(matchPlaceGuideForBlurb('italy', 'Padova')?.slug).toBe('padua')
    expect(matchPlaceGuideForBlurb('greece', 'Salonika')?.slug).toBe(
      'thessaloniki',
    )
    expect(matchPlaceGuideForBlurb('turkiye', 'Smyrna')?.slug).toBe('izmir')
    expect(matchPlaceGuideForBlurb('united-states', 'Idaho')?.slug).toBe('idaho')
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Ynys Môn')?.slug).toBe(
      'anglesey',
    )
    expect(matchPlaceGuideForBlurb('switzerland', 'Grisons')?.slug).toBe(
      'graubunden',
    )
    expect(matchPlaceGuideForBlurb('germany', 'Niedersachsen')?.slug).toBe(
      'lower-saxony',
    )
    expect(matchPlaceGuideForBlurb('spain', 'Castilla-La Mancha')?.slug).toBe(
      'castile-la-mancha',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Parthenon')?.slug).toBe(
      'parthenon',
    )
    expect(matchPlaceGuideForBlurb('guatemala', 'Tikal')?.slug).toBe('tikal')
    expect(matchPlaceGuideForBlurb('thailand', 'Ayudhya')?.slug).toBe(
      'ayutthaya',
    )
  })

  it('never reuses a sentence between place guides', () => {
    const seen = new Map<string, string>()
    const shared: string[] = []

    for (const place of placeGuides) {
      const sentences = place.about
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.split(/\s+/).length >= 6)

      for (const sentence of sentences) {
        const owner = seen.get(sentence)
        if (owner && owner !== place.slug) {
          shared.push(`${owner} / ${place.slug}: "${sentence.slice(0, 60)}…"`)
        } else {
          seen.set(sentence, place.slug)
        }
      }
    }

    expect(shared).toEqual([])
  })
})
