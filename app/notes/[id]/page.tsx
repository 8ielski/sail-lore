import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOTES } from "@/lib/content";
import { Shell } from "@/components/site/Shell";

/**
 * The cold entry for a shared note link.
 *
 * In-session, opening a note is a pushState — the server is never asked. This
 * route exists so that pasting the URL somewhere still lands on the note,
 * which is the whole point of the "route" URL treatment; without it the link
 * would 404 for everyone who didn't click it from the page itself.
 */
/** Static export: the 12 ids below are the complete set. */
export const dynamicParams = false;

export function generateStaticParams() {
  return NOTES.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const note = NOTES.find((n) => n.id === id);
  if (!note) return {};
  return { title: `${note.title} — Sail Lore`, description: note.dek };
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!NOTES.some((n) => n.id === id)) notFound();
  return <Shell initialNoteId={id} />;
}
