import { defineMiddleware } from "astro:middleware";

// Canonical URLs have no trailing slash. Static pages already redirect `/page/` to `/page`
// on Cloudflare Pages; this does the same for server-rendered pages, which would otherwise 404.
export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return context.redirect(pathname.replace(/\/+$/, "") + search, 301);
  }
  return next();
});
