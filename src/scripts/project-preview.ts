// Homepage projects: a screenshot that trails the cursor while hovering a project row that has
// a cover image. Only on devices with a real pointer and wide screens.

const setup = () => {
  const index = document.querySelector<HTMLElement>("[data-project-index]");
  const preview = document.querySelector<HTMLElement>("[data-project-preview]");
  const img = preview?.querySelector("img");
  if (!index || !preview || !img) return;
  if (!window.matchMedia("(hover: hover) and (min-width: 768px)").matches) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let scale = 0.85;
  let active = false;
  let frame = 0;

  const render = () => {
    const ease = reduceMotion ? 1 : 0.18;
    const dx = targetX - x;
    x += dx * ease;
    y += (targetY - y) * ease;
    scale += ((active ? 1 : 0.85) - scale) * (reduceMotion ? 1 : 0.2);
    const tilt = reduceMotion ? 0 : Math.max(-8, Math.min(8, dx * 0.08));
    preview.style.transform = `translate3d(${x}px, ${y}px, 0) translateY(-50%) rotate(${tilt}deg) scale(${scale})`;
    const settled = Math.abs(dx) < 0.1 && Math.abs(targetY - y) < 0.1 && Math.abs((active ? 1 : 0.85) - scale) < 0.001;
    frame = settled ? 0 : requestAnimationFrame(render);
  };

  const kick = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  index.addEventListener("pointermove", (event) => {
    targetX = event.clientX + 24;
    targetY = event.clientY;
    if (!active && x === 0 && y === 0) {
      x = targetX;
      y = targetY;
    }
    kick();
  });

  index.querySelectorAll<HTMLElement>(".project-row").forEach((row) => {
    row.addEventListener("pointerenter", () => {
      const cover = row.dataset.cover;
      if (!cover) {
        active = false;
        preview.classList.remove("is-on");
        return;
      }
      if (img.getAttribute("src") !== cover) img.setAttribute("src", cover);
      active = true;
      preview.classList.add("is-on");
      kick();
    });
  });

  index.addEventListener("pointerleave", () => {
    active = false;
    preview.classList.remove("is-on");
    kick();
  });
};

// Runs on the first load and after every client-side navigation.
document.addEventListener("astro:page-load", setup);
