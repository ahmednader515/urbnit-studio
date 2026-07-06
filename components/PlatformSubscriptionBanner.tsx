"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useT } from "@/components/LocaleProvider";

/** يُحمّل بعد عرض الصفحة — لا يبطئ الـ SSR لكل زائر */
export function PlatformSubscriptionBanner() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const t = useT();
  const [expiryLabel, setExpiryLabel] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "STUDENT") {
      setExpiryLabel(null);
      return;
    }

    let cancelled = false;
    fetch("/api/user/platform-subscription", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { active?: boolean; expiresAt?: string | null } | null) => {
        if (cancelled || !data?.active) {
          if (!cancelled) setExpiryLabel(null);
          return;
        }
        if (data.expiresAt) {
          setExpiryLabel(
            new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(data.expiresAt)),
          );
        } else {
          setExpiryLabel(t("header.active", "نشط"));
        }
      })
      .catch(() => {
        if (!cancelled) setExpiryLabel(null);
      });

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.role, locale, t]);

  if (!expiryLabel) return null;

  return (
    <div className="border-t border-teal-200 bg-teal-50 py-2 text-center text-xs text-teal-900">
      {t("header.platformSubscriptionActive", "You are subscribed to the platform subscription")} —{" "}
      {t("header.endsAt", "Expires at:")} {expiryLabel}
    </div>
  );
}
