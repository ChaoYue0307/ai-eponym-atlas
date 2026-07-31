import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'

const repositoryRoot = new URL('../', import.meta.url)

const catalog = JSON.parse(
  await readFile(new URL('content/eponyms.json', repositoryRoot), 'utf8'),
)
const mediaCatalog = JSON.parse(
  await readFile(new URL('content/people-media.json', repositoryRoot), 'utf8'),
)

const concurrency = 12
const attempts = 3
const timeoutMs = 10_000
const defaultMaxWarningRatio = 0.5

function boundedRatio(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1
    ? parsed
    : fallback
}

function positiveLimit(value) {
  if (value === undefined) return Number.POSITIVE_INFINITY
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : Number.POSITIVE_INFINITY
}

const maxWarningRatio = boundedRatio(
  process.env.SOURCE_LINK_MAX_WARNING_RATIO,
  defaultMaxWarningRatio,
)
const auditLimit = positiveLimit(process.env.SOURCE_LINK_AUDIT_LIMIT)
const reportPath = resolve(
  process.env.SOURCE_LINK_REPORT ??
    `${tmpdir()}/ai-eponym-atlas-source-link-audit.json`,
)

function reference(scope, ownerId, kind, label, url) {
  return { scope, ownerId, kind, label, url }
}

const conceptReferences = catalog.concepts.flatMap((concept) =>
  concept.sourceLinks.map((source) =>
    reference('concept', concept.id, 'reference', source.label, source.url),
  ),
)

const portraitReferences = mediaCatalog.profiles.flatMap((profile) => {
  const records = []
  if (profile.profileUrl) {
    records.push(
      reference(
        'person',
        profile.personId,
        'identity',
        'Wikidata identity record',
        profile.profileUrl,
      ),
    )
  }

  const portrait = profile.portrait
  if (!portrait) return records

  records.push(
    reference(
      'person',
      profile.personId,
      'portrait-file-page',
      `Portrait source — ${portrait.creator}`,
      portrait.sourceUrl,
    ),
    reference(
      'person',
      profile.personId,
      'portrait-image',
      'Portrait image asset',
      portrait.sourceImageUrl,
    ),
    reference(
      'person',
      profile.personId,
      'portrait-license',
      `Portrait license — ${portrait.license}`,
      portrait.licenseUrl,
    ),
  )
  return records
})

function latestMatch(pattern, value) {
  let latest
  for (const match of value.matchAll(pattern)) latest = match
  return latest
}

async function timelineReferences() {
  let source
  try {
    source = await readFile(
      new URL('src/data/timeline.ts', repositoryRoot),
      'utf8',
    )
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') return []
    throw error
  }

  const records = []
  const urlPattern = /\burl:\s*"(https:\/\/(?:\\.|[^"\\])*)"/g
  for (const match of source.matchAll(urlPattern)) {
    const prefix = source.slice(0, match.index)
    const owner = latestMatch(/\bid:\s*"((?:\\.|[^"\\])*)"/g, prefix)
    const label = latestMatch(
      /\blabel:\s*"((?:\\.|[^"\\])*)"/g,
      prefix,
    )
    const decode = (value) => JSON.parse(`"${value}"`)
    records.push(
      reference(
        'timeline',
        owner ? decode(owner[1]) : 'timeline',
        'event-evidence',
        label ? decode(label[1]) : 'Timeline evidence',
        decode(match[1]),
      ),
    )
  }
  return records
}

const sourceRecords = [
  ...conceptReferences,
  ...portraitReferences,
  ...(await timelineReferences()),
]

function groupByUrl(records) {
  const grouped = new Map()
  for (const record of records) {
    const existing = grouped.get(record.url)
    if (existing) existing.references.push(record)
    else grouped.set(record.url, { url: record.url, references: [record] })
  }
  return [...grouped.values()]
}

const sourceGroups = groupByUrl(sourceRecords).slice(0, auditLimit)

// These hosts are known to rate-limit automated requests. Their explicit
// rate-limit statuses are warnings, never verified successes. Access-control
// responses such as 401/403/451 are handled as warnings for every host below;
// confirmed missing-resource responses such as 404/410 remain hard failures.
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

function allowlistedStatus(response, sourceUrl) {
  const originalHost = new URL(sourceUrl).hostname
  const finalHost = new URL(response.url).hostname
  return Boolean(
    statusAllowlist.get(originalHost)?.has(response.status) ||
      statusAllowlist.get(finalHost)?.has(response.status),
  )
}

function classifyResponse(response, sourceUrl) {
  if (response.ok) return { classification: 'verified' }
  if (
    response.status === 401 ||
    response.status === 403 ||
    response.status === 451
  ) {
    return {
      classification: 'warning',
      reason: `HTTP ${response.status} prevents automated verification`,
    }
  }
  if (allowlistedStatus(response, sourceUrl)) {
    return {
      classification: 'warning',
      reason: `HTTP ${response.status} is an expected bot/rate-limit response`,
    }
  }
  if (
    response.status === 408 ||
    response.status === 425 ||
    response.status === 429 ||
    response.status >= 500
  ) {
    return {
      classification: 'warning',
      reason: `transient HTTP ${response.status}`,
    }
  }
  if (response.status >= 300 && response.status < 400) {
    return {
      classification: 'warning',
      reason: `unresolved HTTP redirect ${response.status}`,
    }
  }
  return {
    classification: 'hard-failure',
    reason: `HTTP ${response.status}`,
  }
}

async function acquireHost(host) {
  const limit = perHostLimit.get(host) ?? 3
  let state = hostState.get(host)
  if (!state) {
    state = { active: 0, queue: [] }
    hostState.set(host, state)
  }
  if (state.active >= limit) {
    await new Promise((resolveQueue) => state.queue.push(resolveQueue))
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
  let lastWarning = 'unknown network failure'
  let lastStatus = null
  let lastFinalUrl = source.url

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(source.url, {
        headers: {
          Accept: 'text/html,application/pdf,image/*;q=0.9,*/*;q=0.5',
          Range: 'bytes=0-1023',
          'User-Agent':
            'AI-Eponym-Atlas-Link-Audit/0.3 (+https://github.com/ChaoYue0307/ai-eponym-atlas)',
        },
        redirect: 'follow',
        signal: controller.signal,
      })
      const classification = classifyResponse(response, source.url)
      lastStatus = response.status
      lastFinalUrl = response.url
      await response.body?.cancel()

      if (classification.classification === 'verified') {
        return {
          ...source,
          classification: 'verified',
          status: response.status,
          finalUrl: response.url,
          attempts: attempt,
        }
      }
      if (classification.classification === 'hard-failure') {
        return {
          ...source,
          classification: 'hard-failure',
          status: response.status,
          finalUrl: response.url,
          reason: classification.reason,
          attempts: attempt,
        }
      }
      lastWarning = classification.reason
    } catch (error) {
      lastWarning = error instanceof Error ? error.message : String(error)
    } finally {
      clearTimeout(timeout)
    }

    if (attempt < attempts) {
      await new Promise((resolveDelay) =>
        setTimeout(resolveDelay, attempt * 750),
      )
    }
  }

  return {
    ...source,
    classification: 'warning',
    status: lastStatus,
    finalUrl: lastFinalUrl,
    reason: lastWarning,
    attempts,
  }
}

async function checkSource(source) {
  let host
  try {
    host = new URL(source.url).hostname
  } catch (error) {
    return {
      ...source,
      classification: 'hard-failure',
      status: null,
      finalUrl: source.url,
      reason: error instanceof Error ? error.message : String(error),
      attempts: 0,
    }
  }

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

const results = await checkAll(sourceGroups)
const verified = results.filter(
  (result) => result.classification === 'verified',
)
const warnings = results.filter(
  (result) => result.classification === 'warning',
)
const hardFailures = results.filter(
  (result) => result.classification === 'hard-failure',
)
const warningRatio = results.length === 0 ? 1 : warnings.length / results.length
const failureReasons = []

if (hardFailures.length > 0) {
  failureReasons.push(`${hardFailures.length} confirmed hard failure(s)`)
}
if (verified.length === 0) {
  failureReasons.push('no source URL was conclusively verified')
}
if (warningRatio > maxWarningRatio) {
  failureReasons.push(
    `warning ratio ${(warningRatio * 100).toFixed(1)}% exceeds ${(maxWarningRatio * 100).toFixed(1)}%`,
  )
}

const countsByScope = Object.fromEntries(
  ['concept', 'person', 'timeline'].map((scope) => [
    scope,
    sourceRecords.filter((record) => record.scope === scope).length,
  ]),
)
const report = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  configuration: {
    attempts,
    concurrency,
    timeoutMs,
    maxWarningRatio,
    auditLimit: Number.isFinite(auditLimit) ? auditLimit : null,
  },
  coverage: {
    records: sourceRecords.length,
    uniqueUrlsDiscovered: groupByUrl(sourceRecords).length,
    uniqueUrlsChecked: results.length,
    recordsByScope: countsByScope,
  },
  summary: {
    verified: verified.length,
    warnings: warnings.length,
    hardFailures: hardFailures.length,
    warningRatio,
    passed: failureReasons.length === 0,
    failureReasons,
  },
  checks: results,
}

await mkdir(dirname(reportPath), { recursive: true })
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

console.log(
  `Checked ${results.length} unique URLs from ${sourceRecords.length} source records ` +
    `(${countsByScope.concept} concept, ${countsByScope.person} person/media, ` +
    `${countsByScope.timeline} timeline).`,
)
console.log(
  `Verified ${verified.length}; warnings ${warnings.length}; hard failures ${hardFailures.length}.`,
)
console.log(`Machine-readable report: ${reportPath}`)

for (const failure of hardFailures) {
  console.error(`HARD FAILURE: ${failure.url} (${failure.reason})`)
}

const warningLogLimit = 50
for (const warning of warnings.slice(0, warningLogLimit)) {
  console.warn(`WARNING: ${warning.url} (${warning.reason})`)
}
if (warnings.length > warningLogLimit) {
  console.warn(
    `${warnings.length - warningLogLimit} additional warnings are recorded in the JSON report.`,
  )
}

if (failureReasons.length > 0) {
  for (const reason of failureReasons) console.error(`AUDIT FAILED: ${reason}`)
  process.exitCode = 1
} else {
  console.log('Source link audit passed.')
}
