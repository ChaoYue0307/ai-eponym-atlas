import { describe, expect, it } from 'vitest'
import { buildEgoGraph } from './graph'
import {
  layoutNodes,
  mergeGraphs,
  wrapGraphLabel,
} from './graphLayout'
import { calculateFitCamera, findGraphPath } from './graphViewport'

describe('graph viewport and presentation helpers', () => {
  it('keeps compact and complete graph models explicit', () => {
    const base = buildEgoGraph('hessian-matrix')
    const related = base.nodes
      .filter(
        (
          node,
        ): node is Extract<(typeof base.nodes)[number], { kind: 'concept' }> =>
          node.kind === 'concept' && !node.isFocus,
      )
      .map((node) => buildEgoGraph(node.conceptId))

    const compact = mergeGraphs([base, ...related], 'hessian-matrix')
    const complete = mergeGraphs([base, ...related], 'hessian-matrix', {
      maxNodes: Number.POSITIVE_INFINITY,
      maxEdges: Number.POSITIVE_INFINITY,
    })

    expect(compact.nodes.length).toBeLessThanOrEqual(12)
    expect(complete.nodes.length).toBeGreaterThanOrEqual(compact.nodes.length)
    expect(complete.edges.length).toBeGreaterThanOrEqual(compact.edges.length)
  })

  it('finds the deterministic shortest path back to the focus', () => {
    const first = buildEgoGraph('hessian-matrix')
    const firstIds = new Set(first.nodes.map((node) => node.id))
    const directConcepts = first.nodes.filter(
      (
        node,
      ): node is Extract<(typeof first.nodes)[number], { kind: 'concept' }> =>
        node.kind === 'concept' && !node.isFocus,
    )
    const branch = directConcepts
      .map((related) => ({
        related,
        graph: buildEgoGraph(related.conceptId, {
          includePeople: false,
          includeApplications: false,
        }),
      }))
      .find(({ graph }) =>
        graph.nodes.some(
          (node) => node.kind === 'concept' && !firstIds.has(node.id),
        ),
    )
    expect(branch).toBeDefined()
    if (!branch) return

    const graph = mergeGraphs([first, branch.graph], 'hessian-matrix', {
      maxNodes: Number.POSITIVE_INFINITY,
      maxEdges: Number.POSITIVE_INFINITY,
    })
    const secondary = branch.graph.nodes.find(
      (node) =>
        node.kind === 'concept' &&
        !firstIds.has(node.id),
    )
    expect(secondary).toBeDefined()
    if (!secondary) return

    const path = findGraphPath(
      graph,
      secondary.id,
      'concept:hessian-matrix',
    )
    expect(path.nodeIds).toEqual(
      new Set([secondary.id, branch.related.id, 'concept:hessian-matrix']),
    )
    expect(path.edgeIds.size).toBe(2)
  })

  it('wraps Chinese and emoji labels by grapheme, not code unit', () => {
    const label = '雅可比矩阵🧭局部变化'
    const lines = wrapGraphLabel(label, 4, 4)
    expect(lines).toEqual(['雅可比矩', '阵🧭局部', '变化'])
    expect(lines.join('')).toBe(label)
  })

  it('returns a bounded fit camera for deterministic layouts', () => {
    const graph = buildEgoGraph('hessian-matrix', {
      maxRelatedConcepts: 6,
      maxApplications: 2,
    })
    const nodes = layoutNodes(graph.nodes, graph.edges)
    const camera = calculateFitCamera(nodes)
    expect(camera.scale).toBeGreaterThanOrEqual(0.55)
    expect(camera.scale).toBeLessThanOrEqual(1.12)
    expect(Number.isFinite(camera.x)).toBe(true)
    expect(Number.isFinite(camera.y)).toBe(true)
  })
})
