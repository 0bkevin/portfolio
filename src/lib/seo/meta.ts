// Resolves a page's title, description, canonical URL, robots, Open Graph, and X card values.
import { DEFAULT_LOCALE, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, DEFAULT_OG_IMAGE_HEIGHT, DEFAULT_OG_IMAGE_TYPE, DEFAULT_OG_IMAGE_WIDTH, DEFAULT_ROBOTS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, TWITTER_HANDLE } from "./config";
import { getCanonicalUrl, inferImageType, normalizeDate, toAbsoluteUrl } from "./url";

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


/** Resolved meta values for one page, as rendered by SeoHead. */
export type ResolvedSeo = ReturnType<typeof resolveSeo>;
