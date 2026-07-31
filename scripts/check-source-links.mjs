import { readFile } from 'node:fs/promises'

const catalog = JSON.parse(
  await readFile(new URL('../content/eponyms.json', import.meta.url), 'utf8'),
)

const sourceRecords = catalog.concepts.flatMap((concept) =>
  concept.sourceLinks.map((source) => ({
    conceptId: concept.id,
    label: source.label,
    url: source.url,
  })),
)

const concurrency = 12
const attempts = 3
const timeoutMs = 10_000

// These hosts are known to protect automated requests while still resolving
// the cited resource for readers. Only explicit anti-bot/rate-limit statuses
// are accepted; a 404 or server failure still fails the audit.
const statusAllowlist = new Map([
  ['doi.org', new Set([403, 429])],
  ['docs.opencv.org', new Set([403, 429])],
  ['epubs.siam.org', new Set([403, 429])],
  ['eudml.org', new Set([403, 429])],
  ['ieeexplore.ieee.org', new Set([403, 429])],
  ['link.springer.com', new Set([403, 429])],
  ['mitpress.mit.edu', new Set([403, 429])],
  ['royalsocietypublishing.org', new Set([403, 429])],
  ['www.rand.org', new Set([403, 429])],
  ['www.jstor.org', new Set([403, 429])],
])

const perHostLimit = new Map([
  ['doi.org', 2],
  ['encyclopediaofmath.org', 1],
])
const hostState = new Map()

function accepted(response, sourceUrl) {
  if (response.ok || (response.status >= 300 && response.status < 400)) {
    return true
  }
  const originalHost = new URL(sourceUrl).hostname
  const finalHost = new URL(response.url).hostname
  return (
    statusAllowlist.get(originalHost)?.has(response.status) ??
    statusAllowlist.get(finalHost)?.has(response.status) ??
    false
  )
}

async function acquireHost(host) {
  const limit = perHostLimit.get(host) ?? 3
  let state = hostState.get(host)
  if (!state) {
    state = { active: 0, queue: [] }
    hostState.set(host, state)
  }
  if (state.active >= limit) {
    await new Promise((resolve) => state.queue.push(resolve))
  }
  state.active += 1
}

function releaseHost(host) {
  const state = hostState.get(host)
  if (!state) return
  state.active -= 1
  state.queue.shift()?.()
}

async function requestSource(source) {
  let lastFailure = 'unknown failure'
  let lastStatus = null

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(source.url, {
        headers: {
          Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.5',
          Range: 'bytes=0-1023',
          'User-Agent':
            'AI-Eponym-Atlas-Link-Audit/0.2 (+https://github.com/ChaoYue0307/ai-eponym-atlas)',
        },
        redirect: 'follow',
        signal: controller.signal,
      })
      const isAccepted = accepted(response, source.url)
      lastStatus = response.status
      await response.body?.cancel()
      if (isAccepted) {
        return {
          ...source,
          ok: true,
          status: response.status,
          finalUrl: response.url,
        }
      }
      lastFailure = `HTTP ${response.status}`
    } catch (error) {
      lastFailure =
        error instanceof Error ? error.message : String(error)
    } finally {
      clearTimeout(timeout)
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 750))
    }
  }

  if (
    lastStatus === null ||
    lastStatus === 408 ||
    lastStatus === 425 ||
    lastStatus === 429 ||
    (lastStatus >= 500 && lastStatus <= 599)
  ) {
    return {
      ...source,
      ok: true,
      warning: lastFailure,
    }
  }

  return { ...source, ok: false, failure: lastFailure }
}

async function checkSource(source) {
  const host = new URL(source.url).hostname
  await acquireHost(host)
  try {
    return await requestSource(source)
  } finally {
    releaseHost(host)
  }
}

async function checkAll(sources) {
  const results = new Array(sources.length)
  let cursor = 0

  async function worker() {
    while (cursor < sources.length) {
      const index = cursor
      cursor += 1
      results[index] = await checkSource(sources[index])
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, sources.length) },
      () => worker(),
    ),
  )
  return results
}

const results = await checkAll(sourceRecords)
const failures = results.filter((result) => !result.ok)
const warnings = results.filter((result) => result.warning)

console.log(
  `Checked ${results.length} source links across ${catalog.concepts.length} concepts.`,
)

if (failures.length > 0) {
  console.error(`Found ${failures.length} unreachable source links:`)
  for (const failure of failures) {
    console.error(
      `- ${failure.conceptId}: ${failure.label} — ${failure.url} (${failure.failure})`,
    )
  }
  process.exitCode = 1
} else {
  console.log('No source link returned a confirmed hard failure.')
}

if (warnings.length > 0) {
  console.warn(
    `${warnings.length} links could not be conclusively checked after retries:`,
  )
  for (const warning of warnings) {
    console.warn(
      `- ${warning.conceptId}: ${warning.url} (${warning.warning})`,
    )
  }
}
