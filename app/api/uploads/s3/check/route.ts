// app/api/uploads/s3/check/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  const REGION = process.env.AWS_REGION || 'ap-southeast-2';
  const BUCKET = process.env.AWS_S3_BUCKET;
  const BASE_PATH = process.env.AWS_S3_BASE_PATH || 'uploads';
  const USE_ACL = process.env.AWS_S3_USE_ACL === 'true';

  return NextResponse.json({
    ok: !!(BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
    REGION,
    BUCKET: BUCKET ?? null,
    actionUrl: BUCKET ? `https://${BUCKET}.s3.${REGION}.amazonaws.com` : null,
    BASE_PATH,
    USE_ACL,
    hasKeyId: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecret: !!process.env.AWS_SECRET_ACCESS_KEY,
  });
}
