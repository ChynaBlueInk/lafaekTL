// app/api/keystatic/status/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  // report which critical envs are present (booleans only)
  const envs = {
    KEYSTATIC_GITHUB_OWNER: !!process.env.KEYSTATIC_GITHUB_OWNER,
    KEYSTATIC_GITHUB_REPO: !!process.env.KEYSTATIC_GITHUB_REPO,
    KEYSTATIC_GITHUB_CLIENT_ID: !!process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    KEYSTATIC_GITHUB_CLIENT_SECRET: !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    KEYSTATIC_SECRET: !!process.env.KEYSTATIC_SECRET,
  };

  // resolve the correct origin for the currently running deployment
  const origin =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000');

  let apiOk = false;
  let apiStatus: number | null = null;

  // construct headers in a way that satisfies HeadersInit
  const secret = process.env.KEYSTATIC_SECRET ?? '';
  const headers: HeadersInit = secret
    ? { Authorization: `Bearer ${secret}` }
    : {}; // don't send empty bearer

  try {
    const res = await fetch(`${origin}/api/keystatic`, {
      method: 'GET',
      cache: 'no-store',
      headers,
    } as RequestInit);

    apiStatus = res.status;
    apiOk = res.ok;
  } catch {
    apiOk = false;
  }

  return NextResponse.json({ envs, apiOk, apiStatus, checkedOrigin: origin });
}
