# Sail Lore: changing the words

## Three ways to edit

**Ask Codex:** give the existing wording, the replacement, and where it appears. Example: “In the welcome section, replace ‘Welcome to Sail Lore’ with ‘Welcome aboard.’ Keep the layout unchanged. Show me the change before publishing.” This works from your phone without editing code.

**Edit on GitHub:** open [lib/content.ts](https://github.com/8ielski/sail-lore/blob/main/lib/content.ts), then use the pencil/Edit control if your account has write access. For a review before going live, choose a new branch (a separate version of the files) and create a pull request (a proposed change). Ask Codex to review it. Saving directly to `main` can trigger publication immediately.

**Edit in the Codex file panel:** if your client supports editing, change the working file and save. Some panels only display files. Saving a working file alone does not update GitHub or the live website.

## Where to look

Most wording is in `lib/content.ts`. Search for a phrase you can see on the site.

| What you want to change | Find |
|---|---|
| Large opening headline and its line breaks | `SITE.display` |
| Welcome line | `INTRO.kicker` |
| About-section heading | `INTRO.headingLines` |
| Main biography | `INTRO.body` |
| Biography/services link labels and destinations | `INTRO.wayfinding` |
| Dictionary definitions | `LORE` |
| Series introduction, audience, process sidebar | `SERIES` |
| Article title, short introduction, paragraphs | The matching article in `NOTES`: `title`, `dek`, `body` |
| Email, social links, contact wording | `CONTACT` |

Top navigation labels (including “About”) are in `NAV` in the same content file and are shared by the homepage and Canvas pilot. Exceptions: some buttons/headings are in `components/site/Sections.tsx`. Browser/search title and description are in `app/layout.tsx`. Ask Codex if a phrase isn't in the content file.

The displayed number of notes is automatic. The light k/e styling is also automatic in designated headings and links; keep the underlying content word as “Notes.”

## Small-edit checklist

1. Make one small change at a time.
2. Replace the words inside the quotation marks; preserve surrounding quotes, commas, brackets, and any `+` signs joining paragraphs. Text after `//` or between `/* ... */` is a comment and won't appear on the page.
3. Leave article `id` values unchanged: those form shared web addresses. Longer headline text can affect line breaks.
4. Review the diff—the before/after comparison—and ask Codex to check/build the site if unsure.
5. To publish from Codex: commit the edit (record a checkpoint), then push it to GitHub `main` (send the checkpoint). Cloudflare Pages project `sail-lore` builds and deploys it automatically. A pull request publishes to the main site when it is merged into `main`.
6. Wait for the Pages deployment to succeed, then refresh https://sail-lore.com/ and check on phone and desktop. Publishing a Codex environment is a different operation and does not publish website edits.

To undo a published edit, ask Codex to revert its commit. This creates a new checkpoint restoring the previous wording, without deleting history.

On the Canvas pilot branch, after a Notion import, Canvas’s title/body come from the reviewed snapshot. Edit those in Notion and request a refresh; the original `NOTES` paragraphs are the fallback until the first import. See [Notion publishing](NOTION-PUBLISHING.md).

For the other notes, Notion content is separate: changes to Notion do not automatically update this website, and changes here do not update the linked Notion pages. A CMS-style editing interface is still deferred.
