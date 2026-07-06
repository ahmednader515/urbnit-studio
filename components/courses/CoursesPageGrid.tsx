"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { parseSoftwareTools } from "@/lib/homepage-urbnit";
import { urbnitBtnPrimary, urbnitLinkArrow } from "@/components/home/urbnit-styles";

export type CourseGridItem = {
  id: string;
  title: string;
  titleAr?: string | null;
  slug?: string | null;
  shortDesc?: string | null;
  shortDescEn?: string | null;
  imageUrl?: string | null;
  price?: number | string;
  softwareTools?: string | null;
};

function normalizePrice(price: number | string | undefined): number {
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

function CourseEnrollButton({ courseId, price }: { courseId: string; price: number }) {
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function enroll() {
    setLoading(true);
    const res = await fetch(`/api/enroll?courseId=${encodeURIComponent(courseId)}`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.push(`/courses`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? (locale === "ar" ? "فشل التسجيل" : "Enrollment failed"));
    }
  }

  return (
    <button type="button" onClick={enroll} disabled={loading} className={urbnitBtnPrimary + " text-sm"}>
      {loading ? "..." : locale === "ar" ? "سجّل الآن!" : "Enroll Now!"}
    </button>
  );
}

export function CoursesPageGrid({ courses }: { courses: CourseGridItem[] }) {
  const locale = useLocale();

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const title = locale === "en" ? course.title || course.titleAr : course.titleAr || course.title;
        const desc = locale === "en" ? course.shortDescEn || course.shortDesc : course.shortDesc || course.shortDescEn;
        const slug = course.slug?.trim() ? encodeURIComponent(course.slug.trim()) : course.id;
        const href = `/courses/${slug}`;
        const price = normalizePrice(course.price);
        const tools = parseSoftwareTools(course.softwareTools ?? null);

        return (
          <article key={course.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="aspect-video bg-neutral-100">
              {course.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
              {tools.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tools.map((tool) =>
                    tool.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={tool.id} src={tool.iconUrl} alt={tool.label} title={tool.label} className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <span key={tool.id} className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                        {tool.label}
                      </span>
                    ),
                  )}
                </div>
              ) : null}
              {desc ? <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{desc}</p> : null}
              <p className="mt-4 text-lg font-bold text-neutral-900">$ {price.toFixed(0)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <CourseEnrollButton courseId={course.id} price={price} />
                <Link href={href} className={urbnitLinkArrow}>
                  {locale === "ar" ? "اعرف المزيد" : "Learn more"} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
