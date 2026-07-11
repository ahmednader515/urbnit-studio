import Link from "next/link";
import type { HomepageSetting } from "@/lib/types";
import { resolveHeroGalleryImages, resolveHeroTeacherImages } from "@/lib/homepage-urbnit";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { urbnitBtnOutline, urbnitBtnPrimary } from "./urbnit-styles";

const HERO_BG_LAYOUT = [
  { className: "top-[3%] start-[1%] h-32 w-32 -rotate-6 md:h-44 md:w-44", mobile: true },
  { className: "top-[6%] end-[2%] h-28 w-28 rotate-12 md:h-40 md:w-40", mobile: true },
  { className: "top-[36%] start-[5%] h-36 w-36 rotate-3 md:h-48 md:w-48", mobile: true },
  { className: "bottom-[14%] end-[3%] h-32 w-32 -rotate-12 md:h-44 md:w-44", mobile: true },
  { className: "top-[20%] end-[26%] h-28 w-28 rotate-6 md:h-36 md:w-36", mobile: false },
  { className: "bottom-[4%] start-[14%] h-32 w-32 -rotate-3 md:h-40 md:w-40", mobile: false },
  { className: "top-[50%] end-[1%] h-36 w-36 rotate-12 md:h-48 md:w-48", mobile: false },
  { className: "bottom-[28%] start-[1%] h-28 w-28 -rotate-6 md:h-36 md:w-36", mobile: false },
  { className: "bottom-[2%] end-[22%] h-28 w-28 rotate-9 md:h-36 md:w-36", mobile: false },
  { className: "top-[58%] start-[22%] h-24 w-24 -rotate-9 md:h-32 md:w-32", mobile: false },
  { className: "top-[12%] start-[28%] h-24 w-24 rotate-3 md:h-32 md:w-32", mobile: false },
  { className: "bottom-[40%] end-[18%] h-28 w-28 -rotate-3 md:h-36 md:w-36", mobile: false },
] as const;

export function HomeHero({
  settings,
  locale,
}: {
  settings: HomepageSetting;
  locale: "ar" | "en";
}) {
  const title = pickLocalizedText(locale, settings.heroTitle, settings.heroTitleEn);
  const subtitle = pickLocalizedText(locale, settings.heroSlogan, settings.heroSloganEn);
  const ctaPrimary = pickLocalizedText(
    locale,
    settings.heroCtaPrimaryText,
    settings.heroCtaPrimaryTextEn,
  );
  const ctaSecondary = pickLocalizedText(
    locale,
    settings.heroCtaSecondaryText,
    settings.heroCtaSecondaryTextEn,
  );
  const gallery = resolveHeroGalleryImages(settings.heroGalleryImages, HERO_BG_LAYOUT.length);
  const [teacher1, teacher2] = resolveHeroTeacherImages(settings);

  return (
    <section className="relative overflow-hidden bg-neutral-50">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {gallery.map((src, i) => {
          const layout = HERO_BG_LAYOUT[i];
          if (!layout) return null;
          return (
            <div
              key={`${src}-${i}`}
              className={`absolute overflow-hidden rounded-2xl opacity-100 shadow-md ring-1 ring-black/5 ${layout.className} ${layout.mobile ? "" : "hidden md:block"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-neutral-50/45 to-neutral-50/75" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <div className="text-start">
          <h1 className="text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {ctaPrimary && settings.heroCtaPrimaryHref ? (
              <Link href={settings.heroCtaPrimaryHref} className={urbnitBtnPrimary}>
                {ctaPrimary}
              </Link>
            ) : null}
            {ctaSecondary && settings.heroCtaSecondaryHref ? (
              <Link href={settings.heroCtaSecondaryHref} className={urbnitBtnOutline}>
                {ctaSecondary}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-[4/5] w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="absolute end-0 top-0 z-0 h-[78%] w-[72%] overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-neutral-200/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={teacher2}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute bottom-0 start-0 z-10 h-[72%] w-[68%] overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl shadow-neutral-300/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={teacher1}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-2 end-8 z-20 hidden h-16 w-16 rounded-2xl bg-[#0066FF]/10 md:block" />
            <div className="absolute -top-3 start-6 z-20 hidden h-12 w-12 rounded-full bg-[#0066FF]/15 md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
