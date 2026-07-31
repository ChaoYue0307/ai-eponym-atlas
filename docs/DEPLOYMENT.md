# Deployment / 部署

The production website is a static Vite build deployed to GitHub Pages through
GitHub Actions:

<https://chaoyue0307.github.io/ai-eponym-atlas/>

生产网站由 GitHub Actions 构建并部署到 GitHub Pages。

## Automatic production deployment / 自动部署

Every push to `main` triggers:

1. [CI](../.github/workflows/ci.yml): install with `npm ci`, type-check, test,
   and build.
2. [Deploy to GitHub Pages](../.github/workflows/deploy-pages.yml): run the
   complete check again, upload `dist/`, and deploy the artifact.

The deployment job uses the minimal required permissions:

- `contents: read`
- `pages: write`
- `id-token: write`

No application secrets or runtime environment variables are required.

## Repository settings / 仓库设置

In **Settings → Pages**:

- set **Source** to **GitHub Actions**;
- keep the production environment named `github-pages`; and
- use the workflow-generated deployment URL.

The default branch is `main`.

## Vite base path / 基础路径

The site is hosted below the repository path, so production assets use
`/ai-eponym-atlas/` as their base:

```ts
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/ai-eponym-atlas/' : '/',
})
```

Local development continues to use `/`. If the repository name, hosting mode,
or custom domain changes, update the base path and verify every static asset.

## Local release check / 本地发布检查

Requirements: Node.js 20.19+ and npm.

```bash
npm ci
npm run check
npm run preview
```

`npm run check` must pass TypeScript, all tests, and the production build before
deployment.

## Production verification / 线上验收

After the Pages job succeeds, verify:

- the English and Chinese homepages plus clean deep routes load directly;
- generated JS/CSS, portraits, the decorative WebP, and `og-card.jpg` return
  HTTP 200;
- the atlas contains the expected catalog counts;
- desktop and mobile layouts have no horizontal document overflow;
- the relationship graph shows its controls and legend;
- Chinese and English switching works;
- browser logs contain no application errors; and
- Open Graph metadata points to a 1200 × 630 `image/jpeg` asset.

GitHub Pages may cache successful deployments for several minutes. Check the
`Last-Modified` header or use a cache-busting query when confirming a new
release.

## Failure and rollback / 故障与回滚

1. Inspect the failed workflow job before retrying.
2. Reproduce with `npm ci && npm run check` locally.
3. Fix forward with a focused commit when practical.
4. If a production regression is urgent, revert the exact offending commit;
   do not rewrite shared `main` history.
5. Wait for both CI and Pages to complete, then repeat the production
   verification checklist.
