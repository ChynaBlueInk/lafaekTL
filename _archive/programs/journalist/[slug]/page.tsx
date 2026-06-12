// app/programs/journalists/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import { useMemo } from "react";

const MAP = {
  "kiik": {
    title: { en: "Lafaek Jornalista Kiik", tet: "Lafaek Jornalista Kiik" },
    desc: {
      en: "Primary-aged reporters learning to interview, write, and share community stories.",
      tet: "Reportajen ba labarik eskola primáriu atu aprende entrevista, hakerek, no partilha istória komunidade.",
    },
  },
  "foin-sae": {
    title: { en: "Lafaek Journalista Foin Sae", tet: "Lafaek Jurnalista Foin Sae" },
    desc: {
      en: "Youth build media literacy and produce articles that matter to their suku.",
      tet: "Jovens aumenta literasia mídia no halo artigu sira ne’ebé importante ba sira-nia suku.",
    },
  },
  "diplomatiku": {
    title: { en: "Lafaek Jornalista Diplomátiku", tet: "Lafaek Jurnalista Diplomátiku" },
    desc: {
      en: "Advanced reporting skills, debates, and civic engagement.",
      tet: "Kapasidade reportajen avansadu, debate no partisipasaun sivika.",
    },
  },
  "fila-liman": {
    title: { en: "Lafaek Fila Liman", tet: "Lafaek Fila Liman" },
    desc: {
      en: "Community service projects designed and led by students.",
      tet: "Projetu servisu komunidade ne’ebé dezenha no lidera husi estudante sira.",
    },
  },
  "ambiente": {
    title: { en: "Ativista Luta ba Ambiente", tet: "Ativista Luta ba Ambiente" },
    desc: {
      en: "Youth environmental activism and reporting on local climate issues.",
      tet: "Ativismu ambiental ba joventude no reportajen kona-ba problema ambiente lokál.",
    },
  },
} as const;

export default function JournalistsProgramPage() {
  const params = useParams<{ slug: keyof typeof MAP }>();
  const key = (params?.slug || "kiik") as keyof typeof MAP;

  const { title, desc } = useMemo(() => {
    return MAP[key] || MAP["kiik"];
  }, [key]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <ComingSoon
          title={title}
          description={desc}
          backHref="/programs"
          backLabel={{ en: "Back to Programs", tet: "Fila ba Programa" }}
          primaryHref="/contact"
          primaryLabel={{ en: "Ask about this program", tet: "Husu kona-ba programa ne’e" }}
        />
      </main>
    </div>
  );
}
