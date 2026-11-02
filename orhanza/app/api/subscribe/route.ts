import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 422 });
  }
  // TODO: add the address to your mailing list (Mailchimp, Resend audiences, Google Sheet…). For now it is only logged.
  console.log("[orhanza] newsletter signup", email);
  return NextResponse.json({ ok: true });
}
