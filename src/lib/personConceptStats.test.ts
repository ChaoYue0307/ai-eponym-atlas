import { describe, expect, it } from 'vitest'
import { catalogStats, concepts, people } from '../data/catalog'
import {
  buildPersonConceptRanking,
  conceptCountDistribution,
  globalPersonConceptRanking,
} from './personConceptStats'

describe('person concept coverage statistics', () => {
  it('distinguishes unique catalog nodes from person–concept links', () => {
    expect(catalogStats.people).toBe(117)
    expect(catalogStats.concepts).toBe(120)
    expect(catalogStats.personConceptLinks).toBe(149)
    expect(catalogStats.sharedConcepts).toBe(26)
    expect(catalogStats.additionalPersonLinks).toBe(32)
    expect(catalogStats.additionalNamesakeLinks).toBe(29)
    expect(catalogStats.people + catalogStats.additionalPersonLinks).toBe(
      catalogStats.personConceptLinks,
    )
    expect(catalogStats.personConceptLinks - catalogStats.additionalNamesakeLinks).toBe(
      catalogStats.concepts,
    )
  })

  it('covers every person and preserves every linked concept exactly once', () => {
    expect(globalPersonConceptRanking).toHaveLength(people.length)
    expect(new Set(globalPersonConceptRanking.map((row) => row.person.id)).size).toBe(
      people.length,
    )
    expect(globalPersonConceptRanking.reduce((total, row) => total + row.count, 0)).toBe(
      catalogStats.personConceptLinks,
    )
    for (const row of globalPersonConceptRanking) {
      expect(row.count).toBe(row.person.concepts.length)
      expect(row.concepts.map((concept) => concept.id)).toEqual(
        row.person.concepts,
      )
    }
  })

  it('reports the audited distribution and competition ranks', () => {
    expect(
      conceptCountDistribution.map((bin) => [bin.conceptCount, bin.peopleCount]),
    ).toEqual([
      [1, 96],
      [2, 15],
      [3, 2],
      [4, 3],
      [5, 1],
    ])
    expect(
      conceptCountDistribution.reduce((total, bin) => total + bin.peopleCount, 0),
    ).toBe(people.length)
    expect(
      conceptCountDistribution.reduce(
        (total, bin) => total + bin.conceptCount * bin.peopleCount,
        0,
      ),
    ).toBe(catalogStats.personConceptLinks)

    const gauss = globalPersonConceptRanking.find(
      (row) => row.person.id === 'carl-friedrich-gauss',
    )
    const descartes = globalPersonConceptRanking.find(
      (row) => row.person.id === 'rene-descartes',
    )
    const bayes = globalPersonConceptRanking.find(
      (row) => row.person.id === 'thomas-bayes',
    )
    expect(gauss).toMatchObject({ count: 5, rank: 1, tied: false })
    expect(descartes).toMatchObject({ count: 4, rank: 2, tied: true })
    expect(bayes).toMatchObject({ count: 3, rank: 5, tied: true })
  })

  it('recalculates counts inside a selected subject category', () => {
    const probabilityRanking = buildPersonConceptRanking('probability', 'en')
    expect(probabilityRanking.length).toBeGreaterThan(0)
    for (const row of probabilityRanking) {
      expect(row.count).toBeGreaterThan(0)
      expect(row.concepts.every((concept) => concept.category === 'probability')).toBe(
        true,
      )
    }
    expect(
      probabilityRanking.reduce((total, row) => total + row.count, 0),
    ).toBe(
      concepts
        .filter((concept) => concept.category === 'probability')
        .reduce((total, concept) => total + concept.personIds.length, 0),
    )
  })
})
