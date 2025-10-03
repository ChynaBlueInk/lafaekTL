export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest, NextResponse} from "next/server";
import {S3Client} from "@aws-sdk/client-s3";
import {createPresignedPost} from "@aws-sdk/s3-presigned-post";
import crypto from "crypto";

const region=process.env.AWS_REGION||"ap-southeast-2";
const bucket=process.env.S3_BUCKET!;

const s3=new S3Client({
  region,
  credentials:{accessKeyId:process.env.AWS_ACCESS_KEY_ID!, secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!}
});

export async function POST(req:NextRequest){
  try{
    const {contentType, ext}:{contentType:string; ext:string}=await req.json();
    if(!contentType||!ext){return NextResponse.json({error:"Missing contentType or ext"}, {status:400});}

    const key=`uploads/${crypto.randomUUID()}.${ext.replace(".","").toLowerCase()}`;

    // Create a browser-friendly presigned POST (no checksum header hassles)
    const {url, fields}=await createPresignedPost(s3, {
      Bucket: bucket,
      Key: key,
      Expires: 60,
      Fields: {"Content-Type": contentType},
      Conditions: [
        ["content-length-range", 0, 10485760] // up to 10 MB; adjust if needed
      ]
    });

    // Public URL (works with our bucket policy on uploads/*)
    const publicUrl=`https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({url, fields, publicUrl});
  }catch(e:any){
    return NextResponse.json({error:e?.message||"Upload error"}, {status:500});
  }
}
