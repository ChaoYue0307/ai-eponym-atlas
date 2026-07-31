# Portrait verification audit — 2026-07-31

This audit records the first repository-wide portrait pass for AI Eponym Atlas.
It is a provenance and licensing check, not a claim that every historical
likeness is contemporary or unquestionably authentic.

## Results

| Measure | Count |
| --- | ---: |
| People reviewed | 117 |
| Verified Wikidata identity records | 116 |
| Accepted open portraits | 77 |
| Monogram fallbacks | 40 |
| Broken or missing checked-in image files | 0 |

Accepted portrait licenses:

| License | Count |
| --- | ---: |
| Public domain | 47 |
| CC0 1.0 | 1 |
| CC BY 3.0 / 4.0 | 4 |
| CC BY-SA 2.0 DE | 12 |
| CC BY-SA 3.0 | 5 |
| CC BY-SA 4.0 | 8 |

## Fail-closed decisions

- The commonly circulated image attributed to **Thomas Bayes** was rejected:
  its Commons description says the identification is disputed and likely
  incorrect.
- A **Sophus Lie** candidate marked only “no known copyright restrictions” was
  rejected because it did not provide an explicit accepted public-domain or
  Creative Commons basis.
- A **Dennis Gabor** image described as public domain only in the United States
  was excluded from the globally served site.
- **Donald Whitney** retains a monogram because the pass did not find an
  unambiguous Wikidata identity and freely reusable portrait.
- **Euclid** uses a much later artistic depiction, and its bilingual alt text
  says so rather than presenting it as a life portrait.

## Display review

All 77 files were downloaded into `public/portraits/`, checked as decodable
images, and reviewed together in a crop contact sheet. Person-specific crop
focus is recorded only where the subject is off-center or appears in a wider
archival photograph. The UI uses the same reusable component on the people
list, concept namesake section, and person page; loading failure returns to the
monogram.

The repository test suite checks that every media record points to an existing
person, every local image exists, URLs use the expected Wikidata / Wikimedia
hosts, creator and bilingual alt text are present, and each license is in the
accepted family.

## Reproducibility and limitations

- Identity matching used names, occupations, and available lifespan data from
  Wikidata.
- Portrait provenance and license metadata came from each Wikimedia Commons
  file page and the MediaWiki Imageinfo API.
- `npm run portraits:sync` reproduces the local asset download with a declared
  user agent, rate limiting, and retry backoff.
- Wikimedia metadata can change and is not a legal warranty. Personality,
  privacy, moral-rights, and jurisdiction-specific restrictions may still
  apply independently of copyright.
- Some historical images are later artistic depictions rather than photographs
  or life portraits. Accessible descriptions should preserve that distinction.

AI-assisted research was used to organize candidate matching and metadata
checks. Automated results were constrained by an explicit license allowlist,
fail-closed rules, local file validation, and a visual crop review.
