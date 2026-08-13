import { NextResponse } from "next/server";
import { fetchServices } from "@/lib/googleSheets";
import { writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await fetchServices();

    // Atualizar o cache com os novos dados
    const cachePath = path.join(process.cwd(), "src", "data", "products-cache.json");
    await writeFile(cachePath, JSON.stringify(services, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: "Cache updated from Sheets",
      count: services.length
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}