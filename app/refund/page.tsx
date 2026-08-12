import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { getRefundContent } from "@/lib/legal/content";
import { getLocaleFromCookie } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookie();
  const { title } = getRefundContent(locale);
  return { title };
}

export default async function RefundPage() {
  const locale = await getLocaleFromCookie();
  const { title, body } = getRefundContent(locale);

  return <LegalPageLayout title={title} body={body} />;
}
