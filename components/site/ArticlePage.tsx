import Link from "next/link";
import { SailGlyph } from "./Sail";
import { NotesWord, NotesLabel } from "./NotesWord";
import { SITE, SERIES, NAV, type Note } from "@/lib/content";
import { articleBlocks, type ArticleBlock, type Inline } from "@/lib/article";

function RichText({ text }: { text: Inline[] }) {
  return <>{text.map((item, i) => {
    let content = <>{item.text}</>;
    if (item.code) content = <code className="rounded bg-black/5 px-1 text-[0.9em]">{content}</code>;
    if (item.bold) content = <strong>{content}</strong>;
    if (item.italic) content = <em>{content}</em>;
    return item.href ? <a key={i} href={item.href} className="underline underline-offset-4">{content}</a> : <span key={i}>{content}</span>;
  })}</>;
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return <div className="space-y-7 text-[clamp(18px,1.5vw,20px)] leading-[1.75] text-ink [overflow-wrap:anywhere]">
    {blocks.map((block, i) => {
      switch (block.type) {
        case "divider": return <hr key={i} className="border-black/15" />;
        case "paragraph": return <p key={i} className="whitespace-pre-wrap"><RichText text={block.text} /></p>;
        case "heading": {
          const Tag = block.level === 3 ? "h3" : "h2";
          return <Tag key={i} className="pt-5 text-[1.4em] font-bold leading-[1.25] tracking-[-0.025em]"><RichText text={block.text} /></Tag>;
        }
        case "quote": return <blockquote key={i} className="border-l-2 border-ink/30 pl-6 italic"><RichText text={block.text} /></blockquote>;
        case "list": {
          const Tag = block.ordered ? "ol" : "ul";
          return <Tag key={i} className={`space-y-2 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}>{block.items.map((item, j) => <li key={j}><RichText text={item} /></li>)}</Tag>;
        }
        case "figure": return <figure key={i} className="py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="mx-auto h-auto max-w-full rounded-lg" loading="lazy" />
          {block.caption.length > 0 && <figcaption className="mt-3 text-[15px] leading-[1.5] text-grey"><RichText text={block.caption} /></figcaption>}
        </figure>;
        case "table": return <div key={i} role="region" aria-label="Article table" tabIndex={0} className="overflow-x-auto rounded-lg border border-black/15"><table className="w-full min-w-[580px] text-left text-[16px]"><tbody>{block.rows.map((row, j) => <tr key={j} className="border-b border-black/10 last:border-0">{row.map((cell, k) => {
          const Tag = block.header && j === 0 ? "th" : "td";
          return <Tag key={k} scope={Tag === "th" ? "col" : undefined} className="px-4 py-3 align-top"><RichText text={cell} /></Tag>;
        })}</tr>)}</tbody></table></div>;
      }
    })}
  </div>;
}

export function ArticlePage({ note, blocks = articleBlocks(note) }: { note: Note; blocks?: ArticleBlock[] }) {
  return <>
    <header className="border-b border-black/10 bg-abyss text-paper">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-5 px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[13px] font-bold tracking-[0.14em]"><SailGlyph className="size-[19px]" />SAIL LORE</Link>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-[15px]">
          {NAV.map(item => item.external ? (
            <a key={item.label} href={item.href}><NotesLabel text={item.label} /></a>
          ) : (
            <Link key={item.label} href={`/${item.href}`}><NotesLabel text={item.label} /></Link>
          ))}
        </div>
      </nav>
    </header>
    <main id="main" className="mx-auto max-w-[820px] px-5 pb-16 pt-10 md:px-10 md:pt-16">
      <Link href="/#notes" className="text-[15px] underline underline-offset-4">← All <NotesWord /></Link>
      <article className="mt-10" aria-labelledby="article-title">
        <header>
          <p className="sl-mono text-grey"><NotesLabel text={SERIES.title} /> · {note.domains.join(" · ")}</p>
          <h1 id="article-title" className="mt-5 text-[clamp(44px,7vw,76px)] font-bold leading-[1] tracking-[-0.04em]">{note.title}</h1>
          <p className="mt-6 text-[clamp(20px,2vw,25px)] leading-[1.5]">{note.dek}</p>
          <p className="mt-5 text-[15px] text-grey">By {SITE.author}</p>
          <dl className="my-9 space-y-4 border-y border-black/15 py-6 text-[17px] leading-[1.6]">
            <div><dt className="sl-mono text-grey">Apparent</dt><dd className="mt-1 text-grey">{note.stamp.apparent}</dd></div>
            <div><dt className="sl-mono text-ink">True</dt><dd className="mt-1">{note.stamp.true}</dd></div>
          </dl>
        </header>
        {note.image && <figure className="mb-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={note.image} alt={note.imageAlt ?? ""} className="h-auto w-full rounded-lg" />
          {note.imageCaption && <figcaption className="mt-3 text-[15px] text-grey">{note.imageCaption}</figcaption>}
        </figure>}
        <ArticleBody blocks={blocks} />
        <footer className="mt-12 flex flex-wrap justify-between gap-5 border-t border-black/15 pt-6 text-[15px]">
          <Link href="/#notes" className="underline underline-offset-4">← All <NotesWord /></Link>
          <a href={note.source} className="text-grey underline underline-offset-4">Original on Notion ↗</a>
        </footer>
      </article>
    </main>
  </>;
}
