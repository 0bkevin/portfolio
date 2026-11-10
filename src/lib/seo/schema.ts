// schema.org structured data: one Person entity referenced everywhere, plus page-type builders.
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, seoConfig } from "./config";
import { normalizeDate, toAbsoluteUrl } from "./url";

export type SchemaValue = Record<string, unknown>;

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
