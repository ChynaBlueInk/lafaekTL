// app/api/keystatic/[[...params]]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { makeHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Keystatic's built-in API handler (supports all /api/keystatic/* routes)
export const { GET, POST } = makeHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET!,
});
