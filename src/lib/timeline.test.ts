import { describe, expect, it } from 'vitest'
import { peopleById } from '../data/catalog'
import { timelineEras, timelineEvents } from '../data/timeline'
import { parseRoute } from '../hooks/useHashRoute'
import type { TimelineEraId, TimelineEventKind } from '../types'

const expectedKindCounts: Record<TimelineEventKind, number> = {
  person: 1,
  publication: 13,
  naming: 1,
  'ai-adoption': 7,
}

const expectedEraCounts: Record<TimelineEraId, number> = {
  origins: 6,
  formalization: 4,
  systems: 6,
  modern: 6,
}

describe('timeline editorial structure', () => {
  it('keeps the approved 22-event composition exact', () => {
    expect(timelineEvents).toHaveLength(22)

    for (const [kind, expectedCount] of Object.entries(expectedKindCounts)) {
      expect(timelineEvents.filter((event) => event.kind === kind)).toHaveLength(
        expectedCount,
      )
    }
  })

  it('keeps the four readable chapters at 6 / 4 / 6 / 6', () => {
    expect(timelineEras.map((era) => era.id)).toEqual([
      'origins',
      'formalization',
      'systems',
      'modern',
    ])

    for (const [eraId, expectedCount] of Object.entries(expectedEraCounts)) {
      expect(timelineEvents.filter((event) => event.eraId === eraId)).toHaveLength(
        expectedCount,
      )
    }
  })

  it('spans a true chronological domain from 1596 through 2025', () => {
    expect(timelineEvents[0]?.sortYear).toBe(1596)
    expect(timelineEvents.at(-1)?.sortYear).toBe(2025)

    for (const event of timelineEvents) {
      expect(event.year.en.trim()).not.toBe('')
      expect(event.year.zh.trim()).not.toBe('')

      const era = timelineEras.find((candidate) => candidate.id === event.eraId)
      expect(era, `${event.id} has a known era`).toBeDefined()
      expect(event.sortYear).toBeGreaterThanOrEqual(era?.startYear ?? Infinity)
      expect(event.sortYear).toBeLessThanOrEqual(era?.endYear ?? -Infinity)
    }
  })

  it('has a licensed catalog portrait for the opening people event', () => {
    const openingEvent = timelineEvents[0]
    expect(openingEvent?.kind).toBe('person')
    expect(
      openingEvent?.personIds.some((personId) => peopleById.get(personId)?.portrait),
    ).toBe(true)
  })

  it('gives every event direct, unique HTTPS evidence links', () => {
    for (const event of timelineEvents) {
      expect(event.sourceLinks.length, `${event.id} has evidence`).toBeGreaterThan(0)

      const urls = event.sourceLinks.map((source) => source.url)
      expect(new Set(urls).size, `${event.id} has unique evidence URLs`).toBe(
        urls.length,
      )

      for (const source of event.sourceLinks) {
        expect(source.label.trim(), `${event.id} source label`).not.toBe('')
        expect(
          source.url.startsWith('https://'),
          `${event.id} source URL uses HTTPS`,
        ).toBe(true)
      }
    }
  })
})

describe('timeline shareable state', () => {
  it('parses kind, era, and event from the hash URL', () => {
    const route = parseRoute(
      '#/timeline?kind=publication&era=origins&event=descartes-la-geometrie-1637',
    )

    expect(route.name).toBe('timeline')
    expect(route.params.get('kind')).toBe('publication')
    expect(route.params.get('era')).toBe('origins')
    expect(route.params.get('event')).toBe('descartes-la-geometrie-1637')
  })
})
