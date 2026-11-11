// Site-wide SEO constants and the author identity used across meta tags and structured data.

export const SITE_URL = "https://kevinbravo.com";
export const SITE_NAME = "Kevin Bravo";
export const SITE_TITLE = "Kevin Bravo | Product & AI Engineer";
export const SITE_DESCRIPTION =
  "Kevin Bravo is a product and AI engineer in Caracas, Venezuela, building full-stack products, AI agents, and the tooling around them for startups, nonprofits, and public programs.";
export const DEFAULT_OG_IMAGE = "/assets/kevin-bravo-og.png";
export const DEFAULT_OG_IMAGE_ALT = "Kevin Bravo, Product & AI Engineer";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_TYPE = "image/png";
export const AUTHOR_IMAGE = "/assets/photo-1.jpeg";
export const AUTHOR_IMAGE_WIDTH = 907;
export const AUTHOR_IMAGE_HEIGHT = 1080;
export const DEFAULT_LOCALE = "en_US";
export const TWITTER_HANDLE = "@0bkevin";
export const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export const seoConfig = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  siteTitle: SITE_TITLE,
  siteDescription: SITE_DESCRIPTION,
  defaultOgImage: DEFAULT_OG_IMAGE,
  defaultOgImageAlt: DEFAULT_OG_IMAGE_ALT,
  defaultOgImageWidth: DEFAULT_OG_IMAGE_WIDTH,
  defaultOgImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
  defaultOgImageType: DEFAULT_OG_IMAGE_TYPE,
  defaultLocale: DEFAULT_LOCALE,
  twitterHandle: TWITTER_HANDLE,
  author: {
    name: "Kevin Bravo",
    givenName: "Kevin",
    familyName: "Bravo",
    alternateName: "0bkevin",
    // The homepage is the entity home: every page points back to it.
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${AUTHOR_IMAGE}`,
    jobTitle: "Product & AI Engineer",
    description:
      "Product and AI engineer with 5+ years building full-stack products, AI agents, and the tooling around them for startups, nonprofits, and government-commissioned programs.",
    email: "mailto:0bravokevin@gmail.com",
    // Profiles Kevin controls that link back here, so search engines and LLMs can tie them to
    // one entity. Add a profile only once it points back to kevinbravo.com.
    sameAs: [
      "https://x.com/0bkevin",
      "https://www.linkedin.com/in/0bkevin/",
      "https://github.com/0bkevin",
      "https://t.me/Obkevin",
      "https://kevdevto.hashnode.dev",
    ],
    // Topics the site itself shows evidence for (experience, case studies, projects).
    knowsAbout: [
      "Product engineering",
      "AI engineering",
      "AI agents",
      "Model Context Protocol (MCP)",
      "Retrieval-augmented generation (RAG)",
      "LLM evaluation",
      "LangGraph",
      "Full-stack development",
      "Backend engineering",
      "Cloud infrastructure",
      "SvelteKit",
      "TypeScript",
      "Python",
      "PostgreSQL",
    ],
    knowsLanguage: ["es", "en"],
    // Organizations are linked to Wikidata so they resolve to known entities, not just strings.
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Central de Venezuela",
        sameAs: "https://www.wikidata.org/wiki/Q936476",
      },
    ],
    // Current Master of Public Administration student.
    affiliation: [
      {
        "@type": "CollegeOrUniversity",
        name: "Instituto de Estudios Superiores de Administración (IESA)",
        sameAs: "https://www.wikidata.org/wiki/Q2885018",
      },
    ],
    memberOf: [
      {
        "@type": "OrganizationRole",
        roleName: "Vice President",
        startDate: "2026-03",
        memberOf: { "@type": "Organization", name: "JA Venezuela Alumni" },
      },
      {
        "@type": "OrganizationRole",
        roleName: "Education Committee Member",
        startDate: "2024-09",
        memberOf: { "@type": "Organization", name: "AVAA", url: "https://avaa.org/" },
      },
    ],
    // Keep in sync with src/data/honors.ts.
    award: [
      "2nd Place, AI Security Track, Platanus Hack Caracas (2026)",
      "3rd Place, EmprendeTECH Hackathon, IESA (2025)",
    ],
  },
} as const;
