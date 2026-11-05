<script>
  export let status;

  import { onDestroy } from "svelte";

  let showMessage = false;
  let timeoutId;

  $: if (status === "sent" || status === "error") {
    showMessage = true;
    clearTimeout(timeoutId);
    if (status === "sent") {
      timeoutId = setTimeout(() => {
        showMessage = false;
      }, 5000);
    }
  }

  function dismissPopup() {
    showMessage = false;
  }

  onDestroy(() => {
    clearTimeout(timeoutId);
  });
</script>

<button
  type="submit"
  disabled={status !== "toSend"}
  class="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 font-mono text-[13px] lowercase transition-all duration-300 hover:bg-surface-800 dark:hover:bg-surface-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:hover:shadow-none"
>
  {#if status === "sending"}
    <i class="bx bx-loader-alt animate-spin text-lg"></i>
    <span>Sending...</span>
  {:else if status === "sent"}
    <i class="bx bx-check text-lg"></i>
    <span>Message Sent</span>
  {:else if status === "error"}
    <i class="bx bx-error-circle text-lg"></i>
    <span>Failed to Send</span>
  {:else}
    <span>Send Message</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="m5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  {/if}
</button>

{#if status === "sent" && showMessage}
  <div role="alert" class="mt-5 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
      <i class="bx bx-check text-green-600 dark:text-green-400 text-lg"></i>
    </div>
    <p class="text-sm font-medium text-green-800 dark:text-green-300 flex-1">Message sent successfully!</p>
    <button type="button" on:click={dismissPopup} class="w-8 h-8 flex items-center justify-center rounded-lg text-green-600/70 hover:text-green-600 hover:bg-green-100 dark:text-green-400/70 dark:hover:text-green-400 dark:hover:bg-green-500/20 transition-colors">
      <i class="bx bx-x text-xl"></i>
    </button>
  </div>
{/if}

{#if status === "error" && showMessage}
  <div role="alert" class="mt-5 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
      <i class="bx bx-error-circle text-red-600 dark:text-red-400 text-lg"></i>
    </div>
    <p class="text-sm font-medium text-red-800 dark:text-red-300 flex-1">Something went wrong. Please try again.</p>
    <button type="button" on:click={dismissPopup} class="w-8 h-8 flex items-center justify-center rounded-lg text-red-600/70 hover:text-red-600 hover:bg-red-100 dark:text-red-400/70 dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-colors">
      <i class="bx bx-x text-xl"></i>
    </button>
  </div>
{/if}
