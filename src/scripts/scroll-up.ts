// Scroll-to-top button: shown once the page is scrolled past SHOW_AFTER pixels.

const SHOW_AFTER = 560;

const update = () => {
  document.querySelector(".scrollup")?.classList.toggle("show-scroll", window.scrollY >= SHOW_AFTER);
};

document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest(".scrollup")) window.scrollTo(0, 0);
});
window.addEventListener("scroll", update, { passive: true });
document.addEventListener("astro:page-load", update);
