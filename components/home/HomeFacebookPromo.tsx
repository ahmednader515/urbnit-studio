import type { HomepageSetting } from "@/lib/types";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { resolveFacebookPromoImageUrl } from "@/lib/homepage-urbnit";
import { urbnitLinkArrow } from "./urbnit-styles";

export function HomeFacebookPromo({
  settings,
  locale,
}: {
  settings: HomepageSetting;
  locale: "ar" | "en";
}) {
  const title = pickLocalizedText(locale, settings.youtubePromoTitle, settings.youtubePromoTitleEn);
  const body = pickLocalizedText(locale, settings.youtubePromoBody, settings.youtubePromoBodyEn);
  const cta = pickLocalizedText(locale, settings.youtubePromoCtaText, settings.youtubePromoCtaTextEn);
  const href = settings.facebookUrl || "https://facebook.com";
  const imageUrl = resolveFacebookPromoImageUrl(settings.youtubePromoImageUrl);

  return (
    <section className="border-t border-neutral-100 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#1877F2]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-90"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1877F2] to-[#0d65d9]" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lg">
              <span className="text-4xl font-bold text-[#1877F2]">f</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">{body}</p>
          {cta ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={`${urbnitLinkArrow} mt-8`}>
              {cta} <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
