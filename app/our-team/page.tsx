// app/our-team/page.tsx (SERVER)
import { getTeamMembers } from '@/lib/content-team';
import TeamClient from './team-client';

export default async function OurTeamPage() {
  // default language to Tetun for initial HTML; client can switch
  const initialLocale: 'tet' | 'en' = 'tet';

  const [membersTet, membersEn] = await Promise.all([
    getTeamMembers('tet'),
    getTeamMembers('en'),
  ]);

  return (
    <TeamClient
      membersTet={membersTet}
      membersEn={membersEn}
      initialLocale={initialLocale}
    />
  );
}
