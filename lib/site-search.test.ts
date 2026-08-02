import { describe, expect, it } from 'vitest'

import { allGalleryItems } from './gallery'
import { getAllPosts } from './content'
import { countries } from './countries'
import {
  createSiteSearchIndex,
  looksLikeCleoRequest,
  meaningfulTokens,
  searchSiteCatalog,
  splitTitleMatches,
  type SiteSearchHit,
  type SiteSearchKind,
} from './site-search'
import {
  buildSiteSearchHits,
  siteSearchSpotlightIds,
} from './site-search-catalog'
import { citySubjects } from './cities'
import { civilizationSubjects } from './civilizations'
import { oceanSubjects } from './oceans'
import { riverSubjects } from './rivers'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

const hits = buildSiteSearchHits()
const index = createSiteSearchIndex(hits)

function search(query: string, limit = 8) {
  return searchSiteCatalog(index, query, limit)
}

function hrefs(query: string, limit = 8) {
  return search(query, limit).map((result) => result.hit.href)
}

function kindOf(query: string): SiteSearchKind | undefined {
  return search(query)[0]?.hit.kind
}

describe('site search catalog', () => {
  it('indexes every surface of the portal, not just the guides', () => {
    const byKind = (kind: SiteSearchKind) =>
      hits.filter((entry) => entry.kind === kind)

    expect(new Set(hits.map((entry) => entry.kind))).toEqual(
      new Set([
        'topic',
        'explore',
        'space',
        'civilizations',
        'cities',
        'oceans',
        'rivers',
        'photo',
        'writing',
        'surface',
      ]),
    )
    expect(byKind('topic')).toHaveLength(allTopics().length)
    expect(byKind('explore')).toHaveLength(countries.length)
    expect(byKind('space')).toHaveLength(spaceSubjects.length)
    expect(byKind('civilizations')).toHaveLength(civilizationSubjects.length)
    expect(byKind('cities')).toHaveLength(citySubjects.length)
    expect(byKind('oceans')).toHaveLength(oceanSubjects.length)
    expect(byKind('rivers')).toHaveLength(riverSubjects.length)
    expect(byKind('photo')).toHaveLength(allGalleryItems().length)
    expect(byKind('writing')).toHaveLength(getAllPosts().length)

    for (const href of [
      '/explore',
      '/space',
      '/civilizations',
      '/cities',
      '/oceans',
      '/rivers',
      '/gallery',
      '/cleo',
      '/blog',
      '/topics',
      '/',
    ]) {
      expect(hits.some((entry) => entry.href === href)).toBe(true)
    }
  })

  it('keeps hits lean — no guide prose, no repeated title words', () => {
    for (const entry of hits) {
      expect(Object.keys(entry).sort()).toEqual(
        entry.keywords
          ? ['href', 'id', 'keywords', 'kind', 'subtitle', 'title']
          : ['href', 'id', 'kind', 'subtitle', 'title'],
      )

      const keywords = entry.keywords?.split(' ') ?? []
      const indexed = new Set(
        `${entry.title} ${entry.subtitle}`.toLowerCase().match(/[\p{L}\p{N}]+/gu),
      )
      expect(keywords).toEqual([...new Set(keywords)])
      for (const term of keywords) {
        expect(term).toBe(term.toLowerCase())
        expect(indexed.has(term)).toBe(false)
      }
    }
  })

  it('gives every hit a unique id', () => {
    expect(new Set(hits.map((entry) => entry.id)).size).toBe(hits.length)
  })

  it('points photo hits at their gallery tile', () => {
    const photo = hits.find((entry) => entry.kind === 'photo')
    expect(photo?.href).toMatch(
      /^\/gallery#photo-(places|space|civilizations|cities)-[a-z0-9-]+$/,
    )
  })

  it('offers spotlight ids that exist in the catalog', () => {
    const spotlight = siteSearchSpotlightIds(hits)
    expect(spotlight.length).toBeGreaterThan(0)
    for (const id of spotlight) {
      expect(hits.some((entry) => entry.id === id)).toBe(true)
    }
  })
})

describe('searchSiteCatalog', () => {
  it('returns nothing for an empty query', () => {
    expect(search('   ')).toEqual([])
  })

  it('finds countries by name, code, region, capital, and currency', () => {
    expect(hrefs('japan')[0]).toBe('/explore/japan')
    expect(hrefs('jp')[0]).toBe('/explore/japan')
    expect(hrefs('yen')[0]).toBe('/explore/japan')
    // Tokyo is both Japan's capital and a Cities guide — city wins on exact name.
    expect(hrefs('tokyo')[0]).toBe('/cities/tokyo')
    // "western" also hits Western Wall photography; Explore region hits remain.
    expect(
      hrefs('western europe').filter((href) => href.startsWith('/explore/'))
        .length,
    ).toBeGreaterThan(3)
  })

  it('resolves a whole initialism to the country it stands for', () => {
    expect(hrefs('us')[0]).toBe('/explore/united-states')
    expect(hrefs('uk')[0]).toBe('/explore/united-kingdom')
  })

  it('finds space guides and their features', () => {
    expect(hrefs('mars')[0]).toBe('/space/mars')
    expect(hrefs('europa')[0]).toBe('/space/europa')
    expect(hrefs('callisto')[0]).toBe('/space/callisto')
    expect(hrefs('triton')[0]).toBe('/space/triton')
    expect(hrefs('miranda')[0]).toBe('/space/miranda')
    expect(hrefs('iapetus')[0]).toBe('/space/iapetus')
    expect(hrefs('moon').includes('/space/moon')).toBe(true)
    expect(hrefs('nebula')[0]).toMatch(/^\/space\/[a-z-]+nebula$/)
    expect(hrefs('whirlpool galaxy')[0]).toBe('/space/whirlpool-galaxy')
    expect(hrefs('large magellanic cloud')[0]).toBe(
      '/space/large-magellanic-cloud',
    )
    expect(hrefs('eagle nebula')[0]).toBe('/space/eagle-nebula')
    expect(hrefs('helix nebula')[0]).toBe('/space/helix-nebula')
    expect(hrefs('horsehead nebula')[0]).toBe('/space/horsehead-nebula')
    expect(
      search('nebula', 12).every(
        (result) => result.hit.kind === 'space' || result.hit.kind === 'photo',
      ),
    ).toBe(true)
  })

  it('finds civilization guides and their sites', () => {
    expect(hrefs('ancient egypt')[0]).toBe('/civilizations/ancient-egypt')
    expect(hrefs('roman empire')[0]).toBe('/civilizations/roman-empire')
    expect(hrefs('maya')[0]).toBe('/civilizations/maya')
    expect(hrefs('mesopotamia')[0]).toBe('/civilizations/mesopotamia')
    expect(hrefs('han china')[0]).toBe('/civilizations/han-china')
    expect(hrefs('khmer')[0]).toBe('/civilizations/khmer')
    expect(hrefs('achaemenid')[0]).toBe('/civilizations/achaemenid-persia')
    expect(hrefs('ottoman empire')[0]).toBe('/civilizations/ottoman-empire')
    expect(hrefs('mongol empire')[0]).toBe('/civilizations/mongol-empire')
    expect(hrefs('tang china')[0]).toBe('/civilizations/tang-china')
    expect(hrefs('himeji castle')[0]).toBe('/civilizations/classical-japan')
    expect(hrefs('classical japan')[0]).toBe('/civilizations/classical-japan')
    expect(hrefs('kingdom of kush')[0]).toBe('/civilizations/kush')
    expect(hrefs('great zimbabwe')[0]).toBe('/civilizations/great-zimbabwe')
    expect(hrefs('gupta empire')[0]).toBe('/civilizations/gupta-empire')
    expect(hrefs('teotihuacan')[0]).toBe('/civilizations/teotihuacan')
    expect(hrefs('polynesia')[0]).toBe('/civilizations/polynesia')
    expect(hrefs('maori')[0]).toBe('/civilizations/maori')
    expect(hrefs('aboriginal australia')[0]).toBe(
      '/civilizations/aboriginal-australia',
    )
    expect(hrefs('melanesia')[0]).toBe('/civilizations/melanesia')
    expect(hrefs('micronesian cultures')[0]).toBe(
      '/civilizations/micronesian-cultures',
    )
    expect(hrefs('oceanic island network')[0]).toBe(
      '/civilizations/micronesian-cultures',
    )
    expect(hrefs('chola')[0]).toBe('/civilizations/chola-empire')
    expect(hrefs('olmec')[0]).toBe('/civilizations/olmec')
    expect(hrefs('early caliphates')[0]).toBe('/civilizations/early-caliphates')
    expect(hrefs('coyolxauhqui')[0]).toBe('/civilizations/aztec')
    expect(hrefs('hatshepsut')[0]).toBe('/civilizations/ancient-egypt')
    expect(hrefs('el castillo')[0]).toBe('/civilizations/maya')
  })

  it('finds city guides and their sites', () => {
    expect(hrefs('istanbul')[0]).toBe('/cities/istanbul')
    expect(hrefs('cairo')[0]).toBe('/cities/cairo')
    expect(hrefs('kyoto')[0]).toBe('/cities/kyoto')
    expect(hrefs('rome')[0]).toBe('/cities/rome')
    expect(hrefs('samarkand')[0]).toBe('/cities/samarkand')
    expect(hrefs('timbuktu')[0]).toBe('/cities/timbuktu')
    expect(hrefs('cusco')[0]).toBe('/cities/cusco')
    expect(hrefs('beijing')[0]).toBe('/cities/beijing')
    expect(hrefs('delhi')[0]).toBe('/cities/delhi')
    expect(hrefs('london')[0]).toBe('/cities/london')
    expect(hrefs('athens')[0]).toBe('/cities/athens')
    expect(hrefs('jerusalem')[0]).toBe('/cities/jerusalem')
    expect(hrefs('tokyo')[0]).toBe('/cities/tokyo')
    expect(hrefs('mexico city')[0]).toBe('/cities/mexico-city')
    expect(hrefs('marrakech')[0]).toBe('/cities/marrakech')
    expect(hrefs('lagos')[0]).toBe('/cities/lagos')
    expect(hrefs('buenos aires')[0]).toBe('/cities/buenos-aires')
    expect(hrefs('rio de janeiro')[0]).toBe('/cities/rio-de-janeiro')
    expect(hrefs('bogota')[0]).toBe('/cities/bogota')
    expect(hrefs('galata tower')[0]).toBe('/cities/istanbul')
    expect(hrefs('fushimi inari')[0]).toBe('/cities/kyoto')
    expect(hrefs('pantheon')[0]).toBe('/cities/rome')
    expect(hrefs('rialto bridge')[0]).toBe('/cities/venice')
    expect(hrefs('silk road crossroads')[0]).toBe('/cities/samarkand')
    expect(hrefs('andean imperial capital')[0]).toBe('/cities/cusco')
    expect(hrefs('bosphorus')[0]).toBe('/cities/istanbul')
    expect(hrefs('strait capital')[0]).toBe('/cities/istanbul')
    expect(hrefs('imperial port')[0]).toBe('/cities/london')
    expect(hrefs('stoa of attalos')[0]).toBe('/cities/athens')
    expect(hrefs('highland basin capital')[0]).toBe('/cities/mexico-city')
    expect(hrefs('medina market city')[0]).toBe('/cities/marrakech')
    expect(hrefs('lagoon port megacity')[0]).toBe('/cities/lagos')
    expect(hrefs('river-plate capital')[0]).toBe('/cities/buenos-aires')
    expect(hrefs('bay coastal metropolis')[0]).toBe('/cities/rio-de-janeiro')
    expect(hrefs('andean plateau capital')[0]).toBe('/cities/bogota')
  })

  it('finds ocean guides and their features', () => {
    expect(hrefs('pacific ocean')[0]).toBe('/oceans/pacific-ocean')
    expect(hrefs('atlantic ocean')[0]).toBe('/oceans/atlantic-ocean')
    expect(hrefs('southern ocean')[0]).toBe('/oceans/southern-ocean')
    expect(hrefs('mediterranean sea')[0]).toBe('/oceans/mediterranean-sea')
    expect(hrefs('caribbean sea')[0]).toBe('/oceans/caribbean-sea')
    expect(hrefs('south china sea')[0]).toBe('/oceans/south-china-sea')
    expect(hrefs('red sea')[0]).toBe('/oceans/red-sea')
    expect(hrefs('arabian sea')[0]).toBe('/oceans/arabian-sea')
    expect(hrefs('drake passage')[0]).toBe('/oceans/southern-ocean')
    expect(hrefs('agulhas current')[0]).toBe('/oceans/indian-ocean')
    expect(hrefs('gibraltar gateway')[0]).toBe('/oceans/mediterranean-sea')
    expect(hrefs('el nido limestone coast')[0]).toBe('/oceans/south-china-sea')
  })

  it('finds river guides and their features', () => {
    expect(hrefs('nile')[0]).toBe('/rivers/nile')
    expect(hrefs('congo river')[0]).toBe('/rivers/congo')
    expect(hrefs('amazon')[0]).toBe('/rivers/amazon')
    expect(hrefs('yangtze')[0]).toBe('/rivers/yangtze')
    expect(hrefs('ganges')[0]).toBe('/rivers/ganges')
    expect(hrefs('mekong')[0]).toBe('/rivers/mekong')
    expect(hrefs('yellow river')[0]).toBe('/rivers/yellow-river')
    expect(hrefs('danube')[0]).toBe('/rivers/danube')
    expect(hrefs('rhine')[0]).toBe('/rivers/rhine')
    expect(hrefs('volga')[0]).toBe('/rivers/volga')
    expect(hrefs('mississippi')[0]).toBe('/rivers/mississippi')
    expect(hrefs('indus')[0]).toBe('/rivers/indus')
    expect(hrefs('niger river')[0]).toBe('/rivers/niger')
    expect(hrefs('paraná')[0]).toBe('/rivers/parana')
    expect(hrefs('murray–darling')[0]).toBe('/rivers/murray-darling')
    expect(hrefs('lena')[0]).toBe('/rivers/lena')
    expect(hrefs('iron gates')[0]).toBe('/rivers/danube')
    expect(hrefs('blue nile falls')[0]).toBe('/rivers/nile')
    expect(hrefs('loess sediment')[0]).toBe('/rivers/yellow-river')
    expect(hrefs('middle rhine gorge')[0]).toBe('/rivers/rhine')
    expect(hrefs('siberian trunk')[0]).toBe('/rivers/lena')
    expect(hrefs('inner niger delta')[0]).toBe('/rivers/niger')
  })

  it('finds curated photographs by the place they show', () => {
    const [first] = search('mount fuji')
    expect(first?.hit.kind).toBe('photo')
    expect(first?.hit.href).toBe('/gallery#photo-places-japan')
    expect(kindOf('blue lagoon')).toBe('photo')
  })

  it('finds Writing posts by title, description, and section heading', () => {
    const posts = getAllPosts()
    const post = posts[0]!
    expect(hrefs(post.title)[0]).toBe(`/blog/${post.slug}`)
    expect(hrefs('essays')[0]).toBe('/blog')
    expect(
      search('essay', 12).some((result) => result.hit.kind === 'writing'),
    ).toBe(true)
  })

  it('reaches portal surfaces by name', () => {
    expect(hrefs('explore')[0]).toBe('/explore')
    expect(hrefs('gallery')[0]).toBe('/gallery')
    expect(hrefs('cleo')[0]).toBe('/cleo')
    expect(hrefs('topics')[0]).toBe('/topics')
  })

  it('ranks an exact title above every looser match', () => {
    expect(search('space')[0]?.hit).toMatchObject({
      kind: 'topic',
      title: 'Space',
      href: '/space',
    })
    expect(search('mars')[0]?.hit.title).toBe('Mars')
  })

  it('forgives a typo in a long name', () => {
    expect(hrefs('swizerland')[0]).toBe('/explore/switzerland')
    expect(hrefs('portgual')[0]).toBe('/explore/portugal')
  })

  it('does not treat a short word as a typo for another', () => {
    expect(hrefs('mars').includes('/explore/mali')).toBe(false)
    expect(search('home')[0]?.hit.href).toBe('/')
  })

  it('folds accents so a plain-ASCII query still lands', () => {
    expect(hrefs('cote divoire')[0]).toBe('/explore/cote-divoire')
    expect(hrefs("côte d'ivoire")[0]).toBe('/explore/cote-divoire')
  })

  it('narrows as words are added rather than widening', () => {
    const iceland = search('iceland', 20)
    expect(iceland.some((result) => result.hit.kind === 'explore')).toBe(true)

    // "photo" pins the intent: only photographs survive.
    const photos = search('iceland photo', 20)
    expect(photos.length).toBeGreaterThan(0)
    expect(photos.every((result) => result.hit.kind === 'photo')).toBe(true)
  })

  it('drops matches that cover less of the query than the best match does', () => {
    // "Mount Nimba" matches "mount" but not "fuji".
    expect(hrefs('mount fuji', 20)).not.toContain('/gallery#photo-places-guinea')
  })

  it('ignores function words that would otherwise steer the ranking', () => {
    expect(meaningfulTokens('images of iceland')).toEqual(['images', 'iceland'])
    // "Cliffs of Moher" would win on the "of" alone.
    expect(hrefs('images of iceland')[0]).toBe('/gallery#photo-places-iceland')
  })

  it('still matches a query made only of function words', () => {
    expect(meaningfulTokens('is')).toEqual(['is'])
    // IS is Iceland's country code; Israel wins the row on its title prefix.
    expect(hrefs('is', 20)).toContain('/explore/iceland')
    expect(hrefs('is')[0]).toBe('/explore/israel')
  })

  it('honours the result limit', () => {
    expect(search('country', 3)).toHaveLength(3)
  })

  it('marks the matched letters of the title', () => {
    const [japan] = search('jap')
    expect(japan?.hit.title).toBe('Japan')
    expect(splitTitleMatches(japan!.hit.title, japan!.titleMatches)).toEqual([
      { text: 'Jap', match: true },
      { text: 'an', match: false },
    ])
  })

  it('marks accented letters at their source offsets', () => {
    const [ivoire] = search('cote')
    expect(ivoire?.hit.title).toBe("Côte d'Ivoire")
    expect(splitTitleMatches(ivoire!.hit.title, ivoire!.titleMatches)).toEqual([
      { text: 'Côte', match: true },
      { text: " d'Ivoire", match: false },
    ])
  })

  it('marks every matched word of a multi-word query', () => {
    const [fuji] = search('mount fuji')
    expect(splitTitleMatches(fuji!.hit.title, fuji!.titleMatches)).toEqual([
      { text: 'Mount', match: true },
      { text: ' ', match: false },
      { text: 'Fuji', match: true },
    ])
  })

  it('leaves a title unmarked when nothing in it matched', () => {
    const [hit] = search('yen')
    expect(hit?.hit.title).toBe('Japan')
    expect(hit?.titleMatches).toEqual([])
  })
})

describe('createSiteSearchIndex', () => {
  it('indexes the kind label and its vocabulary without storing them per hit', () => {
    const catalog: SiteSearchHit[] = [
      {
        id: 'photo:test',
        kind: 'photo',
        title: 'Somewhere',
        subtitle: 'Nowhere',
        href: '/gallery#photo-test',
      },
    ]
    const results = searchSiteCatalog(
      createSiteSearchIndex(catalog),
      'photograph',
    )
    expect(results[0]?.hit.id).toBe('photo:test')
  })
})

describe('looksLikeCleoRequest', () => {
  it.each([
    'why is europa interesting?',
    'compare mars and earth',
    'how do rivers draw nations',
    'show me all three photos of japan',
    'what is the capital of peru',
  ])('reads "%s" as a question for Cleo', (query) => {
    expect(looksLikeCleoRequest(query)).toBe(true)
  })

  it.each(['japan', 'mount fuji', 'united states', 'iss', '', '   '])(
    'reads "%s" as a catalog lookup',
    (query) => {
      expect(looksLikeCleoRequest(query)).toBe(false)
    },
  )
})
