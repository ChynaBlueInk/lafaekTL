// app/api/keystatic/[...params]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

export const { GET, POST } = makeRouteHandler({ config });
