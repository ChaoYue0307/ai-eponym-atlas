import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const catalog = JSON.parse(await readFile(resolve("content/eponyms.json"), "utf8"));
const outputRoot = resolve("dist");
const siteRoot = "https://chaoyue0307.github.io/ai-eponym-atlas";
const imageUrl = `${siteRoot}/og-card.jpg`;
const peopleById = new Map(catalog.people.map((person) => [person.id, person]));
const conceptsById = new Map(catalog.concepts.map((concept) => [concept.id, concept]));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localePath(locale, path) {
  return locale === "zh" ? `/zh${path}` : path;
}

function canonicalUrl(locale, path) {
  return `${siteRoot}${localePath(locale, path)}/`;
}

function appUrl(locale, hashPath) {
  return `${siteRoot}/#${hashPath}?lang=${locale}`;
}

function pageShell({ locale, path, hashPath, title, description, body, schema }) {
  const canonical = canonicalUrl(locale, path);
  const alternateLocale = locale === "zh" ? "en" : "zh";
  const alternate = canonicalUrl(alternateLocale, path);
  const redirect = appUrl(locale, hashPath);
  const language = locale === "zh" ? "zh-CN" : "en";
  const schemaJson = JSON.stringify(schema).replaceAll("<", "\\u003c");
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${language}" href="${canonical}">
  <link rel="alternate" hreflang="${locale === "zh" ? "en" : "zh-CN"}" href="${alternate}">
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl("en", path)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="AI Eponym Atlas">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta http-equiv="refresh" content="0; url=${escapeHtml(redirect)}">
  <script type="application/ld+json">${schemaJson}</script>
  <style>
    :root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#10131a;background:#fff}
    body{max-width:760px;margin:0 auto;padding:64px 24px;line-height:1.65}
    h1,h2{font-family:Georgia,serif;font-weight:500;letter-spacing:-.025em;line-height:1.08}
    h1{font-size:clamp(2.6rem,8vw,5.5rem)}h2{margin-top:2.2rem}
    a{color:#003fc7}.eyebrow{color:#003fc7;font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
    .lede{font-size:1.18rem}.redirect{padding:16px 0;border-block:1px solid #d8dce3}
  </style>
  <script>window.location.replace(${JSON.stringify(redirect)})</script>
</head>
<body>
  <p class="eyebrow">AI Eponym Atlas · AI 人名概念图谱</p>
  ${body}
  <p class="redirect"><a href="${escapeHtml(redirect)}">${locale === "zh" ? "打开交互式图谱" : "Open the interactive atlas"}</a></p>
</body>
</html>`;
}

async function emit(locale, path, html) {
  const outputPath = resolve(outputRoot, localePath(locale, path).replace(/^\//, ""), "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

const sitemapEntries = new Set([`${siteRoot}/`]);

for (const concept of catalog.concepts) {
  for (const locale of ["en", "zh"]) {
    const localizedTerm = locale === "zh" ? concept.zhTerm : concept.term;
    const path = `/concept/${concept.id}`;
    const title = `${localizedTerm} · AI Eponym Atlas`;
    const description = `${concept.functionNickname[locale]} — ${concept.question[locale]}`;
    const namesakes = concept.personIds
      .map((personId) => peopleById.get(personId))
      .filter(Boolean)
      .map((person) => locale === "zh" ? person.zhName : person.name)
      .join(locale === "zh" ? "、" : ", ");
    const body = `
      <h1>${escapeHtml(localizedTerm)}</h1>
      <p class="lede">${escapeHtml(concept.functionNickname[locale])}</p>
      <h2>${locale === "zh" ? "它回答什么问题？" : "What question does it answer?"}</h2>
      <p>${escapeHtml(concept.question[locale])}</p>
      <h2>${locale === "zh" ? "直觉" : "Intuition"}</h2>
      <p>${escapeHtml(concept.intuition[locale])}</p>
      <h2>${locale === "zh" ? "为什么会出现在 AI 中" : "Why it appears in AI"}</h2>
      <ul>${concept.aiApplications.map((item) => `<li>${escapeHtml(item[locale])}</li>`).join("")}</ul>
      <h2>${locale === "zh" ? "命名来源" : "Namesake"}</h2>
      <p>${escapeHtml(namesakes || "—")}</p>
      <h2>${locale === "zh" ? "参考来源" : "References"}</h2>
      <ol>${concept.sourceLinks.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join("")}</ol>`;
    const schema = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: localizedTerm,
      alternateName: locale === "zh" ? concept.term : concept.zhTerm,
      description,
      url: canonicalUrl(locale, path),
      inDefinedTermSet: `${siteRoot}/`,
    };
    await emit(locale, path, pageShell({ locale, path, hashPath: path, title, description, body, schema }));
    sitemapEntries.add(canonicalUrl(locale, path));
  }
}

for (const person of catalog.people) {
  for (const locale of ["en", "zh"]) {
    const localizedName = locale === "zh" ? person.zhName : person.name;
    const path = `/person/${person.id}`;
    const title = `${localizedName} · AI Eponym Atlas`;
    const description = person.summary[locale];
    const linkedConcepts = person.concepts
      .map((conceptId) => conceptsById.get(conceptId))
      .filter(Boolean);
    const body = `
      <h1>${escapeHtml(localizedName)}</h1>
      <p class="lede">${escapeHtml(description)}</p>
      <h2>${locale === "zh" ? "承载其名的术语" : "Terms carrying this name"}</h2>
      <ul>${linkedConcepts.map((concept) => `<li><a href="${canonicalUrl(locale, `/concept/${concept.id}`)}">${escapeHtml(locale === "zh" ? concept.zhTerm : concept.term)}</a> — ${escapeHtml(concept.functionNickname[locale])}</li>`).join("")}</ul>`;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: localizedName,
      alternateName: locale === "zh" ? person.name : person.zhName,
      description,
      url: canonicalUrl(locale, path),
      sameAs: person.profileUrl ? [person.profileUrl] : undefined,
    };
    await emit(locale, path, pageShell({ locale, path, hashPath: path, title, description, body, schema }));
    sitemapEntries.add(canonicalUrl(locale, path));
  }
}

const routePages = [
  ["/atlas", "Explore the atlas", "探索完整图谱"],
  ["/paths", "Guided learning paths", "学习路径"],
  ["/graph", "Concept relationship graph", "概念关系图"],
  ["/timeline", "Historical timeline", "历史时间线"],
  ["/about", "How to read the atlas", "如何阅读图谱"],
];

for (const [path, englishTitle, chineseTitle] of routePages) {
  for (const locale of ["en", "zh"]) {
    const title = `${locale === "zh" ? chineseTitle : englishTitle} · AI Eponym Atlas`;
    const description = catalog.meta.description[locale];
    const body = `<h1>${escapeHtml(locale === "zh" ? chineseTitle : englishTitle)}</h1><p class="lede">${escapeHtml(description)}</p>`;
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: canonicalUrl(locale, path),
    };
    await emit(locale, path, pageShell({ locale, path, hashPath: path, title, description, body, schema }));
    sitemapEntries.add(canonicalUrl(locale, path));
  }
}

{
  const locale = "zh";
  const path = "";
  const title = "AI 人名概念图谱 · AI Eponym Atlas";
  const description = catalog.meta.description.zh;
  const body = `<h1>AI 人名概念图谱</h1><p class="lede">${escapeHtml(description)}</p>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI 人名概念图谱",
    alternateName: "AI Eponym Atlas",
    description,
    url: `${siteRoot}/zh/`,
    inLanguage: "zh-CN",
  };
  await emit(locale, path, pageShell({ locale, path, hashPath: "/", title, description, body, schema }));
  sitemapEntries.add(`${siteRoot}/zh/`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...sitemapEntries]
  .sort()
  .map((url) => `  <url><loc>${escapeHtml(url)}</loc><lastmod>${catalog.meta.lastUpdated}</lastmod></url>`)
  .join("\n")}
</urlset>\n`;
await writeFile(resolve(outputRoot, "sitemap.xml"), sitemap);

console.log(`Generated ${catalog.concepts.length * 2 + catalog.people.length * 2 + routePages.length * 2 + 1} static entry pages and ${sitemapEntries.size} sitemap URLs.`);
