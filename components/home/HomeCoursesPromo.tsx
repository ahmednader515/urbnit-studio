import Link from "next/link";
import type { HomepageSetting } from "@/lib/types";
import { resolveCoursesPromoImages } from "@/lib/homepage-urbnit";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { urbnitLinkArrow } from "./urbnit-styles";

export function HomeCoursesPromo({
  settings,
  locale,
}: {
  settings: HomepageSetting;
  locale: "ar" | "en";
}) {
  const images = resolveCoursesPromoImages(settings.coursesPromoImages, 4);
  const title = pickLocalizedText(locale, settings.coursesPromoTitle, settings.coursesPromoTitleEn);
  const body = pickLocalizedText(locale, settings.coursesPromoBody, settings.coursesPromoBodyEn);
  const cta = pickLocalizedText(locale, settings.coursesPromoCtaText, settings.coursesPromoCtaTextEn);
  const href = settings.coursesPromoCtaHref || "/courses";

  return (
    <section className="border-t border-neutral-100 bg-[#F5F5F5] py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden rounded-xl bg-neutral-200">
              {images[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[i]} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : null}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">{body}</p>
          {cta ? (
            <Link href={href} className={`${urbnitLinkArrow} mt-8`}>
              {cta} <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
