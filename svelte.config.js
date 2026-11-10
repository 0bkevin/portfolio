// @ts-check
// Svelte tooling loads this file directly, so it stays JavaScript, type checked through JSDoc.
import { vitePreprocess } from "@astrojs/svelte";

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  preprocess: vitePreprocess(),
};
