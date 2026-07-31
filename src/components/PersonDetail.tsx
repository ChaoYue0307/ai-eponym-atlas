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
            {locale === 'zh' ? '生平与贡献' : 'Life & work'}
          </p>
          <p className="person-page__summary">{person.summary[locale]}</p>
          {person.profileUrl ? (
            <a href={person.profileUrl} target="_blank" rel="noreferrer">
              {locale === 'zh' ? '在 Wikidata 了解更多' : 'Learn more on Wikidata'}
              <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </header>
      <section className="person-page__concepts">
        <p className="section-number">01</p>
        <h2>
          {locale === 'zh'
            ? '现代 AI 中的相关人名概念'
            : 'Named concepts in modern AI'}
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
        <h2>
          {locale === 'zh'
            ? '命名不等于独立发明'
            : 'A name is not proof of sole invention'}
        </h2>
        <p>
          {locale === 'zh'
            ? '人名记录的是命名关系，并不能单独证明某人独立发明了概念。发现、形式化、推广与后世命名可能分别来自不同的人。'
            : 'A name marks an attribution relationship; it does not by itself prove sole invention. Discovery, formalization, popularization, and later naming may involve different people.'}
        </p>
        <a
          href="#/about"
          onClick={(event) => {
            event.preventDefault()
            navigate('/about')
          }}
        >
          {locale === 'zh' ? '了解名字背后的历史' : 'Explore the history behind the names'}
          <ExternalLink aria-hidden="true" />
        </a>
      </section>
    </main>
  )
}
