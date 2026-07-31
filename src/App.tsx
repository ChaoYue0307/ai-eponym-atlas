import { useEffect, useState } from 'react'
import { AboutPage } from './components/AboutPage'
import { AtlasExplorer } from './components/AtlasExplorer'
import { ConceptDetail } from './components/ConceptDetail'
import { Footer } from './components/Footer'
import { GraphExplorer } from './components/GraphExplorer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PersonDetail } from './components/PersonDetail'
import { TimelineView } from './components/TimelineView'
import type { Locale } from './copy'
import { conceptsById, peopleById } from './data/catalog'
import { useHashRoute } from './hooks/useHashRoute'

const LOCALE_KEY = 'ai-eponym-atlas:locale'

function getInitialLocale(): Locale {
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
    window.scrollTo({ top: 0, behavior: 'instant' })

    if (route.name === 'concept') {
      const concept = conceptsById.get(route.id)
      document.title = concept
        ? `${concept.term} · AI Eponym Atlas`
        : 'Concept · AI Eponym Atlas'
      return
    }
    if (route.name === 'person') {
      const person = peopleById.get(route.id)
      document.title = person ? `${person.name} · AI Eponym Atlas` : 'Person · AI Eponym Atlas'
      return
    }
    const routeTitles = {
      home: 'AI Eponym Atlas · AI 人名概念图谱',
      atlas: locale === 'zh' ? '探索图谱 · AI Eponym Atlas' : 'Explore · AI Eponym Atlas',
      graph: locale === 'zh' ? '关系图谱 · AI Eponym Atlas' : 'Graph · AI Eponym Atlas',
      timeline: locale === 'zh' ? '时间线 · AI Eponym Atlas' : 'Timeline · AI Eponym Atlas',
      about: locale === 'zh' ? '阅读指南 · AI Eponym Atlas' : 'How to read · AI Eponym Atlas',
    } as const
    document.title = routeTitles[route.name]
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
    case 'timeline':
      content = <TimelineView locale={locale} />
      break
    case 'about':
      content = <AboutPage locale={locale} />
      break
    case 'concept':
      content = (
        <main className="detail-page-shell">
          <ConceptDetail conceptId={route.id} locale={locale} />
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
          <AtlasExplorer locale={locale} homePreview />
        </main>
      )
      break
  }

  const showFooter = route.name !== 'concept' && route.name !== 'person'

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
      <Header locale={locale} route={route} onLocaleChange={setLocale} />
      <div id="main-content" tabIndex={-1}>
        {content}
      </div>
      {showFooter ? <Footer locale={locale} /> : null}
    </div>
  )
}

export default App
