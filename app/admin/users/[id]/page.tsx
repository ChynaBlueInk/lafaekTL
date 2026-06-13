"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"
import AdminGuard from "@/components/AdminGuard"
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  type SectionPermission,
  type UserStatus,
} from "@/lib/roles"

type UserRecord = {
  userId: string
  email: string
  name: string
  permissions: SectionPermission[]
  status: UserStatus
  createdAt: string
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { language } = useLanguage()
  const L = language === "tet" ? "tet" : "en"

  const [user, setUser] = useState<UserRecord | null>(null)
  const [name, setName] = useState("")
  const [permissions, setPermissions] = useState<SectionPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [saveError, setSaveError] = useState("")

  const t = {
    en: {
      title: "Edit User",
      email: "Email Address",
      name: "Full Name",
      sections: "Section Access",
      sectionsHint: "Tick all sections this user can manage.",
      selectAll: "Select all",
      clearAll: "Clear all",
      status: "Account Status",
      active: "Active",
      disabled: "Disabled",
      addedOn: "Added on",
      save: "Save Changes",
      cancel: "Cancel",
      saving: "Saving…",
      loading: "Loading user…",
      back: "Back to users",
      noSections: "Please select at least one section.",
    },
    tet: {
      title: "Edit Utilizadór",
      email: "Enderesu Email",
      name: "Naran Kompletu",
      sections: "Asesu Seksaun",
      sectionsHint: "Marka seksaun hotu ne'ebé utilizadór ida ne'e bele jere.",
      selectAll: "Hili hotu",
      clearAll: "Hasai hotu",
      status: "Estadu Konta",
      active: "Ativu",
      disabled: "Desativadu",
      addedOn: "Aumenta iha",
      save: "Rai Mudansa",
      cancel: "Kansela",
      saving: "Rai hela…",
      loading: "Karga utilizadór…",
      back: "Fila ba lista",
      noSections: "Favór hili seksaun ida minimu.",
    },
  }[L]

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user)
          setName(data.user.name)
          setPermissions(data.user.permissions || [])
        } else {
          setFetchError(data.error || "Failed to load user")
        }
      })
      .catch(() => setFetchError("Network error"))
      .finally(() => setLoading(false))
  }, [userId])

  function togglePermission(p: SectionPermission) {
    setPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (permissions.length === 0) {
      setSaveError(t.noSections)
      return
    }
    setSaveError("")
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, permissions }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push("/admin/users")
      } else {
        setSaveError(data.error || "Failed to save changes")
      }
    } catch {
      setSaveError("Network error")
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

          {loading ? (
            <p className="text-slate-500">{t.loading}</p>
          ) : fetchError ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {fetchError}
            </p>
          ) : user ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t.email}
                  </label>
                  <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t.status}
                  </label>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? t.active : t.disabled}
                  </span>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {t.addedOn}{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {saveError && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
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
          ) : null}
        </main>
      </div>
    </AdminGuard>
  )
}
