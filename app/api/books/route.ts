export const runtime="nodejs";
export const dynamic="force-dynamic";

import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {NextResponse} from "next/server";
import {dynamodb} from "@/lib/aws";

export async function GET(){
  try{
    const command=new ScanCommand({
      TableName:process.env.BOOKS_TABLE,
    });

    const result=await dynamodb.send(command);

    return NextResponse.json({
      success:true,
      books:result.Items || [],
    });
  }catch(error){
    console.error("Error fetching books:",error);

    const message=
      error instanceof Error ? error.message : "Failed to fetch books.";

    return NextResponse.json(
      {
        success:false,
        message,
      },
      {status:500}
    );
  }
}