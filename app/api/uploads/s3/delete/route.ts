// app/api/uploads/s3/delete/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Only allow deleting from your bucket host (adjust if you later use CloudFront)
const ALLOWED_HOSTS = [
  'lafaek-media.s3.ap-southeast-2.amazonaws.com',
];

function parseS3Url(url: string) {
  try {
    const u = new URL(url);
    if (!ALLOWED_HOSTS.includes(u.hostname)) return null;
    // path like: /uploads/folder/filename.ext
    let key = u.pathname.replace(/^\/+/, ''); // remove leading '/'
    if (!key) return null;
    // Bucket is implied by hostname: <bucket>.s3.<region>.amazonaws.com
    const bucket = u.hostname.split('.s3.')[0]; // "lafaek-media"
    return { bucket, key };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing url' }, { status: 400 });
    }
    const target = parseS3Url(url);
    if (!target) {
      return NextResponse.json({ ok: false, error: 'URL not allowed' }, { status: 400 });
    }

    const region =
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      'ap-southeast-2';

    const s3 = new S3Client({
      region,
      // Credentials: picked up automatically from env
      // (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
    });

    await s3.send(new DeleteObjectCommand({
      Bucket: target.bucket,
      Key: target.key,
    }));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Delete failed' },
      { status: 500 }
    );
  }
}
