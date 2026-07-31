import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const catalog = JSON.parse(await readFile(resolve("content/eponyms.json"), "utf8"));
const mediaCatalog = JSON.parse(await readFile(resolve("content/people-media.json"), "utf8"));
const routeMetadata = JSON.parse(
  await readFile(resolve("content/route-metadata.json"), "utf8"),
);
const outputRoot = resolve("dist");
const builtAppHtml = await readFile(resolve(outputRoot, "index.html"), "utf8");
const appAssetTags = builtAppHtml
  .split("\n")
  .filter((line) => /<(?:script|link)\b[^>]*(?:src|href)="[^"]*\/assets\//.test(line))
  .join("\n");

if (!appAssetTags) {
  throw new Error("Unable to find the built application assets in dist/index.html");
}

const siteRoot = "https://chaoyue0307.github.io/ai-eponym-atlas";
const imageUrl = `${siteRoot}/og-card.jpg`;
const contentLicenseUrl = "https://creativecommons.org/licenses/by/4.0/";
const contentLicensePage =
  "https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/CONTENT_LICENSE";
const codeLicensePage =
  "https://github.com/ChaoYue0307/ai-eponym-atlas/blob/main/LICENSE";
const creatorId = `${siteRoot}/#chaoyue-he`;
const websiteId = `${siteRoot}/#website`;
const atlasId = `${siteRoot}/#atlas`;
const peopleById = new Map(catalog.people.map((person) => [person.id, person]));
const conceptsById = new Map(catalog.concepts.map((concept) => [concept.id, concept]));
const mediaByPersonId = new Map(
  mediaCatalog.profiles.map((profile) => [profile.personId, profile]),
);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function trimDescription(value, locale) {
  const limit = locale === "zh" ? 90 : 160;
  if (value.length <= limit) return value;
  const clipped = value.slice(0, limit - 1);
  const boundary = locale === "zh" ? clipped.length : clipped.lastIndexOf(" ");
  return `${clipped.slice(0, Math.max(boundary, Math.floor(limit * 0.75))).trim()}…`;
}

function localePath(locale, path) {
  return locale === "zh" ? `/zh${path}` : path;
}

function canonicalUrl(locale, path) {
  const normalizedPath = path === "" ? "" : path.replace(/\/$/, "");
  return `${siteRoot}${localePath(locale, normalizedPath)}/`;
}

function localizedName(person, locale) {
  return locale === "zh" ? person.zhName : person.name;
}

function localizedTerm(concept, locale) {
  return locale === "zh" ? concept.zhTerm : concept.term;
}

function formatLifespan(person, locale) {
  if (person.lifeStatus === "missing") {
    const born = person.born ?? "?";
    return locale === "zh" ? `${born} 年生 · 失踪` : `Born ${born} · missing`;
  }
  if (person.born === null && person.died === null) {
    return locale === "zh" ? "生卒年待考" : "dates not established";
  }
  const born = person.born ?? "?";
  const died = person.died ?? (locale === "zh" ? "至今" : "present");
  return `${born}–${died}`;
}

function schemaYear(value) {
  return value && /^\d{4}$/.test(value) ? value : undefined;
}

function conceptDescription(concept, locale) {
  const value =
    locale === "zh"
      ? `${concept.functionNickname.zh}——${concept.question.zh}了解其定义、命名来源、历史与 AI 应用。`
      : `${concept.functionNickname.en} — ${concept.question.en} Learn its definition, namesake, history, and uses in AI.`;
  return trimDescription(value, locale);
}

function personDescription(person, linkedConcepts, locale) {
  const terms = linkedConcepts.slice(0, 3).map((concept) => localizedTerm(concept, locale));
  const value = `${person.summary[locale]} ${
    locale === "zh"
      ? `继续了解${terms.join("、")}等相关概念及其 AI 应用。`
      : `Explore ${terms.join(", ")} and their uses in AI.`
  }`;
  return trimDescription(value, locale);
}

function pageSchema({
  canonical,
  title,
  description,
  locale,
  pageType = "WebPage",
  mainEntity,
  citations = [],
}) {
  const pageId = `${canonical}#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": pageType,
        "@id": pageId,
        url: canonical,
        name: title,
        description,
        inLanguage: locale === "zh" ? "zh-CN" : "en",
        dateModified: catalog.meta.lastUpdated,
        isPartOf: { "@id": websiteId },
        license: contentLicenseUrl,
        creator: { "@id": creatorId },
        mainEntity: mainEntity ? { "@id": mainEntity["@id"] } : undefined,
        citation: citations.length ? citations : undefined,
      },
      ...(mainEntity ? [mainEntity] : []),
      {
        "@type": "Person",
        "@id": creatorId,
        name: "Chaoyue He",
      },
    ],
  };
}

function navigation(locale) {
  const items = [
    ["/atlas", locale === "zh" ? "完整图谱" : "Atlas"],
    ["/paths", locale === "zh" ? "学习路径" : "Learning paths"],
    ["/graph", locale === "zh" ? "关系图" : "Knowledge graph"],
    ["/timeline", locale === "zh" ? "时间线" : "Timeline"],
    ["/about", locale === "zh" ? "阅读指南" : "How to read"],
  ];
  return items
    .map(([path, label]) => `<a href="${canonicalUrl(locale, path)}">${label}</a>`)
    .join("");
}

function pageShell({
  locale,
  path,
  title,
  description,
  body,
  schema,
  ogType = "article",
}) {
  const canonical = canonicalUrl(locale, path);
  const alternateLocale = locale === "zh" ? "en" : "zh";
  const alternate = canonicalUrl(alternateLocale, path);
  const atlasUrl = canonicalUrl(locale, "/atlas");
  const language = locale === "zh" ? "zh-CN" : "en";
  const schemaJson = JSON.stringify(schema).replaceAll("<", "\\u003c");
  const imageAlt =
    locale === "zh"
      ? "AI 人名概念图谱：读懂人工智能背后的数学人名概念"
      : "AI Eponym Atlas — mathematical concepts behind artificial intelligence";
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="Chaoyue He">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${canonical}">
  <link id="alternate-${locale === "zh" ? "zh" : "en"}" rel="alternate" hreflang="${language}" href="${canonical}">
  <link id="alternate-${locale === "zh" ? "en" : "zh"}" rel="alternate" hreflang="${locale === "zh" ? "en" : "zh-CN"}" href="${alternate}">
  <link id="alternate-default" rel="alternate" hreflang="x-default" href="${canonicalUrl("en", path)}">
  <link rel="license" href="${contentLicensePage}" title="Original content: CC BY 4.0">
  <link rel="icon" type="image/png" href="${siteRoot}/brand-mark.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${siteRoot}/apple-touch-icon.png">
  <link rel="manifest" href="${siteRoot}/site.webmanifest">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="AI Eponym Atlas">
  <meta property="og:locale" content="${locale === "zh" ? "zh_CN" : "en_US"}">
  <meta property="og:locale:alternate" content="${locale === "zh" ? "en_US" : "zh_CN"}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
  <meta property="article:modified_time" content="${catalog.meta.lastUpdated}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">
  <script id="structured-data" type="application/ld+json">${schemaJson}</script>
${appAssetTags}
  <style>
    .static-entry{box-sizing:border-box;max-width:860px;margin:0 auto;padding:56px 24px 72px;color:#10131a;background:#fff;font:16px/1.68 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .static-entry *{box-sizing:border-box}.static-entry h1,.static-entry h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.025em;line-height:1.1}
    .static-entry h1{max-width:18ch;margin:32px 0 16px;font-size:clamp(2.5rem,8vw,5.25rem)}.static-entry h2{margin-top:2.25rem;font-size:1.55rem}.static-entry a{color:#003fc7}.static-entry .lede{max-width:64ch;font-size:1.2rem;color:#454a55}
    .static-entry__nav{display:flex;flex-wrap:wrap;gap:10px 20px;padding-bottom:20px;border-bottom:1px solid #d8dce3}.static-entry__nav a{font-size:.92rem;font-weight:650;text-decoration:none}
    .static-entry__breadcrumb{color:#656b76;font-size:.9rem}.static-entry__portrait-figure{width:min(260px,64vw);margin:28px 0}.static-entry__portrait{display:block;width:min(220px,52vw);height:auto;border:1px solid #d8dce3;border-radius:50%}.static-entry__portrait-credit{margin-top:10px;color:#656b76;font-size:.78rem;line-height:1.5}
    .static-entry__formula{overflow:auto;padding:16px;border:1px solid #d8dce3;border-radius:8px;background:#f7f8fb;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
    .static-entry__footer{display:grid;gap:16px;margin-top:48px;padding-top:24px;border-top:1px solid #d8dce3}.static-entry__action{display:inline-flex;width:max-content;padding:11px 17px;border-radius:999px;background:#003fc7;color:#fff!important;font-weight:700;text-decoration:none}
    .static-entry__licenses{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:.9rem;color:#656b76}
  </style>
</head>
<body>
  <div id="root">
    <main class="static-entry">
      <nav class="static-entry__nav" aria-label="${locale === "zh" ? "图谱导航" : "Atlas navigation"}">
        <a href="${canonicalUrl(locale, "")}">AI Eponym Atlas</a>
        ${navigation(locale)}
      </nav>
      ${body}
      <footer class="static-entry__footer">
        <a class="static-entry__action" href="${atlasUrl}">${locale === "zh" ? "浏览完整图谱" : "Browse the full atlas"}</a>
        <div class="static-entry__licenses">
          <a rel="license" href="${codeLicensePage}">${locale === "zh" ? "代码：MIT" : "Code: MIT"}</a>
          <a rel="license" href="${contentLicensePage}">${locale === "zh" ? "内容：CC BY 4.0" : "Content: CC BY 4.0"}</a>
        </div>
      </footer>
    </main>
  </div>
</body>
</html>`;
}

async function emit(locale, path, html) {
  const outputPath = resolve(
    outputRoot,
    localePath(locale, path).replace(/^\//, ""),
    "index.html",
  );
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

const sitemapEntries = new Set([`${siteRoot}/`]);

for (const concept of catalog.concepts) {
  for (const locale of ["en", "zh"]) {
    const term = localizedTerm(concept, locale);
    const path = `/concept/${concept.id}`;
    const canonical = canonicalUrl(locale, path);
    const title =
      locale === "zh"
        ? `${term}：含义与 AI 应用 · AI 人名概念图谱`
        : `${term}: Meaning and AI Uses · AI Eponym Atlas`;
    const description = conceptDescription(concept, locale);
    const namesakes = concept.personIds
      .map((personId) => peopleById.get(personId))
      .filter(Boolean);
    const relatedConcepts = concept.relatedConceptIds
      .map((conceptId) => conceptsById.get(conceptId))
      .filter(Boolean);
    const body = `
      <p class="static-entry__breadcrumb"><a href="${canonicalUrl(locale, "/atlas")}">${locale === "zh" ? "完整图谱" : "Atlas"}</a> / ${escapeHtml(term)}</p>
      <h1>${escapeHtml(term)}</h1>
      <p class="lede">${escapeHtml(concept.functionNickname[locale])}</p>
      <h2>${locale === "zh" ? "它回答什么问题？" : "What question does it answer?"}</h2>
      <p>${escapeHtml(concept.question[locale])}</p>
      <h2>${locale === "zh" ? "直觉" : "Intuition"}</h2>
      <p>${escapeHtml(concept.intuition[locale])}</p>
      <h2>${locale === "zh" ? "形式化定义" : "Formal definition"}</h2>
      <pre class="static-entry__formula"><code>${escapeHtml(concept.formalDefinition)}</code></pre>
      <h2>${locale === "zh" ? "为什么会出现在 AI 中" : "Why it appears in AI"}</h2>
      <ul>${concept.aiApplications.map((item) => `<li>${escapeHtml(item[locale])}</li>`).join("")}</ul>
      <h2>${locale === "zh" ? "命名来源" : "Namesakes"}</h2>
      <ul>${namesakes.map((person) => `<li><a href="${canonicalUrl(locale, `/person/${person.id}`)}">${escapeHtml(localizedName(person, locale))}</a></li>`).join("")}</ul>
      <p>${escapeHtml(concept.attributionNote[locale])}</p>
      <h2>${locale === "zh" ? "相关概念" : "Related concepts"}</h2>
      <ul>${relatedConcepts.map((related) => `<li><a href="${canonicalUrl(locale, `/concept/${related.id}`)}">${escapeHtml(localizedTerm(related, locale))}</a> — ${escapeHtml(related.functionNickname[locale])}</li>`).join("")}</ul>
      <h2>${locale === "zh" ? "参考来源" : "References"}</h2>
      <ol>${concept.sourceLinks.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join("")}</ol>`;
    const mainEntity = {
      "@type": "DefinedTerm",
      "@id": `${canonical}#term`,
      name: term,
      alternateName: locale === "zh" ? concept.term : concept.zhTerm,
      description,
      identifier: concept.id,
      inDefinedTermSet: { "@id": atlasId },
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
    };
    const schema = pageSchema({
      canonical,
      title,
      description,
      locale,
      mainEntity,
      citations: concept.sourceLinks.map((source) => source.url),
    });
    await emit(
      locale,
      path,
      pageShell({ locale, path, title, description, body, schema }),
    );
    sitemapEntries.add(canonical);
  }
}

for (const person of catalog.people) {
  for (const locale of ["en", "zh"]) {
    const name = localizedName(person, locale);
    const path = `/person/${person.id}`;
    const canonical = canonicalUrl(locale, path);
    const title =
      locale === "zh"
        ? `${name}：AI 中的人名概念 · AI 人名概念图谱`
        : `${name}: Named Concepts in AI · AI Eponym Atlas`;
    const linkedConcepts = person.concepts
      .map((conceptId) => conceptsById.get(conceptId))
      .filter(Boolean);
    const description = personDescription(person, linkedConcepts, locale);
    const media = mediaByPersonId.get(person.id);
    const portrait = media?.portrait;
    const body = `
      <p class="static-entry__breadcrumb"><a href="${canonicalUrl(locale, "/atlas")}">${locale === "zh" ? "数学家" : "Mathematicians"}</a> / ${escapeHtml(name)}</p>
      <h1>${escapeHtml(name)}</h1>
      ${
        portrait
          ? `<figure class="static-entry__portrait-figure"><img class="static-entry__portrait" src="${siteRoot}/${escapeHtml(portrait.file)}" alt="${escapeHtml(portrait.alt[locale])}" width="220" height="220"><figcaption class="static-entry__portrait-credit">${locale === "zh" ? "肖像" : "Portrait"}: ${escapeHtml(portrait.creator)} · <a href="${escapeHtml(portrait.sourceUrl)}">Wikimedia Commons</a> · <a rel="license" href="${escapeHtml(portrait.licenseUrl)}">${escapeHtml(portrait.license)}</a></figcaption></figure>`
          : ""
      }
      <p class="lede">${escapeHtml(person.summary[locale])}</p>
      <dl>
        <dt>${locale === "zh" ? "生卒" : "Lifespan"}</dt><dd>${escapeHtml(formatLifespan(person, locale))}</dd>
        <dt>${locale === "zh" ? "地区" : "Region"}</dt><dd>${escapeHtml(person.region)}</dd>
      </dl>
      <h2>${locale === "zh" ? "承载其名的术语" : "Terms carrying this name"}</h2>
      <ul>${linkedConcepts.map((concept) => `<li><a href="${canonicalUrl(locale, `/concept/${concept.id}`)}">${escapeHtml(localizedTerm(concept, locale))}</a> — ${escapeHtml(concept.functionNickname[locale])}</li>`).join("")}</ul>
      ${media?.profileUrl ? `<h2>${locale === "zh" ? "人物来源" : "Identity source"}</h2><p><a href="${escapeHtml(media.profileUrl)}">Wikidata</a></p>` : ""}`;
    const mainEntity = {
      "@type": "Person",
      "@id": `${canonical}#person`,
      name,
      alternateName: locale === "zh" ? person.name : person.zhName,
      description,
      birthDate: schemaYear(person.born),
      deathDate: schemaYear(person.died),
      sameAs: media?.profileUrl ? [media.profileUrl] : undefined,
      image: portrait
        ? {
            "@type": "ImageObject",
            contentUrl: `${siteRoot}/${portrait.file}`,
            creditText: portrait.creator,
            license: portrait.licenseUrl,
            acquireLicensePage: portrait.sourceUrl,
          }
        : undefined,
      mainEntityOfPage: { "@id": `${canonical}#webpage` },
    };
    const schema = pageSchema({
      canonical,
      title,
      description,
      locale,
      pageType: "ProfilePage",
      mainEntity,
    });
    await emit(
      locale,
      path,
      pageShell({
        locale,
        path,
        title,
        description,
        body,
        schema,
        ogType: "profile",
      }),
    );
    sitemapEntries.add(canonical);
  }
}

for (const [pathName, metadata] of Object.entries(routeMetadata)) {
  const path = `/${pathName}`;
  for (const locale of ["en", "zh"]) {
    const routeMeta = metadata[locale];
    const title = `${routeMeta.title} · ${locale === "zh" ? "AI 人名概念图谱" : "AI Eponym Atlas"}`;
    const description = routeMeta.description;
    const canonical = canonicalUrl(locale, path);
    const body = `<p class="static-entry__breadcrumb"><a href="${canonicalUrl(locale, "")}">AI Eponym Atlas</a> / ${escapeHtml(routeMeta.title)}</p><h1>${escapeHtml(routeMeta.title)}</h1><p class="lede">${escapeHtml(description)}</p>`;
    const schema = pageSchema({
      canonical,
      title,
      description,
      locale,
      pageType: "CollectionPage",
    });
    await emit(
      locale,
      path,
      pageShell({
        locale,
        path,
        title,
        description,
        body,
        schema,
        ogType: "website",
      }),
    );
    sitemapEntries.add(canonical);
  }
}

{
  const locale = "zh";
  const path = "";
  const title = "AI 人名概念图谱 — 读懂 AI 人名术语背后的思想";
  const description = catalog.meta.description.zh;
  const canonical = canonicalUrl(locale, path);
  const body = `<h1>AI 人名概念图谱</h1><p class="lede">${escapeHtml(description)}</p>`;
  const mainEntity = {
    "@type": "DefinedTermSet",
    "@id": atlasId,
    name: "AI 人名概念图谱",
    alternateName: "AI Eponym Atlas",
    description,
    url: `${siteRoot}/`,
    inLanguage: ["en", "zh-CN"],
    dateModified: catalog.meta.lastUpdated,
    license: contentLicenseUrl,
    creator: { "@id": creatorId },
  };
  const schema = pageSchema({ canonical, title, description, locale, mainEntity });
  await emit(
    locale,
    path,
    pageShell({
      locale,
      path,
      title,
      description,
      body,
      schema,
      ogType: "website",
    }),
  );
  sitemapEntries.add(canonical);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...sitemapEntries]
  .sort()
  .map(
    (url) =>
      `  <url><loc>${escapeHtml(url)}</loc><lastmod>${catalog.meta.lastUpdated}</lastmod></url>`,
  )
  .join("\n")}
</urlset>\n`;
await writeFile(resolve(outputRoot, "sitemap.xml"), sitemap);

const generatedPageCount =
  catalog.concepts.length * 2 +
  catalog.people.length * 2 +
  Object.keys(routeMetadata).length * 2 +
  1;
console.log(
  `Generated ${generatedPageCount} static entry pages and ${sitemapEntries.size} sitemap URLs.`,
);
