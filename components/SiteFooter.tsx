import Link from "next/link";
import type { HomepageSetting } from "@/lib/types";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { getLocaleFromCookie } from "@/lib/i18n/server";

export async function SiteFooter({ settings }: { settings?: HomepageSetting | null }) {
  const locale = await getLocaleFromCookie();
  const mission = pickLocalizedText(locale, settings?.footerMission, settings?.footerMissionEn);
  const copyright = pickLocalizedText(locale, settings?.footerCopyright, settings?.footerCopyrightEn);
  const platformName = pickLocalizedText(locale, settings?.platformName, settings?.platformNameEn) || "urbnit studio";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex justify-end">
          <a href="#" className="text-sm text-neutral-400 transition hover:text-white">
            {locale === "ar" ? "العودة للأعلى ↑" : "Back to top ↑"}
          </a>
        </div>
        <div className="mt-8 grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">{locale === "ar" ? "تابعنا" : "Follow us"}</p>
            <div className="mt-4 flex gap-4">
              {settings?.facebookUrl ? (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white" aria-label="Facebook">
                  FB
                </a>
              ) : null}
              {settings?.instagramUrl ? (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white" aria-label="Instagram">
                  IG
                </a>
              ) : null}
              {settings?.pinterestUrl ? (
                <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white" aria-label="Pinterest">
                  Pin
                </a>
              ) : null}
            </div>
            <p className="mt-4 text-xs text-neutral-500">EN / AR</p>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-neutral-300">{mission}</p>
            <p className="mt-4 text-xs text-neutral-500">
              ©{year} — {copyright}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-2">
              <Link href="/courses" className="text-neutral-400 hover:text-white">
                {locale === "ar" ? "الدورات" : "Courses"}
              </Link>
              <Link href="/packs" className="text-neutral-400 hover:text-white">
                {locale === "ar" ? "الحزم" : "Packs"}
              </Link>
              <Link href="/about" className="text-neutral-400 hover:text-white">
                {locale === "ar" ? "من نحن" : "About"}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-neutral-400 hover:text-white">
                {locale === "ar" ? "الخصوصية" : "Privacy"}
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white">
                {locale === "ar" ? "الشروط" : "Terms"}
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-12 text-center text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
          {platformName.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}
