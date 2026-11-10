/// <reference path="../.astro/types.d.ts" />

/** Secrets read by the contact endpoint: Cloudflare runtime bindings first, then the build env. */
interface Env {
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly RESEND_API_KEY?: string;
  readonly MY_EMAIL_ADDRESS?: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  // Cloudflare exposes bindings to endpoints as locals.runtime.env.
  interface Locals extends Runtime {}
}

interface ImportMetaEnv extends Env {
  /** Public Turnstile site key, inlined into the contact form at build time. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
