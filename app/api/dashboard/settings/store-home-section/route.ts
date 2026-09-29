import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { updateHomepageSettings } from "@/lib/db";

const TITLE_MAX = 200;
const SUBTITLE_MAX = 500;
const DESC_MAX = 3000;

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  let body: {
    title?: unknown;
    titleEn?: unknown;
    subtitle?: unknown;
    subtitleEn?: unknown;
    description?: unknown;
    descriptionEn?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
  const titleRaw = typeof body.title === "string" ? body.title.trim() : "";
  const titleEnRaw = typeof body.titleEn === "string" ? body.titleEn.trim() : "";
  const subtitleRaw = typeof body.subtitle === "string" ? body.subtitle.trim() : "";
  const subtitleEnRaw = typeof body.subtitleEn === "string" ? body.subtitleEn.trim() : "";
  const descRaw = typeof body.description === "string" ? body.description.trim() : "";
  const descEnRaw = typeof body.descriptionEn === "string" ? body.descriptionEn.trim() : "";
  if (!titleRaw) {
    return NextResponse.json({ error: "العنوان العربي مطلوب" }, { status: 400 });
  }
  try {
    await updateHomepageSettings({
      packs_page_title: titleRaw.slice(0, TITLE_MAX),
      packs_page_title_en: titleEnRaw ? titleEnRaw.slice(0, TITLE_MAX) : null,
      packs_page_subtitle: subtitleRaw ? subtitleRaw.slice(0, SUBTITLE_MAX) : null,
      packs_page_subtitle_en: subtitleEnRaw ? subtitleEnRaw.slice(0, SUBTITLE_MAX) : null,
      packs_page_description: descRaw ? descRaw.slice(0, DESC_MAX) : null,
      packs_page_description_en: descEnRaw ? descEnRaw.slice(0, DESC_MAX) : null,
    });
  } catch (e) {
    console.error("store-home-section PATCH", e);
    return NextResponse.json(
      { error: "تعذر الحفظ. نفّذ سكربت SQL لإضافة الأعمدة إن لزم." },
      { status: 500 },
    );
  }
  revalidatePath("/resources");
  return NextResponse.json({ success: true });
}
