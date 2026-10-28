import snapshot from "@/content/canvas.notion.json";
import type { Note } from "./content";

export type Inline = { text: string; href?: string; bold?: boolean; italic?: boolean; code?: boolean };
export type ArticleBlock =
  | { type: "paragraph" | "heading" | "quote"; text: Inline[]; level?: number }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "figure"; src: string; alt: string; caption: Inline[] }
  | { type: "divider" }
  | { type: "table"; rows: Inline[][][]; header: boolean };

export function articleBlocks(note: Note): ArticleBlock[] {
  const imported = snapshot as { blocks: ArticleBlock[] | null };
  if (note.id === "canvas" && imported.blocks) return imported.blocks;
  const blocks: ArticleBlock[] = note.body.map(text => ({ type: "paragraph", text: [{ text }] }));
  if (note.quote) blocks.push({ type: "quote", text: [{ text: `${note.quote.text} — ${note.quote.who}` }] });
  if (note.table) blocks.push({ type: "table", header: true, rows: [note.table.head, ...note.table.rows].map(row => row.map(text => [{ text }])) });
  return blocks;
}
