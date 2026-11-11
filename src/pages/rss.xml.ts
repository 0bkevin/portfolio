import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { seoConfig } from "@lib/seo";

// Static XML served from the edge cache; the feed only changes when a post does.
export const prerender = true;

const parser = new MarkdownIt();

/** RSS feed for the 0b writing section, with each post's full content. */
export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blogs");

  return rss({
    title: "0b Blog",
    description: "Notes and write-ups by Kevin Bravo on software, smart contracts, and security.",
    site: context.site ?? seoConfig.siteUrl,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/0b/${post.id}`,
      content: sanitizeHtml(parser.render(post.body ?? ""), {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
      }),
    })),
    customData: "<language>en-us</language>",
    stylesheet: "/rss/styles.xsl",
  });
};
