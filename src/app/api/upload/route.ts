import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

// Authenticated image upload endpoint used by the admin panel.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_* env vars." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Basic guardrails.
  const MAX_BYTES = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(buffer);
    return NextResponse.json({ url, publicId });
  } catch (error) {
    console.error("[upload] Cloudinary upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
