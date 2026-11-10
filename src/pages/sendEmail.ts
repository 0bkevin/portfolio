import type { APIRoute } from "astro";
import { sendEmailMessage } from "@lib/sendEmailMessage";

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    try {
      const body = await request.json();

      // Verify Cloudflare Turnstile token
      const turnstileToken = body.turnstileToken;
      
      // With Cloudflare Pages/Workers adapter in Astro v5/v6, secrets are usually accessed from locals.runtime.env
      // Or they might be injected via Vite statically during build. 
      // We check locals.runtime.env first for Cloudflare environment bindings, then fallback to import.meta.env
      // @ts-ignore
      const cfEnv = locals?.runtime?.env || {};
      const TURNSTILE_SECRET_KEY = cfEnv.TURNSTILE_SECRET_KEY || import.meta.env.TURNSTILE_SECRET_KEY || (import.meta.env.DEV ? "1x0000000000000000000000000000000AA" : "");
      
      if (!turnstileToken) {
        console.error("Turnstile token missing");
        return jsonResponse({ message: "Turnstile token is missing." }, 400);
      }

      console.log("Sending verification request to Cloudflare...");
      const ip = request.headers.get("CF-Connecting-IP");
      
      const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: ip || undefined,
        }),
      });

      const turnstileResult = await turnstileResponse.json();
      console.log("Cloudflare response:", turnstileResult);

      if (!turnstileResult.success) {
        console.error("Failed verification:", turnstileResult);
        return jsonResponse({ message: "Failed Turnstile verification." }, 400);
      }

      console.log("Verification succeeded, sending email...");
      const success = await sendEmailMessage({
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
      }, cfEnv);
      
      if (success) {
        return jsonResponse({ message: "Email sent successfully" }, 200);
      } else {
        console.error("Email sending failed");
        return jsonResponse({ message: "Failed to send email" }, 500);
      }
    } catch (err) {
      console.error("Catch block error:", err);
      return jsonResponse({ message: "An internal server error occurred." }, 500);
    }
  }
  return new Response(null, {
    status: 400,
    headers: {
      "x-robots-tag": "noindex, nofollow",
    },
  });
};
