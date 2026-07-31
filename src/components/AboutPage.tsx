import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import type { Locale } from '../copy'
import { catalogStats, meta } from '../data/catalog'
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
    en: 'Intuition, then precision',
    zh: '先直觉，后精确',
    bodyEn:
      'Use the intuition to get oriented, then compare it with the formal definition rather than treating it as a substitute.',
    bodyZh: '用直觉快速定位，再与形式化定义对照，而不是把类比当作定义本身。',
  },
  {
    id: 'history',
    en: 'Attribution with context',
    zh: '带语境的命名归因',
    bodyEn:
      'Read how a person\'s work connects to the term, including later extensions or naming that should not be mistaken for sole invention.',
    bodyZh: '理解人物工作与术语之间的联系，并区分后世延伸或命名与独立发明。',
  },
  {
    id: 'evidence',
    en: 'Sources for deeper checking',
    zh: '继续核查的来源',
    bodyEn:
      'Each concept links at least two references. A source may support only one part of an entry, so follow the relevant link before relying on a claim.',
    bodyZh: '每个概念至少链接两条参考来源；单个来源可能只支持条目的一部分，重要主张请沿相关链接继续核查。',
  },
]

const editorialStandards = [
  {
    id: 'scope',
    number: '01',
    title: { en: 'A defined scope', zh: '明确的收录边界' },
    body: {
      en: 'Entries cover terms wholly or partly named after people when they have a stable technical meaning and a concrete use—or important foundational role—in AI. The people include mathematicians, statisticians, physicists, engineers, computer scientists, and others.',
      zh: '条目收录全部或部分以人物命名、具有稳定技术含义，并在 AI 中有具体用途或重要基础作用的术语。相关人物包括数学家、统计学家、物理学家、工程师、计算机科学家等。',
    },
    href: 'https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/docs/COVERAGE.md',
    link: { en: 'Read the coverage policy', zh: '查看收录与时效性说明' },
  },
  {
    id: 'evidence',
    number: '02',
    title: { en: 'Evidence with boundaries', zh: '有边界的证据' },
    body: {
      en: 'Every concept includes at least two references. Definition, naming history, implementation, and modern AI use are different claims; one convenient source should not be assumed to prove them all.',
      zh: '每个概念至少包含两条参考来源。定义、命名历史、实现与现代 AI 用途是不同主张，不能默认一条来源能够同时证明全部内容。',
    },
    href: 'https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/docs/COVERAGE.md#evidence-floor--%E8%AF%81%E6%8D%AE%E5%BA%95%E7%BA%BF',
    link: { en: 'See the evidence standard', zh: '查看证据标准' },
  },
  {
    id: 'portraits',
    number: '03',
    title: { en: 'Portraits without guesswork', zh: '不猜测人物长相' },
    body: {
      en: 'A historical portrait appears only when both the person and the image\'s reuse terms can be checked. Otherwise initials are shown; generated historical likenesses are not used.',
      zh: '只有人物身份与图片再利用条款都可核验时才展示历史肖像；否则使用姓名首字母，且不生成历史人物形象。',
    },
    href: 'https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/docs/PORTRAITS.md',
    link: { en: 'Read the portrait policy', zh: '查看肖像来源与许可' },
  },
  {
    id: 'corrections',
    number: '04',
    title: { en: 'Corrections stay open', zh: '欢迎有依据的更正' },
    body: {
      en: 'If a definition, attribution, translation, date, source, or image needs correction, identify the page and include a supporting reference.',
      zh: '如果定义、归因、翻译、日期、来源或图片需要更正，请注明相关页面并附上支持材料。',
    },
    href: 'https://github.com/ChaoYue0307/ai-eponym-atlas/issues/new?template=correction.yml',
    link: { en: 'Suggest a correction', zh: '提出更正建议' },
  },
] as const

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
          <span>05 —</span>
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
              ? `从核心数学读到专门工具与近年的 AI 应用，每个条目都提供可继续核查的参考链接。当前目录快照日期为 ${meta.lastUpdated}。`
              : `Move from core mathematics to specialist tools and recent AI applications, with references ready for further checking. This catalog snapshot is dated ${meta.lastUpdated}.`}
          </p>
        </div>
        <dl>
          <div>
            <dt>{catalogStats.people}</dt>
            <dd>{locale === 'zh' ? '位人物' : 'people'}</dd>
          </div>
          <div>
            <dt>{catalogStats.concepts}</dt>
            <dd>{locale === 'zh' ? '个概念' : 'concepts'}</dd>
          </div>
          <div>
            <dt>{catalogStats.sourceCitations}</dt>
            <dd>{locale === 'zh' ? '条引用链接' : 'citation links'}</dd>
          </div>
        </dl>
      </section>

      <section className="editorial-standards" aria-labelledby="editorial-standards-title">
        <div className="editorial-standards__heading">
          <p className="section-number">
            <span className="section-number__emoji" aria-hidden="true">🛡️</span>
            <span>{locale === 'zh' ? '阅读证据' : 'READ THE EVIDENCE'}</span>
          </p>
          <h2 id="editorial-standards-title">
            {locale === 'zh' ? '知道哪些内容可以核查。' : 'Know what you can verify.'}
          </h2>
          <p>
            {locale === 'zh'
              ? '请把数学定义、命名归因、AI 用途与肖像来源作为不同主张阅读，并核对与每项主张相关的来源。'
              : 'Treat mathematical definitions, naming attribution, AI uses, and portrait provenance as separate claims, and check the source relevant to each.'}
          </p>
        </div>
        <div className="editorial-standards__list">
          {editorialStandards.map((standard) => (
            <article className="editorial-standard" key={standard.id}>
              <span className="editorial-standard__number" aria-hidden="true">
                {standard.number}
              </span>
              <div className="editorial-standard__content">
                <h3>{standard.title[locale]}</h3>
                <p>{standard.body[locale]}</p>
                <a
                  className="editorial-standard__link"
                  href={standard.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {standard.link[locale]}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
