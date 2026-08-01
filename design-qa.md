# Design QA — Concept Micro-Illustration System

## Evidence

- Accepted direction: `docs/design/concept-icon-field-guide-option-3.png`
- Final implementation capture: `docs/design/concept-icon-field-guide-implementation.jpg`
- Side-by-side comparison input: `/tmp/ai-eponym-icon-guide-comparison.png`
- Comparison viewport: 1487 × 1058 CSS pixels at DPR 1
- Compared state: **How to read → Visual intuition**, with all twelve field-guide entries visible
- Additional live checks: Home, Atlas, Learning paths, Graph, concept detail, and the About field guide at 320, 390, 1200, 1280, 1440, and 1487 pixels wide

## Visual comparison

1. **Structure:** both versions use a true-white editorial surface, an open three-column ruled grid, numeric indexing, and generous whitespace.
2. **Palette:** production preserves the accepted cobalt, ink-black, soft gray, and restrained vermilion accents.
3. **Icon grammar:** every icon is text-free, uses rounded fine strokes, one dominant action, and a consistent 48 × 48 coordinate system.
4. **Typography:** production preserves the reference's serif concept names, compact sans-serif explanatory copy, and monospaced blue numerals while using the atlas's existing type tokens.
5. **Meaning:** the twelve production metaphors retain the reference's central actions—position, distance, uncertainty, belief update, transition, frequency decomposition, sensitivity, curvature, tangent iteration, information, divergence, and transport.
6. **Containment:** labels, secondary-language names, arrows, and illustrations remain inside every grid cell. No clipping, overlap, or horizontal overflow was found.
7. **Responsiveness:** the three-column reference becomes a single readable column on mobile; the secondary-language label moves to its own line instead of wrapping into orphan characters.
8. **Product integration:** the same semantic system is used across all 120 catalog concepts in search results, details, graph nodes, guided paths, and homepage entry points.

## Copy review

The generated reference heading, “Concept icon field guide,” became the reader-facing “Give every concept a visual memory.” This keeps the section inside the existing **How to read** narrative rather than presenting design-process language to readers. Catalog terms, Chinese names, and functional nicknames come from the real concept data; no mathematical or historical claim was added for visual effect.

## Intentional deviations

- The accepted image is the visual direction, not a raster asset sheet. Production uses catalog-bound vectors so the icons stay sharp, recolor through existing states, remain accessible beside visible labels, and can be reused across 120 records and multiple sizes.
- Production preserves the atlas's established AI Eponym Atlas header and Semantic Meridian design language rather than copying the generated mock's page title verbatim.
- A few reference metaphors were simplified at row and graph sizes to keep their core action legible at 24–44 pixels. Distinguishing geometry is never color-only.

## Issues found and resolved

- Featured icons were unintentionally reduced to arrow size; selectors now target only trailing arrows.
- Primary strokes used a fixed color; they now inherit state color for hover and selected feedback.
- Atlas rows could collapse between 1081 and 1260 pixels; compact detail-open columns now reserve the icon track and hide nonessential fields.
- Graph icons could collide with multiline labels and had inconsistent sizing; every concept icon is centered at 24 × 24 with explicit SVG geometry and zero measured label overlap.
- The 320-pixel learning-path grid was too dense; it now uses a single column with contained labels and icons.
- Detail icons repeated adjacent screen-reader text; adjacent visible headings now carry the name while the icon is decorative.
- Mobile secondary-language labels could form orphaned characters; they now render as a separate line.
- README screenshots showed the pre-icon interface; both current screenshots now show the semantic icon system.

## Verification

- Browser console warnings/errors: 0 across the tested Home, Paths, About, Atlas, and Graph states.
- Layout scan: 0 overflowing target components and 0 out-of-bounds concept icons across six representative viewport/route combinations.
- Graph: 9 concept nodes in the focused two-hop view, all `x=-12`, `width=24`, `height=24`, with 0 icon/label overlaps.
- Core flow: searched `Bayes`, received 13 ranked results, selected **Bayes' theorem**, and reached `?q=Bayes&focus=bayes-theorem` with the correct detail icon and content.
- Automated checks: TypeScript, Markdown lint, 54/54 tests, production build, static page generation, sitemap, SEO audit, and bundle budget all pass.
- Icon coverage test: exactly 120 unique catalog IDs, with no missing or extra icon.

No P0, P1, P2, or unresolved P3 issue remains in the reviewed scope.

final result: passed
