// app/api/admin/users/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireSuperAdmin } from "@/lib/apiAuth"
import {
  listUsersFromDynamo,
  createCognitoUser,
  upsertUserInDynamo,
} from "@/lib/userRoles"
import { ALL_PERMISSIONS, type SectionPermission } from "@/lib/roles"

export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  try {
    const users = await listUsersFromDynamo()
    return NextResponse.json({ ok: true, users })
  } catch (err: any) {
    console.error("[api/admin/users] GET error", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load users" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const auth = await requireSuperAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body?.email || !body?.name) {
      return NextResponse.json(
        { ok: false, error: "email and name are required" },
        { status: 400 }
      )
    }

    const permissions: SectionPermission[] = Array.isArray(body.permissions)
      ? body.permissions.filter((p: any) => ALL_PERMISSIONS.includes(p))
      : []

    const userId = await createCognitoUser(body.email, body.name, permissions)

    const record = {
      userId: userId || body.email,
      email: body.email,
      name: body.name,
      permissions,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    }

    await upsertUserInDynamo(record)

    return NextResponse.json({ ok: true, user: record })
  } catch (err: any) {
    console.error("[api/admin/users] POST error", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create user" },
      { status: 500 }
    )
  }
}
