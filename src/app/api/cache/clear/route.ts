import { NextResponse } from "next/server";
import { clearCache } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  clearCache();
  return NextResponse.json({ success: true, message: "Cache cleared" });
}
