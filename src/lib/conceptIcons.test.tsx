import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ConceptIcon, conceptIconIds, hasConceptIcon } from '../components/ConceptIcon'
import { concepts } from '../data/catalog'

describe('concept icon system', () => {
  it('covers every concept exactly once', () => {
    const catalogIds = concepts.map((concept) => concept.id)
    expect(conceptIconIds).toHaveLength(catalogIds.length)
    expect(new Set(conceptIconIds).size).toBe(conceptIconIds.length)
    expect(new Set(conceptIconIds)).toEqual(new Set(catalogIds))
    for (const conceptId of catalogIds) {
      expect(hasConceptIcon(conceptId), conceptId).toBe(true)
    }
  })

  it('renders every glyph as text-free, accessible 48-unit vector artwork', () => {
    for (const concept of concepts) {
      const markup = renderToStaticMarkup(
        <ConceptIcon
          conceptId={concept.id}
          locale="en"
          decorative={false}
        />,
      )

      expect(markup, concept.id).toContain('viewBox="0 0 48 48"')
      expect(markup, concept.id).toContain('role="img"')
      expect(markup, concept.id).toContain('aria-label=')
      expect(markup, concept.id).toContain('ci-')
      expect(markup, concept.id).not.toContain('<text')
    }
  })
})
