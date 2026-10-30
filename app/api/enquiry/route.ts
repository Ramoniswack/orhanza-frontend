import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = Record<string, unknown>;
const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const enquiry = {
    name: str(body.name, 120),
    phone: str(body.phone, 40),
    email: str(body.email, 160),
    service: str(body.service, 60),
    date: str(body.date, 20),
    message: str(body.message),
    shortlist: Array.isArray(body.shortlist) ? body.shortlist.map((s) => str(s, 80)).slice(0, 20) : [],
  };

  if (!enquiry.name || !enquiry.phone || !enquiry.service) {
    return NextResponse.json({ ok: false, error: "Name, phone and service are required." }, { status: 422 });
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 422 });
  }

  // TODO: deliver the enquiry — e.g. Resend/Nodemailer email, a Google Sheet, or a WhatsApp Business webhook.
  // Until then it is only logged on the server.
  console.log("[orhanza] new consultation enquiry", enquiry);

  return NextResponse.json({ ok: true });
}
