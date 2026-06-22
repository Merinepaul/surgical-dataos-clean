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

    const timestamp = new Date().toISOString();
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "contact@surgicaldataos.org",
      to: "drmerinepaul@gmail.com",
      subject: "New SurgicalDataOS Request Access",
      text: [
        "New SurgicalDataOS Request Access",
        "",
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Organization: ${payload.organization}`,
        "",
        "Message:",
        payload.message || "(Not provided)",
        "",
        `Submitted: ${timestamp}`,
      ].join("\n"),
      html: `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin: 0 0 16px; font-size: 20px;">New SurgicalDataOS Request Access</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p style="margin: 0 0 16px;"><strong>Organization:</strong> ${escapeHtml(payload.organization)}</p>
          <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
          <p style="margin: 0 0 16px; white-space: pre-wrap;">${escapeHtml(payload.message || "(Not provided)")}</p>
          <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
        </div>
      `.trim(),
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
