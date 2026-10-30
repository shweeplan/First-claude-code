import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const { ok, errors, data } = validateContact((body ?? {}) as Record<string, unknown>);
  if (!ok) return NextResponse.json({ ok: false, errors }, { status: 422 });

  // PLACEHOLDER HANDLER: nothing is sent anywhere yet.
  // Connect an email service here (Resend, Postmark, SendGrid) or a CRM / Google Sheet webhook.
  // See README "Connect the contact form".
  console.log("[contact:placeholder] received submission", { business: data.business });

  return NextResponse.json({ ok: true, delivered: false });
}
