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
    KEYSTATIC_GITHUB_TOKEN: !!process.env.KEYSTATIC_GITHUB_TOKEN, // ✅ new: PAT visible?
  };

  // Resolve origin for the existing apiOk check
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000');

  // Check the keystatic API route health
  let apiOk = false;
  let apiStatus: number | null = null;
  try {
    const res = await fetch(`${origin}/api/keystatic`, {
      method: 'GET',
      cache: 'no-store',
    });
    apiStatus = res.status;
    apiOk = res.ok;
  } catch {
    apiOk = false;
  }

  // ✅ NEW: probe GitHub API using the PAT to ensure it’s good
  const owner = process.env.KEYSTATIC_GITHUB_OWNER || 'ChynaBlueInk';
  const repo = process.env.KEYSTATIC_GITHUB_REPO || 'lafaekTL';
  const token = process.env.KEYSTATIC_GITHUB_TOKEN || '';
  let ghOk = false;
  let ghStatus: number | null = null;

  if (token) {
    try {
      const gh = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Authorization: `token ${token}`, 'User-Agent': 'keystatic-status' },
        cache: 'no-store',
      });
      ghStatus = gh.status;
      ghOk = gh.ok;
    } catch {
      ghOk = false;
    }
  }

  return NextResponse.json({ envs, apiOk, apiStatus, checkedOrigin: origin, ghOk, ghStatus });
}
