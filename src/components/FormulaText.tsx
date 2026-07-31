import katex from 'katex'
import { useMemo } from 'react'

type FormulaTextProps = {
  value: string
}

export function FormulaText({ value }: FormulaTextProps) {
  const parts = useMemo(() => value.split('$'), [value])

  return (
    <div className="formula-text" aria-label={value.replaceAll('$', '')}>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return part ? <span key={`${part}-${index}`}>{part}</span> : null
        }

        try {
          return (
            <span
              className="formula-text__math"
              key={`${part}-${index}`}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(part, {
                  throwOnError: true,
                  output: 'htmlAndMathml',
                }),
              }}
            />
          )
        } catch {
          return <code key={`${part}-${index}`}>{part}</code>
        }
      })}
    </div>
  )
}
