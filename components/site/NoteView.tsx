"use client";

import { useEffect, useRef, useState } from "react";
import { NOTES, type Note } from "@/lib/content";
import { useNotesUI, useOverlayBehaviour } from "@/lib/notes-ui";
import { usePrefs } from "@/lib/prefs";
import { SailGlyph } from "./Sail";

/* ─────────────────────────────────────────────────────────────────────────
   Four presentation treatments over ONE body renderer.

   Nothing here fetches. Every note's full text, quote and table already live
   in lib/content.ts, so opening one is a state change and a paint — no
   request, no spinner, no empty frame.
   ───────────────────────────────────────────────────────────────────────── */

type Tone = "light" | "dark";

/** Shared header: index, glyph, title, dek, domains. */
function NoteHead({ note, tone, display = false }: { note: Note; tone: Tone; display?: boolean }) {
  const n = NOTES.findIndex((x) => x.id === note.id) + 1;
  const muted = tone === "dark" ? "text-paper/60" : "text-grey";
  const body = tone === "dark" ? "text-paper/85" : "text-grey";
  return (
    <header>
      <div className={`sl-mono flex items-center gap-3 ${muted}`}>
        <span>{String(n).padStart(2, "0")}</span>
        <span aria-hidden className="text-[16px] opacity-60 [filter:grayscale(1)]">{note.glyph}</span>
        <span>{note.domains.join(" · ")}</span>
        {note.draft && (
          <span className={`rounded-full px-2 py-0.5 ${tone === "dark" ? "bg-paper/15" : "bg-ink/10"}`}>Draft</span>
        )}
      </div>
      <h2 className={`${display ? "sl-h2" : "sl-h57"} mt-4 ${tone === "dark" ? "text-paper" : "text-ink"}`}>
        {note.title}
      </h2>

      {/* The title's device, stated twice — once wrong. Grey is what you feel,
          ink is what is: the same encoding the wind diagram uses, so the two
          read as one system rather than two decorations. */}
      <dl className={`mt-7 max-w-[64ch] border-t ${tone === "dark" ? "border-paper/15" : "border-black/10"} pt-5`}>
        <div className="flex gap-5 py-1.5">
          <dt className={`sl-mono w-[76px] shrink-0 pt-[5px] ${muted}`}>Apparent</dt>
          <dd className={`text-[17px] leading-[1.45] ${body}`}>{note.stamp.apparent}</dd>
        </div>
        <div className="flex gap-5 py-1.5">
          <dt className={`sl-mono w-[76px] shrink-0 pt-[5px] ${muted}`}>True</dt>
          <dd className={`text-[17px] leading-[1.45] ${tone === "dark" ? "text-paper" : "text-ink"}`}>{note.stamp.true}</dd>
        </div>
      </dl>
    </header>
  );
}

/** Shared body: paragraphs, optional pull quote, optional table, source link. */
function NoteBody({ note, tone }: { note: Note; tone: Tone }) {
  const dark = tone === "dark";
  const rule = dark ? "border-paper/15" : "border-black/10";
  return (
    <div className={`mt-10 border-t ${rule} pt-8`}>
      <div className={`space-y-5 ${dark ? "text-paper/85" : "text-ink"}`}>
        {note.body.map((t, i) => (
          <p key={i} className="max-w-[68ch] text-[17px] leading-[1.62]">{t}</p>
        ))}
      </div>

      {note.quote && (
        <blockquote className={`mt-10 border-l-2 pl-6 ${dark ? "border-paper/30" : "border-ink/25"}`}>
          <p className={`max-w-[58ch] text-[21px] leading-[1.4] tracking-[-0.02em] ${dark ? "text-paper" : "text-ink"}`}>
            {`“${note.quote.text}”`}
          </p>
          <footer className={`sl-mono mt-3 ${dark ? "text-paper/60" : "text-grey"}`}>{note.quote.who}</footer>
        </blockquote>
      )}

      {note.table && (
        // Wide tables scroll inside their own container; the page body never
        // scrolls horizontally.
        <div className="sl-rail mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                {note.table.head.map((h) => (
                  <th key={h} className={`sl-mono border-b ${rule} pb-2 pr-6 font-normal ${dark ? "text-paper/60" : "text-grey"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {note.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td
                      key={j}
                      className={`border-b ${rule} py-3 pr-6 align-top text-[15px] leading-[1.45] ${
                        j === 0 ? (dark ? "font-bold text-paper" : "font-bold text-ink") : dark ? "text-paper/80" : "text-grey"
                      }`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <a
        href={note.source}
        target="_blank"
        rel="noreferrer"
        className={`sl-mono mt-10 inline-flex items-center gap-2 underline underline-offset-4 ${dark ? "text-paper/70" : "text-grey"}`}
      >
        Read on sail-lore.com <span aria-hidden>↗</span>
      </a>
    </div>
  );
}

/** Prev / close / next. */
function NoteNav({ tone, onClose, onStep }: { tone: Tone; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const dark = tone === "dark";
  const btn = `sl-mono rounded-full px-3 py-1.5 transition-colors ${
    dark ? "bg-paper/10 text-paper hover:bg-paper/20" : "bg-ink/[0.06] text-ink hover:bg-ink/[0.12]"
  }`;
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onStep(-1)} className={btn} aria-label="Previous note">← Prev</button>
      <button type="button" onClick={() => onStep(1)} className={btn} aria-label="Next note">Next →</button>
      <button type="button" onClick={onClose} className={btn} aria-label="Close note">Close ✕</button>
    </div>
  );
}

/**
 * Mount-transition flag, so each treatment can animate in from its own edge.
 * Stores WHICH id has entered rather than a bare boolean: resetting a boolean
 * would mean setting state synchronously in the effect body on every close.
 */
function useEnter(id: string | null) {
  const [enteredId, setEnteredId] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    const t = requestAnimationFrame(() => setEnteredId(id));
    return () => cancelAnimationFrame(t);
  }, [id]);
  return !!id && enteredId === id;
}

/**
 * The three OVERLAY treatments. The fourth ("in place") is rendered by
 * NotesIndex inside the section itself, so this returns null for it.
 */
export function NoteOverlay() {
  const { openId, close, step } = useNotesUI();
  const { popup } = usePrefs();
  const panel = useRef<HTMLDivElement>(null);
  const isOverlay = !!openId && popup !== "expand";
  const entered = useEnter(isOverlay ? openId : null);

  useOverlayBehaviour(isOverlay, close);

  // Move focus into the panel so Tab and screen readers land inside it.
  useEffect(() => {
    if (isOverlay) panel.current?.focus();
  }, [isOverlay, openId]);

  if (!isOverlay) return null;
  const note = NOTES.find((n) => n.id === openId);
  if (!note) return null;

  const dialogProps = {
    tabIndex: -1,
    role: "dialog" as const,
    "aria-modal": true,
    "aria-label": note.title,
  };

  if (popup === "takeover") {
    return (
      <div
        className={`fixed inset-0 z-50 overflow-y-auto bg-abyss transition-opacity duration-300 ${entered ? "opacity-100" : "opacity-0"}`}
      >
        <div ref={panel} {...dialogProps} className="outline-none">
          <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden>
            <SailGlyph className="size-[70vmin] text-paper/[0.04]" />
          </div>
          <div className="sticky top-0 z-10 flex justify-end bg-abyss/80 px-5 py-4 backdrop-blur-md md:px-12">
            <NoteNav tone="dark" onClose={close} onStep={step} />
          </div>
          <article
            className={`relative mx-auto max-w-[1017px] px-5 pb-24 transition-transform duration-500 md:px-0 ${
              entered ? "translate-y-0" : "translate-y-6"
            }`}
          >
            <NoteHead note={note} tone="dark" display />
            <NoteBody note={note} tone="dark" />
          </article>
        </div>
      </div>
    );
  }

  const isDrawer = popup === "drawer";
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close note"
        onClick={close}
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panel}
        {...dialogProps}
        className={`outline-none absolute bg-paper shadow-2xl transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
          isDrawer
            ? `inset-y-0 right-0 flex w-full max-w-[560px] flex-col rounded-l-[16px] ${entered ? "translate-x-0" : "translate-x-full"}`
            : `left-1/2 top-1/2 flex max-h-[86svh] w-[calc(100vw-2rem)] max-w-[820px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] ${
                entered ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"
              }`
        }`}
      >
        <div className="flex shrink-0 justify-end border-b border-black/10 px-5 py-3 md:px-8">
          <NoteNav tone="light" onClose={close} onStep={step} />
        </div>
        <article className="sl-rail overflow-y-auto px-5 py-8 md:px-8">
          <NoteHead note={note} tone="light" />
          <NoteBody note={note} tone="light" />
        </article>
      </div>
    </div>
  );
}

/** The fourth treatment: the note expands inside the notes section itself. */
export function NoteInPlace() {
  const { openId, close, step } = useNotesUI();
  const { popup } = usePrefs();
  const entered = useEnter(popup === "expand" ? openId : null);
  const ref = useRef<HTMLDivElement>(null);

  // Not an overlay: no scroll lock, no focus trap. It is part of the page, so
  // it just needs to bring itself into view.
  useEffect(() => {
    if (popup === "expand" && openId) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [popup, openId]);

  if (popup !== "expand" || !openId) return null;
  const note = NOTES.find((n) => n.id === openId);
  if (!note) return null;

  return (
    <div ref={ref} className="scroll-mt-[110px]">
      <article
        className={`mt-10 rounded-[16px] border border-black/10 bg-black/[0.02] p-5 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:p-10 ${
          entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="mb-8 flex justify-end">
          <NoteNav tone="light" onClose={close} onStep={step} />
        </div>
        <NoteHead note={note} tone="light" />
        <NoteBody note={note} tone="light" />
      </article>
    </div>
  );
}
