import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputRoot = resolve("dist");
const siteRoot = "https://chaoyue0307.github.io/ai-eponym-atlas";
const catalog = JSON.parse(await readFile(resolve("content/eponyms.json"), "utf8"));
const routeMetadata = JSON.parse(
  await readFile(resolve("content/route-metadata.json"), "utf8"),
);
const sitemap = await readFile(resolve(outputRoot, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedUrlCount =
  2 * catalog.concepts.length +
  2 * catalog.people.length +
  2 * Object.keys(routeMetadata).length +
  2;

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function htmlPathFor(urlString) {
  const { pathname } = new URL(urlString);
  const relativePath = pathname
    .replace(/^\/ai-eponym-atlas\/?/, "")
    .replace(/^\/+|\/+$/g, "");
  return resolve(outputRoot, relativePath, "index.html");
}

function attribute(html, selectorPattern, attributeName) {
  const tag = html.match(selectorPattern)?.[0];
  return tag?.match(new RegExp(`${attributeName}="([^"]+)"`))?.[1];
}

expect(
  sitemapUrls.length === expectedUrlCount,
  `Expected ${expectedUrlCount} sitemap URLs, found ${sitemapUrls.length}`,
);
expect(new Set(sitemapUrls).size === sitemapUrls.length, "Sitemap contains duplicate URLs");
expect(sitemapUrls.every((url) => !url.includes("#")), "Sitemap URLs must not use fragments");

const routeDescriptions = new Set();

for (const url of sitemapUrls) {
  const filePath = htmlPathFor(url);
  await access(filePath);
  const html = await readFile(filePath, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = attribute(html, /<meta\s+name="description"[^>]*>/, "content");
  const canonical = attribute(html, /<link\s+rel="canonical"[^>]*>/, "href");
  const jsonLd = html.match(
    /<script\s+id="structured-data"\s+type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];

  expect(title && title.length > 10, `Missing descriptive title in ${filePath}`);
  const minimumDescriptionLength = /<html\s+lang="zh-CN"/.test(html) ? 20 : 50;
  expect(
    description && description.length > minimumDescriptionLength,
    `Missing descriptive metadata in ${filePath}`,
  );
  expect(description.length <= 200, `Metadata is too long in ${filePath}`);
  expect(canonical === url, `Canonical mismatch in ${filePath}: ${canonical} !== ${url}`);
  expect(html.includes('hreflang="x-default"'), `Missing x-default hreflang in ${filePath}`);
  expect(html.includes('hreflang="en"'), `Missing English hreflang in ${filePath}`);
  expect(html.includes('hreflang="zh-CN"'), `Missing Chinese hreflang in ${filePath}`);
  expect(jsonLd, `Missing structured data in ${filePath}`);
  const structuredData = JSON.parse(jsonLd);
  for (const node of structuredData["@graph"] ?? []) {
    for (const property of ["birthDate", "deathDate"]) {
      if (node[property] !== undefined) {
        expect(/^\d{4}$/.test(node[property]), `Invalid ${property} in ${filePath}`);
      }
    }
  }
  expect(!/http-equiv="refresh"/i.test(html), `Automatic meta redirect found in ${filePath}`);
  expect(!/window\.location\.replace\(/.test(html), `Automatic script redirect found in ${filePath}`);
  expect(!/href="[^"]*#\//.test(html), `Legacy hash route found in ${filePath}`);
  expect(/<script\s+type="module"[^>]+\/assets\//.test(html), `App bundle missing in ${filePath}`);
  expect(!/(?:null–|–null)/.test(html), `Unresolved lifespan leaked into ${filePath}`);
  if (html.includes('class="static-entry__portrait"')) {
    expect(
      html.includes('class="static-entry__portrait-credit"') &&
        html.includes('Wikimedia Commons') &&
        /class="static-entry__portrait-credit"[\s\S]*?rel="license"/.test(html),
      `Portrait attribution or license missing in ${filePath}`,
    );
  }

  if (/\/(?:zh\/)?(?:atlas|paths|graph|timeline|about)\/$/.test(new URL(url).pathname)) {
    expect(!routeDescriptions.has(description), `Duplicate route description: ${description}`);
    routeDescriptions.add(description);
  }
}

expect(
  routeDescriptions.size === Object.keys(routeMetadata).length * 2,
  "Every route and language needs a distinct description",
);

console.log(
  `SEO audit passed for ${sitemapUrls.length} canonical URLs with parseable JSON-LD and clean internal links.`,
);
