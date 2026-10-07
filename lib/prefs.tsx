"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Multi-axis treatment switch.
 *
 * Replaces the single A/B switch ported from wolverine-sandbox. Standing rule
 * (TEMPLATE_PATTERNS §0) is to build the treatments and compare them live
 * rather than choose blind — with four popup shapes and two URL behaviours in
 * play, one A/B toggle can no longer carry it. Each axis is independent and
 * persists on its own key.
 *
 * Adding a treatment is one entry in an axis `options` array plus its branch.
 */
export const AXES = [
  {
    key: "index",
    label: "Notes index",
    options: [
      { id: "rail", label: "Rail", note: "3-up carousel (Wolverine's)" },
      { id: "grid", label: "Grid", note: "all 12 exposed" },
    ],
  },
  {
    key: "popup",
    label: "Note opens as",
    options: [
      { id: "modal", label: "Modal", note: "centred dialog over a dimmed page" },
      { id: "drawer", label: "Drawer", note: "slides in from the right" },
      { id: "takeover", label: "Takeover", note: "full-bleed, display type" },
      { id: "expand", label: "In place", note: "the card grows inside the section" },
    ],
  },
  {
    key: "url",
    label: "URL on open",
    options: [
      { id: "route", label: "/notes/id", note: "shareable; Back closes it" },
      { id: "state", label: "No change", note: "pure overlay state" },
    ],
  },
] as const;

export type Prefs = {
  index: "rail" | "grid";
  popup: "modal" | "drawer" | "takeover" | "expand";
  url: "route" | "state";
};

const DEFAULTS: Prefs = { index: "rail", popup: "modal", url: "route" };
const KEY = "sl-prefs";

const Ctx = createContext<{ prefs: Prefs; set: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void }>({
  prefs: DEFAULTS,
  set: () => {},
});

export const usePrefs = () => useContext(Ctx).prefs;

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    // Restore post-mount so SSR output and first paint agree; reading
    // localStorage during render would hydration-mismatch.
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) || "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefs((p) => ({ ...p, ...saved }));
    } catch {
      /* corrupt or absent — defaults stand */
    }
  }, []);

  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) =>
    setPrefs((p) => {
      const next = { ...p, [k]: v };
      window.localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });

  return <Ctx.Provider value={{ prefs, set }}>{children}</Ctx.Provider>;
}

/**
 * Floating treatment panel, bottom-right.
 *
 * Collapsed by default to a single summary bar: the hero uses BOTH edges
 * (headline left, card right), so an always-open panel lands on content.
 * Expands upward on click.
 */
export function TreatmentSwitch() {
  const { prefs, set } = useContext(Ctx);
  const [open, setOpen] = useState(false);

  const summary = AXES.map((a) => {
    const o = a.options.find((x) => x.id === prefs[a.key as keyof Prefs]);
    return o?.label ?? "";
  }).join(" · ");

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2">
      {open && (
        <div className="w-[290px] rounded-[14px] border border-ink/15 bg-paper/90 p-3 shadow-lg backdrop-blur-xl">
          {AXES.map((axis) => (
            <div key={axis.key} className="mb-3 last:mb-0">
              <p className="sl-mono mb-1.5 text-grey">{axis.label}</p>
              <div className="flex flex-wrap gap-1">
                {axis.options.map((o) => {
                  const active = prefs[axis.key as keyof Prefs] === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => set(axis.key as keyof Prefs, o.id as never)}
                      aria-pressed={active}
                      title={o.note}
                      className={`rounded-full px-2.5 py-1 text-[12px] transition-colors ${
                        active ? "bg-ink text-[white]" : "bg-ink/[0.06] text-ink/70 hover:bg-ink/[0.12]"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="sl-mono flex items-center gap-2 rounded-full border border-ink/15 bg-paper/85 px-3 py-1.5 text-grey backdrop-blur-xl"
      >
        <span className="text-ink">{summary}</span>
        <span aria-hidden className="text-[10px]">{open ? "▾" : "▴"}</span>
      </button>
    </div>
  );
}
