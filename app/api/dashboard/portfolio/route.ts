import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { createPortfolioProject, listPortfolioProjects, type PortfolioImageInput } from "@/lib/portfolio";

async function requireStaff() {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;
  if (!session || (role !== "ADMIN" && role !== "ASSISTANT_ADMIN")) return null;
  return session;
}

function readImages(value: unknown): PortfolioImageInput[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        imageUrl: String(row.imageUrl ?? row.image_url ?? "").trim(),
        description: row.description == null ? null : String(row.description),
        descriptionEn: row.descriptionEn == null ? null : String(row.descriptionEn),
      };
    })
    .filter((item) => item.imageUrl);
}

export async function GET() {
  if (!(await requireStaff())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const projects = await listPortfolioProjects(false);
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  if (!(await requireStaff())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "عنوان المشروع مطلوب" }, { status: 400 });
  const project = await createPortfolioProject({
    title,
    titleEn: body?.titleEn,
    description: body?.description,
    descriptionEn: body?.descriptionEn,
    isPublished: body?.isPublished !== false,
    images: readImages(body?.images),
  });
  revalidatePath("/portfolio");
  return NextResponse.json(project);
}
