import type { Locale } from '../copy'
import {
  constellationEdges,
  constellationNodes,
  constellationViewBoxes,
  mobileConstellationPositions,
} from '../data/constellation'
import { conceptsById } from '../data/catalog'
import { buildHref } from '../hooks/useHashRoute'
import { connectCircleBoundaries } from '../lib/constellationGeometry'

type ConstellationLayout = 'desktop' | 'mobile'

function ConstellationGraphic({
  layout,
  locale,
  label,
}: {
  layout: ConstellationLayout
  locale: Locale
  label: string
}) {
  const positionedNodes = constellationNodes.map((node) => ({
    ...node,
    ...(layout === 'mobile'
      ? mobileConstellationPositions[node.id]
      : undefined),
  }))
  const nodeById = new Map(positionedNodes.map((node) => [node.id, node]))
  const viewBox = constellationViewBoxes[layout]
  const relationshipDescription = constellationEdges
    .map((edge) => {
      const from = nodeById.get(edge.from)!
      const to = nodeById.get(edge.to)!
      const fromLabel =
        locale === 'zh' ? from.labels.zh.join('') : from.labels.en.join(' ')
      const toLabel = locale === 'zh' ? to.labels.zh.join('') : to.labels.en.join(' ')
      return locale === 'zh'
        ? `${fromLabel}与${toLabel}相连`
        : `${fromLabel} connects to ${toLabel}`
    })
    .join(locale === 'zh' ? '；' : '; ')

  return (
    <svg
      className={`constellation__graphic constellation__graphic--${layout}`}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={label}
    >
      <title>{label}</title>
      <desc>{relationshipDescription}</desc>
      <g className="constellation__edges" aria-hidden="true">
        {constellationEdges.map((edge) => {
          const from = nodeById.get(edge.from)!
          const to = nodeById.get(edge.to)!
          const points = connectCircleBoundaries(from, to)
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              {...points}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </g>
      <g className="constellation__nodes">
        {positionedNodes.map((node) => {
          const lines = node.labels[locale]
          const labelStartY = lines.length === 1 ? -7 : -15
          const formulaY = lines.length === 1 ? 18 : 24
          const accessibleLabel = locale === 'zh' ? lines.join('') : lines.join(' ')
          const usesCompactLabel =
            locale === 'en' && Math.max(...lines.map((line) => line.length)) >= 11
          const meaning =
            conceptsById.get(node.id)?.functionNickname[locale] ?? accessibleLabel
          const isFocus = node.id === 'jacobian-matrix'

          return (
            <a
              key={node.id}
              className={[
                'constellation__node',
                isFocus ? 'constellation__node--focus' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-node-id={node.id}
              href={buildHref(`/concept/${node.id}`)}
              aria-label={
                locale === 'zh'
                  ? `打开${accessibleLabel}：${meaning}。公式 ${node.formula}`
                  : `Open ${accessibleLabel}: ${meaning}. Formula ${node.formula}`
              }
            >
              <g transform={`translate(${node.x} ${node.y})`}>
                {isFocus ? (
                  <circle
                    className="constellation__node-halo"
                    r={node.r + 6}
                    vectorEffect="non-scaling-stroke"
                    aria-hidden="true"
                  />
                ) : null}
                <circle
                  className="constellation__node-surface"
                  r={node.r}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  className={[
                    'constellation__node-label',
                    usesCompactLabel
                      ? 'constellation__node-label--compact'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  y={labelStartY}
                  textAnchor="middle"
                >
                  {lines.map((line, index) => (
                    <tspan key={`${node.id}-${locale}-${index}`} x="0" dy={index === 0 ? 0 : 15}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <text
                  className="constellation__formula"
                  x="0"
                  y={formulaY}
                  textAnchor="middle"
                >
                  {node.formula}
                </text>
              </g>
            </a>
          )
        })}
      </g>
    </svg>
  )
}

export function ConceptConstellation({ locale }: { locale: Locale }) {
  const mapLabel =
    locale === 'zh' ? '部分 AI 概念之间的联系' : 'How selected AI concepts connect'

  return (
    <div className="constellation">
      <img
        className="constellation__art"
        src={`${import.meta.env.BASE_URL}illustrations/semantic-strata.webp`}
        alt=""
        width="1440"
        height="880"
        decoding="async"
        fetchPriority="low"
        draggable={false}
        aria-hidden="true"
      />
      <ConstellationGraphic layout="desktop" locale={locale} label={mapLabel} />
      <ConstellationGraphic layout="mobile" locale={locale} label={mapLabel} />
    </div>
  )
}
