// app/api/keystatic/[[...params]]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

const base = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET!, // HMAC/state cookie
});

// Wrap GET/POST so we can see precise errors in the browser during auth
export const GET = async (req: Request) => {
  const url = new URL(req.url);
  try {
    const res = await base.GET!(req);
    // clone to add a tiny header so we know this file handled it
    const out = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: new Headers(res.headers),
    });
    out.headers.set('x-keystatic-handler', 'live');
    return out;
  } catch (err: any) {
    const payload = {
      phase: 'GET',
      path: url.pathname,
      search: url.search,
      message: err?.message ?? String(err),
      stack: err?.stack ?? null,
      hint: 'If this is the OAuth callback, check Client ID/Secret, callback URL, and KEYSTATIC_SECRET.',
    };
    console.error('KS::GET error', payload);
    return new Response(`Authorization failed\n\n${JSON.stringify(payload, null, 2)}`, {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
};

export const POST = async (req: Request) => {
  const url = new URL(req.url);
  try {
    return await base.POST!(req);
  } catch (err: any) {
    const payload = {
      phase: 'POST',
      path: url.pathname,
      search: url.search,
      message: err?.message ?? String(err),
      stack: err?.stack ?? null,
    };
    console.error('KS::POST error', payload);
    return new Response(`Authorization failed\n\n${JSON.stringify(payload, null, 2)}`, {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
};
