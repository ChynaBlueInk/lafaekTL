// lib/roles.ts
import { getUserGroupsFromSessionStorage } from "@/lib/auth"

// One permission per admin section.
export type SectionPermission =
  | "magazine"
  | "learning"
  | "impact"
  | "news"
  | "team"
  | "videos"
  | "careers"
  | "reports"
  | "books"

export const ALL_PERMISSIONS: SectionPermission[] = [
  "magazine",
  "learning",
  "impact",
  "news",
  "team",
  "videos",
  "careers",
  "reports",
  "books",
]

export const PERMISSION_LABELS: Record<SectionPermission, string> = {
  magazine: "Magazine",
  learning: "Learning",
  impact: "Impact Stories",
  news: "News",
  team: "Our Team",
  videos: "Videos",
  careers: "Careers",
  reports: "Reports",
  books: "Books",
}

// Each permission maps to a dedicated Cognito group.
// Existing groups (MagazineAdmin, ImpactStoryContributor, Learning) are reused.
// New groups (News, OurTeam, Videos, Careers, Reports, Books) need to be created
// in the Cognito User Pool once.
export const PERMISSION_TO_COGNITO_GROUP: Record<SectionPermission, string> = {
  magazine: "MagazineAdmin",
  learning: "Learning",
  impact: "ImpactStoryContributor",
  news: "News",
  team: "OurTeam",
  videos: "Videos",
  careers: "Careers",
  reports: "Reports",
  books: "Books",
}

export type UserStatus = "active" | "disabled"

export interface UserRoleRecord {
  userId: string
  email: string
  name: string
  // permissions replaces the old single `role` field
  permissions: SectionPermission[]
  status: UserStatus
  createdAt: string
}

// ── Client-side helpers ─────────────────────────────────────────────────────

export function isSuperAdmin(): boolean {
  const groups = getUserGroupsFromSessionStorage()
  return groups.map((g) => g.toLowerCase()).includes("superadmin")
}

export function hasPermission(permission: SectionPermission): boolean {
  if (isSuperAdmin()) return true
  const groups = getUserGroupsFromSessionStorage().map((g) => g.toLowerCase())
  const group = PERMISSION_TO_COGNITO_GROUP[permission].toLowerCase()
  return groups.includes(group)
}

export function canAccessSection(permission: SectionPermission): boolean {
  return hasPermission(permission)
}
