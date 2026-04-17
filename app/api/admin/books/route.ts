export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse} from "next/server";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import {dynamodb} from "@/lib/aws";
import type {BookRecord} from "@/lib/book-types";

const TABLE_NAME=process.env.BOOKS_TABLE;

function isNonEmptyString(value:unknown){
  return typeof value==="string" && value.trim().length>0;
}

function isStringArray(value:unknown){
  return Array.isArray(value) && value.every((item)=>typeof item==="string");
}

function normaliseString(value:unknown){
  return typeof value==="string" ? value.trim() : "";
}

function normaliseBoolean(value:unknown){
  return value===true;
}

function normaliseLevel(value:unknown): "LK" | "LP" | null{
  if(value==="LK" || value==="LP"){
    return value;
  }
  return null;
}

function buildBookPayload(body:any){
  const bookId=normaliseString(body?.bookId);
  const titleEn=normaliseString(body?.titleEn);
  const titleTet=normaliseString(body?.titleTet);
  const descriptionEn=normaliseString(body?.descriptionEn);
  const descriptionTet=normaliseString(body?.descriptionTet);
  const category=normaliseString(body?.category);
  const coverImageUrl=normaliseString(body?.coverImageUrl);
  const sourcePdfUrl=normaliseString(body?.sourcePdfUrl);
  const level=normaliseLevel(body?.level);
  const isPublished=normaliseBoolean(body?.isPublished);

  const rawPageImageUrls=body?.pageImageUrls;
  const pageImageUrls=isStringArray(rawPageImageUrls)
    ? rawPageImageUrls.map((item)=>item.trim()).filter(Boolean)
    : [];

  return {
    bookId,
    titleEn,
    titleTet,
    descriptionEn,
    descriptionTet,
    category,
    coverImageUrl,
    sourcePdfUrl,
    level,
    isPublished,
    pageImageUrls,
  };
}

function validateBookPayload(payload:{
  bookId:string;
  titleEn:string;
  titleTet:string;
  descriptionEn:string;
  descriptionTet:string;
  category:string;
  coverImageUrl:string;
  sourcePdfUrl:string;
  level:"LK" | "LP" | null;
  isPublished:boolean;
  pageImageUrls:string[];
}){
  return (
    isNonEmptyString(payload.bookId) &&
    isNonEmptyString(payload.titleEn) &&
    isNonEmptyString(payload.titleTet) &&
    isNonEmptyString(payload.descriptionEn) &&
    isNonEmptyString(payload.descriptionTet) &&
    !!payload.level &&
    isNonEmptyString(payload.category) &&
    isNonEmptyString(payload.coverImageUrl) &&
    payload.pageImageUrls.length>0
  );
}

export async function GET(){
  try{
    if(!TABLE_NAME){
      return NextResponse.json(
        {success:false,message:"Missing BOOKS_TABLE environment variable."},
        {status:500}
      );
    }

    const result=await dynamodb.send(new ScanCommand({
      TableName:TABLE_NAME,
    }));

    const books=(result.Items || []) as BookRecord[];

    const sortedBooks=[...books].sort((a,b)=>{
      return (b.updatedAt || "").localeCompare(a.updatedAt || "");
    });

    return NextResponse.json({
      success:true,
      books:sortedBooks,
    });
  }catch(error){
    console.error("Error fetching admin books:",error);

    const message=
      error instanceof Error ? error.message : "Failed to fetch books.";

    return NextResponse.json(
      {success:false,message},
      {status:500}
    );
  }
}

export async function POST(req:Request){
  try{
    if(!TABLE_NAME){
      return NextResponse.json(
        {success:false,message:"Missing BOOKS_TABLE environment variable."},
        {status:500}
      );
    }

    const body=await req.json();
    const payload=buildBookPayload(body);

    if(!validateBookPayload(payload)){
      return NextResponse.json(
        {
          success:false,
          message:"Missing required fields. Required: bookId, titleEn, titleTet, descriptionEn, descriptionTet, level, category, coverImageUrl, pageImageUrls."
        },
        {status:400}
      );
    }

    const existing=await dynamodb.send(new GetCommand({
      TableName:TABLE_NAME,
      Key:{bookId:payload.bookId},
    }));

    if(existing.Item){
      return NextResponse.json(
        {success:false,message:"A book with this bookId already exists."},
        {status:409}
      );
    }

    const now=new Date().toISOString();

    const newBook:BookRecord={
      bookId:payload.bookId,
      titleEn:payload.titleEn,
      titleTet:payload.titleTet,
      descriptionEn:payload.descriptionEn,
      descriptionTet:payload.descriptionTet,
      level:payload.level!,
      category:payload.category,
      coverImageUrl:payload.coverImageUrl,
      pageImageUrls:payload.pageImageUrls,
      ...(payload.sourcePdfUrl ? {sourcePdfUrl:payload.sourcePdfUrl} : {}),
      isPublished:payload.isPublished,
      createdAt:now,
      updatedAt:now,
    };

    await dynamodb.send(new PutCommand({
      TableName:TABLE_NAME,
      Item:newBook,
      ConditionExpression:"attribute_not_exists(bookId)",
    }));

    return NextResponse.json({
      success:true,
      book:newBook,
    });
  }catch(error){
    console.error("Error creating book:",error);

    const message=
      error instanceof Error ? error.message : "Failed to create book.";

    return NextResponse.json(
      {success:false,message},
      {status:500}
    );
  }
}

export async function PUT(req:Request){
  try{
    if(!TABLE_NAME){
      return NextResponse.json(
        {success:false,message:"Missing BOOKS_TABLE environment variable."},
        {status:500}
      );
    }

    const body=await req.json();
    const payload=buildBookPayload(body);

    if(!validateBookPayload(payload)){
      return NextResponse.json(
        {
          success:false,
          message:"Missing required fields. Required: bookId, titleEn, titleTet, descriptionEn, descriptionTet, level, category, coverImageUrl, pageImageUrls."
        },
        {status:400}
      );
    }

    const existing=await dynamodb.send(new GetCommand({
      TableName:TABLE_NAME,
      Key:{bookId:payload.bookId},
    }));

    if(!existing.Item){
      return NextResponse.json(
        {success:false,message:"Book not found."},
        {status:404}
      );
    }

    const existingBook=existing.Item as BookRecord;
    const now=new Date().toISOString();

    const updateExpressionParts=[
      "titleEn = :titleEn",
      "titleTet = :titleTet",
      "descriptionEn = :descriptionEn",
      "descriptionTet = :descriptionTet",
      "#level = :level",
      "category = :category",
      "coverImageUrl = :coverImageUrl",
      "pageImageUrls = :pageImageUrls",
      "isPublished = :isPublished",
      "updatedAt = :updatedAt"
    ];

    const expressionAttributeNames:Record<string,string>={
      "#level":"level",
    };

  const expressionAttributeValues:Record<string,unknown>={
  ":titleEn":payload.titleEn,
  ":titleTet":payload.titleTet,
  ":descriptionEn":payload.descriptionEn,
  ":descriptionTet":payload.descriptionTet,
  ":level":payload.level,
  ":category":payload.category,
  ":coverImageUrl":payload.coverImageUrl,
  ":pageImageUrls":payload.pageImageUrls,
  ":isPublished":payload.isPublished,
  ":updatedAt":now,
};

    if(payload.sourcePdfUrl){
      updateExpressionParts.push("sourcePdfUrl = :sourcePdfUrl");
    }else{
      updateExpressionParts.push("sourcePdfUrl = :emptySourcePdfUrl");
      expressionAttributeValues[":emptySourcePdfUrl"]="";
    }

    await dynamodb.send(new UpdateCommand({
      TableName:TABLE_NAME,
      Key:{bookId:payload.bookId},
      UpdateExpression:`SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames:expressionAttributeNames,
      ExpressionAttributeValues:expressionAttributeValues,
      ConditionExpression:"attribute_exists(bookId)",
      ReturnValues:"ALL_NEW",
    }));

    const updatedBook:BookRecord={
      ...existingBook,
      bookId:payload.bookId,
      titleEn:payload.titleEn,
      titleTet:payload.titleTet,
      descriptionEn:payload.descriptionEn,
      descriptionTet:payload.descriptionTet,
      level:payload.level!,
      category:payload.category,
      coverImageUrl:payload.coverImageUrl,
      pageImageUrls:payload.pageImageUrls,
      ...(payload.sourcePdfUrl ? {sourcePdfUrl:payload.sourcePdfUrl} : {}),
      isPublished:payload.isPublished,
      createdAt:existingBook.createdAt,
      updatedAt:now,
    };

    if(!payload.sourcePdfUrl && "sourcePdfUrl" in updatedBook){
      delete updatedBook.sourcePdfUrl;
    }

    return NextResponse.json({
      success:true,
      book:updatedBook,
    });
  }catch(error){
    console.error("Error updating book:",error);

    const message=
      error instanceof Error ? error.message : "Failed to update book.";

    return NextResponse.json(
      {success:false,message},
      {status:500}
    );
  }
}

export async function DELETE(req:Request){
  try{
    if(!TABLE_NAME){
      return NextResponse.json(
        {success:false,message:"Missing BOOKS_TABLE environment variable."},
        {status:500}
      );
    }

    const body=await req.json().catch(()=>null);
    const bookId=normaliseString(body?.bookId);

    if(!isNonEmptyString(bookId)){
      return NextResponse.json(
        {success:false,message:"bookId is required."},
        {status:400}
      );
    }

    const existing=await dynamodb.send(new GetCommand({
      TableName:TABLE_NAME,
      Key:{bookId},
    }));

    if(!existing.Item){
      return NextResponse.json(
        {success:false,message:"Book not found."},
        {status:404}
      );
    }

    await dynamodb.send(new DeleteCommand({
      TableName:TABLE_NAME,
      Key:{bookId},
      ConditionExpression:"attribute_exists(bookId)",
    }));

    return NextResponse.json({
      success:true,
      message:"Book deleted successfully.",
      bookId,
    });
  }catch(error){
    console.error("Error deleting book:",error);

    const message=
      error instanceof Error ? error.message : "Failed to delete book.";

    return NextResponse.json(
      {success:false,message},
      {status:500}
    );
  }
}