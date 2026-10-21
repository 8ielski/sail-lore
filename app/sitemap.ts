import type { MetadataRoute } from "next";
import { NOTES } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://sail-lore.com/" },
    ...NOTES.map((note) => ({ url: `https://sail-lore.com/notes/${note.id}/` })),
  ];
}
