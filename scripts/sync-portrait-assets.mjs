import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = resolve(repositoryRoot, 'content/people-media.json')
const publicRoot = resolve(repositoryRoot, 'public')
const force = process.argv.includes('--force')
const refreshThumbnails = process.argv.includes('--refresh-thumbnails')
const thumbnailWidth = 320

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const portraits = catalog.profiles.flatMap((profile) =>
  profile.portrait
    ? [{ personId: profile.personId, portrait: profile.portrait }]
    : [],
)

function safeTarget(file) {
  if (!/^portraits\/[a-z0-9-]+\.(?:jpe?g|png|webp)$/i.test(file)) {
    throw new TypeError(`Unsafe or unsupported portrait path: ${file}`)
  }

  const target = resolve(publicRoot, file)
  if (!target.startsWith(`${publicRoot}/`)) {
    throw new TypeError(`Portrait path escapes public/: ${file}`)
  }
  return target
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

function wait(milliseconds) {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, milliseconds)
  })
}

async function fetchWithBackoff(url, personId) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'AI-Eponym-Atlas/0.2 (+https://github.com/ChaoYue0307/ai-eponym-atlas)',
      },
    })

    if (response.ok || (response.status !== 429 && response.status !== 503)) {
      return response
    }

    const retryAfter = Number(response.headers.get('retry-after'))
    const delay = Number.isFinite(retryAfter)
      ? Math.min(retryAfter * 1000, 15_000)
      : Math.min(attempt * 1_500, 7_500)
    console.warn(
      `${personId}: Wikimedia returned ${response.status}; retrying in ${delay}ms.`,
    )
    await wait(delay)
  }

  throw new Error(`${personId}: Wikimedia retry limit exceeded`)
}

function commonsFileTitle(sourceUrl) {
  const url = new URL(sourceUrl)
  if (
    url.hostname !== 'commons.wikimedia.org' ||
    !url.pathname.startsWith('/wiki/File:')
  ) {
    throw new TypeError(`Unsupported Commons file page: ${sourceUrl}`)
  }

  return decodeURIComponent(url.pathname.slice('/wiki/'.length)).replaceAll(
    '_',
    ' ',
  )
}

function normalizedTitle(title) {
  return title.replaceAll('_', ' ').normalize('NFC')
}

async function refreshCommonsThumbnails() {
  const batchSize = 40

  for (let start = 0; start < portraits.length; start += batchSize) {
    const batch = portraits.slice(start, start + batchSize).map((entry) => ({
      ...entry,
      title: commonsFileTitle(entry.portrait.sourceUrl),
    }))
    const apiUrl = new URL('https://commons.wikimedia.org/w/api.php')
    apiUrl.search = new URLSearchParams({
      action: 'query',
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: String(thumbnailWidth),
      redirects: '1',
      format: 'json',
      formatversion: '2',
      titles: batch.map(({ title }) => title).join('|'),
    }).toString()

    const response = await fetchWithBackoff(
      apiUrl,
      `Commons thumbnail batch ${start / batchSize + 1}`,
    )
    if (!response.ok) {
      throw new Error(
        `Commons thumbnail API: ${response.status} ${response.statusText}`,
      )
    }

    const result = await response.json()
    const pagesByTitle = new Map(
      (result.query?.pages ?? []).map((page) => [
        normalizedTitle(page.title),
        page,
      ]),
    )

    for (const entry of batch) {
      const page = pagesByTitle.get(normalizedTitle(entry.title))
      const imageInfo = page?.imageinfo?.[0]
      const thumbnailUrl = imageInfo?.thumburl ?? imageInfo?.url
      if (!thumbnailUrl) {
        throw new Error(
          `${entry.personId}: Commons did not return a thumbnail URL`,
        )
      }
      entry.portrait.sourceImageUrl = thumbnailUrl
    }
  }

  console.log(
    `Refreshed ${portraits.length} source URLs at ${thumbnailWidth}px.`,
  )
}

if (refreshThumbnails) {
  await refreshCommonsThumbnails()
}

let downloaded = 0
let skipped = 0

for (const { personId, portrait } of portraits) {
  const target = safeTarget(portrait.file)
  if (!force && (await exists(target))) {
    skipped += 1
    continue
  }

  const response = await fetchWithBackoff(
    portrait.sourceImageUrl,
    personId,
  )

  if (!response.ok) {
    throw new Error(
      `${personId}: ${response.status} ${response.statusText}`,
    )
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) {
    throw new TypeError(
      `${personId}: expected an image, received ${contentType || 'unknown type'}`,
    )
  }

  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, new Uint8Array(await response.arrayBuffer()))
  downloaded += 1
  console.log(`downloaded ${personId} -> ${portrait.file}`)
  await wait(500)
}

if (refreshThumbnails) {
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`)
}

console.log(
  `Portrait assets ready: ${portraits.length} total, ${downloaded} downloaded, ${skipped} already present.`,
)
