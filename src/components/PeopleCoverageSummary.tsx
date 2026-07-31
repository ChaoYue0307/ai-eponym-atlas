import type { CSSProperties } from 'react'
import type { Locale } from '../copy'
import { catalogStats } from '../data/catalog'
import { conceptCountDistribution } from '../lib/personConceptStats'

export function PeopleCoverageSummary({ locale }: { locale: Locale }) {
  const largestBin = Math.max(
    ...conceptCountDistribution.map((bin) => bin.peopleCount),
  )

  const metrics = [
    {
      value: catalogStats.people,
      label: locale === 'zh' ? '位人物' : 'people',
    },
    {
      value: catalogStats.concepts,
      label: locale === 'zh' ? '个独立概念' : 'unique concepts',
    },
    {
      value: catalogStats.personConceptLinks,
      label: locale === 'zh' ? '条人物—概念连接' : 'person–concept links',
    },
    {
      value: catalogStats.sharedConcepts,
      label: locale === 'zh' ? '个多人共名概念' : 'shared concepts',
    },
  ]

  const equationLines = [
    [
      {
        value: catalogStats.people,
        label: locale === 'zh' ? '人物' : 'people',
      },
      { operator: '+' },
      {
        value: catalogStats.additionalPersonLinks,
        label:
          locale === 'zh'
            ? '超出每位人物首个条目的额外概念连接'
            : "additional concept links beyond each person's first",
      },
      { operator: '=' },
      {
        value: catalogStats.personConceptLinks,
        label: locale === 'zh' ? '人物—概念连接' : 'person–concept links',
      },
    ],
    [
      {
        value: catalogStats.personConceptLinks,
        label: locale === 'zh' ? '人物—概念连接' : 'person–concept links',
      },
      { operator: '−' },
      {
        value: catalogStats.additionalNamesakeLinks,
        label: locale === 'zh' ? '多人共名的额外人物连接' : 'additional co-namesake links',
      },
      { operator: '=' },
      {
        value: catalogStats.concepts,
        label: locale === 'zh' ? '独立概念' : 'unique concepts',
      },
    ],
  ]

  return (
    <section className="people-coverage" aria-labelledby="people-coverage-title">
      <header className="people-coverage__header">
        <div>
          <p className="section-number">
            <span className="section-number__emoji" aria-hidden="true">📊</span>
            <span>
              {locale === 'zh'
                ? '全目录关系核验'
                : 'WHOLE-CATALOG RELATIONSHIP AUDIT'}
            </span>
          </p>
          <h2 id="people-coverage-title">
            {locale === 'zh'
              ? `为什么 ${catalogStats.people} 位人物对应 ${catalogStats.concepts} 个概念？`
              : `Why can ${catalogStats.people} people map to ${catalogStats.concepts} concepts?`}
          </h2>
        </div>
        <p>
          {locale === 'zh'
            ? `以下数字始终描述全部领域。人物与概念不是一一配对：一个人物可以关联多个概念，一个复合人名概念也可以关联多人；因此 ${catalogStats.concepts} 个独立概念形成了 ${catalogStats.personConceptLinks} 条连接。`
            : `These figures always describe the whole catalog. People and concepts are not one-to-one: one person can link to several entries, while a joint eponym can link to several namesakes—so ${catalogStats.concepts} distinct concepts form ${catalogStats.personConceptLinks} links.`}
        </p>
      </header>

      <dl className="people-coverage__metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt>{metric.value}</dt>
            <dd>{metric.label}</dd>
          </div>
        ))}
      </dl>

      <div className="coverage-equation">
        <p className="sr-only">
          {locale === 'zh'
            ? `${catalogStats.people} 位人物，加上 ${catalogStats.additionalPersonLinks} 条超出每位人物首个条目的额外概念连接，得到 ${catalogStats.personConceptLinks} 条人物—概念连接；减去 ${catalogStats.additionalNamesakeLinks} 条多人共名造成的额外人物连接，得到 ${catalogStats.concepts} 个独立概念。`
            : `${catalogStats.people} people plus ${catalogStats.additionalPersonLinks} additional concept links beyond each person's first makes ${catalogStats.personConceptLinks} person–concept links; subtracting ${catalogStats.additionalNamesakeLinks} additional co-namesake links gives ${catalogStats.concepts} unique concepts.`}
        </p>
        <div className="coverage-equation__visual" aria-hidden="true">
          {equationLines.map((line, lineIndex) => (
            <div className="coverage-equation__line" key={lineIndex}>
              {line.map((item, itemIndex) =>
                item.operator ? (
                  <span
                    className="coverage-equation__operator"
                    key={`${item.operator}-${itemIndex}`}
                  >
                    {item.operator}
                  </span>
                ) : (
                  <span className="coverage-equation__term" key={item.label}>
                    <strong>{item.value}</strong>
                    <small>{item.label}</small>
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="people-distribution">
        <div className="people-distribution__heading">
          <div>
            <h3>
              {locale === 'zh' ? '每位人物的概念数分布' : 'Concepts per person'}
            </h3>
            <p>
              {locale === 'zh'
                ? `${catalogStats.singleConceptPeople} 位人物目前只有 1 个已收录概念；${catalogStats.multiConceptPeople} 位人物关联 2 个或以上。`
                : `${catalogStats.singleConceptPeople} people currently have one catalogued concept; ${catalogStats.multiConceptPeople} link to two or more.`}
            </p>
          </div>
          <aside>
            {locale === 'zh'
              ? '这些数字表示当前目录覆盖，不代表人物的历史重要性或全部贡献。'
              : 'These counts measure current catalog coverage—not historical importance or total output.'}
          </aside>
        </div>
        <ul aria-label={locale === 'zh' ? '概念数分布' : 'Distribution of concepts per person'}>
          {conceptCountDistribution.map((bin) => {
            const percentage = bin.share * 100
            return (
              <li key={bin.conceptCount}>
                <span className="people-distribution__label">
                  {locale === 'zh'
                    ? `${bin.conceptCount} 个概念`
                    : `${bin.conceptCount} concept${bin.conceptCount === 1 ? '' : 's'}`}
                </span>
                <span className="people-distribution__track" aria-hidden="true">
                  <span
                    style={
                      {
                        '--distribution-size': `${(bin.peopleCount / largestBin) * 100}%`,
                      } as CSSProperties
                    }
                  />
                </span>
                <strong>{bin.peopleCount}</strong>
                <small>{percentage.toFixed(1)}%</small>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
