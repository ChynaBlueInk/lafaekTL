// app/our-team/page.tsx (SERVER)
import { createReader } from '@keystatic/core/reader';
import ksConfig from '../../keystatic.config';
import TeamClient from './team-client';
import type { MemberFile } from '@/lib/content-team';

// Safely pluck a value trying several possible keys
function pick<T extends object>(obj: T | undefined, keys: string[], fallback?: any) {
  if (!obj) return fallback;
  for (const k of keys) {
    // @ts-ignore
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
}

function toStr(v: any): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    if (typeof (v as any).src === 'string') return (v as any).src;
    if (typeof (v as any).url === 'string') return (v as any).url;
  }
  return undefined;
}

type Lang = 'en' | 'tet';

async function loadMembersForLang(lang: Lang): Promise<MemberFile[]> {
  const reader = createReader(process.cwd(), ksConfig) as any;
  const collections = reader.collections ?? {};

  // Support either key: our-team OR our_team
  const key =
    'our-team' in collections ? 'our-team' :
    ('our_team' in collections ? 'our_team' : null);

  if (!key) return [];

  let rows: Array<{ slug: string; entry: Record<string, any> }> = [];
  try {
    rows = await collections[key].all();
  } catch {
    return [];
  }

  // Build interim records WITH local order/visible
  const interim = rows.map(({ slug, entry }) => {
    const name = (lang === 'tet')
      ? pick(entry, ['nameTet', 'name_tet', 'name_tl', 'nameTetum', 'name_tetum', 'name'], 'Untitled')
      : pick(entry, ['nameEn', 'name_en', 'name'], 'Untitled');

    const roleRaw = (lang === 'tet')
      ? pick(entry, ['roleTet', 'role_tet', 'positionTet', 'position_tet', 'role'], '')
      : pick(entry, ['roleEn', 'role_en', 'positionEn', 'position_en', 'role'], '');

    const bioRaw = (lang === 'tet')
      ? pick(entry, ['bioTet', 'bio_tet', 'aboutTet', 'about_tet', 'bio'], '')
      : pick(entry, ['bioEn', 'bio_en', 'aboutEn', 'about_en', 'bio'], '');

    const photo = toStr(pick(entry, ['photo', 'image', 'photoUrl', 'imageUrl'], undefined));
    const sketch = toStr(pick(entry, ['sketch', 'sketchUrl', 'avatar', 'avatarUrl'], undefined));

    const orderRaw = pick(entry, ['order', 'sort', 'priority'], 0);
    const order = typeof orderRaw === 'number' ? orderRaw : Number(orderRaw) || 0;

    const visible = pick(entry, ['visible', 'published', 'isVisible'], true) !== false;

    return {
      slug,
      name: String(name ?? 'Untitled'),
      role: String(roleRaw ?? ''),
      bio: String(bioRaw ?? ''),
      photo,
      sketch,
      order,     // local only
      visible,   // local only
    };
  });

  // Filter/sort using local fields, then strip them for MemberFile
  const finalMembers: MemberFile[] = interim
    .filter(m => m.visible)
    .sort((a, b) => a.order - b.order)
    .map(({ slug, name, role, bio, photo, sketch }) => ({
      slug,
      name,
      role,     // required string
      bio,      // string
      photo,    // string | undefined
      sketch,   // string | undefined
    }));

  return finalMembers;
}

export default async function OurTeamPage() {
  const [membersEn, membersTet] = await Promise.all([
    loadMembersForLang('en'),
    loadMembersForLang('tet'),
  ]);

  return (
    <main className="min-h-screen bg-stone-100">
      <TeamClient membersEn={membersEn} membersTet={membersTet} />
    </main>
  );
}
