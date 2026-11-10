// Marks <html data-scroll-dir="up|down"> so floating controls (scroll-to-top, the article
// contents button) can tuck away while reading down and return on scroll up, near the top,
// or at the end of the page. Small jitters below the threshold are ignored.

const THRESHOLD = 8;
const NEAR_TOP = 120;
const NEAR_END = 80;

const root = document.documentElement;
let lastY = window.scrollY;
let ticking = false;

const update = () => {
  ticking = false;
  const y = window.scrollY;
  const delta = y - lastY;
  const nearTop = y < NEAR_TOP;
  const atEnd = window.innerHeight + y >= root.scrollHeight - NEAR_END;
  if (nearTop || atEnd || delta < -THRESHOLD) root.dataset["scrollDir"] = "up";
  else if (delta > THRESHOLD) root.dataset["scrollDir"] = "down";
  // Only move the reference point after a real move, so slow scrolls still count.
  if (Math.abs(delta) > THRESHOLD || nearTop) lastY = y;
};

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  },
  { passive: true },
);

document.addEventListener("astro:after-swap", () => {
  root.dataset["scrollDir"] = "up";
  lastY = window.scrollY;
});
