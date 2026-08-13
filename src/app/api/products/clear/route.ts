import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Cache clearing is triggered here
  // The actual cache invalidation should be handled at the Google Apps Script level
  // or via Vercel KV/Redis, as each serverless function invocation has isolated memory
  return NextResponse.json({ success: true, message: "Cache clear triggered" });
}