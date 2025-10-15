// app/api/admin/our-team/delete/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

function isValidSlug(slug: string) {
  return /^[a-z0-9-]+$/.test(slug);
}

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== 'string' || !isValidSlug(slug)) {
      return NextResponse.json({ ok: false, error: 'Invalid slug' }, { status: 400 });
    }

    const baseDir = path.join(process.cwd(), 'content', 'our-team');

    const targets = [
      path.join(baseDir, `${slug}.yaml`),           // current schema file
      path.join(baseDir, `${slug}.yml`),            // just in case
      path.join(baseDir, `${slug}.md`),             // legacy
      path.join(baseDir, 'en', `${slug}.md`),       // legacy localized content
      path.join(baseDir, 'tet', `${slug}.md`),      // legacy localized content
    ];

    let deletedAny = false;
    for (const p of targets) {
      try {
        await fs.unlink(p);
        deletedAny = true;
      } catch {
        // ignore if missing
      }
    }

    if (!deletedAny) {
      return NextResponse.json({ ok: false, error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
