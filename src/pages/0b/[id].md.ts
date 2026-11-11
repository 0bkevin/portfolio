import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { entryMarkdown, markdownResponse } from "@lib/agent-markdown";

/** Markdown copy of each post for AI agents, at /0b/<id>.md. */
export const prerender = true;

export const getStaticPaths = (async () =>
  (await getCollection("blogs")).map((entry) => ({ params: { id: entry.id }, props: { entry } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as { entry: CollectionEntry<"blogs"> };
  return markdownResponse(entryMarkdown(entry, `/0b/${entry.id}`));
};
