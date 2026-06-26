"use client"

import { useEffect, useMemo, useState, ChangeEvent } from "react"
import AdminGuard from "@/components/AdminGuard"
import { useLanguage } from "@/lib/LanguageContext"
import { getUserDisplayName, getUserEmail } from "@/lib/auth"
import {
  Upload,
  PlayCircle,
  MapPin,
  Layers3,
  Video,
  CheckCircle2,
  Eye,
  Trash2,
  Archive,
  FileVideo,
} from "lucide-react"
import {parseVideoUrl, getVideoPlatformLabel} from "@/lib/video-embed"

const S3_ORIGIN = "https://lafaek-media.s3.ap-southeast-2.amazonaws.com"

type RevistaStatus = "draft" | "published" | "hidden" | "archived"

type RevistaMediaItem = {
  id: string
  status: RevistaStatus
  order: number
  visible: boolean
  title: string
  description: string
  section: string
  municipality: string
  s3Key: string
  videoUrl?: string
  createdAt?: string
  createdBy?: {sub?: string; email?: string; fullName?: string}
  updatedAt?: string
  updatedBy?: {sub?: string; email?: string; fullName?: string}
  updatedByGroups?: string[]
  [key: string]: any
}

type ApiResponse = {
  ok: boolean
  items: any[]
  error?: string
}

type PresignResponse = {
  url: string
  fields: Record<string, string>
  key?: string
  publicUrl?: string
  error?: string
}

const sectionOptions = [
  "Community",
  "Children",
  "Journalista",
  "Learning",
  "Meet the Team",
  "In the Field",
  "Stories",
  "Events",
  "Other",
]

const municipalityOptions = [
  "Dili",
  "Aileu",
  "Ainaro",
  "Ataúro",
  "Baucau",
  "Bobonaro",
  "Covalima",
  "Ermera",
  "Lautém",
  "Liquiçá",
  "Manatuto",
  "Manufahi",
  "Oecusse",
  "Viqueque",
]

const emptyItem = (): RevistaMediaItem => ({
  id: `revista-temp-${Date.now()}`,
  status: "draft",
  order: 0,
  visible: false,
  title: "",
  description: "",
  section: "Community",
  municipality: "Dili",
  s3Key: "",
  videoUrl: "",
})

function buildVideoUrl(src?: string) {
  if (!src) return ""
  const clean = src.trim()
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean
  return `${S3_ORIGIN}/${clean.replace(/^\/+/, "")}`
}

function safeStatus(raw: any): RevistaStatus {
  const s = typeof raw?.status === "string" ? raw.status.trim().toLowerCase() : ""
  if (s === "draft" || s === "published" || s === "hidden" || s === "archived") {
    return s
  }
  const vis = typeof raw?.visible === "boolean" ? raw.visible : false
  return vis ? "published" : "hidden"
}

function getStatusLabel(status: RevistaStatus) {
  if (status === "draft") return "Draft"
  if (status === "published") return "Published"
  if (status === "archived") return "Archived"
  return "Hidden"
}

function getStatusClasses(status: RevistaStatus) {
  if (status === "draft") return "border-amber-200 bg-amber-50 text-amber-900"
  if (status === "published") return "border-emerald-200 bg-emerald-50 text-emerald-900"
  if (status === "archived") return "border-slate-300 bg-slate-100 text-slate-700"
  return "border-blue-200 bg-blue-50 text-blue-900"
}

function getIdTokenFromSessionStorage() {
  if (typeof window === "undefined") return ""
  try {
    const authority = "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
    const clientId = "30g26p9ts1baddag42g747snp3"
    const key = `oidc.user:${authority}:${clientId}`
    const raw = sessionStorage.getItem(key)
    if (!raw) return ""
    const parsed = JSON.parse(raw)
    return typeof parsed?.id_token === "string" ? parsed.id_token.trim() : ""
  } catch {
    return ""
  }
}

function getOidcProfile() {
  if (typeof window === "undefined") return null
  try {
    const authority = "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
    const clientId = "30g26p9ts1baddag42g747snp3"
    const key = `oidc.user:${authority}:${clientId}`
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.profile || null
  } catch {
    return null
  }
}

function getUserSub() {
  const p = getOidcProfile()
  return typeof p?.sub === "string" ? p.sub : ""
}

function getUserGroups() {
  const p = getOidcProfile()
  const raw = p?.["cognito:groups"]
  if (Array.isArray(raw)) return raw.map((x) => String(x))
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean)
  }
  return []
}

function formatLastUpdated(item: RevistaMediaItem) {
  const name = typeof item.updatedBy?.fullName === "string" ? item.updatedBy.fullName.trim() : ""
  const email = typeof item.updatedBy?.email === "string" ? item.updatedBy.email.trim() : ""
  const who = name || email
  const stampRaw = typeof item.updatedAt === "string" ? item.updatedAt : ""
  const stamp = stampRaw ? new Date(stampRaw).toLocaleString() : ""
  if (!who && !stamp) return ""
  if (who && stamp) return `${who} • ${stamp}`
  return who || stamp
}

export default function RevistaMediaAdminPage() {
  const { language } = useLanguage()
  const L = language === "tet" ? "tet" : "en"

  const labels = {
    en: {
      heading: "Videos Admin",
      intro: "Upload, review, and manage short videos before they go public.",
      addNew: "+ Add New",
      saveChanges: "Save Changes",
      saving: "Saving...",
      unsaved: "Unsaved changes",
      uploadVideo: "Upload video",
      uploading: "Uploading...",
      uploadReminder: "Paste a YouTube or TikTok URL in the Video URL field, then click Save Changes.",
      titleRequired: "Add a title before publishing.",
      videoRequired: "Upload a video before publishing.",
      saveSuccess: "Changes saved successfully.",
      saveFailed: "Failed to save changes.",
      leaveWarning: "You have unsaved changes. Leave this page and lose them?",
      noItems: "No videos found yet.",
      loading: "Loading videos...",
      clearFilters: "Clear filters",
      showKeys: "Show S3 keys",
      publishConfirm: "Publish this video? It will become visible on the public page after you Save Changes.",
      archiveConfirm: "Archive this video? It will stay in AWS but won’t show on the public site.",
      unarchiveConfirm: "Unarchive this video? It will return as Hidden until you make it Visible.",
      deleteConfirm: "Delete this video?",
      addModalText: "Create the record first, then upload the video and click Save Changes on the main page.",
      addVideoCreated: "Video record created locally. Click Save Changes to publish the update to AWS.",
      uploadSuccess: "Video uploaded. Click Save Changes.",
      removeSuccess: "Video removed. Click Save Changes.",
      archived: "Archived. Click Save Changes.",
      unarchived: "Unarchived to Hidden. Click Save Changes.",
      published: "Marked as Published. Click Save Changes.",
      total: "Total",
      visible: "Visible",
      drafts: "Drafts",
      orderUpdated: "Order updated. Click Save Changes.",
    },
    tet: {
      heading: "Admin Vídeu sira",
      intro: "Upload, haree, no jere vídeu badak sira molok sai públiku.",
      addNew: "+ Aumenta Foun",
      saveChanges: "Rai Mudansa sira",
      saving: "Hein hela rai...",
      unsaved: "Mudansa seidauk rai",
      uploadVideo: "Upload vídeu",
      uploading: "Hein hela upload...",
      uploadReminder: "Kola URL YouTube ka TikTok iha kampu Video URL, depois Rai Mudansa.",
      titleRequired: "Hatama titulu molok publika.",
      videoRequired: "Upload vídeu molok publika.",
      saveSuccess: "Mudansa sira rai ho susesu.",
      saveFailed: "La konsege rai mudansa sira.",
      leaveWarning: "Ita iha mudansa seidauk rai. Sai husi pájina no lakon sira?",
      noItems: "Seidauk iha vídeu ida.",
      loading: "Hein hela vídeu sira...",
      clearFilters: "Hamós filtro sira",
      showKeys: "Hatudu S3 keys",
      publishConfirm: "Publika vídeu ida ne'e? Sei sai iha pájina públika depois ita Rai Mudansa.",
      archiveConfirm: "Arkiva vídeu ida ne'e? Sei hela iha AWS maibé la sai iha pájina públika.",
      unarchiveConfirm: "Hasai husi arkivu? Sei fila ba Hidden to'o ita halo Visible.",
      deleteConfirm: "Hamos vídeu ida ne'e?",
      addModalText: "Kria rekord uluk, depois upload vídeu no Rai Mudansa iha pájina boot.",
      addVideoCreated: "Rekord vídeu kria lokalmente. Klik Rai Mudansa atu publika ba AWS.",
      uploadSuccess: "Vídeu upload ona. Klik Rai Mudansa.",
      removeSuccess: "Vídeu hasai ona. Klik Rai Mudansa.",
      archived: "Arkiva ona. Klik Rai Mudansa.",
      unarchived: "Fila ba Hidden. Klik Rai Mudansa.",
      published: "Marka hanesan Published. Klik Rai Mudansa.",
      total: "Totál",
      visible: "Visible",
      drafts: "Draft",
      orderUpdated: "Ordem muda ona. Klik Rai Mudansa.",
    },
  }[L]

  const [items, setItems] = useState<RevistaMediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [message, setMessage] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState<RevistaMediaItem>(emptyItem())

  const [uploadingId, setUploadingId] = useState<string | undefined>()

  const [query, setQuery] = useState("")
  const [showKeys, setShowKeys] = useState(false)
  const [filterMode, setFilterMode] = useState<"all" | "visible" | "hidden">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | RevistaStatus>("all")
  const [municipalityFilter, setMunicipalityFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [sortMode, setSortMode] = useState<"editor" | "latest" | "oldest" | "az">("editor")

  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(undefined)

        const res = await fetch("/api/admin/revista-media", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error(`Failed to load videos: ${res.status}`)
        }

        const data: ApiResponse = await res.json()

        if (!data.ok) {
          throw new Error(data.error || "Unknown error from Videos API")
        }

        const normalised: RevistaMediaItem[] = (data.items || []).map((raw: any, index: number) => {
          const status = safeStatus(raw)
          return {
            id: typeof raw.id === "string" ? raw.id : `revista-item-${index}`,
            status,
            order: typeof raw.order === "number" ? raw.order : index + 1,
            visible: typeof raw.visible === "boolean" ? raw.visible : status === "published",
            title: typeof raw.title === "string" ? raw.title : "",
            description: typeof raw.description === "string" ? raw.description : "",
            section: typeof raw.section === "string" ? raw.section : "In the Field",
            municipality: typeof raw.municipality === "string" ? raw.municipality : "Dili",
            s3Key: typeof raw.s3Key === "string" ? raw.s3Key : "",
            videoUrl: typeof raw.videoUrl === "string" ? raw.videoUrl : "",
            createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
            createdBy: raw.createdBy,
            updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
            updatedBy: raw.updatedBy,
            updatedByGroups: Array.isArray(raw.updatedByGroups) ? raw.updatedByGroups : undefined,
          }
        })

        normalised.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setItems(normalised)
      } catch (err: any) {
        setError(err?.message || "Error loading videos")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasChanges) return
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasChanges])

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!hasChanges) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest("a") as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute("href") || ""
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return

      const isModifiedClick =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0

      if (isModifiedClick || anchor.target === "_blank" || anchor.hasAttribute("download")) return

      const confirmed = window.confirm(labels.leaveWarning)
      if (!confirmed) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener("click", handleDocumentClick, true)
    return () => {
      document.removeEventListener("click", handleDocumentClick, true)
    }
  }, [hasChanges, labels.leaveWarning])

  const markChanged = (id?: string) => {
    if (!hasChanges) {
      setHasChanges(true)
    }
    if (id) {
      setDirtyIds((prev) => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
    }
  }

  const handleFieldChange = (
    id: string,
    field: keyof RevistaMediaItem,
    value: string | boolean | number
  ) => {
    setItems((prev) => {
      const next = [...prev]
      const index = next.findIndex((i) => i.id === id)
      if (index === -1) return prev
      const current = next[index]
      if (!current) return prev

      if (field === "visible") {
        const vis = Boolean(value)
        let nextStatus = current.status

        if (vis) {
          nextStatus = "published"
        } else if (current.status === "published") {
          nextStatus = "hidden"
        }

        next[index] = {...current, visible: vis, status: nextStatus}
        return next
      }

      if (field === "status") {
        const s = value as RevistaStatus
        next[index] = {
          ...current,
          status: s,
          visible: s === "published",
        }
        return next
      }

      next[index] = {...current, [field]: value}
      return next
    })

    markChanged(id)
  }

  const handleReorder = (id: string, delta: number) => {
    setItems((prev) => {
      const next = [...prev]
      const index = next.findIndex((i) => i.id === id)
      if (index === -1) return prev

      const targetIndex = index + delta
      if (targetIndex < 0 || targetIndex >= next.length) return prev

      const current = next[index]
      const target = next[targetIndex]
      if (!current || !target) return prev

      const currentOrder = current.order
      next[index] = {...current, order: target.order}
      next[targetIndex] = {...target, order: currentOrder}
      next.sort((a, b) => a.order - b.order)
      return next
    })

    markChanged(id)
    setMessage(labels.orderUpdated)
  }

  const handleAddNew = () => {
    setNewItem(emptyItem())
    setShowAddModal(true)
    setMessage("")
    setError(undefined)
  }

  const handleAddNewSubmit = () => {
    setItems((prev) => {
      // Insert at top: give new item order 1, shift everything else down
      const itemToAdd = {
        ...newItem,
        id: `revista-temp-${Date.now()}`,
        status: newItem.status || "draft",
        visible: Boolean(newItem.visible),
        order: 1,
      } as RevistaMediaItem
      const shifted = prev.map((i) => ({...i, order: (i.order || 0) + 1}))
      return [itemToAdd, ...shifted]
    })

    setShowAddModal(false)
    setHasChanges(true)
    setMessage(labels.addVideoCreated)
  }

  const handleDelete = (id: string) => {
    if (!window.confirm(labels.deleteConfirm)) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    markChanged(id)
  }

  const handleArchive = (id: string) => {
    if (!window.confirm(labels.archiveConfirm)) return
    handleFieldChange(id, "status", "archived")
    handleFieldChange(id, "visible", false)
    setMessage(labels.archived)
  }

  const handleUnarchive = (id: string) => {
    if (!window.confirm(labels.unarchiveConfirm)) return
    handleFieldChange(id, "status", "hidden")
    handleFieldChange(id, "visible", false)
    setMessage(labels.unarchived)
  }

  const handlePublish = (id: string) => {
    const item = items.find((x) => x.id === id)
    if (!item?.title.trim()) {
      setMessage(labels.titleRequired)
      return
    }
    if (!item?.videoUrl?.trim()) {
      setMessage(labels.videoRequired)
      return
    }
    if (!window.confirm(labels.publishConfirm)) return
    handleFieldChange(id, "status", "published")
    handleFieldChange(id, "visible", true)
    setMessage(labels.published)
  }

  const handleRemoveVideo = (id: string) => {
    if (!window.confirm(labels.deleteConfirm)) return

    setItems((prev) => {
      const next = [...prev]
      const index = next.findIndex((i) => i.id === id)
      if (index === -1) return prev
      const current = next[index]
      if (!current) return prev
      next[index] = {...current, videoUrl: "", visible: false, status: current.status === "published" ? "hidden" : current.status}
      return next
    })

    markChanged(id)
    setMessage(labels.removeSuccess)
  }

  const handleVideoUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id)
      setMessage("")
      setError(undefined)

      const presignRes = await fetch("/api/uploads/s3/presign", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          folder: "revista-media",
          fileName: file.name,
          contentType: file.type,
        }),
      })

      if (!presignRes.ok) {
        throw new Error(`Failed to get presigned data: ${presignRes.status}`)
      }

      const presignData: PresignResponse = await presignRes.json()
      if (presignData.error) {
        throw new Error(presignData.error)
      }

      const url = presignData.url
      const fields = presignData.fields
      const s3Key = presignData.key || fields.key

      if (!url || !fields || !s3Key) {
        throw new Error("Invalid presign response from server")
      }

      const formData = new FormData()
      Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v)
      })
      formData.append("file", file)

      const uploadRes = await fetch(url, {method: "POST", body: formData})
      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status ${uploadRes.status}`)
      }

      setItems((prev) => {
        const next = [...prev]
        const index = next.findIndex((i) => i.id === id)
        if (index === -1) return prev
        const current = next[index]
        if (!current) return prev
        next[index] = {
          ...current,
          s3Key,
          videoUrl: presignData.publicUrl || s3Key,
        }
        return next
      })

      markChanged(id)
      setMessage(labels.uploadSuccess)
    } catch (err: any) {
      setError(err?.message || "Error uploading video")
    } finally {
      setUploadingId(undefined)
    }
  }

  const handleFileInputChange = (id: string, evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (!file) {
      evt.target.value = ""
      return
    }
    void handleVideoUpload(id, file)
    evt.target.value = ""
  }

  const handleSaveChanges = async () => {
    try {
      setSaving(true)
      setMessage("")
      setError(undefined)

      const now = new Date().toISOString()
      const fullName = getUserDisplayName()
      const email = getUserEmail()
      const sub = getUserSub()
      const groups = getUserGroups()

      const itemsToSave = items.map((it) => {
        if (dirtyIds.has(it.id)) {
          return {
            ...it,
            updatedAt: now,
            updatedBy: {
              sub: sub || it.updatedBy?.sub || "",
              email: email || it.updatedBy?.email || "",
              fullName: fullName || it.updatedBy?.fullName || "",
            },
            updatedByGroups: groups.length ? groups : it.updatedByGroups,
          }
        }
        return it
      })

      const payload = {items: itemsToSave}

      const idToken = getIdTokenFromSessionStorage()

      if (!idToken) {
        throw new Error("No sign-in token found. Please sign in again.")
      }

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({idToken}),
        credentials: "include",
        cache: "no-store",
      })

      if (!sessionRes.ok) {
        const sessionData = await sessionRes.json().catch(() => null)
        throw new Error(sessionData?.error || "Could not refresh sign-in session. Please sign in again.")
      }

      const res = await fetch("/api/admin/revista-media", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || `Failed to save: ${res.status}`)
      }

      if (!data?.ok) {
        throw new Error(data?.error || labels.saveFailed)
      }

      setHasChanges(false)
      setDirtyIds(new Set())
      setMessage(labels.saveSuccess)
    } catch (err: any) {
      setError(err?.message || labels.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = useMemo(() => {
    let list = [...items]

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((i) => {
        const haystack = [
          i.title,
          i.description,
          i.section,
          i.municipality,
          i.s3Key,
        ]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase())

        return haystack.some((f) => f.includes(q))
      })
    }

    if (filterMode === "visible") {
      list = list.filter((i) => i.visible === true)
    } else if (filterMode === "hidden") {
      list = list.filter((i) => i.visible === false)
    }

    if (statusFilter !== "all") {
      list = list.filter((i) => i.status === statusFilter)
    }

    if (municipalityFilter !== "all") {
      list = list.filter((i) => i.municipality === municipalityFilter)
    }

    if (sectionFilter !== "all") {
      list = list.filter((i) => i.section === sectionFilter)
    }

    list.sort((a, b) => {
      if (sortMode === "latest") {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return db - da
      }

      if (sortMode === "oldest") {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return da - db
      }

      if (sortMode === "az") {
        return String(a.title || "").localeCompare(String(b.title || ""))
      }

      return (a.order ?? 0) - (b.order ?? 0)
    })

    return list
  }, [items, query, filterMode, statusFilter, municipalityFilter, sectionFilter, sortMode])

  const totalVisible = useMemo(() => items.filter((i) => i.visible).length, [items])
  const totalDrafts = useMemo(() => items.filter((i) => i.status === "draft").length, [items])

  return (
    <AdminGuard allowedRoles={["Admin", "ContentEditor", "MagazineAdmin", "Communications"]}>
      <div className="min-h-screen bg-slate-50 px-4 pb-8">
        <div className="sticky top-28 z-30 -mx-4 mb-6 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:top-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{labels.heading}</h1>
                <p className="mt-1 text-sm text-slate-600">{labels.intro}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                >
                  {labels.addNew}
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || saving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? labels.saving : labels.saveChanges}
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full flex-col gap-2 md:w-[44rem] md:flex-row md:items-center">
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Search title, description, section, municipality…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={showKeys}
                    onChange={(e) => setShowKeys(e.target.checked)}
                  />
                  {labels.showKeys}
                </label>
              </div>

              {hasChanges && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {labels.unsaved}
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value as "all" | "visible" | "hidden")}
                  >
                    <option value="all">All</option>
                    <option value="visible">Visible only</option>
                    <option value="hidden">Hidden only</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | RevistaStatus)}
                  >
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4" />
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                  >
                    <option value="all">All sections</option>
                    {sectionOptions.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={municipalityFilter}
                    onChange={(e) => setMunicipalityFilter(e.target.value)}
                  >
                    <option value="all">All municipalities</option>
                    {municipalityOptions.map((municipality) => (
                      <option key={municipality} value={municipality}>
                        {municipality}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as "editor" | "latest" | "oldest" | "az")}
                  >
                    <option value="editor">Editor order</option>
                    <option value="latest">Latest updated</option>
                    <option value="oldest">Oldest updated</option>
                    <option value="az">Title A–Z</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  setFilterMode("all")
                  setStatusFilter("all")
                  setMunicipalityFilter("all")
                  setSectionFilter("all")
                  setSortMode("editor")
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {labels.clearFilters}
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-600">
              {labels.total}: <span className="font-semibold">{items.length}</span>
              {" "}• {labels.visible}: <span className="font-semibold">{totalVisible}</span>
              {" "}• {labels.drafts}: <span className="font-semibold">{totalDrafts}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          {hasChanges && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {labels.uploadReminder}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
              {message}
            </div>
          )}

          {loading && (
            <div className="text-sm text-slate-600">{labels.loading}</div>
          )}

          {error && !loading && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && filteredItems.length === 0 && !error && (
            <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
              {labels.noItems}
            </div>
          )}

          {!loading && filteredItems.length > 0 && (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const videoSrc = buildVideoUrl(item.videoUrl || item.s3Key)
                const statusLabel = getStatusLabel(item.status)
                const lastUpdated = formatLastUpdated(item)

                const isExpanded = expandedIds.has(item.id)

                return (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">

                    {/* ── Collapsed summary row ─────────────────────── */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                    >
                      {/* Order + arrows */}
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                        {item.order}
                      </span>
                      <div className="flex shrink-0 flex-col gap-0.5">
                        <button type="button" onClick={(e)=>{e.stopPropagation();handleReorder(item.id,-1)}} className="rounded border border-slate-300 px-1 text-[10px] leading-tight hover:bg-slate-100">↑</button>
                        <button type="button" onClick={(e)=>{e.stopPropagation();handleReorder(item.id,1)}} className="rounded border border-slate-300 px-1 text-[10px] leading-tight hover:bg-slate-100">↓</button>
                      </div>
                      {/* Status badge */}
                      <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusClasses(item.status)}`}>
                        {statusLabel}
                      </span>
                      {/* Title + meta */}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {item.title || <span className="italic text-slate-400">No title</span>}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.section} &middot; {item.municipality}{item.videoUrl ? " • ▶ Video" : ""}
                        </span>
                      </div>
                      {/* Chevron */}
                      <span className="shrink-0 text-slate-400">{isExpanded ? "▲" : "▼"}</span>
                    </button>

                    {/* ── Expanded body ─────────────────────────────── */}
                    {isExpanded && (
                    <div className="border-t border-slate-100">
                    <div className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300"
                              checked={item.visible}
                              onChange={(e) => handleFieldChange(item.id, "visible", e.target.checked)}
                              disabled={item.status === "archived" || item.status === "draft"}
                            />
                            <span>Visible</span>
                          </label>

                          {item.status === "draft" && (
                            <button
                              type="button"
                              onClick={() => handlePublish(item.id)}
                              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                            >
                              Publish draft
                            </button>
                          )}

                          {item.status === "archived" ? (
                            <button
                              type="button"
                              onClick={() => handleUnarchive(item.id)}
                              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Unarchive
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleArchive(item.id)}
                              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Archive
                            </button>
                          )}
                        </div>

                        {lastUpdated && (
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                            <span className="font-semibold">Last updated:</span> {lastUpdated}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                              value={item.title}
                              onChange={(e) => handleFieldChange(item.id, "title", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Section</label>
                            <select
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                              value={item.section}
                              onChange={(e) => handleFieldChange(item.id, "section", e.target.value)}
                            >
                              {sectionOptions.map((section) => (
                                <option key={section} value={section}>
                                  {section}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Municipality</label>
                            <select
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                              value={item.municipality}
                              onChange={(e) => handleFieldChange(item.id, "municipality", e.target.value)}
                            >
                              {municipalityOptions.map((municipality) => (
                                <option key={municipality} value={municipality}>
                                  {municipality}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2 lg:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                            <textarea
                              rows={4}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                              value={item.description}
                              onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full space-y-4 md:w-[24rem]">
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Video URL</span>
                            {item.videoUrl && (
                              <a
                                href={item.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-700 underline"
                              >
                                Open
                              </a>
                            )}
                          </div>

                          <input
                            type="url"
                            className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400"
                            placeholder="Paste YouTube or TikTok URL…"
                            value={item.videoUrl || ""}
                            onChange={(e) => handleFieldChange(item.id, "videoUrl", e.target.value)}
                          />

                          {item.videoUrl && (() => {
                            const parsed = parseVideoUrl(item.videoUrl)
                            const platform = getVideoPlatformLabel(item.videoUrl)
                            if (parsed) {
                              return (
                                <div className="mb-3 space-y-2">
                                  <div className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                                    ✓ {platform} video detected
                                  </div>
                                  <iframe
                                    src={parsed.embedUrl}
                                    className="h-52 w-full rounded-md border border-slate-200"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    title={item.title || "Video preview"}
                                  />
                                </div>
                              )
                            }
                            return (
                              <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                URL entered but not recognised as YouTube or TikTok. Check the link and try again.
                              </div>
                            )
                          })()}

                          {item.videoUrl && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(item.id)}
                              className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              Clear URL
                            </button>
                          )}
                        </div>

                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-slate-900">{labels.addNew}</h2>
                <p className="mt-1 text-sm text-slate-600">{labels.addModalText}</p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={newItem.title}
                      onChange={(e) => setNewItem((prev) => ({...prev, title: e.target.value}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Section</label>
                    <select
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={newItem.section}
                      onChange={(e) => setNewItem((prev) => ({...prev, section: e.target.value}))}
                    >
                      {sectionOptions.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Municipality</label>
                    <select
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={newItem.municipality}
                      onChange={(e) => setNewItem((prev) => ({...prev, municipality: e.target.value}))}
                    >
                      {municipalityOptions.map((municipality) => (
                        <option key={municipality} value={municipality}>
                          {municipality}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={newItem.description}
                      onChange={(e) => setNewItem((prev) => ({...prev, description: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setNewItem(emptyItem())
                    }}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewSubmit}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Add Video
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}