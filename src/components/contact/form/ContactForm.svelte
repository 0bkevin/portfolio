<script lang="ts">
  import { Turnstile } from "svelte-turnstile";
  import ContactInput from "./ContactInput.svelte";
  import ContactTextArea from "./ContactTextArea.svelte";
  import ContactButton from "./ContactButton.svelte";
  import { evaluateInputs, sanitizeInput } from "./utils";
  let status = "toSend";

  let name = "";
  let email = "";
  let subject = "";
  let message = "";
  let turnstileToken = "";
  let turnstileError = "";
  let showTurnstileChallenge = false;
  let resetTurnstile: () => void;
  let errors = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
  let hasSubmitted = false;

  const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? "1x00000000000000000000AA" : "");

  $: if (hasSubmitted) {
    errors = evaluateInputs(name, email, subject, message);
  }

  const handleTurnstile = (e: CustomEvent<{ token: string }>) => {
    turnstileToken = e.detail.token;
    turnstileError = "";
    showTurnstileChallenge = false;
  };

  const handleTurnstileError = () => {
    turnstileToken = "";
    showTurnstileChallenge = true;
    turnstileError = "Verification failed. Please complete the check below.";
  };

  const handleTurnstileExpired = () => {
    turnstileToken = "";
    showTurnstileChallenge = true;
    turnstileError = "Verification expired. Please complete the check below.";
    if (resetTurnstile) resetTurnstile();
  };

  const showManualVerification = (message: string) => {
    showTurnstileChallenge = true;
    turnstileError = message;
    if (resetTurnstile) resetTurnstile();
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    hasSubmitted = true;
    errors = evaluateInputs(name, email, subject, message);
    const firstInvalid = (Object.keys(errors) as (keyof typeof errors)[]).find((key) => errors[key]);

    if (firstInvalid) {
      // Take the visitor straight to the first field that needs attention.
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    if (!turnstileToken) {
      showManualVerification("Please complete the verification below, then send your message.");
      return;
    }

    status = "sending";

    try {
      const response = await fetch("/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: sanitizeInput(name), 
          email: sanitizeInput(email), 
          subject: sanitizeInput(subject), 
          message: sanitizeInput(message),
          turnstileToken
        }),
      });
      
      if (response.ok) {
        status = "sent";
        name = "";
        email = "";
        subject = "";
        message = "";
        hasSubmitted = false;
      } else {
        status = "error";
        const result = await response.json().catch(() => null);
        const errorMessage = result?.message || "";
        if (/turnstile|verification/i.test(errorMessage)) {
          showManualVerification("Verification failed. Please complete the check below and try again.");
        }
      }
    } catch (error) {
      status = "error";
    } finally {
      if (resetTurnstile) resetTurnstile();
      turnstileToken = "";
      setTimeout(() => { status = "toSend"; }, 5000);
    }
  };
</script>

<form
  on:submit={handleSubmit}
  class="flex flex-col gap-6 w-full"
  name="contactForm"
  novalidate
>
  <ContactInput
    name="name"
    label="Name"
    placeholder="Your name"
    error={errors.name}
    type="text"
    autocomplete="name"
    autocapitalize="words"
    bind:value={name}
  />
  <ContactInput
    name="email"
    label="Email"
    error={errors.email}
    placeholder="Your email"
    type="email"
    autocomplete="email"
    inputmode="email"
    autocapitalize="none"
    spellcheck={false}
    bind:value={email}
  />

  <ContactInput
    name="subject"
    label="Subject"
    placeholder="What is this about?"
    error={errors.subject}
    type="text"
    bind:value={subject}
  />

  <ContactTextArea
    name="message"
    label="Message"
    error={errors.message}
    placeholder="Tell me about your project or inquiry..."
    bind:value={message}
  />

  <div class={showTurnstileChallenge ? "min-h-[65px]" : "h-0 overflow-hidden"}>
    <Turnstile 
      siteKey={TURNSTILE_SITE_KEY} 
      size={showTurnstileChallenge ? "normal" : "invisible"}
      appearance={showTurnstileChallenge ? "always" : "interaction-only"}
      on:callback={handleTurnstile}
      on:error={handleTurnstileError}
      on:expired={handleTurnstileExpired}
      on:timeout={handleTurnstileExpired}
      on:unsupported={() => showManualVerification("Verification is not supported in this browser. Please try another browser or email me directly.")}
      bind:reset={resetTurnstile}
    />
  </div>
  {#if turnstileError}
    <span class="text-sm text-red-500">{turnstileError}</span>
  {/if}

  <div class="pt-1">
    <ContactButton {status} />
  </div>
</form>
