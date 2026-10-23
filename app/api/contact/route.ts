import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const inquiryLabels: Record<string, string> = {
  general: 'General Inquiry',
  magazine: 'Magazine Subscription',
  collaboration: 'Collaboration',
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const subjectLine = String(data.subject || '').trim()
    const message = String(data.message || '').trim()
    const inquiryType = String(data.inquiryType || '').trim()
    const language = data.language === 'tet' ? 'Tetun' : 'English'

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FEEDBACK_EMAIL_FROM,
        pass: process.env.FEEDBACK_EMAIL_PASS,
      },
    })

    const body = `
NEW MESSAGE FROM THE LAFAEK WEBSITE CONTACT FORM
=================================================
Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Asia/Dili' })} (Dili time)

FROM / HUSI
───────────
Name:       ${name}
Email:      ${email}
Language:   ${language}

INQUIRY / ASUNTU
────────────────
Type:       ${inquiryLabels[inquiryType] || inquiryType || '—'}
Subject:    ${subjectLine || '—'}

MESSAGE / MENSAJEN
──────────────────
${message}

─────────────────────────────────────────────────
Reply to this email to answer ${name} directly.
`

    await transporter.sendMail({
      from: `"Lafaek Website" <${process.env.FEEDBACK_EMAIL_FROM}>`,
      to: process.env.CONTACT_EMAIL_TO || 'info.lafaek@careint.org',
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `[Lafaek Contact] ${inquiryLabels[inquiryType] || 'Message'}: ${subjectLine || name}`,
      text: body,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact email error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send' }, { status: 500 })
  }
}