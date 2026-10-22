import {
  Header, Hero, Intro, LoreDefinition, ApparentWind, SeriesCard, Audience, NotesIndex, Connect,
} from "@/components/site/Sections";
import { NoteOverlay } from "@/components/site/NoteView";
import { PrefsProvider, TreatmentSwitch } from "@/lib/prefs";
import { NotesUIProvider } from "@/lib/notes-ui";

/**
 * One shell, two entry points: `/` opens with no note, `/notes/<id>` opens
 * with that note already showing. Introduce the series immediately before
 * its article index, then provide audience and creative-process context.
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
          <NotesIndex />
          <Audience />
          <Connect />
        </main>
        <NoteOverlay />
      </NotesUIProvider>
    </PrefsProvider>
  );
}
