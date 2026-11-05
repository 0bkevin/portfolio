<script lang="ts">
  export let name: string;
  export let label: string;
  export let placeholder: string;
  export let type: string;
  export let value: string = "";
  export let error = "";

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
  };
</script>

<div class="flex flex-col gap-1.5">
  <label
    class="font-mono text-[12px] lowercase text-surface-500 dark:text-surface-400"
    for={name}
  >
    {label}
  </label>
  <input
    {type}
    id={name}
    {name}
    required
    class="w-full px-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500/50 transition-all {error ? 'border-red-400/60 ring-1 ring-red-400/10' : ''}"
    {placeholder}
    on:input={handleInput}
    bind:value
  />
  {#if error}
    <span class="text-[11px] text-red-500 mt-0.5">{error}</span>
  {/if}
</div>
