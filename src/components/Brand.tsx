import { buildHref, navigate } from '../hooks/useHashRoute'
import type { Locale } from '../copy'

type BrandProps = {
  compact?: boolean
  locale: Locale
}

export function Brand({ compact = false, locale }: BrandProps) {
  const localeParams = new URLSearchParams({ lang: locale })

  return (
    <a
      className={`brand${compact ? ' brand--compact' : ''}`}
      href={buildHref('/', localeParams)}
      onClick={(event) => {
        event.preventDefault()
        navigate('/', localeParams)
      }}
      aria-label="AI Eponym Atlas home"
    >
      <img
        className="brand__mark"
        src={`${import.meta.env.BASE_URL}brand-mark.png`}
        alt=""
        width="48"
        height="48"
      />
      <span className="brand__name">AI Eponym Atlas</span>
      <span className="brand__zh">AI 人名概念图谱</span>
    </a>
  )
}
