import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { getTermsContent } from "@/lib/legal/content";
import { getLocaleFromCookie } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  const { title } = getTermsContent(locale);
  return { title };
}

export default async function TermsPage() {
  const locale = await getLocaleFromCookie();
  const { title, body } = getTermsContent(locale);

  return <LegalPageLayout title={title} body={body} />;
}
