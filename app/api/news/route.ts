import {NextResponse} from "next/server";
import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3";

export const dynamic="force-dynamic";
export const runtime="nodejs";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET||"";
const BASE_PATH=(process.env.AWS_S3_BASE_PATH||"uploads").replace(/^\/+|\/+$/g,"");
const NEWS_JSON_KEY=process.env.AWS_S3_NEWS_JSON_KEY||"content/news.json";

const s3=new S3Client({region:REGION});

const streamToString=async(stream:any)=>{
  const chunks:Uint8Array[]=[];
  for await(const chunk of stream){
    chunks.push(typeof chunk==="string"?Buffer.from(chunk):chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

// Keep in sync with the slugify used in app/api/admin/news/route.ts
function slugify(input:string):string{
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .slice(0,80);
}

// Guarantees every item has a non-empty, unique slug so "Read more" links
// always resolve, even for older items saved before slugs existed.
function ensureSlugs(items:any[]):any[]{
  const used=new Set<string>();

  return items.map((item)=>{
    let slug=typeof item.slug==="string"?item.slug.trim():"";

    if(!slug){
      const base=slugify(String(item.titleEn||item.titleTet||""));
      const idSuffix=typeof item.id==="string"?item.id.replace(/[^a-z0-9]/gi,"").slice(-6):"";
      slug=base||idSuffix||`news-${Math.random().toString(36).slice(2,8)}`;
    }

    let finalSlug=slug;
    let counter=2;
    while(used.has(finalSlug)){
      finalSlug=`${slug}-${counter}`;
      counter+=1;
    }
    used.add(finalSlug);

    return{...item,slug:finalSlug};
  });
}

export async function GET(){
  try{
    if(!BUCKET){
      return NextResponse.json(
        {ok:false,error:"Missing AWS_S3_BUCKET in environment variables"},
        {status:500}
      );
    }

    const keyCandidates=[
      `${BASE_PATH}/${NEWS_JSON_KEY}`.replace(/\/+/g,"/"),
      NEWS_JSON_KEY.replace(/^\/+/,"")
    ];

    let parsed:any=null;
    let lastError:any=null;

    for(const key of keyCandidates){
      try{
        const result=await s3.send(
          new GetObjectCommand({
            Bucket:BUCKET,
            Key:key
          })
        );

        if(!result.Body){
          continue;
        }

        const jsonText=await streamToString(result.Body);
        parsed=JSON.parse(jsonText);
        break;
      }catch(error:any){
        lastError=error;
      }
    }

    if(!parsed){
      throw lastError||new Error("News JSON file could not be loaded from S3");
    }

    const rawItems=Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.items)
      ? parsed.items
      : [];

    const visibleItems=rawItems
      .filter((item:any)=>item?.visible!==false)
      .sort((a:any,b:any)=>{
        const da=a?.date?new Date(a.date).getTime():0;
        const db=b?.date?new Date(b.date).getTime():0;

        if(db!==da){
          return db-da;
        }

        const oa=typeof a?.order==="number"?a.order:0;
        const ob=typeof b?.order==="number"?b.order:0;
        return oa-ob;
      });

    const items=ensureSlugs(visibleItems);

    return NextResponse.json({ok:true,items},{status:200});
  }catch(error:any){
    console.error("[api/news] GET error",error);

    return NextResponse.json(
      {ok:false,error:error?.message||"Failed to load public news"},
      {status:500}
    );
  }
}