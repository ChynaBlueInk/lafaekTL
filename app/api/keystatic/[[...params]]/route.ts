// app/api/keystatic/[[...params]]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Keystatic's built-in API handler (supports all /api/keystatic/* routes)
export const { GET, POST } = makeRouteHandler({
  config,
  // optional but recommended if you secured /api/keystatic:
  secret: process.env.KEYSTATIC_SECRET!,
});
