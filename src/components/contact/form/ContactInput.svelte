<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  export let name: string;
  export let label: string;
  export let placeholder: string;
  export let type: string;
  export let value: string = "";
  export let error = "";
  export let autocomplete: HTMLInputAttributes["autocomplete"] = "off";
  export let inputmode: HTMLInputAttributes["inputmode"] = undefined;
  export let autocapitalize: string = "sentences";
  export let spellcheck = true;

  const handleInput = (event: Event) => {
    value = (event.target as HTMLInputElement).value;
  };

  // Enter (or the keyboard's "next" key) moves to the next field instead of submitting early.
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Enter" || event.isComposing) return;
    const field = event.target as HTMLInputElement;
    const fields = Array.from(field.form?.querySelectorAll<HTMLElement>("input:not([type=hidden]), textarea") ?? []);
    const next = fields[fields.indexOf(field) + 1];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };
</script>

<div class="flex flex-col gap-1.5">
  <label class="font-mono text-[12px] lowercase text-surface-500 dark:text-surface-400" for={name}>
    {label}
  </label>
  <input
    {type}
    id={name}
    {name}
    required
    {autocomplete}
    {inputmode}
    {autocapitalize}
    {spellcheck}
    enterkeyhint="next"
    aria-invalid={error ? "true" : undefined}
    aria-describedby={error ? `${name}-error` : undefined}
    class="contact-field w-full scroll-mt-28 rounded-lg border border-surface-200 bg-surface-50 px-4 py-2.5 text-base text-surface-900 transition-all placeholder:text-surface-400 focus:border-accent-500/50 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-600 sm:text-sm {error ? 'border-red-400/60 ring-1 ring-red-400/10' : ''}"
    {placeholder}
    on:input={handleInput}
    on:keydown={handleKeydown}
    bind:value
  />
  {#if error}
    <span id={`${name}-error`} class="mt-0.5 text-[12px] text-red-500" role="alert">{error}</span>
  {/if}
</div>
