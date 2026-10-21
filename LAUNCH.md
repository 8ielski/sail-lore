# Sail Lore domain launch

## Current preparation

Prepared for `https://sail-lore.com/`, using the existing Cloudflare Pages project, `sail-lore`. GitHub deployment checks identify this project; `sail-lore-review` is the older preview hostname.
No DNS, custom-domain, Notion publishing, or email settings have been changed.
The preview remains the review location until the custom domain is connected.

Changes:
- Homepage and all 12 article pages declare their own preferred (canonical) main-domain URL.
- Main-domain pages permit indexing. `robots.txt` references a 13-URL sitemap.
- `public/_headers` excludes the existing Pages hostname and its branch/deployment subdomains from indexing using `X-Robots-Tag: noindex, nofollow`. This follows Cloudflare's documented host-specific header syntax; confirm actual response headers after deployment. Do not remove this file when connecting the custom domain.
- `public/_redirects` preserves 44 exact legacy Notion paths/IDs known from `lib/content.ts`. Article paths redirect to the corresponding local article; Bio, Sample Services, and Seasaurus remain on `bielski.notion.site`.
- Desktop Seasaurus and Services links now point to their actual Notion destinations instead of nonexistent section fragments.
- The mobile menu opens/closes, closes after selection or Escape, and returns focus to its button after Escape.

## Validation

- Production build, including TypeScript: passed.
- ESLint and `git diff --check`: passed.
- Generated homepage and 12 article pages: individual canonical URLs, index directives, all internal page/fragment destinations, retained greeting, and absence of the removed numbers checked.
- Sitemap: 13 distinct main-domain URLs checked.
- Exported Cloudflare configuration and local redirect destinations checked. Cloudflare's actual redirect/header processing still needs verification on a deployed branch.
- Chromium browser at 390 × 844: mobile menu opens, links are present, Contact navigation closes the menu, Escape closes it and restores button focus. Desktop navigation and direct article entry also checked, with no browser JavaScript errors. This is a browser check at iPhone dimensions, not a physical iPhone/Safari test.
- 18 external URLs returned HTTP 200, including all 15 Notion destinations, LinkedIn, and both related-project sites. HTTP 200 confirms a response. Subsequent anonymous-browser checks are recorded below.
- Twitter could not be verified: proxy CONNECT returned 403. This does not establish a broken Twitter link.
- Current `sail-lore.com` homepage, robots.txt, sitemap.xml, and Pages preview returned HTTP 403 to automated requests. Therefore the existing site's full URL inventory and the live deployment headers could not be inspected.

## Before changing DNS

1. Review this branch's Pages deployment on a phone and desktop.
2. In a signed-out/private browser, open Bio, Sample Services, and Seasaurus. Keep these pages published on Notion when disconnecting the old custom domain; changing DNS does not migrate their content.
3. Supply any important old bookmark URLs not represented in the known redirects. There is no catch-all redirect: unknown old URLs may return 404, and Notion block fragments cannot be mapped without their original content.
4. Confirm the Pages preview sends `X-Robots-Tag: noindex, nofollow`; test one legacy article URL and one legacy Notion-only URL against this deployment. A basic local file server does not execute Cloudflare rules.
5. Merge the reviewed launch branch into `main` and wait for a successful Pages build.

## Domain switch (separate action)

1. In the existing Pages project, use Custom domains → Set up a custom domain for `sail-lore.com`. Use Cloudflare's setup flow to replace the existing website record. Do not change MX, SPF, DKIM, DMARC, or unrelated DNS records.
2. Decide on `www`: connect it and configure a redirect to `https://sail-lore.com`, or keep it unused deliberately. Do not leave it pointing at the old site. Cloudflare's account redirect settings can perform this redirect.
3. Wait for the custom domain and certificate to become active.
4. Verify homepage, all articles, mobile navigation, email link, the three Notion links, robots.txt, sitemap.xml, and sample legacy redirects over HTTPS. Confirm the main domain has no `noindex` response header while Pages hosts do.
5. Optionally submit the sitemap to Google Search Console after launch. Indexing is not immediate or guaranteed.

## Rollback

Before the switch, record the existing website DNS record(s) and Notion domain settings. If launch fails, restore those website records while investigating. Keep the Notion content published and preserve all email records throughout.

## Follow-up verification

- GitHub reports the launch commit's **Cloudflare Pages** deployment succeeded under project `sail-lore`; its branch URL is https://prepare-domain-launch.sail-lore.pages.dev/.
- A separate **Workers Builds: sail-lore** check failed. This is distinct from the successful Pages deployment. Do not use the Workers check as the Pages launch result; the duplicate integration can be reviewed separately.
- Preview indexing rules now use Cloudflare's documented generic `:project.pages.dev` and `:branch.:project.pages.dev` patterns to cover both old and actual project names.
- **Anonymous-browser Notion verification: passed.** A fresh Chromium context with no Notion login rendered the actual Bio, Sample Services, and Seasaurus page titles and body content. Network requests used the session proxy and configured CA trust. Nonessential images/telemetry were blocked in this environment, but the page text rendered.
- **Live Pages headers/redirect verification: blocked.** The network proxy denied CONNECT to the actual branch hostname. Required hosts were saved in the environment draft, but runtime access has not been confirmed. Apply the saved network settings and retry; do not label this check passed based solely on build success.
- The launch branch's corrected `_headers` file was rebuilt successfully and copied into `out/_headers` before committing.
