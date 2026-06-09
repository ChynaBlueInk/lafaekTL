//app/api/admin/learning/
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { LearningCategorySlug, LearningItemRecord } from "@/lib/learning-types";

const REGION = process.env.AWS_REGION || "ap-southeast-2";
const BUCKET = process.env.AWS_S3_BUCKET;
const LEARNING_JSON_KEY = process.env.AWS_S3_LEARNING_JSON_KEY || "content/learning.json";

const s3 = new S3Client({
  region: REGION,
  credentials: BUCKET
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      }
    : undefined,
});

const VALID_CATEGORY_SLUGS: LearningCategorySlug[] = [
  "stories",
  "natural-science",
  "social-science",
  "physical-education",
  "literacy",
  "mathematics",
  "health",
  "games",
  "creativity",
];

function isValidCategorySlug(value: string): value is LearningCategorySlug {
  return VALID_CATEGORY_SLUGS.includes(value as LearningCategorySlug);
}

function normaliseLearningItem(raw: any): LearningItemRecord | null {
  const itemId = typeof raw?.itemId === "string" ? raw.itemId.trim() : "";

  let categorySlug =
    typeof raw?.categorySlug === "string" ? raw.categorySlug.trim() : "";

  if (categorySlug === "history") {
    categorySlug = "physical-education";
  }

  if (!itemId || !isValidCategorySlug(categorySlug)) {
    return null;
  }

  return {
    itemId,
    categorySlug: categorySlug as LearningCategorySlug,
    titleEn: typeof raw?.titleEn === "string" ? raw.titleEn : "",
    titleTet: typeof raw?.titleTet === "string" ? raw.titleTet : "",
    descriptionEn: typeof raw?.descriptionEn === "string" ? raw.descriptionEn : "",
    descriptionTet: typeof raw?.descriptionTet === "string" ? raw.descriptionTet : "",
    coverImageUrl: typeof raw?.coverImageUrl === "string" ? raw.coverImageUrl : "",
    pageImageUrls: Array.isArray(raw?.pageImageUrls)
      ? raw.pageImageUrls.map((item: unknown) => String(item)).filter(Boolean)
      : [],
    sourcePdfUrl: typeof raw?.sourcePdfUrl === "string" ? raw.sourcePdfUrl : undefined,
    isPublished: Boolean(raw?.isPublished),
    createdAt: typeof raw?.createdAt === "string" ? raw.createdAt : "",
    updatedAt: typeof raw?.updatedAt === "string" ? raw.updatedAt : "",
  };
}

async function readJsonFromS3(): Promise<{ items: LearningItemRecord[] }> {
  if (!BUCKET) {
    console.warn("[api/admin/learning] AWS_S3_BUCKET not set, returning empty items list");
    return { items: [] };
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: LEARNING_JSON_KEY,
  });

  let response;

  try {
    response = await s3.send(command);
  } catch (err: any) {
    if (
      err?.name === "NoSuchKey" ||
      err?.Code === "NoSuchKey" ||
      err?.$metadata?.httpStatusCode === 404
    ) {
      console.warn("[api/admin/learning] learning JSON not found, returning empty list");
      return { items: [] };
    }

    console.error("[api/admin/learning] S3 GetObject error", err);
    throw err;
  }

  const body = await (async () => {
    const streamBody = response.Body as any;

    if (!streamBody) {
      return "";
    }

    if (typeof streamBody.transformToString === "function") {
      return streamBody.transformToString("utf-8");
    }

    return await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      streamBody.on("data", (chunk: Buffer) => chunks.push(chunk));
      streamBody.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      streamBody.on("error", reject);
    });
  })();

  if (!body) {
    return { items: [] };
  }

  try {
    const parsed = JSON.parse(body);
    const rawItems: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];

    const items = rawItems
      .map(normaliseLearningItem)
      .filter((item): item is LearningItemRecord => !!item);

    return { items };
  } catch (err) {
    console.error("[api/admin/learning] Invalid JSON in learning file", err);
    throw new Error("Failed to parse learning JSON");
  }
}

async function writeJsonToS3(items: LearningItemRecord[]) {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: LEARNING_JSON_KEY,
    Body: JSON.stringify({ items }, null, 2),
    ContentType: "application/json",
  });

  await s3.send(command);
}

function validateLearningItem(raw: any): { ok: true; item: LearningItemRecord } | { ok: false; message: string } {
  const item = normaliseLearningItem(raw);

  if (!item) {
    return { ok: false, message: "Invalid learning item." };
  }

  if (!item.titleEn.trim()) {
    return { ok: false, message: "titleEn is required." };
  }

  if (!item.titleTet.trim()) {
    return { ok: false, message: "titleTet is required." };
  }

  if (!item.coverImageUrl.trim()) {
    return { ok: false, message: "coverImageUrl is required." };
  }

  if (!Array.isArray(item.pageImageUrls) || item.pageImageUrls.length === 0) {
    return { ok: false, message: "At least one page image is required." };
  }

  return { ok: true, item };
}

export async function GET() {
  try {
    const { items } = await readJsonFromS3();

    items.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("[api/admin/learning] GET error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch learning items.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateLearningItem(body);

    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    const { items } = await readJsonFromS3();

    const alreadyExists = items.some((item) => item.itemId === validation.item.itemId);
    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: `An item with itemId "${validation.item.itemId}" already exists.`,
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const newItem: LearningItemRecord = {
      ...validation.item,
      createdAt: validation.item.createdAt || now,
      updatedAt: now,
    };

    const nextItems = [...items, newItem];
    await writeJsonToS3(nextItems);

    return NextResponse.json({
      success: true,
      item: newItem,
      items: nextItems,
    });
  } catch (error) {
    console.error("[api/admin/learning] POST error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create learning item.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateLearningItem(body);

    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    const { items } = await readJsonFromS3();
    const index = items.findIndex((item) => item.itemId === validation.item.itemId);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: `No learning item found with itemId "${validation.item.itemId}".`,
        },
        { status: 404 }
      );
    }

    const existing = items[index];
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Existing learning item could not be loaded.",
        },
        { status: 404 }
      );
    }

    const updatedItem: LearningItemRecord = {
      ...existing,
      ...validation.item,
      createdAt: existing.createdAt || validation.item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextItems = [...items];
    nextItems[index] = updatedItem;

    await writeJsonToS3(nextItems);

    return NextResponse.json({
      success: true,
      item: updatedItem,
      items: nextItems,
    });
  } catch (error) {
    console.error("[api/admin/learning] PUT error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to update learning item.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const itemId = typeof body?.itemId === "string" ? body.itemId.trim() : "";

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          message: "itemId is required.",
        },
        { status: 400 }
      );
    }

    const { items } = await readJsonFromS3();
    const exists = items.some((item) => item.itemId === itemId);

    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          message: `No learning item found with itemId "${itemId}".`,
        },
        { status: 404 }
      );
    }

    const nextItems = items.filter((item) => item.itemId !== itemId);
    await writeJsonToS3(nextItems);

    return NextResponse.json({
      success: true,
      items: nextItems,
    });
  } catch (error) {
    console.error("[api/admin/learning] DELETE error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to delete learning item.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}