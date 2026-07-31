import type { Locale } from '../copy'
import { conceptsById, people } from '../data/catalog'
import type { Concept, Person } from '../types'

export interface PersonConceptRank {
  readonly person: Person
  readonly concepts: readonly Concept[]
  readonly count: number
  readonly rank: number
  readonly tied: boolean
}

export interface ConceptCountBin {
  readonly conceptCount: number
  readonly peopleCount: number
  readonly share: number
}

function conceptsForPerson(person: Person, category?: string): readonly Concept[] {
  return person.concepts
    .map((conceptId) => conceptsById.get(conceptId))
    .filter(
      (concept): concept is Concept =>
        concept !== undefined && (!category || concept.category === category),
    )
}

/**
 * Build a deterministic, competition-ranked view of catalog coverage.
 * Counts describe distinct catalog entries, never a person's total output or
 * historical importance.
 */
export function buildPersonConceptRanking(
  category: string | undefined,
  locale: Locale,
): readonly PersonConceptRank[] {
  const collator = new Intl.Collator(locale === 'zh' ? 'zh-Hans' : 'en', {
    sensitivity: 'base',
  })
  const rows = people
    .map((person) => {
      const linkedConcepts = conceptsForPerson(person, category)
      return {
        person,
        concepts: linkedConcepts,
        count: linkedConcepts.length,
      }
    })
    .filter((row) => row.count > 0)
    .sort(
      (left, right) =>
        right.count - left.count ||
        collator.compare(
          locale === 'zh' ? left.person.zhName : left.person.name,
          locale === 'zh' ? right.person.zhName : right.person.name,
        ),
    )

  const frequencyByCount = new Map<number, number>()
  for (const row of rows) {
    frequencyByCount.set(row.count, (frequencyByCount.get(row.count) ?? 0) + 1)
  }

  let currentRank = 0
  let previousCount: number | undefined
  return Object.freeze(
    rows.map((row, index) => {
      if (row.count !== previousCount) {
        currentRank = index + 1
        previousCount = row.count
      }
      return Object.freeze({
        ...row,
        concepts: Object.freeze([...row.concepts]),
        rank: currentRank,
        tied: (frequencyByCount.get(row.count) ?? 0) > 1,
      })
    }),
  )
}

export const globalPersonConceptRanking = buildPersonConceptRanking(undefined, 'en')

export const conceptCountDistribution: readonly ConceptCountBin[] = Object.freeze(
  Array.from(
    { length: Math.max(...globalPersonConceptRanking.map((row) => row.count)) },
    (_, index) => {
      const conceptCount = index + 1
      const peopleCount = globalPersonConceptRanking.filter(
        (row) => row.count === conceptCount,
      ).length
      return Object.freeze({
        conceptCount,
        peopleCount,
        share: peopleCount / people.length,
      })
    },
  ),
)
