import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import Copy from 'lucide-react/dist/esm/icons/copy.mjs'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs'
import Share2 from 'lucide-react/dist/esm/icons/share-2.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import { conceptsById, peopleById } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { formatLifespan } from '../lib/lifespan'
import { FormulaText } from './FormulaText'
import { PersonPortrait } from './PersonPortrait'

type ConceptDetailProps = {
  conceptId: string
  locale: Locale
  embedded?: boolean
  onClose?: () => void
  onSelectConcept?: (conceptId: string) => void
}

function getLocaleText(value: { en: string; zh: string }, locale: Locale) {
  return value[locale]
}

export function ConceptDetail({
  conceptId,
  locale,
  embedded = false,
  onClose,
  onSelectConcept,
}: ConceptDetailProps) {
  const concept = conceptsById.get(conceptId)
  const t = copy[locale].detail
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)
  const TitleHeading = embedded ? 'h2' : 'h1'
  const SectionHeading = embedded ? 'h3' : 'h2'

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [conceptId])

  useEffect(() => {
    if (!embedded || !onClose) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [embedded, onClose])

  const namesakes = useMemo(
    () =>
      concept?.personIds
        .map((id) => peopleById.get(id))
        .filter((person) => person !== undefined) ?? [],
    [concept],
  )

  if (!concept) {
    return (
      <main className="not-found">
        <p>{locale === 'zh' ? '没有找到这个概念。' : 'This concept was not found.'}</p>
        <a href="#/atlas">{locale === 'zh' ? '返回图谱' : 'Back to atlas'}</a>
      </main>
    )
  }

  const selectRelated = (relatedId: string) => {
    if (onSelectConcept) {
      onSelectConcept(relatedId)
    } else {
      navigate(`/concept/${relatedId}`)
    }
  }

  const copyLink = async () => {
    const url = new URL(window.location.href)
    url.hash = `#/concept/${concept.id}`
    try {
      await navigator.clipboard.writeText(url.toString())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt(locale === 'zh' ? '复制这个链接：' : 'Copy this link:', url.toString())
    }
  }

  return (
    <article
      className={`concept-detail${embedded ? ' concept-detail--embedded' : ' concept-detail--page'}`}
      aria-labelledby="concept-detail-title"
    >
      <div className="concept-detail__topbar">
        {embedded ? (
          <button className="text-button" type="button" onClick={onClose}>
            <ArrowLeft aria-hidden="true" />
            {t.back}
          </button>
        ) : (
          <a
            className="text-button"
            href="#/atlas"
            onClick={(event) => {
              event.preventDefault()
              navigate('/atlas')
            }}
          >
            <ArrowLeft aria-hidden="true" />
            {t.back}
          </a>
        )}
        <div className="concept-detail__top-actions">
          <button className="icon-button" type="button" onClick={copyLink} aria-label={t.copyLink}>
            <Share2 aria-hidden="true" />
          </button>
          {embedded ? (
            <button className="icon-button" type="button" onClick={onClose} aria-label={t.back}>
              <X aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <header className="concept-detail__header">
        <p className="concept-detail__index" aria-hidden="true">
          {concept.category.toUpperCase()} · {concept.era}
        </p>
        <TitleHeading
          className="concept-detail__title"
          id="concept-detail-title"
          ref={headingRef}
          tabIndex={-1}
        >
          {concept.term}
          <span> / {concept.zhTerm}</span>
        </TitleHeading>
        <p className="concept-detail__nickname">
          {getLocaleText(concept.functionNickname, locale)}
        </p>
        <p className="concept-detail__nickname-label">
          {copy[locale].atlas.plainLabel}
        </p>
      </header>

      <div className="concept-detail__primary">
        <section>
          <SectionHeading className="concept-detail__section-title">{t.question}</SectionHeading>
          <p className="concept-detail__question">{getLocaleText(concept.question, locale)}</p>
        </section>
        <section>
          <SectionHeading className="concept-detail__section-title">{t.intuition}</SectionHeading>
          <p>{getLocaleText(concept.intuition, locale)}</p>
        </section>
        <section>
          <SectionHeading className="concept-detail__section-title">{t.formal}</SectionHeading>
          <FormulaText value={concept.formalDefinition} />
        </section>
        <section>
          <SectionHeading className="concept-detail__section-title">{t.ai}</SectionHeading>
          <ul className="application-list">
            {concept.aiApplications.map((application) => (
              <li key={application.en}>{getLocaleText(application, locale)}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="concept-detail__secondary">
        <section>
          <div className="section-heading-row">
            <SectionHeading className="concept-detail__section-title">
              {t.related}
            </SectionHeading>
            <a
              href={`#/graph?focus=${concept.id}`}
              onClick={(event) => {
                event.preventDefault()
                navigate('/graph', new URLSearchParams({ focus: concept.id }))
              }}
            >
              {locale === 'zh' ? '查看关系图' : 'View graph'}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <ul className="related-list">
            {concept.relatedConceptIds.map((relatedId) => {
              const related = conceptsById.get(relatedId)
              if (!related) return null
              return (
                <li key={related.id}>
                  <button type="button" onClick={() => selectRelated(related.id)}>
                    <span>
                      {related.term} <small>/ {related.zhTerm}</small>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
        <section>
          <SectionHeading className="concept-detail__section-title">{t.attribution}</SectionHeading>
          <p className="attribution-guard">{t.attributionGuard}</p>
          {namesakes.length ? (
            <div className="namesake-list">
              {namesakes.map((person) => (
                <button
                  type="button"
                  key={person.id}
                  onClick={() => navigate(`/person/${person.id}`)}
                >
                  <PersonPortrait person={person} locale={locale} />
                  <span>
                    <strong>{person.name}</strong>
                    <small>
                      {person.zhName} · {formatLifespan(person, locale)}
                    </small>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : null}
          <p>{getLocaleText(concept.attributionNote, locale)}</p>
        </section>
        <section>
          <SectionHeading className="concept-detail__section-title">{t.sources}</SectionHeading>
          <ol className="source-list">
            {concept.sourceLinks.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                  <ExternalLink aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="concept-detail__footer">
        <button className="button button--secondary" type="button" onClick={copyLink}>
          {copied ? <Copy aria-hidden="true" /> : <Share2 aria-hidden="true" />}
          {copied ? t.copied : t.copyLink}
        </button>
        {embedded ? (
          <button
            className="button button--secondary"
            type="button"
            onClick={() => navigate(`/concept/${concept.id}`)}
          >
            {t.openFull}
            <ArrowUpRight aria-hidden="true" />
          </button>
        ) : (
          <a
            className="button button--primary"
            href="https://github.com/ChaoYue0307/ai-eponym-atlas/edit/main/content/eponyms.json"
            target="_blank"
            rel="noreferrer"
          >
            {t.improve}
            <ExternalLink aria-hidden="true" />
          </a>
        )}
      </footer>
      <span className="sr-only" aria-live="polite">
        {copied ? t.copied : ''}
      </span>
    </article>
  )
}
