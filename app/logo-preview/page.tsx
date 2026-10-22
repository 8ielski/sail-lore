import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/site/BrandLogo";

export const metadata: Metadata = {
  title: "Logo comparison — Sail Lore preview",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://sail-lore.com/" },
};

export default function LogoPreview() {
  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-10">
      <Link href="/" className="text-[15px] underline underline-offset-4">← Open the full-page preview</Link>
      <p className="sl-mono mt-10 text-grey">Development preview</p>
      <h1 className="mt-3 text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]">A little blue, or monochrome?</h1>
      <p className="mt-5 max-w-[65ch] text-[18px] leading-[1.6] text-grey">Both use the same sail and lettering. Compare them below, then open the full-page preview and use the Color / Monochrome buttons to see them in the header. The live website is unchanged.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {(["color", "monochrome"] as const).map((variant) => (
          <section key={variant} aria-labelledby={`${variant}-heading`} className="overflow-hidden rounded-2xl border border-black/10">
            <h2 id={`${variant}-heading`} className="px-6 pb-4 pt-6 text-[24px] font-bold">{variant === "color" ? "Blue version" : "Black and white"}</h2>
            <div className="flex min-h-[340px] items-center justify-center p-8">
              <BrandLogo variant={variant} className="h-[280px] max-w-full" />
            </div>
            <div className="flex items-center justify-between gap-4 bg-abyss px-6 py-4 text-paper">
              <BrandLogo variant={variant} className="h-[72px] shrink-0" />
              <p className="text-[14px] text-paper/75">At header size, on a dark background</p>
            </div>
          </section>
        ))}
      </div>
      <p className="mt-8 max-w-[70ch] text-[15px] leading-[1.6] text-grey">My starting preference is blue: it adds a restrained sailing accent. Monochrome blends into the existing palette. This is a transparent preview asset prepared from the supplied image; a final export from your original logo file would give us the most faithful production asset.</p>
    </main>
  );
}
