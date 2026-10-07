"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-enter, with a guarantee that content is never left invisible.
 *
 * Three drivers, deliberately layered — see SITE_CLONE_PLAYBOOK gotcha 4:
 *   1. IntersectionObserver — the normal, cheap path.
 *   2. A scroll listener, throttled by timestamp rather than rAF (rAF is
 *      paused in a hidden tab, which is exactly when the fallback matters).
 *   3. A bounded geometry poll — the only driver that survives an environment
 *      where BOTH observers and scroll events are inert (headless panes,
 *      frozen background tabs). Verified necessary: a hidden pane reports
 *      zero scroll events while scrollY changes underneath it.
 *
 * The hidden state is applied only after JS confirms it is running, so no-JS
 * and hook-failure both degrade to *visible* rather than to blank copy.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    // Arming AFTER mount is the point: the hidden state is applied only once JS
    // is confirmed running, so no-JS and hook-failure degrade to visible copy
    // rather than blank. One extra render, deliberately.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArmed(true);
    const el = ref.current;
    if (!el) return;

    let done = false;
    const reveal = () => { done = true; setShown(true); };

    // Anything at or above the trigger line counts, including content already
    // scrolled past — requiring `bottom > 0` would strand whatever went by
    // while the observers were inert.
    const check = () => {
      if (!done && el.getBoundingClientRect().top < window.innerHeight * 0.92) reveal();
    };

    const io = new IntersectionObserver(([e]) => e.isIntersecting && reveal(), { threshold });
    io.observe(el);

    let last = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - last < 100) return;
      last = now;
      check();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Bounded backstop: ~10s of cheap polling, then stop. Costs one rect read
    // per 400ms until revealed; guarantees the copy is never stranded.
    let ticks = 0;
    const poll = window.setInterval(() => {
      check();
      if (done || ++ticks > 25) window.clearInterval(poll);
    }, 400);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(poll);
    };
  }, [threshold]);

  return { ref, hidden: armed && !shown };
}
