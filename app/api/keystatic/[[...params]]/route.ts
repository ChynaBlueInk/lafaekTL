// app/api/keystatic/[[...params]]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

const base = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET!, // HMAC/state cookie
});

// Wrap GET/POST so we can log failures into Vercel “Deployment → Logs”
export const GET = async (req: Request) => {
  const url = new URL(req.url);
  try {
    const res = await base.GET!(req);

    // clone response so we can add a header safely
    const out = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: new Headers(res.headers),
    });
    out.headers.set('x-keystatic-handler', 'live');
    return out;
  } catch (err: any) {
    console.error('KS::GET error', {
      path: url.pathname,
      search: url.search,
      msg: err?.message ?? String(err),
      stack: err?.stack ?? null,
    });
    return new Response('Authorization failed (GET)', { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const url = new URL(req.url);
  try {
    return await base.POST!(req);
  } catch (err: any) {
    console.error('KS::POST error', {
      path: url.pathname,
      search: url.search,
      msg: err?.message ?? String(err),
      stack: err?.stack ?? null,
    });
    return new Response('Authorization failed (POST)', { status: 500 });
  }
};
