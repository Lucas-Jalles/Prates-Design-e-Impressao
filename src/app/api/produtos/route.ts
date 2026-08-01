import { NextResponse } from "next/server";
import { getServices } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ services });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}