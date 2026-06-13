"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"
import AdminGuard from "@/components/AdminGuard"
import {
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

const STATUS_CLASSES: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-800",
  disabled: "bg-red-100 text-red-800",
}

export default function UsersPage() {
  const { language } = useLanguage()
  const L = language === "tet" ? "tet" : "en"

  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const t = {
    en: {
      title: "User Management",
      addUser: "Add User",
      searchPlaceholder: "Search by name or email…",
      colName: "Name",
      colEmail: "Email",
      colSections: "Sections",
      colStatus: "Status",
      colActions: "Actions",
      edit: "Edit",
      disable: "Disable",
      enable: "Enable",
      noSections: "No sections",
      noUsers: "No users found.",
      loading: "Loading users…",
      active: "Active",
      disabled: "Disabled",
      confirmDisable: "Disable this user? They will lose access immediately.",
      confirmEnable: "Re-enable this user?",
      back: "Back to Admin Hub",
    },
    tet: {
      title: "Jestaun Utilizadór sira",
      addUser: "Aumenta Utilizadór",
      searchPlaceholder: "Buka naran ka email…",
      colName: "Naran",
      colEmail: "Email",
      colSections: "Seksaun sira",
      colStatus: "Estadu",
      colActions: "Aksaun",
      edit: "Edit",
      disable: "Desativa",
      enable: "Ativa",
      noSections: "Laiha seksaun",
      noUsers: "Laiha utilizadór.",
      loading: "Karga utilizadór sira…",
      active: "Ativu",
      disabled: "Desativadu",
      confirmDisable: "Desativa utilizadór ida ne'e? Sira sei lakon asesu imediatamente.",
      confirmEnable: "Ativa fali utilizadór ida ne'e?",
      back: "Fila ba Admin Hub",
    },
  }[L]

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setUsers(data.users)
        else setError(data.error || "Failed to load users")
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }, [users, search])

  async function toggleStatus(user: UserRecord) {
    const isDisabling = user.status === "active"
    if (!confirm(isDisabling ? t.confirmDisable : t.confirmEnable)) return

    setTogglingId(user.userId)
    const newStatus: UserStatus = isDisabling ? "disabled" : "active"

    try {
      const res = await fetch(`/api/admin/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.userId === user.userId ? { ...u, status: newStatus } : u
          )
        )
      } else {
        alert(data.error || "Failed to update user")
      }
    } catch {
      alert("Network error")
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <AdminGuard allowedRoles={["SuperAdmin"]}>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/admin"
                className="mb-1 inline-block text-sm text-slate-500 hover:text-slate-700"
              >
                ← {t.back}
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
            </div>
            <Link
              href="/admin/users/new"
              className="inline-block rounded-md bg-[#219653] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c7f45]"
            >
              + {t.addUser}
            </Link>
          </header>

          <div className="mb-6">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#219653]/20 sm:max-w-sm"
            />
          </div>

          {loading ? (
            <p className="text-slate-500">{t.loading}</p>
          ) : error ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500">{t.noUsers}</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {[t.colName, t.colEmail, t.colSections, t.colStatus, t.colActions].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((user) => (
                    <tr key={user.userId} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{user.email}</td>
                      <td className="px-5 py-3">
                        {user.permissions.length === 0 ? (
                          <span className="text-xs text-slate-400">{t.noSections}</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((p) => (
                              <span
                                key={p}
                                className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                              >
                                {PERMISSION_LABELS[p]}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[user.status]}`}
                        >
                          {user.status === "active" ? t.active : t.disabled}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/users/${user.userId}`}
                            className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            {t.edit}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleStatus(user)}
                            disabled={togglingId === user.userId}
                            className={`rounded border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                              user.status === "active"
                                ? "border-red-300 text-red-700 hover:bg-red-50"
                                : "border-green-300 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {user.status === "active" ? t.disable : t.enable}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
