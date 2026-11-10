import type { APIRoute } from "astro";
import { sendEmailMessage, type ContactMessage } from "@lib/sendEmailMessage";

/** Cloudflare's always-pass test secret, used only in local development. */
const DEV_TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "x-robots-tag": "noindex, nofollow" },
  });

interface ContactRequest extends ContactMessage {
  turnstileToken: string;
}

/** A non-empty string, or null. */
const text = (value: unknown): string | null => (typeof value === "string" && value.trim() !== "" ? value : null);

/** Accepts only an object whose fields are all non-empty strings. */
const parseRequest = (body: unknown): ContactRequest | null => {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  const name = text(record["name"]);
  const email = text(record["email"]);
  const subject = text(record["subject"]);
  const message = text(record["message"]);
  const turnstileToken = text(record["turnstileToken"]);
  if (!name || !email || !subject || !message || !turnstileToken) return null;
  return { name, email, subject, message, turnstileToken };
};

interface TurnstileResult {
  success: boolean;
  "error-codes"?: string[];
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(null, { status: 400, headers: { "x-robots-tag": "noindex, nofollow" } });
  }

  try {
    const contact = parseRequest(await request.json());
    if (!contact) return jsonResponse({ message: "Every field and the verification are required." }, 400);

    // Secrets come from Cloudflare runtime bindings, falling back to the build env.
    const env = locals.runtime?.env;
    const secret =
      env?.TURNSTILE_SECRET_KEY || import.meta.env.TURNSTILE_SECRET_KEY || (import.meta.env.DEV ? DEV_TURNSTILE_SECRET : "");

    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: contact.turnstileToken,
        remoteip: request.headers.get("CF-Connecting-IP") ?? undefined,
      }),
    });
    const result = (await verification.json()) as TurnstileResult;
    if (!result.success) {
      console.error("Turnstile verification failed:", result["error-codes"]);
      return jsonResponse({ message: "Failed Turnstile verification." }, 400);
    }

    const sent = await sendEmailMessage(contact, {
      RESEND_API_KEY: env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY,
      MY_EMAIL_ADDRESS: env?.MY_EMAIL_ADDRESS || import.meta.env.MY_EMAIL_ADDRESS,
    });
    return sent
      ? jsonResponse({ message: "Email sent successfully" }, 200)
      : jsonResponse({ message: "Failed to send email" }, 500);
  } catch (error: unknown) {
    console.error("Contact endpoint error:", error);
    return jsonResponse({ message: "An internal server error occurred." }, 500);
  }
};
