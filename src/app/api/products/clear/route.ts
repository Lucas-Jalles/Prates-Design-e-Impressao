import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
    
    // Tentar ler cache atual
    let currentCache: any[] = [];
    try {
      const content = await readFile(cachePath, "utf-8");
      currentCache = JSON.parse(content);
    } catch (e) {
      currentCache = [];
    }

    return NextResponse.json({ 
      success: true, 
      message: "Cache consultado",
      count: currentCache.length,
      fromCache: true
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}