import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3";

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const REGION="ap-southeast-2";

const BUCKET="lafaek-media";

const KEY="content/team.json";

const TABLE_NAME="LafaekTeam";

const s3=new S3Client({
  region:REGION
});

const dynamoClient=new DynamoDBClient({
  region:REGION
});

const docClient=DynamoDBDocumentClient.from(
  dynamoClient
);

async function streamToString(stream:any){

  return await new Promise<string>((resolve,reject)=>{

    const chunks:any[]=[];

    stream.on(
      "data",
      (chunk:any)=>chunks.push(chunk)
    );

    stream.on("error",reject);

    stream.on("end",()=>{

      resolve(
        Buffer.concat(chunks).toString("utf8")
      );
    });
  });
}

async function restore(){

  console.log(
    "Loading original S3 team.json..."
  );

  const response=await s3.send(
    new GetObjectCommand({
      Bucket:BUCKET,
      Key:KEY
    })
  );

  const raw=await streamToString(
    response.Body as any
  );

  const parsed=JSON.parse(raw);

  const members=parsed.members||[];

  console.log(
    `Found ${members.length} members`
  );

  for(const member of members){

    const cleaned={

      id:String(member.id||""),

      slug:String(member.slug||""),

      name:String(member.name||""),

      roleEn:String(member.roleEn||""),

      roleTet:String(member.roleTet||""),

      bioEn:String(member.bioEn||""),

      bioTet:String(member.bioTet||""),

      photo:String(member.photo||""),

      sketch:String(member.sketch||""),

      department:String(
        member.department||"Production"
      ),

      order:
        typeof member.order==="number"
          ?member.order
          :0,

      visible:
        member.visible!==false
    };

    await docClient.send(
      new PutCommand({
        TableName:TABLE_NAME,
        Item:cleaned
      })
    );

    console.log(
      `Restored ${cleaned.name}`
    );
  }

  console.log(
    "Restore complete"
  );
}

restore();