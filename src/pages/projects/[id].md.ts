import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { entryMarkdown, markdownResponse } from "@lib/agent-markdown";

/** Markdown copy of each case study for AI agents, at /projects/<id>.md. */
export const prerender = true;

export const getStaticPaths = (async () =>
  (await getCollection("projects")).map((entry) => ({ params: { id: entry.id }, props: { entry } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as { entry: CollectionEntry<"projects"> };
  return markdownResponse(entryMarkdown(entry, `/projects/${entry.id}`));
};
