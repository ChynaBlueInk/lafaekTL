// lib/auth.ts
export type LafaekRole=
  |"Admin"
  |"ContentEditor"
  |"MagazineAdmin"
  |"MagazineBuyer"
  |"FriendsOfLafaek"
  |"ImpactStoryContributor"

export function getUserGroupsFromSessionStorage(){
  if(typeof window==="undefined"){
    return [] as string[]
  }

  try{
    const authority="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
    const clientId="30g26p9ts1baddag42g747snp3"
    const key=`oidc.user:${authority}:${clientId}`
    const raw=sessionStorage.getItem(key)
    if(!raw){
      return []
    }
    const parsed=JSON.parse(raw)
    const groups=parsed?.profile?.["cognito:groups"]
    return Array.isArray(groups)?groups:[]
  }catch{
    return []
  }
}

export function hasAnyRole(allowedRoles:LafaekRole[]){
  const groups=getUserGroupsFromSessionStorage()
  return allowedRoles.some((r) => groups.includes(r))
}

export function isAdmin(){
  return hasAnyRole(["Admin"])
}
