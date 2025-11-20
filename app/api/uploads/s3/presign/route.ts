// app/api/uploads/s3/presign/route.ts
export const runtime='nodejs';
export const dynamic='force-dynamic';

import {NextRequest,NextResponse} from 'next/server';
import {S3Client} from '@aws-sdk/client-s3';
import {createPresignedPost} from '@aws-sdk/s3-presigned-post';

const REGION=process.env.AWS_REGION||'ap-southeast-2';
const BUCKET=process.env.AWS_S3_BUCKET;
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||'uploads';
// strip leading slashes so keys never start with "/"
const BASE_PATH_NORMALISED=RAW_BASE_PATH.replace(/^\/+/,'');
const USE_ACL=process.env.AWS_S3_USE_ACL==='true';

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(req:NextRequest){
  try{
    const {fileName,contentType,folder}=await req.json();

    const missing:string[]=[];
    if(!BUCKET) missing.push('AWS_S3_BUCKET');
    if(!process.env.AWS_ACCESS_KEY_ID) missing.push('AWS_ACCESS_KEY_ID');
    if(!process.env.AWS_SECRET_ACCESS_KEY) missing.push('AWS_SECRET_ACCESS_KEY');
    if(missing.length){
      return NextResponse.json(
        {
          error:`Missing env var(s): ${missing.join(', ')}`,
          meta:{REGION,BUCKET:BUCKET??null}
        },
        {status:500}
      );
    }

    if(!fileName || !contentType){
      return NextResponse.json(
        {error:'fileName and contentType required'},
        {status:400}
      );
    }

    const allowed=['our-team','school-gallery','pdfs'] as const;
    const safeFolder=allowed.includes(folder)?folder:'misc';
    const safeName=String(fileName).replace(/[^a-zA-Z0-9._-]/g,'_');
    const key=`${BASE_PATH_NORMALISED}/${safeFolder}/${Date.now()}-${safeName}`;

    const fields:Record<string,string>={
      'Content-Type':contentType||'application/octet-stream',
      success_action_status:'201'
    };

    const conditions:any[]=[
      ['content-length-range',0,20*1024*1024],
      ['starts-with','$Content-Type',''],
      ['eq','$success_action_status','201']
    ];

    // ACLs are disabled on this bucket, so we do not add acl/x-amz-acl

    const presign=await createPresignedPost(s3,{
      Bucket:BUCKET!,
      Key:key,
      Fields:fields,
      Conditions:conditions,
      Expires:60
    });

    const actionUrl=presign.url;
    const publicUrl=`${actionUrl}/${key}`;

    return NextResponse.json({
      url:actionUrl,
      fields:presign.fields,
      publicUrl,
      key,
      meta:{REGION,BUCKET,USE_ACL}
    });
  }catch(err:any){
    console.error('presign error',err);
    return NextResponse.json(
      {error:'Failed to create presign'},
      {status:500}
    );
  }
}
