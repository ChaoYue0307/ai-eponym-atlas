import type { CSSProperties } from 'react'
import type { Locale } from '../copy'
import { buildHash } from '../hooks/useHashRoute'
import { buildPersonConceptRanking } from '../lib/personConceptStats'
import { PersonPortrait } from './PersonPortrait'

type PeopleRankingProps = {
  locale: Locale
  category?: string
  categoryLabel?: string
  visiblePersonIds: readonly string[]
}

export function PeopleRanking({
  locale,
  category,
  categoryLabel,
  visiblePersonIds,
}: PeopleRankingProps) {
  const visibleIds = new Set(visiblePersonIds)
  const completeRanking = buildPersonConceptRanking(category, locale)
  const ranking = completeRanking.filter((row) => visibleIds.has(row.person.id))
  const maxCount = Math.max(...completeRanking.map((row) => row.count), 1)

  return (
    <section className="people-ranking" aria-labelledby="people-ranking-title">
      <header className="people-ranking__header">
        <div>
          <h2 id="people-ranking-title">
            {locale === 'zh' ? '人物概念数排名' : 'Concepts per person, ranked'}
          </h2>
          <p>
            {categoryLabel
              ? locale === 'zh'
                ? `按“${categoryLabel}”领域内与每位人物关联的独立概念数重新计算。`
                : `Recalculated from each person's distinct entries in ${categoryLabel}.`
              : locale === 'zh'
                ? '按每位人物在当前图谱中关联的独立概念条目数排序；不代表历史重要性或全部贡献。'
                : 'Ranked by distinct entries linked to each person in the current atlas—not by historical importance or total output.'}
          </p>
        </div>
        <p className="people-ranking__result-count" aria-live="polite">
          {locale === 'zh'
            ? `显示 ${ranking.length} / ${completeRanking.length} 位人物`
            : `Showing ${ranking.length} of ${completeRanking.length} people`}
        </p>
      </header>

      {ranking.length ? (
        <>
          <div className="people-ranking__columns" aria-hidden="true">
            <span>{locale === 'zh' ? '排名' : 'Rank'}</span>
            <span>{locale === 'zh' ? '人物' : 'Person'}</span>
            <span>{locale === 'zh' ? '已收录概念' : 'Catalogued concepts'}</span>
            <span>{locale === 'zh' ? '相对数量' : 'Relative count'}</span>
            <span>{locale === 'zh' ? '数量' : 'Count'}</span>
          </div>
          <ol>
            {ranking.map((row) => {
              const profileHash = buildHash(`/person/${row.person.id}`)
              return (
                <li key={row.person.id}>
                  <span className="people-ranking__rank">
                    #{String(row.rank).padStart(2, '0')}{row.tied ? '=' : ''}
                  </span>
                  <a className="people-ranking__person" href={profileHash}>
                    <PersonPortrait person={row.person} locale={locale} />
                    <span>
                      <strong>{locale === 'zh' ? row.person.zhName : row.person.name}</strong>
                      <small>{locale === 'zh' ? row.person.name : row.person.zhName}</small>
                    </span>
                  </a>
                  <span className="people-ranking__concepts">
                    {row.concepts.map((concept, index) => (
                      <span key={concept.id}>
                        <a href={buildHash(`/concept/${concept.id}`)}>
                          {locale === 'zh' ? concept.zhTerm : concept.term}
                        </a>
                        {index < row.concepts.length - 1 ? <span aria-hidden="true"> · </span> : null}
                      </span>
                    ))}
                  </span>
                  <span
                    className="people-ranking__bar"
                    aria-hidden="true"
                  >
                    <span
                      aria-hidden="true"
                      style={
                        {
                          '--ranking-size': `${(row.count / maxCount) * 100}%`,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <strong className="people-ranking__count">{row.count}</strong>
                </li>
              )
            })}
          </ol>
        </>
      ) : (
        <div className="people-ranking__empty">
          <p>
            {locale === 'zh'
              ? '当前搜索或领域筛选下没有匹配人物。'
              : 'No people match the current search and field filters.'}
          </p>
        </div>
      )}
    </section>
  )
}
