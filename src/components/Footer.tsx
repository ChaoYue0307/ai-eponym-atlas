import type { Locale } from '../copy'
import { Brand } from './Brand'

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <Brand />
      <p>
        {locale === 'zh'
          ? '读懂 AI 人名术语背后的思想。'
          : 'Understand the ideas behind the names in AI.'}
      </p>
      <div className="site-footer__links">
        <a href="#/about">{locale === 'zh' ? '阅读指南' : 'How to read'}</a>
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
        <span>MIT · CC BY 4.0</span>
      </div>
    </footer>
  )
}
