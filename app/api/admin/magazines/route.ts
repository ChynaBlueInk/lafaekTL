export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

const REGION = process.env.AWS_REGION || "ap-southeast-2"
const BUCKET = process.env.AWS_S3_BUCKET
const MAG_JSON_KEY = process.env.AWS_S3_MAGAZINES_JSON_KEY || "content/magazines.json"

const s3 = new S3Client({
  region: REGION,
  credentials: BUCKET
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      }
    : undefined,
})

type Series = "LK" | "LBK" | "LP" | "LM"
type MagazineLanguage = "Tetun" | "English" | "Tetun + English"
type AccessType = "public" | "approval_required" | "private"

type AdminMagazine = {
  id: string
  code: string
  series: Series
  year: string
  issue: string
  titleEn?: string
  titleTet?: string
  description?: string
  category?: string
  language?: MagazineLanguage
  coverImage?: string
  pdfKey?: string
  samplePages?: string[]
  accessType?: AccessType
  visible?: boolean
  createdAt?: string
  createdBy?: {
    sub?: string
    email?: string
    fullName?: string
  }
  updatedAt?: string
  updatedBy?: {
    sub?: string
    email?: string
    fullName?: string
  }
  updatedByGroups?: string[]
}

function safeSeries(raw: any): Series {
  const s = String(raw ?? "").trim()
  return s === "LK" || s === "LBK" || s === "LP" || s === "LM" ? s : "LK"
}

function safeLanguage(raw: any): MagazineLanguage {
  const value = String(raw ?? "").trim()
  if (value === "English" || value === "Tetun + English") {
    return value
  }
  return "Tetun"
}

function safeAccessType(raw: any): AccessType {
  const value = String(raw ?? "").trim()
  if (value === "approval_required" || value === "private") {
    return value
  }
  return "public"
}

function deriveFromCode(codeRaw: string): {series: Series; issue: string; year: string} {
  const code = String(codeRaw || "").trim()
  const [seriesRaw, issueRaw = "", yearRaw = ""] = code.split("-")

  return {
    series: safeSeries(seriesRaw),
    issue: String(issueRaw || "").trim(),
    year: String(yearRaw || "").trim(),
  }
}

function normaliseMagazine(raw: any, index: number): AdminMagazine | null {
  const code = String(raw?.code ?? "").trim()
  if (!code) {
    return null
  }

  const derived = deriveFromCode(code)

  const samplePages = Array.isArray(raw?.samplePages)
    ? raw.samplePages.map((p: any) => String(p ?? "").trim()).filter(Boolean)
    : []

  return {
    id: String(raw?.id || `mag-${index}`),
    code,
    series: safeSeries(raw?.series ?? derived.series),
    year: String(raw?.year ?? derived.year ?? "").trim(),
    issue: String(raw?.issue ?? derived.issue ?? "").trim(),
    titleEn: raw?.titleEn ? String(raw.titleEn).trim() : "",
    titleTet: raw?.titleTet ? String(raw.titleTet).trim() : "",
    description: raw?.description ? String(raw.description).trim() : "",
    category: raw?.category ? String(raw.category).trim() : "",
    language: safeLanguage(raw?.language),
    coverImage: raw?.coverImage ? String(raw.coverImage).trim() : "",
    pdfKey: raw?.pdfKey ? String(raw.pdfKey).trim() : "",
    samplePages,
    accessType: safeAccessType(raw?.accessType),
    visible: raw?.visible !== false,
    createdAt: raw?.createdAt ? String(raw.createdAt).trim() : "",
    createdBy: raw?.createdBy
      ? {
          sub: raw.createdBy?.sub ? String(raw.createdBy.sub).trim() : "",
          email: raw.createdBy?.email ? String(raw.createdBy.email).trim() : "",
          fullName: raw.createdBy?.fullName ? String(raw.createdBy.fullName).trim() : "",
        }
      : undefined,
    updatedAt: raw?.updatedAt ? String(raw.updatedAt).trim() : "",
    updatedBy: raw?.updatedBy
      ? {
          sub: raw.updatedBy?.sub ? String(raw.updatedBy.sub).trim() : "",
          email: raw.updatedBy?.email ? String(raw.updatedBy.email).trim() : "",
          fullName: raw.updatedBy?.fullName ? String(raw.updatedBy.fullName).trim() : "",
        }
      : undefined,
    updatedByGroups: Array.isArray(raw?.updatedByGroups)
      ? raw.updatedByGroups.map((g: any) => String(g ?? "").trim()).filter(Boolean)
      : undefined,
  }
}

async function readJsonFromS3(): Promise<any> {
  if (!BUCKET) {
    console.warn("[api/admin/magazines] AWS_S3_BUCKET not set, returning empty items list")
    return { items: [] }
  }

  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: MAG_JSON_KEY,
  })

  let res
  try {
    res = await s3.send(cmd)
  } catch (err: any) {
    if (
      err?.name === "NoSuchKey" ||
      err?.Code === "NoSuchKey" ||
      err?.$metadata?.httpStatusCode === 404
    ) {
      console.warn("[api/admin/magazines] magazines JSON not found, returning empty list")
      return { items: [] }
    }

    console.error("[api/admin/magazines] S3 GetObject error", err)
    throw err
  }

  const body = await (async () => {
    const b = res.Body as any
    if (!b) {
      return ""
    }

    if (typeof b.transformToString === "function") {
      return b.transformToString("utf-8")
    }

    return await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      b.on("data", (chunk: Buffer) => chunks.push(chunk))
      b.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")))
      b.on("error", reject)
    })
  })()

  if (!body) {
    return { items: [] }
  }

  try {
    return JSON.parse(body)
  } catch (err) {
    console.error("[api/admin/magazines] Invalid JSON in magazines file", err)
    throw new Error("Failed to parse magazines JSON")
  }
}

async function writeJsonToS3(items: AdminMagazine[]): Promise<void> {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET is not configured")
  }

  const payload = { items }

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: MAG_JSON_KEY,
    Body: JSON.stringify(payload, null, 2),
    ContentType: "application/json",
  })

  await s3.send(cmd)

  console.log("[api/admin/magazines] wrote magazines to S3", {
    count: items.length,
    key: MAG_JSON_KEY,
  })
}

export async function GET() {
  try {
    const parsed = await readJsonFromS3()

    const arr: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : []

    const items = arr
      .map((raw, index) => normaliseMagazine(raw, index))
      .filter((m): m is AdminMagazine => !!m)

    return NextResponse.json({
      ok: true,
      items,
    })
  } catch (err: any) {
    console.error("[api/admin/magazines] GET error", err)

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to load magazines",
      },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Request body must be {items:[...]}",
        },
        { status: 400 }
      )
    }

    const cleaned = body.items
      .map((raw: any, index: number) => normaliseMagazine(raw, index))
      .filter((m: AdminMagazine | null): m is AdminMagazine => !!m)

    await writeJsonToS3(cleaned)

    return NextResponse.json({
      ok: true,
      items: cleaned,
    })
  } catch (err: any) {
    console.error("[api/admin/magazines] PUT error", err)

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to save magazines",
      },
      { status: 500 }
    )
  }
}