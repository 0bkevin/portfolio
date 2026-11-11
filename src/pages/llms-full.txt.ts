import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { llmsFullMarkdown } from "@lib/agent-markdown";

/** The whole profile, work history, and case studies in one file, linked from /llms.txt. */
export const prerender = true;

const byNewest = (a: { data: { pubDate: Date } }, b: { data: { pubDate: Date } }) =>
  Number(b.data.pubDate) - Number(a.data.pubDate);

export const GET: APIRoute = async () => {
  const [me, projects, blogs] = await Promise.all([
    getCollection("me"),
    getCollection("projects"),
    getCollection("blogs"),
  ]);
  // Bio before the AMA, newest case studies and posts first.
  me.sort((a) => (a.id === "who-is-kevin-bravo" ? -1 : 1));
  projects.sort((a, b) => Number(b.data.pubYear) - Number(a.data.pubYear));
  blogs.sort(byNewest);

  return new Response(llmsFullMarkdown({ me, projects, blogs }), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
