import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.mjs'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs'
import Filter from 'lucide-react/dist/esm/icons/list-filter.mjs'
import ListTree from 'lucide-react/dist/esm/icons/list-tree.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import { concepts, conceptsById, peopleById } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { buildEgoGraph } from '../lib/graph'
import {
  GRAPH_VIEWBOX,
  layoutNodes,
  mergeGraphs,
  type PositionedNode,
} from '../lib/graphLayout'
import {
  calculateFitCamera,
  clampGraphScale,
  DEFAULT_GRAPH_CAMERA,
  findGraphPath,
  type GraphCamera,
} from '../lib/graphViewport'
import type { EgoGraph, EgoGraphNode } from '../types'
import { GraphCanvas } from './GraphCanvas'
import { GraphInspector } from './GraphInspector'
import { SectionRule } from './SectionRule'
import './GraphExplorer.css'

type GraphExplorerProps = {
  locale: Locale
  params: URLSearchParams
}

function countByKind(graph: EgoGraph, kind: EgoGraphNode['kind']) {
  return graph.nodes.filter((node) => node.kind === kind).length
}

function initialCameraForViewport(
  nodes: readonly PositionedNode[],
  viewportWidth: number | undefined,
) {
  if (!viewportWidth || viewportWidth > 620) return calculateFitCamera(nodes)
  const focus = nodes.find((node) => node.isFocus)
  if (!focus) return calculateFitCamera(nodes)

  // A fitted 960-unit SVG makes labels illegibly small on a phone. Start with
  // the focus at a readable scale; the Fit control remains the one-tap
  // overview, and drag/zoom preserve access to the complete visual graph.
  const scale = 2.5
  return {
    scale,
    x: GRAPH_VIEWBOX.width / 2 - focus.x * scale,
    y: GRAPH_VIEWBOX.height / 2 - focus.y * scale,
  }
}

export function GraphExplorer({ locale, params }: GraphExplorerProps) {
  const t = copy[locale].graph
  const paramsKey = params.toString()
  const initialFocus = params.get('focus')
  const initialFocusId =
    initialFocus && conceptsById.has(initialFocus) ? initialFocus : 'hessian-matrix'
  const [focusId, setFocusId] = useState(initialFocusId)
  const [depth, setDepth] = useState(params.get('depth') === '2' ? 2 : 1)
  const [includePeople, setIncludePeople] = useState(params.get('people') !== '0')
  const [includeConcepts, setIncludeConcepts] = useState(
    params.get('concepts') !== '0',
  )
  const [includeApplications, setIncludeApplications] = useState(
    params.get('applications') !== '0',
  )
  const [selectedNodeId, setSelectedNodeId] = useState(
    params.get('selected') ?? `concept:${initialFocusId}`,
  )
  const [camera, setCamera] = useState<GraphCamera>(DEFAULT_GRAPH_CAMERA)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [copied, setCopied] = useState(false)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inspectorRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null)

  const { semanticGraph, visualGraph } = useMemo(() => {
    const sharedOptions = {
      includePeople,
      includeRelatedConcepts: includeConcepts,
      includeApplications,
    }
    const fullBase = buildEgoGraph(focusId, sharedOptions)
    const compactBase = buildEgoGraph(focusId, {
      ...sharedOptions,
      maxRelatedConcepts: 6,
      maxApplications: 2,
    })
    if (depth === 1 || !includeConcepts) {
      return { semanticGraph: fullBase, visualGraph: compactBase }
    }

    const compactNeighbors = compactBase.nodes.filter(
      (
        node,
      ): node is Extract<EgoGraphNode, { kind: 'concept' }> =>
        node.kind === 'concept' && !node.isFocus,
    )
    const compactSecondary = compactNeighbors.map((node) =>
      buildEgoGraph(node.conceptId, {
        includePeople: false,
        includeApplications: false,
        includeRelatedConcepts: true,
        maxRelatedConcepts: 2,
      }),
    )
    const completeSecondary = compactNeighbors.map((node) =>
      buildEgoGraph(node.conceptId, {
        includePeople: false,
        includeApplications: false,
        includeRelatedConcepts: true,
      }),
    )

    return {
      semanticGraph: mergeGraphs([fullBase, ...completeSecondary], focusId, {
        maxNodes: Number.POSITIVE_INFINITY,
        maxEdges: Number.POSITIVE_INFINITY,
      }),
      visualGraph: mergeGraphs([compactBase, ...compactSecondary], focusId),
    }
  }, [depth, focusId, includeApplications, includeConcepts, includePeople])

  const positionedNodes = useMemo(
    () => layoutNodes(visualGraph.nodes, visualGraph.edges),
    [visualGraph],
  )
  const positionById = useMemo(
    () => new Map(positionedNodes.map((node) => [node.id, node])),
    [positionedNodes],
  )
  const semanticNodeById = useMemo(
    () => new Map(semanticGraph.nodes.map((node) => [node.id, node])),
    [semanticGraph.nodes],
  )
  const focusNodeId = `concept:${focusId}`

  useEffect(() => {
    const nextFocus = params.get('focus')
    const nextFocusId =
      nextFocus && conceptsById.has(nextFocus) ? nextFocus : 'hessian-matrix'
    setFocusId(nextFocusId)
    setDepth(params.get('depth') === '2' ? 2 : 1)
    setIncludePeople(params.get('people') !== '0')
    setIncludeConcepts(params.get('concepts') !== '0')
    setIncludeApplications(params.get('applications') !== '0')
    setSelectedNodeId(params.get('selected') ?? `concept:${nextFocusId}`)
  }, [paramsKey])

  useEffect(() => {
    if (positionById.has(selectedNodeId)) return
    setSelectedNodeId(focusNodeId)
  }, [focusNodeId, positionById, selectedNodeId])

  useEffect(() => {
    setCamera(
      initialCameraForViewport(
        positionedNodes,
        viewportRef.current?.clientWidth,
      ),
    )
  }, [positionedNodes])

  useEffect(() => {
    const next = new URLSearchParams({ focus: focusId })
    if (depth !== 1) next.set('depth', String(depth))
    if (!includePeople) next.set('people', '0')
    if (!includeConcepts) next.set('concepts', '0')
    if (!includeApplications) next.set('applications', '0')
    if (selectedNodeId !== focusNodeId && positionById.has(selectedNodeId)) {
      next.set('selected', selectedNodeId)
    }
    navigate('/graph', next, true)
  }, [
    depth,
    focusId,
    focusNodeId,
    includeApplications,
    includeConcepts,
    includePeople,
    positionById,
    selectedNodeId,
  ])

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

  const refocusConcept = useCallback((conceptId: string) => {
    setFocusId(conceptId)
    setSelectedNodeId(`concept:${conceptId}`)
    setSearchQuery('')
    setActiveSuggestionIndex(-1)
  }, [])

  const selectNode = useCallback((node: EgoGraphNode) => {
    setSelectedNodeId(node.id)
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      window.prompt(locale === 'zh' ? '复制链接：' : 'Copy link:', window.location.href)
    }
  }

  const fitGraph = useCallback(() => {
    setCamera(calculateFitCamera(positionedNodes))
  }, [positionedNodes])

  const zoomAt = useCallback((x: number, y: number, nextScale: number) => {
    setCamera((current) => {
      const scale = clampGraphScale(nextScale)
      const worldX = (x - current.x) / current.scale
      const worldY = (y - current.y) / current.scale
      return {
        scale,
        x: x - worldX * scale,
        y: y - worldY * scale,
      }
    })
  }, [])

  const zoomBy = useCallback(
    (delta: number) => {
      zoomAt(
        GRAPH_VIEWBOX.width / 2,
        GRAPH_VIEWBOX.height / 2,
        camera.scale + delta,
      )
    },
    [camera.scale, zoomAt],
  )

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * GRAPH_VIEWBOX.width
    const y = ((event.clientY - bounds.top) / bounds.height) * GRAPH_VIEWBOX.height
    zoomAt(x, y, camera.scale * (event.deltaY < 0 ? 1.1 : 0.9))
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const deltaX =
      (event.clientX - drag.x) * (GRAPH_VIEWBOX.width / bounds.width)
    const deltaY =
      (event.clientY - drag.y) * (GRAPH_VIEWBOX.height / bounds.height)
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY }
    setCamera((current) => ({
      ...current,
      x: current.x + deltaX,
      y: current.y + deltaY,
    }))
  }

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
  }

  const handleCanvasKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const panStep = 26
    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      zoomBy(0.1)
    } else if (event.key === '-') {
      event.preventDefault()
      zoomBy(-0.1)
    } else if (event.key === '0') {
      event.preventDefault()
      setCamera(DEFAULT_GRAPH_CAMERA)
    } else if (event.key.toLocaleLowerCase() === 'f') {
      event.preventDefault()
      fitGraph()
    } else if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      setCamera((current) => ({
        ...current,
        x:
          current.x +
          (event.key === 'ArrowLeft'
            ? panStep
            : event.key === 'ArrowRight'
              ? -panStep
              : 0),
        y:
          current.y +
          (event.key === 'ArrowUp'
            ? panStep
            : event.key === 'ArrowDown'
              ? -panStep
              : 0),
      }))
    }
  }

  const focusedConcept = conceptsById.get(focusId)!
  const selectedNode =
    positionById.get(selectedNodeId) ?? positionById.get(focusNodeId)!
  const selectedPath = useMemo(
    () => findGraphPath(visualGraph, selectedNode.id, focusNodeId),
    [focusNodeId, selectedNode.id, visualGraph],
  )
  const inspectorEdges = useMemo(
    () =>
      semanticGraph.edges.filter(
        (edge) =>
          edge.source === selectedNode.id || edge.target === selectedNode.id,
      ),
    [selectedNode.id, semanticGraph.edges],
  )
  const selectedConcept =
    selectedNode.kind === 'concept'
      ? conceptsById.get(selectedNode.conceptId)
      : undefined
  const selectedPerson =
    selectedNode.kind === 'person'
      ? peopleById.get(selectedNode.personId)
      : undefined
  const selectedDescription =
    selectedConcept?.question[locale] ??
    selectedPerson?.summary[locale] ??
    (locale === 'zh'
      ? `这个 AI 应用通过 ${focusedConcept.zhTerm} 与当前图谱相连。`
      : `This AI application is connected to the graph through ${focusedConcept.term}.`)
  const visibleEdgeCount = visualGraph.edges.length
  const availableEdgeCount = semanticGraph.edges.length

  return (
    <main className="graph-page graph-v2">
      <header className="page-intro page-intro--graph">
        <p className="section-number">02 — GRAPH</p>
        <h1>{t.title}</h1>
        <SectionRule />
        <p>{t.description}</p>
      </header>

      <div className="graph-workspace">
        <aside
          className="graph-controls"
          aria-label={locale === 'zh' ? '图谱控制' : 'Graph controls'}
        >
          <div className="graph-search">
            <label className="search-field">
              <Search aria-hidden="true" />
              <span className="sr-only">{t.focus}</span>
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setActiveSuggestionIndex(event.target.value.trim() ? 0 : -1)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setSearchQuery('')
                    setActiveSuggestionIndex(-1)
                  } else if (event.key === 'ArrowDown' && suggestions.length) {
                    event.preventDefault()
                    setActiveSuggestionIndex((index) =>
                      index < suggestions.length - 1 ? index + 1 : 0,
                    )
                  } else if (event.key === 'ArrowUp' && suggestions.length) {
                    event.preventDefault()
                    setActiveSuggestionIndex((index) =>
                      index > 0 ? index - 1 : suggestions.length - 1,
                    )
                  } else if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
                    const suggestion = suggestions[activeSuggestionIndex]
                    if (suggestion) {
                      event.preventDefault()
                      refocusConcept(suggestion.id)
                    }
                  }
                }}
                placeholder={t.focus}
                role="combobox"
                aria-autocomplete="list"
                aria-controls="graph-search-results"
                aria-expanded={suggestions.length > 0}
                aria-activedescendant={
                  activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]
                    ? `graph-search-option-${suggestions[activeSuggestionIndex]?.id}`
                    : undefined
                }
              />
            </label>
            {suggestions.length ? (
              <div
                className="graph-search__suggestions"
                id="graph-search-results"
                role="listbox"
              >
                {suggestions.map((concept, index) => (
                  <button
                    type="button"
                    role="option"
                    id={`graph-search-option-${concept.id}`}
                    aria-selected={index === activeSuggestionIndex}
                    key={concept.id}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                    onClick={() => refocusConcept(concept.id)}
                  >
                    <span>{concept.term}</span>
                    <small>{concept.zhTerm}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            className="graph-filter-trigger"
            type="button"
            aria-expanded={filtersExpanded}
            aria-controls="graph-filter-body"
            onClick={() => setFiltersExpanded((value) => !value)}
          >
            <Filter aria-hidden="true" />
            <span>
              {locale === 'zh' ? '筛选' : 'Filters'}
              <small>
                {depth} {locale === 'zh' ? '跳' : depth === 1 ? 'hop' : 'hops'} ·{' '}
                {[includePeople, includeConcepts, includeApplications].filter(
                  Boolean,
                ).length}{' '}
                {locale === 'zh' ? '类' : 'types'}
              </small>
            </span>
            <i aria-hidden="true" />
            <ChevronDown aria-hidden="true" />
          </button>

          <div
            className={`graph-controls__body${filtersExpanded ? ' is-expanded' : ''}`}
            id="graph-filter-body"
          >
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
                  shape: 'person',
                },
                {
                  key: 'concepts',
                  label: t.concepts,
                  value: includeConcepts,
                  set: setIncludeConcepts,
                  shape: 'concept',
                },
                {
                  key: 'applications',
                  label: t.applications,
                  value: includeApplications,
                  set: setIncludeApplications,
                  shape: 'application',
                },
              ].map((item) => (
                <label className="graph-toggle" key={item.key}>
                  <span
                    className={`graph-toggle__shape graph-toggle__shape--${item.shape}`}
                    aria-hidden="true"
                  />
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
              className="button button--secondary graph-list-button"
              type="button"
              onClick={() =>
                inspectorRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <ListTree aria-hidden="true" />
              {t.list}
              <ChevronRight aria-hidden="true" />
            </button>

            <section
              className="graph-stats"
              aria-label={locale === 'zh' ? '图谱摘要' : 'Graph summary'}
            >
              <h2>{locale === 'zh' ? '图谱摘要' : 'Graph summary'}</h2>
              {[
                {
                  label:
                    locale === 'zh' ? '人物（命名）' : 'People (named after)',
                  value: countByKind(visualGraph, 'person'),
                  total: countByKind(semanticGraph, 'person'),
                },
                {
                  label: locale === 'zh' ? '相关概念' : 'Concepts (related)',
                  value: Math.max(0, countByKind(visualGraph, 'concept') - 1),
                  total: Math.max(0, countByKind(semanticGraph, 'concept') - 1),
                },
                {
                  label: locale === 'zh' ? 'AI 应用' : 'AI applications',
                  value: countByKind(visualGraph, 'application'),
                  total: countByKind(semanticGraph, 'application'),
                },
                {
                  label: locale === 'zh' ? '关系' : 'Relationships',
                  value: visibleEdgeCount,
                  total: availableEdgeCount,
                },
              ].map((stat) => (
                <p key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>
                    {stat.value}
                    {stat.total !== stat.value ? (
                      <small> / {stat.total}</small>
                    ) : null}
                  </strong>
                </p>
              ))}
            </section>
          </div>
        </aside>

        <GraphCanvas
          locale={locale}
          depth={depth}
          focusedConcept={focusedConcept}
          graph={visualGraph}
          positionedNodes={positionedNodes}
          positionById={positionById}
          selectedNode={selectedNode}
          selectedPath={selectedPath}
          camera={camera}
          copied={copied}
          isDragging={isDragging}
          availableNodeCount={semanticGraph.nodes.length}
          viewportRef={viewportRef}
          onReset={() =>
            setCamera(
              initialCameraForViewport(
                positionedNodes,
                viewportRef.current?.clientWidth,
              ),
            )
          }
          onFit={fitGraph}
          onZoomBy={zoomBy}
          onCopy={copyLink}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerEnd={endPointerDrag}
          onKeyDown={handleCanvasKeyDown}
          onSelectNode={selectNode}
          onRefocusConcept={refocusConcept}
        />

        <GraphInspector
          locale={locale}
          focusId={focusId}
          selectedNode={selectedNode}
          description={selectedDescription}
          edges={inspectorEdges}
          semanticNodeById={semanticNodeById}
          positionById={positionById}
          inspectorRef={inspectorRef}
          onSelectNode={selectNode}
          onRefocusConcept={refocusConcept}
        />
      </div>
    </main>
  )
}
