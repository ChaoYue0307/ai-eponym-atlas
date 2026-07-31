import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const atlas = JSON.parse(
  await readFile(resolve(repositoryRoot, 'content/eponyms.json'), 'utf8'),
)
const media = JSON.parse(
  await readFile(resolve(repositoryRoot, 'content/people-media.json'), 'utf8'),
)
const thumbnailWidth = 320
const searchCommons = process.argv.includes('--search')
const acceptedOnly = process.argv.includes('--accepted-only')
const requestHeaders = {
  'User-Agent':
    'AI-Eponym-Atlas/0.2 (+https://github.com/ChaoYue0307/ai-eponym-atlas)',
}

// Keep this list exact. Prefix checks such as `CC BY...` also match restricted
// licenses including CC BY-NC, which are outside the atlas portrait policy.
const globallyAcceptedLicenses = new Set([
  'Public domain',
  'CC0',
  'CC0 1.0',
  'CC BY 1.0',
  'CC BY 2.0',
  'CC BY 2.5',
  'CC BY 3.0',
  'CC BY 4.0',
  'CC BY-SA 1.0',
  'CC BY-SA 2.0',
  'CC BY-SA 2.0 DE',
  'CC BY-SA 2.5',
  'CC BY-SA 3.0',
  'CC BY-SA 4.0',
])

const knownFailClosedRejections = new Map([
  [
    'thomas-bayes',
    {
      fileName: 'Thomas Bayes.gif',
      reason:
        'The Commons description says the sitter is an unknown nineteenth-century clergyman and that the identification as Thomas Bayes is likely incorrect.',
    },
  ],
  [
    'dennis-gabor',
    {
      fileName: 'Dennis Gabor 1971.jpg',
      reason:
        'The candidate is described as public domain only in the United States; the globally served atlas requires a globally reusable basis.',
    },
  ],
])

function wait(milliseconds) {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, milliseconds)
  })
}

async function fetchJson(url, label) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, { headers: requestHeaders })
    if (response.ok) return response.json()
    if (response.status !== 429 && response.status !== 503) {
      throw new Error(`${label}: ${response.status} ${response.statusText}`)
    }
    const retryAfter = Number(response.headers.get('retry-after'))
    const delay = Number.isFinite(retryAfter)
      ? Math.min(retryAfter * 1000, 15_000)
      : Math.min(attempt * 1_500, 7_500)
    await wait(delay)
  }
  throw new Error(`${label}: retry limit exceeded`)
}

function wikidataId(profileUrl) {
  const match = profileUrl?.match(/\/wiki\/(Q\d+)$/)
  return match?.[1]
}

function claimValue(entity, property) {
  return entity?.claims?.[property]?.[0]?.mainsnak?.datavalue?.value
}

function stripMarkup(value = '') {
  return value
    .replace(/<br\s*\/?>/gi, ' · ')
    .replace(/<[^>]+>/g, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function metadataValue(imageInfo, key) {
  return imageInfo?.extmetadata?.[key]?.value ?? ''
}

function normalizeLicense(imageInfo) {
  const shortName = stripMarkup(metadataValue(imageInfo, 'LicenseShortName'))
  const usageTerms = stripMarkup(metadataValue(imageInfo, 'UsageTerms'))
  const license = (shortName || usageTerms).replace(/ 2\.0 de$/i, ' 2.0 DE')
  const licenseUrl = metadataValue(imageInfo, 'LicenseUrl')
  const globallyAccepted = globallyAcceptedLicenses.has(license)
  return { license, licenseUrl, globallyAccepted }
}

const peopleById = new Map(atlas.people.map((person) => [person.id, person]))
const missingPortraitProfiles = media.profiles.filter(
  (profile) => !profile.portrait,
)
const ids = missingPortraitProfiles
  .map((profile) => wikidataId(profile.profileUrl))
  .filter(Boolean)
const entityApi = new URL('https://www.wikidata.org/w/api.php')
entityApi.search = new URLSearchParams({
  action: 'wbgetentities',
  ids: ids.join('|'),
  props: 'claims|labels|descriptions',
  languages: 'en',
  format: 'json',
  formatversion: '2',
}).toString()
const entityResult = await fetchJson(entityApi, 'Wikidata identities')

const candidateRows = missingPortraitProfiles.map((profile) => {
  const entityId = wikidataId(profile.profileUrl)
  const entity = entityResult.entities?.[entityId]
  return {
    personId: profile.personId,
    name: peopleById.get(profile.personId)?.name ?? profile.personId,
    entityId,
    description: entity?.descriptions?.en?.value ?? '',
    fileName: claimValue(entity, 'P18') ?? null,
  }
})

const candidatesWithImages = candidateRows.filter((row) => row.fileName)
const batchSize = 40
const commonsByTitle = new Map()
for (let start = 0; start < candidatesWithImages.length; start += batchSize) {
  const batch = candidatesWithImages.slice(start, start + batchSize)
  const commonsApi = new URL('https://commons.wikimedia.org/w/api.php')
  commonsApi.search = new URLSearchParams({
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: String(thumbnailWidth),
    redirects: '1',
    titles: batch.map((row) => `File:${row.fileName}`).join('|'),
    format: 'json',
    formatversion: '2',
  }).toString()
  const commonsResult = await fetchJson(
    commonsApi,
    `Commons metadata batch ${start / batchSize + 1}`,
  )
  for (const page of commonsResult.query?.pages ?? []) {
    commonsByTitle.set(page.title.replace(/^File:/, '').replaceAll('_', ' '), page)
  }
}

const report = candidateRows.map((row) => {
  if (!row.entityId) {
    return {
      ...row,
      status: 'IDENTITY_UNRESOLVED',
      rejectionReason:
        'No unambiguous Wikidata identity has been verified for this atlas entry.',
    }
  }
  if (!row.fileName) return { ...row, status: 'NO_P18' }
  const page = commonsByTitle.get(row.fileName.replaceAll('_', ' '))
  const imageInfo = page?.imageinfo?.[0]
  if (!imageInfo) return { ...row, status: 'COMMONS_METADATA_MISSING' }
  const license = normalizeLicense(imageInfo)
  const knownRejection = knownFailClosedRejections.get(row.personId)
  const rejectionReason =
    knownRejection?.fileName === row.fileName ? knownRejection.reason : null
  return {
    ...row,
    status: rejectionReason
      ? 'KNOWN_REJECT'
      : license.globallyAccepted
        ? 'LICENSE_CANDIDATE'
        : 'LICENSE_REJECT',
    ...(rejectionReason ? { rejectionReason } : {}),
    filePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title).replaceAll('%3A', ':')}`,
    thumbnailUrl: imageInfo.thumburl ?? imageInfo.url,
    originalUrl: imageInfo.url,
    creator: stripMarkup(metadataValue(imageInfo, 'Artist')) || 'Unknown creator',
    description:
      stripMarkup(metadataValue(imageInfo, 'ImageDescription')) || row.description,
    license: license.license,
    licenseUrl: license.licenseUrl,
  }
})

if (searchCommons) {
  for (const row of report) {
    if (row.fileName) continue
    const searchApi = new URL('https://commons.wikimedia.org/w/api.php')
    searchApi.search = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `"${row.name}" filetype:bitmap`,
      gsrnamespace: '6',
      gsrlimit: '8',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: String(thumbnailWidth),
      format: 'json',
      formatversion: '2',
    }).toString()
    const searchResult = await fetchJson(searchApi, `Commons search for ${row.name}`)
    row.searchCandidates = (searchResult.query?.pages ?? [])
      .map((page) => {
        const imageInfo = page.imageinfo?.[0]
        const license = normalizeLicense(imageInfo)
        return {
          title: page.title,
          status: 'IDENTITY_REVIEW_REQUIRED',
          filePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title).replaceAll('%3A', ':')}`,
          thumbnailUrl: imageInfo?.thumburl ?? imageInfo?.url ?? '',
          creator:
            stripMarkup(metadataValue(imageInfo, 'Artist')) || 'Unknown creator',
          description: stripMarkup(metadataValue(imageInfo, 'ImageDescription')),
          license: license.license,
          licenseUrl: license.licenseUrl,
          globallyAcceptedLicense: license.globallyAccepted,
        }
      })
      .filter((candidate) => !acceptedOnly || candidate.globallyAcceptedLicense)
    await wait(250)
  }
}

console.log(
  JSON.stringify(
    {
      auditedOn: new Date().toISOString().slice(0, 10),
      peopleInAtlas: atlas.people.length,
      existingPortraits: media.profiles.filter((profile) => profile.portrait).length,
      profilesWithoutPortraits: media.profiles.filter((profile) => !profile.portrait).length,
      results: report,
    },
    null,
    2,
  ),
)
