import type { Locale } from '../copy'
import {
  constellationEdges,
  constellationNodes,
  mobileConstellationPositions,
} from '../data/constellation'
import { navigate } from '../hooks/useHashRoute'

type ConstellationLayout = 'desktop' | 'mobile'

function multiline(value: string) {
  return value.split('\n')
}

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

  return (
    <svg
      className={`constellation__graphic constellation__graphic--${layout}`}
      viewBox={layout === 'mobile' ? '0 0 360 380' : '0 0 720 440'}
      role="group"
      aria-label={label}
    >
      <title>{label}</title>
      <g className="constellation__edges" aria-hidden="true">
        {constellationEdges.map((edge) => {
          const from = nodeById.get(edge.from)!
          const to = nodeById.get(edge.to)!
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            />
          )
        })}
      </g>
      <g className="constellation__nodes">
        {positionedNodes.map((node) => (
          <a
            key={node.id}
            href={`#/concept/${node.id}`}
            onClick={(event) => {
              event.preventDefault()
              navigate(`/concept/${node.id}`)
            }}
            aria-label={
              locale === 'zh'
                ? `打开${node.zh}`
                : `Open ${node.label.replace('\n', ' ')}`
            }
          >
            <circle cx={node.x} cy={node.y} r={node.r} />
            <text x={node.x} y={node.y - (locale === 'zh' ? 12 : 18)} textAnchor="middle">
              {(locale === 'zh' ? [node.zh] : multiline(node.label)).map((line, index) => (
                <tspan key={line} x={node.x} dy={index === 0 ? 0 : 16}>
                  {line}
                </tspan>
              ))}
            </text>
            <text
              className="constellation__formula"
              x={node.x}
              y={node.y + (locale === 'zh' ? 17 : 20)}
              textAnchor="middle"
            >
              {node.formula}
            </text>
          </a>
        ))}
      </g>
    </svg>
  )
}

export function ConceptConstellation({ locale }: { locale: Locale }) {
  const mapLabel =
    locale === 'zh' ? '权威数据中的概念关系示例' : 'A sample of relationships in the atlas data'

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
