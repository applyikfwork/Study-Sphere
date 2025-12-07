import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return NextResponse.json({ logoUrl: null });
    }

    const extensions = ["png", "jpg", "jpeg", "svg", "webp"];
    let logoUrl = null;

    for (const ext of extensions) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/site-assets/logo.${ext}`;

      try {
        const response = await fetch(publicUrl, { method: "HEAD" });
        if (response.ok) {
          logoUrl = publicUrl;
          break;
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error("Error fetching logo:", error);
    return NextResponse.json({ logoUrl: null });
  }
}
