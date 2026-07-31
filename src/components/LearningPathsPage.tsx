import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import type { Locale } from '../copy'
import { conceptsById } from '../data/catalog'
import { learningPaths } from '../data/learningPaths'
import { buildHref } from '../hooks/useHashRoute'
import { SectionRule } from './SectionRule'

export function LearningPathsPage({ locale }: { locale: Locale }) {
  return (
    <main className="paths-page">
      <header className="paths-page__intro">
        <div>
          <p className="section-number">02 — {locale === 'zh' ? '学习路径' : 'LEARNING PATHS'}</p>
          <h1>{locale === 'zh' ? '按有用的顺序理解这些思想。' : 'Learn the ideas in a useful order.'}</h1>
          <SectionRule />
          <p>
            {locale === 'zh'
              ? '沿一条简短路径，从每个概念回答的问题读到它在现代 AI 中的作用。'
              : 'Follow a short sequence from the question each concept answers to the role it plays in modern AI.'}
          </p>
        </div>
        <aside>
          <span aria-hidden="true">✦</span>
          <p>
            {locale === 'zh'
              ? '这里的顺序用于学习，不表示概念之间存在历史因果关系。'
              : 'The order is pedagogical, not a claim about historical causality.'}
          </p>
        </aside>
      </header>

      <div className="learning-path-list">
        {learningPaths.map((path, pathIndex) => {
          const pathConcepts = path.conceptIds
            .map((conceptId) => conceptsById.get(conceptId))
            .filter((concept) => concept !== undefined)
          const firstConcept = pathConcepts[0]

          return (
            <section className="learning-path" key={path.id} aria-labelledby={`path-${path.id}`}>
              <header>
                <span>{String(pathIndex + 1).padStart(2, '0')}</span>
                <h2 id={`path-${path.id}`}>{path.title[locale]}</h2>
                <p>{path.description[locale]}</p>
                {firstConcept ? (
                  <a
                    href={buildHref(
                      `/concept/${firstConcept.id}`,
                      new URLSearchParams({ path: path.id }),
                    )}
                  >
                    {locale === 'zh' ? '开始这条路径' : 'Start this path'}
                    <ArrowRight aria-hidden="true" />
                  </a>
                ) : null}
              </header>
              <ol>
                {pathConcepts.map((concept, conceptIndex) => (
                  <li key={concept.id}>
                    <a
                      href={buildHref(
                        `/concept/${concept.id}`,
                        new URLSearchParams({ path: path.id }),
                      )}
                    >
                      <span>{conceptIndex + 1}</span>
                      <h3>{locale === 'zh' ? concept.zhTerm : concept.term}</h3>
                      <p>{concept.functionNickname[locale]}</p>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </div>

      <section className="paths-page__elsewhere">
        <span aria-hidden="true">✦</span>
        <h2>{locale === 'zh' ? '想找别的术语？' : 'Looking for a different term?'}</h2>
        <p>
          {locale === 'zh'
            ? '在完整图谱中搜索任意 AI 人名术语，并查看它与其他概念的联系。'
            : 'Use the Atlas to find any AI eponym and see how it connects.'}
        </p>
        <a className="button button--secondary" href={buildHref('/atlas')}>
          {locale === 'zh' ? '前往图谱' : 'Go to Atlas'}
          <ArrowRight aria-hidden="true" />
        </a>
      </section>
    </main>
  )
}
