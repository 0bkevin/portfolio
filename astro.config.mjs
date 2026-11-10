// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    svelte(),
    sitemap(),
  ],
  output: 'server',
  trailingSlash: 'never',
  // Prerendered pages are emitted as `page.html`, so Cloudflare Pages serves them at the
  // canonical no-slash URL instead of redirecting `/page` to `/page/`.
  build: { format: 'file' },
  adapter: cloudflare(),
  site: 'https://kevinbravo.com',
});
