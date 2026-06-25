// app/api/magazines/request-copies/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      name,
      organisation,
      role,
      email,
      phone,
      district,
      magazineCode,
      magazineTitle,
      quantity,
      purpose,
      language: lang,
    } = data;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !magazineCode?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and magazine are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FEEDBACK_EMAIL_FROM,
        pass: process.env.FEEDBACK_EMAIL_PASS,
      },
    });

    const submitted = new Date().toLocaleString("en-AU", {
      timeZone: "Asia/Dili",
    });

    const body = `
NEW MAGAZINE COPY REQUEST — REVISTA LAFAEK
==========================================
Submitted: ${submitted} (Dili time)

MAGAZINE REQUESTED / REVISTA NE'EBÉ HUSU
─────────────────────────────────────────
Magazine:     ${magazineTitle || magazineCode}
Code:         ${magazineCode}
Quantity:     ${quantity || "Not specified"}
Language:     ${lang || "Not specified"}

CONTACT DETAILS / INFORMASAUN KONTAKTU
────────────────────────────────────────
Name:         ${name}
Organisation: ${organisation || "—"}
Role / Title: ${role || "—"}
Email:        ${email}
Phone:        ${phone || "—"}
District:     ${district || "—"}

PURPOSE / OBJETIVU
───────────────────
${purpose || "Not provided"}

──────────────────────────────────────────
This request was submitted via the Lafaek website magazine page.
Please reply directly to the requester at: ${email}
`;

    const subject = `[Lafaek] Magazine copy request — ${magazineTitle || magazineCode} — ${name}`;

    await transporter.sendMail({
      from: `"Lafaek Website" <${process.env.FEEDBACK_EMAIL_FROM}>`,
      to: "lafaek@careint.org",
      replyTo: email,
      subject,
      text: body,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[magazine-request] email error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send request. Please try again." },
      { status: 500 }
    );
  }
}