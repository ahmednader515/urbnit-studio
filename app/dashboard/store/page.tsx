import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  getStoreFeatureEnabled,
  getHomepageSettings,
  listStoreProductsAll,
  listStorePurchasesForAdmin,
  getStoreSalesStats,
} from "@/lib/db";
import { StoreAdminClient } from "./StoreAdminClient";

function shownPageTitle(value: string | null | undefined, fallback: string) {
  const text = value?.trim() || "";
  if (!text || text === "Packs" || text === "الحزم" || text === "Library Tools" || text === "مكتبة الأدوات") {
    return fallback;
  }
  return text;
}

export default async function StoreDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const [enabled, homepage] = await Promise.all([
    getStoreFeatureEnabled(),
    getHomepageSettings().catch(() => null),
  ]);
  const [products, purchases, stats] = await Promise.all([
    listStoreProductsAll().catch(() => []),
    listStorePurchasesForAdmin().catch(() => []),
    getStoreSalesStats().catch(() => ({
      purchasesCount: 0,
      buyersCount: 0,
      soldProductsCount: 0,
      revenue: 0,
      totalCost: 0,
      totalProfit: 0,
      profitMarginPercent: null,
      byProduct: [],
    })),
  ]);

  const initialHomeStoreTitle = shownPageTitle(homepage?.packsPageTitle, "المصادر");
  const initialHomeStoreTitleEn = shownPageTitle(homepage?.packsPageTitleEn, "Resources");
  const initialHomeStoreSubtitle = homepage?.packsPageSubtitle?.trim() || "";
  const initialHomeStoreSubtitleEn = homepage?.packsPageSubtitleEn?.trim() || "";
  const initialHomeStoreDescription = homepage?.packsPageDescription?.trim() || "";
  const initialHomeStoreDescriptionEn = homepage?.packsPageDescriptionEn?.trim() || "";

  return (
    <StoreAdminClient
      initialEnabled={enabled}
      initialHomeStoreTitle={initialHomeStoreTitle}
      initialHomeStoreTitleEn={initialHomeStoreTitleEn}
      initialHomeStoreSubtitle={initialHomeStoreSubtitle}
      initialHomeStoreSubtitleEn={initialHomeStoreSubtitleEn}
      initialHomeStoreDescription={initialHomeStoreDescription}
      initialHomeStoreDescriptionEn={initialHomeStoreDescriptionEn}
      initialProducts={products}
      initialPurchases={purchases}
      initialStats={stats}
    />
  );
}
