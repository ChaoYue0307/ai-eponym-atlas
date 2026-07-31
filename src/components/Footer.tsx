import type { Locale } from '../copy'
import { buildHref } from '../hooks/useHashRoute'
import { Brand } from './Brand'

export function Footer({ locale }: { locale: Locale }) {
  const rankingHref = buildHref(
    '/atlas',
    new URLSearchParams({ view: 'people', layout: 'ranking', lang: locale }),
  )
  const aboutHref = buildHref('/about', new URLSearchParams({ lang: locale }))

  return (
    <footer className="site-footer">
      <Brand locale={locale} />
      <p>
        {locale === 'zh'
          ? '读懂 AI 人名术语背后的思想。'
          : 'Understand the ideas behind the names in AI.'}
      </p>
      <div className="site-footer__links">
        <a href={rankingHref}>
          {locale === 'zh' ? '人物概念排名' : 'Coverage ranking'}
        </a>
        <a href={aboutHref}>{locale === 'zh' ? '阅读指南' : 'How to read'}</a>
        <a
          href="https://github.com/ChaoYue0307/ai-eponym-atlas"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span>
          {locale === 'zh'
            ? '数学 · 历史 · 现代 AI'
            : 'Mathematics · History · Modern AI'}
        </span>
        <a
          href="https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/LICENSE"
          target="_blank"
          rel="license noreferrer"
        >
          {locale === 'zh' ? '代码：MIT' : 'Code: MIT'}
        </a>
        <a
          href="https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/CONTENT_LICENSE"
          target="_blank"
          rel="license noreferrer"
        >
          {locale === 'zh' ? '内容：CC BY 4.0' : 'Content: CC BY 4.0'}
        </a>
      </div>
    </footer>
  )
}
