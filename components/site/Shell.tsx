import {
  Header, Hero, Intro, LoreDefinition, ApparentWind, SeriesCard, Audience, Tally, NotesIndex, Connect,
} from "@/components/site/Sections";
import { NoteOverlay } from "@/components/site/NoteView";
import { PrefsProvider, TreatmentSwitch } from "@/lib/prefs";
import { NotesUIProvider } from "@/lib/notes-ui";

/**
 * One shell, two entry points: `/` opens with no note, `/notes/<id>` opens
 * with that note already showing. Section order mirrors wolverine-sandbox
 * one-for-one: hero · two-col · galaxy · large-card · two-col · market ·
 * carousel · push — with the apparent-wind section inserted after the
 * definition, so the reader meets "lore", then "apparent", then the series
 * named with both.
 */
export function Shell({ initialNoteId = null }: { initialNoteId?: string | null }) {
  return (
    <PrefsProvider>
      <NotesUIProvider initialNoteId={initialNoteId}>
        <Header />
        <TreatmentSwitch />
        <main>
          <Hero />
          <Intro />
          <LoreDefinition />
          <ApparentWind />
          <SeriesCard />
          <Audience />
          <Tally />
          <NotesIndex />
          <Connect />
        </main>
        <NoteOverlay />
      </NotesUIProvider>
    </PrefsProvider>
  );
}
