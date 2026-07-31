import type { Locale } from '../copy'
import { Brand } from './Brand'

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <Brand />
      <p>
        {locale === 'zh'
          ? '让名字成为理解的入口，而不是阅读的障碍。'
          : 'Let names become an entry point to understanding, not an interruption.'}
      </p>
      <div className="site-footer__links">
        <a href="#/about">{locale === 'zh' ? '收录方法' : 'Methodology'}</a>
        <a
          href="https://github.com/ChaoYue0307/ai-eponym-atlas"
          target="_blank"
          rel="noreferrer"
        >
          {locale === 'zh' ? '参与贡献' : 'Contribute'}
        </a>
        <span>MIT · CC BY 4.0</span>
      </div>
    </footer>
  )
}
