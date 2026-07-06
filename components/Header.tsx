"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import type { UserRole } from "@/lib/types";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PlatformSubscriptionBanner } from "@/components/PlatformSubscriptionBanner";
import { useT, useLocalizedEnumValue } from "@/components/LocaleProvider";
import { resolveHeaderLogoUrl } from "@/lib/homepage-urbnit";

function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status !== "authenticated" || !session?.user) return null;

  const roleLabel: Record<UserRole, string> = {
    ADMIN: useLocalizedEnumValue("ADMIN", "header.role", "Admin"),
    ASSISTANT_ADMIN: useLocalizedEnumValue("ASSISTANT_ADMIN", "header.role", "Assistant admin"),
    STUDENT: useLocalizedEnumValue("STUDENT", "header.role", "Student"),
    TEACHER: useLocalizedEnumValue("TEACHER", "header.role", "Teacher"),
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-neutral-900 hover:opacity-70"
      >
        {session.user.name}
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-2 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          <div className="border-b border-neutral-100 px-3 py-2 text-xs text-neutral-500">
            {roleLabel[session.user.role]}
          </div>
          <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>
            {t("header.dashboard", "Dashboard")}
          </Link>
          <Link href="/dashboard/profile" className="block px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>
            {t("header.editAccount", "Edit account")}
          </Link>
          <button
            type="button"
            className="w-full px-3 py-2 text-start text-sm text-red-600 hover:bg-neutral-50"
            onClick={async () => {
              setOpen(false);
              try {
                await fetch("/api/auth/clear-session", { method: "POST", credentials: "include" });
              } catch {
                /* ignore */
              }
              signOut({ callbackUrl: "/" });
            }}
          >
            {t("header.logout", "Log out")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Header({
  platformName,
  headerLogoUrl,
  facebookUrl,
}: {
  platformName?: string | null;
  headerLogoUrl?: string | null;
  facebookUrl?: string | null;
}) {
  const { data: session, status } = useSession();
  const t = useT();
  const displayName = platformName?.trim() || "urbnit studio";
  const logoUrl = resolveHeaderLogoUrl(headerLogoUrl);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={displayName}
            className="h-14 w-auto max-w-[min(280px,55vw)] shrink-0 object-contain object-start sm:h-16 sm:max-w-[320px]"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/courses" className="text-sm font-medium text-neutral-800 hover:text-[#0066FF]">
            {t("common.courses", "Courses")}
          </Link>
          <Link href="/packs" className="text-sm font-medium text-neutral-800 hover:text-[#0066FF]">
            {t("common.packs", "Packs")}
          </Link>
          {facebookUrl ? (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-neutral-800 hover:text-[#0066FF]"
            >
              {t("common.facebook", "Facebook")}
            </a>
          ) : null}
          <Link href="/about" className="text-sm font-medium text-neutral-800 hover:text-[#0066FF]">
            {t("common.about", "About")}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageToggle />
          {status === "loading" ? (
            <span className="text-sm text-neutral-400">...</span>
          ) : session ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-[#0066FF]"
            >
              {t("header.signIn", "Sign In")}
            </Link>
          )}
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t border-neutral-100 px-4 py-2 md:hidden">
        <Link href="/courses" className="whitespace-nowrap text-sm font-medium text-neutral-800">
          {t("common.courses", "Courses")}
        </Link>
        <Link href="/packs" className="whitespace-nowrap text-sm font-medium text-neutral-800">
          {t("common.packs", "Packs")}
        </Link>
        {facebookUrl ? (
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-sm font-medium text-neutral-800">
            {t("common.facebook", "Facebook")}
          </a>
        ) : null}
        <Link href="/about" className="whitespace-nowrap text-sm font-medium text-neutral-800">
          {t("common.about", "About")}
        </Link>
      </nav>

      <PlatformSubscriptionBanner />
    </header>
  );
}
