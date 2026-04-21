export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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
  "history",
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
  const categorySlug = typeof raw?.categorySlug === "string" ? raw.categorySlug.trim() : "";

  if (!itemId || !isValidCategorySlug(categorySlug)) {
    return null;
  }

  return {
    itemId,
    categorySlug,
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

async function readJsonFromS3(): Promise<any> {
  if (!BUCKET) {
    console.warn("[api/learning] AWS_S3_BUCKET not set, returning empty items list");
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
      console.warn("[api/learning] learning JSON not found, returning empty list");
      return { items: [] };
    }

    console.error("[api/learning] S3 GetObject error", err);
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
    return JSON.parse(body);
  } catch (err) {
    console.error("[api/learning] Invalid JSON in learning file", err);
    throw new Error("Failed to parse learning JSON");
  }
}

export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get("categorySlug")?.trim() || "";

  if (categorySlug && !isValidCategorySlug(categorySlug)) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid categorySlug: ${categorySlug}`,
      },
      { status: 400 }
    );
  }

  try {
    const parsed = await readJsonFromS3();

    const rawItems: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];

    const allItems = rawItems
      .map(normaliseLearningItem)
      .filter((item): item is LearningItemRecord => !!item);

    const publishedItems = allItems.filter((item) => item.isPublished);

    const filteredItems = categorySlug
      ? publishedItems.filter((item) => item.categorySlug === categorySlug)
      : publishedItems;

    filteredItems.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({
      success: true,
      items: filteredItems,
    });
  } catch (error) {
    console.error("Error fetching learning items:", error);

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