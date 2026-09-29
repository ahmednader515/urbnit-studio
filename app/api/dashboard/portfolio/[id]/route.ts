import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import {
  deletePortfolioProject,
  getPortfolioProject,
  updatePortfolioProject,
  type PortfolioImageInput,
} from "@/lib/portfolio";

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

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  if (!(await requireStaff())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await params;
  const project = await getPortfolioProject(id);
  if (!project) return NextResponse.json({ error: "المشروع غير موجود" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  if (!(await requireStaff())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "عنوان المشروع مطلوب" }, { status: 400 });
  const project = await updatePortfolioProject(id, {
    title,
    titleEn: body?.titleEn,
    description: body?.description,
    descriptionEn: body?.descriptionEn,
    isPublished: body?.isPublished !== false,
    images: readImages(body?.images),
  });
  if (!project) return NextResponse.json({ error: "المشروع غير موجود" }, { status: 404 });
  revalidatePath("/portfolio");
  return NextResponse.json(project);
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  if (!(await requireStaff())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  const { id } = await params;
  await deletePortfolioProject(id);
  revalidatePath("/portfolio");
  return NextResponse.json({ ok: true });
}
