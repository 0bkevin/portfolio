import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import base from './tailwind.config';

// Builds src/styles/article.css: the typography plugin and the prose-* classes used by the two
// templates that render Markdown. Only class names containing "prose" are picked up, so this
// stylesheet never repeats utilities that global.css already provides.
const proseClasses = (content: string) =>
	(content.match(/[^\s"'`<>={}]+/g) ?? []).filter((candidate) => candidate.includes('prose'));

export default {
	...base,
	content: {
		files: ['./src/layouts/Blog.astro', './src/pages/projects/[[]id[]].astro'],
		extract: { astro: proseClasses },
	},
	corePlugins: { preflight: false },
	plugins: [typography],
} satisfies Config;
