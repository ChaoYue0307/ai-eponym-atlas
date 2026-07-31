import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs'
import LocateFixed from 'lucide-react/dist/esm/icons/locate-fixed.mjs'
import type { RefObject } from 'react'
import type { Locale } from '../copy'
import { peopleById } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import type { PositionedNode } from '../lib/graphLayout'
import { formatLifespan } from '../lib/lifespan'
import type { EgoGraphEdge, EgoGraphNode } from '../types'
import { PersonPortrait } from './PersonPortrait'

type GraphInspectorProps = {
  locale: Locale
  focusId: string
  selectedNode: PositionedNode
  description: string
  edges: readonly EgoGraphEdge[]
  semanticNodeById: ReadonlyMap<string, EgoGraphNode>
  positionById: ReadonlyMap<string, PositionedNode>
  inspectorRef: RefObject<HTMLElement | null>
  onSelectNode: (node: EgoGraphNode) => void
  onRefocusConcept: (conceptId: string) => void
}

const relationTitles = {
  'named-after': { en: 'Named after', zh: '名字来源' },
  'related-to': { en: 'Related concepts', zh: '相关概念' },
  'applied-in': { en: 'Applied in AI', zh: 'AI 应用' },
} as const

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

function getOtherNodeId(edge: EgoGraphEdge, nodeId: string) {
  return edge.source === nodeId ? edge.target : edge.source
}

export function GraphInspector({
  locale,
  focusId,
  selectedNode,
  description,
  edges,
  semanticNodeById,
  positionById,
  inspectorRef,
  onSelectNode,
  onRefocusConcept,
}: GraphInspectorProps) {
  const selectedPerson =
    selectedNode.kind === 'person' ? peopleById.get(selectedNode.personId) : undefined

  return (
    <aside className="graph-inspector" ref={inspectorRef}>
      <header className="graph-inspector__header">
        {selectedPerson ? (
          <PersonPortrait person={selectedPerson} locale={locale} variant="avatar" />
        ) : null}
        <div>
          <p>
            {selectedNode.isFocus
              ? locale === 'zh'
                ? '当前概念'
                : 'Focus concept'
              : selectedNode.kind === 'person'
                ? locale === 'zh'
                  ? '人物'
                  : 'Person'
                : selectedNode.kind === 'application'
                  ? locale === 'zh'
                    ? 'AI 应用'
                    : 'AI application'
                  : locale === 'zh'
                    ? '相关概念'
                    : 'Related concept'}
          </p>
          <h2>
            {selectedNode.label}
            {selectedNode.zhLabel !== selectedNode.label ? (
              <span> / {selectedNode.zhLabel}</span>
            ) : null}
          </h2>
        </div>
        <p>{description}</p>
      </header>

      <div className="graph-inspector__relationships">
        <p className="graph-inspector__count">
          {locale === 'zh'
            ? `${edges.length} 条语义关系`
            : `${edges.length} semantic relationships`}
        </p>
        {(Object.keys(relationTitles) as Array<keyof typeof relationTitles>).map(
          (relation) => {
            const relationshipEdges = edges.filter(
              (edge) => edge.relation === relation,
            )
            if (!relationshipEdges.length) return null
            return (
              <section className="relationship-group" key={relation}>
                <h3>
                  {relationTitles[relation][locale]}{' '}
                  <span>({relationshipEdges.length})</span>
                </h3>
                {relationshipEdges.map((edge) => {
                  const otherId = getOtherNodeId(edge, selectedNode.id)
                  const node =
                    semanticNodeById.get(otherId) ?? positionById.get(otherId)
                  if (!node) return null
                  const isVisible = positionById.has(node.id)
                  const person =
                    node.kind === 'person' ? peopleById.get(node.personId) : undefined
                  const secondary =
                    node.kind === 'concept'
                      ? `${categoryLabels[node.meta.category][locale]} · ${node.meta.functionNickname[locale]}`
                      : node.kind === 'person' && person
                        ? `${formatLifespan(person, locale)} · ${person.region}`
                        : locale === 'zh'
                          ? edge.zhNote ?? edge.zhLabel
                          : edge.note ?? edge.label
                  return (
                    <button
                      key={edge.id}
                      type="button"
                      onClick={() => {
                        if (isVisible) {
                          onSelectNode(node)
                        } else if (node.kind === 'concept') {
                          onRefocusConcept(node.conceptId)
                        }
                      }}
                    >
                      {person ? (
                        <PersonPortrait person={person} locale={locale} variant="avatar" />
                      ) : (
                        <span
                          className={`relationship-item__shape relationship-item__shape--${node.kind}`}
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        <strong>{locale === 'zh' ? node.zhLabel : node.label}</strong>
                        <small>{secondary}</small>
                      </span>
                      {!isVisible ? (
                        <small className="relationship-item__availability">
                          {locale === 'zh' ? '在完整图谱中' : 'Full graph'}
                        </small>
                      ) : null}
                      <ChevronRight aria-hidden="true" />
                    </button>
                  )
                })}
              </section>
            )
          },
        )}
      </div>

      <footer className="graph-inspector__actions">
        {selectedNode.kind === 'concept' && !selectedNode.isFocus ? (
          <button
            className="button button--primary"
            type="button"
            onClick={() => onRefocusConcept(selectedNode.conceptId)}
          >
            <LocateFixed aria-hidden="true" />
            {locale === 'zh' ? '以此概念为中心' : 'Refocus graph'}
          </button>
        ) : null}
        <button
          className="button button--secondary"
          type="button"
          onClick={() => {
            if (selectedNode.kind === 'person') {
              navigate(`/person/${selectedNode.personId}`)
            } else {
              const conceptId =
                selectedNode.kind === 'concept' ? selectedNode.conceptId : focusId
              navigate(`/concept/${conceptId}`)
            }
          }}
        >
          <ExternalLink aria-hidden="true" />
          {selectedNode.kind === 'person'
            ? locale === 'zh'
              ? '查看人物条目'
              : 'Open biography'
            : locale === 'zh'
              ? '查看完整概念条目'
              : 'Open full entry'}
        </button>
      </footer>
    </aside>
  )
}
