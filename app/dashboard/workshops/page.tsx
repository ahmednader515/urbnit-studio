import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getCoursesWithCounts } from "@/lib/db";
import { getServerTranslator } from "@/lib/i18n/server";
import { CoursesManageList } from "../courses/CoursesManageList";

export default async function DashboardWorkshopsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN") redirect("/dashboard");
  const t = await getServerTranslator();
  const courses = await getCoursesWithCounts();

  const workshops = courses
    .filter((c) => String((c as { kind?: string | null }).kind ?? "course") === "workshop")
    .map((c) => {
      const row = c as Record<string, unknown>;
      const cat = row.category as { id: string; name: string; nameAr?: string | null; slug: string } | null | undefined;
      const rawImg = row.imageUrl ?? row.image_url;
      const imageUrl: string | null = rawImg !== null && rawImg !== undefined && typeof rawImg === "string" ? rawImg : null;
      return {
        id: String(row.id ?? ""),
        title: String(row.title ?? ""),
        titleAr: String(row.titleAr ?? row.title_ar ?? ""),
        slug: String(row.slug ?? ""),
        isPublished: Boolean(row.isPublished ?? row.is_published ?? false),
        price: Number(row.price ?? 0),
        imageUrl,
        lessonsCount: Number(row.lessonsCount ?? 0),
        enrollmentsCount: Number(row.enrollmentsCount ?? 0),
        category: cat ? { id: cat.id, name: cat.name, nameAr: cat.nameAr ?? null } : null,
      };
    });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">
          {t("dashboardNav.workshops", "Workshops")}
        </h2>
        <Link
          href="/dashboard/workshops/new"
          className="rounded-[var(--radius-btn)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          {t("dashboardNav.createWorkshop", "Create workshop")}
        </Link>
      </div>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        {t(
          "dashboard.workshopsIntro",
          "Workshops are regular courses. They appear on the Workshops page instead of Courses.",
        )}
      </p>
      <CoursesManageList courses={workshops} />
    </div>
  );
}
