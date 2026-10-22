"use client";

import { useRef, useState } from "react";
import { SITE, INTRO, LORE, SERIES, NOTES, GALLERY, WIND, CONTACT } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";
import { useScrollRange, useSectionProgress } from "@/lib/useScrollRange";
import { usePrefs } from "@/lib/prefs";
import { useNotesUI } from "@/lib/notes-ui";
import { NoteInPlace } from "./NoteView";
import { SailGlyph, HeroSea, RIGS } from "./Sail";
import { WindVector, windReadout } from "./WindVector";

/* ─────────────────────────────────────────────────────────────────────────
   ADAPTED FROM wolverine-sandbox/components/landing/Sections.tsx.
   Every geometry value below is Wolverine's, measured live at 1512x863; only
   the content and the drawn art are Sail Lore's.

   Type scale carried over intact:
     168px  hero display            (11.11vw)
     128px  section h2              ( 8.47vw)   <- the lore definition
      57px  large-card h2           ( 3.77vw)   <- the series card
      33px  section h2 AND body     ( 2.18vw)   <- BOTH columns, 700
   Page gutter 48px. Radius 12px (16px on the large card).
   ───────────────────────────────────────────────────────────────────────── */

const NAV = [
  { label: "Notes", href: "#notes", external: false },
  INTRO.wayfinding[2],
  { label: "About", href: "#bio", external: false },
  { ...INTRO.wayfinding[1], label: "Services" },
  { label: "Contact", href: "#contact", external: false },
];

/** Keep the notes/knots wordplay legible, with a normal spoken label. */
function NotesWord({ capitalized = false }: { capitalized?: boolean }) {
  return (
    <span className="whitespace-nowrap" data-notes-word>
      <span className="sr-only">{capitalized ? "Notes" : "notes"}</span>
      <span aria-hidden="true">
        <span className="font-normal opacity-50">{capitalized ? "K" : "k"}</span>
        <span className="font-semibold">not</span>
        <span className="font-normal opacity-70">e</span>
        <span className="font-semibold">s</span>
      </span>
    </span>
  );
}

function NotesLabel({ text }: { text: string }) {
  return <>{text.split(/\b(notes)\b/i).map((part, i) =>
    /^notes$/i.test(part) ? <NotesWord key={i} capitalized={part[0] === "N"} /> : part,
  )}</>;
}

/** Dictionary kicker, shared by the two definition sections. Headword stays
 *  lowercase — that is how a dictionary sets it, and uppercasing it fights the
 *  lowercase phonetic sitting between the caps. */
function DefKicker({ word, pron, pos, note }: { word: string; pron: string; pos: string; note?: string }) {
  return (
    <p className="sl-mono text-grey">
      <span className="lowercase text-ink">{word}</span>
      {"  "}<span className="normal-case">{pron}</span>
      {"  ·  "}<span className="lowercase">{pos}</span>
      {note && <>{"  ·  "}<span className="lowercase">{note}</span></>}
    </p>
  );
}

/** Wolverine `.c-header` — fixed, full width, h82, collapses to a 620px pill. */
export function Header() {
  const p = useScrollRange(80, 400);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[82px]" onKeyDown={(event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <div
        className="relative mx-auto flex h-full items-center justify-between transition-all duration-500 ease-out"
        style={{
          width: `calc(100% - ${96 - p * 96 * 0.72}px)`,
          maxWidth: p > 0.5 ? 620 : 1416,
          borderRadius: 12,
          background: `rgba(7,13,18,${p * 0.92})`,
          backdropFilter: p > 0.1 ? "blur(12px)" : "none",
          marginTop: p * 14,
          height: p > 0.5 ? 48 : 82,
          paddingLeft: 16 + (1 - p) * 8,
          paddingRight: 16,
        }}
      >
        <a href="#top" className="flex items-center gap-2.5 text-paper">
          <SailGlyph className="size-[19px] shrink-0" />
          {p < 0.5 && (
            <span className="whitespace-nowrap text-[13px] font-bold tracking-[0.14em]">SAIL LORE</span>
          )}
        </a>
        {/* The measured desktop row can't fit a 390px phone, so it collapses
            to a menu affordance below md. (Playbook §4b) */}
        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} target={n.external ? "_blank" : undefined}
               rel={n.external ? "noreferrer" : undefined} className="whitespace-nowrap text-[15px] text-paper hover:opacity-70">
              <NotesLabel text={n.label} />
            </a>
          ))}
        </nav>
        <button ref={menuButton} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen} aria-controls="mobile-navigation"
                onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-[4px] p-2 md:hidden">
          <span className="block h-[2px] w-[22px] bg-paper" />
          <span className="block h-[2px] w-[22px] bg-paper" />
          <span className="block h-[2px] w-[22px] bg-paper" />
        </button>
        <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen}
             className="absolute right-0 top-full mt-2 min-w-[180px] rounded-[12px] bg-abyss p-3 shadow-lg md:hidden">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} target={n.external ? "_blank" : undefined}
               rel={n.external ? "noreferrer" : undefined} onClick={() => setMenuOpen(false)}
               className="block rounded px-3 py-3 text-[15px] text-paper hover:bg-white/10 focus-visible:bg-white/10">
              <NotesLabel text={n.label} />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/** Hero: inset 8px, full-bleed ground, headline l48 bottom, card 280x301 r12. */
export function Hero() {
  const { open } = useNotesUI();
  // "Newest" is mechanical: it surfaced ZAFL Skills, which is the least legible
  // door into the work for a stranger, and printed that title on the page four
  // times. An editor's pick, with newest as the fallback.
  const featured = NOTES.find((n) => n.featured) ?? NOTES[NOTES.length - 1];
  return (
    <section id="top" className="relative m-2 h-[calc(101svh-1rem)] overflow-hidden rounded-[12px] bg-abyss">
      {SITE.hero ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.hero} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/40 to-abyss/60" />
        </>
      ) : (
        <HeroSea className="absolute inset-0 size-full object-cover" />
      )}

      {/* Was SITE.tagline — the identical words as the h1 below it. The page's
          most valuable small type now carries the series and the count, which
          is what "& Building" wants above the fold. */}
      <a href="#notes" className="sl-mono absolute left-5 top-[110px] text-paper/70 underline underline-offset-4 md:left-10">
        {NOTES.length} <NotesLabel text={SITE.kicker} /> <span aria-hidden>↓</span>
      </a>

      <h1 className="sl-display absolute bottom-[42%] left-5 text-paper md:bottom-[14%] md:left-10">
        {SITE.display.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
      </h1>

      {/* the floating card — bottom right, 280x301 */}
      <button
        type="button"
        onClick={() => open(featured.id)}
        className="absolute inset-x-5 bottom-[4%] cursor-pointer overflow-hidden rounded-[12px] bg-white/10 p-2 text-left text-paper backdrop-blur-md transition-colors hover:bg-white/[0.16] md:inset-x-auto md:bottom-[6%] md:right-10 md:w-[280px]"
      >
        <span className="flex h-[187px] w-full items-center justify-center rounded-[8px] bg-abyss/70">
          <SailGlyph className="size-[92px] text-paper/85" />
        </span>
        <span className="sl-mono mt-4 block px-1 text-paper/70">Start here</span>
        <span className="mt-2 flex items-end justify-between gap-3 px-1 pb-2">
          <span className="text-[20px] font-bold leading-[1.15] tracking-[-0.03em]">{featured.title}</span>
          <span aria-hidden className="pb-1 text-[13px]">↗</span>
        </span>
      </button>
    </section>
  );
}

/** Wolverine two-column: h2 l48 w698 33px/700 · body l766 w578 ALSO 33px/700. */
export function Intro() {
  const { ref, hidden } = useReveal<HTMLDivElement>(0.2);
  return (
    <section id="bio" className="px-5 py-[9vh] md:px-12">
      <div ref={ref} data-hidden={hidden} className="sl-reveal grid gap-10 lg:grid-cols-2">
        <div className="max-w-[698px]">
          {/* Greeting demoted from section heading to kicker: his warmth
              survives, it just stops out-shouting the hero's promise. */}
          <p className="sl-mono text-grey">
            {INTRO.kicker} <span aria-hidden className="opacity-60 [filter:grayscale(1)]">👋🏻</span>
          </p>
          <h2 className="sl-h33 mt-5 text-ink">
            {INTRO.headingLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>
        </div>

        <div className="max-w-[578px]">
          {/* 22px, not the template's 33px: both columns at 33/700 works for
              Wolverine because both are statements. This is a bio. */}
          <p className="text-[clamp(17px,1.5vw,23px)] leading-[1.4] tracking-[-0.01em] text-ink">{INTRO.body}</p>

          <dl className="mt-10 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {INTRO.wayfinding.map((w) => (
              <a
                key={w.label}
                href={w.href}
                {...(w.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group border-t border-black/10 py-3 outline-none"
              >
                <dt className="flex items-baseline gap-1.5 text-[15px] font-bold text-ink underline-offset-4 group-hover:underline group-focus-visible:underline">
                  <NotesLabel text={w.label} />
                  <span aria-hidden className="text-[11px] text-grey">{w.external ? "↗" : "↓"}</span>
                </dt>
                <dd className="mt-1 text-[15px] leading-[1.45] text-grey">{w.note}</dd>
              </a>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/**
 * A dictionary entry: the word leads, with three equally readable meanings.
 * A sparse sail field preserves the visual identity without competing with
 * the text. The notes' Rail/Grid preference only affects the notes index.
 */
// Kept clear of the section edges (10-92%) so the field stops leaking
// into the intro above it.
const SCATTER = [
  [6, 14], [20, 26], [10, 42], [4, 62], [14, 78], [26, 88], [34, 18], [46, 32],
  [40, 68], [52, 84], [60, 6], [68, 26], [58, 46], [72, 58], [64, 74], [78, 88],
  [86, 20], [92, 36], [82, 54], [96, 70], [88, 90], [30, 56], [50, 12], [74, 42],
];

export function LoreDefinition() {
  const p = useScrollRange(900, 2500);
  const { ref, hidden } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="lore" aria-labelledby="lore-heading" className="relative overflow-hidden px-5 py-[10vh] md:px-12">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SCATTER.filter((_, i) => i % 4 === 0).map(([x, y], i) => (
            GALLERY.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={GALLERY[i % GALLERY.length]}
                alt=""
                className="absolute size-[114px] object-cover"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%,-50%) translateY(${-p * 260}px) scale(1.1)`,
                  opacity: Math.max(0, 1 - p * 1.5),
                }}
              />
            ) : (
              <SailGlyph
                key={i}
                rig={RIGS[i % RIGS.length]}
                className="absolute size-[114px] text-ink"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%,-50%) translateY(${-p * 260}px) scale(1.1)`,
                  opacity: Math.max(0, 1 - p * 1.5) * 0.04,
                }}
              />
            )
          ))}
        </div>

      <div ref={ref} data-hidden={hidden} className="sl-reveal relative mx-auto max-w-[880px]">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <h2 id="lore-heading" className="text-[clamp(48px,6vw,80px)] font-bold leading-none tracking-[-0.04em] text-ink">
            {LORE.word}
          </h2>
          <p className="text-[clamp(19px,2vw,24px)] leading-[1.5] text-grey">
            <span className="font-[family-name:var(--font-mono)]">{LORE.pron}</span>
            <span className="mx-3" aria-hidden>·</span>
            <span className="italic">{LORE.pos}</span>
          </p>
        </div>
        <div className="mt-7 border-t border-black/10 pt-7 md:mt-9 md:pt-9">
          <ol className="space-y-5">
            {[...LORE.senses, LORE.display.join(" ")].map((sense, i) => (
              <li key={sense} className="flex gap-4 text-[clamp(19px,2vw,24px)] leading-[1.5] text-ink md:gap-6">
                <span className="sl-mono shrink-0 pt-[7px] text-grey">{i + 1}</span>
                <span>
                  {i === LORE.senses.length && <span className="mr-2 text-[0.75em] italic text-grey">{LORE.displayNote}</span>}
                  {sense}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[65ch] text-[15px] leading-[1.6] text-grey">{LORE.etymology}</p>

          {/* His own link, dropped in the first pass. Without it the section
              defines the word the site is named after and then dead-ends. */}
          <a href={LORE.more.href} target="_blank" rel="noreferrer"
             className="mt-8 inline-flex items-baseline gap-2 text-[15px] text-ink underline underline-offset-4">
            {LORE.more.label} <span className="text-grey">— {LORE.more.note}</span> <span aria-hidden className="text-[11px]">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Scroll is boat speed.
 *
 * A 200svh section with a sticky viewport inside it: the extra 100svh is the
 * runway, and progress across it drives the boat. The true wind never moves,
 * which is the entire point — the reader is not told that moving distorts the
 * reading, they do it with their own scroll wheel.
 */
export function ApparentWind() {
  const { ref, p } = useSectionProgress<HTMLElement>();
  const r = windReadout(p * WIND.MAX_BOAT);
  const row = "flex items-baseline justify-between gap-6 border-b border-black/10 py-2.5";

  return (
    <section ref={ref} className="relative h-[200svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1416px] items-center gap-10 px-5 md:px-12 lg:grid-cols-2">
          <div>
            <DefKicker word={WIND.word} pron={WIND.pron} pos={WIND.pos} />
            <h2 className="sl-h33 mt-5 text-ink">{WIND.heading}</h2>
            {WIND.body.map((t) => (
              <p key={t.slice(0, 20)} className="mt-5 max-w-[46ch] text-[15px] leading-[1.5] text-grey">{t}</p>
            ))}

            <dl className="mt-8 max-w-[420px]">
              <div className={row}>
                <dt className="sl-mono text-grey">True</dt>
                <dd className="sl-mono text-grey">
                  {WIND.TRUE_WIND.toFixed(1)} kt · {String(WIND.TRUE_ANGLE).padStart(3, "0")}°
                </dd>
              </div>
              <div className={row}>
                <dt className="sl-mono text-ink">Apparent</dt>
                {/* Every displayed number is rounded — raw float math leaks
                    artifacts like 16.970562748477143 straight onto the page. */}
                <dd className="sl-mono text-ink">
                  {r.magnitude.toFixed(1)} kt · {String(Math.round(r.angle)).padStart(3, "0")}°
                </dd>
              </div>
              <div className={row}>
                <dt className="sl-mono text-grey">Divergence</dt>
                <dd className="sl-mono text-ink">{Math.round(r.divergence)}°</dd>
              </div>
            </dl>

            <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.5] text-grey">
              {r.divergence < 2 ? WIND.cue : WIND.payoff}
            </p>
          </div>

          <WindVector speed={r.speed} className="w-full max-w-[520px] justify-self-center" />
        </div>
      </div>
    </section>
  );
}

/**
 * Brief series introduction, followed by the single numbered collection.
 * The reading link appears before its target; statistics belong with cards.
 */
export function SeriesCard() {
  const { ref, hidden } = useReveal<HTMLDivElement>(0.15);
  return (
    <section id="series" aria-labelledby="series-heading" className="px-4 pb-[3vh] pt-[6vh]">
      <div ref={ref} data-hidden={hidden} className="sl-reveal relative overflow-hidden rounded-[16px] bg-abyss text-paper">
        <div className="grid lg:grid-cols-[763fr_749fr]">
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-abyss">
            <SailGlyph className="size-[58%] text-paper/15" />
            <blockquote className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10">
              <p className="sl-h57">{`“${SERIES.epigraph.text}”`}</p>
              <footer className="sl-mono mt-4 text-paper/60">{SERIES.epigraph.who}</footer>
            </blockquote>
          </div>

          <div className="relative flex flex-col p-5 md:p-10">
            <h2 id="series-heading" className="sl-h57 mt-4">
              About the <NotesWord />
            </h2>
            <div className="mt-8 space-y-4 lg:mt-auto">
              {SERIES.about.slice(0, 2).map((t) => (
                <p key={t.slice(0, 24)} className="max-w-[46ch] text-[15px] leading-[1.5] text-paper/85">{t}</p>
              ))}
            </div>
            <a href="#notes" className="mt-8 inline-flex w-fit items-center gap-2 text-[15px] text-paper underline underline-offset-4">
              Read the {NOTES.length} <NotesWord /> <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Audience first; the creative process is supporting context in a sidebar. */
export function Audience() {
  const { ref, hidden } = useReveal<HTMLDivElement>(0.2);
  return (
    <section id="series-background" className="border-t border-black/10 px-5 py-[7vh] md:px-12">
      <div ref={ref} data-hidden={hidden} className="sl-reveal mx-auto grid max-w-[1416px] gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="sl-h33 max-w-[698px] text-ink">
            <span className="block">Written for sailors,</span>
            <span className="block">open to landlubbers.</span>
          </h2>
          <p className="mt-6 max-w-[55ch] text-[clamp(19px,2vw,24px)] leading-[1.5] text-ink">{SERIES.audience[0]}</p>
        </div>
        <aside aria-labelledby="cross-fertilization-heading" className="border-t border-black/10 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h3 id="cross-fertilization-heading" className="text-[20px] font-bold tracking-[-0.02em] text-ink"><NotesLabel text="How the notes take shape" /></h3>
          <div className="mt-4 space-y-4 text-[15px] leading-[1.6] text-grey">
            <p>{SERIES.about[2]}</p>
            {SERIES.audience.slice(1).map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
          </div>
          <ul className="mt-6 space-y-4 border-t border-black/10 pt-5">
            {SERIES.siblings.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-[15px] text-ink underline underline-offset-4">
                  {s.name} <span aria-hidden>↗</span>
                </a>
                <p className="mt-1 text-[14px] leading-[1.5] text-grey">{s.line}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

/**
 * The notes index — Wolverine's NewsCarousel.
 * A: 3-up rail with Prev./Next (measured 3-up at md+, 1-up on phones).
 * B: exposed grid, every note visible at once.
 *
 * Cards carry `data-note-id`. The detail POPUP slice hooks onto that: the
 * full body already lives in lib/content.ts, so opening one costs no request.
 */
export function NotesIndex() {
  const { index } = usePrefs();
  const { open, openId } = useNotesUI();
  const [i, setI] = useState(0);
  const max = Math.max(0, NOTES.length - 3);
  const domains = new Set(NOTES.flatMap((n) => n.domains));
  const cells = [
    ["Newest", NOTES[NOTES.length - 1].title],
    ["In draft", String(NOTES.filter((n) => n.draft).length)],
    ["Lore domains", String(domains.size)],
    ["Series", "Ongoing"],
  ];

  // A real <button>, not a div with onClick: these are the only interactive
  // elements on the page and they must be reachable by keyboard.
  const Card = ({ n, idx }: { n: (typeof NOTES)[number]; idx: number }) => (
    <button
      type="button"
      data-note-id={n.id}
      onClick={() => open(n.id)}
      aria-expanded={openId === n.id}
      className="group block w-full cursor-pointer text-left outline-none"
    >
      <span className="relative flex aspect-[900/676] w-full items-center justify-center overflow-hidden rounded-[12px] bg-abyss ring-ink/60 transition-shadow group-focus-visible:ring-2">
        {n.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.image} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <SailGlyph className="size-[38%] text-paper/20 transition-transform duration-500 group-hover:scale-110" />
        )}
        <span className="sl-mono absolute left-4 top-4 text-paper/50">{String(idx + 1).padStart(2, "0")}</span>
        <span aria-hidden className="absolute right-4 top-4 text-[22px] leading-none opacity-60 [filter:grayscale(1)]">{n.glyph}</span>
        {n.draft && (
          <span className="sl-mono absolute bottom-4 left-4 rounded-full bg-paper/15 px-2.5 py-1 text-paper/80">Draft</span>
        )}
        <span className="sl-mono absolute bottom-4 right-4 translate-y-1 rounded-full bg-paper/15 px-2.5 py-1 text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          Read ↗
        </span>
      </span>
      <span className="mt-4 block text-[15px] font-bold text-ink underline-offset-4 group-hover:underline">{n.title}</span>
      <span className="mt-2 block text-[15px] leading-[1.45] text-grey">{n.dek}</span>
      <span className="sl-mono mt-3 block text-grey">{n.domains.join(" · ")}</span>
    </button>
  );

  return (
    <section id="notes" aria-labelledby="notes-heading" className="overflow-hidden px-5 py-[7vh] md:px-12">
      <p className="sl-mono mb-4 text-grey">The wind is building.</p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="notes-heading" className="text-[clamp(28px,3.2vw,44px)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
          {NOTES.length} <NotesLabel text={SERIES.title} />
        </h2>
        {index === "rail" && (
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}
                    className="text-[15px] text-ink disabled:opacity-30">Prev.</button>
            <button type="button" onClick={() => setI((v) => Math.min(max, v + 1))} disabled={i >= max}
                    className="text-[15px] text-ink disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
      <p className="mt-4 text-[15px] text-grey">By {SITE.author}</p>
      <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-black/10 py-5 lg:grid-cols-4">
        {cells.map(([label, value]) => (
          <div key={label}>
            <dt className="sl-mono text-grey">{label}</dt>
            <dd className="mt-1 text-[15px] font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {index === "rail" ? (
        <div className="mt-10 flex gap-6 transition-transform duration-500 ease-out [--cardW:100%] md:[--cardW:33.333%]"
             style={{ transform: `translateX(calc(${-i} * (var(--cardW) + 1.5rem)))` }}>
          {NOTES.map((n, idx) => (
            <div key={n.id} className="w-[calc(var(--cardW)-1rem)] shrink-0">
              <Card n={n} idx={idx} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {NOTES.map((n, idx) => <Card key={n.id} n={n} idx={idx} />)}
        </div>
      )}

      {/* The "in place" treatment renders here, inside the section. The three
          overlay treatments render from the shell instead. */}
      <NoteInPlace />
    </section>
  );
}

/** Wolverine's Push — 117svh media panel, headline bottom-left, CTA below. */
export function Connect() {
  return (
    <section id="contact" className="relative m-2 h-[117svh] overflow-hidden rounded-[12px]">
      <HeroSea className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative flex h-full flex-col justify-end p-5 md:p-12">
        <span className="sl-mono mb-8 text-paper/60">{CONTACT.services.join("  |  ")}</span>
        <h2 className="sl-h2 max-w-[14ch] text-paper">{CONTACT.heading}</h2>

        <dl className="mt-10">
          <div>
            <dt className="sl-mono text-paper/60">Email</dt>
            <dd className="mt-1 text-[15px] font-bold text-paper">
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">{CONTACT.email}</a>
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex w-fit items-center gap-3 rounded-[12px] bg-paper px-6 py-3.5 text-[15px] text-ink">
            Get in touch <span aria-hidden>↗</span>
          </a>
          {CONTACT.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
               className="inline-flex w-fit items-center gap-3 rounded-[12px] bg-white/15 px-6 py-3.5 text-[15px] text-paper backdrop-blur-sm">
              {s.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>

        <p className="mt-10 max-w-[70ch] text-[15px] leading-[1.5] text-paper/70">{CONTACT.references}</p>
        <p className="mt-2 max-w-[70ch] text-[15px] leading-[1.5] text-paper/70">{CONTACT.conflict}</p>
      </div>
    </section>
  );
}
