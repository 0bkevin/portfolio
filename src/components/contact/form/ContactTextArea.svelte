<script lang="ts">
  export let name: string;
  export let label: string;
  export let error: string = "";
  export let placeholder: string;
  export let value: string = "";

  const handleInput = (event: Event) => {
    value = (event.target as HTMLTextAreaElement).value;
  };
</script>

<div class="flex flex-col gap-1.5">
  <label class="font-mono text-[12px] lowercase text-surface-500 dark:text-surface-400" for={name}>
    {label}
  </label>
  <textarea
    id={name}
    {name}
    required
    rows="5"
    autocomplete="off"
    autocapitalize="sentences"
    aria-invalid={error ? "true" : undefined}
    aria-describedby={error ? `${name}-error` : undefined}
    class="contact-field w-full resize-none scroll-mt-28 rounded-lg border border-surface-200 bg-surface-50 px-4 py-2.5 text-base text-surface-900 transition-all placeholder:text-surface-400 focus:border-accent-500/50 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-600 sm:text-sm {error ? 'border-red-400/60 ring-1 ring-red-400/10' : ''}"
    {placeholder}
    on:input={handleInput}
    bind:value
  ></textarea>
  {#if error}
    <span id={`${name}-error`} class="mt-0.5 text-[12px] text-red-500" role="alert">{error}</span>
  {/if}
</div>
