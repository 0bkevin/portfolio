import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { entryMarkdown, markdownResponse } from "@lib/agent-markdown";

/** Markdown copy of each /me page for AI agents, at /me/<id>.md. */
export const prerender = true;

export const getStaticPaths = (async () =>
  (await getCollection("me")).map((entry) => ({ params: { id: entry.id }, props: { entry } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as { entry: CollectionEntry<"me"> };
  return markdownResponse(entryMarkdown(entry, `/me/${entry.id}`));
};
