/** Independent products shown in the homepage "Things I've built" list. */
export interface Project {
  name: string;
  url: string;
  summary: string;
  tags: string[];
  /** Screenshot under /public, e.g. "/assets/side/viamu.jpg". Shown as the hover preview and on mobile. */
  cover?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    name: "viamu",
    url: "https://viamu.app",
    summary:
      "A free catalog of scholarships, internships, and fellowships abroad, kept current by an AI pipeline that turns source pages into searchable listings, with a private workspace to prepare each application.",
    tags: ["nuxt", "go", "langgraph"],
  },
  {
    name: "Registro CiberVE",
    url: "https://registrociberve.com",
    summary:
      "A bilingual public registry of cybersecurity incidents tied to Venezuela that turns scattered reports into searchable records, each one traced back to its sources, with profiles of affected organizations and threat actors.",
    tags: ["sveltekit", "postgres", "langgraph"],
  },
  {
    name: "Arena Criolla",
    url: "https://arenacriolla.com",
    summary:
      "An open source multiplayer fighting game starring iconic characters and founders from Venezuelan culture, playable right in the browser with friends on the same screen or online.",
    tags: ["typescript", "multiplayer", "open source"],
  },
  {
    name: "Brio",
    url: "https://github.com/0bkevin/brio",
    summary:
      "A phone app for talking to your Hermes AI agent from anywhere, through a small connector that securely tunnels to the computer where the agent runs.",
    tags: ["expo", "go", "websockets"],
  },
  {
    name: "Cinve",
    url: "https://github.com/0bkevin/cinve",
    summary:
      "An MCP server that lets AI assistants check Venezuelan cinema listings, showtimes, prices, and seat availability, and say so when data is incomplete instead of guessing.",
    tags: ["mcp", "typescript", "oauth"],
  },
];
