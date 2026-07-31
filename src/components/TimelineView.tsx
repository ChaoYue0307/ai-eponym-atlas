import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import Check from 'lucide-react/dist/esm/icons/check.mjs'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs'
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw.mjs'
import Share2 from 'lucide-react/dist/esm/icons/share-2.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import { conceptsById, peopleById } from '../data/catalog'
import { timelineEras, timelineEvents } from '../data/timeline'
import { navigate, useHashRoute } from '../hooks/useHashRoute'
import type { TimelineEraId, TimelineEventKind } from '../types'
import { PersonPortrait } from './PersonPortrait'
import './TimelineView.css'

type TimelineFilter = 'all' | TimelineEventKind
type TimelineEraFilter = 'all' | TimelineEraId
type TimelineEntry = (typeof timelineEvents)[number]

const timelineKinds: readonly TimelineEventKind[] = [
  'person',
  'publication',
  'naming',
  'ai-adoption',
]

const kindLabels: Record<TimelineEventKind, { en: string; zh: string }> = {
  person: { en: 'People', zh: '人物' },
  publication: { en: 'Publication', zh: '发表' },
  naming: { en: 'Naming', zh: '命名' },
  'ai-adoption': { en: 'AI adoption', zh: 'AI 采用' },
}

const timelineUi = {
  en: {
    section: '03 — TIMELINE',
    span: '22 curated events · 1596–2025',
    filters: 'Filter timeline events',
    era: 'Era',
    allEras: 'All eras',
    results: 'events shown',
    reset: 'Clear filters',
    share: 'Share this view',
    shared: 'Link copied',
    overview: 'True-scale overview',
    overviewNote:
      'Marker positions are proportional to time. The grouped chapters below are optimized for reading, not equal spacing.',
    eraNavigation: 'Timeline chapters',
    eventDetails: 'Event details',
    chooseEvent: 'Select an event to inspect it',
    chooseEventBody:
      'Open a row or a point on the overview to see its people, concepts, and historical role together.',
    year: 'Year',
    kind: 'Event type',
    people: 'People',
    concepts: 'Related concepts',
    sources: 'Evidence',
    openConcept: 'Open concept in the atlas',
    openDetails: 'Open event details',
    closeDetails: 'Close event details',
    noResults: 'No events match this combination.',
  },
  zh: {
    section: '03 — 时间线',
    span: '22 条精选事件 · 1596–2025',
    filters: '筛选时间线事件',
    era: '时代',
    allEras: '全部时代',
    results: '条事件',
    reset: '清除筛选',
    share: '分享当前视图',
    shared: '链接已复制',
    overview: '真实比例总览',
    overviewNote: '节点按真实年份比例定位；下方按时代分章，以便阅读，并非等距排列。',
    eraNavigation: '时间线章节',
    eventDetails: '事件详情',
    chooseEvent: '选择一个事件深入阅读',
    chooseEventBody: '打开事件行或总览节点，即可一起查看相关人物、概念与历史作用。',
    year: '年份',
    kind: '事件类型',
    people: '相关人物',
    concepts: '关联概念',
    sources: '事件证据',
    openConcept: '在图谱中打开概念',
    openDetails: '打开事件详情',
    closeDetails: '关闭事件详情',
    noResults: '当前筛选组合下没有事件。',
  },
} as const

const firstTimelineYear = timelineEvents[0]?.sortYear ?? 1596
const lastTimelineYear = timelineEvents.at(-1)?.sortYear ?? 2025
const overviewTicks = [1596, 1600, 1700, 1800, 1900, 2000, 2025] as const

function positionForYear(year: number) {
  return ((year - firstTimelineYear) / (lastTimelineYear - firstTimelineYear)) * 100
}

/**
 * Preserve exact x positions while assigning crowded events to small vertical
 * lanes. This keeps 2023–2025 legible without pretending those years are
 * farther apart than they are.
 */
const markerLanes = (() => {
  const lastPositionByLane = Array.from({ length: 7 }, () => -Infinity)
  const offsets = [0, -1, 1, -2, 2, -3, 3]
  const lanes = new Map<string, number>()

  for (const event of timelineEvents) {
    const position = positionForYear(event.sortYear)
    let lane = lastPositionByLane.findIndex(
      (lastPosition) => position - lastPosition >= 1.25,
    )
    if (lane < 0) lane = 0
    lastPositionByLane[lane] = position
    lanes.set(event.id, offsets[lane] ?? 0)
  }

  return lanes
})()

const kindCounts = new Map(
  timelineKinds.map((kind) => [
    kind,
    timelineEvents.filter((event) => event.kind === kind).length,
  ]),
)

function isTimelineKind(value: string | null): value is TimelineEventKind {
  return timelineKinds.some((kind) => kind === value)
}

function isTimelineEra(value: string | null): value is TimelineEraId {
  return timelineEras.some((era) => era.id === value)
}

function localizedPersonName(person: NonNullable<ReturnType<typeof peopleById.get>>, locale: Locale) {
  return locale === 'zh' ? person.zhName : person.name
}

function localizedConceptName(
  concept: NonNullable<ReturnType<typeof conceptsById.get>>,
  locale: Locale,
) {
  return locale === 'zh' ? concept.zhTerm : concept.term
}

function TimelineKindMark({ kind }: { kind: TimelineEventKind }) {
  return <span className={`timeline-v2-kind-mark timeline-v2-kind-mark--${kind}`} aria-hidden="true" />
}

type OverviewProps = {
  locale: Locale
  selectedEventId: string | null
  visibleEventIds: ReadonlySet<string>
  onSelect: (eventId: string) => void
}

function TimelineOverview({
  locale,
  selectedEventId,
  visibleEventIds,
  onSelect,
}: OverviewProps) {
  const ui = timelineUi[locale]

  return (
    <section className="timeline-v2-overview" aria-labelledby="timeline-overview-title">
      <div className="timeline-v2-overview__header">
        <h2 id="timeline-overview-title">{ui.overview}</h2>
        <span>{firstTimelineYear}–{lastTimelineYear}</span>
      </div>
      <div
        className="timeline-v2-overview__plot"
        aria-label={
          locale === 'zh'
            ? `从 ${firstTimelineYear} 到 ${lastTimelineYear} 的真实比例事件总览`
            : `True-scale event overview from ${firstTimelineYear} to ${lastTimelineYear}`
        }
      >
        <span className="timeline-v2-overview__axis" aria-hidden="true" />
        <div className="timeline-v2-overview__ticks" aria-hidden="true">
          {overviewTicks.map((year) => (
            <span
              key={year}
              className="timeline-v2-overview__tick"
              style={{ '--timeline-position': `${positionForYear(year)}%` } as CSSProperties}
            >
              <span>{year}</span>
            </span>
          ))}
        </div>
        <div className="timeline-v2-overview__events">
          {timelineEvents.map((event) => {
            const isVisible = visibleEventIds.has(event.id)
            return (
              <button
                type="button"
                key={event.id}
                className={`timeline-v2-overview__event timeline-v2-overview__event--${event.kind}${
                  selectedEventId === event.id ? ' is-selected' : ''
                }`}
                style={
                  {
                    '--timeline-position': `${positionForYear(event.sortYear)}%`,
                    '--timeline-lane': markerLanes.get(event.id) ?? 0,
                  } as CSSProperties
                }
                aria-label={`${event.year[locale]} — ${event.title[locale]}`}
                aria-pressed={selectedEventId === event.id}
                disabled={!isVisible}
                onClick={() => onSelect(event.id)}
              >
                <span />
              </button>
            )
          })}
        </div>
      </div>
      <p>{ui.overviewNote}</p>
    </section>
  )
}

type EventLinksProps = {
  event: TimelineEntry
  locale: Locale
  compact?: boolean
}

function EventLinks({ event, locale, compact = false }: EventLinksProps) {
  const eventPeople = event.personIds
    .map((id) => peopleById.get(id))
    .filter((person) => person !== undefined)
  const eventConcepts = event.conceptIds
    .map((id) => conceptsById.get(id))
    .filter((concept) => concept !== undefined)

  return (
    <div className={`timeline-v2-links${compact ? ' timeline-v2-links--compact' : ''}`}>
      {eventPeople.map((person) => (
        <a key={person.id} href={`#/person/${encodeURIComponent(person.id)}`}>
          {localizedPersonName(person, locale)}
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
      {eventConcepts.map((concept) => (
        <a key={concept.id} href={`#/concept/${encodeURIComponent(concept.id)}`}>
          {localizedConceptName(concept, locale)}
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

function EventSources({
  event,
  compact = false,
}: {
  event: TimelineEntry
  compact?: boolean
}) {
  return (
    <div
      className={`timeline-v2-sources${compact ? ' timeline-v2-sources--compact' : ''}`}
    >
      {event.sourceLinks.map((source) => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noreferrer"
        >
          <span>{source.label}</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

type InlineDetailProps = {
  event: TimelineEntry
  locale: Locale
  onClose: () => void
}

function InlineEventDetail({ event, locale, onClose }: InlineDetailProps) {
  const ui = timelineUi[locale]
  const firstConcept = event.conceptIds
    .map((id) => conceptsById.get(id))
    .find((concept) => concept !== undefined)

  return (
    <div className="timeline-v2-inline-detail" id={`timeline-inline-${event.id}`}>
      <dl>
        <div>
          <dt>{ui.kind}</dt>
          <dd>{kindLabels[event.kind][locale]}</dd>
        </div>
        <div>
          <dt>{ui.concepts}</dt>
          <dd>{event.conceptIds.length}</dd>
        </div>
      </dl>
      {firstConcept ? (
        <a
          className="timeline-v2-detail__primary"
          href={`#/concept/${encodeURIComponent(firstConcept.id)}`}
        >
          {ui.openConcept}
          <ArrowUpRight aria-hidden="true" />
        </a>
      ) : null}
      <div className="timeline-v2-inline-sources">
        <span>{ui.sources}</span>
        <EventSources event={event} compact />
      </div>
      <button type="button" className="timeline-v2-inline-detail__close" onClick={onClose}>
        {ui.closeDetails}
        <X aria-hidden="true" />
      </button>
    </div>
  )
}

type EventRowProps = {
  event: TimelineEntry
  locale: Locale
  selected: boolean
  onToggle: () => void
}

function TimelineEventRow({ event, locale, selected, onToggle }: EventRowProps) {
  const ui = timelineUi[locale]
  const eventPeople = event.personIds
    .map((id) => peopleById.get(id))
    .filter((person) => person !== undefined)
  const featuredPerson =
    event.kind === 'person'
      ? eventPeople.find((person) => person.portrait) ?? eventPeople[0]
      : undefined

  return (
    <li
      className={`timeline-v2-event timeline-v2-event--${event.kind}${
        featuredPerson ? ' has-portrait' : ''
      }${selected ? ' is-selected' : ''}`}
    >
      <article id={`timeline-event-${event.id}`}>
        <div className="timeline-v2-event__rail" aria-hidden="true">
          <TimelineKindMark kind={event.kind} />
        </div>
        <div className="timeline-v2-event__year">
          <time dateTime={String(event.sortYear)}>{event.year[locale]}</time>
          <span>
            <TimelineKindMark kind={event.kind} />
            {kindLabels[event.kind][locale]}
          </span>
        </div>
        {featuredPerson ? (
          <a
            className="timeline-v2-event__portrait"
            href={`#/person/${encodeURIComponent(featuredPerson.id)}`}
            aria-label={localizedPersonName(featuredPerson, locale)}
          >
            <PersonPortrait person={featuredPerson} locale={locale} />
          </a>
        ) : null}
        <div className="timeline-v2-event__content">
          <h3>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={selected}
              aria-controls={
                selected
                  ? `timeline-inline-${event.id} timeline-inspector`
                  : undefined
              }
            >
              {event.title[locale]}
            </button>
          </h3>
          <p>{event.description[locale]}</p>
          <EventLinks event={event} locale={locale} compact />
        </div>
        <button
          type="button"
          className="timeline-v2-event__open"
          aria-label={`${ui.openDetails}: ${event.title[locale]}`}
          aria-expanded={selected}
          aria-controls={
            selected
              ? `timeline-inline-${event.id} timeline-inspector`
              : undefined
          }
          onClick={onToggle}
        >
          <ChevronRight aria-hidden="true" />
        </button>
        {selected ? <InlineEventDetail event={event} locale={locale} onClose={onToggle} /> : null}
      </article>
    </li>
  )
}

type InspectorProps = {
  event: TimelineEntry | null
  locale: Locale
  onClose: () => void
}

function TimelineInspector({ event, locale, onClose }: InspectorProps) {
  const ui = timelineUi[locale]

  if (!event) {
    return (
      <aside className="timeline-v2-inspector timeline-v2-inspector--empty" aria-label={ui.eventDetails}>
        <p className="section-number">{ui.eventDetails}</p>
        <h2>{ui.chooseEvent}</h2>
        <p>{ui.chooseEventBody}</p>
        <ul>
          {timelineKinds.map((kind) => (
            <li key={kind}>
              <TimelineKindMark kind={kind} />
              <span>{kindLabels[kind][locale]}</span>
              <strong>{kindCounts.get(kind)}</strong>
            </li>
          ))}
        </ul>
      </aside>
    )
  }

  const eventPeople = event.personIds
    .map((id) => peopleById.get(id))
    .filter((person) => person !== undefined)
  const eventConcepts = event.conceptIds
    .map((id) => conceptsById.get(id))
    .filter((concept) => concept !== undefined)
  const firstConcept = eventConcepts[0]

  return (
    <aside
      className="timeline-v2-inspector"
      id="timeline-inspector"
      aria-labelledby="timeline-inspector-title"
      aria-live="polite"
      aria-atomic="true"
    >
      <header>
        <div>
          <TimelineKindMark kind={event.kind} />
          <span>{kindLabels[event.kind][locale]}</span>
        </div>
        <button type="button" onClick={onClose} aria-label={ui.closeDetails}>
          <X aria-hidden="true" />
        </button>
      </header>
      <time dateTime={String(event.sortYear)}>{event.year[locale]}</time>
      <h2 id="timeline-inspector-title">{event.title[locale]}</h2>
      <p>{event.description[locale]}</p>

      {eventPeople.length > 0 ? (
        <section>
          <h3>{ui.people}</h3>
          <div className="timeline-v2-inspector__people">
            {eventPeople.map((person) => (
              <a key={person.id} href={`#/person/${encodeURIComponent(person.id)}`}>
                <PersonPortrait person={person} locale={locale} />
                <span>{localizedPersonName(person, locale)}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {eventConcepts.length > 0 ? (
        <section>
          <h3>{ui.concepts}</h3>
          <EventLinks event={{ ...event, personIds: [] }} locale={locale} />
        </section>
      ) : null}

      <section>
        <h3>{ui.sources}</h3>
        <EventSources event={event} />
      </section>

      {firstConcept ? (
        <a
          className="timeline-v2-detail__primary"
          href={`#/concept/${encodeURIComponent(firstConcept.id)}`}
        >
          {ui.openConcept}
          <ArrowUpRight aria-hidden="true" />
        </a>
      ) : null}
    </aside>
  )
}

export function TimelineView({ locale }: { locale: Locale }) {
  const t = copy[locale].timeline
  const ui = timelineUi[locale]
  const { route } = useHashRoute()
  const routeParams = route.name === 'timeline' ? route.params : new URLSearchParams()
  const kindParam = routeParams.get('kind')
  const eraParam = routeParams.get('era')
  const eventParam = routeParams.get('event')
  const filter: TimelineFilter = isTimelineKind(kindParam) ? kindParam : 'all'
  const eraFilter: TimelineEraFilter = isTimelineEra(eraParam) ? eraParam : 'all'
  const [shareComplete, setShareComplete] = useState(false)

  const visibleEvents = useMemo(
    () =>
      timelineEvents.filter(
        (event) =>
          (filter === 'all' || event.kind === filter) &&
          (eraFilter === 'all' || event.eraId === eraFilter),
      ),
    [eraFilter, filter],
  )
  const visibleEventIds = useMemo(
    () => new Set(visibleEvents.map((event) => event.id)),
    [visibleEvents],
  )
  const selectedEvent =
    eventParam && visibleEventIds.has(eventParam)
      ? timelineEvents.find((event) => event.id === eventParam) ?? null
      : null

  useEffect(() => {
    if (!shareComplete) return
    const timeout = window.setTimeout(() => setShareComplete(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [shareComplete])

  function writeParams(nextFilter: TimelineFilter, nextEra: TimelineEraFilter, eventId: string | null) {
    const params = new URLSearchParams(routeParams)

    if (nextFilter === 'all') params.delete('kind')
    else params.set('kind', nextFilter)

    if (nextEra === 'all') params.delete('era')
    else params.set('era', nextEra)

    if (eventId) params.set('event', eventId)
    else params.delete('event')

    navigate('/timeline', params)
  }

  function eventMatches(event: TimelineEntry, nextFilter: TimelineFilter, nextEra: TimelineEraFilter) {
    return (
      (nextFilter === 'all' || event.kind === nextFilter) &&
      (nextEra === 'all' || event.eraId === nextEra)
    )
  }

  function changeFilter(nextFilter: TimelineFilter) {
    const retainedEvent =
      selectedEvent && eventMatches(selectedEvent, nextFilter, eraFilter)
        ? selectedEvent.id
        : null
    writeParams(nextFilter, eraFilter, retainedEvent)
  }

  function changeEra(nextEra: TimelineEraFilter) {
    const retainedEvent =
      selectedEvent && eventMatches(selectedEvent, filter, nextEra)
        ? selectedEvent.id
        : null
    writeParams(filter, nextEra, retainedEvent)
  }

  function toggleEvent(eventId: string) {
    writeParams(filter, eraFilter, selectedEvent?.id === eventId ? null : eventId)
  }

  function selectOverviewEvent(eventId: string) {
    const closing = selectedEvent?.id === eventId
    toggleEvent(eventId)
    if (closing || !window.matchMedia('(max-width: 1040px)').matches) return

    window.requestAnimationFrame(() => {
      const eventElement = document.getElementById(`timeline-event-${eventId}`)
      if (!eventElement) return
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      eventElement.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      eventElement.querySelector<HTMLButtonElement>('h3 button')?.focus({
        preventScroll: true,
      })
    })
  }

  async function shareView() {
    const shareData = {
      title: `${t.title} · AI Eponym Atlas`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
      }
      setShareComplete(true)
    } catch {
      // Cancelling the platform share sheet is not an application error.
    }
  }

  const visibleEras = timelineEras.filter(
    (era) => eraFilter === 'all' || era.id === eraFilter,
  )

  return (
    <main className="timeline-page timeline-v2">
      <header className="page-intro timeline-page__intro timeline-v2__intro">
        <div>
          <p className="section-number">{ui.section}</p>
          <h1>{t.title}</h1>
        </div>
        <div className="timeline-v2__intro-copy">
          <p>{t.description}</p>
          <span>{ui.span}</span>
        </div>
      </header>

      <section className="timeline-v2-toolbar" aria-label={ui.filters}>
        <div className="timeline-v2-filters">
          <button
            type="button"
            className={filter === 'all' ? 'is-active' : ''}
            aria-pressed={filter === 'all'}
            onClick={() => changeFilter('all')}
          >
            <span>{copy[locale].timeline.all}</span>
            <strong>{timelineEvents.length}</strong>
          </button>
          {timelineKinds.map((kind) => (
            <button
              type="button"
              key={kind}
              className={filter === kind ? 'is-active' : ''}
              aria-pressed={filter === kind}
              onClick={() => changeFilter(kind)}
            >
              <TimelineKindMark kind={kind} />
              <span>{kindLabels[kind][locale]}</span>
              <strong>{kindCounts.get(kind)}</strong>
            </button>
          ))}
        </div>

        <label className="timeline-v2-era-select">
          <span className="sr-only">{ui.era}</span>
          <select
            value={eraFilter}
            onChange={(event) => changeEra(event.target.value as TimelineEraFilter)}
          >
            <option value="all">{ui.allEras}</option>
            {timelineEras.map((era) => (
              <option key={era.id} value={era.id}>
                {era.label[locale]} · {era.range[locale]}
              </option>
            ))}
          </select>
        </label>

        <div className="timeline-v2-toolbar__meta" aria-live="polite">
          <span>
            <strong>{visibleEvents.length}</strong> {ui.results}
          </span>
          {filter !== 'all' || eraFilter !== 'all' ? (
            <button type="button" onClick={() => writeParams('all', 'all', null)}>
              <RotateCcw aria-hidden="true" />
              {ui.reset}
            </button>
          ) : null}
        </div>

        <button type="button" className="timeline-v2-share" onClick={() => void shareView()}>
          {shareComplete ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
          {shareComplete ? ui.shared : ui.share}
        </button>
      </section>

      <TimelineOverview
        locale={locale}
        visibleEventIds={visibleEventIds}
        selectedEventId={selectedEvent?.id ?? null}
        onSelect={selectOverviewEvent}
      />

      <div className={`timeline-v2-workspace${selectedEvent ? ' has-selection' : ''}`}>
        <aside className="timeline-v2-era-rail">
          <p className="section-number">{ui.eraNavigation}</p>
          <nav aria-label={ui.eraNavigation}>
            <ol>
              {timelineEras.map((era) => {
                const count = timelineEvents.filter(
                  (event) =>
                    event.eraId === era.id && (filter === 'all' || event.kind === filter),
                ).length
                const active = eraFilter === era.id
                return (
                  <li key={era.id}>
                    <button
                      type="button"
                      className={active ? 'is-active' : ''}
                      aria-pressed={active}
                      onClick={() => changeEra(active ? 'all' : era.id)}
                    >
                      <span className="timeline-v2-era-rail__node" aria-hidden="true" />
                      <strong>{era.label[locale]}</strong>
                      <span>{era.range[locale]}</span>
                      <small>{count} {ui.results}</small>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        </aside>

        <div className="timeline-v2-chronicle">
          <p className="sr-only" role="status" aria-live="polite">
            {visibleEvents.length} {ui.results}
          </p>
          {visibleEvents.length === 0 ? (
            <div className="timeline-v2-empty" role="status">
              <p>{ui.noResults}</p>
              <button type="button" onClick={() => writeParams('all', 'all', null)}>
                <RotateCcw aria-hidden="true" />
                {ui.reset}
              </button>
            </div>
          ) : (
            visibleEras.map((era) => {
              const eraEvents = visibleEvents.filter((event) => event.eraId === era.id)
              if (eraEvents.length === 0) return null
              return (
                <section className="timeline-v2-era-section" key={era.id} aria-labelledby={`era-${era.id}`}>
                  <header>
                    <div>
                      <h2 id={`era-${era.id}`}>{era.label[locale]}</h2>
                      <span>{era.range[locale]}</span>
                    </div>
                    <p>{eraEvents.length} {ui.results}</p>
                  </header>
                  <ol>
                    {eraEvents.map((event) => (
                      <TimelineEventRow
                        key={event.id}
                        event={event}
                        locale={locale}
                        selected={selectedEvent?.id === event.id}
                        onToggle={() => toggleEvent(event.id)}
                      />
                    ))}
                  </ol>
                </section>
              )
            })
          )}
        </div>

        <TimelineInspector
          event={selectedEvent}
          locale={locale}
          onClose={() => writeParams(filter, eraFilter, null)}
        />
      </div>
    </main>
  )
}
