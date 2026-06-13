"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"
import AdminGuard from "@/components/AdminGuard"
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  type SectionPermission,
} from "@/lib/roles"

export default function NewUserPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const L = language === "tet" ? "tet" : "en"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [permissions, setPermissions] = useState<SectionPermission[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const t = {
    en: {
      title: "Add New User",
      name: "Full Name",
      email: "Email Address",
      sections: "Section Access",
      sectionsHint: "Tick all sections this user can manage.",
      selectAll: "Select all",
      clearAll: "Clear all",
      save: "Create User",
      cancel: "Cancel",
      saving: "Creating…",
      namePlaceholder: "e.g. Maria da Silva",
      emailPlaceholder: "e.g. maria@lafaek.tl",
      note: "The user will receive an email from Cognito to set their password.",
      noSections: "Please select at least one section.",
      back: "Back to users",
    },
    tet: {
      title: "Aumenta Utilizadór Foun",
      name: "Naran Kompletu",
      email: "Enderesu Email",
      sections: "Asesu Seksaun",
      sectionsHint: "Marka seksaun hotu ne'ebé utilizadór ida ne'e bele jere.",
      selectAll: "Hili hotu",
      clearAll: "Hasai hotu",
      save: "Kria Utilizadór",
      cancel: "Kansela",
      saving: "Kria hela…",
      namePlaceholder: "ex: Maria da Silva",
      emailPlaceholder: "ex: maria@lafaek.tl",
      note: "Utilizadór sei simu email husi Cognito atu define password.",
      noSections: "Favór hili seksaun ida minimu.",
      back: "Fila ba lista",
    },
  }[L]

  function togglePermission(p: SectionPermission) {
    setPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (permissions.length === 0) {
      setError(t.noSections)
      return
    }
    setError("")
    setSaving(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, permissions }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push("/admin/users")
      } else {
        setError(data.error || "Failed to create user")
      }
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminGuard allowedRoles={["SuperAdmin"]}>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-2xl px-4 py-10">
          <header className="mb-8">
            <Link
              href="/admin/users"
              className="mb-3 inline-block text-sm text-slate-500 hover:text-slate-700"
            >
              ← {t.back}
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          </header>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t.name}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#219653]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#219653]/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    {t.sections}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPermissions([...ALL_PERMISSIONS])}
                      className="text-xs text-[#219653] hover:underline"
                    >
                      {t.selectAll}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermissions([])}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      {t.clearAll}
                    </button>
                  </div>
                </div>
                <p className="mb-3 text-xs text-slate-500">{t.sectionsHint}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ALL_PERMISSIONS.map((p) => (
                    <label
                      key={p}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                        permissions.includes(p)
                          ? "border-[#219653] bg-green-50 text-[#219653]"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#219653]"
                        checked={permissions.includes(p)}
                        onChange={() => togglePermission(p)}
                      />
                      {PERMISSION_LABELS[p]}
                    </label>
                  ))}
                </div>
              </div>

              <p className="rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700">
                {t.note}
              </p>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#219653] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c7f45] disabled:opacity-60"
                >
                  {saving ? t.saving : t.save}
                </button>
                <Link
                  href="/admin/users"
                  className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </Link>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AdminGuard>
  )
}
