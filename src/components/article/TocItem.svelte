<script>
  export let item = {
    text: "",
    level: 0,
    id: "",
  };
  export let active = false;

  // Nesting is shown with indentation and a small marker, never by fading the text,
  // so every level stays readable.
  const indent = { 2: "", 3: "ml-3", 4: "ml-6" };
</script>

{#if item.level >= 2 && item.level <= 4}
  <li class={`flex min-w-0 items-center gap-1.5 ${indent[item.level]}`}>
    {#if item.level > 2}
      <span class="h-1 w-1 shrink-0 rounded-full bg-surface-300 dark:bg-surface-700" aria-hidden="true"></span>
    {/if}
    <a
      href={`#${item.id}`}
      title={item.text}
      class={`block min-w-0 truncate py-0.5 transition-colors ${item.level === 2 ? "text-[13px]" : "text-[12px]"} ${active ? "text-accent-500 dark:text-accent-400" : "text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"}`}
    >
      {item.text}
    </a>
  </li>
{/if}
