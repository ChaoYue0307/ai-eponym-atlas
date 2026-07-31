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
  return window.location.hash || '#/'
}

function getServerSnapshot() {
  return '#/'
}

export function parseRoute(hash: string): Route {
  const normalized = hash.replace(/^#/, '') || '/'
  const [path, query = ''] = normalized.split('?')
  const params = new URLSearchParams(query)
  const segments = path.split('/').filter(Boolean)

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

export function buildHash(path: string, params?: URLSearchParams) {
  const nextParams = new URLSearchParams(params)
  if (typeof window !== 'undefined' && !nextParams.has('lang')) {
    const currentLanguage = parseRoute(window.location.hash).params.get('lang')
    if (currentLanguage === 'zh' || currentLanguage === 'en') {
      nextParams.set('lang', currentLanguage)
    }
  }
  const query = nextParams.toString()
  return `#${path}${query ? `?${query}` : ''}`
}

export function routePath(route: Route) {
  if (route.name === 'concept') return `/concept/${encodeURIComponent(route.id)}`
  if (route.name === 'person') return `/person/${encodeURIComponent(route.id)}`
  return route.name === 'home' ? '/' : `/${route.name}`
}

export function navigate(path: string, params?: URLSearchParams, replace = false) {
  const hash = buildHash(path, params)
  if (replace) {
    window.history.replaceState(null, '', hash)
    emitRouteChange()
  } else {
    window.location.hash = hash
  }
}

export function useHashRoute() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const route = useMemo(() => parseRoute(hash), [hash])
  const go = useCallback(
    (path: string, params?: URLSearchParams, replace = false) => navigate(path, params, replace),
    [],
  )

  return { route, go }
}
