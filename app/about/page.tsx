import { getHomepageSettings } from "@/lib/db";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { pickLocalizedText } from "@/lib/i18n/localized-field";

export default async function AboutPage() {
  const [settings, locale] = await Promise.all([getHomepageSettings().catch(() => null), getLocaleFromCookie()]);
  const title = pickLocalizedText(locale, settings?.aboutTitle, settings?.aboutTitleEn) || "About";
  const body = pickLocalizedText(locale, settings?.aboutBody, settings?.aboutBodyEn) || "";

  return (
    <section className="bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-neutral-900">{title}</h1>
        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-lg leading-relaxed text-neutral-600">
          {body}
        </div>
      </div>
    </section>
  );
}
