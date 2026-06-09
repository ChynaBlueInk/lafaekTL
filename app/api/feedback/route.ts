import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FEEDBACK_EMAIL_FROM,
        pass: process.env.FEEDBACK_EMAIL_PASS,
      },
    })

    const issueBlock =
      data.foundIssue === 'yes'
        ? `
ISSUE DETAILS / DETAILLU PROBLEMA
──────────────────────────────────
Issue types:  ${(data.issueTypes || []).join(', ') || '—'}
Description:  ${data.issueDesc || '—'}

Steps to reproduce:
  1. ${data.step1 || '—'}
  2. ${data.step2 || '—'}
  3. ${data.step3 || '—'}

Expected:     ${data.expected || '—'}
Actual:       ${data.actual || '—'}

Task completed: ${data.taskComplete || '—'}
Severity:       ${data.severity || '—'}
`
        : 'No issues reported on this page.'

    const body = `
NEW LAFAEK WEBSITE FEEDBACK SUBMISSION
========================================
Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Asia/Dili' })} (Dili time)

TESTER / TESTADÓR
─────────────────
Name:       ${data.name || '—'}
Role:       ${data.role || '—'}
Date:       ${data.testDate || '—'}
Session:    ${data.sessionType || '—'}

DEVICE / APARELHU
─────────────────
OS:         ${data.os || '—'}${data.osOther ? ` (${data.osOther})` : ''}
Browser:    ${data.browser || '—'}${data.browserOther ? ` (${data.browserOther})` : ''}
Connection: ${data.connection || '—'}

PAGE TESTED / PÁJINA TESTADU
─────────────────────────────
Page:       ${data.pageName || '—'}
URL:        ${data.pageUrl || '—'}

${issueBlock}

FEEDBACK / FEEDBACK
────────────────────
Liked:       ${data.liked || '—'}
Disliked:    ${data.disliked || '—'}
Suggestions: ${data.suggestions || '—'}

RATINGS / AVALIASAUN
─────────────────────
Ease of use:   ${data.ratingEase || '—'} / 5
Visual design: ${data.ratingDesign || '—'} / 5
Content:       ${data.ratingContent || '—'} / 5
Overall:       ${data.ratingOverall || '—'} / 5

Additional comments: ${data.comments || '—'}
`

    const subject = `[Lafaek Feedback] ${data.name || 'Unknown'} — ${data.pageName || 'Unknown page'} — ${
      data.foundIssue === 'yes' ? `⚠️ ${data.severity || 'issue'} found` : '✅ No issues'
    }`

    await transporter.sendMail({
      from: `"Lafaek Feedback" <${process.env.FEEDBACK_EMAIL_FROM}>`,
      to: process.env.FEEDBACK_EMAIL_TO,
      subject,
      text: body,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Feedback email error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send' }, { status: 500 })
  }
}