import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HomeGuide } from './components/HomeGuide'
import type { Locale } from './copy'
import { conceptsById, meta, peopleById } from './data/catalog'
import { navigate, parseRoute, routePath, useHashRoute } from './hooks/useHashRoute'

const AboutPage = lazy(() =>
  import('./components/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const AtlasExplorer = lazy(() =>
  import('./components/AtlasExplorer').then((module) => ({ default: module.AtlasExplorer })),
)
const ConceptDetail = lazy(() =>
  import('./components/ConceptDetail').then((module) => ({ default: module.ConceptDetail })),
)
const GraphExplorer = lazy(() =>
  import('./components/GraphExplorer').then((module) => ({ default: module.GraphExplorer })),
)
const LearningPathsPage = lazy(() =>
  import('./components/LearningPathsPage').then((module) => ({ default: module.LearningPathsPage })),
)
const PersonDetail = lazy(() =>
  import('./components/PersonDetail').then((module) => ({ default: module.PersonDetail })),
)
const TimelineView = lazy(() =>
  import('./components/TimelineView').then((module) => ({ default: module.TimelineView })),
)

const LOCALE_KEY = 'ai-eponym-atlas:locale'
const SITE_ROOT = 'https://chaoyue0307.github.io/ai-eponym-atlas'

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

function getInitialLocale(): Locale {
  const requested = parseRoute(window.location.hash).params.get('lang')
  if (requested === 'zh' || requested === 'en') return requested
  const stored = window.localStorage.getItem(LOCALE_KEY)
  if (stored === 'zh' || stored === 'en') return stored
  return navigator.language.toLocaleLowerCase().startsWith('zh') ? 'zh' : 'en'
}

function App() {
  const { route } = useHashRoute()
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    window.localStorage.setItem(LOCALE_KEY, locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  useEffect(() => {
    const requested = route.params.get('lang')
    if ((requested === 'zh' || requested === 'en') && requested !== locale) {
      setLocale(requested)
    }
  }, [locale, route])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    let title: string
    let description: string
    if (route.name === 'concept') {
      const concept = conceptsById.get(route.id)
      title = concept
        ? `${locale === 'zh' ? concept.zhTerm : concept.term} · AI Eponym Atlas`
        : 'Concept · AI Eponym Atlas'
      description = concept
        ? `${concept.functionNickname[locale]} — ${concept.question[locale]}`
        : meta.description[locale]
    } else if (route.name === 'person') {
      const person = peopleById.get(route.id)
      title = person
        ? `${locale === 'zh' ? person.zhName : person.name} · AI Eponym Atlas`
        : 'Person · AI Eponym Atlas'
      description = person?.summary[locale] ?? meta.description[locale]
    } else {
      const routeTitles = {
        home: 'AI Eponym Atlas · AI 人名概念图谱',
        atlas: locale === 'zh' ? '探索图谱 · AI Eponym Atlas' : 'Explore · AI Eponym Atlas',
        paths: locale === 'zh' ? '学习路径 · AI Eponym Atlas' : 'Learning paths · AI Eponym Atlas',
        graph: locale === 'zh' ? '关系图谱 · AI Eponym Atlas' : 'Graph · AI Eponym Atlas',
        timeline: locale === 'zh' ? '时间线 · AI Eponym Atlas' : 'Timeline · AI Eponym Atlas',
        about: locale === 'zh' ? '阅读指南 · AI Eponym Atlas' : 'How to read · AI Eponym Atlas',
      } as const
      title = routeTitles[route.name]
      description = meta.description[locale]
    }

    const path = routePath(route)
    const localizedPath = locale === 'zh' ? (path === '/' ? '/zh' : `/zh${path}`) : path
    const canonical = `${SITE_ROOT}${localizedPath}${localizedPath === '/' ? '' : '/'}`
    document.title = title
    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:url"]', canonical)
    setMetaContent('meta[property="og:locale"]', locale === 'zh' ? 'zh_CN' : 'en_US')
    setMetaContent('meta[name="twitter:title"]', title)
    setMetaContent('meta[name="twitter:description"]', description)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical)
  }, [locale, route])

  let content
  switch (route.name) {
    case 'atlas':
      content = (
        <main>
          <AtlasExplorer locale={locale} params={route.params} />
        </main>
      )
      break
    case 'graph':
      content = <GraphExplorer locale={locale} params={route.params} />
      break
    case 'paths':
      content = <LearningPathsPage locale={locale} />
      break
    case 'timeline':
      content = <TimelineView locale={locale} />
      break
    case 'about':
      content = <AboutPage locale={locale} />
      break
    case 'concept':
      content = (
        <main className="detail-page-shell">
          <ConceptDetail conceptId={route.id} locale={locale} params={route.params} />
        </main>
      )
      break
    case 'person':
      content = <PersonDetail personId={route.id} locale={locale} />
      break
    case 'home':
    default:
      content = (
        <main>
          <Hero locale={locale} />
          <HomeGuide locale={locale} />
        </main>
      )
      break
  }

  const showFooter = route.name !== 'concept' && route.name !== 'person'
  const changeLocale = (nextLocale: Locale) => {
    const nextParams = new URLSearchParams(route.params)
    nextParams.set('lang', nextLocale)
    setLocale(nextLocale)
    navigate(routePath(route), nextParams, true)
  }

  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          const target = document.getElementById('main-content')
          target?.scrollIntoView()
          window.requestAnimationFrame(() => target?.focus({ preventScroll: true }))
        }}
      >
        {locale === 'zh' ? '跳到主要内容' : 'Skip to content'}
      </a>
      <Header locale={locale} route={route} onLocaleChange={changeLocale} />
      <div id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <main className="route-loading" aria-live="polite">
              {locale === 'zh' ? '正在打开…' : 'Opening…'}
            </main>
          }
        >
          {content}
        </Suspense>
      </div>
      {showFooter ? <Footer locale={locale} /> : null}
    </div>
  )
}

export default App
