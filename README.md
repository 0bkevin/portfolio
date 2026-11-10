<div align="center">

# hey, i'm kevin 👋

**product & AI engineer · caracas, venezuela 🇻🇪 · online as `0bkevin`**

[website](https://kevinbravo.com) · [who is kevin bravo?](https://kevinbravo.com/me/who-is-kevin-bravo) · [ask me anything](https://kevinbravo.com/me/ama) · [x](https://x.com/0bkevin) · [linkedin](https://www.linkedin.com/in/0bkevin/) · [github](https://github.com/0bkevin)

</div>

---

## so, who is kevin bravo?

i build products from zero to production: the messy first conversation with users, the data model, the backend, the infra, and the support after launch. give me an unclear problem and full agency and i'm having a good day.

these days i'm deep into **AI tooling and agentic systems**: MCP servers that let agents work inside real products, LangGraph pipelines that turn messy sources into clean data, and little tools to reach my own agents from anywhere. i care a lot about them being actually useful *and* safe to run.

fun twist: before software i studied **occupational therapy** (graduated cum laude from UCV). it still shapes how i think about people and the systems they use.

## what i've been up to

- 🛠️ **free2z** · senior product engineer (2025–2026). moved a live creator platform from React to SvelteKit without dropping a feature, and built an MCP server so AI agents can publish for creators with scoped, expiring access.
- 🏛️ **billingua talent** · built it for the U.S. Department of State's Venezuela Affairs Unit (via AVAA), a bilingual platform connecting Venezuelan professionals with employers. [case study →](https://kevinbravo.com/projects/billingua-talent)
- 🎓 **avaa** · built [SEP](https://kevinbravo.com/projects/sep) (~400 monthly users across three states) and [SEA](https://kevinbravo.com/projects/sea) for EducationUSA advisors.
- 📚 doing a **master of public administration at IESA**, because tech and institutions should talk more.

full story on [kevinbravo.com/experience](https://kevinbravo.com/experience).

## things i built for fun (and for real)

| project | what it is |
| --- | --- |
| [viamu](https://viamu.app) | free catalog of scholarships, internships, and fellowships abroad, kept fresh by an AI pipeline |
| [Registro CiberVE](https://registrociberve.com) | bilingual public registry of cybersecurity incidents tied to Venezuela |
| [Arena Criolla](https://arenacriolla.com) | open source browser fighting game starring icons of Venezuelan culture |
| [Brio](https://github.com/0bkevin/brio) | phone app to talk to your Hermes AI agent from anywhere |
| [Cinve](https://github.com/0bkevin/cinve) | MCP server for Venezuelan cinema listings, showtimes, and seats |

## a few wins

- 🥈 2nd place, AI Security track at **Platanus Hack Caracas** (2026) with Gotchu
- 🥉 3rd place at IESA's first **EmprendeTECH Hackathon** (2025) with Planify

## outside the editor

vice president of **JA Venezuela Alumni**, organized the Caracas hub for the **Dev3pack Global Hackathon**, and code mentor for **Technovation Girls Venezuela**. i also write a bit at [kevinbravo.com/0b](https://kevinbravo.com/0b) and give the occasional talk.

**toolbox:** sveltekit · typescript · python · go · postgres · mcp · langgraph · kubernetes, with Claude, Codex, Cursor, and friends helping me move faster without outsourcing the thinking.

## say hi

[telegram](https://t.me/Obkevin) · discord `0bkevin` · [x](https://x.com/0bkevin) · [email](mailto:0bravokevin@gmail.com) · or the [contact form](https://kevinbravo.com/contact)

---

## about this repo

this is the source of [kevinbravo.com](https://kevinbravo.com): experience, case studies, writing, and contact. Built with Astro (server output on Cloudflare Pages), Tailwind CSS, and TypeScript, with one Svelte island for the contact form.

### Commands

| Command         | What it does                                                    |
| --------------- | --------------------------------------------------------------- |
| `npm run dev`   | Local dev server at http://localhost:4321                       |
| `npm run check` | Type checks Astro, TypeScript, and Svelte (`astro check` + `svelte-check`) |
| `npm run build` | Runs the checks, then builds for Cloudflare Pages into `dist/`  |

Node 22 (see `.nvmrc`).

### Structure

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

### Environment

Set in Cloudflare Pages for both Production and Preview:

| Variable                    | Type      | Used for                                |
| --------------------------- | --------- | --------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plaintext | Turnstile widget on the contact form (read at build time) |
| `TURNSTILE_SECRET_KEY`      | Secret    | Verifying Turnstile tokens               |
| `RESEND_API_KEY`            | Secret    | Sending contact messages                 |
| `MY_EMAIL_ADDRESS`          | Plaintext | Where contact messages are delivered     |

Local development uses Cloudflare's always-pass Turnstile test keys automatically.
