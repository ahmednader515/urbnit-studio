import { getHomepageSettings, getStoreFeatureEnabled, listStoreProductsPublic, listStudentStorePurchases, userHasActivePlatformSubscription, getLatestPlatformSubscriptionExpiry } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PacksBrowseClient } from "../packs/PacksBrowseClient";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { pickLocalizedText } from "@/lib/i18n/localized-field";

function shownResourcesTitle(value: string | null | undefined, fallback: string) {
  const text = value?.trim() || "";
  if (!text || text === "Packs" || text === "الحزم" || text === "Library Tools" || text === "مكتبة الأدوات") {
    return fallback;
  }
  return text;
}

export default async function ResourcesPage() {
  const [settings, session, locale, storeEnabled] = await Promise.all([
    getHomepageSettings().catch(() => null),
    getServerSession(authOptions),
    getLocaleFromCookie(),
    getStoreFeatureEnabled().catch(() => false),
  ]);
  const products = await listStoreProductsPublic().catch(() => []);

  let isSubscribed = false;
  let purchasedProductIds: string[] = [];
  if (session?.user?.role === "STUDENT" && session.user.id) {
    const active = await userHasActivePlatformSubscription(session.user.id).catch(() => false);
    if (active) {
      const exp = await getLatestPlatformSubscriptionExpiry(session.user.id).catch(() => null);
      isSubscribed = !!exp;
    }
    const purchases = await listStudentStorePurchases(session.user.id).catch(() => []);
    purchasedProductIds = purchases.map((p) => p.productId);
  }

  const title =
    locale === "ar"
      ? shownResourcesTitle(settings?.packsPageTitle, "المصادر")
      : shownResourcesTitle(settings?.packsPageTitleEn, "Resources");
  const subtitle = pickLocalizedText(locale, settings?.packsPageSubtitle, settings?.packsPageSubtitleEn) || "";
  const description = pickLocalizedText(locale, settings?.packsPageDescription, settings?.packsPageDescriptionEn) || "";

  if (!storeEnabled) {
    return (
      <section className="bg-[#F5F5F5] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-xl border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            {locale === "ar" ? "المصادر غير متاحة الآن" : "Resources are not available right now"}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <PacksBrowseClient
      title={title}
      subtitle={subtitle}
      description={description}
      products={products}
      isSubscribed={isSubscribed}
      isLoggedIn={!!session}
      purchasedProductIds={purchasedProductIds}
    />
  );
}
