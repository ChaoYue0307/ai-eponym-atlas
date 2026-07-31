import GitFork from 'lucide-react/dist/esm/icons/git-fork.mjs'
import Menu from 'lucide-react/dist/esm/icons/menu.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import { useEffect, useState } from 'react'
import type { Locale } from '../copy'
import { copy } from '../copy'
import type { Route } from '../hooks/useHashRoute'
import { buildHref, navigate } from '../hooks/useHashRoute'
import { Brand } from './Brand'

type HeaderProps = {
  locale: Locale
  route: Route
  onLocaleChange: (locale: Locale) => void
}

const navItems = [
  { route: 'atlas', path: '/atlas' },
  { route: 'paths', path: '/paths' },
  { route: 'graph', path: '/graph' },
  { route: 'timeline', path: '/timeline' },
  { route: 'about', path: '/about' },
] as const

export function Header({ locale, route, onLocaleChange }: HeaderProps) {
  const t = copy[locale]
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [route.name])

  return (
    <header className="site-header">
      <Brand compact locale={locale} />
      <button
        className="icon-button mobile-menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={
          locale === 'zh'
            ? open
              ? '关闭菜单'
              : '打开菜单'
            : open
              ? 'Close menu'
              : 'Open menu'
        }
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="primary-navigation"
        className={`primary-nav${open ? ' primary-nav--open' : ''}`}
        aria-label={locale === 'zh' ? '主导航' : 'Primary'}
      >
        {navItems.map((item) => (
          <a
            key={item.route}
            className={
              route.name === item.route ||
              (item.route === 'atlas' && (route.name === 'concept' || route.name === 'person'))
                ? 'is-active'
                : ''
            }
            aria-current={
              route.name === item.route ||
              (item.route === 'atlas' && (route.name === 'concept' || route.name === 'person'))
                ? 'page'
                : undefined
            }
            href={buildHref(item.path, new URLSearchParams({ lang: locale }))}
            onClick={(event) => {
              event.preventDefault()
              navigate(item.path, new URLSearchParams({ lang: locale }))
            }}
          >
            {t.nav[item.route]}
          </a>
        ))}
        <button
          className="locale-toggle"
          type="button"
          onClick={() => onLocaleChange(locale === 'zh' ? 'en' : 'zh')}
          aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          <span className={locale === 'zh' ? 'is-current' : ''}>中文</span>
          <span aria-hidden="true"> / </span>
          <span className={locale === 'en' ? 'is-current' : ''}>EN</span>
        </button>
        <a
          className="github-link"
          href="https://github.com/ChaoYue0307/ai-eponym-atlas"
          target="_blank"
          rel="noreferrer"
          aria-label={
            locale === 'zh'
              ? '在 GitHub 查看 AI Eponym Atlas'
              : 'View AI Eponym Atlas on GitHub'
          }
        >
          <GitFork aria-hidden="true" />
          {t.nav.github}
        </a>
      </nav>
    </header>
  )
}
