// Navbar behavior: the fixed navbar hides while scrolling down and returns on scroll up,
// gains a backdrop once the page scrolls, and runs the mobile menu. Links and the active page
// are rendered on the server; this only toggles data attributes that the markup styles.

const SCROLLED_AFTER = 20;
/** Never hide while the navbar still sits over the top of the page. */
const HIDE_AFTER = 80;
/** Distance to travel in one direction before the navbar reacts, so trackpad jitter is ignored. */
const HIDE_DISTANCE = 12;
const SHOW_DISTANCE = 6;

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
/** Where the current scroll direction began; the thresholds measure from here. */
let anchorY = 0;
let direction: "up" | "down" | null = null;
let frame = 0;

const setHidden = (root: HTMLElement, hidden: boolean) => {
  if (root.hasAttribute("data-hidden") === hidden) return;
  root.toggleAttribute("data-hidden", hidden);
  if (hidden) setMenuOpen(false);
};

/** Clamped so iOS rubber-banding past either edge never reads as a change of direction. */
const currentY = () => {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(Math.max(window.scrollY, 0), max);
};

const update = () => {
  frame = 0;
  const root = navbar();
  if (!root || root.dataset["fixed"] !== "true") return;

  const y = currentY();
  root.toggleAttribute("data-scrolled", y >= SCROLLED_AFTER);

  if (y !== lastY) {
    const next = y > lastY ? "down" : "up";
    if (next !== direction) {
      direction = next;
      anchorY = lastY;
    }
    lastY = y;
  }

  if (y <= HIDE_AFTER) {
    setHidden(root, false);
  } else if (direction === "down" && y - anchorY >= HIDE_DISTANCE) {
    setHidden(root, true);
  } else if (direction === "up" && anchorY - y >= SHOW_DISTANCE && !isTyping()) {
    setHidden(root, false);
  }
};

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

const onPageLoad = () => {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  lastY = anchorY = currentY();
  direction = null;
  setMenuOpen(false);
  navbar()?.removeAttribute("data-hidden");
  update();
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

  document.addEventListener("focusin", (event) => {
    const root = navbar();
    if (root?.dataset["fixed"] !== "true") return;
    // Tabbing into a hidden navbar brings it back, so keyboard users never focus something offscreen.
    if (event.target instanceof Node && root.contains(event.target)) {
      setHidden(root, false);
    } else if (isTyping() && currentY() > HIDE_AFTER) {
      setHidden(root, true);
    }
  });

  // Runs on the first load and after every client-side navigation.
  document.addEventListener("astro:page-load", onPageLoad);
};
