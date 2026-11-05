<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import NAV_ITEMS from "./NavbarData.ts";
  import ToggleDark from "../ToggleDark.svelte";

  export let shouldFixed = true;

  let activeNav = "";
  let isMobileMenuOpen = false;

  const setActive = (link) => { activeNav = link; };
  const toggleMobileMenu = () => { isMobileMenuOpen = !isMobileMenuOpen; };
  const closeMobileMenu = () => { isMobileMenuOpen = false; };

  onMount(() => {
    const updateActiveNav = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith("/0b")) {
        activeNav = "/0b";
      } else if (path.startsWith("/me/ama")) {
        activeNav = "/me/ama";
      } else if (path.startsWith("/projects")) {
        activeNav = "/#projects";
      } else if (path === "/" || path === "") {
        if (hash === "#contact") activeNav = "/#contact";
        else if (hash === "#about") activeNav = "/#about";
        else if (hash === "#projects") activeNav = "/#projects";
        else if (hash === "#experience") activeNav = "/#experience";
        else if (hash === "#blog") activeNav = "/0b";
        else if (hash === "#home" || hash === "") activeNav = "/#home";
      }
    };

    updateActiveNav();
    window.addEventListener("hashchange", updateActiveNav);

    const handleKey = (e) => {
      if (e.key === "Escape") isMobileMenuOpen = false;
    };
    window.addEventListener("keydown", handleKey);

    // Setup intersection observer for homepage sections
    let observer;
    if (window.location.pathname === "/" || window.location.pathname === "") {
      const sections = document.querySelectorAll("section[id]");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              if (id === "contact") activeNav = "/#contact";
              else if (id === "about") activeNav = "/#about";
              else if (id === "projects") activeNav = "/#projects";
              else if (id === "experience") activeNav = "/#experience";
              else if (id === "blog") activeNav = "/0b";
              else if (id === "home") activeNav = "/#home";
            }
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );

      sections.forEach((section) => observer.observe(section));
    }

    return () => {
      window.removeEventListener("hashchange", updateActiveNav);
      window.removeEventListener("keydown", handleKey);
      if (observer) observer.disconnect();
    };
  });

  let y = 0;
  let lastY = 0;
  let isHidden = false;
  let isAtTop = true;

  // While someone types in a form field, the browser scrolls the field into view.
  // Revealing the navbar then would cover the field, so it stays tucked away.
  const isTyping = () => {
    const el = typeof document !== "undefined" ? document.activeElement : null;
    return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
  };

  const handleFocusIn = () => {
    if (shouldFixed && isTyping() && y > 60) isHidden = true;
  };

  $: {
    isAtTop = y < 20;
    if (shouldFixed) {
      if (y > lastY && y > 60) {
        isHidden = true;
        isMobileMenuOpen = false; // Close mobile menu on scroll down
      } else if (y < lastY && !isTyping()) {
        isHidden = false;
      }
    }
    lastY = y;
  }
</script>

<svelte:window bind:scrollY={y} on:focusin={handleFocusIn} />

<!-- Mobile backdrop overlay -->
{#if isMobileMenuOpen}
  <button
    type="button"
    aria-label="Close menu"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
    on:click={closeMobileMenu}
    class="md:hidden fixed inset-0 z-40 bg-black/25 dark:bg-black/55 backdrop-blur-[2px] cursor-default"
  ></button>
{/if}

<div
  class="
    {shouldFixed ? 'fixed top-0 left-0 right-0 z-50 px-4 sm:px-6' : 'relative z-50'}
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none
    {isHidden && shouldFixed ? '-translate-y-[150%]' : (shouldFixed && !isAtTop ? 'translate-y-4' : 'translate-y-0')}
  "
>
  <nav aria-label="Main navigation" class="font-mono
    pointer-events-auto w-full max-w-5xl mx-auto flex items-center justify-between h-14 px-6
    transition-all duration-300 relative
    {((!isAtTop && shouldFixed) || isMobileMenuOpen) ? 'bg-[#fafafa]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]' : 'bg-transparent'}
  ">
    <a href="/" class="group inline-flex items-baseline gap-1.5 whitespace-nowrap text-[13px] text-inherit no-underline px-1 py-1">
      kevin bravo <span class="hidden opacity-50 min-[400px]:inline">aka</span>
      <span class="aka-tag text-[12px]">0bkevin</span>
    </a>

    <!-- Desktop menu -->
    <div class="hidden md:block">
      <ul class="flex items-center gap-0.5 m-0 p-0 list-none">
        {#each NAV_ITEMS as item (item.id)}
          <li>
            <a
              href={item.link}
              on:click={() => setActive(item.link)}
              aria-current={activeNav === item.link ? 'page' : undefined}
              class="text-[13px] lowercase text-inherit no-underline px-3 py-1.5 rounded-md transition-all duration-200 ease-in motion-reduce:transition-none  {activeNav === item.link ? 'opacity-100 font-semibold text-accent-500 dark:text-accent-400' : 'font-medium opacity-50 hover:opacity-100'}"
            >
              {item.name}
            </a>
          </li>
        {/each}
        <li class="ml-1">
          <ToggleDark/>
        </li>
      </ul>
    </div>

    <!-- Mobile menu toggle & ToggleDark -->
    <div class="flex items-center gap-1 md:hidden">
      <ToggleDark/>
      <button
        on:click={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
        class="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors"
      >
        <span class="sr-only">Toggle navigation menu</span>
        <span class="relative block w-4 h-[14px]" aria-hidden="true">
          <span
            class="absolute left-0 top-1/2 block h-[1.5px] w-4 bg-current rounded-full transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] {isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[5px]'}"
          ></span>
          <span
            class="absolute left-0 top-1/2 block h-[1.5px] w-4 bg-current rounded-full transform-gpu transition-opacity duration-150 {isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}"
          ></span>
          <span
            class="absolute left-0 top-1/2 block h-[1.5px] w-4 bg-current rounded-full transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] {isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[5px]'}"
          ></span>
        </span>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Dropdown -->
  {#if isMobileMenuOpen}
    <div
      class="md:hidden font-mono absolute top-[calc(100%+0.5rem)] left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 pointer-events-auto"
    >
      <div
        transition:fly={{ y: -8, duration: 240, easing: cubicOut }}
        class="origin-top bg-[#fafafa]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl rounded-xl shadow-[0_12px_36px_-12px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_36px_-12px_rgb(0,0,0,0.45)]"
      >
        <ul class="flex flex-col m-0 p-1.5 list-none">
          {#each NAV_ITEMS as item (item.id)}
            <li>
              <a
                href={item.link}
                on:click={() => { setActive(item.link); closeMobileMenu(); }}
                aria-current={activeNav === item.link ? 'page' : undefined}
                class="block px-4 py-2.5 rounded-md text-[14px] lowercase no-underline transition-colors duration-200 ease-out
                  {activeNav === item.link
                    ? 'text-accent-500 dark:text-accent-400 font-semibold'
                    : 'text-inherit font-medium opacity-60 hover:opacity-100'}"
              >
                {item.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>

<style>
  .aka-tag {
    padding: 0 0.35em;
    background: color-mix(in oklab, currentColor 8%, transparent);
    box-shadow: 2px 2px 0 #ca8a04;
    transition: box-shadow 200ms ease;
  }
  :global(.dark) .aka-tag { box-shadow: 2px 2px 0 #facc15; }
  a:hover .aka-tag { box-shadow: 3px 3px 0 #ca8a04; }
  :global(.dark) a:hover .aka-tag { box-shadow: 3px 3px 0 #facc15; }
</style>
