# Changelog

All notable editorial and product changes are recorded here. The catalog's
`meta.lastUpdated` field is the authoritative research cutoff.

## 0.3.0 — 2026-07-31

- Added a complete, searchable people-coverage ranking with 117 profile rows,
  direct count bars, competition ties, category-aware recomputation, and
  shareable URL state.
- Added a reader-facing relationship audit that distinguishes 120 unique
  concepts from 149 person–concept links, explains 26 shared eponyms, and shows
  the audited 96/15/2/3/1 per-person distribution.
- Added automated invariants for the count equation, every ranking row,
  histogram totals, link-weighted totals, and category-filtered ranking.
- Rebuilt the homepage around three clear reader intentions and a curated set
  of six widely useful concepts instead of mounting the complete atlas at once.
- Added four learning paths with concept-by-concept progress,
  previous/next navigation, and an explicit distinction between pedagogical
  order and historical causality.
- Corrected people-profile language so an eponymous association is never
  presented as proof that a namesake personally created every later term or use.
- Added reader-facing editorial standards for scope, evidence, portrait
  provenance, and corrections, plus a structured correction issue form.
- Improved Atlas results with mode-accurate counts, localized names and regions,
  visible search-match context, semantic result lists, and accessible mobile
  filtering; mobile concept results now open as full reading pages.
- Increased graph and timeline legibility, restored normal page scrolling over
  the graph, consolidated timeline controls, and improved keyboard navigation.
- Added strict KaTeX validation for every formula and fixed the unsupported
  Weisfeiler–Leman multiset notation.
- Hardened the automated source audit across concept citations, timeline
  evidence, identity records, and portrait provenance, with machine-readable
  reports and failure thresholds that detect an inconclusive all-warning run.
- Clarified that the catalog contains 247 citation links representing 235
  unique source URLs; concept-level references have claim-specific boundaries.
- Split major routes into lazy-loaded bundles and refreshed README, coverage,
  architecture, design-system, and contribution guidance for the new release.

## 0.2.0 — 2026-07-31

- Reframed the project around the reader-facing line “Understand the ideas
  behind the names in AI,” simplified explanatory copy across every major view,
  and established **Semantic Meridian** as the canonical cover and A–I–E icon
  system.
- Replaced project and editorial narration in the live experience with direct
  learning language, including clearer biography, attribution, graph, timeline,
  correction, and reading-guide copy.
- Added a restrained semantic emoji system to the reading guide and README,
  and linked the README homepage preview directly to the live atlas.
- Added live coverage totals to the homepage introduction, derived directly
  from the catalog so people, concepts, fields, and citations stay current.
- Expanded all 117 people profiles with complete introductions, localized
  lifespan and region facts, linked core contributions, deduplicated AI
  applications, and concept-grouped evidence and attribution.
- Kept profile evidence scopes explicit: concept citations support the linked
  concept's definition, history, and use claims, while Wikidata is labelled as
  an identity record rather than a complete biography source.
- Refined the homepage constellation with content-aware node sizing, sans-serif
  labels, boundary-safe connectors, a clearer Jacobian focus, and stable
  desktop, tablet, and mobile layouts.
- Expanded the atlas from 75 to 120 concepts and from 57 to 117 people.
- Raised the evidence floor to at least two direct sources per concept, for 247
  source links in the released catalog.
- Added active AI lineages around Langevin and Itô methods, Fokker–Planck
  evolution, Schrödinger bridges, Doob transforms, Wasserstein and Sinkhorn
  transport, preference models, modern Hopfield memory, Koopman operators,
  graph expressivity, and manifold learning.
- Added foundational coverage across numerical linear algebra, statistical
  bounds, constrained and non-smooth optimization, signal processing, sequence
  decoding, graph models, and classical computer vision.
- Added explicit coverage and currency policy, nullable or missing life-date
  handling, an expanded timeline, and regression tests for current AI search
  terms.
- Added 78 source-verified open portraits with file-level attribution, plus 39
  labelled monogram fallbacks and a repeatable portrait-candidate audit. No
  generated historical likenesses are used.
- Rebuilt the relationship graph as a deterministic, shareable exploration
  workspace with semantic and visual layers, real portraits, path emphasis,
  keyboard camera controls, fit/reset actions, and a responsive inspector.
- Rebuilt the timeline around a true-scale 1596–2025 overview, four editorial
  eras, event-kind filtering, URL-restorable selection, verified portraits,
  mobile inline details, and event-level evidence links.
- Codified the editorial design system, responsive visualization grammar,
  social-preview metadata, and repository documentation with current product
  screenshots and automated README consistency checks.
- Added installable-site metadata and icons, search-engine discovery files,
  route-aware social cards, deliberate vendor/data chunking, and pinned GitHub
  Actions for a smaller, safer production delivery.
- Added a monthly, retry-aware source-link audit alongside Dependabot and the
  existing content, type, test, documentation, and build quality gates.
- Removed synthetic UI studies whose invented labels or likenesses could be
  mistaken for catalog evidence.

## 0.1.0 — 2026-07-31

- Published the founding atlas, searchable website, relationship
  graph, timeline, contribution workflow, CI, and GitHub Pages deployment.
