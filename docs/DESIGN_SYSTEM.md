# AI Eponym Atlas Design System

The atlas is an editorial research instrument, not a generic dashboard. Its
visual language should make unfamiliar names easier to decode while keeping
mathematical definitions, historical evidence, and modern AI applications
clearly distinct.

## Product principles

1. **Meaning before decoration.** Every visual element should clarify identity,
   category, relationship, chronology, provenance, or interaction state.
2. **Evidence stays visible.** Definitions, attribution notes, source links,
   review dates, and limitations must remain close to the claims they support.
3. **Names lead to understanding.** Pages should move from the formal eponym to
   the question, intuition, mathematics, history, relationships, and AI use.
4. **Language parity.** Chinese and English are equal product states,
   not a primary interface plus a translated afterthought.
5. **Quiet confidence.** Prefer precise typography, whitespace, thin rules, and
   a small number of strong visual moments over decorative card grids.

## Visual foundation

### Color roles

| Role | Token | Default | Meaning |
| --- | --- | --- | --- |
| Paper | `--paper` | `#ffffff` | Primary page and canvas background |
| Subtle paper | `--paper-subtle` | `#f8f9fb` | Secondary controls and quiet bands |
| Ink | `--ink` | `#10131a` | Primary text and people |
| Muted ink | `--muted` | `#606773` | Supporting copy and metadata |
| Rule | `--line` | `#d8dce3` | Structure without heavy containers |
| Cobalt | `--blue` | `#003fc7` | Focus, concepts, publications, links |
| Amber | `--naming` | `#875d00` | Naming history and terminology |
| Vermilion | `--red` | `#bd3424` | AI applications and adoption |

Color is never the sole carrier of meaning. Graph relationships also use line
style and direction; timeline events also use icons, shapes, and labels.

### Typography

- **Editorial serif:** page titles, concept names, people names, event titles,
  and explanatory pull quotes.
- **Interface sans:** controls, descriptions, navigation, metadata, and source
  text.
- **Monospace:** years, section numbers, compact counts, formulas where a
  typeset mathematical renderer is not appropriate, and technical status.
- Control typography is explicitly sized and weighted. Browser-default button
  and form styling is not acceptable.

### Geometry

- Use true-white open layouts, rails, lists, tables, and canvases.
- Use 1 px rules for structure and small 3–6 px radii for interactive controls.
- Avoid nested cards, large rounded containers, glass effects, neon glows, and
  decorative gradients.
- Primary touch targets are at least 44 px where the layout allows; no required
  interaction depends on hover.

### Brand identity: Semantic Meridian

**Semantic Meridian** is the canonical identity. Its mark combines black **A**
and **E** letterforms with a tall cobalt **I**, crossed by one open diagonal
meridian and punctuated by a single vermilion diamond. A fine square rule gives
the mark a stable atlas frame.

- Preserve all three letters at every size; never collapse the mark to A–E.
- Keep the meridian open and diagonal; do not replace it with a circular orbit.
- Use archival paper, cartographic rules, and index-tab layers only as quiet
  supporting motifs.
- Production reference artwork: [`public/og-card.jpg`](../public/og-card.jpg).

## Semantic visual grammar

| Entity or relation | Visual form |
| --- | --- |
| Person | Circle; verified archival portrait when available |
| Concept | Cobalt-outlined rectangle with formal term and functional label |
| AI application | Vermilion-outlined hexagon |
| Publication | Cobalt circle plus publication icon and text label |
| Naming event | Amber hexagon plus naming label |
| Named after | Cobalt dashed directional edge |
| Related concept | Neutral solid edge |
| Applied in AI | Vermilion dotted directional edge |
| Focused or selected | Stronger border, visible focus ring, and adjacent-path emphasis |

Generated images must never replace data-bound diagrams, mathematical figures,
historical evidence, or portraits of real people.

## Core component families

- **Brand:** A–I–E mark, English name, optional Chinese lockup, quiet navigation.
- **Page intro:** section number, serif heading, rule, short purpose statement.
- **Buttons:** primary, secondary, text, and icon variants with consistent focus,
  hover, pressed, disabled, and coarse-pointer behavior.
- **Search:** labelled input or accessible combobox, visible results state, clear
  keyboard path, and mobile keyboard-safe placement.
- **Inspector:** selected-item context without hiding or destroying the primary
  visualization state.
- **Evidence link:** real anchor semantics so URLs can be copied, opened in a new
  tab, and understood by assistive technology.
- **Portrait:** one reusable treatment with monogram fallback and visible
  attribution on profile surfaces.
- **Person profile:** localized introduction and lifespan/region facts
  lead into terms carrying the person's name, deduplicated AI applications, and
  evidence grouped under the concept whose claims it supports.
- **Learning path:** an open, ruled sequence with visible progress and previous
  and next steps; pedagogical order must never be presented as historical causality.

Person pages keep identity evidence and concept evidence distinct. Wikidata is
labelled as an identity record, not a complete biography. Concept links support
the corresponding definition, history, attribution, or use claims; their visual
grouping must not imply that they source every biographical statement.

## Visualization standards

### Relationship graph

- Default to a curated, deterministic viewport centred on the focus concept.
- People, first-hop concepts, second-hop concepts, and AI applications occupy
  meaningful layers.
- Avoid silent truncation. When the full neighbourhood is intentionally
  bounded, show `displayed / available` counts and a clear expansion path.
- Selection highlights incident edges and de-emphasises unrelated context.
- A semantic adjacency list must expose every rendered relation without
  requiring sight or pointer hover.
- Mobile leads with the graph; filters move to a compact sheet or disclosure.

### Historical timeline

- A compact overview positions events against the real 1596–2025 span.
- The narrative list groups events into readable eras and never pretends its
  vertical spacing is a strict time scale.
- People, publication, naming, and AI adoption remain distinguishable.
- Filters, era, and selected event should be shareable and restorable through
  the URL.
- Mobile presents the year and type above a full-width event body so the first
  milestone enters the first viewport.

### People coverage ranking

- Distinguish unique people, unique concepts, and person–concept links before
  presenting any rank. Never imply a one-to-one mapping.
- Use a semantic ordered list with direct numeric labels; cobalt bars provide
  comparison but never carry information on their own.
- Competition ranks preserve ties. Counts mean distinct entries in the current
  catalog, not historical importance, authorship, or total output.
- Search narrows visible rows while field filters recompute counts within the
  selected field. Both states remain shareable in the URL.
- On mobile, keep rank, portrait, name, exact count, linked terms, and bar in
  normal reading order without horizontal scrolling.

## Images and generated assets

- Real people use source-verified, openly licensed portraits only. The current
  catalog contains 78 verified portraits and 39 visibly labelled monogram
  fallbacks.
- Never generate a historical likeness. When identity or globally reusable
  rights cannot be verified, retain the monogram and explain the fallback on
  the profile.
- Generated editorial art may support branding or orientation, but it must not
  fabricate historical people, publications, formulas, evidence, or data.
- Production screenshots must show the current product state, contain no
  private data, use stable aspect ratios, and stay small enough for fast README
  loading.
- Every third-party or generated asset must have provenance and license
  documentation.

## Responsive and accessibility contract

- Desktop, mobile portrait, and wide mobile states are sibling designs.
- The main evidence appears before secondary control stacks on narrow screens.
- Text remains usable at 200% zoom and at 320 px viewport width.
- Focus is visible; reading order follows visual order; state changes are
  announced when they materially change results.
- Motion explains selection, reveal, or re-layout and respects
  `prefers-reduced-motion`.
- Forced-colors and non-color encodings remain meaningful.

## Repository and README presentation

- README visuals are captured from the current application, not stale mockups.
- The first screen communicates purpose, evidence, and a clear live-product
  path without repeating the same tagline.
- Mermaid diagrams are used for repository structure and conceptual flow when
  they are clearer than prose.
- Statistics are derived from the catalog and protected by tests.
- Emojis are semantic wayfinding, not decoration; one emoji per major section
  is usually enough.

## Review checklist

Before release, compare the accepted visual concept and rendered implementation
at desktop and mobile sizes. Review:

1. content and localized copy;
2. information hierarchy and first-viewport balance;
3. typography and control text;
4. semantic color, shape, line, and icon usage;
5. spacing, alignment, borders, and container model;
6. focus, selection, filtering, navigation, and URL restoration;
7. image provenance, crop, loading, and fallbacks;
8. identity-record, concept-evidence, and biography-source labels;
9. keyboard, screen-reader, reduced-motion, forced-colors, and zoom behavior.
