import { getServerTranslator } from "@/lib/i18n/server";

export default async function DashboardLoading() {
  const t = await getServerTranslator();
  const label = t("common.loading", "Loading");

  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-xl border border-neutral-200 bg-white p-12"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#0066FF]"
        aria-hidden
      />
      <p className="text-neutral-600">{label}</p>
      <p className="text-sm text-neutral-500">{t("common.pleaseWait", "Please wait...")}</p>
    </div>
  );
}
