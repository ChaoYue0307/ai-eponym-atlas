import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import GitFork from 'lucide-react/dist/esm/icons/git-fork.mjs'
import type { Locale } from '../copy'
import { concepts, meta, people } from '../data/catalog'
import { navigate } from '../hooks/useHashRoute'
import { SectionRule } from './SectionRule'

const principles = [
  {
    id: 'meaning',
    en: 'What it does first',
    zh: '先看它做什么',
    bodyEn:
      'Begin with the question the concept answers, its plain-language meaning, and a 15-second intuition.',
    bodyZh: '先看它回答什么问题，再用一句话含义和 15 秒直觉快速建立理解。',
  },
  {
    id: 'boundary',
    en: 'Intuition and its limits',
    zh: '直觉与它的边界',
    bodyEn:
      'Use the shortcut to get oriented, then check where the analogy stops matching the mathematics.',
    bodyZh: '用直觉快速入门，再查看类比在什么条件下不再成立。',
  },
  {
    id: 'history',
    en: 'A fuller history',
    zh: '更完整的历史',
    bodyEn:
      'See discovery, publication, formalization, popularization, and later naming as distinct parts of the story.',
    bodyZh: '把发现、发表、形式化、推广与后世命名作为不同的历史环节来理解。',
  },
  {
    id: 'evidence',
    en: 'Evidence you can follow',
    zh: '可以继续追查的证据',
    bodyEn:
      'Follow separate sources for the formal definition, historical attribution, and modern AI uses.',
    bodyZh: '形式化定义、历史归属与现代 AI 用途分别链接到相应来源。',
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
        <p className="section-number">04 — {locale === 'zh' ? '阅读指南' : 'HOW TO READ'}</p>
        <h1>
          {locale === 'zh' ? '看懂名字本身没有说出的内容。' : 'Understand what the name cannot tell you.'}
        </h1>
        <SectionRule />
        <p>
          {locale === 'zh'
            ? '每个条目都把人名术语连回它回答的问题、背后的数学、历史脉络与 AI 用途。'
            : 'Each entry connects a named term to the question it answers, the mathematics behind it, its history, and its uses in AI.'}
        </p>
      </header>

      <section className="method-principles" aria-labelledby="principles-title">
        <div className="method-principles__heading">
          <p className="section-number">{locale === 'zh' ? '你会读到什么' : "WHAT YOU'LL FIND"}</p>
          <h2 id="principles-title">
            {locale === 'zh' ? '每个概念都按清晰的路径展开' : 'A clear path through every concept'}
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
          <p className="section-number">{locale === 'zh' ? '如何阅读概念' : 'HOW TO READ A CONCEPT'}</p>
          <h2 id="entry-anatomy-title">
            {locale === 'zh' ? '先建立直觉，再深入定义与证据' : 'Start with intuition, then go deeper'}
          </h2>
          <p>
            {locale === 'zh'
              ? '所有概念都按同一顺序展开，方便你快速定位，也能继续深入。'
              : 'Every concept follows the same sequence, so you can orient quickly and continue as far as you need.'}
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
          <p className="section-number">{locale === 'zh' ? '收录范围' : 'COVERAGE'} · {meta.lastUpdated}</p>
          <h2>{locale === 'zh' ? '从基础概念到现代 AI 应用。' : 'From foundations to modern AI applications.'}</h2>
          <p>
            {locale === 'zh'
              ? '涵盖核心数学、专门工具与 2020–2026 年间的 AI 应用；上方日期表示本版内容的最近核查时间。'
              : 'Coverage spans core mathematics, specialist tools, and AI work from 2020–2026; the date above shows when this edition was last reviewed.'}
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
