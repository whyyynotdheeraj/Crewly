import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "profile";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize with sharp if available, else convert buffer to base64 directly
    try {
      const sharp = (await import("sharp")).default;
      const maxWidth = type === "profile" ? 600 : 1000;

      const optimizedBuffer = await sharp(buffer)
        .resize(maxWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const base64 = optimizedBuffer.toString("base64");
      const url = `data:image/jpeg;base64,${base64}`;
      return NextResponse.json({ url });
    } catch {
      // Fallback: standard base64 data URL
      const mime = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const url = `data:${mime};base64,${base64}`;
      return NextResponse.json({ url });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
