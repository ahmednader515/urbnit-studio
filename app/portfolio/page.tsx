import { getLocaleFromCookie } from "@/lib/i18n/server";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { listPortfolioProjects } from "@/lib/portfolio";

export const revalidate = 60;

export default async function PortfolioPage() {
  const locale = await getLocaleFromCookie();
  let projects: Awaited<ReturnType<typeof listPortfolioProjects>> = [];
  try {
    projects = await listPortfolioProjects(true);
  } catch {
    projects = [];
  }

  return (
    <section className="bg-[#F5F5F5] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
          {locale === "ar" ? "الأعمال" : "Portfolio"}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-neutral-600">
          {locale === "ar" ? "مشاريع مختارة مع صورها ووصفها." : "Selected projects, with images and descriptions."}
        </p>

        {projects.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
            {locale === "ar" ? "لا توجد مشاريع منشورة حالياً." : "No published projects yet."}
          </div>
        ) : (
          <div className="mt-12 space-y-10">
            {projects.map((project) => {
              const title = pickLocalizedText(locale, project.title, project.titleEn) || project.title;
              const description = pickLocalizedText(locale, project.description, project.descriptionEn);
              return (
                <article key={project.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
                  {description ? (
                    <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-neutral-600">{description}</p>
                  ) : null}
                  {project.images.length > 0 ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {project.images.map((image) => {
                        const caption = pickLocalizedText(locale, image.description, image.descriptionEn);
                        return (
                          <figure key={image.id} className="overflow-hidden rounded-xl bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.imageUrl} alt={caption || title} className="aspect-[4/3] w-full object-cover" />
                            {caption ? (
                              <figcaption className="px-3 py-2 text-sm text-neutral-600">{caption}</figcaption>
                            ) : null}
                          </figure>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
