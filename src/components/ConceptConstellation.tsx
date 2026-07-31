import type { Locale } from '../copy'
import { navigate } from '../hooks/useHashRoute'

type MapNode = {
  id: string
  label: string
  zh: string
  x: number
  y: number
  r: number
  formula: string
}

type MapPosition = Pick<MapNode, 'x' | 'y' | 'r'>
type ConstellationLayout = 'desktop' | 'mobile'

const nodes: MapNode[] = [
  {
    id: 'cartesian-coordinate-system',
    label: 'Cartesian\ncoordinates',
    zh: '笛卡尔坐标',
    x: 112,
    y: 124,
    r: 49,
    formula: '(x, y, z)',
  },
  {
    id: 'cartesian-robot-frame',
    label: 'Robot\nframe',
    zh: '机器人坐标系',
    x: 125,
    y: 281,
    r: 47,
    formula: 'T(x)',
  },
  {
    id: 'gauss-newton-method',
    label: 'Gauss–Newton\nmethod',
    zh: '高斯–牛顿法',
    x: 292,
    y: 56,
    r: 48,
    formula: '(JᵀJ)⁻¹',
  },
  {
    id: 'newton-method',
    label: 'Newton’s\nmethod',
    zh: '牛顿法',
    x: 502,
    y: 55,
    r: 49,
    formula: 'xₖ₊₁',
  },
  {
    id: 'jacobian-matrix',
    label: 'Jacobian',
    zh: '雅可比矩阵',
    x: 407,
    y: 226,
    r: 59,
    formula: 'J',
  },
  {
    id: 'hessian-matrix',
    label: 'Hessian',
    zh: '海森矩阵',
    x: 614,
    y: 231,
    r: 49,
    formula: 'H',
  },
  {
    id: 'laplace-approximation',
    label: 'Laplace\napproximation',
    zh: '拉普拉斯近似',
    x: 343,
    y: 377,
    r: 49,
    formula: '𝒩(θ̂,H⁻¹)',
  },
  {
    id: 'gaussian-distribution',
    label: 'Gaussian\ndistribution',
    zh: '高斯分布',
    x: 646,
    y: 380,
    r: 49,
    formula: '𝒩(μ,Σ)',
  },
]

const mobilePositions: Record<string, MapPosition> = {
  'cartesian-coordinate-system': { x: 60, y: 60, r: 44 },
  'cartesian-robot-frame': { x: 60, y: 185, r: 44 },
  'gauss-newton-method': { x: 180, y: 60, r: 44 },
  'newton-method': { x: 300, y: 60, r: 44 },
  'jacobian-matrix': { x: 180, y: 185, r: 50 },
  'hessian-matrix': { x: 300, y: 185, r: 44 },
  'laplace-approximation': { x: 110, y: 320, r: 44 },
  'gaussian-distribution': { x: 250, y: 320, r: 44 },
}

const edges = [
  { from: 'cartesian-coordinate-system', to: 'cartesian-robot-frame' },
  { from: 'cartesian-robot-frame', to: 'jacobian-matrix' },
  { from: 'gauss-newton-method', to: 'jacobian-matrix' },
  { from: 'gauss-newton-method', to: 'newton-method' },
  { from: 'newton-method', to: 'hessian-matrix' },
  { from: 'jacobian-matrix', to: 'hessian-matrix' },
  { from: 'hessian-matrix', to: 'laplace-approximation' },
  { from: 'laplace-approximation', to: 'gaussian-distribution' },
]

export const constellationConceptIds = nodes.map((node) => node.id)
export const constellationEdges = edges

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
  const positionedNodes = nodes.map((node) => ({
    ...node,
    ...(layout === 'mobile' ? mobilePositions[node.id] : undefined),
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
        {edges.map((edge) => {
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
