import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { existsSync } from 'node:fs';
import { intrinsicSize } from './lib/rehype-image-attributes';

const imageSchema = z.object({
  url: z.string(),
  alt: z.string()
});

// Article covers carry their intrinsic size so the page reserves their space before they load,
// and a srcset when a smaller "-800w" copy sits next to the file (phones download that one).
const coverImageSchema = imageSchema.transform(async (image) => {
  const local = image.url.startsWith('/');
  const { width, height }: { width?: number; height?: number } = local ? await intrinsicSize(image.url) : {};
  const small = image.url.replace(/(\.\w+)$/, '-800w$1');
  const srcset =
    local && width && width > 800 && existsSync(`./public${small}`) ? `${small} 800w, ${image.url} ${width}w` : undefined;
  return { ...image, width, height, srcset };
});

const seoFields = {
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalURL: z.string().url().optional(),
  noindex: z.boolean().optional(),
  robots: z.string().optional(),
  ogImage: imageSchema.optional(),
};

const blogCollection = defineCollection({
  loader: glob({ pattern: "**\/*.md", base: "./src/content/blogs" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    image: coverImageSchema.optional(),
    tags: z.array(z.string()),
    language: z.enum(['en', 'es']),
    footnote: z.string().optional(),
    // Transform a date string (e.g. "2022-07-08") to a Date object
    updatedDate: z.string().transform((str) => new Date(str)).optional(),
    isCanonicalCopy: z.boolean().optional(),
    ...seoFields,

  }),
});


const projectCollection = defineCollection({
  loader: glob({ pattern: "**\/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    pubYear: z.coerce.date(),
    description: z.string(),
    image: imageSchema,
    tags: z.array(z.string()),
    technologies: z.array(z.string()).optional(),
    clientName: z.string().optional(),
    role: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(["live", "archived", "case-study", "private"]).optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    studyCaseUrl: z.string().optional(),
    language: z.enum(['en', 'es']),
    footnote: z.string().optional(),
    ...seoFields,
  }),
});

const meCollection = defineCollection({
  loader: glob({ pattern: "**\/*.md", base: "./src/content/me" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    description: z.string(),
    image: imageSchema.optional(),
    profilePageType: z.enum(["ama", "bio", "resume"]).optional(),
    ...seoFields,
  }),
});

export const collections = {
  'blogs': blogCollection,
  'projects': projectCollection,
  'me': meCollection
};
