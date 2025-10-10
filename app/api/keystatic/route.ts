export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { makeRouteHandler } from "@keystatic/next/route-handler";
// NOTE: You confirmed 4 levels up is correct in your repo layout.
import config from "../../../keystatic.config";

// Wire GitHub OAuth + signed sessions using your Vercel env vars.
export const { GET, POST } = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET!,                    // 64-char random in Vercel
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID!,        // GitHub OAuth App
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET!,// GitHub OAuth App
});
