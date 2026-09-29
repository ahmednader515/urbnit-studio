"use client";

import { useState } from "react";
import type { StoreProductRow } from "@/lib/db";
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
  const [ownedIds, setOwnedIds] = useState<string[]>(purchasedProductIds);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

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

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const owned = ownedIds.includes(p.id) || isSubscribed;
            const showFree = p.isFree || p.price === 0;
            return (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative aspect-square bg-neutral-100">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      {locale === "ar" ? "مصدر" : "Resource"}
                    </div>
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
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-semibold text-neutral-900">{p.title}</h3>
                  {p.description ? (
                    <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-neutral-600">{p.description}</p>
                  ) : null}
                  <div className="mt-4">
                    {!isLoggedIn ? (
                      <a href="/login" className={urbnitBtnPrimary + " text-xs px-4 py-2"}>
                        {t("header.signIn", "Sign In")}
                      </a>
                    ) : owned && p.pdfUrl ? (
                      <a
                        href={p.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className={urbnitBtnPrimary + " inline-flex text-xs px-4 py-2"}
                      >
                        {locale === "ar" ? "تحميل" : "Download"}
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled={loadingId === p.id || !p.pdfUrl}
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
                </div>
              </article>
            );
          })}
        </div>
        {products.length === 0 ? (
          <p className="mt-8 text-center text-neutral-500">
            {locale === "ar" ? "لا توجد مصادر منشورة حالياً." : "No resources published yet."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
