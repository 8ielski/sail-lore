"use client";

import { WIND } from "@/lib/content";

/**
 * The apparent-wind triangle, driven by boat speed.
 *
 * Boat-fixed frame, bow up, true wind on the beam from starboard:
 *
 *   V_true      = (-TW, 0)          air moving right-to-left across the deck
 *   V_boat      = (0, vb)           boat moving toward its own bow
 *   V_apparent  = V_true - V_boat = (-TW, -vb)
 *
 * The direction it comes FROM is the negative of that, (TW, vb) — so the
 * apparent "from" point sits directly ABOVE the true one by exactly the boat's
 * speed. That is why the construction is a right triangle and why the vertical
 * leg is, literally, the wind you made. At vb = 0 the two coincide: standing
 * still, apparent IS true.
 *
 * Palette stays the template's mono. Grey is what you feel (provisional), ink
 * is what is — the same encoding the note stamps use.
 */

const C = { x: 220, y: 290 };
const PX = 10; // px per knot
const TP = { x: C.x + WIND.TRUE_WIND * PX, y: C.y };

/** Pull a line's head back off the hull so the arrow points at it, not into it. */
function stopShort(from: { x: number; y: number }, to: { x: number; y: number }, gap: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: to.x - (dx / len) * gap, y: to.y - (dy / len) * gap };
}

export function windReadout(speed: number) {
  const magnitude = Math.hypot(WIND.TRUE_WIND, speed);
  const angle = (Math.atan2(WIND.TRUE_WIND, speed) * 180) / Math.PI;
  return {
    speed,
    magnitude,
    angle,
    divergence: WIND.TRUE_ANGLE - angle,
  };
}

export function WindVector({ speed, className = "" }: { speed: number; className?: string }) {
  const AP = { x: TP.x, y: TP.y - speed * PX };
  const trueHead = stopShort(TP, C, 22);
  const appHead = stopShort(AP, C, 22);
  const moving = speed >= 1.5;
  // The leg label needs clear air between the apparent label above it and
  // the true label below; under ~6kt the triangle is too short for three.
  const roomy = speed >= 6;

  return (
    <svg viewBox="180 120 300 230" className={className} aria-hidden focusable="false">
      <defs>
        {/* markerUnits defaults to strokeWidth, which multiplied the apparent
            arrowhead by 3 and then the viewBox scaled it again. Pin both to
            user space so head size is independent of line weight. */}
        <marker id="wv-true" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0 0 L9 4.5 L0 9 z" fill="#757575" />
        </marker>
        <marker id="wv-app" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="8.5" refY="5.5" orient="auto">
          <path d="M0 0 L11 5.5 L0 11 z" fill="#000000" />
        </marker>
      </defs>

      {/* heading */}
      <line x1={C.x} y1={C.y - 45} x2={C.x} y2="150" stroke="#000000" strokeOpacity="0.18" strokeDasharray="3 6" />
      <text x={C.x} y="138" textAnchor="middle" className="wv-label" fill="#757575">heading</text>

      {/* hull */}
      <path
        d={`M${C.x} ${C.y - 42} C ${C.x + 13} ${C.y - 20}, ${C.x + 15} ${C.y + 12}, ${C.x + 11} ${C.y + 40}
            L ${C.x - 11} ${C.y + 40} C ${C.x - 15} ${C.y + 12}, ${C.x - 13} ${C.y - 20}, ${C.x} ${C.y - 42} Z`}
        fill="#ffffff"
        stroke="#000000"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* true wind — fixed, always 12kt on the beam */}
      <line x1={TP.x} y1={TP.y} x2={trueHead.x} y2={trueHead.y} stroke="#757575" strokeWidth="2" markerEnd="url(#wv-true)" />
      <text x={TP.x + 12} y={TP.y + 5} className="wv-label" fill="#757575" opacity={moving ? 1 : 0}>true</text>

      {/* the wind you make — the vertical leg IS boat speed */}
      <line
        x1={TP.x} y1={TP.y} x2={AP.x} y2={AP.y}
        stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 5"
        opacity={moving ? 1 : 0}
      />
      <text
        x={TP.x + 12} y={(TP.y + AP.y) / 2 + 4} className="wv-label" fill="#757575"
        opacity={roomy ? 1 : 0}
      >
        +{Math.round(speed)} kt made
      </text>

      {/* apparent — what you actually feel */}
      <line x1={AP.x} y1={AP.y} x2={appHead.x} y2={appHead.y} stroke="#000000" strokeWidth="3" markerEnd="url(#wv-app)" />
      <text x={AP.x + 12} y={AP.y + 5} className="wv-label" fill="#000000" opacity={moving ? 1 : 0}>
        apparent
      </text>
      <text x={TP.x + 12} y={TP.y + 5} className="wv-label" fill="#000000" opacity={moving ? 0 : 1}>
        apparent = true
      </text>
    </svg>
  );
}
