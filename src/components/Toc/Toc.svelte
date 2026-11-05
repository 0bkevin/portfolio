<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import TocItem from "./TocItem.svelte";

  export let items = [];

  function normalizeHeadings(source) {
    return source
      .map((heading) => ({
        id: heading.id || heading.slug || "",
        text: heading.text || "",
        level: heading.level || heading.depth || 0,
      }))
      .filter(
        (heading) =>
          heading.id &&
          heading.text &&
          heading.level >= 2 &&
          heading.level <= 4
      );
  }

  let headings = writable(normalizeHeadings(items));
  let activeId = writable("");
  let mobileOpen = false;

  function closeMobileToc() {
    mobileOpen = false;
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeMobileToc();
    }
  }

  onMount(() => {
    const providedHeadings = normalizeHeadings(items);
    const elements = providedHeadings.length
      ? providedHeadings
          .map((heading) => document.getElementById(heading.id))
          .filter(Boolean)
      : Array.from(
          document.querySelectorAll(
            "article .prose h2, article .prose h3, article .prose h4"
          )
        );

    const headingData = providedHeadings.length
      ? providedHeadings
      : elements.map((heading) => ({
          id:
            heading.id ||
            heading.textContent?.toLowerCase().replace(/\s+/g, "-") ||
            "",
          text: heading.textContent || "",
          level: parseInt(heading.tagName[1]),
        }));

    headings.set(headingData);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleHeadings[0]) {
          activeId.set(visibleHeadings[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.2, 0.4, 0.6, 0.8],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="toc-rail fixed left-6 top-24 z-40 hidden xl:block">
  <nav
    class="toc-panel relative h-[calc(100vh-7rem)] max-h-[520px] w-12 overflow-hidden rounded-r-lg border-l border-surface-200/80 bg-[#fafafa]/70 py-3 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:w-[300px] hover:border-surface-200 hover:bg-[#fafafa]/95 hover:px-4 hover:shadow-lg focus-within:w-[300px] focus-within:border-surface-200 focus-within:bg-[#fafafa]/95 focus-within:px-4 focus-within:shadow-lg dark:border-surface-800/80 dark:bg-[#0a0a0a]/55 dark:hover:border-surface-800 dark:hover:bg-[#0a0a0a]/88 dark:focus-within:border-surface-800 dark:focus-within:bg-[#0a0a0a]/88"
    aria-label="Table of contents"
  >
    <div class="toc-tab flex h-full min-h-32 w-12 flex-col items-center justify-start gap-3 text-surface-400 transition-opacity duration-200 dark:text-surface-600">
      <span class="mt-1 h-9 w-px rounded-full bg-surface-300 dark:bg-surface-700"></span>
      <span class="writing-vertical font-mono text-[10px] lowercase tracking-wider">contents</span>
    </div>

    <div class="toc-content absolute inset-y-0 left-0 w-[300px] opacity-0 transition-opacity duration-200">
      <div class="h-full overflow-y-auto p-4 pb-7 pl-5">
        <p class="mb-3 font-mono text-[12px] lowercase text-surface-500"><span class="text-accent-500 dark:text-accent-400">//</span> contents</p>
        <ul class="w-full space-y-1">
        {#each $headings as heading}
          <TocItem item={heading} active={$activeId === heading.id} />
        {/each}
        </ul>
      </div>
      <div class="toc-bottom-shadow pointer-events-none absolute inset-x-0 bottom-0 h-12"></div>
    </div>
  </nav>
</div>

<button
  type="button"
  class="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-md border border-surface-200/80 bg-[#fafafa]/90 px-3 py-2 font-mono text-[12px] lowercase text-surface-500 shadow-sm backdrop-blur transition-colors hover:border-surface-300 hover:text-surface-900 focus:outline-none focus:ring-1 focus:ring-surface-300 dark:border-surface-800/80 dark:bg-[#0a0a0a]/85 dark:text-surface-400 dark:hover:border-surface-700 dark:hover:text-surface-100 dark:focus:ring-surface-700 xl:hidden"
  aria-label="Open table of contents"
  aria-expanded={mobileOpen}
  aria-controls="mobile-toc"
  on:click={() => (mobileOpen = true)}
>
  <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-accent-500 dark:bg-accent-400"></span>
  contents
</button>

{#if mobileOpen}
  <div class="fixed inset-0 z-50 xl:hidden" role="presentation">
    <button
      type="button"
      class="absolute inset-0 h-full w-full bg-surface-950/20 backdrop-blur-[1px] dark:bg-[#0a0a0a]/55"
      aria-label="Close table of contents"
      on:click={closeMobileToc}
    ></button>

    <nav
      id="mobile-toc"
      class="absolute inset-x-4 bottom-4 mx-auto max-h-[70vh] max-w-xl overflow-hidden rounded-md border border-surface-200/80 bg-[#fafafa] shadow-xl dark:border-surface-800/80 dark:bg-[#0a0a0a]"
      aria-label="Table of contents"
    >
      <div class="max-h-[70vh] overflow-y-auto p-4 pb-7">
        <div class="mb-3 flex items-center justify-between gap-4">
          <p class="font-mono text-[12px] lowercase text-surface-500"><span class="text-accent-500 dark:text-accent-400">//</span> contents</p>
          <button
            type="button"
            class="font-mono text-[12px] lowercase text-surface-400 transition-colors hover:text-surface-900 dark:text-surface-500 dark:hover:text-surface-200"
            on:click={closeMobileToc}
          >
            close
          </button>
        </div>

        <ul class="w-full space-y-1" on:click={closeMobileToc}>
          {#each $headings as heading}
            <TocItem item={heading} active={$activeId === heading.id} />
          {/each}
        </ul>
      </div>
      <div class="toc-bottom-shadow pointer-events-none absolute inset-x-0 bottom-0 h-12"></div>
    </nav>
  </div>
{/if}

<style>
  .writing-vertical {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  .toc-panel:hover .toc-tab,
  .toc-panel:focus-within .toc-tab {
    opacity: 0;
    pointer-events: none;
  }

  .toc-panel:hover .toc-content,
  .toc-panel:focus-within .toc-content {
    opacity: 1;
  }

  .toc-bottom-shadow {
    background: linear-gradient(to bottom, transparent, rgba(250, 250, 250, 0.98));
    box-shadow: inset 0 -14px 22px rgba(250, 250, 250, 0.82);
  }

  :global(.dark) .toc-bottom-shadow {
    background: linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.98));
    box-shadow: inset 0 -14px 22px rgba(10, 10, 10, 0.86);
  }
</style>
