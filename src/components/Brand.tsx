import { navigate } from '../hooks/useHashRoute'

type BrandProps = {
  compact?: boolean
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <a
      className={`brand${compact ? ' brand--compact' : ''}`}
      href="#/"
      onClick={(event) => {
        event.preventDefault()
        navigate('/')
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
