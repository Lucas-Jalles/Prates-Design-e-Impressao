import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
    const content = await readFile(cachePath, "utf-8");
    const services = JSON.parse(content);
    return NextResponse.json({ services });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}