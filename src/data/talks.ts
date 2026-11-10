/** Talks and conversations shown on the homepage; add new ones at the top. */
export interface Talk {
  /** YouTube video ID, the `v=` part of the URL. */
  youtubeId: string;
  title: string;
  /** Event, show, or channel that hosted it. */
  host: string;
  /** Language the talk is given in. */
  language: string;
  summary: string;
}

// Add new talks at the top.
export const TALKS: Talk[] = [
  {
    youtubeId: "0JlqBCB3LRM",
    title: "Crea y recauda fondos con Free2z",
    host: "Zcash en Español · Zcash anniversary month",
    language: "spanish",
    summary:
      "An introduction to the new Free2Z and a quick guide to navigating it, from publishing your work to raising funds directly from your community.",
  },
];
