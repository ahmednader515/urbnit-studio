import Link from "next/link";
import type { HomepageSetting } from "@/lib/types";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { resolvePacksPromoImageUrl } from "@/lib/homepage-urbnit";
import { urbnitLinkArrow } from "./urbnit-styles";

export function HomePacksPromo({
  settings,
  locale,
}: {
  settings: HomepageSetting;
  locale: "ar" | "en";
}) {
  const title = pickLocalizedText(locale, settings.packsPromoTitle, settings.packsPromoTitleEn);
  const body = pickLocalizedText(locale, settings.packsPromoBody, settings.packsPromoBodyEn);
  const cta = pickLocalizedText(locale, settings.packsPromoCtaText, settings.packsPromoCtaTextEn);
  const href = settings.packsPromoCtaHref || "/packs";
  const imageUrl = resolvePacksPromoImageUrl(settings.packsPromoImageUrl);

  return (
    <section className="border-t border-neutral-100 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
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
        <div className="order-1 lg:order-2">
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F5F5]">
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
