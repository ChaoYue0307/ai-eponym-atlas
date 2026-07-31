import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import Command from 'lucide-react/dist/esm/icons/command.mjs'
import Filter from 'lucide-react/dist/esm/icons/filter.mjs'
import Grid2X2 from 'lucide-react/dist/esm/icons/grid-2x2.mjs'
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
import { categories, concepts, conceptsById, peopleById } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { formatLifespan } from '../lib/lifespan'
import { searchCatalog, type SearchMode } from '../lib/search'
import { ConceptDetail } from './ConceptDetail'
import { PersonPortrait } from './PersonPortrait'
import { SectionRule } from './SectionRule'

type AtlasExplorerProps = {
  locale: Locale
  params?: URLSearchParams
  homePreview?: boolean
}

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

export function AtlasExplorer({ locale, params, homePreview = false }: AtlasExplorerProps) {
  const t = copy[locale].atlas
  const searchRef = useRef<HTMLInputElement>(null)
  const initialMode = params?.get('view') === 'people' ? 'people' : 'concepts'
  const [mode, setMode] = useState<SearchMode>(initialMode)
  const [query, setQuery] = useState(params?.get('q') ?? '')
  const [category, setCategory] = useState(params?.get('category') ?? '')
  const [focusId, setFocusId] = useState(
    params?.get('focus') ?? (homePreview ? 'jacobian-matrix' : ''),
  )
  const [mobileDetailOpen, setMobileDetailOpen] = useState(Boolean(params?.get('focus')))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(
    () => searchCatalog(deferredQuery, mode, category ? { category } : undefined),
    [category, deferredQuery, mode],
  )

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    concepts.forEach((concept) => {
      counts.set(concept.category, (counts.get(concept.category) ?? 0) + 1)
    })
    return counts
  }, [])

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
    if (homePreview) return
    const nextParams = new URLSearchParams()
    if (mode !== 'concepts') nextParams.set('view', mode)
    if (query) nextParams.set('q', query)
    if (category) nextParams.set('category', category)
    if (focusId) nextParams.set('focus', focusId)
    navigate('/atlas', nextParams, true)
  }, [category, focusId, homePreview, mode, query])

  const selectMode = (nextMode: SearchMode) => {
    startTransition(() => {
      setMode(nextMode)
      setFocusId('')
      setMobileDetailOpen(false)
    })
  }

  const chooseResult = (kind: 'concept' | 'person', id: string) => {
    if (kind === 'person') {
      navigate(`/person/${id}`)
      return
    }
    setFocusId(id)
    setMobileDetailOpen(true)
  }

  const surprise = () => {
    if (!results.length) return
    const result = results[Math.floor(Math.random() * results.length)]
    chooseResult(result.kind, result.id)
  }

  const selectedConcept = focusId ? conceptsById.get(focusId) : undefined

  return (
    <section
      className={`atlas-section${homePreview ? ' atlas-section--home' : ''}`}
      aria-labelledby={homePreview ? 'atlas-preview-title' : 'atlas-title'}
    >
      {!homePreview ? (
        <header className="page-intro">
          <p className="section-number">01 — {concepts.length}</p>
          <h1 id="atlas-title">{t.title}</h1>
          <SectionRule />
          <p>{t.description}</p>
        </header>
      ) : (
        <h2 className="sr-only" id="atlas-preview-title">
          {t.title}
        </h2>
      )}

      <div
        className={`atlas-shell${selectedConcept ? ' atlas-shell--detail-open' : ''}${
          mobileDetailOpen ? ' atlas-shell--mobile-detail-open' : ''
        }`}
      >
        <aside
          className={`filter-rail${filtersOpen ? ' filter-rail--open' : ''}`}
          aria-label={t.filters}
        >
          <div className="filter-rail__mobile-header">
            <h2>{t.filters}</h2>
            <button
              className="icon-button"
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label={t.clear}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className={!category ? 'is-active' : ''}
            onClick={() => {
              setCategory('')
              setFiltersOpen(false)
            }}
          >
            <Grid2X2 aria-hidden="true" />
            <span>{t.all}</span>
            <small>{concepts.length}</small>
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? 'is-active' : ''}
              onClick={() => {
                startTransition(() => setCategory(item))
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
                ? '功能标签是教学辅助，不替代标准数学术语。'
                : 'Plain-language labels are teaching aids, not replacement terminology.'}
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                autoComplete="off"
              />
              <span className="keyboard-hint" aria-hidden="true">
                <Command />
                K
              </span>
            </label>
            <div className="mode-switch" aria-label="Browse mode">
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
              className="filter-button"
              type="button"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter aria-hidden="true" />
              {t.filters}
              {category ? <span>1</span> : null}
            </button>
          </div>

          <div className="results-meta">
            <span>
              {results.length} {t.results}
            </span>
            <button type="button" onClick={surprise} disabled={!results.length}>
              <Sparkles aria-hidden="true" />
              {t.surprise}
            </button>
          </div>

          <div className="result-list" aria-live="polite" aria-busy={query !== deferredQuery}>
            {results.length ? (
              results.map((result) => {
                if (result.kind === 'person') {
                  const person = peopleById.get(result.id)
                  if (!person) return null
                  const knownConcepts = person.concepts
                    .map((id) => conceptsById.get(id)?.term)
                    .filter(Boolean)
                    .slice(0, 3)
                    .join(', ')
                  return (
                    <button
                      type="button"
                      className="result-row result-row--person"
                      key={person.id}
                      onClick={() => chooseResult('person', person.id)}
                    >
                      <PersonPortrait person={person} locale={locale} />
                      <span className="result-row__main">
                        <strong>
                          {person.name} <small>/ {person.zhName}</small>
                        </strong>
                        <span>{person.summary[locale]}</span>
                      </span>
                      <span className="result-row__origin">
                        {person.region}
                        <small>{formatLifespan(person, locale)}</small>
                      </span>
                      <span className="result-row__application">
                        {locale === 'zh' ? '相关术语' : 'Known here for'}
                        <small>{knownConcepts}</small>
                      </span>
                      <ArrowRight className="result-row__arrow" aria-hidden="true" />
                    </button>
                  )
                }

                const concept = conceptsById.get(result.id)
                if (!concept) return null
                const originators = concept.personIds
                  .map((id) => peopleById.get(id)?.name)
                  .filter(Boolean)
                  .join(', ')
                return (
                  <button
                    type="button"
                    className={`result-row${
                      focusId === concept.id ? ' result-row--selected' : ''
                    }`}
                    key={concept.id}
                    onClick={() => chooseResult('concept', concept.id)}
                    aria-pressed={focusId === concept.id}
                  >
                    <span className="result-row__marker" aria-hidden="true" />
                    <span className="result-row__main">
                      <strong>
                        {concept.term} <small>/ {concept.zhTerm}</small>
                      </strong>
                      <span className="result-row__nickname">
                        {concept.functionNickname[locale]}
                      </span>
                      <span className="result-row__mobile-question">
                        {concept.question[locale]}
                      </span>
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
                )
              })
            ) : (
              <div className="empty-results">
                <Search aria-hidden="true" />
                <p>{t.noResults}</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setCategory('')
                  }}
                >
                  {t.clear}
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedConcept ? (
          <ConceptDetail
            conceptId={selectedConcept.id}
            locale={locale}
            embedded
            onClose={() => {
              setFocusId('')
              setMobileDetailOpen(false)
            }}
            onSelectConcept={setFocusId}
          />
        ) : null}
      </div>
    </section>
  )
}
