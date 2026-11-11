// Gives every image in Markdown content its intrinsic width and height (read from the file in
// public/ at build time) so the page doesn't shift as images arrive, a srcset when smaller copies
// exist, and lazy loading because they all sit below the article header.
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { srcsetFor } from "./responsive-image";

/** Article and case-study text columns are at most 800px wide, less the side padding on phones. */
const CONTENT_IMAGE_SIZES = "(min-width: 848px) 800px, calc(100vw - 2.5rem)";

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const sizes = new Map<string, Promise<{ width?: number; height?: number }>>();

/** Width and height of an image under public/, or nothing for remote or missing files. */
export function intrinsicSize(src: string) {
  if (!sizes.has(src)) {
    const file = join(process.cwd(), "public", decodeURI(src));
    sizes.set(src, existsSync(file) ? sharp(file).metadata() : Promise.resolve({}));
  }
  return sizes.get(src)!;
}

function collect(node: HastNode, images: HastNode[], raw: HastNode[]) {
  if (node.type === "element" && node.tagName === "img") images.push(node);
  if (node.type === "raw" && node.value?.includes("<img")) raw.push(node);
  node.children?.forEach((child) => collect(child, images, raw));
}

// Images written as HTML inside Markdown (the case studies' figures) arrive as raw strings.
async function addToRawImages(html: string) {
  const tags = html.match(/<img\b[^>]*>/g) ?? [];
  for (const tag of tags) {
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    let attributes = "";
    if (!/\sloading=/.test(tag)) attributes += ' loading="lazy"';
    if (!/\sdecoding=/.test(tag)) attributes += ' decoding="async"';
    if (src?.startsWith("/") && !/\s(width|height)=/.test(tag)) {
      const { width, height } = await intrinsicSize(src);
      if (width && height) attributes += ` width="${width}" height="${height}"`;
      const srcset = srcsetFor(src, width);
      if (srcset && !/\ssrcset=/.test(tag)) attributes += ` srcset="${srcset}" sizes="${CONTENT_IMAGE_SIZES}"`;
    }
    if (attributes) html = html.replace(tag, tag.replace(/^<img\b/, `<img${attributes}`));
  }
  return html;
}

export default function rehypeImageAttributes() {
  return async (tree: HastNode) => {
    const images: HastNode[] = [];
    const raw: HastNode[] = [];
    collect(tree, images, raw);

    await Promise.all(
      raw.map(async (node) => {
        node.value = await addToRawImages(node.value!);
      }),
    );

    await Promise.all(
      images.map(async (image) => {
        const properties = (image.properties ??= {});
        properties.loading ??= "lazy";
        properties.decoding ??= "async";

        const src = properties.src;
        if (typeof src !== "string" || !src.startsWith("/") || properties.width || properties.height) return;
        const { width, height } = await intrinsicSize(src);
        if (width && height) {
          properties.width = width;
          properties.height = height;
        }
        const srcset = srcsetFor(src, width);
        if (srcset && !properties.srcSet) {
          properties.srcSet = srcset;
          properties.sizes = CONTENT_IMAGE_SIZES;
        }
      }),
    );
  };
}
