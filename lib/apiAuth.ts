// lib/apiAuth.ts
// Server-side helper for verifying caller identity in API routes.
import { createRemoteJWKSet, jwtVerify } from "jose"

const COOKIE_NAME = "lafaek_id_token"
const REGION = process.env.AWS_REGION || "ap-southeast-2"
const USER_POOL_ID =
  process.env.COGNITO_USER_POOL_ID || "ap-southeast-2_a70kol0sr"
const CLIENT_ID =
  process.env.COGNITO_CLIENT_ID || "30g26p9ts1baddag42g747snp3"
const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
const JWKS = createRemoteJWKSet(
  new URL(`${ISSUER}/.well-known/jwks.json`)
)

function extractTokenFromCookieHeader(cookieHeader: string): string | null {
  const pairs = cookieHeader.split(";")
  for (const pair of pairs) {
    const [key, ...rest] = pair.trim().split("=")
    if (key.trim() === COOKIE_NAME) {
      return rest.join("=").trim()
    }
  }
  return null
}

export async function getCallerGroups(req: Request): Promise<string[]> {
  const cookieHeader = req.headers.get("cookie") || ""
  const token = extractTokenFromCookieHeader(cookieHeader)
  if (!token) return []

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: CLIENT_ID,
    })
    const groups = (payload as any)?.["cognito:groups"]
    if (Array.isArray(groups)) {
      return groups.map((g) => String(g).toLowerCase())
    }
    if (typeof groups === "string") {
      return groups.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    }
    return []
  } catch {
    return []
  }
}

type AuthOk = { ok: true }
type AuthFail = { ok: false; status: number; error: string }

export async function requireSuperAdmin(
  req: Request
): Promise<AuthOk | AuthFail> {
  const groups = await getCallerGroups(req)
  if (!groups.includes("superadmin")) {
    return { ok: false, status: 403, error: "SuperAdmin access required" }
  }
  return { ok: true }
}
