import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs'
import type { Locale } from '../copy'
import { conceptsById, peopleById } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { formatLifespan } from '../lib/lifespan'
import {
  categoryLabels,
  derivePersonProfile,
  formatRegion,
} from '../lib/personProfile'
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

  const profile = derivePersonProfile(person, conceptsById)
  const conceptById = new Map(
    profile.concepts.map((concept) => [concept.id, concept]),
  )
  const factLabels =
    locale === 'zh'
      ? {
          lifespan: '生卒年份',
          region: '地区',
          concepts: '相关概念',
          fields: '涉及领域',
          evidence: '证据链接',
        }
      : {
          lifespan: 'Lifespan',
          region: 'Region',
          concepts: 'Named concepts',
          fields: 'Fields',
          evidence: 'Evidence links',
        }

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
            {formatRegion(person.region, locale)} · {formatLifespan(person, locale)}
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
              {locale === 'zh' ? 'Wikidata 身份记录' : 'Wikidata identity record'}
              <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
        </div>
        <dl
          className="person-page__facts"
          aria-label={locale === 'zh' ? '人物概览' : 'Profile at a glance'}
        >
          <div>
            <dt>{factLabels.lifespan}</dt>
            <dd>{formatLifespan(person, locale)}</dd>
          </div>
          <div>
            <dt>{factLabels.region}</dt>
            <dd>{formatRegion(person.region, locale)}</dd>
          </div>
          <div>
            <dt>{factLabels.concepts}</dt>
            <dd>{profile.concepts.length}</dd>
          </div>
          <div>
            <dt>{factLabels.fields}</dt>
            <dd>{profile.categories.length}</dd>
          </div>
          <div>
            <dt>{factLabels.evidence}</dt>
            <dd>{profile.sources.length}</dd>
          </div>
        </dl>
      </header>
      <section className="person-page__section person-page__concepts">
        <p className="section-number">01</p>
        <div className="person-page__section-heading">
          <h2>
            {locale === 'zh' ? '核心贡献' : 'Core contributions'}
          </h2>
          <p>
            {locale === 'zh'
              ? '每个名字背后真正解决的问题，以及它在图谱中的功能含义。'
              : 'What each eponym actually helps solve, expressed through its functional meaning.'}
          </p>
        </div>
        <div className="person-concept-list">
          {profile.concepts.map((concept) => (
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
                <strong>{concept.functionNickname[locale]}</strong>
                <small>{concept.question[locale]}</small>
              </span>
              <small className="person-concept-list__field">
                {categoryLabels[concept.category][locale]}
              </small>
              <ArrowUpRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
      <section className="person-page__section person-page__applications">
        <p className="section-number">02</p>
        <div className="person-page__section-heading">
          <h2>
            {locale === 'zh' ? '为什么与 AI 有关' : 'Why this work matters in AI'}
          </h2>
          <p>
            {locale === 'zh'
              ? '这些现代用途直接来自相关概念条目，并保留与原概念的连接。'
              : 'Modern uses drawn directly from the connected concept entries, with every link preserved.'}
          </p>
        </div>
        <ol className="person-application-list">
          {profile.applications.map((application, index) => (
            <li key={`${application.text.en}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p>{application.text[locale]}</p>
                <small>
                  {application.conceptIds
                    .map((conceptId) => {
                      const concept = conceptById.get(conceptId)
                      return concept
                        ? locale === 'zh'
                          ? concept.zhTerm
                          : concept.term
                        : conceptId
                    })
                    .join(' · ')}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="person-page__section person-page__evidence">
        <p className="section-number">03</p>
        <div className="person-page__section-heading">
          <h2>
            {locale === 'zh' ? '证据与命名来源' : 'Evidence & attribution'}
          </h2>
          <p>
            {locale === 'zh'
              ? '来源按概念列出，用于核查数学定义、历史归属与现代用法。'
              : 'Sources are grouped by concept so definitions, historical attribution, and modern usage remain checkable.'}
          </p>
        </div>
        <div className="person-evidence-list">
          {profile.concepts.map((concept) => (
            <article key={concept.id}>
              <header>
                <h3>{locale === 'zh' ? concept.zhTerm : concept.term}</h3>
                <button
                  type="button"
                  onClick={() => navigate(`/concept/${concept.id}`)}
                >
                  {locale === 'zh' ? '打开概念' : 'Open concept'}
                  <ArrowUpRight aria-hidden="true" />
                </button>
              </header>
              <p>{concept.attributionNote[locale]}</p>
              <ul>
                {concept.sourceLinks.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="person-page__section person-page__method-note">
        <p className="section-number">04</p>
        <div className="person-page__section-heading">
          <h2>
          {locale === 'zh'
            ? '命名不等于独立发明'
            : 'A name is not proof of sole invention'}
          </h2>
        </div>
        <div className="person-page__method-copy">
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
        </div>
      </section>
    </main>
  )
}
