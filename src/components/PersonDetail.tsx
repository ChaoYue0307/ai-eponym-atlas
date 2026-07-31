import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs'
import type { Locale } from '../copy'
import { conceptsById, peopleById } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { formatLifespan } from '../lib/lifespan'
import { PersonPortrait } from './PersonPortrait'

export function PersonDetail({ personId, locale }: { personId: string; locale: Locale }) {
  const person = peopleById.get(personId)

  if (!person) {
    return (
      <main className="not-found">
        <p>{locale === 'zh' ? '没有找到这位人物。' : 'This person was not found.'}</p>
        <a href="#/atlas">{locale === 'zh' ? '返回图谱' : 'Back to atlas'}</a>
      </main>
    )
  }

  const namedConcepts = person.concepts
    .map((conceptId) => conceptsById.get(conceptId))
    .filter((concept) => concept !== undefined)

  return (
    <main className="person-page">
      <a
        className="text-button"
        href="#/atlas?view=people"
        onClick={(event) => {
          event.preventDefault()
          navigate('/atlas', new URLSearchParams({ view: 'people' }))
        }}
      >
        <ArrowLeft aria-hidden="true" />
        {locale === 'zh' ? '返回人物列表' : 'Back to people'}
      </a>
      <header className="person-page__header">
        <PersonPortrait person={person} locale={locale} variant="profile" showCredit />
        <div className="person-page__identity">
          <p>
            {person.region} · {formatLifespan(person, locale)}
          </p>
          <h1>
            {person.name} <span>/ {person.zhName}</span>
          </h1>
        </div>
        <div className="person-page__intro">
          <p className="person-page__intro-label">
            {locale === 'zh' ? '人物简介' : 'Brief introduction'}
          </p>
          <p className="person-page__summary">{person.summary[locale]}</p>
          {person.profileUrl ? (
            <a href={person.profileUrl} target="_blank" rel="noreferrer">
              {locale === 'zh' ? '查看 Wikidata 人物资料' : 'View Wikidata profile'}
              <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </header>
      <section className="person-page__concepts">
        <p className="section-number">01</p>
        <h2>
          {locale === 'zh'
            ? '你会在现代 AI 文献中看到这些名字'
            : 'Where this name appears in modern AI'}
        </h2>
        <div className="person-concept-list">
          {namedConcepts.map((concept) => (
            <button
              type="button"
              key={concept.id}
              onClick={() => navigate(`/concept/${concept.id}`)}
            >
              <span>
                <strong>{concept.term}</strong>
                <small>{concept.zhTerm}</small>
              </span>
              <span className="person-concept-list__meaning">
                {concept.functionNickname[locale]}
              </span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
      <section className="person-page__method-note">
        <p className="section-number">02</p>
        <h2>{locale === 'zh' ? '关于归因' : 'A note on attribution'}</h2>
        <p>
          {locale === 'zh'
            ? '图谱中的连接表示命名关系，不自动等同于“独立发明”。每个概念条目会说明直接贡献、后世形式化、推广与命名惯例。'
            : 'A connection in this atlas records a naming relationship, not an automatic claim of sole invention. Each concept distinguishes direct work, later formalization, popularization, and naming convention.'}
        </p>
        <a
          href="#/about"
          onClick={(event) => {
            event.preventDefault()
            navigate('/about')
          }}
        >
          {locale === 'zh' ? '了解人名归属' : 'Learn how names are attributed'}
          <ExternalLink aria-hidden="true" />
        </a>
      </section>
    </main>
  )
}
