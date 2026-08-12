import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { getPrivacyContent } from "@/lib/legal/content";
import { getLocaleFromCookie } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  const { title } = getPrivacyContent(locale);
  return { title };
}

export default async function PrivacyPage() {
  const locale = await getLocaleFromCookie();
  const { title, body } = getPrivacyContent(locale);

  return <LegalPageLayout title={title} body={body} />;
}
