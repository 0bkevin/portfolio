// Sends a contact form message to Kevin's inbox through the Resend API.

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EmailSettings {
  RESEND_API_KEY?: string | undefined;
  MY_EMAIL_ADDRESS?: string | undefined;
}

/** Sender on the domain verified in Resend. */
const FROM_ADDRESS = "kevin@email.rodolfomedinadelrio.com";
/** Resend's test inbox, only used if no destination address is configured. */
const FALLBACK_TO = "delivered@resend.dev";

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Visitor input goes into an HTML email, so it is escaped before being inserted. */
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

interface ResendResponse {
  id?: string;
}

export const sendEmailMessage = async (data: ContactMessage, settings: EmailSettings): Promise<boolean> => {
  const apiKey = settings.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return false;
  }

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message).replace(/\n/g, "<br/>");

  const html = `
    <h2>New Contact Form Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <br/>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: settings.MY_EMAIL_ADDRESS || FALLBACK_TO,
        reply_to: data.email,
        subject: `Contact Form: ${data.subject}`,
        html,
      }),
    });
    const result = (await response.json()) as ResendResponse;
    if (response.ok && result.id) return true;
    console.error("Resend API error:", result);
    return false;
  } catch (error: unknown) {
    console.error("Error sending email via Resend:", error);
    return false;
  }
};
