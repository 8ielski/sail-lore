import type { Metadata } from "next";
import { ArticlePage } from "@/components/site/ArticlePage";
import { NOTES } from "@/lib/content";
import type { ArticleBlock } from "@/lib/article";
export const metadata: Metadata = { title: "Reading layout fixture — preview only", robots: { index: false, follow: false }, alternates: { canonical: "https://sail-lore.com/notes/canvas/" } };
// Deliberately schematic layout fixtures, not proposed article illustrations.
const graphic = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#eee"/><text x="320" y="180" text-anchor="middle" font-family="sans-serif" font-size="22">Layout test — not final artwork</text></svg>');
const text = (value: string) => [{ text: value }];
const blocks: ArticleBlock[] = [
  { type: "paragraph", text: text("This development-only page exercises the article layout. None of this placeholder material replaces Canvas or appears in the homepage collection.") },
  { type: "figure", src: graphic, alt: "Schematic figure used only to test the reading layout", caption: text("First inline figure: caption and alternative text.") },
  { type: "heading", level: 2, text: text("Figures belong beside the relevant explanation") },
  { type: "paragraph", text: [{ text: "A paragraph can contain " }, { text: "emphasis", bold: true }, { text: " and " }, { text: "a link", href: "/#notes" }, { text: "." }] },
  { type: "list", ordered: true, items: [text("First point"), text("Second point")] },
  { type: "quote", text: text("A quotation remains part of the reading flow.") },
  { type: "figure", src: graphic, alt: "Second schematic layout test figure", caption: text("Second inline figure, following more text.") },
  { type: "table", header: true, rows: [[text("Heading A"), text("Heading B"), text("Heading C")], [text("A wide table"), text("Scrolls inside its own container"), text("Not the whole page")]] },
];
export default function LayoutPreview() {
  return <ArticlePage note={{ ...NOTES.find(n => n.id === "canvas")!, title: "Reading layout test", image: graphic, imageAlt: "Opening layout-test placeholder", imageCaption: "Optional opening image — layout test only." }} blocks={blocks} />;
}
