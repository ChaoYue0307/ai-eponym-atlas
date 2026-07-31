import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import BookOpen from 'lucide-react/dist/esm/icons/book-open.mjs'
import type { Locale } from '../copy'
import { copy } from '../copy'
import { catalogStats } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { ConceptConstellation } from './ConceptConstellation'
import { SectionRule } from './SectionRule'

export function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale].hero
  const stats = [
    { value: catalogStats.people, label: t.stats.people },
    { value: catalogStats.concepts, label: t.stats.concepts },
    { value: catalogStats.fields, label: t.stats.fields },
    { value: catalogStats.sourceCitations, label: t.stats.sources },
  ]

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__copy">
        <h1 id="hero-heading">
          <span>{t.titleA}</span>
          <span>{t.titleB}</span>
        </h1>
        <SectionRule />
        <p>{t.description}</p>
        <dl className="hero__stats" aria-label={t.statsLabel}>
          {stats.map((stat) => (
            <div className="hero__stat" key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>
                {stat.value.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en')}
              </dd>
            </div>
          ))}
        </dl>
        <div className="hero__actions">
          <a
            className="button button--primary"
            href="#/atlas"
            onClick={(event) => {
              event.preventDefault()
              navigate('/atlas')
            }}
          >
            {t.primary}
            <ArrowRight aria-hidden="true" />
          </a>
          <a
            className="button button--secondary"
            href="#/concept/jacobian-matrix"
            onClick={(event) => {
              event.preventDefault()
              navigate('/concept/jacobian-matrix')
            }}
          >
            {t.secondary}
            <BookOpen aria-hidden="true" />
          </a>
        </div>
      </div>
      <ConceptConstellation locale={locale} />
    </section>
  )
}
