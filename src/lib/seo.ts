const SITE_URL = "https://kevinbravo.com";
const SITE_NAME = "Kevin Bravo";
const SITE_TITLE = "Kevin Bravo | Product & AI Engineer";
const SITE_DESCRIPTION =
  "Kevin Bravo is a product and AI engineer in Caracas, Venezuela, building full-stack products, AI agents, and the tooling around them for startups, nonprofits, and public programs.";
const DEFAULT_OG_IMAGE = "/assets/kevin-bravo-og.png";
const DEFAULT_OG_IMAGE_ALT = "Kevin Bravo, Product & AI Engineer";
const DEFAULT_OG_IMAGE_WIDTH = 1200;
const DEFAULT_OG_IMAGE_HEIGHT = 630;
const DEFAULT_OG_IMAGE_TYPE = "image/png";
const AUTHOR_IMAGE = "/assets/photo-1.jpeg";
const DEFAULT_LOCALE = "en_US";
const TWITTER_HANDLE = "@0bkevin";
const DEFAULT_ROBOTS =
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

export type SchemaValue = Record<string, unknown>;

export interface BaseSeoInput {
  title?: string | undefined;
  seoTitle?: string | undefined;
  description?: string | undefined;
  seoDescription?: string | undefined;
  canonical?: string | URL | undefined;
  image?: string | null | undefined;
  imageAlt?: string | undefined;
  imageWidth?: number | undefined;
  imageHeight?: number | undefined;
  imageType?: string | undefined;
  type?: "website" | "article" | "profile" | undefined;
  noindex?: boolean | undefined;
  robots?: string | undefined;
  publishedTime?: Date | string | undefined;
  modifiedTime?: Date | string | undefined;
  section?: string | undefined;
  tags?: string[] | undefined;
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizeDate = (value?: Date | string) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const inferImageType = (value?: string) => {
  const pathname = value?.split(/[?#]/, 1)[0]?.toLowerCase();
  if (pathname?.endsWith(".png")) return "image/png";
  if (pathname?.endsWith(".jpg") || pathname?.endsWith(".jpeg")) return "image/jpeg";
  if (pathname?.endsWith(".webp")) return "image/webp";
  if (pathname?.endsWith(".avif")) return "image/avif";
  if (pathname?.endsWith(".svg")) return "image/svg+xml";
  return undefined;
};

export const toAbsoluteUrl = (value?: string | URL | null) => {
  if (!value) return undefined;
  const normalized = value instanceof URL ? value.toString() : value;
  return isAbsoluteUrl(normalized)
    ? normalized
    : new URL(normalized, SITE_URL).toString();
};

export const getCanonicalUrl = (
  pathname?: string,
  explicitCanonical?: string | URL,
) => {
  if (explicitCanonical) return toAbsoluteUrl(explicitCanonical);
  if (!pathname) return SITE_URL;
  return new URL(pathname, SITE_URL).toString();
};

export const resolveSeo = ({
  title,
  seoTitle,
  description,
  seoDescription,
  canonical,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  imageType,
  type = "website",
  noindex = false,
  robots,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  pathname,
}: BaseSeoInput & { pathname?: string | undefined }) => {
  const absoluteCanonical = getCanonicalUrl(pathname, canonical);

  const usesDefaultImage = !image || image === DEFAULT_OG_IMAGE;
  const absoluteImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  const resolvedTitle = seoTitle || title || SITE_TITLE;
  const resolvedDescription = seoDescription || description || SITE_DESCRIPTION;
  const resolvedImageAlt =
    imageAlt || (usesDefaultImage ? DEFAULT_OG_IMAGE_ALT : resolvedTitle);
  const resolvedImageWidth = imageWidth ?? (usesDefaultImage ? DEFAULT_OG_IMAGE_WIDTH : undefined);
  const resolvedImageHeight = imageHeight ?? (usesDefaultImage ? DEFAULT_OG_IMAGE_HEIGHT : undefined);
  const resolvedImageType =
    imageType ?? inferImageType(absoluteImage) ?? (usesDefaultImage ? DEFAULT_OG_IMAGE_TYPE : undefined);
  const normalizedPublished = normalizeDate(publishedTime);
  const normalizedModified = normalizeDate(modifiedTime);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    canonical: absoluteCanonical,
    image: absoluteImage,
    imageAlt: resolvedImageAlt,
    type,
    robots: robots || (noindex ? "noindex, nofollow" : DEFAULT_ROBOTS),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: absoluteCanonical,
      type,
      image: absoluteImage,
      imageAlt: resolvedImageAlt,
      imageWidth: resolvedImageWidth,
      imageHeight: resolvedImageHeight,
      imageType: resolvedImageType,
      locale: DEFAULT_LOCALE,
      siteName: SITE_NAME,
      publishedTime: normalizedPublished,
      modifiedTime: normalizedModified,
      section,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      image: absoluteImage,
      imageAlt: resolvedImageAlt,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
  };
};

export const PERSON_ID = `${SITE_URL}/#person`;

/** How every other schema points at Kevin: same @id, name, and url on every page. */
export const personRef = (): SchemaValue => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: seoConfig.author.name,
  url: seoConfig.author.url,
});

/** The one full Person definition. Pages must not override its fields. */
export const createPersonSchema = (): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: seoConfig.author.name,
  alternateName: seoConfig.author.alternateName,
  url: seoConfig.author.url,
  image: seoConfig.author.image,
  jobTitle: seoConfig.author.jobTitle,
  description: seoConfig.author.description,
  email: seoConfig.author.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Caracas",
    addressCountry: "VE",
  },
  knowsAbout: [...seoConfig.author.knowsAbout],
  sameAs: [...seoConfig.author.sameAs],
});

export const createWebsiteSchema = (
  overrides: Partial<SchemaValue> = {},
): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: personRef(),
  ...overrides,
});

export interface CollectionPageSchemaInput {
  name: string;
  description: string;
  url: string;
  id?: string | undefined;
  about?: string[] | SchemaValue | SchemaValue[] | undefined;
}

export const createCollectionPageSchema = ({
  name,
  description,
  url,
  id,
  about,
}: CollectionPageSchemaInput): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": id || `${toAbsoluteUrl(url)}#collection`,
  name,
  description,
  url: toAbsoluteUrl(url),
  about,
  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export interface ProfilePageSchemaInput {
  name: string;
  description: string;
  url: string;
  dateCreated?: Date | string | undefined;
  dateModified?: Date | string | undefined;
}

export const createProfilePageSchema = ({
  name,
  description,
  url,
  dateCreated,
  dateModified,
}: ProfilePageSchemaInput): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${toAbsoluteUrl(url)}#profilepage`,
  name,
  description,
  url: toAbsoluteUrl(url),
  dateCreated: normalizeDate(dateCreated),
  dateModified: normalizeDate(dateModified || dateCreated),
  mainEntity: personRef(),
  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
  },
});

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  image?: string | null | undefined;
  datePublished: Date | string;
  dateModified?: Date | string | undefined;
  keywords?: string[] | undefined;
  inLanguage?: string | undefined;
}

export const createArticleSchema = ({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  keywords = [],
  inLanguage = "en",
}: ArticleSchemaInput): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline,
  description,
  mainEntityOfPage: toAbsoluteUrl(url),
  url: toAbsoluteUrl(url),
  image: toAbsoluteUrl(image || DEFAULT_OG_IMAGE),
  datePublished: normalizeDate(datePublished),
  dateModified: normalizeDate(dateModified || datePublished),
  inLanguage,
  keywords,
  author: personRef(),
  publisher: personRef(),
});

export interface ProjectSchemaInput {
  name: string;
  description: string;
  url: string;
  image?: string | null | undefined;
  datePublished?: Date | string | undefined;
  programmingLanguage?: string[] | undefined;
  keywords?: string[] | undefined;
  codeRepository?: string | undefined;
  demoUrl?: string | undefined;
  type?: "CreativeWork" | "SoftwareApplication" | undefined;
}

export const createProjectSchema = ({
  name,
  description,
  url,
  image,
  datePublished,
  programmingLanguage = [],
  keywords = [],
  codeRepository,
  demoUrl,
  type = "CreativeWork",
}: ProjectSchemaInput): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": `${toAbsoluteUrl(url)}#creativework`,
  name,
  description,
  url: toAbsoluteUrl(url),
  image: toAbsoluteUrl(image || DEFAULT_OG_IMAGE),
  creator: personRef(),
  author: personRef(),
  datePublished: normalizeDate(datePublished),
  dateCreated: normalizeDate(datePublished),
  keywords,
  programmingLanguage,
  codeRepository: toAbsoluteUrl(codeRepository),
  workExample: demoUrl ? toAbsoluteUrl(demoUrl) : undefined,
});

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export const createBreadcrumbSchema = (
  items: BreadcrumbItem[],
): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.name,
    item: toAbsoluteUrl(entry.item),
  })),
});

export const stringifySchema = (schema: SchemaValue | SchemaValue[]) =>
  JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");
