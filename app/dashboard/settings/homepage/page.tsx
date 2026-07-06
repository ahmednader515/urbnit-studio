import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UrbnitHomepageSettingsForm } from "./UrbnitHomepageSettingsForm";
import { getHomepageSettings } from "@/lib/db";
import { getServerTranslator } from "@/lib/i18n/server";

export default async function DashboardHomepageSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT_ADMIN") redirect("/dashboard");
  const t = await getServerTranslator();
  const settings = await getHomepageSettings();

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-foreground)]">
        {t("dashboardNav.homepageSettings", "Homepage settings")}
      </h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        {t(
          "dashboard.homepageSettingsDescription",
          "Update homepage visuals and text in both Arabic and English.",
        )}
      </p>
      <UrbnitHomepageSettingsForm initialSettings={settings} />
    </div>
  );
}
