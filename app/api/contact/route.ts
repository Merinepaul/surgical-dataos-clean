import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseBody(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;

  const { name, email, organization, message } = body as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof organization !== "string"
  ) {
    return null;
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    organization: organization.trim(),
    message: typeof message === "string" ? message.trim() : "",
  };

  if (!payload.name || !payload.email || !payload.organization) {
    return null;
  }

  if (!isValidEmail(payload.email)) return null;

  return payload;
}

function formatSubmittedTimestamp(date: Date) {
  const dateLine = date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeLine = `${date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} UTC`;

  return { dateLine, timeLine, full: `${dateLine}\n${timeLine}` };
}

function buildPlainTextEmail(payload: ContactPayload, submitted: string) {
  const message = payload.message || "(Not provided)";

  return [
    "New SurgicalDataOS Request",
    "",
    "Name",
    payload.name,
    "",
    "Organization",
    payload.organization,
    "",
    "Email",
    payload.email,
    "",
    "----------------------------------------",
    "",
    "Message",
    "",
    message,
    "",
    "----------------------------------------",
    "",
    "Submitted",
    "",
    submitted,
  ].join("\n");
}

function buildHtmlEmail(payload: ContactPayload, submittedHtml: string) {
  const message = payload.message || "(Not provided)";

  return `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.6; max-width: 560px;">
      <h1 style="margin: 0 0 24px; font-size: 20px; font-weight: 600; letter-spacing: -0.01em;">
        New SurgicalDataOS Request
      </h1>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 0 0 4px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b;">
            Name
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 16px; font-size: 15px; color: #0f172a;">
            ${escapeHtml(payload.name)}
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 4px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b;">
            Organization
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 16px; font-size: 15px; color: #0f172a;">
            ${escapeHtml(payload.organization)}
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 4px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b;">
            Email
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 24px; font-size: 15px; color: #0f172a;">
            <a href="mailto:${escapeHtml(payload.email)}" style="color: #0891b2; text-decoration: none;">
              ${escapeHtml(payload.email)}
            </a>
          </td>
        </tr>
      </table>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 24px;" />

      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b;">
        Message
      </p>
      <p style="margin: 0 0 24px; font-size: 15px; white-space: pre-wrap; color: #0f172a;">
        ${escapeHtml(message)}
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 24px;" />

      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b;">
        Submitted
      </p>
      <p style="margin: 0; font-size: 15px; color: #475569; white-space: pre-line;">
        ${submittedHtml}
      </p>
    </div>
  `.trim();
}

export async function POST(request: Request) {
  try {
    const payload = parseBody(await request.json());

    if (!payload) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const submitted = formatSubmittedTimestamp(new Date());
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "contact@surgicaldataos.org",
      to: "drmerinepaul@gmail.com",
      replyTo: payload.email,
      subject: "New SurgicalDataOS Request Access",
      text: buildPlainTextEmail(payload, submitted.full),
      html: buildHtmlEmail(
        payload,
        `${escapeHtml(submitted.dateLine)}<br />${escapeHtml(submitted.timeLine)}`,
      ),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
