# Sail Lore

A rebuild of **[sail-lore.com](https://sail-lore.com)** — Stefan Bielski's writing on
sailing as a way of knowing — as a standalone Next.js site instead of a Notion page.

**Live preview → https://sail-lore-review.pages.dev**

The site is prepared for `https://sail-lore.com/`, with canonical URLs and a sitemap.
Cloudflare Pages preview hosts receive a host-specific `X-Robots-Tag: noindex`
through `public/_headers`. See [LAUNCH.md](LAUNCH.md) for validation and the domain switch.

---

## What's in it

All twelve **Notes Apparent** — Canvas · The White Mirror · Sailing's 3Ms · Happiness
Equation · Your Brain on Starboard Tack · Lore x 4 · Yin-Yang of Work & Play ·
Affordable Loss · The Call—& Callouses—of the Sea · R.A.C.I.ng Roles & Rules ·
Spinthesis · ZAFL Skills — plus the intro, the `lore` definition, and the contact block.

Two things the Notion page doesn't have:

**The title's joke, made visible.** *Notes Apparent—& Building* turns on apparent wind:
the wind you feel on deck is the true wind plus the wind your own motion makes, so it is
the only wind you can feel and it is never the real one. A section between the definition
and the series binds **scroll to boat speed** — scroll down, the boat accelerates, the
apparent arrow swings forward and grows, and the true wind never moves. At rest the two
arrows lie exactly on top of each other. The faster you go, the further apparent diverges
from true.

**Every note states its claim twice, once wrong.** Each one carries an *Apparent / True*
stamp in its header — what it looks like from the deck, then what it actually is:

> **Apparent** · Don't let the chute collapse.
> **True** · Don't let a collapse cost too much. Fail fast, sail fast.

Grey is what you feel, ink is what is. Same encoding in the wind diagram and the stamps.

---

## Run it

```bash
npm install
npm run dev     # http://localhost:3106
```

`npm run build` produces a static export in `out/` — no server, no database, no API keys.

---

## Changing the content

For a short, beginner-friendly reminder, see [Changing the words](COPY-EDITING.md).

**Everything readable is in [`lib/content.ts`](lib/content.ts).** One file. No CMS, no
database. Edit it and the site changes.

| What | Where in that file |
|---|---|
| Hero lines, kicker | `SITE` |
| The greeting, bio, the four wayfinding links | `INTRO` |
| The dictionary block | `LORE` |
| Apparent-wind copy, true wind speed and angle | `WIND` |
| The series framing and epigraph | `SERIES` |
| **All twelve notes** — body, quote, table, Apparent/True stamp | `NOTES` |
| Phones, email, socials, conflict statement | `CONTACT` |

The bio has two alternates kept as comments directly above it — swapping is one string.
So is the `lore` definition: `LORE.display` currently carries the third sense, ending on
**workmanship**, and `LORE.altDisplay` holds the safer second sense.

### Adding photos

Every image slot is wired and empty; the site draws SVG sails until files arrive. No
component changes needed:

| Slot | Shows up as | Put the file in |
|---|---|---|
| `SITE.hero` | full-bleed behind the headline | `public/media/` |
| `GALLERY[]` | the tiles behind the `lore` definition | `public/media/gallery/` |
| `Note.image` | that note's card and popup header | `public/media/notes/` |

The hero is the single biggest upgrade — one good photograph on the water changes the
whole page.

---

## The switch, bottom-right

A floating panel with three independent axes, so treatments get compared live rather than
picked blind. Each persists on its own key.

| Axis | Options |
|---|---|
| **Notes index** | Rail (3-up carousel) · Grid (all twelve exposed) |
| **Note opens as** | Modal · Drawer · Takeover · In place |
| **URL on open** | `/notes/<id>` · No change |

It is a development control. Delete `<TreatmentSwitch />` from
[`components/site/Shell.tsx`](components/site/Shell.tsx) once the treatments are chosen.

---

## How the notes open

Clicking a note opens it **without leaving the page**, and **nothing is fetched** — every
body, quote and table is already in the bundle, so opening one is a state change and a
paint. No request, no spinner, no empty frame.

Four presentations share one body renderer in
[`components/site/NoteView.tsx`](components/site/NoteView.tsx). All four close on Escape,
move focus into the dialog and return it on close, and lock body scroll with
scrollbar-width compensation so the page can't shift sideways. The in-place treatment
deliberately does neither — it's part of the document rather than over it.

With the URL axis on `/notes/<id>`, opening a note pushes a shallow history entry, so the
link is shareable and Back closes it. Prev/Next uses `replaceState` instead, so walking
six notes still leaves Back meaning *close* rather than *rewind six times*.
[`app/notes/[id]/page.tsx`](app/notes/[id]/page.tsx) exists so a **shared** link works
cold — all twelve are statically generated with their own titles and descriptions, and an
unknown id 404s.

---

## Layout provenance

The page geometry, type scale and scroll mechanics are ported from a structural study of
a corporate brand site, measured live at 1512×863 — hero display at 11.11vw, section
headings at 8.47vw, line-height 0.79, tracking −0.05em, 12px radii. **None of that site's
images, logos or copy are in this repo**; `public/` contains a `robots.txt` and two empty
folders. Every mark on the page is drawn SVG in
[`components/site/Sail.tsx`](components/site/Sail.tsx) — four rigs (sloop, ketch, gaff,
spinnaker), so the scattered field reads as a field rather than tiled wallpaper.

Where the port was wrong for this content, the source comments say so and why. Two
examples: the hero originally inherited full stops from the reference's *"Make. Every Day.
Better."* — three staccato statements — which chopped Stefan's one-sentence tagline into
three; and the staggered definition only resolves if the lines *shorten* as they indent,
which is why the copy ends on a single word.

Fonts are substitutes. The reference licenses ABC Diatype; this uses Inter and IBM Plex
Mono at the measured metrics.

---

## Stack

Next.js 16 · React 19 · Tailwind 4 · TypeScript. Static export, no runtime dependencies.

---

## Licence and authorship

[MIT](LICENSE).

**The writing is Stefan Bielski's** — the twelve notes, the intro and the definitions are
his words, reproduced from [sail-lore.com](https://sail-lore.com). Every note links back
to its source, and if you reuse any of it, credit him rather than this repository.

The site around it — components, layout, the wind diagram, the build — is Antonio Bray's.
