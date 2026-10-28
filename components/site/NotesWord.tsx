/** Keep the notes/knots wordplay legible, with a normal spoken label. */
export function NotesWord({ capitalized = false }: { capitalized?: boolean }) {
  return (
    <span className="whitespace-nowrap" data-notes-word>
      <span className="sr-only">{capitalized ? "Notes" : "notes"}</span>
      <span aria-hidden="true">
        <span className="font-normal opacity-50">{capitalized ? "K" : "k"}</span>
        <span className="font-semibold">not</span>
        <span className="font-normal opacity-70">e</span>
        <span className="font-semibold">s</span>
      </span>
    </span>
  );
}

export function NotesLabel({ text }: { text: string }) {
  return <>{text.split(/\b(notes)\b/i).map((part, i) =>
    /^notes$/i.test(part) ? <NotesWord key={i} capitalized={part[0] === "N"} /> : part,
  )}</>;
}

