// Blog index: filter posts by title and sort them by date. Posts are rendered on the server
// with data-title (lowercase) and data-date (timestamp); this only reorders and hides them.

type SortOrder = "newest" | "oldest";

let order: SortOrder = "newest";

const elements = () => ({
  search: document.querySelector<HTMLInputElement>("#blog-search"),
  list: document.querySelector<HTMLElement>("#blog-list"),
  empty: document.querySelector<HTMLElement>("#no-results"),
  count: document.querySelector<HTMLElement>("#post-count"),
  sortText: document.querySelector<HTMLElement>("#sort-text"),
  sortIcon: document.querySelector<HTMLElement>("#sort-icon"),
});

const render = () => {
  const { search, list, empty, count } = elements();
  if (!search || !list || !empty || !count) return;

  const term = search.value.toLowerCase().trim();
  const posts = [...list.querySelectorAll<HTMLElement>(".blog-post-item")];
  let visible = 0;
  for (const post of posts) {
    const matches = (post.dataset["title"] ?? "").includes(term);
    post.style.display = matches ? "" : "none";
    if (matches) visible++;
  }

  const date = (post: HTMLElement) => Number(post.dataset["date"] ?? 0);
  posts.sort((a, b) => (order === "newest" ? date(b) - date(a) : date(a) - date(b))).forEach((post) => list.append(post));

  count.textContent = `${visible} post${visible === 1 ? "" : "s"}`;
  empty.classList.toggle("hidden", visible !== 0);
};

document.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement && event.target.id === "blog-search") render();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element) || !event.target.closest("#blog-sort-button")) return;
  order = order === "newest" ? "oldest" : "newest";
  const { sortText, sortIcon } = elements();
  if (sortText) sortText.textContent = order;
  if (sortIcon) sortIcon.style.transform = order === "newest" ? "rotate(0deg)" : "rotate(180deg)";
  render();
});

// Each visit to the blog index starts from the default order.
document.addEventListener("astro:page-load", () => {
  order = "newest";
});
