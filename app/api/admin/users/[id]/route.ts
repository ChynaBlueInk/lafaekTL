// app/api/admin/users/[id]/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireSuperAdmin } from "@/lib/apiAuth"
import {
  getUserFromDynamo,
  upsertUserInDynamo,
  updateUserStatusInDynamo,
  syncCognitoPermissions,
  disableCognitoUser,
  enableCognitoUser,
} from "@/lib/userRoles"
import { ALL_PERMISSIONS, type SectionPermission } from "@/lib/roles"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireSuperAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  try {
    const user = await getUserFromDynamo(params.id)
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true, user })
  } catch (err: any) {
    console.error("[api/admin/users/[id]] GET error", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to get user" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireSuperAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ ok: false, error: "Request body required" }, { status: 400 })
    }

    const existing = await getUserFromDynamo(params.id)
    if (!existing) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 })
    }

    // Sync Cognito groups if permissions changed
    if (Array.isArray(body.permissions)) {
      const newPermissions = body.permissions.filter((p: any) =>
        ALL_PERMISSIONS.includes(p)
      ) as SectionPermission[]

      await syncCognitoPermissions(
        existing.email,
        existing.permissions,
        newPermissions
      )

      existing.permissions = newPermissions
    }

    if (body.status && body.status !== existing.status) {
      if (body.status === "disabled") {
        await disableCognitoUser(existing.email)
      } else {
        await enableCognitoUser(existing.email)
      }
      existing.status = body.status
    }

    const updated = {
      ...existing,
      name: typeof body.name === "string" ? body.name.trim() : existing.name,
    }

    await upsertUserInDynamo(updated)

    return NextResponse.json({ ok: true, user: updated })
  } catch (err: any) {
    console.error("[api/admin/users/[id]] PUT error", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update user" },
      { status: 500 }
    )
  }
}

// Soft-delete: disables the Cognito account and marks status in DynamoDB
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireSuperAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  }

  try {
    const existing = await getUserFromDynamo(params.id)
    if (!existing) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 })
    }

    await disableCognitoUser(existing.email)
    await updateUserStatusInDynamo(params.id, "disabled")

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[api/admin/users/[id]] DELETE error", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to disable user" },
      { status: 500 }
    )
  }
}
