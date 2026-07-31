import { useCallback, useMemo, useSyncExternalStore } from 'react'

export type Route =
  | { name: 'home'; params: URLSearchParams }
  | { name: 'atlas'; params: URLSearchParams }
  | { name: 'paths'; params: URLSearchParams }
  | { name: 'graph'; params: URLSearchParams }
  | { name: 'timeline'; params: URLSearchParams }
  | { name: 'about'; params: URLSearchParams }
  | { name: 'concept'; id: string; params: URLSearchParams }
  | { name: 'person'; id: string; params: URLSearchParams }

const routeListeners = new Set<() => void>()

function emitRouteChange() {
  routeListeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  routeListeners.add(listener)
  window.addEventListener('hashchange', listener)
  window.addEventListener('popstate', listener)

  return () => {
    routeListeners.delete(listener)
    window.removeEventListener('hashchange', listener)
    window.removeEventListener('popstate', listener)
  }
}

function getSnapshot() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function getServerSnapshot() {
  return '/'
}

function stripBasePath(path: string) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (basePath && path.startsWith(`${basePath}/`)) return path.slice(basePath.length)
  if (basePath && path === basePath) return '/'
  return path
}

function currentRouteSource() {
  if (typeof window === 'undefined') return '/'
  return window.location.hash.startsWith('#/')
    ? window.location.hash
    : `${window.location.pathname}${window.location.search}`
}

export function parseRoute(source: string): Route {
  let normalized = source.trim() || '/'
  if (/^https?:\/\//.test(normalized)) {
    const url = new URL(normalized)
    normalized = url.hash.startsWith('#/') ? url.hash : `${url.pathname}${url.search}`
  }
  if (normalized.includes('#/')) normalized = normalized.slice(normalized.indexOf('#/'))
  normalized = stripBasePath(normalized.replace(/^#/, '') || '/')
  const [path, query = ''] = normalized.split('?')
  const params = new URLSearchParams(query)
  const segments = path.split('/').filter(Boolean)
  if (segments[0] === 'zh') {
    segments.shift()
    if (!params.has('lang')) params.set('lang', 'zh')
  }

  if (segments[0] === 'concept' && segments[1]) {
    return { name: 'concept', id: decodeURIComponent(segments[1]), params }
  }
  if (segments[0] === 'person' && segments[1]) {
    return { name: 'person', id: decodeURIComponent(segments[1]), params }
  }
  if (segments[0] === 'atlas') return { name: 'atlas', params }
  if (segments[0] === 'paths') return { name: 'paths', params }
  if (segments[0] === 'graph') return { name: 'graph', params }
  if (segments[0] === 'timeline') return { name: 'timeline', params }
  if (segments[0] === 'about') return { name: 'about', params }
  return { name: 'home', params }
}

function requestedLanguage(params?: URLSearchParams) {
  const nextParams = new URLSearchParams(params)
  if (!nextParams.has('lang') && typeof window !== 'undefined') {
    const currentLanguage = parseRoute(currentRouteSource()).params.get('lang')
    if (currentLanguage === 'zh' || currentLanguage === 'en') {
      nextParams.set('lang', currentLanguage)
    }
  }
  return nextParams
}

export function buildHref(path: string, params?: URLSearchParams) {
  const nextParams = requestedLanguage(params)
  const language = nextParams.get('lang')
  nextParams.delete('lang')
  const basePath = import.meta.env.BASE_URL
  const cleanPath = path.replace(/^\/+|\/+$/g, '')
  const localizedPath = [language === 'zh' ? 'zh' : '', cleanPath].filter(Boolean).join('/')
  const href = `${basePath}${localizedPath}${localizedPath ? '/' : ''}`
  const query = nextParams.toString()
  return `${href}${query ? `?${query}` : ''}`
}

export function routePath(route: Route) {
  if (route.name === 'concept') return `/concept/${encodeURIComponent(route.id)}`
  if (route.name === 'person') return `/person/${encodeURIComponent(route.id)}`
  return route.name === 'home' ? '/' : `/${route.name}`
}

export function localeForRoute(route: Route): 'en' | 'zh' {
  return route.params.get('lang') === 'zh' ? 'zh' : 'en'
}

export function navigate(path: string, params?: URLSearchParams, replace = false) {
  const href = buildHref(path, params)
  if (replace) {
    window.history.replaceState(null, '', href)
  } else {
    window.history.pushState(null, '', href)
  }
  emitRouteChange()
}

export function useHashRoute() {
  const location = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const route = useMemo(
    () => parseRoute(location.includes('#/') ? location.slice(location.indexOf('#/')) : location),
    [location],
  )
  const go = useCallback(
    (path: string, params?: URLSearchParams, replace = false) => navigate(path, params, replace),
    [],
  )

  return { route, go }
}
