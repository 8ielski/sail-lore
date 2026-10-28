# Canvas pilot: reading pages and Notion publishing

This branch implements the first review stage only. Do not merge into `main` until the Canvas design is approved. The other 11 notes retain their current overlays, and the undecided logo remains on its separate branch.

## Review locations

- `/notes/canvas/`: standalone Canvas reading page, using the current text until a real Notion import is reviewed.
- `/article-layout-preview/`: development-only fixture for an opening image, multiple inline figures, captions, lists, quote, and a scrolling table. Its schematic images are test placeholders, not proposed artwork. It is excluded from the sitemap and marked noindex. Remove this fixture route before a production merge.
- `/`: Canvas's card is a native link. Other cards keep their existing behavior. Next/previous overlay navigation into Canvas also opens the reading page.

## Site map for this stage

```
Home /
  About /#bio
  Lore and apparent wind (home sections)
  Knotes collection /#notes
    Canvas /notes/canvas/ — reading-page pilot
    Other 11 /notes/<id>/ — existing presentation until approval
  Audience / creative-process context
  Contact /#contact
External Notion: full bio, services, Seasaurus
```

## Secure Notion connection (owner action)

No Notion credential was configured when this was implemented. A `NOTION_TOKEN` requirement and its `api.notion.com` destination were saved in the Codex environment draft; no secret value was supplied. This does not create a Notion integration or connect a workspace automatically.

1. In Notion's integrations settings, create an **internal integration** in the workspace containing Canvas. Give it **Read content** capability; writing back to Notion is not needed.
2. Open the original Canvas page, use its Connections menu to add that integration, and ensure the integration can read any blocks in that page. Public web access alone does not grant API access.
3. Enter the integration token securely as `NOTION_TOKEN` in this Codex environment's settings. Review/save the draft and publish the development environment if prompted. Never paste the token into chat, source files, GitHub, or the public Notion page. Environment publication is separate from website deployment.
4. Once access is applied, run the refresh below. If a downloaded image is blocked by the network policy, identify its hostname without copying signed URL parameters into chat and add only the required destination through environment settings.

The immutable initial allowlist is Canvas page `76a9a8d1f4d149f089c4ff18fcb8d87f`. No workspace search, database traversal, new page migration, or automatic import of other notes is performed. Expanding the allowlist requires a deliberate code review. The existing draft badge is not a privacy gate and is not used to approve additional content.

## Refresh → review → publish

Use Node 24 (as in this environment), with the inherited HTTPS proxy and CA trust. From the checkout root:

```bash
npm run import:notion
npm run test:import
npm run lint
npm run build
git diff -- content/canvas.notion.json public/media/notion/canvas
```

The import command reads only Canvas and its table rows, downloads supported images, and writes a public-content snapshot plus content-addressed local assets. The title updates on the reading page and homepage card; the existing curated introduction and Apparent/True statements stay in the content file. Cover art is not imported automatically; optional lead art can be supplied separately with alt text/caption. One-way import only: the website never edits Notion.

- Supported content: paragraphs, headings, links, emphasis, simple ordered/unordered lists, quotes, dividers, figures and tables with a header row.
- Captions are required for imported images and become their alt text. Supported assets: PNG, JPEG, WebP, GIF, AVIF, up to 20 MB each. No temporary Notion image URLs are retained in the snapshot.
- Nested blocks, unsupported block types, inline equations, underline/strikethrough, and first-column table headers currently fail clearly for review rather than being silently dropped. Add support against real examples before accepting such an import.
- API errors, empty/archived pages, failed images, unsupported content, or missing credentials stop the import before replacing the reviewed JSON snapshot. Downloaded assets are held in memory until conversion succeeds; the snapshot is replaced atomically last. Older assets are retained for rollback.
- Credentials are only used against the Notion API. Image requests do not carry the Notion credential.
- An import does not commit, push, build, or deploy. Review its diff on a development branch, commit only approved public text/assets, and push for a Cloudflare preview. Merge the reviewed commit into `main` only after approval.
- Cloudflare builds the checked-in snapshot and does not need a Notion token. There is no schedule, webhook, or automatic live update.

The source and approved snapshot are public once pushed. Never run the importer against an unapproved/private page by changing the allowlist casually.

## Validation and remaining gate

`npm run test:import` exercises the allowlist, pagination, rich text, rejected executable links, list grouping, multiple figures, captions, table headers, unsupported/nested blocks, archived/wrong/empty pages, and unchanged snapshots without credentials. Network responses are mocked, not represented as a successful real Notion import.

The first gate is design review of Canvas. The second is a real authenticated Canvas import and review once the token is configured. Only after both gates should the shared template roll out to the other notes. The live site and logo must remain unchanged during the pilot.

## Current implementation verification

- Production build, TypeScript, ESLint, and 11 importer tests passed. A stale Turbopack font cache caused the initial build to fail; rebuilding with a clean generated cache resolved it without changing fonts or dependency versions.
- Browser checks passed at 320, 390, 768, and 1440 pixels: Canvas native card link, direct entry, refresh, browser Back, All knotes navigation, unchanged White Mirror overlay, overlay-to-Canvas transition, no empty image placeholder, three-figure fixture with alt text/captions, and independently scrolling tables.
- All 12 existing note exports and canonical addresses remain present; only Canvas uses the reading layout. The fixture is noindex and absent from the sitemap.
- Real authenticated Notion import remains unrun because no token value is configured. The current Canvas preview uses the existing repository text.
