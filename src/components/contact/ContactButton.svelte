<script lang="ts">
  import Icon from "@components/ui/Icon.svelte";
  import type { SendStatus } from "./validation";

  export let status: SendStatus;

  let showMessage = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  $: if (status === "sent" || status === "error") {
    showMessage = true;
    clearTimeout(timeoutId);
    if (status === "sent") {
      timeoutId = setTimeout(() => {
        showMessage = false;
      }, 5000);
    }
  }

  const dismissPopup = () => {
    showMessage = false;
  };

  // Cleanup lives in an action, not onDestroy: the form is server-rendered, and on Cloudflare
  // the server build gets Svelte's browser runtime, where lifecycle hooks throw during SSR.
  const clearTimerOnDestroy = (_node: HTMLElement) => ({ destroy: () => clearTimeout(timeoutId) });
</script>

<button
  use:clearTimerOnDestroy
  type="submit"
  disabled={status !== "toSend"}
  class="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-900 px-6 py-3.5 font-mono text-[13px] lowercase text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-surface-100 dark:text-surface-900 dark:hover:bg-surface-200"
>
  {#if status === "sending"}
    <Icon name="loader" class="h-4 w-4 animate-spin" />
    <span>Sending...</span>
  {:else if status === "sent"}
    <Icon name="check" class="h-4 w-4" />
    <span>Message Sent</span>
  {:else if status === "error"}
    <Icon name="alert" class="h-4 w-4" />
    <span>Failed to Send</span>
  {:else}
    <span>Send Message</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true"><path d="m5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
  {/if}
</button>

{#if status === "sent" && showMessage}
  <div role="alert" class="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
      <Icon name="check" class="h-4 w-4" />
    </div>
    <p class="flex-1 text-sm font-medium text-green-800 dark:text-green-300">Message sent successfully!</p>
    <button type="button" on:click={dismissPopup} aria-label="Dismiss message" class="flex h-8 w-8 items-center justify-center rounded-lg text-green-600/70 transition-colors hover:bg-green-100 hover:text-green-600 dark:text-green-400/70 dark:hover:bg-green-500/20 dark:hover:text-green-400">
      <Icon name="close" class="h-4 w-4" />
    </button>
  </div>
{/if}

{#if status === "error" && showMessage}
  <div role="alert" class="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
      <Icon name="alert" class="h-4 w-4" />
    </div>
    <p class="flex-1 text-sm font-medium text-red-800 dark:text-red-300">Something went wrong. Please try again.</p>
    <button type="button" on:click={dismissPopup} aria-label="Dismiss message" class="flex h-8 w-8 items-center justify-center rounded-lg text-red-600/70 transition-colors hover:bg-red-100 hover:text-red-600 dark:text-red-400/70 dark:hover:bg-red-500/20 dark:hover:text-red-400">
      <Icon name="close" class="h-4 w-4" />
    </button>
  </div>
{/if}
