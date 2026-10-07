import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* wolverine-sandbox substituted ABCDiatype + ABCDiatype-Mono (licensed) with
   Inter + IBM Plex Mono, preserving the measured metrics. Same substitution
   carried here so the display setting stays identical to the source template. */
const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  // REVIEW DEPLOY. A preview build must never be indexed — it would compete
  // with sail-lore.com for the same terms. Remove both this and
  // public/robots.txt when this becomes the real site.
  robots: { index: false, follow: false, nocache: true },
  title: "Sail Lore — Deepen the sailor within",
  description:
    "Notes Apparent—& Building: brief attempts to explain connections, epiphanies and other ideas noted while sailing. By Stefan Bielski, ASA-certified instructor and race coach.",
};

// viewportFit:"cover" is REQUIRED for env(safe-area-inset-*) to resolve on
// notched iOS. Layout heights use svh (never vh/dvh) — SITE_CLONE_PLAYBOOK 4b.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070d12",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
