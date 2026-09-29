import { getCoursesPublished, getTeacherIdsExcludedFromPublicCourseLists, getUserById } from "@/lib/db";
import { redirect } from "next/navigation";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { CoursesPageGrid } from "@/components/courses/CoursesPageGrid";

export const revalidate = 60;

type Props = { searchParams: Promise<{ teacher?: string }> };

export default async function WorkshopsPage({ searchParams }: Props) {
  const [locale, { teacher: teacherId }] = await Promise.all([
    getLocaleFromCookie(),
    searchParams,
  ]);

  let courses: Awaited<ReturnType<typeof getCoursesPublished>> = [];
  try {
    courses = await getCoursesPublished(true);
  } catch {
    /* DB not connected */
  }

  courses = courses.filter((c) => (c as { kind?: string | null }).kind === "workshop");

  const hideTeacherCreators = await getTeacherIdsExcludedFromPublicCourseLists();

  let teacherName: string | null = null;
  const tid = teacherId?.trim();
  if (tid) {
    const u = await getUserById(tid).catch(() => null);
    if (!u || u.role !== "TEACHER") redirect("/workshops");
    teacherName = u.name ?? null;
  }

  let filtered = courses;
  if (tid) {
    filtered = filtered.filter((c) => {
      const row = c as { createdById?: string | null; created_by_id?: string | null };
      const creator = row.createdById ?? row.created_by_id ?? null;
      return creator === tid;
    });
  } else if (hideTeacherCreators.size > 0) {
    filtered = filtered.filter((c) => {
      const row = c as { createdById?: string | null; created_by_id?: string | null };
      const creator = row.createdById ?? row.created_by_id ?? null;
      return !creator || !hideTeacherCreators.has(creator);
    });
  }

  const pageTitle = teacherName
    ? `${locale === "ar" ? "ورش" : "Workshops by"} ${teacherName}`
    : locale === "ar"
      ? "ورش العمل"
      : "Workshops";

  const gridCourses = filtered.map((c) => {
    const row = c as typeof c & {
      titleAr?: string | null;
      shortDesc?: string | null;
      shortDescEn?: string | null;
      imageUrl?: string | null;
      softwareTools?: string | null;
    };
    const text = (value: unknown) => {
      const s = value == null ? "" : String(value).trim();
      return s || null;
    };
    return {
      id: String(c.id),
      title: String(c.title ?? ""),
      titleAr: text(row.titleAr ?? c.title_ar),
      slug: c.slug ? String(c.slug) : null,
      shortDesc: text(row.shortDesc ?? c.short_desc),
      shortDescEn: text(row.shortDescEn ?? c.short_desc_en),
      imageUrl: text(row.imageUrl ?? c.image_url),
      price: c.price,
      softwareTools: text(row.softwareTools ?? c.software_tools),
    };
  });

  return (
    <section className="bg-[#F5F5F5] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">{pageTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg text-neutral-600">
          {locale === "ar"
            ? "ورش عمل تتبع نفس نظام الدورات: دروس، اختبارات، وتسجيل."
            : "Workshops use the same course system: lessons, quizzes, and enrollment."}
        </p>

        {gridCourses.length > 0 ? (
          <div className="mt-12">
            <CoursesPageGrid courses={gridCourses} afterEnrollHref="/workshops" />
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
            {locale === "ar" ? "لا توجد ورش منشورة حالياً." : "No published workshops yet."}
          </div>
        )}
      </div>
    </section>
  );
}
