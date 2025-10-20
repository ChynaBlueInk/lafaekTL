// app/api/keystatic/status/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  const envs = {
    KEYSTATIC_GITHUB_OWNER: !!process.env.KEYSTATIC_GITHUB_OWNER,
    KEYSTATIC_GITHUB_REPO: !!process.env.KEYSTATIC_GITHUB_REPO,
    KEYSTATIC_GITHUB_CLIENT_ID: !!process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    KEYSTATIC_GITHUB_CLIENT_SECRET: !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    KEYSTATIC_SECRET: !!process.env.KEYSTATIC_SECRET,
  };

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000');

  let apiOk = false;
  let apiStatus: number | null = null;

  try {
    const res = await fetch(`${origin}/api/keystatic`, {
      method: 'GET',
      cache: 'no-store',
      // ✅ send secret header expected by secured API
      headers: {
        'x-keystatic-secret': process.env.KEYSTATIC_SECRET ?? '',
      },
    });
    apiStatus = res.status;
    apiOk = res.ok;
  } catch {
    apiOk = false;
  }

  return NextResponse.json({ envs, apiOk, apiStatus, checkedOrigin: origin });
}
