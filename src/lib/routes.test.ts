import { describe, expect, it } from 'vitest'
import { parseRoute, routePath } from '../hooks/useHashRoute'

describe('hash routes', () => {
  it('parses guided paths and locale-aware concept links', () => {
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
  })

  it('keeps unknown and empty routes on the homepage', () => {
    expect(parseRoute('').name).toBe('home')
    expect(parseRoute('#/not-a-route').name).toBe('home')
    expect(routePath(parseRoute('#/'))).toBe('/')
  })
})
