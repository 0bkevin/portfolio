# kevinbravo.com

Kevin Bravo's portfolio: experience, case studies, writing, and contact. Built with Astro (server output on Cloudflare Pages), Tailwind CSS, and TypeScript, with one Svelte island for the contact form.

## Commands

| Command         | What it does                                                    |
| --------------- | --------------------------------------------------------------- |
| `npm run dev`   | Local dev server at http://localhost:4321                       |
| `npm run check` | Type checks Astro, TypeScript, and Svelte (`astro check` + `svelte-check`) |
| `npm run build` | Runs the checks, then builds for Cloudflare Pages into `dist/`  |

Node 22 (see `.nvmrc`).

## Structure

```
src/
  pages/            Routes. Case studies (projects/), posts (0b/), profile pages (me/),
                    plus /experience, /contact, the 404, the RSS feed, and the contact endpoint.
  layouts/          Layout (every page) and Blog (articles, case studies, profile pages).
  components/
    layout/         Navbar, ThemeToggle, Footer, SeoHead, PageHeader, SectionHeading, ScrollUp.
    home/           The homepage sections, in page order from Hero to ContactSection.
    contact/        The contact form (Svelte), its fields, validation, and the shared panel.
    article/        The article table of contents.
    ui/             Icon (Astro and Svelte versions).
  content/          Markdown for posts, case studies, and profile pages (schemas in content.config.ts).
  data/             Typed site content: experience, projects, talks, prizes, navigation, profile, contact.
  lib/              seo/ (meta tags and structured data), icons, email sending, date helpers.
  scripts/          Small typed browser modules (navbar, contents, filters, zoom, scroll behavior).
  styles/           global.css imports base, components, and prose layers.
  middleware.ts     Redirects trailing-slash URLs to their canonical form.
public/             Static files: icons, images, robots.txt, llms.txt, manifest.
```

Content lives in `src/data` and `src/content`; components only render it. Pages are rendered on the server, and browser JavaScript is limited to the modules in `src/scripts` plus the contact form.

## Environment

Set in Cloudflare Pages for both Production and Preview:

| Variable                    | Type      | Used for                                |
| --------------------------- | --------- | --------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plaintext | Turnstile widget on the contact form (read at build time) |
| `TURNSTILE_SECRET_KEY`      | Secret    | Verifying Turnstile tokens               |
| `RESEND_API_KEY`            | Secret    | Sending contact messages                 |
| `MY_EMAIL_ADDRESS`          | Plaintext | Where contact messages are delivered     |

Local development uses Cloudflare's always-pass Turnstile test keys automatically.
