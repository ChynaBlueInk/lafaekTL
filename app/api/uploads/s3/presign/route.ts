// app/api/uploads/s3/presign/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_S3_BUCKET!;
const BASE_PATH = process.env.AWS_S3_BASE_PATH || 'uploads';

// Set AWS_S3_USE_ACL=true ONLY if your bucket has ACLs enabled.
// If Object Ownership = Bucket owner enforced (ACLs disabled), leave this false.
const USE_ACL = process.env.AWS_S3_USE_ACL === 'true';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType, folder } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType required' },
        { status: 400 }
      );
    }

    const allowed = ['our-team', 'school-gallery', 'pdfs'] as const;
    const safeFolder = allowed.includes(folder) ? folder : 'misc';

    // basic filename sanitiser
    const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${BASE_PATH}/${safeFolder}/${Date.now()}-${safeName}`;

    // Build POST fields and conditions
    const fields: Record<string, string> = {
      'Content-Type': contentType || 'application/octet-stream',
    };

    const conditions: any[] = [
      ['content-length-range', 0, 20 * 1024 * 1024], // 20 MB
      ['starts-with', '$Content-Type', ''],
    ];

    if (USE_ACL) {
      fields['acl'] = 'public-read';
      conditions.push(['eq', '$acl', 'public-read']);
    }

    const { url, fields: postFields } = await createPresignedPost(s3, {
      Bucket: BUCKET,
      Key: key,
      Fields: fields,
      Conditions: conditions,
      Expires: 60, // seconds
    });

    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ url, fields: postFields, publicUrl, key });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create presign' }, { status: 500 });
  }
}
