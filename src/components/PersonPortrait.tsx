import { useEffect, useState } from 'react'
import type { Locale } from '../copy'
import type { Person } from '../types'

type PersonPortraitProps = {
  person: Person
  locale: Locale
  variant?: 'avatar' | 'profile'
  showCredit?: boolean
}

function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export function PersonPortrait({
  person,
  locale,
  variant = 'avatar',
  showCredit = false,
}: PersonPortraitProps) {
  const [failed, setFailed] = useState(false)
  const portrait = person.portrait

  useEffect(() => {
    setFailed(false)
  }, [person.id, portrait?.file])

  const visual =
    portrait && !failed ? (
      <img
        src={publicAsset(portrait.file)}
        alt={variant === 'profile' ? portrait.alt[locale] : ''}
        loading={variant === 'profile' ? 'eager' : 'lazy'}
        decoding="async"
        style={
          portrait.objectPosition || portrait.cropScale
            ? {
                objectPosition: portrait.objectPosition,
                transform: portrait.cropScale
                  ? `scale(${portrait.cropScale})`
                  : undefined,
                transformOrigin: portrait.objectPosition,
              }
            : undefined
        }
        onError={() => setFailed(true)}
      />
    ) : (
      <span className="person-portrait__fallback" aria-hidden="true">
        {person.portraitInitials}
      </span>
    )

  if (showCredit) {
    return (
      <figure className={`person-portrait person-portrait--${variant}`}>
        <span className="person-portrait__visual">{visual}</span>
        <figcaption>
          {portrait ? (
            <>
              <span>{locale === 'zh' ? '肖像：' : 'Portrait: '}</span>
              <a href={portrait.sourceUrl} target="_blank" rel="noreferrer">
                {portrait.creator}
              </a>
              <span> · </span>
              <a href={portrait.licenseUrl} target="_blank" rel="noreferrer">
                {portrait.license}
              </a>
            </>
          ) : (
            <span className="person-portrait__unavailable">
              {locale === 'zh'
                ? '暂无可核验的开放肖像，以姓名首字母代替。'
                : 'No verified open portrait is available; initials are shown to prevent misidentification.'}
            </span>
          )}
        </figcaption>
      </figure>
    )
  }

  return (
    <span
      className={`person-portrait person-portrait--${variant}`}
      title={portrait ? portrait.alt[locale] : undefined}
    >
      <span className="person-portrait__visual">{visual}</span>
    </span>
  )
}
