# Portrait verification audit — 2026-07-31

This audit records the repository-wide portrait review and its targeted
follow-up for AI Eponym Atlas. It is a provenance and licensing check, not a
claim that every historical likeness is contemporary or unquestionably
authentic.

## Results

| Measure | Count |
| --- | ---: |
| People reviewed | 117 |
| Media audit records | 117 |
| Verified Wikidata identity records | 116 |
| Accepted open portraits | 78 |
| Monogram fallbacks | 39 |
| Broken or missing checked-in image files | 0 |

Accepted portrait licenses:

| License | Count |
| --- | ---: |
| Public domain | 48 |
| CC0 1.0 | 1 |
| CC BY 3.0 / 4.0 | 4 |
| CC BY-SA 2.0 DE | 12 |
| CC BY-SA 3.0 | 5 |
| CC BY-SA 4.0 | 8 |

## Fail-closed decisions

- The commonly circulated image attributed to **Thomas Bayes** was rejected:
  its Commons description says the identification is disputed and likely
  incorrect.
- A **Dennis Gabor** image described as public domain only in the United States
  was excluded from the globally served site.
- **Donald Whitney** retains a monogram because the pass did not find an
  unambiguous Wikidata identity and freely reusable portrait.
- **Euclid** uses a much later artistic depiction, and its localized alt text
  says so rather than presenting it as a life portrait.

## Second-pass discovery

The follow-up rechecked Wikidata P18 claims and ran exact-name Wikimedia
Commons searches with the accepted-license filter. Search results were treated
as leads requiring manual identity review, never as automatic matches.

- The P18 candidate for **Sophus Lie** was still rejected because “no known
  copyright restrictions” is not an explicit accepted license. A separate,
  clearly identified 1881 photograph by Ludwik Szaciński was then found on
  Commons with an explicit Public Domain Mark and accepted after visual review.
- The Wilfred Hastings query surfaced a photograph of **Bill Hastings**, a
  different person. It was rejected despite being a name-adjacent search
  result, illustrating why license checks cannot substitute for identity
  checks.
- Other accepted-license search results were similarly left as fallbacks when
  identity could not be established. The final inventory is therefore 78
  verified portraits and 39 monograms.

## Display review

All 78 files were downloaded into `public/portraits/`, checked as decodable
images, and reviewed together in a crop contact sheet. Person-specific crop
focus is recorded only where the subject is off-center or appears in a wider
archival photograph. The UI uses the same reusable component on the people
list, concept namesake section, and person page; loading failure returns to the
monogram.

The repository test suite checks that every media record points to an existing
person, every local image exists, URLs use the expected Wikidata / Wikimedia
hosts, creator and localized alt text are present, and each license is in the
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

Candidate matching and metadata checks use an exact license allowlist,
fail-closed identity rules, local file validation, and a visual crop review.
Automated discovery remains advisory; only manually verified matches enter the
portrait inventory.
