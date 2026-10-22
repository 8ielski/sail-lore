/**
 * Sail Lore content.
 *
 * Sourced verbatim from Stefan Bielski's Notion site (sail-lore.com) on
 * 2026-08-21. Every note carries its FULL body here rather than being fetched,
 * so the click-through opens instantly with no request in flight.
 */

/**
 * Photography slots — all empty today, all optional.
 *
 * The site currently renders drawn SVG everywhere (see components/site/Sail.tsx)
 * because shipping Wolverine's photographs was never on the table. Every slot
 * below falls back to that drawing when unset, so adding Stefan's own photos is
 * a drop-in: put the file under public/media/… and name it here.
 *
 *   hero      → full-bleed behind the headline (replaces the drawn sea)
 *   GALLERY   → the scattered tiles behind the lore definition (114x114 crop)
 *   Note.image→ that note's card thumbnail and its popup header (900x676-ish)
 */
export const SITE = {
  name: "Sail Lore",
  hero: "" as string,
  /** Hero kicker. Was SITE.tagline, which repeated the h1 word for word. */
  kicker: "Notes Apparent—& Building",
  /** From the Sail Lore LinkedIn company page. Unused; a candidate kicker. */
  altKicker: "From desk to deck. Sail more, stress less.",
  tagline: "Deepen the sailor within",
  // No full stops. Wolverine's hero is "Make. Every Day. Better." — three
  // staccato statements. That is their copy voice, not their structure;
  // this is one sentence broken over three lines and reads as one — which
  // is also why the case stays down after the first word.
  display: ["Deepen", "the sailor", "within"],
  author: "Stefan Bielski",
} as const;

/**
 * The intro.
 *
 * Re-ranked, not rewritten — every line is his. The greeting was the section
 * heading; on a Notion page that is fine throat-clearing, at 33px/700 it
 * becomes the thesis and contradicts the hero's promise. It is now a kicker.
 * The heading is his own line "how sail knowledge leads to self knowledge",
 * which was set as 15px caption text inside the wayfinding grid.
 */
export const INTRO = {
  kicker: "Welcome to Sail Lore",
  headingLines: ["How sail knowledge", "leads to", "self-knowledge."],

  /**
   * Bio — option C of three drafted 2026-08-21 with Stefan in the room.
   * Swap the string to change it; A and B are kept below verbatim.
   *   A "From desk to deck. I'm Stefan Bielski — ASA-certified instructor and
   *      race coach out of Annapolis, seasonally in Banderas Bay. I coach
   *      performance sailing, and I've run sailing-based team-building for the
   *      World Bank and Wharton."
   *   B "I'm Stefan Bielski — ASA-certified instructor and race coach,
   *      Annapolis and Banderas Bay. I took what I call a Seabbatical during
   *      the pandemic: a deliberate break from my professional life to immerse
   *      in sailing. These are the notes from it."
   */
  body:
    "I’m Stefan Bielski — ASA-certified instructor and race coach, Annapolis and Banderas Bay. " +
    "Sail Lore began in 2023 as a shingle to hang out; a Seabbatical during the pandemic turned it " +
    "into something closer to a serendipity engine — coaching, crew matchmaking, and a standing " +
    "interest in another rail to sit on.",

  /**
   * His order preserved. The "…and finally" line is restored to where he had
   * it — attached to Notes Apparent — instead of floating with no referent.
   * Three of the four live on his Notion site and are marked external; nothing
   * here is inert any more.
   */
  wayfinding: [
    { label: "Bio", note: "my sailing background",
      href: "https://bielski.notion.site/Bio-sail-coach-instructor-e6f17dac482541c1b3448bff734b3d6e", external: true },
    { label: "Sample Services", note: "how I could help you",
      href: "https://bielski.notion.site/p/0a6b43707fcf424d8f6364d6da27ecec", external: true },
    { label: "Seasaurus", note: "sailing’s many synonymous terms",
      href: "https://bielski.notion.site/Seasaurus-b722c0904a894dcf85d2e261dce66fe5", external: true },
    { label: "Notes Apparent", note: "…and finally, the part of this site I’ve come to put the most thought into",
      href: "#notes", external: false },
  ],
} as const;

/**
 * The dictionary block.
 *
 * The definition section presents all three senses together beneath "lore".
 * `display` retains the third sense's original wording; its fragments are
 * joined as a sentence rather than forced into the old staggered headline.
 */
export const LORE = {
  word: "lore",
  pron: "/lôr/",
  pos: "noun",
  displayNote: "archaic",
  display: ["something", "that is taught:", "workmanship"],
  /** Sense 2 — the safer choice, and closest to what the series actually does. */
  altDisplay: ["something", "learned through", "study or experience"],
  /** First two meanings; the archaic third meaning is stored in display. */
  senses: [
    "a particular body of knowledge or tradition",
    "something that is learned through study or experience",
  ],
  etymology:
    "from Old English lār “learning, what is taught, knowledge, science, doctrine; art or act of teaching”",
  /** His own link, dropped in the first pass. It points at Lore x 4. */
  more: {
    label: "More Lore",
    note: "four kinds of knowing",
    href: "https://bielski.notion.site/Lore-x-4-e448236a3a394e30956da034c0742073",
  },
} as const;

/**
 * The apparent-wind section.
 *
 * TRUE_WIND is fixed and MAX_BOAT is the top of the scroll runway; the
 * geometry in components/site/WindVector.tsx is derived from both, so changing
 * a number here changes the drawing and the readout together.
 */
export const WIND = {
  word: "apparent",
  pron: "/əˈperənt/",
  pos: "adjective",
  heading: "Apparent is not true.",
  body: [
    "Apparent wind is the wind you feel on deck — the true wind, plus the wind your own motion makes. It is the only wind you can feel, and it is never the real one. Your telltales show apparent. Your cheek shows apparent. True has to be inferred.",
    "Trim to apparent. Navigate by true.",
  ],
  cue: "Scroll. The boat accelerates; the true wind never moves.",
  payoff: "The faster you go, the further apparent diverges from true.",
  TRUE_WIND: 12,
  TRUE_ANGLE: 90,
  MAX_BOAT: 14,
} as const;

/** The series framing — "About X Notes Apparent—& Building…" */
export const SERIES = {
  title: "Notes Apparent—& Building",
  countNote: "The numeral preceding “Notes” reflects my current number of entries.",
  about: [
    "This section/series contains some brief attempts to explain connections, epiphanies and other ideas I’ve noted while sailing.",
    "Some came from conversations: trying to explain things to my sailing students and racing coachees, conversing with other crew members, or interacting with parts of the boat. Others originate in inner dialogues: manning 3 a.m. watches alone during crossings and even sitting on the rail while racing provided me device-free time for deep thinking.",
    "Also, I try to cross-fertilize and synthesize ideas from my other businesses/projects.",
  ],
  audienceHeading: "Audience",
  audience: [
    "While the intended audience here is primarily those that have at least some appreciation and understanding of sailing, I hope others can use them as an entry into nautical worlds. I plan to work on “Landlubbers Lore” introductions to explain nautical terms & processes to a broader audience.",
    "Cross-fertilizing knowledge through simplification, systemization, translation, and metaphor is a worthwhile challenge, I find.",
    "There’s a scene in HBO’s The Wire that I hope to emulate. In it, the character D’Angelo, disappointed to see his less-educated cadre in the hood playing checkers with chess pieces—explains the rules of chess to them. Meanwhile, he simultaneously explains the dynamics of drug dealing to the show’s audience.",
  ],
  epigraph: { text: "All knowledge leads to self-knowledge.", who: "Bruce Lee" },
  siblings: [
    { name: "Professions on Purpose", line: "“Do Work that Calls to You”. PoP is Stefan’s day job.", href: "https://professionsonpurpose.com/about/" },
    { name: "F.A.R.M.", line: "“Cultivate Your Self”. Natural Intelligence is AI’s antidote.", href: "https://farm.fyi/" },
  ],
} as const;

/** Tiles behind the definition. Any count; they repeat to fill the scatter. */
export const GALLERY: string[] = [];

export type Note = {
  id: string;
  /** e.g. "/media/notes/canvas.jpg" — falls back to the drawn sail when empty. */
  image?: string;
  /** The front door. Exactly one note should carry this; the hero card uses it. */
  featured?: boolean;
  /**
   * The title's device, made into a repeating form.
   *
   * `apparent` is what it looks like from the deck; `true` is what it actually
   * is. Apparent wind is the only wind you can feel and it is never the real
   * one — so the pair is not a summary, it is the note's own claim stated
   * twice, once wrong.
   */
  stamp: { apparent: string; true: string };
  glyph: string;
  title: string;
  dek: string;
  domains: string[];
  body: string[];
  quote?: { text: string; who: string };
  table?: { head: string[]; rows: string[][] };
  draft?: boolean;
  source: string;
};

export const NOTES: Note[] = [
  {
    id: "canvas",
    glyph: "🖼️",
    title: "Canvas",
    dek: "The surface for oil painting, the floor of a boxing ring, the background of every narrative — and, long, the cloth of every sail.",
    stamp: {
      apparent: "Canvas is what a sail used to be made of.",
      true: "It is the surface of every struggle — the painter's, the boxer's, the politician's, and your own.",
    },
    domains: ["Etymology", "Materials"],
    source: "https://bielski.notion.site/Canvas-76a9a8d1f4d149f089c4ff18fcb8d87f",
    body: [
      "The canvas is a place of creativity and struggle—literally and figuratively. It’s the surface for oil painting.",
      "It’s the floor of a boxing or wrestling ring.",
      "It’s the lore: the background setting and scope of narratives, whether fictional or historical.",
      "And “to canvass” means testing of support, as in politics, but also in our own community—or even within the constituent parts of ourself.",
      "Long, the traditional material for sailcloth, canvas has been replaced by newer materials: nylon, Dacron, Kevlar, taffeta laminates and carbon composites. Yet, it remains the go-to cloth for protecting a boat’s parts—and passengers—from the elements: wheel and winch covers and biminis, dodgers and to protect wheels and winches.",
    ],
  },
  {
    id: "white-mirror",
    featured: true,
    glyph: "🪞",
    title: "The White Mirror",
    dek: "Screens filter and conceal; canvases capture and harness. When we tend the sail, it tends us back.",
    stamp: {
      apparent: "A sail is a white sheet you keep adjusting.",
      true: "Screens are black mirrors that read you. Sails are white mirrors that ask you to read the world.",
    },
    domains: ["Attention", "Technology"],
    source: "https://bielski.notion.site/The-White-Mirror-75f362db7c6947179c50d0de8b66494f",
    body: [
      "The sail contrasts with the technology that now dominates our lives. We interface with that tech through screens—which by definition are things that filter and conceal. (Whereas canvases capture and harness.) When off, those screens are black mirrors, reflecting our image back to us. That phenomenon gave the name to the British-made, Netflix series The Black Mirror.",
      "Its dystopian tales showed how our screens see our darkest desires and fears, then exploit, tempt and manipulate us. Our increasingly fractured, fleeting attention and intention suffice for those black mirrors. In fact, they prefer and rely on it.",
      "Whereas, when we tend those white mirrors, the sails in turn cultivate in us deeper, holistic attention and intention. We adjust them taking into account the complex interactions: ever-changing wind, sea currents, tides, and waves; the abilities and needs of the many machines on our vessels; our teammates and those teams on other boats.",
    ],
    quote: {
      text: "When the mind is free of any thought or judgment, it is still and acts like a mirror. Then and only then can we know things as they are.",
      who: "W. Timothy Gallwey, The Inner Game of Tennis",
    },
  },
  {
    id: "three-ms",
    glyph: "3️⃣",
    title: "Sailing’s 3Ms",
    dek: "Machines, men, and mother nature. No other sport encompasses all three — and between them they encompass all of existence.",
    stamp: {
      apparent: "Sailing is a sport with an unusual number of moving parts.",
      true: "Machines, men and mother nature — and between them, everything that exists.",
    },
    domains: ["Systems", "Craft"],
    source: "https://bielski.notion.site/Sailing-s-3Ms-a4a566e5510946f29c5fe810380a35ea",
    body: [
      "Sailing, particularly as a sport, has three defining ‘M’s: machines, men, and mother nature. I’d argue that makes sailing unique among athletics. No other sport encompasses all three—or at least to anywhere near this degree.",
      "Machines include not only the obvious bundles of moving parts like motors, the pulleys on blocks and the gears inside winches. Most fundamentally, it includes the hull itself, and how it, the attached keel, and rudder sit in—and move through—the water: how it heels, planes, counter drift and provides lift. Sails themselves are complex machines. Each sail’s three (typically) sides and each of its corners can be adjusted (”trimmed” in nautical parlance) to change the shape. While sails are referred to as vertical wings, they can shape shift much more than those of any airplane or helicopter. Lore domains: These are the knowledge of ancient professions: naval architects and sailmakers. Upon that are layers of technology, increasingly complex: the stuff of silicon—and the software that runs it.",
      "Men means the crews that run—and therefore race—boats. While there are occasional single-handed competitions, they’re still racing against the crews on other boats. Communication is constant—and comprehensive. Crewmembers share information on all the machines, including competing machines—and mother nature, as described below. While sailing hails from top-down traditions honed, particularly over the past several centuries, those hierarchies have since again flattened. Lore domains include managing information flows that became much more dynamic. It means recruiting, training, retaining and managing teams. Self knowledge is key too. This means knowing one’s blind spots: boats hold plenty of literal ones from any vantage points. And figurative blind spots abound too: one’s cognitive biases, risk preferences, talents…",
      "Mother Nature includes the air: the winds, the storms, the high and low pressure front. She includes the sea: the complex interaction of currents, eddies, tides and waves. She encompasses from the tiniest creatures (both animal and vegetable) that colonize a boat’s hull and keel up to the earth’s greatest: whales. (I’ve dodged several during races. Orcas actively attack rudders: talking about you, Iberia). Lore domains include meteorology, marine biology, oceanography.",
      "Actually, in all of existence, those three encompass everything. There’s the things we’ve created (machines) ourselves (men), and the rest of creation (Mother Nature).",
    ],
  },
  {
    id: "happiness-equation",
    glyph: "🧭",
    title: "Happiness Equation",
    dek: "Arne Naess divided self-realization by consumption. Comfort can be bought, happiness borrowed — fulfillment must be built.",
    stamp: {
      apparent: "A good day on the water makes you happy.",
      true: "Happiness is self-realization over consumption. Comfort can be bought and happiness borrowed; fulfillment has to be built.",
    },
    domains: ["Philosophy", "Friluftsliv"],
    source: "https://bielski.notion.site/Happiness-Equation-5481fb6668874533b19a2182f0250c48",
    body: [
      "It’s International Happiness Day (20th March)—I just learned. And if there’s anything harder than pursuing happiness, it’s merely defining it. So, it’s worth honoring those who pursue a definition of happiness—especially when sailing epitomizes that definition.",
      "The Norwegian philosopher Arne Naess proposed a simple but profound equation for happiness. Before I get to the various formulations, I’ll mention Naess’s philosophy is rooted in a Nordic concept called friluftsliv, which literally means “open-air living”. Friluftsliv is a way of life that embraces nature as a source of recreation, health, and spiritual nourishment. It encompasses everything from sailing and hiking to camping and fishing, as well as simply enjoying fresh air and scenery.",
      "More than just a hobby or an activity, friluftsliv is an attitude, a mindset which helps us appreciate the simple pleasures of life and cope with its challenges. (Naess, who coined the term “deep ecology”, thought it would also inspire us to protect the environment and live more sustainably.)",
      "The simplest formulation is H = S / C, where H is happiness, S is self-realization, and C is consumption. This suggests happiness can be increased by reducing our dependence on material goods and technology, while increasing our connection with ourselves and nature. Less is More.",
      "A second is H = P + (E x S). Here, happiness depends on personal characteristics (P), external conditions (E), and how well these match our goals or aspirations (S). In other words, happiness is not simply having good things happen to us, but also of how we relate to them and how they fit with our values and desires.",
      "Later, Naess replaced “happiness” with “well-being”. Well-being or “human flourishing” is a better translation of eudaimonia (Aristotle called it the highest human good), and acknowledges how much “happiness”, at least in English, is unfortunately conflated with comfort and pleasure.",
      "We too often choose comfort over happiness and happiness over fulfillment. Perhaps it’s choosing the known over unknown, familiar over unfamiliar. It seems a “safe bet”. So, in addition to Naess’ equations, I’ll add an inequality of my own: Comfort < Happiness < Fulfillment.",
      "We think that enough comforts will add up to happiness. And enough happy moments will break us through to a fulfilling life. But the world’s wisdom traditions all tell us otherwise. Comfort can be bought. Happiness can be borrowed. Fulfillment must be built.",
      "Sailing, like Naess’ beloved mountaineering, provides both the pains—and the glow to overcome them.",
    ],
  },
  {
    id: "starboard-tack",
    glyph: "🧠",
    title: "Your Brain, on Starboard Tack",
    dek: "Port side is for what you already know to do; starboard for what you’re trying to figure out. The modern world lashes the port side.",
    stamp: {
      apparent: "A boat has a port side and a starboard side.",
      true: "So does your brain, and the modern world keeps you pinned on port.",
    },
    domains: ["Neuroscience", "Practice"],
    source: "https://bielski.notion.site/Your-Brain-on-Starboard-Tack-590ac78b03dd4f11adafd5317e840f0c",
    body: [
      "Your brain, like a boat, has two sides—or hemispheres. Unlike with boats, your brain’s sides differ greatly in structure and function: how they perceive and interact with the world.",
      "The port hemisphere is more analytical, logical, and focused on details. It excels at breaking things down into parts and categories, using language and symbols, and following rules.",
      "Whereas, the starboard hemisphere is more holistic, intuitive, and creative. It sees the big picture and the connections between things, using non-verbal communication and gestures, while being flexible and open to new possibilities. (Lore provides a way to look at this: port side is for what you already know what to do, starboard side for what you’re trying to figure out.)",
      "Unfortunately, while both port and starboard are valuable and complementary, the modern world pushes us to overuse our brain’s port side. The world’s wind and waves lashing our port side prefer certainty, clarity, and simplicity over ambiguity, complexity, and nuance. That’s the thesis of psychiatrist and neuroscientist Iain McGilchrist, especially as laid out in his book The Master and His Emissary: The Divided Brain and the Making of the Western World.",
      "This leads to many problems such as loss of meaning, alienation from nature, fragmentation of knowledge, reductionism in science, bureaucracy in politics, consumerism, and our current culture wars. We need to develop our starboard side.",
      "On boats you can merely re-arrange when you choose to be on tack: you can’t increase your time on starboard tack. Fortunately, your brain doesn’t have such geometric restrictions. We can restore that balance in many ways: Sing Shanties (art, music, poetry, storytelling, humor). See the Sea (time in nature or with animals). Single-Hand? (mindfulness or meditation). Skill up (new skills or languages). Sail More (travel, reading, volunteering, people from different backgrounds).",
      "To stay on the right tack, you need the right knacks (skills or abilities to do things easily and well). Sailing either provides or facilitates practically all the above. While dealing with machines is left brained, dealing with men and mother nature is right-brained.",
    ],
    quote: { text: "Neurons that fire together, wire together.", who: "Donald Hebb" },
  },
  {
    id: "lore-x-4",
    glyph: "4️⃣",
    title: "Lore x 4",
    dek: "Know-that, know-how, know-as, know-by. Four types of knowledge with deep traditions behind them — and sailing combines all four.",
    stamp: {
      apparent: "Knowing how to sail is one skill.",
      true: "It is four kinds of knowing at once: know-that, know-how, know-as, know-by.",
    },
    domains: ["Epistemology", "Vervaeke"],
    source: "https://bielski.notion.site/Lore-x-4-e448236a3a394e30956da034c0742073",
    body: [
      "What is “lore”? What does it mean to know something?",
      "There are four types of knowledge—with deep traditions and language behind them. Sailing combines all four. For each type of lore, this chart gives a simple definition, along with the contexts in which they are learned, the word root, and the alliterative term used by cognitive scientist / philosopher John Vervaeke.",
      "For those who haven’t kept up with their ancient Greek, it helps to remember today’s derived terms: Epistemology, the philosophy branch dedicated to knowledge. Technology, the application of scientific knowledge for practical purposes. Noetic, of or relating to the intellect. Gnostic(ism), religious ideas oriented toward knowledge and understanding.",
      "I may replace or augment gnosis with other Ancient Greek terms: phronesis, practical wisdom or intelligence; metis, accumulated wisdom — practical, experiential, tacit knowledge.",
    ],
    table: {
      head: ["Lore", "Learned", "Sailing example", "Greek", "Vervaeke"],
      rows: [
        ["know-that", "facts, theory: classroom, reference material", "A ketch has two masts, main taller than mizzen", "episteme", "propositional"],
        ["know-how", "studio, workshop, on-the-job", "tying a bowline", "technē", "procedural"],
        ["know-as", "from an occupation (sailmaker) or position (bowman)", "when the jib is properly trimmed", "noesis", "perspectival"],
        ["know-by", "living through a situation, especially repeatedly", "rounding Cape Horn, single-handed", "gnosis", "participatory"],
      ],
    },
  },
  {
    id: "yin-yang",
    glyph: "☯️",
    title: "Yin-Yang of Work & Play",
    dek: "Laborious play and ludic work both lead to flow. “Work hard, play hard” usually just means swinging between drudgery and debauchery.",
    stamp: {
      apparent: "Sailing is play that happens to involve hard work.",
      true: "Work and play each contain the other. “Work hard, play hard” is just drudgery alternating with debauchery.",
    },
    domains: ["Flow", "Taoism"],
    source: "https://bielski.notion.site/Yin-Yang-of-Work-Play-879c3957e74e429ba1dd671cf36adf9a",
    body: [
      "Sailing is play with lots of hard work: both physical and mental. It requires brute strength and dexterity, deliberate focused concentration and passive observation.",
      "It mirrors my best work, which is full of play. It’s creative: making connections. It’s convivial, full of energy and enthusiasm. It’s autotelic: done for its own sake.",
      "Laborious play and ludic work both lead to flow states: when we are fully immersed and engaged in an activity that challenges our skills and abilities. We lose self-consciousness, gain senses of control and efficacy, plus immediate feedback we then adapt to.",
      "This counters our culture’s typical work-play juxtapositions. Those who claim to “work hard and play hard” usually mean they swing back and forth between drudgery and debauchery. At best, it entails the gamification of everyday tasks: which is just a playful veneer over a slogging reality.",
      "This work within play—and play within work—embodies the Yin-Yang concept: everything is made up of competing, yet complementary forces. While these forces oppose each other, they are not necessarily opposite, as each contains an aspect of the other. For example, there cannot be a shadow without light.",
      "And shadow likely led to this insight. The symbol graphs the daily progress of a pole’s shadow length during the year. Think of the sail-shaped plate on a sundial. (In the west, we call it a “gnomon”, rooted via carpentry, in the term for “one that discerns or examines, interpreter, expert”. It’s about knowing—or “Lore”.)",
      "On the water, we can see and experience such interactions: the morning fog (Yin) gets dissipated by the heat of the sun (Yang); and that Yang, like a hot summer day, is more likely to bring the Yin of a sudden thunderstorm.",
      "Sailing embodies this dynamic equilibrium. Most fundamentally, in our sails, we see the pair of pairs: thrust v. drag, lift v. weight in the four fundamental forces of aerodynamics. We balance headsail and foresails. We experience the above-water perpendicular force of wind on the sail complementing the below-the-water opposing force on the keel.",
      "Sailing not only balances play with hard work. Each of those balances the physical and then mental. And each of those in turn are balances: brute strength (Yang) and dexterity (Yin), deliberate focused concentration (Yang) and passive observation (Yin).",
    ],
  },
  {
    id: "affordable-loss",
    glyph: "🪁",
    title: "Affordable Loss: Spintrepreneurship",
    dek: "“Don’t let it collapse” is bad advice. Lower the cost of collapse instead. Fail Fast ⇒ Sail Fast.",
    stamp: {
      apparent: "Don't let the chute collapse.",
      true: "Don't let a collapse cost too much. Fail fast, sail fast.",
    },
    domains: ["Effectuation", "Risk"],
    source: "https://bielski.notion.site/Affordable-Loss-Spintrepreneurship-35185e50128d49fb8ec888d2802af53e",
    body: [
      "Newish spinnaker trimmers are repeatedly told “don’t let it collapse”—whether by the helmsman—or internally, by themselves. This rule of thumb is overly simplistic. It leads to excess loss aversion: chutes get over-trimmed. Pulled tight, they don’t get that characteristic curl that shows they are optimally flying. From there, faults cascade into failures: failure to head down, failure to speed up, failure to get that telltale hum in the rigging, failure to plane the boat, failure to keep up with competitors.",
      "Such excess risk aversion is addressable by the Affordable Loss Principle (ALP). Entrepreneurs focus on what they are willing to lose, rather than their expected returns—as practiced by mature businesses.",
      "ALP frees them from depending on predicting the future, like big concerns put so much energy into trying to do. Entrepreneurs don’t command the resources to know which way the fickle winds of the marketplace are blowing, so better to be nimble.",
      "Likewise, our scrappy “spintrepreneur” can instead focus on lowering the cost of the kite collapsing. This is done by getting better at recovery. While the trimmer’s fast reaction is necessary, it’s not always sufficient. An attentive fellow crew member on the winch may be needed to help yank the spinnaker to life. Having the helmsman head up can also refill the chute.",
      "Such quick reaction—plus concerted action—brings cheaper failures. Fail Fast ⇒ Sail Fast.",
      "Affordable occasional collapses only punctuate the considerable higher boat speeds, so the average speed is still higher. That speed powers the team to fail finitely, fail fast, fail frequently, and fail forward. Those generate lessons: getting to know the chute, the whole boat, the crew, the conditions. That virtuous circle also allows greater range of tactical options: come down, or speed up, gybe, pass other boats.",
      "So, the “don’t let it collapse” heuristic gets refined into “don’t let a collapse cost us (too much)”. Some things work best at the edge. Those include both entrepreneurs and spinnakers.",
    ],
  },
  {
    id: "call-and-callouses",
    glyph: "🧤",
    title: "The Call—& Callouses—of the Sea",
    dek: "Why more men should get out, way out of the office. A bookworm’s case for physical adventure.",
    stamp: {
      apparent: "Sailing is a hobby for a man with a desk job.",
      true: "Some people cannot spend forty years at a desk, and the sea is a real answer rather than a consolation.",
    },
    domains: ["Vocation", "Work"],
    source: "https://bielski.notion.site/The-Call-Callouses-of-the-Sea-818378f6193d4e0c97161ca32c07419f",
    body: [
      "While I’m rather cerebral (a book worm, I studied intellectual history, worked for think tanks, pursue a rich inner life…) I’ve come to see and feed my needs for physical adventure.",
      "The pandemic forced this — and led me to quadruple my time sailing, by snow birding to and fro Mexico’s Pacific coasts a few years and in 2022 taking on side gigs teaching sailing and coaching races.",
      "While sailing will remain my avocation (mainly as my vocation calls to me so much louder), I would like to see others consider maritime and other outdoor professions — or avocations, even if only in retirement.",
      "A New York Times piece, which I wish I wrote myself, has some great perspectives, by both the think tankers and the tankermen — all my brothers from other mothers.",
    ],
    quote: {
      text: "there’s always going to be this sort of built-in group of folks who cannot — just cannot — stand seeing themselves sitting at a desk for 30, 40, 50 years. It’s this hands-on business almost like, you know, when you’re a kid and you’re playing with trucks or toys, and then you get to do it in the life-size version.",
      who: "“If There Is a ‘Male Malaise’ With Work, Could One Answer Be at Sea?”, The New York Times",
    },
  },
  {
    id: "racing-roles",
    glyph: "🧾",
    title: "R.A.C.I.ng Roles & Rules",
    dek: "Responsible, Accountable, Consulted, Informed — a consulting framework that is sadly underused on a race boat.",
    stamp: {
      apparent: "The helmsman calls the tack.",
      true: "Responsible and accountable are two different jobs, and everyone aboard has a right to know.",
    },
    domains: ["Teams", "Communication"],
    source: "https://bielski.notion.site/R-A-C-I-ng-Roles-Rules-ab116043e4d54abc96ccd839f208da4f",
    body: [
      "RACI is a framework from the managerial consulting world that facilitates communication, decision making, and overall management of teams. It’s sadly underused in sailing, especially in racing (and perhaps undertakings of all types). It recognizes both the limits and value of hierarchy.",
      "RACI stands for Responsible, Accountable, Consulted, & Informed. This deserves elaboration. Especially, as “Accountable” and “Responsible” seem synonymous to most of us, those two in particular need to be contrasted.",
      "Responsible = does the job. Think: ResponsABLE — having the ability to respond.",
      "Accountable = “the buck stops here” is the simplest way.",
      "Consulted = those asked for opinion—and they often deserve to be asked, even if their counsel is not heeded. They may also be asked to justify their opinion. For both requests “Don’t know”, if true, is usually a valid response.",
      "Informed = the right to know. This is often after a decision has been made, but before implementing the decision impacts them.",
      "For example, everyone — even rail meat, especially rail meat — needs to know a decision, like to tack. They have the right, and the helmsman is accountable for informing them, even if those most able to respond, that is forward the message, may be intermediaries, e.g. pit man.",
      "I first wrote this when coaching a sailing team of 4 on a small keelboat during Wednesday Night Races and a regatta. While the architecture of every boat differs, the concrete examples illustrate the principles—and should be easily adaptable for differing boats and contexts.",
      "A former Booz Allen consultant introduced me to RACI in Buenos Aires nearly 15 years ago. Then, I was trying to transition away from the magazine business I came to BsAs to start. It failed—and the failure was hard and slow to see—in large part due to the poor communication and distribution of authority amongst my partners. That dysfunction trickled down into the team and shook my self confidence. I had successfully started and then sold basically the same business in Poland; there I managed the dysfunction.",
    ],
    table: {
      head: ["Station", "R / A / C / I"],
      rows: [
        ["Helm", "(A) eyes on the road · (A+R) steer steady and efficient · (C) advise Main of weather helm · (I) inform everyone of pending tacks and gybes"],
        ["Main", "(A+R) trim mainsail with mainsheet and traveler; be ready to ease when helm needs; accountable for outhaul, vang, Cunningham, backstay"],
        ["Jib", "prep windward sheet for next tack; continuously trim foresails to point of sail; accountable for fairlead, leech line, furling line, halyard"],
        ["Pit", "(A+R) hoists, douses, halyards, tack line, foredeck issues; responsible for things within reach; assist on jib trim"],
        ["Tactician", "keep time, set course, advise on when to tack and on puffs"],
        ["All", "always: be wind aware. Direction minimum; puffs a bonus"],
      ],
    },
  },
  {
    id: "spinthesis",
    glyph: "🪂",
    title: "Spinthesis: My Dubai Dialectic",
    dek: "The cockpit is the thesis, the pointy end the antithesis. Insiders vs outsiders, brains vs brawn, glamour vs grunts.",
    stamp: {
      apparent: "The cockpit is where the action is.",
      true: "The pointy end is a different culture — and Dubai has the same two ends.",
    },
    domains: ["Dialectics", "Anthropology"],
    draft: true,
    source: "https://bielski.notion.site/Spinthesis-My-Dubai-Dialectic-draft-1b691ff5e3504fd28c6b63705224e4a5",
    body: [
      "When I lived in Dubai, I got to both play anthropologist and learned to fly spinnakers. There’s more in common there than is obvious. I’m going to try to explain this via dialectics.",
      "Thesis (“a placing, a proposition”): be in the boat’s cockpit — that’s the control center, where crew are concentrated, where the action is, and it’s, via the companionway, closest to the cabin.",
      "Antithesis (“to set against, oppose”): the opposite clan is made up of bowmen, and perhaps anyone else forward of the companionway. That “pointy end of the boat” has a different culture. So far away, yet so in your face.",
      "Insiders vs. outsiders: the Emiratis are the boat owners. When I lived there, natives made up only 3% of Dubai’s population. The outermost don’t speak the native Arabic, nor the lingua franca English, but instead Malayalam or Tagalog or Urdu.",
      "Brains vs. brawn: the habitués of the cockpit (coach, tactician, navigator, owner’s rep) make up the boat’s brain trust. They might not do any physical work at all; in some cases, racing rules actually prohibit them, short of an emergency, from doing so. The bowmen run a wider range of physical tasks: hoisting, heaving, launching, gybing, dousing. Yet Dubai’s famous, ever-evolving skyline was built by imported construction crews. Lifelines keep both bowmen and builders from falling — the former into the sea, the latter toward the ground.",
      "Glamour vs. grunts: in Hollywood parlance, the stars are in the cockpit. The captain is the director and/or leading man. The navigator and tactician have supporting roles. The foredeck has the stunt men. They do the dirty — and the dangerous — work.",
      "Strategy vs. safety: strategy is top-down. From stratēgos, Greek for ‘general’, it embodies hierarchy. Versus safety, which is fundamental: it’s the base of the Maslowian pyramid. Foredeck folk are looking out for each other. While everyone talks “safety first”, it’s the foredeck that lives it.",
      "I often found roles on bow — perhaps as I’ve stayed thin and nimble as I aged. Also, I found, or at least fancied, that it suited me to be away from the captain. I’ve been an entrepreneur and otherwise self-employed nearly my entire career, so I reckoned I had issues with authority.",
      "Synthesis (“put together, combine”): in Dubai, one under-crewed day, those foredeck skillsets led me to trim the spin too. And I was good. I had to deal with the skipper. I had to communicate closely. Downwind, I’m driving the boat — much like driving a team of oxen or horses — as well as telling the helmsman what to do.",
      "And Dubai has the landmark spinnaker building: the Burj Al Arab, built to resemble the billowing spinnaker sail of a J-class yacht.",
    ],
  },
  {
    id: "zafl",
    glyph: "🧟",
    title: "ZAFL Skills",
    dek: "Zombie Apocalypse Friend List. If the proverbial hits the fan, for what would others want you on their team? It won’t be your follower count.",
    stamp: {
      apparent: "Your résumé says what you are worth.",
      true: "When it actually matters it is fix and food. Nobody's ZAFL wants your follower count.",
    },
    domains: ["Resilience", "Skills"],
    source: "https://bielski.notion.site/ZAFL-Skills-d027a5a8edbd4f099cad5e81b506a545",
    body: [
      "I have come to value what I like to call “ZAFL” (Zombie Apocalypse Friend List) skills. Basically, if the proverbial sh*t hits the fan, for what would others want me on their team?",
      "It ain’t going to be for my cocktail party wit nor for my ability to get to the crux of a messy career transition. For you, it’s not going to be your credentials nor your SEO skills nor your social media follower count nor your status in your industry.",
      "The most fundamental revolve around fix and food, I reckon. Fix: heal people, repair things. Food: grow, fish, hunt and gather, prepare, store (includes hide from competing ZAFLs). Other nice-to-haves include: Communicate — ham radio will be King, I predict, assuming the internet is toast — and language skills. Construct — shelter, protective barriers, floating vessels even if only a raft.",
      "ZAFL is both a heuristic and more broadly a thought experiment. Ask not just what your ZAFL can do for you, but what you could do for your ZAFL. The heuristic has two parts: what do you want of and from them, and what would they want from me?",
      "ZAFL diversity differs greatly from what HR means by diversity. It would have a lot more tradesmen than does my current cohort of friends and acquaintances. While that ratio hasn’t yet changed, I found myself talking more to them and more broadly the practically minded.",
      "This is open to apocalyptic scenarios of all types: war, climate disaster, alien invasion, deadly pathogen, AI-robot alliance. Since I spend considerable time sailing — and that’s when I encounter the most remote landscapes — I conjure a mashup of a Robinson Crusoe / Gilligan’s Island shipwreck during a solar flare storm that knocks out StarLink, navigation equipment, and maybe even ham radio.",
      "DIY or DIE. Most drivers today know how to change a tire in theory, but probably most have never done so alone. Specialization markets break down when sailing long distance. Far from civilization and help, I saw how you need to be able to do these things for yourself. You need to own the tools—and how to use them—before you need them. Plus, there’s the need to improvise and be resourceful.",
      "Knowing what to gather is an underrated skill. The original wisemen of tribal societies knew what plants had nutritional value, which could poison you. We can still see this connection in the similarity of words like taste and wise in various languages: savoir/saber, sabor.",
    ],
  },
];

export const CONTACT = {
  heading: "Partnering? I’d love to talk.",
  services: ["Boat Sitting", "Deliveries", "Coaching", "Teaching"],
  email: "stefan@sail-lore.com",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/sail-lore/" },
    { label: "Twitter", href: "https://twitter.com/stefanbielski" },
  ],
  references: "References (local and relevant): available upon request.",
  conflict:
    "Conflict statement: I receive no commissions, referral fees, nor have any financial interest in any related industry.",
} as const;
