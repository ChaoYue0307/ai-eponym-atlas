import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.mjs'
import Command from 'lucide-react/dist/esm/icons/command.mjs'
import Filter from 'lucide-react/dist/esm/icons/filter.mjs'
import Grid2X2 from 'lucide-react/dist/esm/icons/grid-2x2.mjs'
import List from 'lucide-react/dist/esm/icons/list.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.mjs'
import UserRound from 'lucide-react/dist/esm/icons/user-round.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import {
  catalogStats,
  categories,
  concepts,
  conceptsById,
  people,
  peopleById,
} from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { formatLifespan } from '../lib/lifespan'
import { formatRegion } from '../lib/personProfile'
import { searchCatalog, type SearchMode } from '../lib/search'
import { ConceptDetail } from './ConceptDetail'
import { ConceptIcon } from './ConceptIcon'
import { PeopleCoverageSummary } from './PeopleCoverageSummary'
import { PeopleRanking } from './PeopleRanking'
import { PersonPortrait } from './PersonPortrait'
import { SectionRule } from './SectionRule'

type AtlasExplorerProps = {
  locale: Locale
  params?: URLSearchParams
}

type PeopleLayout = 'directory' | 'ranking'

const categoryLabels: Record<string, { en: string; zh: string }> = {
  algebra: { en: 'Algebra & spaces', zh: '代数与空间' },
  calculus: { en: 'Calculus & autodiff', zh: '微积分与自动微分' },
  computation: { en: 'Computation', zh: '计算理论' },
  dynamics: { en: 'Dynamics & control', zh: '动力系统与控制' },
  geometry: { en: 'Geometry', zh: '几何' },
  information: { en: 'Information theory', zh: '信息论' },
  optimization: { en: 'Optimization', zh: '优化' },
  probability: { en: 'Probability', zh: '概率' },
  statistics: { en: 'Statistics', zh: '统计' },
}

const matchFieldLabels: Record<string, { en: string; zh: string }> = {
  Alias: { en: 'alias', zh: '别名' },
  Biography: { en: 'biography', zh: '人物简介' },
  'AI application': { en: 'AI application', zh: 'AI 用途' },
  'Associated alias': { en: 'associated alias', zh: '相关别名' },
  'Associated term': { en: 'associated term', zh: '相关术语' },
  'Function nickname': { en: 'plain-language meaning', zh: '一句话含义' },
  Intuition: { en: 'intuition', zh: '直觉' },
  Person: { en: 'person', zh: '人物' },
  'Question answered': { en: 'question answered', zh: '核心问题' },
  Tag: { en: 'tag', zh: '标签' },
  Term: { en: 'term', zh: '术语' },
}

function formatMatchReason(reason: string, locale: Locale) {
  const match = reason.match(/^(.+?) \((.+?)\):/)
  if (!match) return reason
  const [, field, quality] = match
  const fieldLabel = matchFieldLabels[field]?.[locale] ?? field
  if (locale === 'zh') {
    const qualityLabels: Record<string, string> = {
      exact: '完全匹配',
      prefix: '前缀匹配',
      phrase: '短语匹配',
      'all words': '全部词语匹配',
      partial: '部分匹配',
    }
    return `${fieldLabel} · ${qualityLabels[quality] ?? quality}`
  }
  return `${fieldLabel} · ${quality} match`
}

export function AtlasExplorer({ locale, params }: AtlasExplorerProps) {
  const t = copy[locale].atlas
  const searchRef = useRef<HTMLInputElement>(null)
  const filterTriggerRef = useRef<HTMLButtonElement>(null)
  const filterRailRef = useRef<HTMLElement>(null)
  const initialMode = params?.get('view') === 'people' ? 'people' : 'concepts'
  const initialLayout: PeopleLayout =
    params?.get('layout') === 'ranking' ? 'ranking' : 'directory'
  const [mode, setMode] = useState<SearchMode>(initialMode)
  const [peopleLayout, setPeopleLayout] = useState<PeopleLayout>(initialLayout)
  const [query, setQuery] = useState(params?.get('q') ?? '')
  const [category, setCategory] = useState(params?.get('category') ?? '')
  const [focusId, setFocusId] = useState(params?.get('focus') ?? '')
  const [mobileDetailOpen, setMobileDetailOpen] = useState(Boolean(params?.get('focus')))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const paramsKey = params?.toString() ?? ''

  useEffect(() => {
    const nextMode: SearchMode = params?.get('view') === 'people' ? 'people' : 'concepts'
    const nextLayout: PeopleLayout =
      nextMode === 'people' && params?.get('layout') === 'ranking'
        ? 'ranking'
        : 'directory'
    const nextQuery = params?.get('q') ?? ''
    const nextCategory = params?.get('category') ?? ''
    const nextFocusId = params?.get('focus') ?? ''

    setMode(nextMode)
    setPeopleLayout(nextLayout)
    setQuery(nextQuery)
    setCategory(nextCategory)
    setFocusId(nextFocusId)
    setMobileDetailOpen(Boolean(nextFocusId))
  }, [paramsKey])

  const results = useMemo(
    () => searchCatalog(deferredQuery, mode, category ? { category } : undefined),
    [category, deferredQuery, mode],
  )

  const categoryCounts = useMemo(() => {
    const conceptCounts = new Map<string, number>()
    const personIdsByCategory = new Map<string, Set<string>>()
    concepts.forEach((concept) => {
      conceptCounts.set(
        concept.category,
        (conceptCounts.get(concept.category) ?? 0) + 1,
      )
      const personIds = personIdsByCategory.get(concept.category) ?? new Set<string>()
      concept.personIds.forEach((personId) => personIds.add(personId))
      personIdsByCategory.set(concept.category, personIds)
    })
    return new Map(
      categories.map((item) => [
        item,
        mode === 'people'
          ? (personIdsByCategory.get(item)?.size ?? 0)
          : (conceptCounts.get(item) ?? 0),
      ]),
    )
  }, [mode])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isEditable =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.getAttribute('contenteditable') === 'true'

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === '/' && !isEditable) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!filtersOpen) return

    const previousOverflow = document.body.style.overflow
    const dialog = filterRailRef.current
    const focusableSelector =
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    document.body.style.overflow = 'hidden'
    const focusable = Array.from(
      dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )
    focusable[0]?.focus()

    const onDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setFiltersOpen(false)
        return
      }
      if (event.key !== 'Tab' || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onDialogKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onDialogKeyDown)
      filterTriggerRef.current?.focus({ preventScroll: true })
    }
  }, [filtersOpen])

  const replaceRouteState = (patch: {
    mode?: SearchMode
    peopleLayout?: PeopleLayout
    query?: string
    category?: string
    focusId?: string
  }) => {
    const nextMode = patch.mode ?? mode
    const nextLayout = patch.peopleLayout ?? peopleLayout
    const nextQuery = patch.query ?? query
    const nextCategory = patch.category ?? category
    const nextFocusId = patch.focusId ?? focusId
    const nextParams = new URLSearchParams()
    if (nextMode !== 'concepts') nextParams.set('view', nextMode)
    if (nextMode === 'people' && nextLayout === 'ranking') {
      nextParams.set('layout', nextLayout)
    }
    if (nextQuery) nextParams.set('q', nextQuery)
    if (nextCategory) nextParams.set('category', nextCategory)
    if (nextFocusId) nextParams.set('focus', nextFocusId)
    navigate('/atlas', nextParams, true)
  }

  const selectMode = (nextMode: SearchMode) => {
    startTransition(() => {
      setMode(nextMode)
      setFocusId('')
      setMobileDetailOpen(false)
    })
    replaceRouteState({ mode: nextMode, focusId: '' })
  }

  const chooseResult = (kind: 'concept' | 'person', id: string) => {
    if (kind === 'person') {
      navigate(`/person/${id}`)
      return
    }
    if (window.matchMedia('(max-width: 1040px)').matches) {
      navigate(`/concept/${id}`)
      return
    }
    setFocusId(id)
    setMobileDetailOpen(true)
    replaceRouteState({ focusId: id })
  }

  const surprise = () => {
    if (!results.length) return
    const result = results[Math.floor(Math.random() * results.length)]
    chooseResult(result.kind, result.id)
  }

  const selectedConcept = focusId ? conceptsById.get(focusId) : undefined
  const visiblePersonIds = results
    .filter((result) => result.kind === 'person')
    .map((result) => result.id)

  return (
    <section
      className="atlas-section"
      aria-labelledby="atlas-title"
    >
      <header className="page-intro">
        <p className="section-number">01 — {concepts.length}</p>
        <h1 id="atlas-title">{t.title}</h1>
        <SectionRule />
        <p>{t.description}</p>
      </header>

      <div
        className={`atlas-shell${selectedConcept ? ' atlas-shell--detail-open' : ''}${
          mobileDetailOpen ? ' atlas-shell--mobile-detail-open' : ''
        }${mode === 'people' && peopleLayout === 'ranking' ? ' atlas-shell--ranking' : ''}`}
      >
        {filtersOpen ? (
          <button
            className="filter-scrim"
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label={locale === 'zh' ? '关闭筛选' : 'Close filters'}
          />
        ) : null}
        <aside
          ref={filterRailRef}
          id="atlas-filters"
          className={`filter-rail${filtersOpen ? ' filter-rail--open' : ''}`}
          aria-label={t.filters}
          role={filtersOpen ? 'dialog' : undefined}
          aria-modal={filtersOpen ? true : undefined}
        >
          <div className="filter-rail__mobile-header">
            <h2>{t.filters}</h2>
            <button
              className="icon-button"
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label={locale === 'zh' ? '关闭筛选' : 'Close filters'}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className={!category ? 'is-active' : ''}
            aria-pressed={!category}
            onClick={() => {
              setCategory('')
              replaceRouteState({ category: '' })
              setFiltersOpen(false)
            }}
          >
            <Grid2X2 aria-hidden="true" />
            <span>{t.all}</span>
            <small>{mode === 'people' ? people.length : concepts.length}</small>
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? 'is-active' : ''}
              aria-pressed={category === item}
              onClick={() => {
                startTransition(() => setCategory(item))
                replaceRouteState({ category: item })
                setFiltersOpen(false)
              }}
            >
              <span className="filter-rail__glyph" aria-hidden="true">
                {item.slice(0, 1).toUpperCase()}
              </span>
              <span>{categoryLabels[item]?.[locale] ?? item}</span>
              <small>{categoryCounts.get(item) ?? 0}</small>
            </button>
          ))}
          <div className="filter-rail__note">
            <span aria-hidden="true">✦</span>
            <p>
              {locale === 'zh'
                ? '先用一句话理解概念；技术交流时仍使用正式术语。'
                : 'Use the plain-language meaning to get oriented; use the formal term in technical work.'}
            </p>
          </div>
        </aside>

        <div className="atlas-results">
          <div className="atlas-toolbar">
            <label className="search-field">
              <Search aria-hidden="true" />
              <span className="sr-only">{t.search}</span>
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value
                  setQuery(nextQuery)
                  replaceRouteState({ query: nextQuery })
                }}
                placeholder={t.search}
                autoComplete="off"
              />
              <span className="keyboard-hint" aria-hidden="true">
                <Command />
                K
              </span>
            </label>
            <div
              className="mode-switch"
              aria-label={locale === 'zh' ? '选择浏览内容' : 'Choose what to browse'}
            >
              <button
                type="button"
                className={mode === 'concepts' ? 'is-active' : ''}
                onClick={() => selectMode('concepts')}
                aria-pressed={mode === 'concepts'}
              >
                <Grid2X2 aria-hidden="true" />
                {t.concepts}
              </button>
              <button
                type="button"
                className={mode === 'people' ? 'is-active' : ''}
                onClick={() => selectMode('people')}
                aria-pressed={mode === 'people'}
              >
                <UserRound aria-hidden="true" />
                {t.people}
              </button>
            </div>
            <button
              ref={filterTriggerRef}
              className="filter-button"
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-controls="atlas-filters"
            >
              <Filter aria-hidden="true" />
              {t.filters}
              {category ? <span>1</span> : null}
            </button>
          </div>

          {mode === 'people' ? (
            <div className="people-layout-bar">
              <div>
                <strong>
                  {locale === 'zh' ? '全目录：' : 'Whole catalog: '}
                  {catalogStats.people} {locale === 'zh' ? '位人物' : 'people'} ·{' '}
                  {catalogStats.personConceptLinks}{' '}
                  {locale === 'zh' ? '条人物—概念连接' : 'person–concept links'}
                </strong>
                <span>{t.rankingHint}</span>
              </div>
              <div
                className="segmented-control people-layout-switch"
                aria-label={t.peopleViews}
              >
                <button
                  type="button"
                  className={peopleLayout === 'directory' ? 'is-active' : ''}
                  onClick={() => {
                    setPeopleLayout('directory')
                    replaceRouteState({ peopleLayout: 'directory' })
                  }}
                  aria-pressed={peopleLayout === 'directory'}
                >
                  <List aria-hidden="true" />
                  {t.directory}
                </button>
                <button
                  type="button"
                  className={peopleLayout === 'ranking' ? 'is-active' : ''}
                  onClick={() => {
                    setPeopleLayout('ranking')
                    replaceRouteState({ peopleLayout: 'ranking' })
                  }}
                  aria-pressed={peopleLayout === 'ranking'}
                >
                  <BarChart3 aria-hidden="true" />
                  {t.ranking}
                </button>
              </div>
            </div>
          ) : null}

          {mode !== 'people' || peopleLayout === 'directory' ? (
            <div className="results-meta" aria-live="polite">
              <span>
                {results.length} {t.results}
              </span>
              <button type="button" onClick={surprise} disabled={!results.length}>
                <Sparkles aria-hidden="true" />
                {t.surprise}
              </button>
            </div>
          ) : null}

          {mode === 'people' && peopleLayout === 'ranking' ? (
            <div className="people-ranking-view" aria-busy={query !== deferredQuery}>
              <PeopleCoverageSummary locale={locale} />
              <PeopleRanking
                locale={locale}
                category={category || undefined}
                categoryLabel={
                  category ? categoryLabels[category]?.[locale] : undefined
                }
                visiblePersonIds={visiblePersonIds}
              />
            </div>
          ) : (
          <ul className="result-list" aria-busy={query !== deferredQuery}>
            {results.length ? (
              results.map((result) => {
                if (result.kind === 'person') {
                  const person = peopleById.get(result.id)
                  if (!person) return null
                  const visibleConcepts = person.concepts
                    .map((id) => {
                      const concept = conceptsById.get(id)
                      return concept ? (locale === 'zh' ? concept.zhTerm : concept.term) : undefined
                    })
                    .filter(Boolean)
                    .slice(0, 3)
                  const remainingConcepts = person.concepts.length - visibleConcepts.length
                  const knownConcepts = `${visibleConcepts.join(locale === 'zh' ? '、' : ', ')}${
                    remainingConcepts > 0 ? ` +${remainingConcepts}` : ''
                  }`
                  return (
                    <li key={person.id}>
                      <button
                        type="button"
                        className="result-row result-row--person"
                        onClick={() => chooseResult('person', person.id)}
                      >
                        <PersonPortrait person={person} locale={locale} />
                        <span className="result-row__main">
                          <strong>
                            {locale === 'zh' ? person.zhName : person.name}{' '}
                            <small>/ {locale === 'zh' ? person.name : person.zhName}</small>
                          </strong>
                          <span>{person.summary[locale]}</span>
                          {deferredQuery && result.matchReasons[0] ? (
                            <span className="result-row__match">
                              {locale === 'zh' ? '匹配于：' : 'Matched in: '}
                              {formatMatchReason(result.matchReasons[0], locale)}
                            </span>
                          ) : null}
                        </span>
                        <span className="result-row__origin">
                          {formatRegion(person.region, locale)}
                          <small>{formatLifespan(person, locale)}</small>
                        </span>
                        <span className="result-row__application">
                          {locale === 'zh' ? '相关术语' : 'Named concepts'}
                          <small>{knownConcepts}</small>
                        </span>
                        <ArrowRight className="result-row__arrow" aria-hidden="true" />
                      </button>
                    </li>
                  )
                }

                const concept = conceptsById.get(result.id)
                if (!concept) return null
                const originators = concept.personIds
                  .map((id) => {
                    const person = peopleById.get(id)
                    return person ? (locale === 'zh' ? person.zhName : person.name) : undefined
                  })
                  .filter(Boolean)
                  .join(locale === 'zh' ? '、' : ', ')
                return (
                  <li key={concept.id}>
                    <button
                      type="button"
                      className={`result-row${
                        focusId === concept.id ? ' result-row--selected' : ''
                      }`}
                      onClick={() => chooseResult('concept', concept.id)}
                      aria-pressed={focusId === concept.id}
                    >
                      <ConceptIcon
                        conceptId={concept.id}
                        locale={locale}
                        size="row"
                        className="result-row__concept-icon"
                      />
                      <span className="result-row__main">
                        <strong>
                          {locale === 'zh' ? concept.zhTerm : concept.term}{' '}
                          <small>/ {locale === 'zh' ? concept.term : concept.zhTerm}</small>
                        </strong>
                        <span className="result-row__nickname">
                          {concept.functionNickname[locale]}
                        </span>
                        <span className="result-row__mobile-question">
                          {concept.question[locale]}
                        </span>
                        {deferredQuery && result.matchReasons[0] ? (
                          <span className="result-row__match">
                            {locale === 'zh' ? '匹配于：' : 'Matched in: '}
                            {formatMatchReason(result.matchReasons[0], locale)}
                          </span>
                        ) : null}
                      </span>
                      <span className="result-row__origin">
                        {originators || '—'}
                        <small>{categoryLabels[concept.category]?.[locale] ?? concept.category}</small>
                      </span>
                      <span className="result-row__application">
                        {concept.aiApplications[0]?.[locale] ?? '—'}
                      </span>
                      <ArrowRight className="result-row__arrow" aria-hidden="true" />
                    </button>
                  </li>
                )
              })
            ) : (
              <li className="empty-results">
                <Search aria-hidden="true" />
                <p>{t.noResults}</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setCategory('')
                    replaceRouteState({ query: '', category: '' })
                  }}
                >
                  {t.clear}
                </button>
              </li>
            )}
          </ul>
          )}
        </div>

        {selectedConcept ? (
          <ConceptDetail
            conceptId={selectedConcept.id}
            locale={locale}
            embedded
            onClose={() => {
              setFocusId('')
              setMobileDetailOpen(false)
              replaceRouteState({ focusId: '' })
            }}
            onSelectConcept={(conceptId) => {
              setFocusId(conceptId)
              replaceRouteState({ focusId: conceptId })
            }}
          />
        ) : null}
      </div>
    </section>
  )
}
