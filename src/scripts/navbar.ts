// Navbar behavior: the fixed navbar hides while scrolling down and returns on scroll up,
// gains a backdrop once the page scrolls, and runs the mobile menu. Links and the active page
// are rendered on the server; this only toggles data attributes that the markup styles.

const SCROLLED_AFTER = 20;
const HIDE_AFTER = 60;

const navbar = () => document.querySelector<HTMLElement>("[data-navbar]");
const backdrop = () => document.querySelector<HTMLElement>("[data-nav-backdrop]");

/** The browser scrolls a focused field into view; revealing the navbar then would cover it. */
const isTyping = () => {
  const el = document.activeElement;
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
};

const setMenuOpen = (open: boolean) => {
  const root = navbar();
  if (!root) return;
  root.toggleAttribute("data-menu-open", open);
  backdrop()?.toggleAttribute("data-open", open);
  const toggle = root.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  toggle?.setAttribute("aria-expanded", String(open));
  toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

let lastY = 0;

const onScroll = () => {
  const root = navbar();
  if (!root || root.dataset["fixed"] !== "true") return;
  const y = window.scrollY;
  root.toggleAttribute("data-scrolled", y >= SCROLLED_AFTER);
  if (y > lastY && y > HIDE_AFTER) {
    root.setAttribute("data-hidden", "");
    setMenuOpen(false);
  } else if (y < lastY && !isTyping()) {
    root.removeAttribute("data-hidden");
  }
  lastY = y;
};

const onPageLoad = () => {
  lastY = window.scrollY;
  setMenuOpen(false);
  navbar()?.removeAttribute("data-hidden");
  onScroll();
};

let bound = false;

export const initNavbar = () => {
  if (bound) return;
  bound = true;

  window.addEventListener("scroll", onScroll, { passive: true });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("[data-menu-toggle]")) {
      setMenuOpen(!navbar()?.hasAttribute("data-menu-open"));
    } else if (event.target.closest("[data-menu-close]")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.addEventListener("focusin", () => {
    const root = navbar();
    if (root?.dataset["fixed"] === "true" && isTyping() && window.scrollY > HIDE_AFTER) {
      root.setAttribute("data-hidden", "");
    }
  });

  // Runs on the first load and after every client-side navigation.
  document.addEventListener("astro:page-load", onPageLoad);
};
