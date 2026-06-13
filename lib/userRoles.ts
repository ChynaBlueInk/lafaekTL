// lib/userRoles.ts
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { dynamodb } from "@/lib/aws"
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import {
  PERMISSION_TO_COGNITO_GROUP,
  type SectionPermission,
  type UserRoleRecord,
} from "@/lib/roles"

const REGION = process.env.AWS_REGION || "ap-southeast-2"
const USER_POOL_ID =
  process.env.COGNITO_USER_POOL_ID || "ap-southeast-2_a70kol0sr"
const TABLE = "UserRoles"

const cognito = new CognitoIdentityProviderClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

// ── DynamoDB helpers ────────────────────────────────────────────────────────

export async function listUsersFromDynamo(): Promise<UserRoleRecord[]> {
  const res = await dynamodb.send(new ScanCommand({ TableName: TABLE }))
  return ((res.Items || []) as any[]).map(normaliseDynamoRecord)
}

export async function getUserFromDynamo(
  userId: string
): Promise<UserRoleRecord | null> {
  const res = await dynamodb.send(
    new GetCommand({ TableName: TABLE, Key: { userId } })
  )
  if (!res.Item) return null
  return normaliseDynamoRecord(res.Item)
}

export async function upsertUserInDynamo(record: UserRoleRecord): Promise<void> {
  await dynamodb.send(new PutCommand({ TableName: TABLE, Item: record }))
}

export async function updateUserStatusInDynamo(
  userId: string,
  status: "active" | "disabled"
): Promise<void> {
  await dynamodb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { userId },
      UpdateExpression: "SET #s = :s",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":s": status },
    })
  )
}

// Handle records that were written with the old single `role` field
function normaliseDynamoRecord(raw: any): UserRoleRecord {
  let permissions: SectionPermission[] = []

  if (Array.isArray(raw.permissions) && raw.permissions.length > 0) {
    permissions = raw.permissions as SectionPermission[]
  } else if (typeof raw.role === "string") {
    // Migrate old single-role records
    permissions = legacyRoleToPermissions(raw.role)
  }

  return {
    userId: raw.userId,
    email: raw.email || "",
    name: raw.name || "",
    permissions,
    status: raw.status || "active",
    createdAt: raw.createdAt || new Date().toISOString(),
  }
}

function legacyRoleToPermissions(role: string): SectionPermission[] {
  switch (role.toLowerCase()) {
    case "superadmin": return []  // SuperAdmin doesn't need permissions array
    case "magazine":   return ["magazine"]
    case "impact":     return ["impact", "reports"]
    case "learning":   return ["learning"]
    default:           return []
  }
}

// ── Cognito helpers ─────────────────────────────────────────────────────────

export async function createCognitoUser(
  email: string,
  name: string,
  permissions: SectionPermission[]
): Promise<string> {
  const res = await cognito.send(
    new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        { Name: "name", Value: name },
      ],
      DesiredDeliveryMediums: ["EMAIL"],
    })
  )

  const userId =
    res.User?.Attributes?.find((a) => a.Name === "sub")?.Value || ""

  for (const permission of permissions) {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        GroupName: PERMISSION_TO_COGNITO_GROUP[permission],
      })
    )
  }

  return userId
}

export async function syncCognitoPermissions(
  username: string,
  oldPermissions: SectionPermission[],
  newPermissions: SectionPermission[]
): Promise<void> {
  const toRemove = oldPermissions.filter((p) => !newPermissions.includes(p))
  const toAdd = newPermissions.filter((p) => !oldPermissions.includes(p))

  for (const p of toRemove) {
    await cognito.send(
      new AdminRemoveUserFromGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        GroupName: PERMISSION_TO_COGNITO_GROUP[p],
      })
    )
  }

  for (const p of toAdd) {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        GroupName: PERMISSION_TO_COGNITO_GROUP[p],
      })
    )
  }
}

export async function disableCognitoUser(username: string): Promise<void> {
  await cognito.send(
    new AdminDisableUserCommand({ UserPoolId: USER_POOL_ID, Username: username })
  )
}

export async function enableCognitoUser(username: string): Promise<void> {
  await cognito.send(
    new AdminEnableUserCommand({ UserPoolId: USER_POOL_ID, Username: username })
  )
}
