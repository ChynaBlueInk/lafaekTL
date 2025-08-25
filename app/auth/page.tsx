// app/auth/page.tsx
import ComingSoon from "@/components/ComingSoon";

export default function AuthPlaceholderPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ComingSoon
          title={{ en: "Accounts & Login", tet: "Konta & Login" }}
          description={{
            en: "Member accounts are planned for a future phase. For now, please contact us if you need access to private resources.",
            tet: "Konta membru sei halo iha fase tuir mai. Agora, favór kontaktu ami se ita presiza asesu ba rekursu privadu.",
          }}
          backHref="/"
          backLabel={{ en: "Back to Home", tet: "Fila ba Uma" }}
          primaryHref="/contact"
          primaryLabel={{ en: "Contact us", tet: "Kontaktu ami" }}
        />
      </main>
    </div>
  );
}
