// URL, date, and image-type helpers shared by meta tags and structured data.
import { SITE_URL } from "./config";

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

export const normalizeDate = (value?: Date | string) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const inferImageType = (value?: string) => {
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
