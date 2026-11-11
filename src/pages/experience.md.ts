import type { APIRoute } from "astro";
import { experienceMarkdown, markdownResponse } from "@lib/agent-markdown";

/** Markdown copy of /experience for AI agents. */
export const prerender = true;

export const GET: APIRoute = () => markdownResponse(experienceMarkdown());
