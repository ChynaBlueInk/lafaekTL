// lib/adminFetch.ts
//
// Admin API routes (/api/admin/*) are protected by middleware.ts, which
// verifies a Cognito ID token cookie and redirects to /auth on failure or
// expiry. Because fetch() follows redirects by default, an expired-session
// request comes back as a 200 OK response containing the /auth page's HTML
// — not an error status. Calling res.json() on that throws a generic
// SyntaxError that gives no indication of what actually happened.
//
// This helper checks the response content-type before parsing, and throws
// a clearly-typed SessionExpiredError when it detects an HTML response
// where JSON was expected, so calling code can show the user something
// useful ("please log in again") instead of a raw parse error.

export class SessionExpiredError extends Error{
  constructor(){
    super("Your session has expired. Please log in again.")
    this.name="SessionExpiredError"
  }
}

function buildLoginUrl(){
  if(typeof window==="undefined"){
    return "/auth"
  }
  const next=window.location.pathname+window.location.search
  return `/auth?next=${encodeURIComponent(next)}`
}

/**
 * Fetch JSON from an admin API route, throwing SessionExpiredError instead
 * of a confusing parse error if the session has expired mid-request.
 */
export async function adminFetchJson<T=any>(
  input:string,
  init?:RequestInit
):Promise<T>{
  const res=await fetch(input,init)

  const contentType=res.headers.get("content-type")||""
  const looksLikeJson=contentType.includes("application/json")

  // A redirect back to the HTML /auth page — whether flagged via
  // res.redirected, a final URL containing /auth, or simply a non-JSON
  // content-type — means the session expired partway through.
  if(!looksLikeJson||res.redirected||res.url.includes("/auth")){
    throw new SessionExpiredError()
  }

  const data=await res.json()

  if(!res.ok){
    const message=typeof data?.error==="string"?data.error:`Request failed (${res.status})`
    throw new Error(message)
  }

  return data as T
}

export {buildLoginUrl}