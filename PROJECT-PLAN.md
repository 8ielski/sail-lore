# Sail Lore: incremental project plan

Working planning document. Proposed work is not a commitment to complete it in the next session. Pick one small, reviewable task per session, then pause. Keep the existing design and architecture unless a specific change is agreed.

## Current position

- The site is live at https://sail-lore.com/ through Cloudflare Pages project `sail-lore`, following GitHub `8ielski/sail-lore` on `main`.
- Greeting/contact cleanup, balanced lore typography, About navigation, the knotes letter treatment, and the consolidated numbered notes section are published.
- All 12 notes already have stable `/notes/<id>/` addresses and page metadata. They currently render the homepage shell with the selected note open, rather than a distinct article-reading layout. `#notes` is the homepage collection anchor, a separate concept.
- Content lives in `lib/content.ts`. Existing article features include paragraphs, an optional quote/table, and one optional image shared by card/header. Multiple inline illustrations/captions need a small extension.
- There is no Notion importer, scheduled content refresh, or automatic content publishing integration in this repository. The Notion links are links, not synchronization.
- The logo comparison remains isolated on `logo-preview`. The supplied logo may be the wrong version. Stefan leans toward monochrome but has not chosen. Do not merge that experiment or refine that asset yet.
- This plan does not change application code, public content, DNS, or the live site.

## Recommended sequence

### 1. Choose one reading-page direction

**Small next deliverable:** one standalone note page in a development preview, using an existing `/notes/<id>/` URL. No new graphics or CMS required.

Use one reusable article template (a shared layout), not 12 individually designed pages:
- Clear title and introduction; retain or deliberately reconsider the existing Apparent/True pair.
- Comfortable text width, spacing, and phone typography.
- Optional lead image. When absent, the title/body close the space naturally: no empty photo box.
- Allow multiple inline figures later, with captions and descriptive alternative text. Do not force every illustration into a giant header image.
- Existing quotes and tables continue to work; tables scroll inside the page on phones.
- Clear “All knotes” link, normal shareable navigation, and later previous/next or related notes.
- Shared site navigation must work from an article, linking back to homepage sections rather than nonexistent article-page anchors.
- Preserve existing article IDs, canonical addresses, and legacy redirects.

**Acceptance:** the pilot is readable as a direct entry and after refresh, Back works, it works without an image, and its design has room for figures. Review one text-only note and one visually richer example before applying the template across all notes.

**Stop point:** approve or revise the pilot. Do not automatically redesign the homepage or roll out all 12.

### 2. Roll out the approved article layout

- Reuse the pilot template across the existing notes.
- Make article cards actual links to the reading pages, rather than buttons that only open overlays. Decide separately whether a quick-preview option is still useful.
- Keep the homepage as the introduction and article collection.
- Choose Rail or Grid and remove obsolete public development controls once the navigation decision is settled.
- Check all 12 addresses, metadata, mobile layout, old redirects, and article-to-home navigation.

**Stop point:** existing text works well everywhere before creating more content.

### 3. Introduce other page types only when needed

Identify the first candidate: About, Services, Seasaurus, or another page. A regular information page can share header, footer, typography, and content rendering with articles, without inheriting note numbering, Apparent/True stamps, or next-note navigation.

Do not build one completely separate design for every page, or force every page into the note template. Start with two lightweight layouts: article and general information. Seasaurus may eventually need a reference/glossary layout; inspect real entries before choosing one.

Existing Notion links can remain until replacements are reviewed. Decide the target URL and redirect before migrating each page.

### 4. Choose the editing/publishing source

Recommended starting point: **Notion as the writing source, one-way into a reviewed static website build.** Revisit after inspecting the actual Notion material and any reusable integration from the other site.

| Option | Benefits | Costs/limits |
|---|---|---|
| Existing file + Codex | Already works; smallest immediate effort | Editing still involves code or a request to Codex |
| Notion → preview → website | Reuses existing writing and familiar editing | Needs an importer, explicit publishing fields, formatting support, and a refresh trigger |
| Obsidian/Markdown → Git → website | Portable files; simpler long-term text format | Requires export/migration and a comfortable file-sync/publishing workflow, especially on phones |

Choose one authoritative source per published item. Avoid simultaneous editing in Notion, Obsidian, and code, or two-way synchronization in the first version.

Before implementation:
- Inspect the Notion pages/database and the other site's real integration. Existing links here reference `professionsonpurpose.com`; Stefan mentioned `ProfessionsOnPurpose.org`. Confirm the intended project/address rather than assuming these are the same.
- Agree the minimum fields: title, stable slug, summary, page type, publication status, content, optional images/captions/alt text, and featured/order selection as needed.
- Decide which blocks the first importer supports. Start with paragraphs, headings, links, lists, figures, quotes, and existing tables as required by real content. Flag unsupported blocks rather than silently dropping them.
- Existing `draft` is currently a display badge, not a publishing gate: the draft-marked article is still exported. Define an explicit publication rule before importing additional/private writing.
- Keep integration credentials in secure build settings, never browser code or Git.
- Copy imported images to durable website assets during publication where appropriate; do not rely on temporary Notion image URLs remaining valid indefinitely. Reuse original illustrations where available and appropriate.

**Small first integration deliverable:** import one chosen published note into a preview without altering the existing live notes. Test text, image handling, links, and draft exclusion. Review changes before publication. Start with an intentional refresh/build action; automatic schedules or webhooks can come later.

The article template should work with today's content and imported content. No permanent runtime application server is required just to introduce a build-time import.

### 5. Add graphics incrementally

- Inventory existing illustrations before generating replacements.
- Pick one note; choose whether its graphic explains an idea, illustrates a process, or is decorative.
- Restore/adapt that one graphic, with caption/alt text, and test on phones.
- Let graphics appear where they help the text; no requirement for a photograph on every note.

## Other work still on the list

| Item | Status / next action |
|---|---|
| Correct logo master | Await Stefan checking the original file; monochrome preference provisional |
| Contact form | Choose a modest service and test delivery/spam protection before removing the public email |
| Google Search Console | Verify ownership and submit `https://sail-lore.com/sitemap.xml` if not already done |
| Copy maintenance | Review dated bio/services wording on both the site and linked Notion pages |
| Visitor walkthrough | Check phone/desktop navigation, article links, email, and remaining Notion links |
| Duplicate Workers integration | Inspect/remove the unnecessary failing Workers build integration; Pages is the successful publishing path |
| Rollback housekeeping | Keep old Notion forwarding disabled; retain it until comfortable with the new site |
| Major redesign / new photography | Deferred; not prerequisites for reading pages or content publishing |

## Suggested next planning session

1. Select a pilot note and list what a reader should do on its page.
2. Look at one text-only and one illustrated reference; agree a minimal layout.
3. List the non-note pages that matter first. Prioritize one, not all.
4. Show the relevant Notion structure and the other site's integration, if available. Record what is actually reusable.
5. Choose one next deliverable: a reading-page mockup OR an integration investigation. Avoid spending the session on both implementations.

If time is short, choosing the pilot and writing the acceptance criteria is enough progress. The next build session can implement only that pilot on a separate preview branch.

## Working agreement

- Preview design/structural work before merging into `main`; do not reuse the undecided logo branch as the basis for article work.
- Reuse existing files and validated components; install/build only what the current task needs.
- End each work session with what changed, what remains undecided, and one small next task. Update this plan rather than repeating the full backlog in chat.
- The previous calendar file is only an importable reminder; no automated notification was scheduled by this session. This document does not create a calendar appointment.

References: [Copy-editing guide](COPY-EDITING.md), [launch notes](LAUNCH.md), and the separate [logo preview branch](https://github.com/8ielski/sail-lore/tree/logo-preview).
