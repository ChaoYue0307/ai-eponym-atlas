import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import GitFork from 'lucide-react/dist/esm/icons/git-fork.mjs'
import type { Locale } from '../copy'
import { concepts, meta, people } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { SectionRule } from './SectionRule'

const principles = [
  {
    id: 'meaning',
    en: 'Meaning before biography',
    zh: '意义先于传记',
    bodyEn:
      'Every entry begins with the question the concept answers, a plain-language label, and a 15-second intuition.',
    bodyZh: '每条记录先回答“它解决什么问题”，再给功能标签与 15 秒直觉。',
  },
  {
    id: 'boundary',
    en: 'Intuition with boundaries',
    zh: '直觉必须带边界',
    bodyEn:
      'Helpful shortcuts are marked as teaching aids. We also state where an analogy stops being mathematically safe.',
    bodyZh: '功能标签会明确标为教学辅助；直觉可能失效的条件也必须写清楚。',
  },
  {
    id: 'history',
    en: 'History without hero mythology',
    zh: '历史不压成英雄神话',
    bodyEn:
      'Discovery, publication, formalization, popularization, and later naming are recorded as different claims.',
    bodyZh: '发现、发表、形式化、推广和后世命名是不同主张，不能混成一个“发明者”。',
  },
  {
    id: 'evidence',
    en: 'Sources over confidence',
    zh: '来源高于自信语气',
    bodyEn:
      'Definitions, attribution, and AI applications require sources suited to each kind of claim.',
    bodyZh: '定义、历史归因与 AI 应用必须分别使用适合该类主张的来源。',
  },
]

const anatomyItems = [
  {
    number: '01',
    label: { en: 'Question', zh: '核心问题' },
    body: {
      en: 'How does every output change when the inputs move slightly?',
      zh: '输入微变时，输出如何变化？',
    },
  },
  {
    number: '02',
    label: { en: 'Plain-language label', zh: '功能标签' },
    body: {
      en: 'A local input-to-output sensitivity map',
      zh: '局部输入到输出的敏感度地图',
    },
  },
  {
    number: '03',
    label: { en: 'Intuition', zh: '直觉' },
    body: {
      en: 'The best local linear approximation of a multivariable map',
      zh: '多变量映射在一点附近的最佳线性近似',
    },
  },
  {
    number: '04',
    label: { en: 'Formal definition', zh: '形式化定义' },
    body: {
      en: 'The matrix containing every first partial derivative',
      zh: '所有一阶偏导组成的矩阵',
    },
  },
  {
    number: '05',
    label: { en: 'AI use', zh: 'AI 用途' },
    body: {
      en: 'Backpropagation, normalizing flows, and robot kinematics',
      zh: '反向传播、归一化流、机器人运动学',
    },
  },
  {
    number: '06',
    label: { en: 'Attribution', zh: '归因' },
    body: {
      en: "Distinguish Jacobi's work from the later matrix terminology",
      zh: '区分 Jacobi 的工作与后世矩阵术语',
    },
  },
] as const

export function AboutPage({ locale }: { locale: Locale }) {
  return (
    <main className="about-page">
      <header className="page-intro about-page__intro">
        <p className="section-number">04 — METHOD</p>
        <h1>
          {locale === 'zh' ? '保留名字，也恢复意义。' : 'Keep the names. Restore their meaning.'}
        </h1>
        <SectionRule />
        <p>
          {locale === 'zh'
            ? '人名保存了学术史，却很少告诉读者术语真正做什么。这个图谱补上缺失的语义层。'
            : 'Eponyms preserve intellectual history, but rarely tell a reader what a term actually does. This atlas adds the missing semantic layer.'}
        </p>
      </header>

      <section className="method-principles" aria-labelledby="principles-title">
        <div className="method-principles__heading">
          <p className="section-number">EDITORIAL PRINCIPLES</p>
          <h2 id="principles-title">
            {locale === 'zh' ? '一条记录如何建立信任' : 'How an entry earns trust'}
          </h2>
        </div>
        <ol>
          {principles.map((principle, index) => (
            <li key={principle.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{locale === 'zh' ? principle.zh : principle.en}</h3>
                <p>{locale === 'zh' ? principle.bodyZh : principle.bodyEn}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="entry-anatomy" aria-labelledby="entry-anatomy-title">
        <div className="entry-anatomy__title">
          <p className="section-number">ENTRY ANATOMY</p>
          <h2 id="entry-anatomy-title">
            {locale === 'zh' ? '从名字到可调用的理解' : 'From a name to usable understanding'}
          </h2>
          <p>
            {locale === 'zh'
              ? '同一套阅读顺序用于所有概念，先快后深。'
              : 'Every concept follows the same path, from fast orientation to deeper evidence.'}
          </p>
        </div>
        <div className="entry-anatomy__example">
          <h3>
            Jacobian matrix <span>/ 雅可比矩阵</span>
          </h3>
          {anatomyItems.map((item) => (
            <div key={item.number}>
              <span>{item.number}</span>
              <strong>{item.label[locale]}</strong>
              <p>{item.body[locale]}</p>
            </div>
          ))}
          <button type="button" onClick={() => navigate('/concept/jacobian-matrix')}>
            {locale === 'zh' ? '阅读完整条目' : 'Read the full entry'}
            <ArrowUpRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="coverage-band">
        <div>
          <p className="section-number">EXPANDED EDITION · {meta.lastUpdated}</p>
          <h2>{locale === 'zh' ? '广泛，但不假装穷尽。' : 'Broad, without pretending to be exhaustive.'}</h2>
          <p>
            {locale === 'zh'
              ? '扩展版兼顾基础概念、专门领域工具与 2020–2026 仍活跃的 AI 用途，并明确记录核查截止日期。'
              : 'The expanded edition balances foundations, specialist tools, and AI uses active in 2020–2026, with an explicit editorial cutoff.'}
          </p>
        </div>
        <dl>
          <div>
            <dt>{people.length}</dt>
            <dd>{locale === 'zh' ? '位人物' : 'people'}</dd>
          </div>
          <div>
            <dt>{concepts.length}</dt>
            <dd>{locale === 'zh' ? '个概念' : 'concepts'}</dd>
          </div>
          <div>
            <dt>{concepts.reduce((sum, concept) => sum + concept.sourceLinks.length, 0)}</dt>
            <dd>{locale === 'zh' ? '条来源' : 'source links'}</dd>
          </div>
        </dl>
      </section>

      <section className="contribute-band">
        <div>
          <p className="section-number">OPEN SOURCE</p>
          <h2>{locale === 'zh' ? '你遇到的下一个名字，可以成为下一条记录。' : 'The next name you meet can become the next entry.'}</h2>
        </div>
        <p>
          {locale === 'zh'
            ? '新增条目需要双语解释、明确归因、具体 AI 用途与可核查来源。贡献规范里有完整模板。'
            : 'New entries need bilingual explanations, careful attribution, concrete AI uses, and verifiable sources. The contribution guide includes the full template.'}
        </p>
        <a
          className="button button--primary"
          href="https://github.com/ChaoYue0307/ai-eponym-atlas"
          target="_blank"
          rel="noreferrer"
        >
          <GitFork aria-hidden="true" />
          {locale === 'zh' ? '在 GitHub 参与贡献' : 'Contribute on GitHub'}
        </a>
      </section>
    </main>
  )
}
