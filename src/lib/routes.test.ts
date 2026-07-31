import { describe, expect, it } from 'vitest'
import { buildHref, localeForRoute, parseRoute, routePath } from '../hooks/useHashRoute'

describe('atlas routes', () => {
  it('parses legacy hash links and clean canonical paths', () => {
    const pathsRoute = parseRoute('#/paths?lang=zh')
    expect(pathsRoute.name).toBe('paths')
    expect(pathsRoute.params.get('lang')).toBe('zh')

    const conceptRoute = parseRoute(
      '#/concept/jacobian-matrix?path=geometry-to-gradients&lang=en',
    )
    expect(conceptRoute).toMatchObject({
      name: 'concept',
      id: 'jacobian-matrix',
    })
    expect(conceptRoute.params.get('path')).toBe('geometry-to-gradients')
    expect(routePath(conceptRoute)).toBe('/concept/jacobian-matrix')

    const canonicalConceptRoute = parseRoute(
      '/zh/concept/jacobian-matrix/?path=geometry-to-gradients',
    )
    expect(canonicalConceptRoute).toMatchObject({
      name: 'concept',
      id: 'jacobian-matrix',
    })
    expect(canonicalConceptRoute.params.get('lang')).toBe('zh')
    expect(canonicalConceptRoute.params.get('path')).toBe('geometry-to-gradients')

    const rankingRoute = parseRoute('#/atlas?view=people&layout=ranking&lang=zh')
    expect(rankingRoute.name).toBe('atlas')
    expect(rankingRoute.params.get('view')).toBe('people')
    expect(rankingRoute.params.get('layout')).toBe('ranking')
  })

  it('builds crawlable paths instead of fragment-only links', () => {
    expect(buildHref('/concept/jacobian-matrix')).toBe('/concept/jacobian-matrix/')
    expect(
      buildHref(
        '/atlas',
        new URLSearchParams({ view: 'people', layout: 'ranking', lang: 'zh' }),
      ),
    ).toBe('/zh/atlas/?view=people&layout=ranking')
  })

  it('treats clean English and Chinese paths as authoritative locale state', () => {
    expect(localeForRoute(parseRoute('/atlas/'))).toBe('en')
    expect(localeForRoute(parseRoute('/zh/atlas/'))).toBe('zh')
  })

  it('keeps unknown and empty routes on the homepage', () => {
    expect(parseRoute('').name).toBe('home')
    expect(parseRoute('#/not-a-route').name).toBe('home')
    expect(routePath(parseRoute('#/'))).toBe('/')
  })
})
