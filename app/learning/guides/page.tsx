// app/learning/guides/page.tsx
import ComingSoon from "@/components/ComingSoon";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ComingSoon
          title={{
            en: "Parent & Teacher Guides",
            tet: "Guia ba Pais & Maestri",
          }}
          description={{
            en: "Practical tips and activities adapted from Manorin and Komunidade. We’re curating the first set now.",
            tet: "Dica pratiku no atividade sira bazeia husi Manorin no Komunidade. Ami sei prepara konjuntu dahuluk.",
          }}
          backHref="/learning"
          backLabel={{ en: "Back to Learning", tet: "Fila ba Aprendizajen" }}
          primaryHref="/contact"
          primaryLabel={{ en: "Partner with us", tet: "Sai parceiru ho ami" }}
        />
      </main>
    </div>
  );
}
