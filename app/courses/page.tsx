import { unstable_noStore } from "next/cache";
import { getCoursesPublished, getHomepageSettings, getTeacherIdsExcludedFromPublicCourseLists, getUserById } from "@/lib/db";
import { redirect } from "next/navigation";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { CoursesPageGrid } from "@/components/courses/CoursesPageGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { searchParams: Promise<{ category?: string; teacher?: string }> };

export default async function CoursesPage({ searchParams }: Props) {
  unstable_noStore();
  const [locale, settings, { category: categorySlug, teacher: teacherId }] = await Promise.all([
    getLocaleFromCookie(),
    getHomepageSettings().catch(() => null),
    searchParams,
  ]);

  let courses: Awaited<ReturnType<typeof getCoursesPublished>> = [];
  try {
    courses = await getCoursesPublished(true);
  } catch {
    /* DB not connected */
  }

  const hideTeacherCreators = await getTeacherIdsExcludedFromPublicCourseLists();

  let teacherName: string | null = null;
  const tid = teacherId?.trim();
  if (tid) {
    const u = await getUserById(tid).catch(() => null);
    if (!u || u.role !== "TEACHER") redirect("/courses");
    teacherName = u.name ?? null;
  }

  let filtered =
    categorySlug?.trim()
      ? courses.filter((c) => (c as { category?: { slug?: string } }).category?.slug === categorySlug.trim())
      : courses;

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

  const pageTitle =
    teacherName
      ? `${locale === "ar" ? "دورات" : "Courses by"} ${teacherName}`
      : pickLocalizedText(locale, settings?.coursesPageTitle, settings?.coursesPageTitleEn) || (locale === "ar" ? "الدورات" : "Courses");

  const pageIntro = pickLocalizedText(locale, settings?.coursesPageIntro, settings?.coursesPageIntroEn) || "";

  const gridCourses = filtered.map((c) => ({
    id: String(c.id),
    title: String(c.title ?? ""),
    titleAr: c.title_ar ? String(c.title_ar) : null,
    slug: c.slug ? String(c.slug) : null,
    shortDesc: c.short_desc ? String(c.short_desc) : null,
    shortDescEn: c.short_desc_en ? String(c.short_desc_en) : null,
    imageUrl: c.image_url ? String(c.image_url) : null,
    price: c.price,
    softwareTools: c.software_tools ? String(c.software_tools) : null,
  }));

  return (
    <section className="bg-[#F5F5F5] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">{pageTitle}</h1>
        {pageIntro ? <p className="mt-4 max-w-3xl text-lg text-neutral-600">{pageIntro}</p> : null}

        {gridCourses.length > 0 ? (
          <div className="mt-12">
            <CoursesPageGrid courses={gridCourses} />
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
            {locale === "ar" ? "لا توجد دورات منشورة حالياً." : "No published courses yet."}
          </div>
        )}
      </div>
    </section>
  );
}
