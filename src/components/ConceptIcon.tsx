import type { SVGProps } from 'react'
import type { Locale } from '../copy'
import { conceptsById } from '../data/catalog'
import {
  FoundationConceptGlyph,
  foundationConceptIconIds,
} from './concept-icons/FoundationConceptGlyph'
import {
  MiddleConceptGlyph,
  middleConceptIconIds,
} from './concept-icons/MiddleConceptGlyph'
import {
  ModernConceptGlyph,
  modernConceptIconIds,
} from './concept-icons/ModernConceptGlyph'

export const conceptIconIds = Object.freeze([
  ...foundationConceptIconIds,
  ...middleConceptIconIds,
  ...modernConceptIconIds,
])

const foundationIds = new Set<string>(foundationConceptIconIds)
const middleIds = new Set<string>(middleConceptIconIds)
const modernIds = new Set<string>(modernConceptIconIds)

export type ConceptIconSize = 'micro' | 'small' | 'row' | 'hero'

type ConceptIconProps = Omit<
  SVGProps<SVGSVGElement>,
  'children' | 'role'
> & {
  conceptId: string
  locale: Locale
  size?: ConceptIconSize
  /** Hide repeated icons when the adjacent concept label already names them. */
  decorative?: boolean
  accessibleLabel?: string
}

export function hasConceptIcon(conceptId: string) {
  return (
    foundationIds.has(conceptId) ||
    middleIds.has(conceptId) ||
    modernIds.has(conceptId)
  )
}

export function ConceptIcon({
  conceptId,
  locale,
  size = 'row',
  decorative = true,
  accessibleLabel,
  className = '',
  ...svgProps
}: ConceptIconProps) {
  if (!hasConceptIcon(conceptId)) return null

  const concept = conceptsById.get(conceptId)
  const label =
    accessibleLabel ??
    (concept
      ? `${locale === 'zh' ? concept.zhTerm : concept.term} — ${concept.functionNickname[locale]}`
      : conceptId)

  return (
    <svg
      {...svgProps}
      className={`concept-icon concept-icon--${size}${className ? ` ${className}` : ''}`}
      viewBox="0 0 48 48"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      focusable="false"
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : label}
      role={decorative ? undefined : 'img'}
    >
      {decorative ? null : <title>{label}</title>}
      {foundationIds.has(conceptId) ? (
        <FoundationConceptGlyph conceptId={conceptId} />
      ) : middleIds.has(conceptId) ? (
        <MiddleConceptGlyph conceptId={conceptId} />
      ) : (
        <ModernConceptGlyph conceptId={conceptId} />
      )}
    </svg>
  )
}
