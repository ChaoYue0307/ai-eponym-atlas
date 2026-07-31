import type { EgoGraph, EgoGraphEdge, EgoGraphNode } from '../types'

export const GRAPH_VIEWBOX = Object.freeze({
  width: 960,
  height: 640,
})

export type PositionedNode = EgoGraphNode & {
  x: number
  y: number
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

function distribute(
  nodes: readonly EgoGraphNode[],
  x: number,
  top: number,
  bottom: number,
) {
  if (nodes.length === 0) return []
  if (nodes.length === 1) {
    return [{ node: nodes[0]!, x, y: (top + bottom) / 2 }]
  }
  const step = (bottom - top) / (nodes.length - 1)
  return nodes.map((node, index) => ({ node, x, y: top + step * index }))
}

function alternatingColumns(nodes: readonly EgoGraphNode[]) {
  const left: EgoGraphNode[] = []
  const right: EgoGraphNode[] = []
  nodes.forEach((node, index) => {
    ;(index % 2 === 0 ? left : right).push(node)
  })
  return { left, right }
}

function fallbackConceptSlots() {
  return [
    { x: 190, y: 190 },
    { x: 770, y: 190 },
    { x: 190, y: 320 },
    { x: 770, y: 320 },
    { x: 190, y: 450 },
    { x: 770, y: 450 },
    { x: 340, y: 195 },
    { x: 620, y: 195 },
    { x: 340, y: 445 },
    { x: 620, y: 445 },
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
  const center = { x: GRAPH_VIEWBOX.width / 2, y: 320 }
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

  placeHorizontal(people, 76, 145)
  placeHorizontal(applications, 556, 205)

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
    const hasSecondary = secondaryConcepts.length > 0
    const directLeftX = hasSecondary ? 285 : 195
    const directRightX = hasSecondary ? 675 : 765

    const directPositions = [
      ...distribute(directColumns.left, directLeftX, 190, 450),
      ...distribute(directColumns.right, directRightX, 190, 450),
    ]
    directPositions.forEach(({ node, x, y }) => positions.set(node.id, { x, y }))

    const sideByDirectId = new Map<string, 'left' | 'right'>()
    directColumns.left.forEach((node) => sideByDirectId.set(node.id, 'left'))
    directColumns.right.forEach((node) => sideByDirectId.set(node.id, 'right'))

    const secondaryBySide = { left: [] as EgoGraphNode[], right: [] as EgoGraphNode[] }
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
      secondaryBySide[side].push(node)
    })

    const secondaryPositions = [
      ...distribute(secondaryBySide.left, 92, 180, 460),
      ...distribute(secondaryBySide.right, 868, 180, 460),
    ]
    secondaryPositions.forEach(({ node, x, y }) =>
      positions.set(node.id, { x, y }),
    )

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
