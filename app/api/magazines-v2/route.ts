export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"
import { dynamodb } from "@/lib/aws"

const TABLE_NAME = process.env.MAGAZINES_TABLE

export async function GET() {
  if (!TABLE_NAME) {
    return NextResponse.json(
      {
        success: false,
        message: "MAGAZINES_TABLE is not set.",
      },
      { status: 500 }
    )
  }

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    })

    const result = await dynamodb.send(command)

    return NextResponse.json({
      success: true,
      magazines: result.Items || [],
    })
  } catch (error:any) {
  console.error("MAGAZINES API ERROR:", error)

  return NextResponse.json(
    {
      success:false,
      message:error?.message || "Unknown error",
      raw:error
    },
    {status:500}
    )
  }
}

export async function POST(req: NextRequest) {
  if (!TABLE_NAME) {
    return NextResponse.json(
      {
        success: false,
        message: "MAGAZINES_TABLE is not set.",
      },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()

    const magazine = {
      id: crypto.randomUUID(),
      title: body.title || "",
      issue: body.issue || "",
      language: body.language || "",
      category: body.category || "",
      coverImage: body.coverImage || "",
      pages: body.pages || [],
      published: body.published ?? false,
      createdAt: new Date().toISOString(),
    }

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: magazine,
    })

    await dynamodb.send(command)

    return NextResponse.json({
      success: true,
      magazine,
    })
  } catch (error) {
    console.error("Error creating magazine:", error)

    const message =
  error instanceof Error ? error.message : "Failed to fetch magazines."

return NextResponse.json(
  {
    success: false,
    message,
    error,
  },
  { status: 500 }
    )
  }
}