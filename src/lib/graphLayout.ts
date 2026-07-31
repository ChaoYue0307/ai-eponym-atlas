import type { EgoGraph, EgoGraphEdge, EgoGraphNode } from '../types'

export type PositionedNode = EgoGraphNode & {
  x: number
  y: number
}

export function mergeGraphs(
  graphs: readonly EgoGraph[],
  focusConceptId: string,
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

  const visibleNodes = [...nodes.values()].slice(0, 12)
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id))

  return {
    focusConceptId,
    nodes: visibleNodes,
    edges: [...edges.values()]
      .filter(
        (edge) =>
          visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
      )
      .slice(0, 24),
  }
}

export function layoutNodes(
  nodes: readonly EgoGraphNode[],
): PositionedNode[] {
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

  return nodes.map((node) => ({
    ...node,
    ...(positions.get(node.id) ?? center),
  }))
}
