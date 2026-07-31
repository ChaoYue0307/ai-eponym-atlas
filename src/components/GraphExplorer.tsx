import Check from 'lucide-react/dist/esm/icons/check.mjs'
import Clipboard from 'lucide-react/dist/esm/icons/clipboard.mjs'
import ListTree from 'lucide-react/dist/esm/icons/list-tree.mjs'
import Minus from 'lucide-react/dist/esm/icons/minus.mjs'
import Plus from 'lucide-react/dist/esm/icons/plus.mjs'
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import { concepts, conceptsById } from '../data/catalog'
import { buildEgoGraph } from '../lib/graph'
import { formatLifespan } from '../lib/lifespan'
import type { EgoGraph, EgoGraphEdge, EgoGraphNode } from '../types'
import { navigate } from '../hooks/useHashRoute'
import { SectionRule } from './SectionRule'

type GraphExplorerProps = {
  locale: Locale
  params: URLSearchParams
}

type PositionedNode = EgoGraphNode & {
  x: number
  y: number
}

type Point = {
  x: number
  y: number
}

export function mergeGraphs(graphs: readonly EgoGraph[], focusConceptId: string): EgoGraph {
  const nodes = new Map<string, EgoGraphNode>()
  const edges = new Map<string, EgoGraphEdge>()

  graphs.forEach((graph) => {
    graph.nodes.forEach((node) =>
      nodes.set(node.id, {
        ...node,
        isFocus: node.kind === 'concept' && node.conceptId === focusConceptId,
      }),
    )
    graph.edges.forEach((edge) => {
      const key =
        edge.relation === 'related-to'
          ? `${[edge.source, edge.target].sort().join('|')}|${edge.relation}`
          : edge.id
      if (!edges.has(key)) edges.set(key, edge)
    })
  })

  const visibleNodes = [...nodes.values()].slice(0, 12)
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id))

  return {
    focusConceptId,
    nodes: visibleNodes,
    edges: [...edges.values()]
      .filter(
        (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
      )
      .slice(0, 24),
  }
}

export function layoutNodes(nodes: readonly EgoGraphNode[]): PositionedNode[] {
  const focus = nodes.find((node) => node.isFocus)
  const rest = nodes.filter((node) => !node.isFocus)
  const center = { x: 400, y: 250 }

  const positions = new Map<string, { x: number; y: number }>()
  if (focus) positions.set(focus.id, center)

  if (rest.length > 10) {
    const people = rest.filter((node) => node.kind === 'person')
    const applications = rest.filter((node) => node.kind === 'application')
    const conceptNodes = rest.filter((node) => node.kind === 'concept')
    const personSlots =
      people.length === 1
        ? [{ x: 400, y: 65 }]
        : [
            { x: 330, y: 65 },
            { x: 470, y: 65 },
          ]
    const applicationSlots = [
      { x: 110, y: 70 },
      { x: 690, y: 70 },
    ]
    const conceptSlots = [
      { x: 245, y: 160 },
      { x: 555, y: 160 },
      { x: 105, y: 245 },
      { x: 695, y: 245 },
      { x: 105, y: 390 },
      { x: 695, y: 390 },
      { x: 275, y: 420 },
      { x: 525, y: 420 },
    ]
    const overflowNodes: EgoGraphNode[] = []
    const occupiedSlots = new Set<string>()

    ;[
      { nodes: people, slots: personSlots },
      { nodes: applications, slots: applicationSlots },
      { nodes: conceptNodes, slots: conceptSlots },
    ].forEach(({ nodes: semanticNodes, slots }) => {
      semanticNodes.forEach((node, index) => {
        const slot = slots[index]
        if (slot) {
          positions.set(node.id, slot)
          occupiedSlots.add(`${slot.x}:${slot.y}`)
        } else {
          overflowNodes.push(node)
        }
      })
    })

    const overflowSlots = [
      ...personSlots,
      ...applicationSlots,
      ...conceptSlots,
    ].filter((slot) => !occupiedSlots.has(`${slot.x}:${slot.y}`))
    overflowNodes.forEach((node, index) => {
      positions.set(node.id, overflowSlots[index] ?? center)
    })
  } else {
    const radiusX = rest.length >= 9 ? 280 : 255
    const radiusY = rest.length >= 9 ? 180 : 165
    rest.forEach((node, index) => {
      const angle =
        -Math.PI / 2 +
        (Math.PI * 2 * index) / Math.max(rest.length, 1)
      positions.set(node.id, {
        x: center.x + Math.cos(angle) * radiusX,
        y: center.y + Math.sin(angle) * radiusY,
      })
    })
  }

  return nodes.map((node) => ({ ...node, ...(positions.get(node.id) ?? center) }))
}

function cross(first: Point, second: Point) {
  return first.x * second.y - first.y * second.x
}

function polygonBoundaryDistance(direction: Point, vertices: readonly Point[]) {
  let nearest = Number.POSITIVE_INFINITY

  vertices.forEach((start, index) => {
    const end = vertices[(index + 1) % vertices.length]!
    const segment = { x: end.x - start.x, y: end.y - start.y }
    const denominator = cross(direction, segment)
    if (Math.abs(denominator) < 0.0001) return

    const distance = cross(start, segment) / denominator
    const position = cross(start, direction) / denominator
    if (distance >= 0 && position >= 0 && position <= 1) {
      nearest = Math.min(nearest, distance)
    }
  })

  return nearest
}

function nodeBoundaryPoint(node: PositionedNode, toward: PositionedNode): Point {
  const delta = { x: toward.x - node.x, y: toward.y - node.y }
  const length = Math.hypot(delta.x, delta.y)
  if (length === 0) return { x: node.x, y: node.y }

  const direction = { x: delta.x / length, y: delta.y / length }
  if (node.kind === 'person') {
    return {
      x: node.x + direction.x * 52,
      y: node.y + direction.y * 52,
    }
  }

  const vertices =
    node.kind === 'application'
      ? [
          { x: -62, y: 0 },
          { x: -32, y: -43 },
          { x: 32, y: -43 },
          { x: 62, y: 0 },
          { x: 32, y: 43 },
          { x: -32, y: 43 },
        ]
      : [
          { x: -68, y: -42 },
          { x: 68, y: -42 },
          { x: 68, y: 42 },
          { x: -68, y: 42 },
        ]
  const distance = polygonBoundaryDistance(direction, vertices)

  return {
    x: node.x + direction.x * distance,
    y: node.y + direction.y * distance,
  }
}

function wrapLabel(label: string, max = 18) {
  if (label.length <= max) return [label]
  const words = label.split(' ')
  const lines: string[] = []
  let current = ''
  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > max && current) {
      lines.push(current)
      current = word
    } else {
      current = `${current} ${word}`.trim()
    }
  })
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

const relationTitles = {
  'named-after': { en: 'Named after', zh: '名字来源' },
  'related-to': { en: 'Built from & paired with', zh: '建立在这些概念之上' },
  'applied-in': { en: 'Applied in', zh: '应用于' },
} as const

export function GraphExplorer({ locale, params }: GraphExplorerProps) {
  const t = copy[locale].graph
  const initialFocus = params.get('focus')
  const [focusId, setFocusId] = useState(
    initialFocus && conceptsById.has(initialFocus) ? initialFocus : 'hessian-matrix',
  )
  const [depth, setDepth] = useState(params.get('depth') === '2' ? 2 : 1)
  const [includePeople, setIncludePeople] = useState(true)
  const [includeConcepts, setIncludeConcepts] = useState(true)
  const [includeApplications, setIncludeApplications] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const relationshipsRef = useRef<HTMLElement>(null)
  const graphViewportRef = useRef<HTMLDivElement>(null)

  const graph = useMemo(() => {
    const base = buildEgoGraph(focusId, {
      includePeople,
      includeRelatedConcepts: includeConcepts,
      includeApplications,
      maxRelatedConcepts: 5,
      maxApplications: 2,
    })

    if (depth === 1 || !includeConcepts) return base

    const secondary = base.nodes
      .filter(
        (node): node is Extract<EgoGraphNode, { kind: 'concept' }> =>
          node.kind === 'concept' && !node.isFocus,
      )
      .slice(0, 5)
      .map((node) =>
        buildEgoGraph(node.conceptId, {
          includePeople: false,
          includeApplications: false,
          includeRelatedConcepts: true,
          maxRelatedConcepts: 2,
        }),
      )

    return mergeGraphs([base, ...secondary], focusId)
  }, [depth, focusId, includeApplications, includeConcepts, includePeople])

  const positionedNodes = useMemo(() => layoutNodes(graph.nodes), [graph.nodes])
  const positionById = useMemo(
    () => new Map(positionedNodes.map((node) => [node.id, node])),
    [positionedNodes],
  )

  const suggestions = useMemo(() => {
    const normalized = searchQuery.trim().toLocaleLowerCase()
    if (!normalized) return []
    return concepts
      .filter((concept) =>
        [concept.term, concept.zhTerm, ...concept.aliases]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalized),
      )
      .slice(0, 6)
  }, [searchQuery])

  useEffect(() => {
    const next = new URLSearchParams({ focus: focusId })
    if (depth !== 1) next.set('depth', String(depth))
    navigate('/graph', next, true)
  }, [depth, focusId])

  useEffect(() => {
    const viewport = graphViewportRef.current
    if (!viewport || !window.matchMedia('(max-width: 960px)').matches) return

    const frame = window.requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(
        0,
        (viewport.scrollWidth - viewport.clientWidth) / 2,
      )
    })
    return () => window.cancelAnimationFrame(frame)
  }, [graph])

  const selectNode = (node: EgoGraphNode) => {
    if (node.kind === 'concept') {
      setFocusId(node.conceptId)
      setSearchQuery('')
    } else if (node.kind === 'person') {
      navigate(`/person/${node.personId}`)
    }
  }

  const ensureGraphNodeVisible = (node: SVGGElement) => {
    const viewport = graphViewportRef.current
    if (!viewport || !window.matchMedia('(max-width: 960px)').matches) return

    const viewportRect = viewport.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()
    const padding = 20
    if (nodeRect.left < viewportRect.left + padding) {
      viewport.scrollLeft -= viewportRect.left + padding - nodeRect.left
    } else if (nodeRect.right > viewportRect.right - padding) {
      viewport.scrollLeft += nodeRect.right - (viewportRect.right - padding)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      window.prompt(locale === 'zh' ? '复制链接：' : 'Copy link:', window.location.href)
    }
  }

  const focusedConcept = conceptsById.get(focusId)!

  return (
    <main className="graph-page">
      <header className="page-intro page-intro--graph">
        <p className="section-number">02 — GRAPH</p>
        <h1>{t.title}</h1>
        <SectionRule />
        <p>{t.description}</p>
      </header>

      <div className="graph-workspace">
        <aside className="graph-controls">
          <div className="graph-search">
            <label className="search-field">
              <Search aria-hidden="true" />
              <span className="sr-only">{t.focus}</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.focus}
              />
            </label>
            {suggestions.length ? (
              <div className="graph-search__suggestions">
                {suggestions.map((concept) => (
                  <button
                    type="button"
                    key={concept.id}
                    onClick={() => {
                      setFocusId(concept.id)
                      setSearchQuery('')
                    }}
                  >
                    <span>{concept.term}</span>
                    <small>{concept.zhTerm}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <fieldset>
            <legend>{t.depth}</legend>
            <div className="segmented-control">
              {[1, 2].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={depth === value ? 'is-active' : ''}
                  onClick={() => setDepth(value)}
                  aria-pressed={depth === value}
                >
                  {value} {locale === 'zh' ? '跳' : value === 1 ? 'hop' : 'hops'}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t.show}</legend>
            {[
              {
                key: 'people',
                label: t.people,
                value: includePeople,
                set: setIncludePeople,
                shape: '○',
              },
              {
                key: 'concepts',
                label: t.concepts,
                value: includeConcepts,
                set: setIncludeConcepts,
                shape: '▭',
              },
              {
                key: 'applications',
                label: t.applications,
                value: includeApplications,
                set: setIncludeApplications,
                shape: '⬡',
              },
            ].map((item) => (
              <label className="graph-toggle" key={item.key}>
                <span aria-hidden="true">{item.shape}</span>
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={(event) => item.set(event.target.checked)}
                />
                <i aria-hidden="true" />
              </label>
            ))}
          </fieldset>

          <button
            className="button button--primary graph-list-button"
            type="button"
            onClick={() => relationshipsRef.current?.scrollIntoView()}
          >
            <ListTree aria-hidden="true" />
            {t.list}
          </button>
        </aside>

        <div className="graph-canvas">
          <div className="graph-canvas__tools">
            <button type="button" onClick={() => setZoom(1)}>
              <RotateCcw aria-hidden="true" />
              {t.reset}
            </button>
            <div>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))}
                aria-label={locale === 'zh' ? '缩小' : 'Zoom out'}
              >
                <Minus aria-hidden="true" />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(1.3, value + 0.1))}
                aria-label={locale === 'zh' ? '放大' : 'Zoom in'}
              >
                <Plus aria-hidden="true" />
              </button>
            </div>
            <button type="button" onClick={copyLink}>
              {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
              <span className="sr-only">
                {locale === 'zh'
                  ? copied
                    ? '已复制'
                    : '复制链接'
                  : copied
                    ? 'Copied'
                    : 'Copy link'}
              </span>
            </button>
          </div>

          <div className="graph-canvas__viewport" ref={graphViewportRef}>
            <svg
              viewBox="0 0 800 500"
              role="group"
              aria-labelledby="ego-graph-title"
              aria-describedby="ego-graph-description"
            >
              <title id="ego-graph-title">
                {locale === 'zh'
                  ? `${focusedConcept.zhTerm}的${depth}跳概念关系图，共 ${graph.nodes.length} 个节点`
                  : `${focusedConcept.term} ${depth === 1 ? 'one-hop' : 'two-hop'} concept graph with ${graph.nodes.length} nodes`}
              </title>
              <desc id="ego-graph-description">
                {locale === 'zh'
                  ? '矩形表示概念，圆形表示人物，六边形表示 AI 应用。箭头表示命名或应用方向，直线表示相关概念。概念和人物节点可选择。'
                  : 'Rectangles are concepts, circles are people, and hexagons are AI applications. Arrows show naming or application direction; plain lines connect related concepts. Concept and person nodes are selectable.'}
              </desc>
              <defs>
                <marker
                  id="graph-arrow-named-after"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--blue)" />
                </marker>
                <marker
                  id="graph-arrow-applied-in"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--red)" />
                </marker>
              </defs>
              <g
                className="graph-zoom-layer"
                style={{
                  transform: `translate(${400 * (1 - zoom)}px, ${250 * (1 - zoom)}px) scale(${zoom})`,
                }}
              >
                <g className="graph-edges" aria-hidden="true">
                  {graph.edges.map((edge) => {
                    const source = positionById.get(edge.source)
                    const target = positionById.get(edge.target)
                    if (!source || !target) return null
                    const start = nodeBoundaryPoint(source, target)
                    const end = nodeBoundaryPoint(target, source)
                    return (
                      <line
                        key={edge.id}
                        className={`graph-edge graph-edge--${edge.relation}`}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        markerEnd={
                          edge.directed
                            ? `url(#graph-arrow-${edge.relation})`
                            : undefined
                        }
                      />
                    )
                  })}
                </g>
                <g className="graph-nodes">
                  {positionedNodes.map((node) => {
                    const label = locale === 'zh' ? node.zhLabel : node.label
                    const lines = wrapLabel(label)
                    const isInteractive = node.kind !== 'application'
                    return (
                      <g
                        key={node.id}
                        className={`graph-node graph-node--${node.kind}${
                          node.isFocus ? ' graph-node--focus' : ''
                        }${isInteractive ? ' graph-node--interactive' : ''}`}
                        role={isInteractive ? 'button' : undefined}
                        tabIndex={isInteractive ? 0 : undefined}
                        onClick={isInteractive ? () => selectNode(node) : undefined}
                        onFocus={
                          isInteractive
                            ? (event) => ensureGraphNodeVisible(event.currentTarget)
                            : undefined
                        }
                        onKeyDown={
                          isInteractive
                            ? (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault()
                                  selectNode(node)
                                }
                              }
                            : undefined
                        }
                        aria-label={label}
                      >
                        {node.kind === 'person' ? (
                          <circle cx={node.x} cy={node.y} r="52" />
                        ) : node.kind === 'application' ? (
                          <polygon
                            points={`${node.x - 62},${node.y} ${node.x - 32},${
                              node.y - 43
                            } ${node.x + 32},${node.y - 43} ${node.x + 62},${node.y} ${
                              node.x + 32
                            },${node.y + 43} ${node.x - 32},${node.y + 43}`}
                          />
                        ) : (
                          <rect
                            x={node.x - 68}
                            y={node.y - 42}
                            width="136"
                            height="84"
                            rx="5"
                          />
                        )}
                        <text
                          x={node.x}
                          y={node.y - ((lines.length - 1) * 8)}
                          textAnchor="middle"
                        >
                          {lines.map((line, index) => (
                            <tspan key={line} x={node.x} dy={index === 0 ? 0 : 17}>
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </g>
            </svg>
          </div>
          <ul
            className="graph-canvas__legend"
            aria-label={locale === 'zh' ? '关系类型图例' : 'Relationship legend'}
          >
            <li>
              <span className="graph-legend-line graph-legend-line--named-after" aria-hidden="true" />
              {locale === 'zh' ? '名字来源' : 'Named after'}
            </li>
            <li>
              <span className="graph-legend-line graph-legend-line--related-to" aria-hidden="true" />
              {locale === 'zh' ? '相关概念' : 'Related'}
            </li>
            <li>
              <span className="graph-legend-line graph-legend-line--applied-in" aria-hidden="true" />
              {locale === 'zh' ? 'AI 应用' : 'AI use'}
            </li>
          </ul>
          <p className="graph-canvas__summary">
            <strong>{focusedConcept.term}</strong>
            <span>{focusedConcept.functionNickname[locale]}</span>
          </p>
        </div>

        <section className="relationship-panel" ref={relationshipsRef}>
          <header>
            <p>{locale === 'zh' ? '当前概念' : 'Focus concept'}</p>
            <h2>
              {focusedConcept.term} <span>/ {focusedConcept.zhTerm}</span>
            </h2>
            <p>{focusedConcept.question[locale]}</p>
          </header>
          {(Object.keys(relationTitles) as Array<keyof typeof relationTitles>).map((relation) => {
            const focusNodeId = `concept:${focusId}`
            const edges = graph.edges.filter(
              (edge) =>
                edge.relation === relation &&
                (edge.source === focusNodeId || edge.target === focusNodeId),
            )
            if (!edges.length) return null
            return (
              <div className="relationship-group" key={relation}>
                <h3>{relationTitles[relation][locale]}</h3>
                {edges.map((edge) => {
                  const otherId =
                    edge.source === `concept:${focusId}` ? edge.target : edge.source
                  const node = positionById.get(otherId)
                  if (!node) return null
                  if (node.kind === 'application') {
                    return (
                      <div
                        className="relationship-item relationship-item--static"
                        key={edge.id}
                      >
                        <span>
                          <strong>{locale === 'zh' ? node.zhLabel : node.label}</strong>
                          <small>
                            {locale === 'zh'
                              ? edge.zhNote ?? edge.zhLabel
                              : edge.note ?? edge.label}{' '}
                            · {locale === 'zh' ? 'AI 应用' : 'AI application'}
                          </small>
                        </span>
                      </div>
                    )
                  }
                  return (
                    <button key={edge.id} type="button" onClick={() => selectNode(node)}>
                      <span>
                        <strong>{locale === 'zh' ? node.zhLabel : node.label}</strong>
                        <small>
                          {locale === 'zh'
                            ? edge.zhNote ?? edge.zhLabel
                            : edge.note ?? edge.label}{' '}
                          ·{' '}
                          {node.kind === 'concept'
                            ? node.meta.functionNickname[locale]
                            : formatLifespan(node.meta, locale)}
                        </small>
                      </span>
                      <span aria-hidden="true">→</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
          <button
            className="text-button relationship-panel__full"
            type="button"
            onClick={() => navigate(`/concept/${focusId}`)}
          >
            {locale === 'zh' ? '查看完整概念条目' : 'View full concept entry'}
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </div>
    </main>
  )
}
