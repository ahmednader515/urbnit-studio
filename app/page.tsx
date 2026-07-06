import { unstable_noStore } from "next/cache";
import { getHomepageSettings, listHomepageFaqs } from "@/lib/db";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCoursesPromo } from "@/components/home/HomeCoursesPromo";
import { HomePacksPromo } from "@/components/home/HomePacksPromo";
import { HomeFacebookPromo } from "@/components/home/HomeFacebookPromo";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeWhatsappFab } from "@/components/home/HomeWhatsappFab";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  unstable_noStore();
  const [locale, settings, faqs] = await Promise.all([
    getLocaleFromCookie(),
    getHomepageSettings(),
    listHomepageFaqs(),
  ]);

  return (
    <div className="bg-white">
      <HomeHero settings={settings} locale={locale} />
      <HomeCoursesPromo settings={settings} locale={locale} />
      <HomePacksPromo settings={settings} locale={locale} />
      <HomeFacebookPromo settings={settings} locale={locale} />
      <HomeFaq settings={settings} faqs={faqs} />
      <HomeWhatsappFab whatsappUrl={settings.whatsappUrl} />
    </div>
  );
}
