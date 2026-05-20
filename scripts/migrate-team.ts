import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

import {
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb"

const REGION="ap-southeast-2"

const s3=new S3Client({
  region:REGION
})

const dynamoClient=new DynamoDBClient({
  region:REGION
})

const docClient=DynamoDBDocumentClient.from(dynamoClient)

const BUCKET="lafaek-media"

const KEY="content/team.json"

async function streamToString(stream: any): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const chunks: any[] = []

    stream.on("data", (chunk: any) => chunks.push(chunk))

    stream.on("error", reject)

    stream.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"))
    })
  })
}

async function migrate(){

  console.log("Downloading team.json from S3...")

  const response=await s3.send(
    new GetObjectCommand({
      Bucket:BUCKET,
      Key:KEY
    })
  )

 const raw: string = await streamToString(response.Body as any)

const data = JSON.parse(raw)

const members = data.members

console.log(`Found ${members.length} members`)

  for(const member of members){

    await docClient.send(
      new PutCommand({
        TableName:"LafaekTeam",
        Item:member
      })
    )

    console.log(`Uploaded ${member.name}`)
  }

  console.log("Migration complete")
}

migrate()