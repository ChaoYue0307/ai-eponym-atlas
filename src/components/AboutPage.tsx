import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
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
      'Follow sources for the formal definition, the history behind the name, and modern AI uses.',
    bodyZh: '形式化定义、名字背后的历史与现代 AI 用途都附有可继续查阅的来源。',
  },
]

const anatomyItems = [
  {
    number: '01',
    emoji: '❓',
    label: { en: 'Question', zh: '核心问题' },
    body: {
      en: 'How does every output change when the inputs move slightly?',
      zh: '输入微变时，输出如何变化？',
    },
  },
  {
    number: '02',
    emoji: '🏷️',
    label: { en: 'Plain-language label', zh: '功能标签' },
    body: {
      en: 'A local input-to-output sensitivity map',
      zh: '局部输入到输出的敏感度地图',
    },
  },
  {
    number: '03',
    emoji: '💡',
    label: { en: 'Intuition', zh: '直觉' },
    body: {
      en: 'The best local linear approximation of a multivariable map',
      zh: '多变量映射在一点附近的最佳线性近似',
    },
  },
  {
    number: '04',
    emoji: '∑',
    label: { en: 'Formal definition', zh: '形式化定义' },
    body: {
      en: 'The matrix containing every first partial derivative',
      zh: '所有一阶偏导组成的矩阵',
    },
  },
  {
    number: '05',
    emoji: '🤖',
    label: { en: 'AI use', zh: 'AI 用途' },
    body: {
      en: 'Backpropagation, normalizing flows, and robot kinematics',
      zh: '反向传播、归一化流、机器人运动学',
    },
  },
  {
    number: '06',
    emoji: '🕰️',
    label: { en: 'Name & history', zh: '名字与历史' },
    body: {
      en: "See how Jacobi's work relates to the later matrix terminology",
      zh: '理解 Jacobi 的工作如何与后来的矩阵术语相连',
    },
  },
] as const

export function AboutPage({ locale }: { locale: Locale }) {
  return (
    <main className="about-page">
      <header className="page-intro about-page__intro">
        <p className="section-number">
          <span>04 —</span>
          <span className="section-number__emoji" aria-hidden="true">🧭</span>
          <span>{locale === 'zh' ? '阅读指南' : 'HOW TO READ'}</span>
        </p>
        <h1>
          {locale === 'zh' ? '看懂名字本身没有说出的内容。' : 'Understand what the name cannot tell you.'}
        </h1>
        <SectionRule />
        <p>
          {locale === 'zh'
            ? '先看人名术语解决什么问题，再理解背后的数学、历史脉络与 AI 用途。'
            : 'Start with the question a named term answers, then move through its mathematics, history, and uses in AI.'}
        </p>
      </header>

      <section className="method-principles" aria-labelledby="principles-title">
        <div className="method-principles__heading">
          <p className="section-number">
            <span className="section-number__emoji" aria-hidden="true">🧠</span>
            <span>{locale === 'zh' ? '你会读到什么' : "WHAT YOU'LL FIND"}</span>
          </p>
          <h2 id="principles-title">
            {locale === 'zh'
              ? '把陌生人名变成可用的概念'
              : 'Turn an unfamiliar name into a usable idea'}
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
          <p className="section-number">
            <span className="section-number__emoji" aria-hidden="true">🧩</span>
            <span>{locale === 'zh' ? '分层理解一个概念' : 'READ A CONCEPT IN LAYERS'}</span>
          </p>
          <h2 id="entry-anatomy-title">
            {locale === 'zh'
              ? '先问问题，需要时再看公式'
              : 'Question first. Formula when you need it.'}
          </h2>
          <p>
            {locale === 'zh'
              ? '从核心问题与直觉出发，再深入定义、历史、AI 用途与来源。'
              : 'Move from the question and intuition to the definition, history, AI uses, and sources.'}
          </p>
        </div>
        <div className="entry-anatomy__example">
          <h3>
            Jacobian matrix <span>/ 雅可比矩阵</span>
          </h3>
          {anatomyItems.map((item) => (
            <div key={item.number}>
              <span>{item.number}</span>
              <strong>
                <span className="entry-anatomy__emoji" aria-hidden="true">{item.emoji}</span>
                {item.label[locale]}
              </strong>
              <p>{item.body[locale]}</p>
            </div>
          ))}
          <button type="button" onClick={() => navigate('/concept/jacobian-matrix')}>
            {locale === 'zh' ? '探索雅可比矩阵' : 'Explore the Jacobian matrix'}
            <ArrowUpRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="coverage-band">
        <div>
          <p className="section-number">
            <span className="section-number__emoji" aria-hidden="true">🗺️</span>
            <span>{locale === 'zh' ? '探索范围' : 'EXPLORE THE RANGE'}</span>
          </p>
          <h2>
            {locale === 'zh'
              ? '从基础数学走向现代 AI。'
              : 'From foundational mathematics to modern AI.'}
          </h2>
          <p>
            {locale === 'zh'
              ? `从核心数学读到专门工具与近年的 AI 应用，需要深入时可继续查阅参考来源。来源与活跃 AI 用途核查至 ${meta.lastUpdated}。`
              : `Move from core mathematics to specialist tools and recent AI applications, with references ready when you want to go deeper. Sources and active AI uses reviewed through ${meta.lastUpdated}.`}
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
            <dd>{locale === 'zh' ? '条参考来源' : 'references'}</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
