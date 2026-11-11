// Plain Markdown copies of the site for AI agents and LLM tools (the `/page.md` convention from
// llms.txt). They are built from the same data and content as the HTML pages, so they never drift.
import type { CollectionEntry } from "astro:content";
import { EXPERIENCE, VOLUNTEERING } from "@data/experience";
import { HONORS } from "@data/honors";
import { CV_URL } from "@data/profile";
import { PROJECTS } from "@data/side-projects";
import { TALKS } from "@data/talks";
import { CONTACT_EMAIL } from "@data/contact";
import { SITE_URL, seoConfig } from "@lib/seo";

type Entry = CollectionEntry<"me"> | CollectionEntry<"projects"> | CollectionEntry<"blogs">;

const isoDay = (value: Date | string) => new Date(value).toISOString().slice(0, 10);

/** Root-relative links and images become absolute, so the file still works once copied elsewhere. */
const absolutizeLinks = (markdown: string) => markdown.replace(/\]\(\//g, `](${SITE_URL}/`);

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Response for a prerendered Markdown file. */
export const markdownResponse = (body: string) =>
  new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });

/** One content entry (an /me page, a case study, or a post) as Markdown with a short header. */
export const entryMarkdown = (entry: Entry, pagePath: string) => {
  const { data } = entry;
  const lines = [`# ${data.title}`, "", `> ${data.description}`, ""];

  const canonical = "canonicalURL" in data && data.canonicalURL ? data.canonicalURL : `${SITE_URL}${pagePath}`;
  lines.push(`- URL: ${SITE_URL}${pagePath}`);
  if (canonical !== `${SITE_URL}${pagePath}`) lines.push(`- Originally published at: ${canonical}`);
  lines.push(`- Author: ${seoConfig.author.name} (${seoConfig.author.url})`);
  if ("pubDate" in data) lines.push(`- Published: ${isoDay(data.pubDate)}`);
  if ("updateDate" in data && data.updateDate) lines.push(`- Updated: ${isoDay(data.updateDate)}`);
  if ("updatedDate" in data && data.updatedDate) lines.push(`- Updated: ${isoDay(data.updatedDate)}`);
  if ("pubYear" in data) lines.push(`- Year: ${data.pubYear.getFullYear()}`);
  if ("technologies" in data && data.technologies?.length) lines.push(`- Stack: ${data.technologies.join(", ")}`);
  if ("tags" in data && data.tags.length) lines.push(`- Tags: ${data.tags.join(", ")}`);

  return [...lines, "", absolutizeLinks(entry.body ?? "").trim(), ""].join("\n");
};

/** The full work history, as shown on /experience. */
export const experienceMarkdown = () => {
  const lines = [
    `# Experience: ${seoConfig.author.name}, ${seoConfig.author.jobTitle}`,
    "",
    `> ${seoConfig.author.description}`,
    "",
    `- URL: ${SITE_URL}/experience`,
    `- CV: ${CV_URL}`,
    "",
    "## Work history",
    "",
  ];

  for (const job of EXPERIENCE) {
    lines.push(`### ${capitalize(job.role)}, ${job.company}`, "");
    lines.push(`- Period: ${job.period}`, `- Setting: ${job.setting}`);
    if (job.url) lines.push(`- Website: ${job.url}`);
    lines.push(`- Stack: ${job.stack.join(", ")}`, "");
    lines.push(...job.bullets.map((bullet) => `- ${bullet}`), "");
  }

  lines.push("## Leadership and volunteering", "");
  for (const item of VOLUNTEERING) {
    lines.push(`- **${capitalize(item.role)}**, ${item.org} (${item.period}): ${item.summary}`);
  }

  return `${lines.join("\n")}\n`;
};

/** Everything an agent needs about Kevin in one file: profile, work history, projects, and pages. */
export const llmsFullMarkdown = (sections: { me: Entry[]; projects: Entry[]; blogs: Entry[] }) => {
  const { author } = seoConfig;
  const lines = [
    `# ${author.name}`,
    "",
    `> ${author.description}`,
    "",
    "This file is the complete text version of kevinbravo.com for AI agents and LLM tools. The",
    "short index lives at /llms.txt; every page listed here also has an HTML version without `.md`.",
    "",
    "## Profile",
    "",
    `- Name: ${author.name} (also known online as ${author.alternateName})`,
    `- Title: ${author.jobTitle}`,
    "- Location: Caracas, Venezuela",
    `- Website (entity home): ${author.url}`,
    `- Email: ${CONTACT_EMAIL}`,
    `- Contact form: ${SITE_URL}/contact`,
    `- CV: ${CV_URL}`,
    `- Profiles: ${author.sameAs.join(", ")}`,
    `- Topics: ${author.knowsAbout.join(", ")}`,
    "",
    "## Honors",
    "",
    ...HONORS.map((honor) => `- ${honor.title}, ${honor.issuer} (${honor.date}): ${honor.summary}`),
    "",
    "## Independent projects",
    "",
    ...PROJECTS.map((project) => `- [${project.name}](${project.url}): ${project.summary}`),
    "",
    "## Talks",
    "",
    ...TALKS.map(
      (talk) =>
        `- [${talk.title}](https://www.youtube.com/watch?v=${talk.youtubeId}), ${talk.host}, in ${talk.language}: ${talk.summary}`,
    ),
    "",
  ];

  // Demote each document's headings one level so they nest under this file's sections.
  const demote = (markdown: string) => markdown.replace(/^(#{1,5}) /gm, "#$1 ");

  lines.push(demote(experienceMarkdown()));
  for (const entry of sections.me) lines.push(demote(entryMarkdown(entry, `/me/${entry.id}`)));

  lines.push("## Case studies", "");
  for (const entry of sections.projects) lines.push(demote(demote(entryMarkdown(entry, `/projects/${entry.id}`))));

  lines.push("## Writing", "");
  for (const entry of sections.blogs) {
    lines.push(`- [${entry.data.title}](${SITE_URL}/0b/${entry.id}.md): ${entry.data.description}`);
  }

  return `${lines.join("\n")}\n`;
};
