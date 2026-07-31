import type { EgoGraph, EgoGraphEdge, EgoGraphNode } from '../types'

export const GRAPH_VIEWBOX = Object.freeze({
  width: 960,
  height: 640,
})

export type PositionedNode = EgoGraphNode & {
  x: number
  y: number
}

export type GraphNodeVisualBounds = {
  left: number
  right: number
  top: number
  bottom: number
}

export type GraphRoutePoint = {
  x: number
  y: number
}

/**
 * The complete painted footprint of each graph node, relative to its anchor.
 * Person bounds include the name beneath the portrait. Keeping these values in
 * one place lets layout, camera fitting, and regression tests use the same
 * geometry as the SVG.
 */
export function graphNodeVisualBounds(
  node: Pick<EgoGraphNode, 'kind' | 'isFocus'>,
): GraphNodeVisualBounds {
  if (node.kind === 'person') {
    return { left: -74, right: 74, top: -54, bottom: 102 }
  }
  if (node.kind === 'application') {
    return { left: -80, right: 80, top: -54, bottom: 54 }
  }
  return node.isFocus
    ? { left: -94, right: 94, top: -60, bottom: 60 }
    : { left: -76, right: 76, top: -48, bottom: 48 }
}

function segmentIntersectsBox(
  start: GraphRoutePoint,
  end: GraphRoutePoint,
  box: GraphNodeVisualBounds,
) {
  const delta = { x: end.x - start.x, y: end.y - start.y }
  let minimum = 0
  let maximum = 1
  const axes = [
    { origin: start.x, delta: delta.x, low: box.left, high: box.right },
    { origin: start.y, delta: delta.y, low: box.top, high: box.bottom },
  ]

  for (const axis of axes) {
    if (Math.abs(axis.delta) < 0.0001) {
      if (axis.origin <= axis.low || axis.origin >= axis.high) return false
      continue
    }
    const first = (axis.low - axis.origin) / axis.delta
    const second = (axis.high - axis.origin) / axis.delta
    minimum = Math.max(minimum, Math.min(first, second))
    maximum = Math.min(maximum, Math.max(first, second))
    if (minimum >= maximum) return false
  }

  return maximum > 0 && minimum < 1
}

function routeLength(points: readonly GraphRoutePoint[]) {
  let length = 0
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]!
    const current = points[index]!
    length += Math.hypot(current.x - previous.x, current.y - previous.y)
  }
  return length
}

/**
 * Route an edge around every unrelated painted node footprint. The direct
 * segment is preferred; otherwise deterministic orthogonal corridors are
 * scored by total length and bend count. This keeps the diagram readable
 * without a runtime layout dependency or non-deterministic force simulation.
 */
export function routeGraphEdge(
  source: PositionedNode,
  target: PositionedNode,
  nodes: readonly PositionedNode[],
): GraphRoutePoint[] {
  const clearance = 8
  const obstacles = nodes
    .filter((node) => node.id !== source.id && node.id !== target.id)
    .map((node) => {
      const bounds = graphNodeVisualBounds(node)
      return {
        left: node.x + bounds.left - clearance,
        right: node.x + bounds.right + clearance,
        top: node.y + bounds.top - clearance,
        bottom: node.y + bounds.bottom + clearance,
      }
    })
  const start = { x: source.x, y: source.y }
  const end = { x: target.x, y: target.y }
  const sourceBounds = graphNodeVisualBounds(source)
  const targetBounds = graphNodeVisualBounds(target)
  const sourceXExits = [
    Math.max(8, source.x + sourceBounds.left - clearance * 2),
    Math.min(
      GRAPH_VIEWBOX.width - 8,
      source.x + sourceBounds.right + clearance * 2,
    ),
  ]
  const targetXExits = [
    Math.max(8, target.x + targetBounds.left - clearance * 2),
    Math.min(
      GRAPH_VIEWBOX.width - 8,
      target.x + targetBounds.right + clearance * 2,
    ),
  ]
  const sourceYExits = [
    Math.max(8, source.y + sourceBounds.top - clearance * 2),
    Math.min(
      GRAPH_VIEWBOX.height - 8,
      source.y + sourceBounds.bottom + clearance * 2,
    ),
  ]
  const targetYExits = [
    Math.max(8, target.y + targetBounds.top - clearance * 2),
    Math.min(
      GRAPH_VIEWBOX.height - 8,
      target.y + targetBounds.bottom + clearance * 2,
    ),
  ]
  const xCorridors = new Set<number>([8, GRAPH_VIEWBOX.width - 8])
  const yCorridors = new Set<number>([8, GRAPH_VIEWBOX.height - 8])
  obstacles.forEach((box) => {
    xCorridors.add(Math.max(8, box.left - clearance))
    xCorridors.add(Math.min(GRAPH_VIEWBOX.width - 8, box.right + clearance))
    yCorridors.add(Math.max(8, box.top - clearance))
    yCorridors.add(Math.min(GRAPH_VIEWBOX.height - 8, box.bottom + clearance))
  })

  const candidates: GraphRoutePoint[][] = [
    [start, end],
    [start, { x: end.x, y: start.y }, end],
    [start, { x: start.x, y: end.y }, end],
  ]
  xCorridors.forEach((x) => {
    candidates.push([start, { x, y: start.y }, { x, y: end.y }, end])
  })
  sourceXExits.forEach((sourceX) => {
    targetXExits.forEach((targetX) => {
      yCorridors.forEach((y) => {
        candidates.push([
          start,
          { x: sourceX, y: start.y },
          { x: sourceX, y },
          { x: targetX, y },
          { x: targetX, y: end.y },
          end,
        ])
      })
    })
  })
  sourceYExits.forEach((sourceY) => {
    targetYExits.forEach((targetY) => {
      xCorridors.forEach((x) => {
        candidates.push([
          start,
          { x: start.x, y: sourceY },
          { x, y: sourceY },
          { x, y: targetY },
          { x: end.x, y: targetY },
          end,
        ])
      })
    })
  })
  yCorridors.forEach((y) => {
    candidates.push([start, { x: start.x, y }, { x: end.x, y }, end])
  })
  xCorridors.forEach((x) => {
    yCorridors.forEach((y) => {
      candidates.push([
        start,
        { x, y: start.y },
        { x, y },
        { x: end.x, y },
        end,
      ])
      candidates.push([
        start,
        { x: start.x, y },
        { x, y },
        { x, y: end.y },
        end,
      ])
    })
  })

  const routeIsClear = (points: readonly GraphRoutePoint[]) => {
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1]!
      const current = points[index]!
      if (
        obstacles.some((box) => segmentIntersectsBox(previous, current, box))
      ) {
        return false
      }
    }
    return true
  }

  const clearRoutes = candidates.filter(routeIsClear)
  if (!clearRoutes.length) return [start, end]
  return clearRoutes.reduce((best, candidate) => {
    const bestScore = routeLength(best) + Math.max(0, best.length - 2) * 18
    const candidateScore =
      routeLength(candidate) + Math.max(0, candidate.length - 2) * 18
    return candidateScore < bestScore ? candidate : best
  })
}

type MergeGraphOptions = {
  /**
   * Visual graphs deliberately stay compact. Callers that need the complete
   * semantic graph can opt out with `Number.POSITIVE_INFINITY`.
   */
  maxNodes?: number
  maxEdges?: number
}

const DEFAULT_MAX_NODES = 12
const DEFAULT_MAX_EDGES = 24

function normalizedLimit(value: number | undefined, fallback: number) {
  if (value === undefined) return fallback
  if (!Number.isFinite(value)) return Number.POSITIVE_INFINITY
  return Math.max(0, Math.floor(value))
}

/**
 * Merge overlapping ego graphs without losing the semantic identity of
 * undirected relations. The default remains intentionally compact for the
 * canvas; pass infinite limits for the full adjacency model.
 */
export function mergeGraphs(
  graphs: readonly EgoGraph[],
  focusConceptId: string,
  options: MergeGraphOptions = {},
): EgoGraph {
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

  const maxNodes = normalizedLimit(options.maxNodes, DEFAULT_MAX_NODES)
  const maxEdges = normalizedLimit(options.maxEdges, DEFAULT_MAX_EDGES)
  const visibleNodes = [...nodes.values()].slice(0, maxNodes)
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id))

  return {
    focusConceptId,
    nodes: visibleNodes,
    edges: [...edges.values()]
      .filter(
        (edge) =>
          visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
      )
      .slice(0, maxEdges),
  }
}

function stableNodes(nodes: readonly EgoGraphNode[]) {
  return [...nodes].sort((first, second) => first.id.localeCompare(second.id))
}

function alternatingColumns(nodes: readonly EgoGraphNode[]) {
  const left: EgoGraphNode[] = []
  const right: EgoGraphNode[] = []
  nodes.forEach((node, index) => {
    ;(index % 2 === 0 ? left : right).push(node)
  })
  return { left, right }
}

const conceptRows = [240, 340, 440] as const

function rowsForCount(count: number) {
  if (count <= 0) return []
  if (count === 1) return [conceptRows[1]]
  if (count === 2) return [270, 410]
  return conceptRows.slice(0, Math.min(3, count))
}

function placeColumn(
  nodes: readonly EgoGraphNode[],
  x: number,
  positions: Map<string, { x: number; y: number }>,
) {
  const rows = rowsForCount(nodes.length)
  nodes.slice(0, rows.length).forEach((node, index) => {
    positions.set(node.id, { x, y: rows[index]! })
  })
}

function fallbackConceptSlots() {
  return [
    { x: 290, y: 240 },
    { x: 670, y: 240 },
    { x: 290, y: 340 },
    { x: 670, y: 340 },
    { x: 290, y: 440 },
    { x: 670, y: 440 },
    { x: 92, y: 240 },
    { x: 868, y: 240 },
    { x: 92, y: 340 },
    { x: 868, y: 340 },
    { x: 92, y: 440 },
    { x: 868, y: 440 },
  ] as const
}

/**
 * Deterministic semantic layout.
 *
 * People occupy the naming layer, the focus concept stays at the visual
 * centre, first-hop concepts form balanced left/right columns, second-hop
 * concepts stay beside their parent side, and applications occupy the output
 * layer. Stable sorting makes screenshots, keyboard navigation, and tests
 * reproducible.
 */
export function layoutNodes(
  nodes: readonly EgoGraphNode[],
  edges: readonly EgoGraphEdge[] = [],
): PositionedNode[] {
  const focus = nodes.find((node) => node.isFocus)
  const center = { x: GRAPH_VIEWBOX.width / 2, y: 340 }
  const positions = new Map<string, { x: number; y: number }>()
  if (focus) positions.set(focus.id, center)

  const people = stableNodes(
    nodes.filter((node) => !node.isFocus && node.kind === 'person'),
  )
  const applications = stableNodes(
    nodes.filter((node) => !node.isFocus && node.kind === 'application'),
  )
  const concepts = stableNodes(
    nodes.filter((node) => !node.isFocus && node.kind === 'concept'),
  )

  const placeHorizontal = (
    semanticNodes: readonly EgoGraphNode[],
    y: number,
    spread: number,
  ) => {
    const start = center.x - ((semanticNodes.length - 1) * spread) / 2
    semanticNodes.forEach((node, index) => {
      positions.set(node.id, { x: start + index * spread, y })
    })
  }

  placeHorizontal(people, 86, 170)
  placeHorizontal(applications, 570, 220)

  const focusId = focus?.id
  const directIds = new Set<string>()
  if (focusId) {
    edges.forEach((edge) => {
      if (edge.source === focusId) directIds.add(edge.target)
      if (edge.target === focusId) directIds.add(edge.source)
    })
  }

  // Without edge information, use a collision-free slot map compatible with
  // callers that only need a stable node layout.
  if (edges.length === 0 || !focusId) {
    concepts.forEach((node, index) => {
      positions.set(node.id, fallbackConceptSlots()[index] ?? center)
    })
  } else {
    const directConcepts = concepts.filter((node) => directIds.has(node.id))
    const secondaryConcepts = concepts.filter((node) => !directIds.has(node.id))
    const directColumns = alternatingColumns(directConcepts)
    placeColumn(directColumns.left, 290, positions)
    placeColumn(directColumns.right, 670, positions)

    const sideByDirectId = new Map<string, 'left' | 'right'>()
    directColumns.left.forEach((node) => sideByDirectId.set(node.id, 'left'))
    directColumns.right.forEach((node) => sideByDirectId.set(node.id, 'right'))

    const secondaryBySide = {
      left: [] as EgoGraphNode[],
      right: [] as EgoGraphNode[],
    }
    secondaryConcepts.forEach((node, index) => {
      const parentEdge = edges.find(
        (edge) =>
          (edge.source === node.id && directIds.has(edge.target)) ||
          (edge.target === node.id && directIds.has(edge.source)),
      )
      const parentId =
        parentEdge?.source === node.id ? parentEdge.target : parentEdge?.source
      const parentSide = parentId ? sideByDirectId.get(parentId) : undefined
      const side: 'left' | 'right' =
        parentSide ?? (index % 2 === 0 ? 'left' : 'right')
      const preferred = secondaryBySide[side]
      const alternate = secondaryBySide[side === 'left' ? 'right' : 'left']
      ;(preferred.length < 3 ? preferred : alternate).push(node)
    })

    placeColumn(secondaryBySide.left, 92, positions)
    placeColumn(secondaryBySide.right, 868, positions)

    // A compact graph can contain more direct concepts than the two semantic
    // columns can comfortably hold. Fill the remaining collision-free slots.
    concepts
      .filter((node) => !positions.has(node.id))
      .forEach((node, index) => {
        positions.set(node.id, fallbackConceptSlots()[index] ?? center)
      })
  }

  return nodes.map((node) => ({
    ...node,
    ...(positions.get(node.id) ?? center),
  }))
}

const graphemeSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

function graphemes(value: string) {
  return graphemeSegmenter
    ? [...graphemeSegmenter.segment(value)].map((entry) => entry.segment)
    : Array.from(value)
}

function graphemeLength(value: string) {
  return graphemes(value).length
}

/**
 * Wrap graph labels without splitting emoji, combining marks, or Chinese
 * grapheme clusters. Latin labels prefer word boundaries; unspaced scripts
 * fall back to grapheme-aware chunks.
 */
export function wrapGraphLabel(
  label: string,
  maxGraphemes = 18,
  maxLines = 3,
) {
  const trimmed = label.trim()
  if (!trimmed) return []
  if (graphemeLength(trimmed) <= maxGraphemes) return [trimmed]

  const words = trimmed.split(/\s+/u)
  const lines: string[] = []
  if (words.length > 1) {
    let current = ''
    words.forEach((word) => {
      if (graphemeLength(word) > maxGraphemes) {
        if (current) {
          lines.push(current)
          current = ''
        }
        const units = graphemes(word)
        while (units.length > maxGraphemes) {
          lines.push(units.splice(0, maxGraphemes).join(''))
        }
        current = units.join('')
        return
      }
      const candidate = current ? `${current} ${word}` : word
      if (graphemeLength(candidate) > maxGraphemes && current) {
        lines.push(current)
        current = word
      } else {
        current = candidate
      }
    })
    if (current) lines.push(current)
  } else {
    const units = graphemes(trimmed)
    for (let index = 0; index < units.length; index += maxGraphemes) {
      lines.push(units.slice(index, index + maxGraphemes).join(''))
    }
  }

  if (lines.length <= maxLines) return lines
  const visible = lines.slice(0, maxLines)
  const finalLine = visible[maxLines - 1] ?? ''
  const finalGraphemes = graphemes(finalLine)
  visible[maxLines - 1] = `${finalGraphemes
    .slice(0, Math.max(1, maxGraphemes - 1))
    .join('')}…`
  return visible
}
