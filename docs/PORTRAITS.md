# Portrait provenance and licensing / 肖像来源与许可

AI Eponym Atlas uses real portraits only when both the person and the image's
reuse terms can be checked. It does not generate historical likenesses or use
unattributed images from search results.

AI Eponym Atlas 仅在人物身份与图片再利用条款都可核验时使用真实肖像；项目不会生成历史人物长相，也不会采用搜索结果中来源不明的图片。

## Verification workflow / 核验流程

1. Match the atlas name and lifespan to a Wikidata entity.
2. Use that entity's [image (P18)](https://www.wikidata.org/wiki/Property:P18)
   statement to locate the candidate Wikimedia Commons file.
3. Read the file's creator, copyright status, and license through the
   [MediaWiki Imageinfo API](https://www.mediawiki.org/wiki/API:Imageinfo).
4. Accept only material whose normalized license name exactly matches the
   public-domain, CC0, CC BY, or CC BY-SA allowlist and whose identity match is
   sufficiently clear. Exact matching prevents restricted variants such as
   CC BY-NC from passing a prefix check.
5. Save a bounded Wikimedia-generated thumbnail in `public/portraits/` and
   record the exact source URL, file-description page, creator, license, license
   link, accessible alt text for each locale, and verification date in
   `content/people-media.json`.
6. Display the credit and license on the person's detail page. If a local image
   is missing or fails to load, the interface falls back to the person's
   monogram.

Run `npm run portraits:sync` to restore missing local files. Maintainers can
run `npm run portraits:sync -- --force --refresh-thumbnails` to refresh all
source URLs through the Commons API and rebuild the local copies as
web-sized 320 px thumbnails.

Run `npm run portraits:audit` to recheck Wikidata P18 candidates for profiles
that still use initials. For a broader discovery pass, use
`npm run portraits:audit -- --search --accepted-only`. Commons search results
are always reported as `IDENTITY_REVIEW_REQUIRED`: an acceptable license does
not establish that the pictured person is the atlas namesake. Known disputed
files remain explicit `KNOWN_REJECT` results with a recorded reason.

Every atlas person has a record in `content/people-media.json`, including
entries without a verified Wikidata identity or portrait. A person-only record
is an explicit unresolved state, not an invitation to infer an identity from a
similar name.

The policy follows Wikimedia Commons' own
[reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en):
each file may have different attribution and license requirements, and a
Commons listing is not a warranty. Public-domain portraits are credited as a
matter of provenance even when attribution is not legally required in a given
jurisdiction.

## Repository licensing / 仓库许可边界

Portrait files are third-party works. They are **not** automatically covered by
the repository's MIT code license or the default CC BY 4.0 content license.
Every portrait keeps the license recorded beside it in
`content/people-media.json`; the linked Wikimedia Commons file page is the
authoritative reuse record.

肖像属于第三方作品，不自动适用仓库的 MIT 代码许可或默认 CC BY 4.0 内容许可。每张图片的具体许可记录在 `content/people-media.json`，相应 Wikimedia Commons 文件页是再利用信息的权威入口。

## Corrections and removal / 更正与移除

If an identity match, attribution, copyright status, or personality-rights
issue is disputed, open an issue with the person ID and Commons file URL. The
safe default is removal of the portrait while the text entry and monogram
remain available.

若人物对应、署名、版权状态或人格权存在争议，请在 issue 中提供人物 ID 与 Commons 文件链接。核验期间默认移除肖像，文字条目与首字母占位仍然保留。
