/**
 * Drawn sail glyphs.
 *
 * wolverine-sandbox's galaxy field and hero both run on THEIR photography.
 * Per SITE_CLONE_PLAYBOOK §8 we clone structure and mechanics, never ship
 * their assets — so every mark here is drawn, and the scatter/drift/fade
 * mechanic is what carries over, not the pictures.
 */

/**
 * Four rigs, so the scattered field reads as a FIELD.
 *
 * Wolverine's galaxy is 20 different photographs — the variety is the whole
 * effect. One vector repeated 24 times at identical scale reads as tiled
 * wallpaper, which is a cheaper thing. These are also content: sloop, ketch,
 * gaff and spinnaker are exactly the vocabulary Seasaurus is about.
 */
export const RIGS = ["sloop", "ketch", "gaff", "spinnaker"] as const;
export type Rig = (typeof RIGS)[number];

const PATHS: Record<Rig, React.ReactNode> = {
  sloop: (
    <>
      <path d="M53 9 C 80 40, 86 68, 84 86 L53 86 Z" fill="currentColor" opacity="0.92" />
      <path d="M46 20 C 27 46, 20 70, 20 86 L46 86 Z" fill="currentColor" opacity="0.55" />
    </>
  ),
  ketch: (
    <>
      <path d="M52 14 C 74 42, 79 68, 77 86 L52 86 Z" fill="currentColor" opacity="0.92" />
      <path d="M45 28 C 30 50, 25 72, 25 86 L45 86 Z" fill="currentColor" opacity="0.5" />
      <path d="M84 44 C 92 58, 94 76, 93 86 L84 86 Z" fill="currentColor" opacity="0.7" />
      <path d="M88 40 L88 88" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  gaff: (
    <>
      <path d="M53 22 L82 34 L82 86 L53 86 Z" fill="currentColor" opacity="0.88" />
      <path d="M46 30 C 32 52, 27 72, 27 86 L46 86 Z" fill="currentColor" opacity="0.5" />
    </>
  ),
  spinnaker: (
    <>
      <path d="M50 12 C 84 28, 92 62, 86 86 L50 86 Z" fill="currentColor" opacity="0.6" />
      <path d="M50 12 C 16 28, 8 62, 14 86 L50 86 Z" fill="currentColor" opacity="0.9" />
    </>
  ),
};

/** Mast + sails, in a 100x100 box. */
export function SailGlyph({
  rig = "sloop",
  className = "",
  style,
}: {
  rig?: Rig;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden focusable="false">
      <path d="M50 4 L50 88" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {PATHS[rig]}
      <path d="M8 90 L92 90" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

/** Hero ground: horizon, a fleet at three depths, and a low sun-glow. */
export function HeroSea({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1512 863" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1720" />
          <stop offset="55%" stopColor="#0a121a" />
          <stop offset="100%" stopColor="#04080c" />
        </linearGradient>
        <radialGradient id="glow" cx="0.74" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sailFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="1512" height="863" fill="url(#sky)" />
      <rect width="1512" height="863" fill="url(#glow)" />

      {/* horizon */}
      <line x1="0" y1="600" x2="1512" y2="600" stroke="#ffffff" strokeOpacity="0.13" strokeWidth="1" />

      {/* far fleet */}
      <g opacity="0.16" fill="#ffffff">
        <path d="M300 600 L300 566 C 314 578, 318 592, 318 600 Z" />
        <path d="M372 600 L372 574 C 383 583, 386 594, 386 600 Z" />
        <path d="M1180 600 L1180 570 C 1193 580, 1197 593, 1197 600 Z" />
      </g>

      {/* mid boat */}
      <g opacity="0.5">
        <path d="M980 600 L980 452 C 1028 496, 1042 560, 1040 600 Z" fill="#ffffff" fillOpacity="0.55" />
        <path d="M972 600 L972 486 C 940 528, 926 572, 926 600 Z" fill="#ffffff" fillOpacity="0.3" />
        <path d="M900 600 L1064 600 L1042 618 L920 618 Z" fill="#ffffff" fillOpacity="0.4" />
      </g>

      {/* hero boat — near, right of centre so the headline keeps the left */}
      <g>
        <path d="M1188 604 L1188 232 C 1300 320, 1338 494, 1332 604 Z" fill="url(#sailFace)" />
        <path d="M1176 604 L1176 300 C 1102 386, 1068 522, 1066 604 Z" fill="#ffffff" fillOpacity="0.45" />
        <line x1="1182" y1="216" x2="1182" y2="608" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="3" />
        <path d="M1024 604 L1392 604 L1348 646 L1080 646 Z" fill="#ffffff" fillOpacity="0.72" />
      </g>

      {/* water */}
      <rect y="600" width="1512" height="263" fill="#03070a" fillOpacity="0.55" />
      <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1">
        <line x1="0" y1="646" x2="1512" y2="646" />
        <line x1="0" y1="694" x2="1512" y2="694" />
        <line x1="0" y1="750" x2="1512" y2="750" />
        <line x1="0" y1="814" x2="1512" y2="814" />
      </g>
    </svg>
  );
}
