// schema.org structured data: one Person entity referenced everywhere, plus page-type builders.
import {
  AUTHOR_IMAGE_HEIGHT,
  AUTHOR_IMAGE_WIDTH,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  seoConfig,
} from "./config";
import { normalizeDate, toAbsoluteUrl } from "./url";

export type SchemaValue = Record<string, unknown>;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Points at the WebSite node without repeating it. */
const websiteRef = (): SchemaValue => ({ "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: `${SITE_URL}/` });

/** How every other schema points at Kevin: same @id, name, and url on every page. */
export const personRef = (): SchemaValue => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: seoConfig.author.name,
  url: seoConfig.author.url,
});

/**
 * The one full Person definition, nested as the mainEntity of every profile page. Pages must not
 * override its fields. Google reads each page on its own, so the whole node is embedded rather
 * than relying on the @id alone; other schemas point at it with personRef().
 */
function embeddedPerson(): SchemaValue {
  const { author } = seoConfig;
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: author.name,
    givenName: author.givenName,
    familyName: author.familyName,
    alternateName: author.alternateName,
    url: author.url,
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#person-image`,
      url: author.image,
      contentUrl: author.image,
      width: AUTHOR_IMAGE_WIDTH,
      height: AUTHOR_IMAGE_HEIGHT,
      caption: author.name,
    },
    jobTitle: author.jobTitle,
    description: author.description,
    email: author.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Caracas",
      addressCountry: "VE",
    },
    homeLocation: {
      "@type": "Place",
      name: "Caracas, Venezuela",
      sameAs: "https://www.wikidata.org/wiki/Q1533",
    },
    knowsAbout: [...author.knowsAbout],
    knowsLanguage: [...author.knowsLanguage],
    alumniOf: author.alumniOf.map((org) => ({ ...org })),
    affiliation: author.affiliation.map((org) => ({ ...org })),
    memberOf: author.memberOf.map((role) => ({ ...role })),
    award: [...author.award],
    sameAs: [...author.sameAs],
  };
}

export const createWebsiteSchema = (
  overrides: Partial<SchemaValue> = {},
): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  // Site name in Google results: name plus alternates, in order of preference.
  name: SITE_NAME,
  alternateName: [seoConfig.author.alternateName, "kevinbravo.com"],
  url: `${SITE_URL}/`,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  author: personRef(),
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
  isPartOf: websiteRef(),
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
  mainEntity: embeddedPerson(),
  isPartOf: websiteRef(),
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
  "@id": `${toAbsoluteUrl(url)}#article`,
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
  isPartOf: websiteRef(),
});

export interface ProjectSchemaInput {
  name: string;
  description: string;
  url: string;
  image?: string | null | undefined;
  datePublished?: Date | string | undefined;
  keywords?: string[] | undefined;
  inLanguage?: string | undefined;
}

/** A case study page. Technologies go in keywords: CreativeWork has no stack property. */
export const createProjectSchema = ({
  name,
  description,
  url,
  image,
  datePublished,
  keywords = [],
  inLanguage = "en",
}: ProjectSchemaInput): SchemaValue => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": `${toAbsoluteUrl(url)}#creativework`,
  name,
  headline: name,
  description,
  url: toAbsoluteUrl(url),
  mainEntityOfPage: toAbsoluteUrl(url),
  image: toAbsoluteUrl(image || DEFAULT_OG_IMAGE),
  creator: personRef(),
  author: personRef(),
  dateCreated: normalizeDate(datePublished),
  inLanguage,
  keywords: [...new Set(keywords)],
  isPartOf: websiteRef(),
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
