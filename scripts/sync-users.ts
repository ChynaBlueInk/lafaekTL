// scripts/sync-users.ts
// One-time script to import existing Cognito users into the UserRoles DynamoDB table.
// Run with: npx tsx scripts/sync-users.ts

import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import * as dotenv from "fs"

// ── config ──────────────────────────────────────────────────────────────────

const REGION = "ap-southeast-2"
const USER_POOL_ID = "ap-southeast-2_a70kol0sr"
const TABLE = "UserRoles"

// Load .env.local manually (tsx doesn't auto-load it)
function loadEnv() {
  try {
    const raw = require("fs").readFileSync(".env.local", "utf-8")
    for (const line of raw.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    // no .env.local — rely on environment
  }
}

loadEnv()

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
}

if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  console.error("❌  AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in .env.local")
  process.exit(1)
}

const cognito = new CognitoIdentityProviderClient({ region: REGION, credentials })
const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION, credentials }),
  { marshallOptions: { removeUndefinedValues: true } }
)

// ── permission mapping ───────────────────────────────────────────────────────
// Maps Cognito group names to the permissions array stored in UserRoles.

type SectionPermission =
  | "magazine" | "learning" | "impact" | "news"
  | "team" | "videos" | "careers" | "reports" | "books"

function groupsToPermissions(groups: string[]): SectionPermission[] {
  const perms = new Set<SectionPermission>()

  for (const g of groups) {
    switch (g.toLowerCase()) {
      case "magazineadmin":
      case "magazine":
        perms.add("magazine")
        break
      case "learning":
        perms.add("learning")
        break
      case "impactstorycontributor":
      case "impact":
        perms.add("impact")
        perms.add("reports")
        break
      case "contenteditor":
        perms.add("news")
        perms.add("videos")
        perms.add("careers")
        break
      case "communications":
        perms.add("news")
        perms.add("videos")
        break
      case "news":
        perms.add("news")
        break
      case "ourteam":
        perms.add("team")
        break
      case "videos":
        perms.add("videos")
        break
      case "careers":
        perms.add("careers")
        break
      case "reports":
        perms.add("reports")
        break
      case "books":
        perms.add("books")
        break
    }
  }

  return Array.from(perms)
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nSyncing Cognito users → DynamoDB table "${TABLE}" …\n`)

  let paginationToken: string | undefined
  let synced = 0
  let skipped = 0

  do {
    const listRes = await cognito.send(
      new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        PaginationToken: paginationToken,
        Limit: 60,
      })
    )

    for (const user of listRes.Users || []) {
      const sub = user.Attributes?.find((a) => a.Name === "sub")?.Value || ""
      const email = user.Attributes?.find((a) => a.Name === "email")?.Value || ""
      const name =
        user.Attributes?.find((a) => a.Name === "name")?.Value ||
        [
          user.Attributes?.find((a) => a.Name === "given_name")?.Value,
          user.Attributes?.find((a) => a.Name === "family_name")?.Value,
        ]
          .filter(Boolean)
          .join(" ") ||
        email

      const username = user.Username || email

      // Get their Cognito groups
      const groupRes = await cognito.send(
        new AdminListGroupsForUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        })
      )

      const groups = (groupRes.Groups || []).map((g) => g.GroupName || "")
      const isSuperAdmin = groups.some(
        (g) => g.toLowerCase() === "superadmin" || g.toLowerCase() === "admin"
      )
      const permissions = isSuperAdmin ? [] : groupsToPermissions(groups)

      if (!isSuperAdmin && permissions.length === 0) {
        console.log(`  ⚠️  Skipped ${email} — no matching admin group (groups: ${groups.join(", ") || "none"})`)
        skipped++
        continue
      }

      // Fall back to username if sub is missing
      const userId = sub || username
      if (!userId) {
        console.log(`  ⚠️  Skipped ${email} — could not determine userId`)
        skipped++
        continue
      }

      const status = user.Enabled === false ? "disabled" : "active"

      const record: any = {
        userId,
        email,
        name,
        permissions,
        status,
        createdAt: user.UserCreateDate?.toISOString() || new Date().toISOString(),
      }

      // SuperAdmins are stored with empty permissions (they get full access via Cognito group)
      if (isSuperAdmin) {
        record.isSuperAdmin = true
      }

      await dynamo.send(new PutCommand({ TableName: TABLE, Item: record }))
      const permLabel = isSuperAdmin ? "SuperAdmin" : permissions.join(", ")
      console.log(`  ✅  ${email} → [${permLabel}] (${status})`)
      synced++
    }

    paginationToken = listRes.PaginationToken
  } while (paginationToken)

  console.log(`\nDone. ${synced} synced, ${skipped} skipped.\n`)
}

main().catch((err) => {
  console.error("❌  Error:", err?.message || err)
  process.exit(1)
})
