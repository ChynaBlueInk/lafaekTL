// app/api/keystatic/[[...params]]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Keystatic API handler for all /api/keystatic/* routes
export const { GET, POST } = makeRouteHandler({
  config,
  // HMAC used for state/csrf — must be set in server env
  secret: process.env.KEYSTATIC_SECRET!,
  // NOTE: Do NOT pass { github: { ... } } here for your version;
  // the handler will read KEYSTATIC_GITHUB_CLIENT_ID/SECRET from env.
});
