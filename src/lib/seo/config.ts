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
    alternateName: "0bkevin",
    // The homepage is the entity home: every page points back to it.
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${AUTHOR_IMAGE}`,
    jobTitle: "Product & AI Engineer",
    description:
      "Product and AI engineer with 5+ years building full-stack products, AI agents, and the tooling around them for startups, nonprofits, and government-commissioned programs.",
    email: "mailto:0bravokevin@gmail.com",
    sameAs: [
      "https://x.com/0bkevin",
      "https://www.linkedin.com/in/0bkevin/",
      "https://github.com/0bkevin",
    ],
    knowsAbout: [
      "Product engineering",
      "AI agents",
      "Model Context Protocol (MCP)",
      "Retrieval-augmented generation (RAG)",
      "Full-stack development",
      "Backend engineering",
    ],
  },
} as const;
