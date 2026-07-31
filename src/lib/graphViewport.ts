import type { EgoGraph } from '../types'
import {
  GRAPH_VIEWBOX,
  graphNodeVisualBounds,
  type PositionedNode,
} from './graphLayout'

export type GraphCamera = {
  x: number
  y: number
  scale: number
}

export const GRAPH_CAMERA_MIN = 0.55
export const GRAPH_CAMERA_MAX = 3.2
export const DEFAULT_GRAPH_CAMERA: GraphCamera = Object.freeze({
  x: 0,
  y: 0,
  scale: 1,
})

export function clampGraphScale(value: number) {
  return Math.min(GRAPH_CAMERA_MAX, Math.max(GRAPH_CAMERA_MIN, value))
}

export function calculateFitCamera(
  nodes: readonly PositionedNode[],
): GraphCamera {
  if (!nodes.length) return DEFAULT_GRAPH_CAMERA
  const bounds = nodes.reduce(
    (result, node) => {
      const visual = graphNodeVisualBounds(node)
      return {
        left: Math.min(result.left, node.x + visual.left),
        right: Math.max(result.right, node.x + visual.right),
        top: Math.min(result.top, node.y + visual.top),
        bottom: Math.max(result.bottom, node.y + visual.bottom),
      }
    },
    {
      left: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    },
  )
  const paddingX = 42
  const paddingY = 36
  const width = Math.max(1, bounds.right - bounds.left)
  const height = Math.max(1, bounds.bottom - bounds.top)
  const scale = Math.min(
    1.12,
    Math.max(
      GRAPH_CAMERA_MIN,
      Math.min(
        (GRAPH_VIEWBOX.width - paddingX * 2) / width,
        (GRAPH_VIEWBOX.height - paddingY * 2) / height,
      ),
    ),
  )

  return {
    scale,
    x: (GRAPH_VIEWBOX.width - width * scale) / 2 - bounds.left * scale,
    y: (GRAPH_VIEWBOX.height - height * scale) / 2 - bounds.top * scale,
  }
}

export function findGraphPath(
  graph: EgoGraph,
  fromId: string,
  toId: string,
): { nodeIds: ReadonlySet<string>; edgeIds: ReadonlySet<string> } {
  if (fromId === toId) {
    return { nodeIds: new Set([fromId]), edgeIds: new Set() }
  }

  const adjacency = new Map<string, Array<{ nodeId: string; edgeId: string }>>()
  graph.edges.forEach((edge) => {
    const source = adjacency.get(edge.source) ?? []
    source.push({ nodeId: edge.target, edgeId: edge.id })
    adjacency.set(edge.source, source)
    const target = adjacency.get(edge.target) ?? []
    target.push({ nodeId: edge.source, edgeId: edge.id })
    adjacency.set(edge.target, target)
  })

  const queue = [fromId]
  const previous = new Map<string, { nodeId: string; edgeId: string }>()
  const visited = new Set(queue)
  while (queue.length) {
    const current = queue.shift()!
    for (const neighbor of adjacency.get(current) ?? []) {
      if (visited.has(neighbor.nodeId)) continue
      visited.add(neighbor.nodeId)
      previous.set(neighbor.nodeId, {
        nodeId: current,
        edgeId: neighbor.edgeId,
      })
      if (neighbor.nodeId === toId) {
        queue.length = 0
        break
      }
      queue.push(neighbor.nodeId)
    }
  }

  if (!previous.has(toId)) {
    return { nodeIds: new Set([fromId]), edgeIds: new Set() }
  }

  const nodeIds = new Set([toId])
  const edgeIds = new Set<string>()
  let cursor = toId
  while (cursor !== fromId) {
    const step = previous.get(cursor)
    if (!step) break
    nodeIds.add(step.nodeId)
    edgeIds.add(step.edgeId)
    cursor = step.nodeId
  }
  return { nodeIds, edgeIds }
}
