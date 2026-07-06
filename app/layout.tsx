import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { SessionProvider } from "@/components/SessionProvider";
import { InspectGuardLazy } from "@/components/InspectGuardLazy";
import { ForceLogoutGuard } from "@/components/ForceLogoutGuard";
import { getHomepageSettings } from "@/lib/db";
import { normalizeHeroHex } from "@/lib/hero-bg";
import { getDir, makeTranslator } from "@/lib/i18n/core";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { LocaleProvider } from "@/components/LocaleProvider";
import { homepageDefaultForLocale } from "@/lib/homepage-default-for-locale";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import {
  HOMEPAGE_DEFAULT_FOOTER_COPYRIGHT_AR,
  HOMEPAGE_DEFAULT_FOOTER_TAGLINE_AR,
  HOMEPAGE_DEFAULT_FOOTER_TITLE_AR,
} from "@/lib/homepage-known-defaults";
import { fontVariables } from "@/lib/fonts";
import { resolveHeaderLogoUrl, resolvePageTitle } from "@/lib/homepage-urbnit";
import {
  URBNIT_DEFAULT_HEADER_LOGO,
  URBNIT_PAGE_TITLE_AR,
  URBNIT_PAGE_TITLE_EN,
} from "@/lib/homepage-known-defaults";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  const defaultTitle = locale === "ar" ? URBNIT_PAGE_TITLE_AR : URBNIT_PAGE_TITLE_EN;
  const defaultDescription =
    locale === "ar"
      ? "منصة urbnit studio للتمثيل المعماري والتصور البصري"
      : "urbnit studio — architectural representation and visualization";
  try {
    const settings = await getHomepageSettings();
    const title = resolvePageTitle(locale, settings.pageTitle, settings.pageTitleEn);
    return { title, description: defaultDescription };
  } catch {
    return { title: defaultTitle, description: defaultDescription };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookie();
  const dir = getDir(locale);
  const t = makeTranslator(locale);
  let platformName: string | null = null;
  let headerLogoUrl: string = URBNIT_DEFAULT_HEADER_LOGO;
  let platformPrimaryColor: string | null = null;
  let footerTitle = t("footer.defaultTitle", "urbnit studio");
  let footerTagline = t("footer.defaultTagline", "تعلّم التمثيل المعماري والتصور البصري");
  let footerCopyright = t("footer.defaultCopyright", "urbnit studio. جميع الحقوق محفوظة.");
  let homepageSettings: Awaited<ReturnType<typeof getHomepageSettings>> | null = null;
  try {
    const settings = await getHomepageSettings();
    homepageSettings = settings;
    platformName = pickLocalizedText(locale, settings.platformName, settings.platformNameEn) || null;
    headerLogoUrl = resolveHeaderLogoUrl(settings.headerLogoUrl);
    platformPrimaryColor = normalizeHeroHex(String(settings.primaryColor ?? "")) ?? null;
    const rawFooterTitle = pickLocalizedText(locale, settings.footerTitle, settings.footerTitleEn);
    const rawFooterTagline = pickLocalizedText(locale, settings.footerTagline, settings.footerTaglineEn);
    const rawFooterCopyright = pickLocalizedText(locale, settings.footerCopyright, settings.footerCopyrightEn);
    footerTitle = homepageDefaultForLocale(
      locale,
      rawFooterTitle,
      HOMEPAGE_DEFAULT_FOOTER_TITLE_AR,
      "footer.defaultTitle",
      t,
      "urbnit studio",
    );
    footerTagline = homepageDefaultForLocale(
      locale,
      rawFooterTagline,
      HOMEPAGE_DEFAULT_FOOTER_TAGLINE_AR,
      "footer.defaultTagline",
      t,
      "Learn architectural representation and visualization",
    );
    footerCopyright = homepageDefaultForLocale(
      locale,
      rawFooterCopyright,
      HOMEPAGE_DEFAULT_FOOTER_COPYRIGHT_AR,
      "footer.defaultCopyright",
      t,
      "urbnit studio. All rights reserved.",
    );
  } catch {
    // استخدام الافتراضي في الهيدر والفوتر
  }

  return (
    <html lang={locale} dir={dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.classList.add("light");})();`,
          }}
        />
        {platformPrimaryColor ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root{--platform-primary:${platformPrimaryColor};}`,
            }}
          />
        ) : null}
        </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NextTopLoader
          color={platformPrimaryColor ?? "#0066FF"}
          height={3}
          showSpinner={false}
          easing="ease"
          speed={300}
          shadow="0 0 10px rgba(0,102,255,0.25)"
        />
        <LocaleProvider locale={locale}>
          <SessionProvider>
            <InspectGuardLazy />
            <ForceLogoutGuard />
            <Header
              platformName={platformName}
              headerLogoUrl={headerLogoUrl}
              facebookUrl={homepageSettings?.facebookUrl}
            />
            <main className="flex-1">{children}</main>
            <SiteFooter settings={homepageSettings} />
          </SessionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
