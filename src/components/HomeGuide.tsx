import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import type { Locale } from '../copy'
import { conceptsById } from '../data/catalog'
import { buildHref } from '../hooks/useHashRoute'
import { ConceptIcon } from './ConceptIcon'

const featuredConceptIds = [
  'jacobian-matrix',
  'bayes-theorem',
  'markov-chain',
  'fourier-transform',
  'shannon-entropy',
  'wasserstein-distance',
] as const

const entryRoutes = [
  {
    number: '01',
    title: { en: 'I found an unfamiliar term', zh: '我遇到了一个陌生术语' },
    body: {
      en: 'Search by name, function, or AI use.',
      zh: '按人名、功能或 AI 用途搜索。',
    },
    label: { en: 'Search the atlas', zh: '搜索图谱' },
    path: '/atlas',
  },
  {
    number: '02',
    title: { en: 'I want the foundations', zh: '我想系统补齐基础' },
    body: {
      en: 'Follow a short, connected learning path.',
      zh: '沿一条简短而连贯的路径学习。',
    },
    label: { en: 'Browse learning paths', zh: '浏览学习路径' },
    path: '/paths',
  },
  {
    number: '03',
    title: { en: 'I want the bigger picture', zh: '我想看见更大的图景' },
    body: {
      en: 'Trace relationships or move through history.',
      zh: '追踪概念关系，或沿时间线理解历史。',
    },
    label: { en: 'Open the graph', zh: '打开关系图' },
    path: '/graph',
  },
] as const

export function HomeGuide({ locale }: { locale: Locale }) {
  return (
    <>
      <section className="reader-entry" aria-labelledby="reader-entry-title">
        <h2 id="reader-entry-title">
          {locale === 'zh' ? '选择你的阅读入口' : 'Choose your way in'}
        </h2>
        <ol>
          {entryRoutes.map((route) => (
            <li key={route.number}>
              <span>{route.number}</span>
              <h3>{route.title[locale]}</h3>
              <p>{route.body[locale]}</p>
              <a href={buildHref(route.path)}>
                {route.label[locale]}
                <ArrowRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="featured-concepts" aria-labelledby="featured-concepts-title">
        <header>
          <div>
            <p className="section-number">{locale === 'zh' ? '从这里开始' : 'START HERE'}</p>
            <h2 id="featured-concepts-title">
              {locale === 'zh' ? '先读六个常用概念。' : 'Begin with six widely useful ideas.'}
            </h2>
          </div>
          <p>
            {locale === 'zh'
              ? '每一项都先说明它解决什么问题，再进入定义、历史与 AI 用途。'
              : 'Each entry begins with the problem it solves, then moves into the definition, history, and AI use.'}
          </p>
        </header>
        <ol>
          {featuredConceptIds.map((conceptId, index) => {
            const concept = conceptsById.get(conceptId)
            if (!concept) return null
            return (
              <li key={concept.id}>
                <a href={buildHref(`/concept/${concept.id}`)}>
                  <span className="featured-concepts__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ConceptIcon
                    conceptId={concept.id}
                    locale={locale}
                    size="row"
                  />
                  <div>
                    <h3>
                      {locale === 'zh' ? concept.zhTerm : concept.term}{' '}
                      <small>/ {locale === 'zh' ? concept.term : concept.zhTerm}</small>
                    </h3>
                    <p>{concept.functionNickname[locale]}</p>
                  </div>
                  <ArrowRight aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ol>
        <a className="featured-concepts__all" href={buildHref('/atlas')}>
          {locale === 'zh' ? '查看全部概念' : 'Explore all concepts'}
          <ArrowRight aria-hidden="true" />
        </a>
      </section>
    </>
  )
}
