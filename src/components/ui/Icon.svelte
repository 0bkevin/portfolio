<script lang="ts">
  import { ICONS, type IconDefinition, type IconName } from "@lib/icons";

  export let name: IconName;
  let className = "h-4 w-4";
  export { className as class };

  const iconFor = (key: IconName): IconDefinition => ICONS[key];
  $: icon = iconFor(name);
</script>

{#if icon.kind === "fill"}
  <svg viewBox="0 0 24 24" class={className} fill="currentColor" aria-hidden="true">{@html icon.body}</svg>
{:else}
  <svg
    viewBox="0 0 24 24"
    class={className}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true">{@html icon.body}</svg
  >
{/if}
