import { getHomepageSettings, listHomepageFaqs } from "@/lib/db";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCoursesPromo } from "@/components/home/HomeCoursesPromo";
import { HomePacksPromo } from "@/components/home/HomePacksPromo";
import { HomeFacebookPromo } from "@/components/home/HomeFacebookPromo";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeWhatsappFab } from "@/components/home/HomeWhatsappFab";

/** إعادة توليد الصفحة كل دقيقة — أسرع من force-dynamic الكامل */
export const revalidate = 60;

export default async function HomePage() {
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
