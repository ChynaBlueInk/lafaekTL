// lib/content-team.ts
import { reader } from '@/lib/keystatic';

export type MemberFile = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  sketch?: string;
  started?: string;
};

type Lang = 'en' | 'tet';

// Shape returned by the Keystatic reader (be tolerant of nulls)
type OurTeamEntryFromReader = {
  name: string | null;
  role: string | null;
  roleTet?: string | null;
  started?: string | null;
  photoUrl?: string | null;
  sketchUrl?: string | null;
  bio?: string | null;     // EN body (now plain text)
  bioTet?: string | null;  // Tetun body (plain text)
};

export async function getTeamMembers(lang: Lang): Promise<MemberFile[]> {
  const raw = await reader.collections.our_team.all();

  const mapped: MemberFile[] = (raw as Array<{ slug: string; entry: OurTeamEntryFromReader }>)
    .map(({ slug, entry }) => {
      const name = entry.name ?? slug;
      const roleEn = entry.role ?? '';
      const role = lang === 'tet' ? (entry.roleTet ?? roleEn) : roleEn;
      const bio = lang === 'tet' ? (entry.bioTet ?? '') : (entry.bio ?? '');

      return {
        slug,
        name,
        role,
        bio,
        photo: entry.photoUrl ?? undefined,
        sketch: entry.sketchUrl ?? undefined,
        started: entry.started ?? undefined,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  return mapped;
}
