"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Progress (0..1) of window scroll across [from, to] in pixels.
 *
 * Drivers are layered the same way as useReveal, and for the same reason:
 * rAF and even scroll events can be inert in a hidden tab, so a bounded
 * interval poll backs them up. Unlike useReveal this poll never expires —
 * it is one cheap read of scrollY, no layout, and the value must stay live
 * for the whole page.
 */
export function useScrollRange(from: number, to: number) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const span = Math.max(1, to - from);
    let lastVal = -1;
    const read = () => {
      const v = Math.min(1, Math.max(0, (window.scrollY - from) / span));
      if (v !== lastVal) { lastVal = v; setP(v); }
    };

    let last = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - last < 16) return;
      last = now;
      read();
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    const poll = window.setInterval(read, 250);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
      window.clearInterval(poll);
    };
  }, [from, to]);

  return p;
}

/** Viewport height, SSR-safe (0 until mounted). */
export function useViewportH() {
  const [h, setH] = useState(0);
  useEffect(() => {
    // Mobile toolbars fire a resize on every show/hide, which would re-run layout
    // math mid-scroll and cause jank. Only re-measure when the WIDTH changes
    // (orientation / real resize) — a height-only resize is the toolbar. (Playbook 4b)
    let lastW = window.innerWidth;
    const set = () => setH(window.innerHeight);
    set();
    const onResize = () => {
      if (window.innerWidth !== lastW) { lastW = window.innerWidth; set(); }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", set);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", set);
    };
  }, []);
  return h;
}

/**
 * Progress (0..1) of an element through its own scroll runway.
 *
 * `useScrollRange` above takes absolute page offsets, which go stale the
 * moment anything above the section changes height. This measures the element
 * itself, so a section can be moved or have copy added without re-tuning
 * magic numbers. Same layered drivers, and for the same reason: scroll events
 * can be inert in a hidden tab, so a cheap interval backs them up.
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let lastVal = -1;
    const read = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const runway = r.height - window.innerHeight;
      const v = runway <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / runway));
      if (v !== lastVal) { lastVal = v; setP(v); }
    };

    let last = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - last < 16) return;
      last = now;
      read();
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read);
    const poll = window.setInterval(read, 250);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
      window.clearInterval(poll);
    };
  }, []);

  return { ref, p };
}
