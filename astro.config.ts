import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { readdirSync, readFileSync } from 'node:fs';
import rehypeImageAttributes from './src/lib/rehype-image-attributes';

// Posts whose canonical copy lives elsewhere (e.g. Hashnode) stay out of the sitemap,
// which should only list URLs this site claims as canonical.
const externallyCanonicalPosts = readdirSync('./src/content/blogs')
  .filter((file) => file.endsWith('.md'))
  .filter((file) => {
    const canonical = readFileSync(`./src/content/blogs/${file}`, 'utf8').match(/^canonicalURL:\s*(\S+)/m)?.[1];
    return Boolean(canonical) && !canonical?.includes('kevinbravo.com');
  })
  .map((file) => `/0b/${file.replace(/\.md$/, '')}`);
// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    svelte(),
    sitemap({
      filter: (page) => !externallyCanonicalPosts.some((path) => page.endsWith(path)),
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeImageAttributes],
  },
  output: 'server',
  trailingSlash: 'never',
  // Prerendered pages are emitted as `page.html`, so Cloudflare Pages serves them at the
  // canonical no-slash URL instead of redirecting `/page` to `/page/`.
  build: {
    format: 'file',
    // Inline the CSS into each page: on slow mobile connections the extra round trips for
    // stylesheets cost more than the ~24 KB (gzipped) they add to the HTML.
    inlineStylesheets: 'always',
  },
  adapter: cloudflare(),
  site: 'https://kevinbravo.com',
});
