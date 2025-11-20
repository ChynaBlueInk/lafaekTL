// app/our-team/page.tsx (SERVER, no Keystatic)
export const dynamic="force-dynamic";

import TeamClient from "./team-client";
import {getTeamMembers} from "@/lib/content-team";
import type {MemberFile} from "@/lib/content-team";

export default async function OurTeamPage(){
  const [membersEn,membersTet]:[MemberFile[],MemberFile[]]=await Promise.all([
    getTeamMembers("en"),
    getTeamMembers("tet")
  ]);

  return (
    <main className="min-h-screen bg-stone-100">
      <TeamClient membersEn={membersEn} membersTet={membersTet}/>
    </main>
  );
}
