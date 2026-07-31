# Generated visual assets / 生成式视觉素材

AI Eponym Atlas uses generated imagery only for decorative editorial artwork.
Definitions, formulas, timelines, relationship graphs, labels, and historical
likenesses remain code-native or source-verified so that readers can inspect,
select, navigate, and verify them.

AI Eponym Atlas 仅将生成式图片用于装饰性的编辑插图。定义、公式、时间线、关系图、文字标签与历史人物肖像继续采用代码原生或经来源核验的素材，以保持可检查、可选择、可导航与可验证。

## Semantic Strata / 语义地层

| Field | Record |
| --- | --- |
| File | `public/illustrations/semantic-strata.webp` |
| Purpose | Decorative underlay beneath the exact, interactive homepage SVG constellation |
| Generated | 2026-07-31 with ChatGPT built-in image generation |
| Source output | 1672 × 940 PNG after a targeted refinement pass |
| Production output | Center-cropped 1440 × 880 WebP, 24 KB |
| Accessibility | Empty `alt`, `aria-hidden="true"`; hidden in forced-colors and reduced-data modes |
| Informational role | None; the SVG above it is the sole semantic and interactive layer |

### Semantic-strata production prompt

> Use case: stylized-concept. Asset type: subtle decorative underlay for the
> homepage hero figure of an editorial AI mathematics atlas website. Create an
> abstract “semantic strata” artwork that evokes layers of meaning being
> uncovered, without depicting any actual mathematical concept. Use a
> front-facing sheet of clean archival white paper with extremely subtle
> blind-embossed contour bands and a few continuous, non-representational ink
> traces. The style should combine refined Swiss-editorial printmaking with
> museum-catalog paper relief: precise, quiet, intellectual, spacious, premium,
> and not futuristic. Use a landscape 18:11 composition with balanced edge
> activity, a calm low-detail center, generous white space, and no focal object.
> Lighting is soft and diffuse with minimal shallow relief and no dramatic
> shadows. Use true white `#FFFFFF`, very pale cool gray `#F8F9FB`, sparse cobalt
> `#003FC7` hairlines, restrained near-black `#10131A` traces, and one tiny
> vermilion `#EF4328` accent occupying under 2% of the image. Use fine uncoated
> paper grain, blind embossing, and crisp ink. No text. Decorative abstraction
> only, very low contrast overall, and no content that could be mistaken for
> data or a diagram.

### Negative constraints

No text, letters, numbers, formulas, equations, mathematical symbols, labels,
arrows, axes, grids, plots, charts, tables, node-link networks, constellations,
closed diagram circles, flowcharts, maps, UI elements, logos, monograms,
portraits, faces, silhouettes, hands, identifiable people, books, blackboards,
robots, brains, circuit boards, glowing neon, sci-fi HUD, 3D glass, glossy
gradients, lens flare, heavy shadows, visual clutter, watermark, or signature.

### Refinement pass

The first generated version contained long cobalt and near-black ink traces.
Because those traces could be mistaken for real graph edges, a targeted edit
removed every continuous colored line while preserving the paper relief,
lighting, texture, whitespace, and framing. The production crop also excludes
the remaining isolated edge ticks. The result contains no visual mark that can
be read as a relationship encoded by the atlas.

### Refinement prompt

> Use case: precise-object-edit. Edit only the supplied image. Remove every
> long or continuous cobalt, near-black, or colored line from the artwork,
> including the blue arcs, black strokes, and the red connecting curve. Those
> lines can be mistaken for meaningful relationship edges behind a data
> visualization. Preserve the archival white paper, blind-embossed relief,
> subtle contour ridges, paper grain, diffuse lighting, generous whitespace,
> composition, framing, and aspect ratio. The finished image should read as
> quiet white-on-white paper topography only. If any color remains, restrict it
> to a few tiny isolated edge ticks that cannot connect nodes or imply a path.
> Do not add text, letters, numbers, formulas, mathematical symbols, arrows,
> axes, grids, plots, charts, tables, nodes, networks, constellations, people,
> portraits, logos, UI, objects, gradients, watermarks, or signatures. Keep the
> center calm and low-detail. No other changes.

### Implementation safeguards

- The generated image is a separate `<img>` beneath the SVG, never a replacement
  for the graph.
- It cannot receive pointer events and does not enter the accessibility tree.
- Fixed intrinsic dimensions prevent layout shift.
- WebP compression keeps the asset below the repository's 180 KB regression
  threshold.
- The page omits the asset in reduced-data and forced-colors modes.

## Social preview / 社交分享图

| Field | Record |
| --- | --- |
| File | `public/og-card.jpg` |
| Purpose | Open Graph and large Twitter/X link preview |
| Generated | 2026-07-31 with ChatGPT built-in image generation |
| Source output | 1731 × 909 PNG |
| Production output | 1200 × 630 JPEG, approximately 182 KB |
| Text verification | English title, Chinese title, tagline, and URL checked against repository copy |
| Informational role | Decorative project identity only; it is not mathematical or historical evidence |

The A–I–E mark at the upper left is also cropped into `brand-mark.png`,
`icon-192.png`, `icon-512.png`, and `apple-touch-icon.png`. The blue **I** keeps
all three initials legible at small sizes and avoids the previous A–E reading.

### Social-card production prompt

> Use case: ads-marketing. Asset type: GitHub README cover and Open Graph social
> card for an educational open-source project. Create a premium contemporary
> editorial cover for AI Eponym Atlas, using a Swiss grid and scientific-atlas
> visual language. Use warm ivory paper, subtle embossed topographic contours,
> sparse mathematical arcs and nodes, near-black ink, vivid ultramarine, and one
> tiny vermilion accent. Use an exact 1200:630 landscape composition with
> generous margins. Place an original monogram at the upper left that clearly
> includes **A**, **I**, and **E**, never only A and E. Render exactly once:
> “AI Eponym Atlas”, “AI 人名概念图谱”, “Understand the ideas behind
> the names in AI.”, and “chaoyue0307.github.io/ai-eponym-atlas”. Keep the text
> perfectly legible. No extra words, portraits, fake equations, generic AI
> brains, circuit-board imagery, neon, mockup frame, 3D logo, watermark, or
> decorative clutter.

## Rejected UI concept studies

Seven generated UI studies were reviewed on 2026-07-31 and deliberately
excluded from the repository. They contained synthetic labels, relationships,
counts, or historical likenesses that could not be guaranteed to match the
catalog. Keeping them—even as mockups—would weaken the atlas's visual-truth
contract.

The accepted Graph and Timeline designs were therefore implemented and
evaluated directly in React, CSS, semantic HTML, and SVG:

- Graph nodes and edges come only from the typed catalog.
- Timeline dates, kinds, era counts, and event evidence come only from the
  curated timeline data.
- Historical portraits come only from the audited media catalog.
- README images are captures of the working application.

Generated imagery remains limited to non-informational editorial artwork: the
paper underlay and the social cover documented above.
