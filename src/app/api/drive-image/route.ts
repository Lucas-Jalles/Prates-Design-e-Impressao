import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id parameter", { status: 400 });
  }

  try {
    // Extract file ID from various Google Drive URL formats
    let fileId = id;
    if (id.includes("drive.google.com")) {
      const match = id.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    }

    const response = await fetch(`https://drive.google.com/uc?export=view&id=${fileId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      // Try alternative: download endpoint
      const altRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!altRes.ok) {
        return new NextResponse("Image not found", { status: 404 });
      }
      return new NextResponse(altRes.body, {
        headers: {
          "Content-Type": altRes.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error fetching image", { status: 500 });
  }
}