// Builds a srcset from the smaller copies that scripts/image-variants.mjs writes next to an image
// in public/ (name-800w.avif, name-1600w.avif). Runs at build time only.
import { existsSync } from "node:fs";
import { join } from "node:path";

const VARIANT_WIDTHS = [800, 1600];

/** srcset listing the image's existing smaller copies plus the original, or undefined if it has none. */
export function srcsetFor(src: string, width: number | undefined): string | undefined {
  if (!src.startsWith("/") || !width) return undefined;
  const variants = VARIANT_WIDTHS.filter((target) => target < width)
    .map((target) => ({ target, url: src.replace(/(\.\w+)$/, `-${target}w$1`) }))
    .filter(({ url }) => existsSync(join(process.cwd(), "public", decodeURI(url))));
  if (variants.length === 0) return undefined;
  return [...variants.map(({ url, target }) => `${encodeURI(decodeURI(url))} ${target}w`), `${encodeURI(decodeURI(src))} ${width}w`].join(", ");
}
