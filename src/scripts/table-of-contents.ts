// Article table of contents: highlights the section being read and opens or closes the
// mobile panel. The lists themselves are rendered on the server.

const mobilePanel = () => document.querySelector<HTMLElement>("[data-toc-mobile]");

const setMobileOpen = (open: boolean) => {
  mobilePanel()?.classList.toggle("hidden", !open);
  document.querySelector("[data-toc-open]")?.setAttribute("aria-expanded", String(open));
};

const highlight = (id: string) => {
  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")) {
    link.setAttribute("aria-current", String(link.dataset["tocLink"] === id));
  }
};

let observer: IntersectionObserver | undefined;

const onPageLoad = () => {
  observer?.disconnect();
  setMobileOpen(false);
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]");
  if (!links.length) return;

  const ids = new Set([...links].map((link) => link.dataset["tocLink"]));
  const headings = [...document.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]")].filter((h) => ids.has(h.id));
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) highlight(visible[0].target.id);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.2, 0.4, 0.6, 0.8] },
  );
  headings.forEach((heading) => observer?.observe(heading));
};

let bound = false;

export const initTableOfContents = () => {
  if (bound) return;
  bound = true;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("[data-toc-open]")) setMobileOpen(true);
    // Closing buttons, or picking an entry, close the mobile panel.
    else if (event.target.closest("[data-toc-close], [data-toc-mobile] [data-toc-link]")) setMobileOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileOpen(false);
  });

  document.addEventListener("astro:page-load", onPageLoad);
};
