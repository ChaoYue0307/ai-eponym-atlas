import { lazy, Suspense, useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import routeMetadata from '../content/route-metadata.json'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HomeGuide } from './components/HomeGuide'
import type { Locale } from './copy'
import { conceptsById, meta, peopleById } from './data/catalog'
import { localeForRoute, navigate, parseRoute, routePath, useHashRoute } from './hooks/useHashRoute'

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

const SITE_ROOT = 'https://chaoyue0307.github.io/ai-eponym-atlas'
const CREATOR_ID = `${SITE_ROOT}/#chaoyue-he`
const WEBSITE_ID = `${SITE_ROOT}/#website`
const ATLAS_ID = `${SITE_ROOT}/#atlas`
const CONTENT_LICENSE = 'https://creativecommons.org/licenses/by/4.0/'

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

function getInitialLocale(): Locale {
  return localeForRoute(parseRoute(window.location.href))
}

function trimMetaDescription(value: string, locale: Locale) {
  const limit = locale === 'zh' ? 90 : 160
  if (value.length <= limit) return value
  const clipped = value.slice(0, limit - 1)
  const boundary = locale === 'zh' ? clipped.length : clipped.lastIndexOf(' ')
  return `${clipped.slice(0, Math.max(boundary, Math.floor(limit * 0.75))).trim()}…`
}

function localizedCanonical(locale: Locale, path: string) {
  const routeSuffix = path === '/' ? '' : path
  return `${SITE_ROOT}${locale === 'zh' ? '/zh' : ''}${routeSuffix}/`
}

function schemaYear(value: string | null) {
  return value && /^\d{4}$/.test(value) ? value : undefined
}

function App() {
  const { route } = useHashRoute()
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  useEffect(() => {
    const requestedLocale = localeForRoute(route)
    if (requestedLocale !== locale) setLocale(requestedLocale)
  }, [locale, route])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    let title: string
    let description: string
    let pageType = 'website'
    let mainEntity: Record<string, unknown> | undefined
    if (route.name === 'concept') {
      const concept = conceptsById.get(route.id)
      title = concept
        ? locale === 'zh'
          ? `${concept.zhTerm}：含义与 AI 应用 · AI 人名概念图谱`
          : `${concept.term}: Meaning and AI Uses · AI Eponym Atlas`
        : 'Concept · AI Eponym Atlas'
      description = concept
        ? trimMetaDescription(
            locale === 'zh'
              ? `${concept.functionNickname.zh}——${concept.question.zh}了解其定义、命名来源、历史与 AI 应用。`
              : `${concept.functionNickname.en} — ${concept.question.en} Learn its definition, namesake, history, and uses in AI.`,
            locale,
          )
        : meta.description[locale]
      pageType = 'article'
      if (concept) {
        mainEntity = {
          '@type': 'DefinedTerm',
          '@id': `${localizedCanonical(locale, `/concept/${concept.id}`)}#term`,
          name: locale === 'zh' ? concept.zhTerm : concept.term,
          alternateName: locale === 'zh' ? concept.term : concept.zhTerm,
          description,
          identifier: concept.id,
          inDefinedTermSet: { '@id': ATLAS_ID },
          citation: concept.sourceLinks.map((source) => source.url),
        }
      }
    } else if (route.name === 'person') {
      const person = peopleById.get(route.id)
      title = person
        ? locale === 'zh'
          ? `${person.zhName}：AI 中的人名概念 · AI 人名概念图谱`
          : `${person.name}: Named Concepts in AI · AI Eponym Atlas`
        : 'Person · AI Eponym Atlas'
      const linkedTerms = person?.concepts
        .slice(0, 3)
        .map((conceptId) => conceptsById.get(conceptId))
        .filter((concept) => concept !== undefined)
        .map((concept) => (locale === 'zh' ? concept.zhTerm : concept.term))
      description = person
        ? trimMetaDescription(
            `${person.summary[locale]} ${
              locale === 'zh'
                ? `继续了解${linkedTerms?.join('、')}等相关概念及其 AI 应用。`
                : `Explore ${linkedTerms?.join(', ')} and their uses in AI.`
            }`,
            locale,
          )
        : meta.description[locale]
      pageType = 'profile'
      if (person) {
        mainEntity = {
          '@type': 'Person',
          '@id': `${localizedCanonical(locale, `/person/${person.id}`)}#person`,
          name: locale === 'zh' ? person.zhName : person.name,
          alternateName: locale === 'zh' ? person.name : person.zhName,
          description,
          birthDate: schemaYear(person.born),
          deathDate: schemaYear(person.died),
          sameAs: person.profileUrl ? [person.profileUrl] : undefined,
          image: person.portrait
            ? {
                '@type': 'ImageObject',
                contentUrl: `${SITE_ROOT}/${person.portrait.file}`,
                creditText: person.portrait.creator,
                license: person.portrait.licenseUrl,
                acquireLicensePage: person.portrait.sourceUrl,
              }
            : undefined,
        }
      }
    } else {
      if (route.name === 'home') {
        title =
          locale === 'zh'
            ? 'AI 人名概念图谱 — 读懂 AI 人名术语背后的思想'
            : 'AI Eponym Atlas — Mathematical Concepts Behind AI'
        description = meta.description[locale]
      } else {
        const routeMeta = routeMetadata[route.name][locale]
        title = `${routeMeta.title} · ${locale === 'zh' ? 'AI 人名概念图谱' : 'AI Eponym Atlas'}`
        description = routeMeta.description
        pageType = 'website'
      }
    }

    const path = routePath(route)
    const canonical = localizedCanonical(locale, path)
    const englishUrl = localizedCanonical('en', path)
    const chineseUrl = localizedCanonical('zh', path)
    document.title = title
    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:url"]', canonical)
    setMetaContent('meta[property="og:locale"]', locale === 'zh' ? 'zh_CN' : 'en_US')
    setMetaContent('meta[property="og:locale:alternate"]', locale === 'zh' ? 'en_US' : 'zh_CN')
    setMetaContent('meta[property="og:type"]', pageType)
    setMetaContent('meta[name="twitter:title"]', title)
    setMetaContent('meta[name="twitter:description"]', description)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector<HTMLLinkElement>('#alternate-en')?.setAttribute('href', englishUrl)
    document.querySelector<HTMLLinkElement>('#alternate-zh')?.setAttribute('href', chineseUrl)
    document.querySelector<HTMLLinkElement>('#alternate-default')?.setAttribute('href', englishUrl)

    const structuredData =
      route.name === 'home'
        ? {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': WEBSITE_ID,
                name: 'AI Eponym Atlas',
                alternateName: 'AI 人名概念图谱',
                url: `${SITE_ROOT}/`,
                description,
                inLanguage: ['en', 'zh-CN'],
                isAccessibleForFree: true,
                mainEntity: { '@id': ATLAS_ID },
                creator: { '@id': CREATOR_ID },
              },
              {
                '@type': 'DefinedTermSet',
                '@id': ATLAS_ID,
                name: 'AI Eponym Atlas',
                alternateName: 'AI 人名概念图谱',
                url: `${SITE_ROOT}/`,
                description: meta.description[locale],
                inLanguage: ['en', 'zh-CN'],
                dateModified: meta.lastUpdated,
                license: CONTENT_LICENSE,
                creator: { '@id': CREATOR_ID },
              },
              { '@type': 'Person', '@id': CREATOR_ID, name: 'Chaoyue He' },
            ],
          }
        : {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': route.name === 'person' ? 'ProfilePage' : 'WebPage',
                '@id': `${canonical}#webpage`,
                url: canonical,
                name: title,
                description,
                inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
                dateModified: meta.lastUpdated,
                isPartOf: { '@id': WEBSITE_ID },
                license: CONTENT_LICENSE,
                creator: { '@id': CREATOR_ID },
                mainEntity: mainEntity ? { '@id': mainEntity['@id'] } : undefined,
              },
              ...(mainEntity ? [mainEntity] : []),
              { '@type': 'Person', '@id': CREATOR_ID, name: 'Chaoyue He' },
            ],
          }
    const structuredDataElement = document.querySelector<HTMLScriptElement>('#structured-data')
    if (structuredDataElement) structuredDataElement.textContent = JSON.stringify(structuredData)
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

  const handleInternalNavigation = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    const target = event.target
    if (!(target instanceof Element)) return
    const anchor = target.closest('a[href]')
    const href = anchor?.getAttribute('href')
    if (!anchor || !href || anchor.getAttribute('target') || anchor.hasAttribute('download')) return
    const url = new URL(href, window.location.href)
    const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
    if (url.origin !== window.location.origin || !url.pathname.startsWith(baseUrl.pathname)) return
    if (url.hash && !url.hash.startsWith('#/')) return
    const nextRoute = parseRoute(url.toString())
    event.preventDefault()
    navigate(routePath(nextRoute), nextRoute.params)
  }

  return (
    <div className="app-shell" onClick={handleInternalNavigation}>
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
