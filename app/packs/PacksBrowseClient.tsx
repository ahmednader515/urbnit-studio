"use client";

import { useMemo, useState } from "react";
import type { StoreProductRow } from "@/lib/db";
import { PACK_CATEGORIES } from "@/lib/homepage-urbnit";
import { useLocale, useT } from "@/components/LocaleProvider";
import { urbnitBtnPrimary } from "@/components/home/urbnit-styles";

export function PacksBrowseClient({
  title,
  subtitle,
  description,
  products,
  isSubscribed,
  isLoggedIn,
  purchasedProductIds,
}: {
  title: string;
  subtitle: string;
  description: string;
  products: StoreProductRow[];
  isSubscribed: boolean;
  isLoggedIn: boolean;
  purchasedProductIds: string[];
}) {
  const locale = useLocale();
  const t = useT();
  const [category, setCategory] = useState("all");
  const [ownedIds, setOwnedIds] = useState<string[]>(purchasedProductIds);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (category === "all") return products;
    if (category === "free") return products.filter((p) => p.isFree || p.price === 0);
    return products.filter((p) => (p.category || "").toLowerCase() === category);
  }, [products, category]);

  async function buy(productId: string) {
    setError("");
    setLoadingId(productId);
    try {
      const res = await fetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Purchase failed");
      setOwnedIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Purchase failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="bg-[#F5F5F5] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-lg font-semibold text-neutral-800">{subtitle}</p> : null}
        {description ? <p className="mt-3 max-w-3xl text-neutral-600">{description}</p> : null}

        <div className="mt-10 flex flex-wrap gap-6 border-b border-neutral-300 pb-3">
          {PACK_CATEGORIES.map((cat) => {
            const label = locale === "en" ? cat.labelEn : cat.labelAr;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`pb-2 text-sm font-medium transition ${
                  active
                    ? "border-b-2 border-neutral-900 text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => {
            const owned = ownedIds.includes(p.id) || isSubscribed;
            const showFree = p.isFree || p.price === 0;
            return (
              <article key={p.id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-neutral-100 text-neutral-400">Pack</div>
                  )}
                  {p.isNew ? (
                    <span className="absolute start-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                      NEW!
                    </span>
                  ) : null}
                  {p.badgeText ? (
                    <span className="absolute start-2 top-2 rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-neutral-900">
                      {p.badgeText}
                    </span>
                  ) : null}
                  <span
                    className={`absolute end-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold ${
                      showFree ? "bg-white text-[#0066FF]" : "bg-[#0066FF] text-white"
                    }`}
                  >
                    {showFree ? (locale === "ar" ? "مجاني" : "Free") : `$ ${p.price}`}
                  </span>
                </div>
                <h3 className="mt-3 text-center text-sm font-medium text-neutral-900">{p.title}</h3>
                <div className="mt-2 flex justify-center">
                  {!isLoggedIn ? (
                    <a href="/login" className={urbnitBtnPrimary + " text-xs px-4 py-2"}>
                      {t("header.signIn", "Sign In")}
                    </a>
                  ) : owned && p.pdfUrl ? (
                    <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className={urbnitBtnPrimary + " text-xs px-4 py-2"}>
                      {locale === "ar" ? "تحميل" : "Download"}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled={loadingId === p.id}
                      onClick={() => buy(p.id)}
                      className={urbnitBtnPrimary + " text-xs px-4 py-2 disabled:opacity-60"}
                    >
                      {loadingId === p.id
                        ? "..."
                        : locale === "ar"
                          ? "شراء"
                          : "Buy"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 text-center text-neutral-500">
            {locale === "ar" ? "لا توجد حزم في هذا التصنيف." : "No packs in this category."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
