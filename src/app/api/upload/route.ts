import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    const folder = type === "profile" ? "profiles" : "experiences";
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to optimize with sharp, fallback to raw save
    try {
      const sharp = (await import("sharp")).default;
      const maxWidth = type === "profile" ? 800 : 1200;

      await sharp(buffer)
        .resize(maxWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filepath.replace(`.${ext}`, ".jpg"));

      const url = `/uploads/${folder}/${filename.replace(`.${ext}`, ".jpg")}`;
      return NextResponse.json({ url });
    } catch {
      // Sharp not available, save raw file
      await writeFile(filepath, buffer);
      const url = `/uploads/${folder}/${filename}`;
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
