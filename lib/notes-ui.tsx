"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { NOTES } from "./content";
import { usePrefs } from "./prefs";

/**
 * Which note is open, and what that does to the URL.
 *
 * Two behaviours, switchable live (see AXES.url):
 *
 *   route — window.history.pushState to /notes/<id>. Officially supported for
 *           shallow updates in the App Router, so the page never re-renders on
 *           the server. Back closes the note; the link can be shared, and
 *           app/notes/[id]/page.tsx serves it cold.
 *   state — no history touched at all. Nothing to share, and Back leaves.
 *
 * Prev/next uses replaceState rather than pushState, so walking six notes
 * still leaves Back meaning "close", not "rewind through six notes".
 */

type Ctx = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
  step: (delta: 1 | -1) => void;
};

const NotesCtx = createContext<Ctx>({ openId: null, open: () => {}, close: () => {}, step: () => {} });
export const useNotesUI = () => useContext(NotesCtx);

const idFromPath = (path: string) => {
  const m = /^\/notes\/([^/?#]+)/.exec(path);
  const id = m?.[1] ? decodeURIComponent(m[1]) : null;
  return id && NOTES.some((n) => n.id === id) ? id : null;
};

export function NotesUIProvider({
  initialNoteId = null,
  children,
}: {
  initialNoteId?: string | null;
  children: React.ReactNode;
}) {
  const { url } = usePrefs();
  const [openId, setOpenId] = useState<string | null>(initialNoteId);

  // The Back/Forward buttons are the external system here; the note state
  // follows the address bar rather than the other way round.
  useEffect(() => {
    const onPop = () => setOpenId(idFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const open = useCallback(
    (id: string) => {
      setOpenId(id);
      if (url === "route") window.history.pushState({ noteId: id }, "", `/notes/${id}`);
    },
    [url],
  );

  const close = useCallback(() => {
    // Only pop if we were the ones who pushed. Flipping the axis mid-session,
    // or landing here cold on /notes/<id>, must still close cleanly.
    if (url === "route" && window.history.state?.noteId) window.history.back();
    else {
      setOpenId(null);
      if (url === "route" && window.location.pathname !== "/") window.history.replaceState({}, "", "/");
    }
  }, [url]);

  const step = useCallback(
    (delta: 1 | -1) => {
      setOpenId((cur) => {
        const i = NOTES.findIndex((n) => n.id === cur);
        if (i < 0) return cur;
        const nextId = NOTES[(i + delta + NOTES.length) % NOTES.length].id;
        if (url === "route") window.history.replaceState({ noteId: nextId }, "", `/notes/${nextId}`);
        return nextId;
      });
    },
    [url],
  );

  return <NotesCtx.Provider value={{ openId, open, close, step }}>{children}</NotesCtx.Provider>;
}

/**
 * Escape-to-close, focus restore, and scroll lock for the overlay treatments.
 * `active` is false for the in-place treatment, which is part of the document
 * flow and must NOT lock scrolling or trap focus.
 */
export function useOverlayBehaviour(active: boolean, close: () => void) {
  useEffect(() => {
    if (!active) return;
    const returnTo = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    // Compensate for the vanishing scrollbar or the whole page shifts sideways.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      returnTo?.focus?.();
    };
  }, [active, close]);
}
