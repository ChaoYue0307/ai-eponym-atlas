import Check from 'lucide-react/dist/esm/icons/check.mjs'
import Clipboard from 'lucide-react/dist/esm/icons/clipboard.mjs'
import Info from 'lucide-react/dist/esm/icons/info.mjs'
import LocateFixed from 'lucide-react/dist/esm/icons/locate-fixed.mjs'
import Minus from 'lucide-react/dist/esm/icons/minus.mjs'
import Plus from 'lucide-react/dist/esm/icons/plus.mjs'
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw.mjs'
import { useMemo } from 'react'
import type { KeyboardEvent, PointerEvent, RefObject, WheelEvent } from 'react'
import type { Locale } from '../copy'
import { peopleById } from '../data/catalog'
import {
  GRAPH_VIEWBOX,
  routeGraphEdge,
  wrapGraphLabel,
  type PositionedNode,
} from '../lib/graphLayout'
import {
  DEFAULT_GRAPH_CAMERA,
  GRAPH_CAMERA_MAX,
  GRAPH_CAMERA_MIN,
  type GraphCamera,
} from '../lib/graphViewport'
import type { Concept, EgoGraph, EgoGraphNode } from '../types'

type Point = {
  x: number
  y: number
}

type GraphCanvasProps = {
  locale: Locale
  depth: number
  focusedConcept: Concept
  graph: EgoGraph
  positionedNodes: readonly PositionedNode[]
  positionById: ReadonlyMap<string, PositionedNode>
  selectedNode: PositionedNode
  selectedPath: {
    nodeIds: ReadonlySet<string>
    edgeIds: ReadonlySet<string>
  }
  camera: GraphCamera
  copied: boolean
  isDragging: boolean
  availableNodeCount: number
  viewportRef: RefObject<HTMLDivElement | null>
  onReset: () => void
  onFit: () => void
  onZoomBy: (delta: number) => void
  onCopy: () => void
  onWheel: (event: WheelEvent<HTMLDivElement>) => void
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void
  onPointerEnd: (event: PointerEvent<HTMLDivElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  onSelectNode: (node: EgoGraphNode) => void
  onRefocusConcept: (conceptId: string) => void
}

const categoryLabels = {
  algebra: { en: 'Algebra', zh: '代数' },
  calculus: { en: 'Calculus', zh: '微积分' },
  computation: { en: 'Computation', zh: '计算' },
  dynamics: { en: 'Dynamics', zh: '动力系统' },
  geometry: { en: 'Geometry', zh: '几何' },
  information: { en: 'Information', zh: '信息论' },
  optimization: { en: 'Optimization', zh: '优化' },
  probability: { en: 'Probability', zh: '概率' },
  statistics: { en: 'Statistics', zh: '统计' },
} as const

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
      x: node.x + direction.x * 54,
      y: node.y + direction.y * 54,
    }
  }
  const vertices =
    node.kind === 'application'
      ? [
          { x: -80, y: 0 },
          { x: -53, y: -54 },
          { x: 53, y: -54 },
          { x: 80, y: 0 },
          { x: 53, y: 54 },
          { x: -53, y: 54 },
        ]
      : node.isFocus
        ? [
            { x: -94, y: -60 },
            { x: 94, y: -60 },
            { x: 94, y: 60 },
            { x: -94, y: 60 },
          ]
        : [
            { x: -76, y: -48 },
            { x: 76, y: -48 },
            { x: 76, y: 48 },
            { x: -76, y: 48 },
          ]
  const distance = polygonBoundaryDistance(direction, vertices)
  return {
    x: node.x + direction.x * distance,
    y: node.y + direction.y * distance,
  }
}

function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function portraitAlignment(position?: string) {
  if (!position) return 'xMidYMid slice'
  const [first = 'center', second = 'center'] = position.trim().split(/\s+/)
  const horizontalToken = /^(?:left|right|center|\d+(?:\.\d+)?%)$/.test(first)
    ? first
    : 'center'
  const verticalToken = second
  const alignment = (
    token: string,
    start: string,
    middle: string,
    end: string,
  ) => {
    if (token === 'left' || token === 'top') return start
    if (token === 'right' || token === 'bottom') return end
    const percentage = token.match(/^(\d+(?:\.\d+)?)%$/)?.[1]
    if (percentage) {
      const value = Number(percentage)
      if (value <= 34) return start
      if (value >= 66) return end
    }
    return middle
  }
  const horizontal = alignment(horizontalToken, 'xMin', 'xMid', 'xMax')
  const vertical = alignment(verticalToken, 'YMin', 'YMid', 'YMax')
  return `${horizontal}${vertical} slice`
}

export function GraphCanvas({
  locale,
  depth,
  focusedConcept,
  graph,
  positionedNodes,
  positionById,
  selectedNode,
  selectedPath,
  camera,
  copied,
  isDragging,
  availableNodeCount,
  viewportRef,
  onReset,
  onFit,
  onZoomBy,
  onCopy,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
  onKeyDown,
  onSelectNode,
  onRefocusConcept,
}: GraphCanvasProps) {
  const focusNodeId = `concept:${focusedConcept.id}`
  const hasActivePath = selectedNode.id !== focusNodeId
  const visibleNodeCount = graph.nodes.length
  const hiddenNodeCount = Math.max(0, availableNodeCount - visibleNodeCount)
  const edgeRoutes = useMemo(
    () =>
      new Map(
        graph.edges.flatMap((edge) => {
          const source = positionById.get(edge.source)
          const target = positionById.get(edge.target)
          return source && target
            ? [[edge.id, routeGraphEdge(source, target, positionedNodes)] as const]
            : []
        }),
      ),
    [graph.edges, positionById, positionedNodes],
  )

  return (
    <section
      className="graph-canvas"
      aria-label={locale === 'zh' ? '关系图画布' : 'Relationship graph canvas'}
    >
      <header className="graph-canvas__chrome">
        <ul
          className="graph-canvas__legend"
          aria-label={locale === 'zh' ? '关系类型图例' : 'Relationship legend'}
        >
          <li>
            <span
              className="graph-legend-line graph-legend-line--named-after"
              aria-hidden="true"
            />
            {locale === 'zh' ? '名字来源' : 'Named after'}
          </li>
          <li>
            <span
              className="graph-legend-line graph-legend-line--related-to"
              aria-hidden="true"
            />
            {locale === 'zh' ? '相关概念' : 'Related'}
          </li>
          <li>
            <span
              className="graph-legend-line graph-legend-line--applied-in"
              aria-hidden="true"
            />
            {locale === 'zh' ? 'AI 应用' : 'AI use'}
          </li>
        </ul>

        <div className="graph-canvas__tools">
          <button type="button" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            <span>{locale === 'zh' ? '重置' : 'Reset'}</span>
          </button>
          <button
            type="button"
            onClick={onFit}
            aria-label={locale === 'zh' ? '适应画布' : 'Fit graph to canvas'}
          >
            <LocateFixed aria-hidden="true" />
            <span>{locale === 'zh' ? '适应' : 'Fit'}</span>
          </button>
          <div>
            <button
              type="button"
              onClick={() => onZoomBy(-0.1)}
              aria-label={locale === 'zh' ? '缩小' : 'Zoom out'}
              disabled={camera.scale <= GRAPH_CAMERA_MIN}
            >
              <Minus aria-hidden="true" />
            </button>
            <span>{Math.round(camera.scale * 100)}%</span>
            <button
              type="button"
              onClick={() => onZoomBy(0.1)}
              aria-label={locale === 'zh' ? '放大' : 'Zoom in'}
              disabled={camera.scale >= GRAPH_CAMERA_MAX}
            >
              <Plus aria-hidden="true" />
            </button>
          </div>
          <button type="button" onClick={onCopy} aria-live="polite">
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
      </header>

      <div
        className={`graph-canvas__viewport${isDragging ? ' is-dragging' : ''}`}
        ref={viewportRef}
        tabIndex={0}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
        aria-label={
          locale === 'zh'
            ? '可交互关系图。拖动平移，滚轮或加减键缩放，方向键平移，F 键适应画布。'
            : 'Interactive relationship graph. Drag to pan, scroll or use plus and minus to zoom, use arrow keys to pan, and F to fit.'
        }
      >
        <svg
          viewBox={`0 0 ${GRAPH_VIEWBOX.width} ${GRAPH_VIEWBOX.height}`}
          role="group"
          aria-labelledby="ego-graph-title"
          aria-describedby="ego-graph-description"
        >
          <title id="ego-graph-title">
            {locale === 'zh'
              ? `${focusedConcept.zhTerm}的${depth}跳概念关系图，包含 ${visibleNodeCount} 个相关节点`
              : `${focusedConcept.term} ${depth === 1 ? 'one-hop' : 'two-hop'} graph with ${visibleNodeCount} related nodes`}
          </title>
          <desc id="ego-graph-description">
            {locale === 'zh'
              ? '矩形表示概念，圆形表示人物，六边形表示 AI 应用。选择节点会突出它通向当前概念的最短路径，并在关系面板中显示说明。'
              : 'Rectangles are concepts, circles are people, and hexagons are AI applications. Selecting a node highlights its shortest path to the selected concept and explains it in the relationship panel.'}
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
            {positionedNodes.flatMap((node) =>
              node.kind === 'person'
                ? [
                    <clipPath id={`graph-portrait-${node.personId}`} key={node.id}>
                      <circle cx="0" cy="0" r="47" />
                    </clipPath>,
                  ]
                : [],
            )}
          </defs>
          <g
            className="graph-camera"
            transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}
          >
            <g className="graph-edges" aria-hidden="true">
              {graph.edges.map((edge) => {
                const source = positionById.get(edge.source)
                const target = positionById.get(edge.target)
                if (!source || !target) return null
                const route = edgeRoutes.get(edge.id) ?? [source, target]
                const firstWaypoint = route[1] ?? target
                const lastWaypoint = route.at(-2) ?? source
                const start = nodeBoundaryPoint(source, {
                  ...target,
                  ...firstWaypoint,
                })
                const end = nodeBoundaryPoint(target, {
                  ...source,
                  ...lastWaypoint,
                })
                const pathPoints = [start, ...route.slice(1, -1), end]
                const longestSegment = pathPoints.slice(1).reduce(
                  (best, point, index) => {
                    const previous = pathPoints[index]!
                    const length = Math.hypot(
                      point.x - previous.x,
                      point.y - previous.y,
                    )
                    return length > best.length
                      ? { start: previous, end: point, length }
                      : best
                  },
                  { start, end, length: 0 },
                )
                const isHighlighted =
                  hasActivePath && selectedPath.edgeIds.has(edge.id)
                const isMuted = hasActivePath && !isHighlighted
                const label =
                  edge.relation === 'named-after'
                    ? locale === 'zh'
                      ? '名字来源'
                      : 'named after'
                    : edge.relation === 'applied-in'
                      ? locale === 'zh'
                        ? '应用于'
                        : 'applied in'
                      : locale === 'zh'
                        ? '相关'
                        : 'related'
                return (
                  <g
                    key={edge.id}
                    className={`graph-edge-group${isHighlighted ? ' is-highlighted' : ''}${isMuted ? ' is-muted' : ''}`}
                  >
                    <path
                      className={`graph-edge graph-edge--${edge.relation}`}
                      d={pathPoints
                        .map(
                          (point, index) =>
                            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
                        )
                        .join(' ')}
                      markerEnd={
                        edge.directed
                          ? `url(#graph-arrow-${edge.relation})`
                          : undefined
                      }
                    />
                    {edge.relation !== 'related-to' || isHighlighted ? (
                      <text
                        x={(longestSegment.start.x + longestSegment.end.x) / 2}
                        y={(longestSegment.start.y + longestSegment.end.y) / 2 - 7}
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    ) : null}
                  </g>
                )
              })}
            </g>
            <g className="graph-nodes">
              {positionedNodes.map((node) => {
                const label = locale === 'zh' ? node.zhLabel : node.label
                const maxGraphemes =
                  locale === 'zh'
                    ? node.kind === 'application'
                      ? 8
                      : node.isFocus
                        ? 11
                        : 9
                    : node.kind === 'application'
                      ? 16
                      : node.isFocus
                        ? 22
                        : 18
                const maxLines =
                  node.kind === 'application' || node.isFocus ? 3 : 2
                const lines = wrapGraphLabel(label, maxGraphemes, maxLines)
                const person =
                  node.kind === 'person' ? peopleById.get(node.personId) : undefined
                const isSelected = selectedNode.id === node.id
                const isMuted = hasActivePath && !selectedPath.nodeIds.has(node.id)
                const category =
                  node.kind === 'concept'
                    ? categoryLabels[node.meta.category][locale]
                    : undefined
                const personLines = wrapGraphLabel(
                  label,
                  locale === 'zh' ? 10 : 18,
                  2,
                )
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x} ${node.y})`}
                    className={`graph-node graph-node--${node.kind}${
                      node.isFocus ? ' graph-node--focus' : ''
                    }${isSelected ? ' is-selected' : ''}${isMuted ? ' is-muted' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => onSelectNode(node)}
                    onDoubleClick={
                      node.kind === 'concept'
                        ? () => onRefocusConcept(node.conceptId)
                        : undefined
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onSelectNode(node)
                      }
                    }}
                    aria-label={
                      locale === 'zh'
                        ? `${label}，${node.kind === 'person' ? '人物' : node.kind === 'concept' ? '概念' : 'AI 应用'}${isSelected ? '，已选择' : ''}`
                        : `${label}, ${node.kind}${isSelected ? ', selected' : ''}`
                    }
                  >
                    {node.kind === 'person' ? (
                      <>
                        <circle className="graph-node__person-frame" r="54" />
                        <circle className="graph-node__person-fallback" r="47" />
                        <text className="graph-node__initials" y="5">
                          {person?.portraitInitials ?? label.slice(0, 2)}
                        </text>
                        {person?.portrait ? (
                          <image
                            href={publicAsset(person.portrait.file)}
                            x={-47 * (person.portrait.cropScale ?? 1)}
                            y={-47 * (person.portrait.cropScale ?? 1)}
                            width={94 * (person.portrait.cropScale ?? 1)}
                            height={94 * (person.portrait.cropScale ?? 1)}
                            preserveAspectRatio={portraitAlignment(
                              person.portrait.objectPosition,
                            )}
                            clipPath={`url(#graph-portrait-${node.personId})`}
                            aria-hidden="true"
                          />
                        ) : null}
                        <text className="graph-node__person-name" y="76">
                          {personLines.map((line, index) => (
                            <tspan
                              key={`${line}-${index}`}
                              x="0"
                              dy={index === 0 ? 0 : 15}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </>
                    ) : node.kind === 'application' ? (
                      <>
                        <polygon points="-80,0 -53,-54 53,-54 80,0 53,54 -53,54" />
                        <text
                          className="graph-node__label"
                          y={5 - ((lines.length - 1) * 17) / 2}
                        >
                          {lines.map((line, index) => (
                            <tspan
                              key={`${line}-${index}`}
                              x="0"
                              dy={index === 0 ? 0 : 17}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </>
                    ) : (
                      <>
                        <rect
                          x={node.isFocus ? -94 : -76}
                          y={node.isFocus ? -60 : -48}
                          width={node.isFocus ? 188 : 152}
                          height={node.isFocus ? 120 : 96}
                          rx={node.isFocus ? 7 : 5}
                        />
                        <text
                          className="graph-node__label"
                          y={
                            (node.isFocus ? -8 : -7) -
                            ((lines.length - 1) * (node.isFocus ? 20 : 17)) / 2
                          }
                        >
                          {lines.map((line, index) => (
                            <tspan
                              key={`${line}-${index}`}
                              x="0"
                              dy={index === 0 ? 0 : node.isFocus ? 20 : 17}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                        <text
                          className="graph-node__meta"
                          y={node.isFocus ? 44 : 31}
                        >
                          {category}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}
            </g>
          </g>
        </svg>
      </div>

      <footer className="graph-canvas__footer">
        <p className="graph-canvas__count" aria-live="polite">
          <strong>
            {locale === 'zh'
              ? `显示 ${visibleNodeCount} 个相关节点`
              : `${visibleNodeCount} related nodes shown`}
          </strong>
          {hiddenNodeCount > 0 ? (
            <span>
              {locale === 'zh'
                ? `可在关系列表中继续查看另外 ${hiddenNodeCount} 个相关节点。`
                : `Explore ${hiddenNodeCount} more related nodes in the list.`}
            </span>
          ) : (
            <span>
              {locale === 'zh'
                ? '相关节点已全部显示。'
                : 'All related nodes are shown.'}
            </span>
          )}
        </p>

        <p className="graph-canvas__instruction">
          <Info aria-hidden="true" />
          <span>
            {locale === 'zh'
              ? '选择节点以突出路径；双击概念可重新聚焦。'
              : 'Select a node to trace its path; double-click a concept to refocus.'}
          </span>
          <kbd>F</kbd>
          <span>{locale === 'zh' ? '适应画布' : 'Fit'}</span>
          <kbd>＋/－</kbd>
          <span>{locale === 'zh' ? '缩放' : 'Zoom'}</span>
        </p>
      </footer>
    </section>
  )
}

export { DEFAULT_GRAPH_CAMERA }
