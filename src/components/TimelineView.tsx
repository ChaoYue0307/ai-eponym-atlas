import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import { useMemo, useState } from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import { conceptsById, peopleById } from '../data/catalog'
import { timelineEvents } from '../data/timeline'
import { navigate } from '../hooks/useHashRoute'
import type { TimelineEventKind } from '../types'
import { SectionRule } from './SectionRule'

type TimelineFilter = 'all' | TimelineEventKind

const kindLabels: Record<TimelineEventKind, { en: string; zh: string }> = {
  person: { en: 'People', zh: '人物' },
  publication: { en: 'Publication', zh: '发表' },
  naming: { en: 'Naming', zh: '命名' },
  'ai-adoption': { en: 'AI adoption', zh: 'AI 采用' },
}

export function TimelineView({ locale }: { locale: Locale }) {
  const t = copy[locale].timeline
  const [filter, setFilter] = useState<TimelineFilter>('all')
  const visibleEvents = useMemo(
    () => timelineEvents.filter((event) => filter === 'all' || event.kind === filter),
    [filter],
  )

  return (
    <main className="timeline-page">
      <header className="page-intro timeline-page__intro">
        <p className="section-number">03 — TIME</p>
        <h1>{t.title}</h1>
        <SectionRule />
        <p>{t.description}</p>
      </header>

      <nav className="timeline-filters" aria-label="Timeline filters">
        {([
          ['all', t.all],
          ['person', t.person],
          ['publication', t.publication],
          ['naming', t.naming],
          ['ai-adoption', t.ai],
        ] as const).map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={filter === value ? 'is-active' : ''}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="timeline-layout">
        <aside className="timeline-legend">
          <p className="section-number">READING THE LINE</p>
          <h2>{locale === 'zh' ? '四种时间，不是一条神话' : 'Four times, not one myth'}</h2>
          <p>
            {locale === 'zh'
              ? '一个术语可以在人物工作很久之后才形成名字，并在数十年后进入 AI。时间线把这些事件分开。'
              : 'A term may acquire its name long after the underlying work, then enter AI decades later. The timeline keeps those events separate.'}
          </p>
          <ul>
            {(Object.keys(kindLabels) as TimelineEventKind[]).map((kind) => (
              <li key={kind}>
                <span className={`timeline-dot timeline-dot--${kind}`} aria-hidden="true" />
                {kindLabels[kind][locale]}
              </li>
            ))}
          </ul>
        </aside>

        <ol className="timeline-list">
          {visibleEvents.map((event) => {
            const eventPeople = event.personIds
              .map((id) => peopleById.get(id))
              .filter((person) => person !== undefined)
            const eventConcepts = event.conceptIds
              .map((id) => conceptsById.get(id))
              .filter((concept) => concept !== undefined)
            return (
              <li className={`timeline-event timeline-event--${event.kind}`} key={event.id}>
                <div className="timeline-event__year">
                  <span className={`timeline-dot timeline-dot--${event.kind}`} aria-hidden="true" />
                  <time>{event.year}</time>
                </div>
                <div className="timeline-event__body">
                  <p className="timeline-event__kind">{kindLabels[event.kind][locale]}</p>
                  <h2>{event.title[locale]}</h2>
                  <p>{event.description[locale]}</p>
                  <div className="timeline-event__links">
                    {eventPeople.map((person) => (
                      <button
                        type="button"
                        key={person.id}
                        onClick={() => navigate(`/person/${person.id}`)}
                      >
                        {person.name}
                        <ArrowUpRight aria-hidden="true" />
                      </button>
                    ))}
                    {eventConcepts.map((concept) => (
                      <button
                        type="button"
                        key={concept.id}
                        onClick={() => navigate(`/concept/${concept.id}`)}
                      >
                        {concept.term}
                        <ArrowUpRight aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </main>
  )
}
